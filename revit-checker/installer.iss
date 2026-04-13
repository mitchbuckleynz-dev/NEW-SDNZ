; ============================================================
;  Revit Version Checker — Inno Setup 6 Installer Script
;  Sprinkler Design NZ
; ============================================================

#define AppName      "Revit Version Checker"
#define AppVersion   "1.0.0"
#define AppPublisher "Sprinkler Design NZ"
#define AppURL       "https://sprinklerdesign.co.nz"
#define AppExeName   "RevitChecker.exe"

[Setup]
; Unique app ID — do NOT change after first release (used for upgrades)
AppId={{F3A29E8C-D5B7-4F1A-8E6C-2A9B7F3E5D8C}
AppName={#AppName}
AppVersion={#AppVersion}
AppVerName={#AppName} {#AppVersion}
AppPublisher={#AppPublisher}
AppPublisherURL={#AppURL}
AppSupportURL={#AppURL}
AppUpdatesURL={#AppURL}

; Per-user install — no administrator rights required
PrivilegesRequired=lowest
DefaultDirName={localappdata}\Programs\Sprinkler Design NZ\Revit Version Checker
DefaultGroupName=Sprinkler Design NZ
AllowNoIcons=yes

; Output
OutputDir=installer_output
OutputBaseFilename=RevitChecker_v{#AppVersion}_Setup
SetupIconFile=icon.ico

; Compression
Compression=lzma2/ultra64
SolidCompression=yes

; Appearance
WizardStyle=modern
WizardSizePercent=110
ShowLanguageDialog=no

; Uninstaller
UninstallDisplayName={#AppName}
UninstallDisplayIcon={app}\{#AppExeName}

; Windows 10+ only
MinVersion=10.0

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; \
  Description: "{cm:CreateDesktopIcon}"; \
  GroupDescription: "{cm:AdditionalIcons}"; \
  Flags: unchecked

Name: "contextmenu"; \
  Description: "Add ""Check Revit Version"" to Windows Explorer right-click menu"; \
  GroupDescription: "Windows Explorer Integration:"; \
  Flags: checked

[Files]
Source: "dist\{#AppExeName}"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
; Start menu
Name: "{userprograms}\Sprinkler Design NZ\{#AppName}"; \
  Filename: "{app}\{#AppExeName}"; \
  IconFilename: "{app}\{#AppExeName}"

Name: "{userprograms}\Sprinkler Design NZ\Uninstall {#AppName}"; \
  Filename: "{uninstallexe}"

; Optional desktop shortcut
Name: "{userdesktop}\{#AppName}"; \
  Filename: "{app}\{#AppExeName}"; \
  Tasks: desktopicon

[Run]
Filename: "{app}\{#AppExeName}"; \
  Description: "{cm:LaunchProgram,{#StringChange(AppName, '&', '&&')}}"; \
  Flags: nowait postinstall skipifsilent

; ============================================================
;  Pascal Script — ProgID-aware context menu registration
;  Detects the Revit ProgID at install time so the right-click
;  entry appears correctly whether Revit is installed or not.
; ============================================================
[Code]

{ ── Helper: look up the ProgID registered for a file extension ── }
function GetProgID(Ext: string): string;
var
  Value: string;
begin
  Result := '';
  if RegQueryStringValue(HKEY_CURRENT_USER,
      'Software\Classes\' + Ext, '', Value) and (Value <> '') then
    Result := Value
  else if RegQueryStringValue(HKEY_CLASSES_ROOT,
      Ext, '', Value) and (Value <> '') then
    Result := Value;
end;

{ ── Register context menu for one extension ── }
procedure RegisterExt(Ext, AppPath: string);
var
  ProgID: string;
  KeyBase: string;
begin
  { Always write to the extension key as a fallback }
  KeyBase := 'Software\Classes\' + Ext + '\shell\CheckRevitVersion';
  RegWriteStringValue(HKEY_CURRENT_USER, KeyBase, '',      'Check Revit Version');
  RegWriteStringValue(HKEY_CURRENT_USER, KeyBase, 'Icon',  '"' + AppPath + '",0');
  RegWriteStringValue(HKEY_CURRENT_USER, KeyBase + '\command', '',
    '"' + AppPath + '" "%1"');

  { Also write to the ProgID — this is what Windows reads when Revit is installed }
  ProgID := GetProgID(Ext);
  if ProgID <> '' then
  begin
    KeyBase := 'Software\Classes\' + ProgID + '\shell\CheckRevitVersion';
    RegWriteStringValue(HKEY_CURRENT_USER, KeyBase, '',      'Check Revit Version');
    RegWriteStringValue(HKEY_CURRENT_USER, KeyBase, 'Icon',  '"' + AppPath + '",0');
    RegWriteStringValue(HKEY_CURRENT_USER, KeyBase + '\command', '',
      '"' + AppPath + '" "%1"');
  end;
end;

{ ── Unregister context menu for one extension ── }
procedure UnregisterExt(Ext: string);
var
  ProgID: string;
begin
  RegDeleteKeyIncludingSubkeys(HKEY_CURRENT_USER,
    'Software\Classes\' + Ext + '\shell\CheckRevitVersion');

  ProgID := GetProgID(Ext);
  if ProgID <> '' then
    RegDeleteKeyIncludingSubkeys(HKEY_CURRENT_USER,
      'Software\Classes\' + ProgID + '\shell\CheckRevitVersion');
end;

{ ── Called after files are installed ── }
procedure CurStepChanged(CurStep: TSetupStep);
var
  AppPath: string;
begin
  if CurStep = ssPostInstall then
  begin
    if WizardIsTaskSelected('contextmenu') then
    begin
      AppPath := ExpandConstant('{app}\{#AppExeName}');
      RegisterExt('.rvt', AppPath);
      RegisterExt('.rfa', AppPath);
      RegisterExt('.rte', AppPath);
      RegisterExt('.rft', AppPath);
    end;
  end;
end;

{ ── Called during uninstall ── }
procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
begin
  if CurUninstallStep = usPostUninstall then
  begin
    UnregisterExt('.rvt');
    UnregisterExt('.rfa');
    UnregisterExt('.rte');
    UnregisterExt('.rft');
  end;
end;
