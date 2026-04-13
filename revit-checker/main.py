#!/usr/bin/env python3
"""
Revit Version Checker — Sprinkler Design NZ
Reads Revit file version from the binary header without opening Revit.
"""

import tkinter as tk
from tkinter import filedialog, messagebox
import ctypes
import sys
import re
from pathlib import Path

# ─── Optional: drag-and-drop ──────────────────────────────────────────────────
try:
    from tkinterdnd2 import TkinterDnD, DND_FILES
    _DND = True
except ImportError:
    _DND = False

# ─── Optional: Windows registry ───────────────────────────────────────────────
try:
    import winreg
    _WINREG = True
except ImportError:
    _WINREG = False

# ─── Optional: Pillow for logo transparency ───────────────────────────────────
try:
    from PIL import Image, ImageTk
    _PIL = True
except ImportError:
    _PIL = False

# ─── Brand ────────────────────────────────────────────────────────────────────
BG       = "#0a0f1e"
CARD     = "#0f1629"
SURFACE  = "#1a2540"
GREEN    = "#4ade80"
GREEN_DK = "#16a34a"
TEXT     = "#f8fafc"
MUTED    = "#64748b"
RED      = "#f87171"
AMBER    = "#fbbf24"

REVIT_EXTS = {'.rvt', '.rfa', '.rte', '.rft'}


# ─── Version detection ────────────────────────────────────────────────────────

def detect_version(filepath):
    """
    Parse Revit BasicFileInfo from binary. Returns (info_dict, error_str).
    Revit stores key:value pairs separated by \\r\\n OR null bytes in UTF-16LE.
    """
    try:
        path = Path(filepath)
        if not path.exists():
            return None, "File not found."
        if path.suffix.lower() not in REVIT_EXTS:
            return None, f"Not a Revit file (expected {', '.join(sorted(REVIT_EXTS))})"

        with open(filepath, 'rb') as f:
            data = f.read(4 * 1024 * 1024)

        # ── UTF-16LE (Revit 2009+) ─────────────────────────────────────────────
        needle = "Autodesk Revit".encode('utf-16-le')
        idx = data.find(needle)
        if idx != -1:
            chunk = data[idx:idx + 1024]
            text  = chunk.decode('utf-16-le', errors='ignore')
            # Revit separates fields with \r\n *or* null bytes (\x00) — split both
            lines = [l.strip() for l in re.split(r'[\r\n\x00]+', text) if l.strip()]
            info  = {}
            # First line is always the version string: "Autodesk Revit YYYY"
            if lines:
                info['version'] = clean_str(lines[0])
            # Remaining lines are "Key: Value" pairs
            for line in lines[1:20]:
                line = clean_str(line)
                if ':' in line:
                    k, _, v = line.partition(':')
                    info[k.strip().lower()] = v.strip()
            return info, None

        # ── ASCII fallback (pre-2009) ──────────────────────────────────────────
        m = re.search(rb'Autodesk Revit[^\x00\r\n]{0,80}', data)
        if m:
            return {'version': m.group().decode('ascii', errors='ignore').strip()}, None

        return None, "Version info not found — file may be unsupported or corrupted."

    except PermissionError:
        return None, "Permission denied."
    except OSError as e:
        return None, f"Cannot read file: {e}"
    except Exception as e:
        return None, str(e)


def clean_str(s):
    """Strip control/non-printable characters from a parsed string."""
    return re.sub(r'[\x00-\x1f\x7f-\x9f]+', ' ', s).strip()


def year_from_version(s):
    m = re.search(r'\b(19|20)\d{2}\b', s)
    return int(m.group()) if m else None


# ─── Registry / context menu ──────────────────────────────────────────────────

def get_exe_path():
    if getattr(sys, 'frozen', False):
        return sys.executable
    return str(Path(__file__).resolve())


def get_progid(ext):
    """Return the ProgID registered for a file extension, or None."""
    if not _WINREG:
        return None
    for root, key_path in [
        (winreg.HKEY_CURRENT_USER, f'Software\\Classes\\{ext}'),
        (winreg.HKEY_CLASSES_ROOT, ext),
    ]:
        try:
            with winreg.OpenKey(root, key_path) as k:
                val = winreg.QueryValue(k, '')
                if val and val.strip():
                    return val.strip()
        except OSError:
            pass
    return None


def refresh_explorer():
    """Tell Windows Explorer to reload shell associations immediately."""
    try:
        SHCNE_ASSOCCHANGED = 0x08000000
        SHCNF_IDLIST       = 0x0000
        ctypes.windll.shell32.SHChangeNotify(SHCNE_ASSOCCHANGED, SHCNF_IDLIST, None, None)
    except Exception:
        pass


def is_installed():
    if not _WINREG:
        return False
    progid = get_progid('.rvt')
    checks = ['Software\\Classes\\.rvt\\shell\\CheckRevitVersion']
    if progid:
        checks.append(f'Software\\Classes\\{progid}\\shell\\CheckRevitVersion')
    for path in checks:
        try:
            winreg.CloseKey(winreg.OpenKey(winreg.HKEY_CURRENT_USER, path))
            return True
        except OSError:
            pass
    return False


def install_menu():
    if not _WINREG:
        return False, "Registry access not available."
    exe    = get_exe_path()
    errors = []
    for ext in sorted(REVIT_EXTS):
        progid  = get_progid(ext)
        targets = [f'Software\\Classes\\{ext}\\shell\\CheckRevitVersion']
        if progid:
            targets.append(f'Software\\Classes\\{progid}\\shell\\CheckRevitVersion')
        for base in targets:
            try:
                with winreg.CreateKey(winreg.HKEY_CURRENT_USER, base) as k:
                    winreg.SetValue(k, '', winreg.REG_SZ, 'Check Revit Version')
                    winreg.SetValueEx(k, 'Icon', 0, winreg.REG_SZ, f'"{exe}",0')
                with winreg.CreateKey(winreg.HKEY_CURRENT_USER, base + '\\command') as k:
                    winreg.SetValue(k, '', winreg.REG_SZ, f'"{exe}" "%1"')
            except Exception as e:
                errors.append(str(e))
    refresh_explorer()   # flush Explorer cache immediately
    if errors:
        return False, 'Some entries failed:\n' + '\n'.join(errors[:3])
    return True, f'Context menu installed for {len(REVIT_EXTS)} file types.'


def uninstall_menu():
    if not _WINREG:
        return False, "Registry access not available."
    for ext in REVIT_EXTS:
        progid = get_progid(ext)
        paths  = [f'Software\\Classes\\{ext}\\shell\\CheckRevitVersion']
        if progid:
            paths.append(f'Software\\Classes\\{progid}\\shell\\CheckRevitVersion')
        for path in paths:
            for sub in ('\\command', ''):
                try:
                    winreg.DeleteKey(winreg.HKEY_CURRENT_USER, path + sub)
                except OSError:
                    pass
    refresh_explorer()
    return True, 'Context menu removed.'


# ─── Setup Dialog ─────────────────────────────────────────────────────────────

class SetupDialog(tk.Toplevel):
    def __init__(self, parent):
        super().__init__(parent)
        self.title("Context Menu Setup")
        self.geometry("460x360")
        self.resizable(False, False)
        self.configure(bg=BG)
        self.transient(parent)
        self.grab_set()
        self.update_idletasks()
        px = parent.winfo_x() + (parent.winfo_width()  - 460) // 2
        py = parent.winfo_y() + (parent.winfo_height() - 360) // 2
        self.geometry(f"460x360+{px}+{py}")
        self._build()
        self._refresh()

    def _build(self):
        hdr = tk.Frame(self, bg=CARD, height=54)
        hdr.pack(fill='x')
        hdr.pack_propagate(False)
        tk.Label(hdr, text="Context Menu Setup",
                 font=('Segoe UI', 12, 'bold'), fg=TEXT, bg=CARD,
                 padx=20).pack(side='left', fill='y')
        tk.Frame(self, bg=GREEN, height=2).pack(fill='x')

        body = tk.Frame(self, bg=BG)
        body.pack(fill='both', expand=True, padx=24, pady=16)

        # ── Status ────────────────────────────────────────────────────────────
        row = tk.Frame(body, bg=BG)
        row.pack(fill='x', pady=(0, 12))
        tk.Label(row, text="Status:", font=('Segoe UI', 10),
                 fg=MUTED, bg=BG).pack(side='left')
        self._dot = tk.Label(row, text="  ●  ", font=('Segoe UI', 14),
                              fg=MUTED, bg=BG)
        self._dot.pack(side='left')
        self._lbl = tk.Label(row, text="",
                              font=('Segoe UI', 10, 'bold'), fg=MUTED, bg=BG)
        self._lbl.pack(side='left')

        # ── Info rows ─────────────────────────────────────────────────────────
        info_frame = tk.Frame(body, bg=SURFACE)
        info_frame.pack(fill='x', pady=(0, 14))

        exe    = get_exe_path()
        progid = get_progid('.rvt') or "not found"

        for label, value in [("Exe path", exe), (".rvt ProgID", progid)]:
            r = tk.Frame(info_frame, bg=SURFACE)
            r.pack(fill='x', padx=12, pady=4)
            tk.Label(r, text=f"{label}:", font=('Segoe UI', 8),
                     fg=MUTED, bg=SURFACE, width=10, anchor='w').pack(side='left')
            tk.Label(r, text=value, font=('Segoe UI', 8),
                     fg=TEXT, bg=SURFACE, anchor='w',
                     wraplength=340, justify='left').pack(side='left', fill='x')

        tk.Label(body,
                 text='Adds "Check Revit Version" to Windows Explorer right-click\n'
                      'for .rvt  .rfa  .rte  .rft  —  no admin rights needed.',
                 font=('Segoe UI', 9), fg=MUTED, bg=BG, justify='left'
                 ).pack(anchor='w', pady=(0, 14))

        # ── Buttons ───────────────────────────────────────────────────────────
        self._install_btn = tk.Button(
            body, text="  Install Context Menu  ",
            font=('Segoe UI', 10, 'bold'), fg=BG, bg=GREEN,
            activebackground=GREEN_DK, activeforeground=BG,
            relief='flat', bd=0, pady=10, cursor='hand2',
            command=self._do_install
        )
        self._install_btn.pack(fill='x', pady=(0, 8))

        tk.Button(
            body, text="  Uninstall  ",
            font=('Segoe UI', 10), fg=MUTED, bg=SURFACE,
            activebackground=BG, activeforeground=TEXT,
            relief='flat', bd=0, pady=10, cursor='hand2',
            command=self._do_uninstall
        ).pack(fill='x')

    def _refresh(self):
        installed = is_installed()
        if installed:
            self._dot.config(fg=GREEN)
            self._lbl.config(text="Installed", fg=GREEN)
            self._install_btn.config(text="  Reinstall / Update  ")
        else:
            self._dot.config(fg=MUTED)
            self._lbl.config(text="Not installed", fg=MUTED)
            self._install_btn.config(text="  Install Context Menu  ")

    def _do_install(self):
        ok, msg = install_menu()
        self._refresh()
        if ok:
            messagebox.showinfo("Installed",
                                msg + "\n\nExplorer has been refreshed.\n"
                                      "Right-click a .rvt file to try it.",
                                parent=self)
        else:
            messagebox.showerror("Error", msg, parent=self)

    def _do_uninstall(self):
        ok, msg = uninstall_menu()
        self._refresh()
        messagebox.showinfo("Done", msg, parent=self)


# ─── Main App ─────────────────────────────────────────────────────────────────

_BaseClass = TkinterDnD.Tk if _DND else tk.Tk


class App(_BaseClass):
    W, H = 520, 500

    def __init__(self, initial=None):
        super().__init__()
        self.title("Revit Version Checker")
        self.geometry(f"{self.W}x{self.H}")
        self.resizable(False, False)
        self.configure(bg=BG)
        self.update_idletasks()
        cx = (self.winfo_screenwidth()  - self.W) // 2
        cy = (self.winfo_screenheight() - self.H) // 2
        self.geometry(f"{self.W}x{self.H}+{cx}+{cy}")

        self._logo = self._load_logo()
        self._build_ui()

        if initial:
            self.after(80, lambda: self._run_check(initial))

    # ── Logo ──────────────────────────────────────────────────────────────────

    def _load_logo(self):
        candidates = [
            Path(getattr(sys, '_MEIPASS', '')),
            Path(__file__).parent,
            Path(__file__).parent.parent / 'public',
        ]
        for base in candidates:
            p = base / 'logo.png'
            if p.exists():
                if _PIL:
                    try:
                        img = Image.open(str(p)).convert('RGBA')
                        pix = img.load()
                        for iy in range(img.height):
                            for ix in range(img.width):
                                r, g, b, a = pix[ix, iy]
                                if r > 230 and g > 230 and b > 230:
                                    pix[ix, iy] = (r, g, b, 0)
                        ratio = 48 / img.height
                        img = img.resize((int(img.width * ratio), 48), Image.LANCZOS)
                        return ImageTk.PhotoImage(img)
                    except Exception:
                        pass
                try:
                    raw = tk.PhotoImage(file=str(p))
                    factor = max(1, raw.height() // 48)
                    return raw.subsample(factor, factor)
                except Exception:
                    pass
        return None

    # ── UI ────────────────────────────────────────────────────────────────────

    def _build_ui(self):
        # ── Header ────────────────────────────────────────────────────────────
        hdr = tk.Frame(self, bg=CARD, height=68)
        hdr.pack(fill='x')
        hdr.pack_propagate(False)

        left = tk.Frame(hdr, bg=CARD)
        left.pack(side='left', fill='y', padx=20, pady=10)
        if self._logo:
            tk.Label(left, image=self._logo, bg=CARD).pack(side='left', padx=(0, 12))
        txt = tk.Frame(left, bg=CARD)
        txt.pack(side='left', fill='y')
        tk.Label(txt, text="Revit Version Checker",
                 font=('Segoe UI', 13, 'bold'), fg=TEXT, bg=CARD).pack(anchor='w')
        tk.Label(txt, text="Sprinkler Design NZ",
                 font=('Segoe UI', 9), fg=GREEN, bg=CARD).pack(anchor='w')

        tk.Button(hdr, text="Setup  ⚙", font=('Segoe UI', 8),
                  fg=MUTED, bg=CARD, activebackground=SURFACE, activeforeground=TEXT,
                  relief='flat', bd=0, padx=12, pady=6, cursor='hand2',
                  command=lambda: SetupDialog(self)).pack(side='right', padx=14, pady=18)

        tk.Frame(self, bg=GREEN, height=2).pack(fill='x')

        # ── Body ──────────────────────────────────────────────────────────────
        self._body = tk.Frame(self, bg=BG)
        self._body.pack(fill='both', expand=True, padx=20, pady=20)

        # Drop zone
        self._drop_zone = tk.Frame(self._body, bg=SURFACE,
                                   highlightthickness=1, highlightbackground=MUTED)
        tk.Label(self._drop_zone, text="↓",
                 font=('Segoe UI', 32), fg=MUTED, bg=SURFACE).pack(pady=(28, 4))
        tk.Label(self._drop_zone,
                 text="Drop a Revit file here" if _DND else "Select a Revit file",
                 font=('Segoe UI', 12, 'bold'), fg=TEXT, bg=SURFACE).pack()
        tk.Label(self._drop_zone, text=".rvt  ·  .rfa  ·  .rte  ·  .rft",
                 font=('Segoe UI', 9), fg=MUTED, bg=SURFACE).pack(pady=(4, 14))
        tk.Button(self._drop_zone, text="  Browse…  ",
                  font=('Segoe UI', 9, 'bold'), fg=BG, bg=GREEN,
                  activebackground=GREEN_DK, activeforeground=BG,
                  relief='flat', bd=0, padx=14, pady=9, cursor='hand2',
                  command=self._browse).pack(pady=(0, 28))

        if _DND:
            self._register_dnd(self._drop_zone)

        self._drop_zone.pack(fill='x')

        # File bar (hidden until a file is checked)
        self._file_bar  = tk.Frame(self._body, bg=SURFACE)
        self._fname_lbl = tk.Label(self._file_bar, text="",
                                   font=('Segoe UI', 9), fg=TEXT, bg=SURFACE,
                                   anchor='w', padx=14, pady=9)
        self._fname_lbl.pack(side='left', fill='x', expand=True)
        tk.Button(self._file_bar, text="↩  Check another",
                  font=('Segoe UI', 8), fg=MUTED, bg=SURFACE,
                  activebackground=BG, activeforeground=TEXT,
                  relief='flat', bd=0, padx=12, pady=9, cursor='hand2',
                  command=self._reset).pack(side='right')

        # Result card (hidden until a file is checked)
        self._result_card  = tk.Frame(self._body, bg=CARD)
        self._result_inner = tk.Frame(self._result_card, bg=CARD)
        self._result_inner.pack(fill='both', expand=True, padx=24, pady=20)

    # ── DnD ───────────────────────────────────────────────────────────────────

    def _register_dnd(self, widget):
        try:
            widget.drop_target_register(DND_FILES)
            widget.dnd_bind('<<Drop>>', self._on_drop)
        except Exception:
            pass
        for child in widget.winfo_children():
            self._register_dnd(child)

    def _on_drop(self, event):
        path = event.data.strip()
        if path.startswith('{') and path.endswith('}'):
            path = path[1:-1]
        self._run_check(path)

    # ── Actions ───────────────────────────────────────────────────────────────

    def _browse(self):
        path = filedialog.askopenfilename(
            title="Select Revit File",
            filetypes=[("Revit Files", "*.rvt *.rfa *.rte *.rft"), ("All Files", "*.*")]
        )
        if path:
            self._run_check(path)

    def _run_check(self, filepath):
        info, error = detect_version(filepath)
        self._display(Path(filepath).name, info, error)

    def _display(self, filename, info, error):
        self._drop_zone.pack_forget()
        self._fname_lbl.config(text=filename)
        self._file_bar.pack(fill='x')

        for w in self._result_inner.winfo_children():
            w.destroy()
        self._result_card.pack(fill='both', expand=True, pady=(12, 0))

        if error:
            tk.Label(self._result_inner, text="✗",
                     font=('Segoe UI', 26), fg=RED, bg=CARD).pack(pady=(20, 4))
            tk.Label(self._result_inner, text=error,
                     font=('Segoe UI', 9), fg=RED, bg=CARD,
                     wraplength=440, justify='center').pack(pady=(0, 20))
            return

        version = info.get('version', 'Unknown')
        # Fall back to 'format' field if year not in version string (some builds omit it)
        year    = year_from_version(version) or year_from_version(info.get('format', '')) \
                  or year_from_version(info.get('build', ''))
        color   = GREEN if (year and year >= 2021) else (AMBER if year else TEXT)

        # ── Version title ──────────────────────────────────────────────────────
        tk.Label(self._result_inner, text=version,
                 font=('Segoe UI', 15, 'bold'), fg=color, bg=CARD,
                 anchor='w').pack(fill='x', pady=(0, 16))

        # ── Separator ─────────────────────────────────────────────────────────
        tk.Frame(self._result_inner, bg=SURFACE, height=1).pack(fill='x', pady=(0, 16))

        # ── Bullet list ───────────────────────────────────────────────────────
        worksharing_raw = info.get('worksharing', '')
        if worksharing_raw:
            ws_val = 'Disabled' if 'not' in worksharing_raw.lower() else 'Enabled'
        else:
            ws_val = None

        fields = [
            ("Revit Version",  str(year) if year else clean_str(version)),
            ("Build",          info.get('build')),
            ("Workshared",     ws_val),
            ("Format",         info.get('format')),
            ("Language",       info.get('language')),
        ]

        for label, value in fields:
            if not value:
                continue
            row = tk.Frame(self._result_inner, bg=CARD)
            row.pack(fill='x', pady=5)

            # Green bullet
            tk.Label(row, text="●", font=('Segoe UI', 8),
                     fg=GREEN, bg=CARD).pack(side='left', padx=(0, 10))

            # Key
            tk.Label(row, text=label,
                     font=('Segoe UI', 9), fg=MUTED, bg=CARD,
                     width=16, anchor='w').pack(side='left')

            # Value — highlight worksharing status
            val_color = TEXT
            if label == "Workshared":
                val_color = GREEN if value == 'Enabled' else MUTED

            tk.Label(row, text=value,
                     font=('Segoe UI', 9, 'bold'), fg=val_color, bg=CARD,
                     anchor='w').pack(side='left')

    def _reset(self):
        self._file_bar.pack_forget()
        self._result_card.pack_forget()
        self._drop_zone.pack(fill='x')


# ─── Entry ────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    initial = sys.argv[1] if len(sys.argv) > 1 else None
    App(initial).mainloop()
