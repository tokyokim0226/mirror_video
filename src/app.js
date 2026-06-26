import { buildMirrorTheVideoUrl, parseYouTubeVideoId } from "./youtube-url.js";

// The parser returns small English error codes; the UI translates them for the user.
const ERROR_MESSAGES = {
  empty: "유튜브 주소를 입력해 주세요.",
  "malformed-url": "주소 형식이 올바르지 않습니다. http:// 또는 https://로 시작하는 전체 주소를 붙여넣어 주세요.",
  "unsupported-protocol": "http 또는 https로 시작하는 주소만 사용할 수 있습니다.",
  "non-youtube-domain": "유튜브 주소만 사용할 수 있습니다.",
  "missing-video-id": "영상 주소를 찾을 수 없습니다. 채널이나 재생목록 주소가 아닌 개별 영상 주소를 넣어 주세요.",
  "invalid-video-id": "영상 ID가 올바르지 않습니다. 유튜브에서 공유한 영상 주소를 다시 붙여넣어 주세요.",
};

const form = document.querySelector("#video-form");
const input = document.querySelector("#youtube-url");
const errorMessage = document.querySelector("#url-error");

form.addEventListener("submit", handleSubmit);
input.addEventListener("input", clearError);

function handleSubmit(event) {
  // Stop the browser's default form submit so we can validate first.
  event.preventDefault();

  const result = parseYouTubeVideoId(input.value);

  if (!result.ok) {
    showError(result.error);
    input.focus();
    return;
  }

  clearError();
  // Assigning window.location.href redirects in the same browser tab.
  window.location.href = buildMirrorTheVideoUrl(result.videoId);
}

function showError(errorCode) {
  input.setAttribute("aria-invalid", "true");
  errorMessage.textContent = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES["malformed-url"];
}

function clearError() {
  input.removeAttribute("aria-invalid");
  errorMessage.textContent = "";
}
