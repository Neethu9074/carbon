export function ineum() {
  if (typeof window !== 'undefined' && window.ineum) {
    window.ineum.apply(window, arguments);
  }
}
