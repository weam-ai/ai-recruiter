import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
const config = require('../config/config');

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function convertToAscii(inputString) {
  // remove non ascii characters
  const asciiString = inputString.replace(/[^\x20-\x7F]+/g, "");

  return asciiString;
}

export function formatTimestampToDateHHMM(timestamp) {
  const date = new Date(timestamp);

  // Format date to YYYY-MM-DD
  const datePart =
    date.getDate().toString().padStart(2, "0") +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getFullYear();

  // Format time to HH:MM
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const timePart = `${hours}:${minutes}`;

  return `${datePart} ${timePart}`;
}

export function testEmail(email) {
  const re = /\S+@\S+\.\S+/;

  return re.test(email);
}

export function convertSecondstoMMSS(seconds) {
  const minutes = Math.trunc(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  return `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`;
}

export function isLightColor(color) {
  const hex = color?.replace("#", "");
  const r = parseInt(hex?.substring(0, 2), 16);
  const g = parseInt(hex?.substring(2, 4), 16);
  const b = parseInt(hex?.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 155;
}

export function getApiUrl(endpoint) {
  const basePath = config.APP.API_BASE_PATH || '';
  return `${basePath}${endpoint}`;
}
