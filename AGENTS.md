# AGENTS.md

## Project

This is a simple mobile-first website that helps an older Android user open YouTube videos through MirrorTheVideo.

Prioritize reliability, readability, and ease of use over feature quantity.

## Technology

* Build for deployment on GitHub Pages.
* Use semantic HTML, plain CSS, and vanilla JavaScript.
* Do not introduce a framework, backend, database, build tool, or third-party runtime dependency unless explicitly approved.
* Node.js may be used for development and testing, but the deployed website must run entirely in the browser.

## Design

* Design primarily for mobile phones, starting at a viewport width of 320 pixels.
* Desktop support is secondary.
* Use large, readable text and easily tappable controls.
* Keep navigation and user interactions simple.
* Use Korean for user-facing text.
* Use English for code, filenames, comments, tests, and technical documentation.
* Maintain visible focus states and accessible form labels and errors.

## Code

* Keep the implementation small and understandable.
* Separate YouTube URL parsing, browser storage, and interface logic.
* Keep storage behind a small interface so its implementation can be changed later.
* Avoid unsafe insertion of user-provided content into HTML.
* Make only changes relevant to the requested task.

## Testing

* Test URL parsing independently from browser interface behavior.
* Prefer Node.js built-in testing tools.
* Do not add a third-party testing framework without approval.
* Run relevant tests after making changes.
* Report tests run, results, and anything requiring manual Android testing.

## Workflow

For non-trivial tasks:

1. Inspect the repository first.
2. Present a concise plan before implementation.
3. State important assumptions or uncertainties.
4. Implement only the approved scope.
5. Run the relevant tests.
6. Summarize the changes and results.
