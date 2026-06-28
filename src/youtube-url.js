const SUPPORTED_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "m.youtube.com",
  "youtu.be",
]);

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const MIRROR_BASE_URL = "https://www.mirrorthevideo.com/watch";

// This function only looks at the text it receives and returns a result.
// It does not read the page, show messages, or move the browser to a new URL,
// which keeps it easy to test with Node.
export function parseYouTubeVideoId(input) {
  const value = input.trim();

  if (!value) {
    return { ok: false, error: "empty" };
  }

  let url;

  try {
    // The built-in URL object understands web addresses better than hand-written
    // string splitting, so it catches many invalid addresses for us.
    url = new URL(value);
  } catch {
    return { ok: false, error: "malformed-url" };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, error: "unsupported-protocol" };
  }

  if (!isSupportedYouTubeHost(url.hostname)) {
    return { ok: false, error: "non-youtube-domain" };
  }

  const videoId = extractVideoIdFromUrl(url);

  if (!videoId) {
    return { ok: false, error: "missing-video-id" };
  }

  if (!isValidVideoId(videoId)) {
    return { ok: false, error: "invalid-video-id" };
  }

  return { ok: true, videoId };
}

export function buildMirrorTheVideoUrl(videoId) {
  if (!isValidVideoId(videoId)) {
    throw new Error("Invalid YouTube video ID");
  }

  const mirrorUrl = new URL(MIRROR_BASE_URL);
  mirrorUrl.searchParams.set("v", videoId);
  return mirrorUrl.toString();
}

export function isValidVideoId(videoId) {
  return VIDEO_ID_PATTERN.test(videoId);
}

function isSupportedYouTubeHost(hostname) {
  return SUPPORTED_HOSTS.has(hostname.toLowerCase());
}

function extractVideoIdFromUrl(url) {
  const hostname = url.hostname.toLowerCase();
  const pathParts = url.pathname.split("/").filter(Boolean);

  // A short link looks like https://youtu.be/VIDEO_ID.
  // The first path part after the domain is the video ID.
  if (hostname === "youtu.be") {
    return pathParts[0] || "";
  }

  // A normal watch link looks like https://www.youtube.com/watch?v=VIDEO_ID.
  // The video ID is stored in the "v" query parameter.
  if (url.pathname === "/watch") {
    return url.searchParams.get("v") || "";
  }

  // Shorts and live links look like /shorts/VIDEO_ID or /live/VIDEO_ID.
  // The video ID is the second path part.
  if (pathParts[0] === "shorts" || pathParts[0] === "live") {
    return pathParts[1] || "";
  }

  return "";
}
