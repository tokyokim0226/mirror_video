# mirror_video

A small mobile-first GitHub Pages site that helps an older Android user open a YouTube video through MirrorTheVideo.

The page accepts a YouTube video link, checks that it points to one supported video, and then opens the matching MirrorTheVideo link in the same browser tab.

## Project goals

- Keep the site simple enough to use on a phone.
- Use large text, clear Korean labels, and tappable controls.
- Run entirely in the browser after deployment.
- Keep YouTube URL parsing separate from the browser interface so it is easy to test.

## Files

- `index.html` contains the page structure and Korean user-facing text.
- `styles.css` contains the mobile-first layout and accessible focus styles.
- `src/app.js` connects the form to the parser and handles user-facing errors.
- `src/youtube-url.js` parses YouTube links and builds MirrorTheVideo links.
- `tests/youtube-url.test.js` tests URL parsing without needing a browser.

## Development

This project uses semantic HTML, plain CSS, and vanilla JavaScript. There is no build step and no third-party runtime dependency.

Because the site has no build step, GitHub Pages can serve the files directly from the repository.

Run the automated URL parsing tests with:

```sh
npm test
```

Manual Android testing is still useful before release because the main workflow depends on a real mobile browser opening the final MirrorTheVideo URL.
