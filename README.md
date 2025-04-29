# StudyLog

StudyLog is a simple browser extension to track and manage your learning progress across different web pages.

## Features

- One-click save of the current tab's URL and title
- Each record has "Update Progress" and "Delete" buttons
- Edit title and add optional memos
- Works on both Chrome and Firefox (Manifest V3)
- Data is persisted in `chrome.storage.local`
- Clean, stylish, and responsive UI

## Build Instructions

Follow these steps to build the extension from source:

1. Install Node.js (recommended version: 18.x or later)
   - Download from: https://nodejs.org/

2. Install project dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. The build artifacts will be generated inside the `dist/` directory.

5. Load the `dist/` directory as an unpacked extension in Chrome or Firefox.

## Requirements

- Operating System: Windows 10+, macOS 11+, or Ubuntu 20.04+
- Node.js: v18.x or later
- npm: v9.x or later

## Development & Testing

- Built with Vite + React + TypeScript
- Unit tests located in `src/tests/storage.test.ts` (Vitest)

Run tests:

```bash
npx vitest run
```

- Code formatting and linting are supported via ESLint

## Data Structure Example

```json
{
  "id": "unique-id",
  "domain": "example.com",
  "url": "https://example.com/page2",
  "title": "Chapter 2: Introduction to WebExtensions",
  "memo": "Optional memo",
  "updatedAt": 1714368000000
}
```

## Project Structure (partial)

```
public/           ... manifest, icons, popup.html
src/popup/        ... Popup UI (React)
src/storage.ts    ... Storage logic
src/tests/        ... Tests
vite.config.ts    ... Vite config
```

## Customization

- UI and colors can be adjusted in `src/popup/popup.css`
- Data structure and storage logic are easy to extend

## Notes

- No private API is used.
- No dynamic remote code loading.
- The extension does not collect any personal user data.
- All saved data remains stored locally in the user's browser.

## License

MIT
