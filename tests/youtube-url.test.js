import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  buildMirrorTheVideoUrl,
  isValidVideoId,
  parseYouTubeVideoId,
} from "../src/youtube-url.js";

const VALID_VIDEO_ID = "dQw4w9WgXcQ";

describe("parseYouTubeVideoId", () => {
  // These tests describe the contract for every supported URL shape.
  test("extracts video IDs from supported YouTube URL formats", () => {
    const urls = [
      `https://www.youtube.com/watch?v=${VALID_VIDEO_ID}`,
      `https://youtube.com/watch?v=${VALID_VIDEO_ID}`,
      `https://m.youtube.com/watch?v=${VALID_VIDEO_ID}`,
      `https://youtu.be/${VALID_VIDEO_ID}`,
      `https://www.youtube.com/shorts/${VALID_VIDEO_ID}`,
      `https://www.youtube.com/live/${VALID_VIDEO_ID}`,
    ];

    for (const url of urls) {
      assert.deepEqual(parseYouTubeVideoId(url), {
        ok: true,
        videoId: VALID_VIDEO_ID,
      });
    }
  });

  test("accepts http and https URLs", () => {
    assert.deepEqual(parseYouTubeVideoId(`http://www.youtube.com/watch?v=${VALID_VIDEO_ID}`), {
      ok: true,
      videoId: VALID_VIDEO_ID,
    });
  });

  test("ignores extra query parameters", () => {
    const urls = [
      `https://www.youtube.com/watch?v=${VALID_VIDEO_ID}&t=30s`,
      `https://youtu.be/${VALID_VIDEO_ID}?si=abc123`,
      `https://www.youtube.com/shorts/${VALID_VIDEO_ID}?feature=share`,
      `https://www.youtube.com/live/${VALID_VIDEO_ID}?utm_source=test`,
    ];

    for (const url of urls) {
      assert.deepEqual(parseYouTubeVideoId(url), {
        ok: true,
        videoId: VALID_VIDEO_ID,
      });
    }
  });

  test("trims whitespace around input", () => {
    assert.deepEqual(parseYouTubeVideoId(`  https://youtu.be/${VALID_VIDEO_ID}  `), {
      ok: true,
      videoId: VALID_VIDEO_ID,
    });
  });

  test("rejects empty input", () => {
    assert.deepEqual(parseYouTubeVideoId(""), { ok: false, error: "empty" });
    assert.deepEqual(parseYouTubeVideoId("   "), { ok: false, error: "empty" });
  });

  test("rejects malformed URLs and URLs without a protocol", () => {
    assert.deepEqual(parseYouTubeVideoId("not a url"), {
      ok: false,
      error: "malformed-url",
    });
    assert.deepEqual(parseYouTubeVideoId(`youtube.com/watch?v=${VALID_VIDEO_ID}`), {
      ok: false,
      error: "malformed-url",
    });
  });

  test("rejects unsupported protocols", () => {
    assert.deepEqual(parseYouTubeVideoId(`ftp://www.youtube.com/watch?v=${VALID_VIDEO_ID}`), {
      ok: false,
      error: "unsupported-protocol",
    });
  });

  test("rejects non-YouTube domains", () => {
    assert.deepEqual(parseYouTubeVideoId(`https://example.com/watch?v=${VALID_VIDEO_ID}`), {
      ok: false,
      error: "non-youtube-domain",
    });
  });

  test("rejects unsupported YouTube pages without an individual video ID", () => {
    const urls = [
      "https://www.youtube.com/@channelname",
      "https://www.youtube.com/channel/UCabc123",
      "https://www.youtube.com/playlist?list=PL123",
      "https://www.youtube.com/watch",
      "https://www.youtube.com/watch?list=PL123",
      "https://www.youtube.com/watch?v=",
      "https://youtu.be/",
      "https://www.youtube.com/shorts/",
      "https://www.youtube.com/live/",
    ];

    for (const url of urls) {
      assert.deepEqual(parseYouTubeVideoId(url), {
        ok: false,
        error: "missing-video-id",
      });
    }
  });

  test("rejects invalid video IDs", () => {
    const urls = [
      "https://www.youtube.com/watch?v=short",
      `https://www.youtube.com/watch?v=${VALID_VIDEO_ID}X`,
      "https://youtu.be/invalid!!!!",
      "https://www.youtube.com/shorts/한글영상아이디",
    ];

    for (const url of urls) {
      assert.deepEqual(parseYouTubeVideoId(url), {
        ok: false,
        error: "invalid-video-id",
      });
    }
  });
});

describe("isValidVideoId", () => {
  test("validates the required 11-character ID format", () => {
    assert.equal(isValidVideoId(VALID_VIDEO_ID), true);
    assert.equal(isValidVideoId("abc_123-XYZ"), true);
    assert.equal(isValidVideoId("abc123"), false);
    assert.equal(isValidVideoId("abc_123-XYZ9"), false);
    assert.equal(isValidVideoId("abc.123.XYZ"), false);
  });
});

describe("buildMirrorTheVideoUrl", () => {
  // The final redirect URL should never include timestamps or tracking parameters.
  test("builds the exact MirrorTheVideo watch URL", () => {
    assert.equal(
      buildMirrorTheVideoUrl(VALID_VIDEO_ID),
      `https://www.mirrorthevideo.com/watch?v=${VALID_VIDEO_ID}`,
    );
  });

  test("rejects invalid IDs", () => {
    assert.throws(() => buildMirrorTheVideoUrl("short"), /Invalid YouTube video ID/);
  });
});
