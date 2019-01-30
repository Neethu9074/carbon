// move this to it's own file to mock it away in tests (node env)

export function createCanvas() {
  return document.createElement('canvas');
}
