import MarkdownIt from 'markdown-it';

// MarkdownIt is currently quite a large library. We don't currently care very much
// for the overall size due to the UI access and caching pattern, but this is
// certainly a point for future optimization.
const md = new MarkdownIt();

export function toHtml(markdown) {
  if (typeof markdown !== 'string') {
    return '';
  }
  return md.render(markdown);
}
