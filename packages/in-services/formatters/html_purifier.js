import createDOMPurify from 'dompurify';

const DOMPurify = createDOMPurify(window);

export function sanitize(html) {
  return DOMPurify.sanitize(html);
}
