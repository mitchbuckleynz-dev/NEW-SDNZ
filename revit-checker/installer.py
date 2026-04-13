#!/usr/bin/env python3
"""
Revit Version Checker — Installer / Uninstaller
Sprinkler Design NZ

Run normally  → install wizard
Run with --uninstall → silent uninstaller (called by Add/Remove Programs)
"""

import tkinter as tk
from tkinter import filedialog, messagebox
import sys, os, re, shutil, subprocess, winreg, ctypes
from pathlib import Path

# ── PIL ────────────────────────────────────────────────────────────────────────
try:
    from PIL import Image, ImageTk
    _PIL = True
except ImportError:
    _PIL = False

# ── Brand ──────────────────────────────────────────────────────────────────────
BG       = "#0a0f1e"
CARD     = "#0f1629"
SURFACE  = "#1a2540"
GREEN    = "#4ade80"
GREEN_DK = "#16a34a"
TEXT     = "#f8fafc"
MUTED    = "#64748b"
RED      = "#f87171"

APP_NAME    = "Revit Version Checker"
PUBLISHER   = "Sprinkler Design NZ"
APP_VERSION = "1.0.0"
APP_ID      = "RevitVersionChecker_SDNZ"
APP_EXE     = "RevitChecker.exe"


# ── Paths ──────────────────────────────────────────────────────────────────────

def default_install_dir() -> Path:
    base = os.environ.get("LOCALAPPDATA", str(Path.home()))
    return Path(base) / "Programs" / "Sprinkler Design NZ" / "Revit Version Checker"

def start_menu_dir() -> Path:
    appdata = os.environ.get("APPDATA", str(Path.home()))
    return Path(appdata) / "Microsoft" / "Windows" / "Start Menu" / "Programs" / "Sprinkler Design NZ"

def desktop_dir() -> Path:
    return Path(os.environ.get("USERPROFILE", str(Path.home()))) / "Desktop"

def bundled_exe() -> Path:
    """Path to RevitChecker.exe in the PyInstaller bundle."""
    base = Path(getattr(sys, "_MEIPASS", Path(__file__).parent))
    return base / APP_EXE


# ── Shortcut creation (via PowerShell WScript.Shell COM) ──────────────────────

def create_shortcut(target: Path, shortcut: Path, description: str = ""):
    ps = (
        f'$s=(New-Object -COM WScript.Shell).CreateShortcut("{shortcut}");'
        f'$s.TargetPath="{target}";'
        f'$s.Description="{description}";'
        f'$s.IconLocation="{target},0";'
        f'$s.Save()'
    )
    subprocess.run(
        ["powershell", "-NoProfile", "-NonInteractive", "-Command", ps],
        capture_output=True, timeout=15
    )

def delete_shortcut(shortcut: Path):
    try:
        shortcut.unlink(missing_ok=True)
    except Exception:
        pass


# ── Registry helpers ───────────────────────────────────────────────────────────

REVIT_EXTS = [".rvt", ".rfa", ".rte", ".rft"]

def get_progid(ext: str):
    for root, path in [
        (winreg.HKEY_CURRENT_USER, f"Software\\Classes\\{ext}"),
        (winreg.HKEY_CLASSES_ROOT, ext),
    ]:
        try:
            with winreg.OpenKey(root, path) as k:
                v = winreg.QueryValue(k, "")
                if v and v.strip():
                    return v.strip()
        except OSError:
            pass
    return None

def install_context_menu(exe: Path):
    for ext in REVIT_EXTS:
        progid = get_progid(ext)
        targets = [f"Software\\Classes\\{ext}\\shell\\CheckRevitVersion"]
        if progid:
            targets.append(f"Software\\Classes\\{progid}\\shell\\CheckRevitVersion")
        for base in targets:
            with winreg.CreateKey(winreg.HKEY_CURRENT_USER, base) as k:
                winreg.SetValue(k, "", winreg.REG_SZ, "Check Revit Version")
                winreg.SetValueEx(k, "Icon", 0, winreg.REG_SZ, f'"{exe}",0')
            with winreg.CreateKey(winreg.HKEY_CURRENT_USER, base + "\\command") as k:
                winreg.SetValue(k, "", winreg.REG_SZ, f'"{exe}" "%1"')
    _refresh_shell()

def uninstall_context_menu():
    for ext in REVIT_EXTS:
        progid = get_progid(ext)
        paths = [f"Software\\Classes\\{ext}\\shell\\CheckRevitVersion"]
        if progid:
            paths.append(f"Software\\Classes\\{progid}\\shell\\CheckRevitVersion")
        for path in paths:
            for sub in ("\\command", ""):
                try:
                    winreg.DeleteKey(winreg.HKEY_CURRENT_USER, path + sub)
                except OSError:
                    pass
    _refresh_shell()

def _refresh_shell():
    try:
        ctypes.windll.shell32.SHChangeNotify(0x08000000, 0x0000, None, None)
    except Exception:
        pass

def register_uninstaller(install_dir: Path):
    exe = install_dir / APP_EXE
    uninstall_cmd = f'"{exe}" --uninstall'
    key = f"Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\{APP_ID}"
    with winreg.CreateKey(winreg.HKEY_CURRENT_USER, key) as k:
        winreg.SetValueEx(k, "DisplayName",     0, winreg.REG_SZ,    APP_NAME)
        winreg.SetValueEx(k, "DisplayVersion",  0, winreg.REG_SZ,    APP_VERSION)
        winreg.SetValueEx(k, "Publisher",       0, winreg.REG_SZ,    PUBLISHER)
        winreg.SetValueEx(k, "InstallLocation", 0, winreg.REG_SZ,    str(install_dir))
        winreg.SetValueEx(k, "DisplayIcon",     0, winreg.REG_SZ,    f'"{exe}",0')
        winreg.SetValueEx(k, "UninstallString", 0, winreg.REG_SZ,    uninstall_cmd)
        winreg.SetValueEx(k, "NoModify",        0, winreg.REG_DWORD, 1)
        winreg.SetValueEx(k, "NoRepair",        0, winreg.REG_DWORD, 1)

def deregister_uninstaller():
    try:
        winreg.DeleteKey(winreg.HKEY_CURRENT_USER,
            f"Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\{APP_ID}")
    except OSError:
        pass

def get_install_dir_from_registry() -> Path | None:
    try:
        key = f"Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\{APP_ID}"
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, key) as k:
            val, _ = winreg.QueryValueEx(k, "InstallLocation")
            return Path(val)
    except OSError:
        return None


# ── Uninstall mode ─────────────────────────────────────────────────────────────

def do_uninstall():
    install_dir = get_install_dir_from_registry() or default_install_dir()

    uninstall_context_menu()
    deregister_uninstaller()

    # Remove shortcuts
    sm = start_menu_dir()
    delete_shortcut(sm / f"{APP_NAME}.lnk")
    delete_shortcut(desktop_dir() / f"{APP_NAME}.lnk")
    try:
        sm.rmdir()   # removes folder if empty
    except Exception:
        pass

    # Schedule removal of the install dir after process exits
    # (can't delete ourselves while running)
    bat = Path(os.environ.get("TEMP", "C:\\Temp")) / "_sdnz_uninstall.bat"
    bat.write_text(
        f'@echo off\n'
        f'ping -n 3 127.0.0.1 >nul\n'          # wait ~3 seconds
        f'rd /s /q "{install_dir}" 2>nul\n'
        f'del "%~f0"\n'
    )
    subprocess.Popen(["cmd", "/c", str(bat)], creationflags=0x08000000)  # CREATE_NO_WINDOW


# ── Logo loader ───────────────────────────────────────────────────────────────

def load_logo(height=48):
    candidates = [
        Path(getattr(sys, "_MEIPASS", "")),
        Path(__file__).parent,
        Path(__file__).parent.parent / "public",
    ]
    for base in candidates:
        p = base / "logo.png"
        if p.exists():
            if _PIL:
                try:
                    img = Image.open(str(p)).convert("RGBA")
                    pix = img.load()
                    for y in range(img.height):
                        for x in range(img.width):
                            r, g, b, a = pix[x, y]
                            if r > 230 and g > 230 and b > 230:
                                pix[x, y] = (r, g, b, 0)
                    ratio = height / img.height
                    img = img.resize((int(img.width * ratio), height), Image.LANCZOS)
                    return ImageTk.PhotoImage(img)
                except Exception:
                    pass
            try:
                raw = tk.PhotoImage(file=str(p))
                f = max(1, raw.height() // height)
                return raw.subsample(f, f)
            except Exception:
                pass
    return None


# ── Installer GUI ─────────────────────────────────────────────────────────────

class InstallerApp(tk.Tk):
    W, H = 520, 440

    def __init__(self):
        super().__init__()
        self.title(f"{APP_NAME} Setup")
        self.geometry(f"{self.W}x{self.H}")
        self.resizable(False, False)
        self.configure(bg=BG)
        self.update_idletasks()
        cx = (self.winfo_screenwidth()  - self.W) // 2
        cy = (self.winfo_screenheight() - self.H) // 2
        self.geometry(f"{self.W}x{self.H}+{cx}+{cy}")

        self._logo = load_logo(48)
        self._install_dir = tk.StringVar(value=str(default_install_dir()))
        self._desktop_var = tk.BooleanVar(value=False)
        self._menu_var    = tk.BooleanVar(value=True)

        self._build_header()
        tk.Frame(self, bg=GREEN, height=2).pack(fill="x")
        self._body = tk.Frame(self, bg=BG)
        self._body.pack(fill="both", expand=True)
        self._build_footer()

        self._show_welcome()

    # ── Header (persistent) ───────────────────────────────────────────────────

    def _build_header(self):
        hdr = tk.Frame(self, bg=CARD, height=68)
        hdr.pack(fill="x")
        hdr.pack_propagate(False)
        left = tk.Frame(hdr, bg=CARD)
        left.pack(side="left", fill="y", padx=20, pady=10)
        if self._logo:
            tk.Label(left, image=self._logo, bg=CARD).pack(side="left", padx=(0, 12))
        txt = tk.Frame(left, bg=CARD)
        txt.pack(side="left", fill="y")
        tk.Label(txt, text=f"{APP_NAME} Setup",
                 font=("Segoe UI", 13, "bold"), fg=TEXT, bg=CARD).pack(anchor="w")
        tk.Label(txt, text=PUBLISHER,
                 font=("Segoe UI", 9), fg=GREEN, bg=CARD).pack(anchor="w")

    # ── Footer with nav buttons (persistent) ─────────────────────────────────

    def _build_footer(self):
        foot = tk.Frame(self, bg=CARD, height=52)
        foot.pack(fill="x", side="bottom")
        foot.pack_propagate(False)
        tk.Frame(foot, bg=SURFACE, height=1).pack(fill="x")
        btn_frame = tk.Frame(foot, bg=CARD)
        btn_frame.pack(side="right", padx=20, pady=10)

        self._cancel_btn = tk.Button(btn_frame, text="Cancel",
            font=("Segoe UI", 9), fg=MUTED, bg=CARD,
            activebackground=SURFACE, activeforeground=TEXT,
            relief="flat", bd=0, padx=16, pady=6, cursor="hand2",
            command=self.destroy)
        self._cancel_btn.pack(side="left", padx=(0, 8))

        self._next_btn = tk.Button(btn_frame, text="Next  →",
            font=("Segoe UI", 9, "bold"), fg=BG, bg=GREEN,
            activebackground=GREEN_DK, activeforeground=BG,
            relief="flat", bd=0, padx=16, pady=6, cursor="hand2",
            command=self._on_next)
        self._next_btn.pack(side="left")

    def _clear_body(self):
        for w in self._body.winfo_children():
            w.destroy()

    def _pad(self, parent=None):
        return self._body if parent is None else parent

    # ── Page helpers ──────────────────────────────────────────────────────────

    def _section(self, title, subtitle=""):
        p = tk.Frame(self._body, bg=BG)
        p.pack(fill="both", expand=True, padx=32, pady=24)
        tk.Label(p, text=title, font=("Segoe UI", 14, "bold"),
                 fg=TEXT, bg=BG).pack(anchor="w")
        if subtitle:
            tk.Label(p, text=subtitle, font=("Segoe UI", 9),
                     fg=MUTED, bg=BG, wraplength=440, justify="left").pack(anchor="w", pady=(4, 0))
        tk.Frame(p, bg=SURFACE, height=1).pack(fill="x", pady=(12, 16))
        return p

    # ── Page 1: Welcome ───────────────────────────────────────────────────────

    def _show_welcome(self):
        self._page = "welcome"
        self._clear_body()
        p = self._section(
            f"Welcome to {APP_NAME} {APP_VERSION}",
            "This will install Revit Version Checker on your computer.\n"
            "Click Next to choose installation options."
        )
        for line in [
            "• Check Revit file versions without opening Revit",
            "• Supports  .rvt  .rfa  .rte  .rft  files",
            "• Optional Windows Explorer right-click integration",
            "• No administrator rights required",
        ]:
            tk.Label(p, text=line, font=("Segoe UI", 10),
                     fg=TEXT, bg=BG).pack(anchor="w", pady=3)

        self._next_btn.config(text="Next  →", state="normal")
        self._cancel_btn.config(state="normal")

    # ── Page 2: Options ───────────────────────────────────────────────────────

    def _show_options(self):
        self._page = "options"
        self._clear_body()
        p = self._section("Installation Options")

        # Install location
        tk.Label(p, text="Install location:", font=("Segoe UI", 9),
                 fg=MUTED, bg=BG).pack(anchor="w")
        dir_row = tk.Frame(p, bg=BG)
        dir_row.pack(fill="x", pady=(4, 16))
        tk.Entry(dir_row, textvariable=self._install_dir,
                 font=("Segoe UI", 9), bg=SURFACE, fg=TEXT,
                 insertbackground=TEXT, relief="flat",
                 bd=0, highlightthickness=1,
                 highlightbackground=MUTED).pack(side="left", fill="x", expand=True, ipady=6, padx=(0, 8))
        tk.Button(dir_row, text="Browse", font=("Segoe UI", 8),
                  fg=MUTED, bg=SURFACE, activebackground=BG,
                  relief="flat", bd=0, padx=10, pady=6, cursor="hand2",
                  command=self._browse_dir).pack(side="right")

        # Checkboxes
        for var, text in [
            (self._menu_var,    'Add "Check Revit Version" to right-click menu'),
            (self._desktop_var, "Create Desktop shortcut"),
        ]:
            row = tk.Frame(p, bg=BG)
            row.pack(fill="x", pady=5)
            cb = tk.Checkbutton(row, variable=var, bg=BG,
                                activebackground=BG, selectcolor=SURFACE,
                                fg=GREEN, cursor="hand2")
            cb.pack(side="left")
            tk.Label(row, text=text, font=("Segoe UI", 9),
                     fg=TEXT, bg=BG).pack(side="left")

        self._next_btn.config(text="Install")

    def _browse_dir(self):
        d = filedialog.askdirectory(title="Choose install folder")
        if d:
            self._install_dir.set(d)

    # ── Page 3: Installing ────────────────────────────────────────────────────

    def _show_installing(self):
        self._page = "installing"
        self._clear_body()
        p = self._section("Installing…")

        self._status_lbl = tk.Label(p, text="Preparing…",
            font=("Segoe UI", 9), fg=MUTED, bg=BG, anchor="w")
        self._status_lbl.pack(fill="x", pady=(0, 12))

        # Progress bar (manual, tkinter canvas)
        bar_bg = tk.Frame(p, bg=SURFACE, height=6)
        bar_bg.pack(fill="x")
        self._bar = tk.Frame(bar_bg, bg=GREEN, height=6, width=0)
        self._bar.place(x=0, y=0, relheight=1)
        self._bar_total = 456   # approx body width minus padding

        self._next_btn.config(state="disabled")
        self._cancel_btn.config(state="disabled")
        self.after(100, self._run_install)

    def _set_progress(self, pct: float, msg: str):
        self._status_lbl.config(text=msg)
        self._bar.config(width=int(self._bar_total * pct))
        self.update_idletasks()

    def _run_install(self):
        install_dir = Path(self._install_dir.get())
        try:
            self._set_progress(0.05, "Creating install directory…")
            install_dir.mkdir(parents=True, exist_ok=True)

            self._set_progress(0.20, f"Copying {APP_EXE}…")
            src = bundled_exe()
            if not src.exists():
                raise FileNotFoundError(f"Bundled exe not found at {src}")
            shutil.copy2(str(src), str(install_dir / APP_EXE))

            self._set_progress(0.45, "Creating Start menu shortcut…")
            sm = start_menu_dir()
            sm.mkdir(parents=True, exist_ok=True)
            create_shortcut(
                install_dir / APP_EXE,
                sm / f"{APP_NAME}.lnk",
                "Check Revit file version without opening Revit"
            )

            if self._desktop_var.get():
                self._set_progress(0.55, "Creating Desktop shortcut…")
                create_shortcut(
                    install_dir / APP_EXE,
                    desktop_dir() / f"{APP_NAME}.lnk"
                )

            if self._menu_var.get():
                self._set_progress(0.70, "Registering right-click menu…")
                install_context_menu(install_dir / APP_EXE)

            self._set_progress(0.85, "Registering with Windows…")
            register_uninstaller(install_dir)

            self._set_progress(1.0, "Installation complete.")
            self._show_finish(success=True)

        except Exception as e:
            self._set_progress(0.0, f"Error: {e}")
            self._next_btn.config(state="normal", text="Close")
            self._page = "error"

    # ── Page 4: Finish ────────────────────────────────────────────────────────

    def _show_finish(self, success=True):
        self._page = "finish"
        self._clear_body()
        p = self._section(
            "Installation Complete!" if success else "Installation Failed",
            f"{APP_NAME} has been installed successfully.\n"
            "You'll find it in the Start menu under Sprinkler Design NZ."
            if success else "An error occurred during installation."
        )
        if success:
            self._launch_var = tk.BooleanVar(value=True)
            row = tk.Frame(p, bg=BG)
            row.pack(fill="x", pady=8)
            tk.Checkbutton(row, variable=self._launch_var, bg=BG,
                           activebackground=BG, selectcolor=SURFACE,
                           fg=GREEN, cursor="hand2").pack(side="left")
            tk.Label(row, text=f"Launch {APP_NAME}", font=("Segoe UI", 9),
                     fg=TEXT, bg=BG).pack(side="left")

        self._next_btn.config(text="Finish", state="normal")
        self._cancel_btn.config(state="disabled")

    # ── Navigation ────────────────────────────────────────────────────────────

    def _on_next(self):
        if self._page == "welcome":
            self._show_options()
        elif self._page == "options":
            self._show_installing()
        elif self._page == "finish":
            if hasattr(self, "_launch_var") and self._launch_var.get():
                exe = Path(self._install_dir.get()) / APP_EXE
                if exe.exists():
                    subprocess.Popen([str(exe)], creationflags=0x08000000)
            self.destroy()
        elif self._page == "error":
            self.destroy()


# ── Entry ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if "--uninstall" in sys.argv:
        do_uninstall()
        sys.exit(0)

    InstallerApp().mainloop()
