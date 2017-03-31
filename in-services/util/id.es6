const crypto = window.crypto || window.msCrypto;

const base64UrlSafeChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'.split('');

export function generateUniqueShortId(desiredLength = 16) {
  let result = '';

  for (let i = 0; i < desiredLength; i++) {
    result += base64UrlSafeChars[randomByte() % base64UrlSafeChars.length];
  }

  return result;
}

function randomByte() {
  if (!crypto || !crypto.getRandomValues) {
    return Math.floor(Math.random() * 256);
  }
  const dest = new Uint8Array(1);
  crypto.getRandomValues(dest);
  return dest[0];
}
