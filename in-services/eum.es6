export function ineum() {
  if (typeof window !== 'undefined' && window.ineum) {
    ineum.apply(window, arguments);
  }
}
