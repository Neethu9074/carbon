import Convert from 'ansi-to-html';

export function ansiToHtml(ansi) {
  return new Convert().toHtml(ansi);
}
