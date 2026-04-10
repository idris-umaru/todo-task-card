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

No build tools or package manager are required.

## Decisions made

- Used semantic structure with `<article>`, `<h2>`, `<p>`, `<time>`, and `<ul role="list">` for accessibility and clear markup.
- Implemented the checkbox as a real `<input type="checkbox">` with a visible custom UI wrapper.
- Kept interactions simple: the Edit button uses browser prompts, and Delete removes the card from the DOM.
- Displayed the due date and remaining time with readable formatting and a 30-second refresh interval.
- Designed the card with startup-friendly polished visuals, soft gradients, and subtle hover motion.


## Trade-offs

- No persistence: edits and deletions only last for the current page session.
- Used prompt dialogs for quick editing instead of a custom inline form to keep the component lightweight and simple.
- Kept the app single-page and single-card rather than adding multiple tasks or state management.
- No testing harness or automation included, since the focus was on the core UI and interaction behavior.