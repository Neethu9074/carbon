/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// @ts-expect-error Module doesn't has any types exported, TODO: Package is deprecated: https://www.npmjs.com/package/markdown-it-link-target
import linkTarget from 'markdown-it-link-target';
import MarkdownIt from 'markdown-it';

// MarkdownIt is currently quite a large library. We don't currently care very much
// for the overall size due to the UI access and caching pattern, but this is
// certainly a point for future optimization.
const md = new MarkdownIt();

md.use(linkTarget, {
  target: '_blank'
});

export function toHtml(markdown?: string) {
  if (typeof markdown !== 'string') {
    return '';
  }
  return md.render(markdown);
}
