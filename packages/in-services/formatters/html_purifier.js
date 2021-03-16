/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import createDOMPurify from 'dompurify';

const DOMPurify = createDOMPurify(window);

export function sanitize(html) {
  return DOMPurify.sanitize(html);
}
