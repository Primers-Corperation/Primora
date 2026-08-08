# Release process

Publishing a GitHub release runs `.github/workflows/release.yml`, which builds and attaches
everything the website distributes.

## What a release produces

| Asset | Built by | Purpose |
|---|---|---|
| `Primora-<version>-Setup.exe` | `scripts/Build-MSI.ps1` (Burn bundle) | Recommended download. Installs the .NET 8 Desktop Runtime, VC++ redistributable and ViGEmBus, then the MSI. |
| `Primora-<version>-x64.msi` | `scripts/Build-MSI.ps1` | Standalone MSI for advanced/enterprise use. Assumes prerequisites are present. |
| `Primora-Setup.exe` | copy of the above | Stable name, so `releases/latest/download/Primora-Setup.exe` always resolves. |
| `Primora-x64.msi` | copy of the above | Stable name, same reason. |
| `Primora_<version>_x64.zip` | `dotnet publish` | Portable build. |
| `Primora_<version>_x86.zip` | `dotnet publish` | Portable build. |

Before this, the workflow only ever produced the two zips, and every run of it had failed, so
each release was built and uploaded by hand.

## Building locally

One command, same script CI uses:

```powershell
.\scripts\Build-MSI.ps1                      # publishes and builds, version 2.0.0
.\scripts\Build-MSI.ps1 -Version 2.1.0       # different version
.\scripts\Build-MSI.ps1 -SkipBootstrapper    # MSI only
```

It installs WiX 5 and the required extensions if they are missing, publishes the app into
`build\publish`, generates the branding assets, and writes the installers to `dist\`.

## Testing the pipeline without cutting a release

The workflow accepts `workflow_dispatch` with a version input. It builds every asset and uploads
them as workflow artifacts, and only attaches assets to a release when the trigger was an actual
release publish. Use this to verify installer changes before tagging.

## How the payload is assembled

`PrimoraInstaller/Files.wxs` harvests the whole `dotnet publish` output with a single
`<Files Include="$(PublishDir)\**" />`. It does not enumerate files, so adding or removing a
dependency needs no installer change.

This replaced a hand-written list of seven files that was wrong in both directions — it omitted
all 38 dependency assemblies and the 11 localized satellite folders, and it named five XML files
that publish never produces because Primora writes them into `%AppData%` at runtime.

The app is published **framework-dependent**. The bundle already installs the .NET 8 Desktop
Runtime as a prerequisite, so a self-contained build would ship a second copy of the runtime
inside the MSI for no benefit.

## Pending: point the website at the stable asset name

`vercel.json` currently hardcodes the version:

```json
"destination": "https://github.com/Primers-Corperation/Primora/releases/download/v2.0.0/Primora-2.0.0-Setup.exe"
```

That URL has to be edited by hand for every release, and the site's download button 404s if
anyone forgets. Once the first release built by this workflow has published — so that
`Primora-Setup.exe` exists as an asset — change the destination to:

```
https://github.com/Primers-Corperation/Primora/releases/latest/download/Primora-Setup.exe
```

after which it never needs touching again. Do not make this change before that release exists,
or the download button breaks immediately.

Note there are **two** copies of this redirect, `vercel.json` at the repo root and
`PrimoraWebsite/vercel.json`. Only the one under the project's configured Root Directory is
applied — the Vercel project reports framework `vite`, which points at `PrimoraWebsite`. Update
both, or delete the unused one once you have confirmed which is live.

## Website deployment is not wired to this repository

Pushing to `Primers-Corperation/Primora` does **not** deploy the website. Checked against the
Vercel API on 2026-08-08:

- The `primora-website` project's Git integration points at **`Primers-Corperation/primers-sform`**,
  a different application. Its git-triggered deployments carry
  `githubRepo: primers-sform`.
- Every deployment that actually contains this site was pushed **from a developer machine with the
  Vercel CLI** (`gitDirty: 1`, no `githubRepo`), most recently `feat: add /privacy page`.
- Two production deployments on 2026-04-22 came straight from `primers-sform/master`. A push to
  that unrelated repository can therefore overwrite `primora-website.vercel.app`.

Until the project is relinked to this repository, website changes ship only when someone runs a
manual CLI deploy, and the live site is exposed to an unrelated repo's pushes.

There is also a second, dead `primora` project on the same Vercel team. It is linked to the private
personal repo `Jothankato05/primora`, and every production deployment has failed since March 2026
(`src/App.tsx(1,1): error TS6133: 'React' is declared but its value is never read`). That error does
not exist in this repository's website, which builds clean. The project can be deleted.

## Cloud sync backend is paused

The Supabase project `primora-backend` (`farajftfguxubminfsff`, via the Vercel Marketplace) was
auto-paused after 7 days of inactivity on 2026-04-15, and Supabase warned on 2026-07-08 that it is
scheduled to be **permanently frozen**. Cloud sync and the marketplace will not work against it
regardless of how `SupabaseConfig` is configured, so it needs restoring or recreating before those
features are switched on. This is why `CloudSyncService` fails soft rather than throwing.
