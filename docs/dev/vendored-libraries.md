# Vendored libraries

Primora links against two third-party assemblies that are **not** available on NuGet. They live in
the repository under `PrimoraApp/libs/` and are referenced by path from `PrimoraApp/Primora.csproj`:

| Assembly | Path | Used for |
|---|---|---|
| `FakerInputWrapper.dll` | `PrimoraApp/libs/<arch>/FakerInputWrapper/` | Managed wrapper over the [FakerInput](https://github.com/Ryochan7/FakerInput) virtual HID driver. Backs the `FakerInput` keyboard/mouse output mode in `PrimoraControl/OutputKBM/`. |
| `FakerInputDll.dll` | `PrimoraApp/libs/<arch>/FakerInputWrapper/` | Native half of the above. Copied to the output directory at build time. |
| `SharpOSC.dll` | `PrimoraApp/libs/<arch>/SharpOSC/` | [SharpOSC](https://github.com/ValdemarOrn/SharpOSC) Open Sound Control client/server. Backs the OSC listener and sender in `PrimoraControl/ControlService.cs`. |

`<arch>` is `x64` or `x86`; both platforms need their own copy, matching the `Platforms` values in
`Primora.csproj`.

## These files must be committed

They are **build inputs**, not build outputs. A clean clone that lacks them cannot compile — the
compiler reports 14 `CS0246` errors across `ControlService.cs`, `FakerInputHandler.cs` and
`FakerInputMapping.cs` that give no hint about the real cause.

This is not hypothetical. A blanket `*.dll` rule in `.gitignore` silently excluded the whole
`libs/` tree, so **every** `.NET Release` workflow run failed — v1.0.0, v1.0.1, v2.0.0 and
v2.0.0-web all produced no artifacts. The releases on GitHub were built and uploaded by hand from a
developer machine, where `libs/` existed locally but untracked. `.gitignore` now carries explicit
negations to keep this tree in source control:

```gitignore
!PrimoraApp/libs/**/*.dll
!PrimoraApp/libs/**/*.exe
```

To guard against a silent regression, `Primora.csproj` runs a `VerifyVendoredLibraries` target
before assembly resolution. A missing file now fails immediately with error `PRIMORA001` and a
message pointing here, instead of a wall of `CS0246`.

## Provenance of the committed x64 files

The x64 assemblies in this repository were recovered from Primora's own published
`Primora-2.0.0-x64.msi`, because they existed nowhere else — not on NuGet, and not in any commit.
The MSI's cabinet holds a self-contained single-file `Primora.exe`, whose .NET bundle embeds every
managed and native dependency; the three files were extracted from that bundle and verified by
compiling the application against them, which resolves every type and signature the source expects.

They therefore match exactly what v2.0.0 shipped. If you have a newer local build, prefer yours and
overwrite them.

**x86 is still missing.** Only an x64 MSI was ever published, so there is no x86 copy to recover and
the x86 build leg still fails with `PRIMORA001`. Either drop x86 from the build matrix or add x86
builds of these two libraries.

## Restoring the files

If your working copy is missing `libs/`, get the assemblies from a machine that has a working build,
or rebuild them from the upstream projects linked in the table, and place them as:

```
PrimoraApp/libs/x64/FakerInputWrapper/FakerInputWrapper.dll
PrimoraApp/libs/x64/FakerInputWrapper/FakerInputDll.dll
PrimoraApp/libs/x64/SharpOSC/SharpOSC.dll
PrimoraApp/libs/x86/FakerInputWrapper/FakerInputWrapper.dll
PrimoraApp/libs/x86/FakerInputWrapper/FakerInputDll.dll
PrimoraApp/libs/x86/SharpOSC/SharpOSC.dll
```

Then commit them. Because the negation rules are narrower than the surrounding ignore rules, a plain
`git add PrimoraApp/libs` is enough — no `-f` needed.

## Licensing

Primora ships these assemblies inside a GPL-3.0 distribution, so each one's upstream licence needs to
be confirmed against its repository and recorded before the next release. Neither is listed in
`NOTICE.txt` yet — add both, with their licence and origin, and keep the upstream licence text
alongside the binaries in `libs/`.
