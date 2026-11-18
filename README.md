# For Zaynab ♡ | A birthday surprise from Saad

A personalized birthday site made with plain HTML, CSS, and JavaScript. It includes the two photos supplied for the gift, a five-chapter story, flip-card compliments, 22 clickable wishes, birthday candles, an animated letter signed by Saad, a surprise gift, confetti, optional chimes, and a dedicated music section for "Let Me Down Slowly" by Alec Benjamin.

## Open it

Open `index.html` directly in a browser. It doesn't need a server, account, or build process. Google Fonts are optional: the page falls back to local system fonts when offline. The site sends no birthday messages or personal photos to a backend; Google Fonts and the embedded YouTube player make requests to their respective providers.

## Change the message

Edit **`content.js`** to change the five chapter messages, three compliments, 22 wishes, and the birthday letter. Change the HTML in `index.html` to adjust the hero and final reveal text. Photos live at `assets/together.webp` and `assets/little-moment.webp`.

## Publish with GitHub Pages

1. Create a new GitHub repository, ideally **private until you are ready**.
2. Upload the *contents* of this folder (`index.html`, CSS/JS files, `assets` folder, `.nojekyll`).
3. For GitHub Pages, repository Settings → Pages → Deploy from a branch → `main` / `(root)` → Save.
4. Copy the GitHub Pages URL and share it with Zaynab.

**Privacy:** GitHub Pages hosts the site publicly, even if you are using a private repository. Anyone with the link may view or copy photos and the letter. Only publish with the consent of the people in the photos. A private local copy is best for a private surprise.

## Interactions

- Send as many floating hearts as you like.
- Select five little chapters (arrow keys work).
- Click photos to zoom; use arrow keys to switch photos and Escape to close.
- Flip each compliment card.
- Collect 22 wishes by tapping 22 stars; a progress meter tracks them.
- Blow out three candles one by one or all at once.
- Open the envelope to read a personal letter.
- Unwrap the present for the final surprise.
- Turn sound on to play "Let Me Down Slowly" inside the page, alongside gentle synthesized chimes. Turn sound off to pause. No audio starts automatically.

Made originally for Zaynab's 22nd birthday, with care and without external JavaScript dependencies.

## iPhone Safari

The page uses iPhone-safe viewport sizing and home-indicator/notch padding, mobile touch targets, touch-friendly chapter scrolling, and swipe navigation in the photo viewer. All surprises work by touch; no hover or mouse is needed. Optional synthesized sound must be enabled by the visitor with a tap, as required by iOS.

**Send her an HTTPS website link**, not the `.html` file as an iMessage or WhatsApp attachment. iOS Files, Quick Look, and in-app document previews may not run the interactive JavaScript reliably. Upload the folder contents to a static host like GitHub Pages and share its website URL. For privacy, remember anyone with the public link can see the photos and messages.

## Our song

The music section embeds the official YouTube video for "Let Me Down Slowly". The header sound toggle and the "Play our song" button both start or pause playback inside the page. Playback starts only after a visitor chooses it. The player is prepared silently on page load; if iPhone Safari blocks the initial playback request, the page asks the visitor to tap the visible video play control. An external YouTube link remains available if embedding is blocked or the video is unavailable. Music needs an internet connection and is provided by YouTube; no audio files are distributed with this website. Test through an HTTPS website URL because local file previews may block YouTube playback.

Personal greeting and letter are signed from Saad. The page contains no em dashes.
