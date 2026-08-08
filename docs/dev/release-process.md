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

### Relinking it

Either route works. Both need Vercel credentials, so this cannot be done from an agent session.

From a clone of this repository:

```bash
vercel login
vercel link --scope primers --project primora-website
vercel git disconnect        # drops the primers-sform connection
vercel git connect           # connects the origin of this clone
```

Or in the dashboard: **primers → primora-website → Settings → Git → Disconnect**, then **Connect Git
Repository → `Primers-Corperation/Primora`**.

**Then set Root Directory to `PrimoraWebsite`** under Settings → General. Without it the build runs
at the repo root, finds no Vite app, and every deployment fails. It also decides which of the two
`vercel.json` files applies — with the root directory set, `PrimoraWebsite/vercel.json` is live and
the copy at the repo root is dead and should be deleted.

Useful identifiers: team `team_MwxhyF3Jeim5PzdtqApbHDKG` (`primers`), project
`prj_FNVe0M9aHbvvmYAOb47V1mHDbMNh` (`primora-website`).

### Meanwhile: deploying from Actions

`.github/workflows/deploy-website.yml` deploys the site from this repository without the Git
integration — production on pushes to `main`, a preview on pull requests, both scoped to changes
under `PrimoraWebsite/`. It needs one secret:

1. Create a token at <https://vercel.com/account/tokens>, scoped to the `primers` team.
2. Add it as **`VERCEL_TOKEN`** under Settings → Secrets and variables → Actions.

The team and project IDs are in the workflow's `env:` block. They are public identifiers, not
secrets. The workflow runs `vercel pull` from the repository root so the project's **Root
Directory** setting decides what gets built — so that setting still needs to be `PrimoraWebsite`,
exactly as for the Git integration.

This is a stopgap, not the destination. Relinking is better: it restores per-PR preview
deployments as a first-class Vercel feature, needs no long-lived token in GitHub, and is the only
thing that stops `primers-sform` pushes reaching production. **If the project is relinked, delete
this workflow** rather than leaving both to deploy the same commit.

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
