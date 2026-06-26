const SUPPORTED_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "m.youtube.com",
  "youtu.be",
]);

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const MIRROR_BASE_URL = "https://www.mirrorthevideo.com/watch";

// This function is pure: it does not read the page or redirect the browser.
export function parseYouTubeVideoId(input) {
  const value = input.trim();

  if (!value) {
    return { ok: false, error: "empty" };
  }

  let url;

  try {
    // URL parsing is safer than splitting strings by hand.
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

  // Short links store the video ID directly after the domain.
  if (hostname === "youtu.be") {
    return pathParts[0] || "";
  }

  // Watch links store the video ID in the v query parameter.
  if (url.pathname === "/watch") {
    return url.searchParams.get("v") || "";
  }

  // Shorts and live links store the video ID as the next path segment.
  if (pathParts[0] === "shorts" || pathParts[0] === "live") {
    return pathParts[1] || "";
  }

  return "";
}
