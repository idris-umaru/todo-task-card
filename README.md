# Todo Task Card

A polished single-task card UI built with semantic HTML, responsive CSS, and a small JavaScript interaction layer.

## Tech Stack

- HTML
- CSS
- JavaScript

## GitHub Repo

https://github.com/idris-umaru/todo-task-card

## How to run locally

1. Open the project folder in your browser or editor.
2. Open `index.html` directly in a browser.


## What changed from Stage 0

Stage 1 upgrades the card from a mostly static UI to a more app-like interactive experience:

- Added inline edit mode with dedicated fields for title, description, priority, and due date.
- Replaced browser prompt editing with a form and Save / Cancel controls.
- Added status transition controls plus checkbox sync for Pending, In Progress, and Done.
- Added a priority indicator that visually updates for Low / Medium / High.
- Added collapsible description content and an accessible expand/collapse toggle.
- Added overdue detection and a visible overdue badge.
- Added a live time updater with granular due messaging and a completed state.
- Added visual styling for states such as Done, In Progress, High priority, and overdue.

## Design decisions

- Kept the component single card focused rather than turning it into a full task list.
- Used semantic HTML and accessible form controls to improve clarity and screen reader support.
- Used an inline form for edit mode to provide a cleaner user experience than prompt dialogs.
- Kept visual styling polished with soft gradients, badges, and state-based color accents.
- Updated time logic to refresh periodically, but not too frequently, to balance responsiveness and performance.

## Accessibility notes

- Semantic structure uses `<article>`, `<header>`, `<section>`, `<time>`, and `<ul role="list">`.
- The checkbox is a native `<input type="checkbox">` with a visible custom wrapper.
- Form inputs include explicit labels and `aria-label` attributes where needed.
- The expand/collapse toggle is keyboard accessible and updates `aria-expanded`.
- Edit mode traps focus within the form and returns focus to the Edit button when closed.

## Known limitations

- No persistence: changes are stored only in the current page session and reset on refresh.
- Delete removes the card from the DOM only, with no undo option.
- This is still a single task component and does not support multiple tasks.
- Time formatting relies on client-side clock settings.

