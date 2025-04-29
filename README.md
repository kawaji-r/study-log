# StudyLog

StudyLog is a simple browser extension to track and manage your learning progress across different web pages.

## Features

- One-click save of the current tab's URL and title
- Each record has "Update Progress" and "Delete" buttons
- Edit title and add optional memos
- Works on both Chrome and Firefox (Manifest V3)
- Data is persisted in `chrome.storage.local`
- Clean, stylish, and responsive UI

## Getting Started

1. Clone this repository and install dependencies:
   ```sh
   npm install
   ```
2. Build the extension:
   ```sh
   npm run build
   ```
3. Load the `dist/` directory as an unpacked extension in Chrome or Firefox
4. Click the toolbar icon to open the popup and start tracking your study progress

## Main Features

- **Create New Record**: Click "New Study Log" to save the current tab's info. You can edit the title and add a memo.
- **Update Progress**: Click "Update Progress" to update the record's URL to the current tab
- **Delete**: Click "Delete" to remove a record (with confirmation dialog)
- **Data Structure Example**:
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

## Development & Testing

- Built with Vite + React + TypeScript
- Unit tests: `src/tests/storage.test.ts` (Vitest)
  ```sh
  npx vitest run
  ```
- Code formatting and linting: ESLint supported

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

## License

MIT
