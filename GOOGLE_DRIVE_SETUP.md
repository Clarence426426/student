# Google Drive cloud saves

This project saves each Google user's game file in their private Google Drive `appDataFolder`. The file is hidden from normal Drive browsing and is available only to this app after that user authorizes it.

## One-time Google setup

1. Open Google Cloud Console and create or select a project.
2. Configure the OAuth consent screen. Add the `drive.appdata` scope.
3. Create an **OAuth client ID** of type **Web application**.
4. Add your public game address to **Authorized JavaScript origins**, for example `https://clarence426426.github.io`.
5. Add the redirect origin used by your published site if Google requests it.
6. Copy the Client ID into `dist/google-drive-config.js` as the value of `STARLIGHT_GOOGLE_CLIENT_ID`.
7. Commit and publish that configuration file. A Web Client ID is safe to expose; never put a client secret into the browser app.

## Behaviour

- Every Google account receives its own private save file.
- Saves include game progress, missions, rewards, parent approvals, and the profile held by that Google account.
- This configuration is suitable for an independent parent or child account. Sharing a single family record between two separate Google Drives needs an explicit family-linking and sharing flow, which is not enabled yet.
