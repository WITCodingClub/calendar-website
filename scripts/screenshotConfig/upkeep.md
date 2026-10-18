# Updating website screenshots

The website owns `scripts/screenshotConfig/config.json` and its sample data, `calendar.json`. A local [calendar-extension](https://github.com/WITCodingClub/calendar-extension) checkout provides the screenshot tool. See the [tool documentation](https://github.com/WITCodingClub/calendar-extension/blob/main/scripts/screenshot_tool.md) for config options, actions, crops, and highlights.

## One-time setup

In your **extension checkout**, install dependencies and Chromium:

```sh
npm ci
npx playwright install chromium
```

## Edit and capture

1. Edit the website's `scripts/screenshotConfig/config.json`. Keep the fixed date within the sample schedule's term; update `calendar.json` if needed.
2. From the **website root**, choose a command:
  ```sh
   npm run screenshots
  ```
   This reuses the existing build in `../calendar-extension/extension/`. To build the extension before capturing instead:
   If your extension checkout is elsewhere, specify its root (quote paths containing spaces):
   Omit `--build` to reuse that checkout's existing build. Relative checkout paths resolve from your current directory. Use `--help` for available options. The selected checkout's current code is built; the script does not download or switch extension versions.
3. Review the generated `.webp` images in `static/guides/getting-started/`. Run `npm run dev` in the website root to check them in the guide. Adjust the config and rerun until they look right.
4. Commit and push the final config, any changed sample data, screenshots, and relevant guide changes together in your website PR.

The runner reads the website config directly, so no copying back is needed. Each entry produces `<name>.webp`. Its `outputDir` overrides the default destination and resolves relative to the config folder; current entries use `../../static/guides/getting-started`. Matching filenames are overwritten; old images are not automatically removed.

## Automatic and manual updates

Extension release notifications trigger **Update extension screenshots**, which generates images and opens or updates a draft screenshot PR.