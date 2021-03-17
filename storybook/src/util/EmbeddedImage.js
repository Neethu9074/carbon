/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

/*
 * Helper component for embedding an image within any mdx files.
 * Optionally override default width (450)
 * Optionally align it optionally on the right side via floatRight.
 *
 * Example: see storybook/src/Atoms/FloatingActionButton.story.mdx
 */
export default function EmbeddedImage({ src, floatRight, width = 450 }) {
  return <img src={src} width={width} className={floatRight ? 'pull-right' : ''} />;
}
