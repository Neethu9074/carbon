export function getCurrentUser() {
  return window.instana.user;
}

export function isInstanaEmployee() {
  return getCurrentUser().email.indexOf('@instana.com') !== -1;
}
