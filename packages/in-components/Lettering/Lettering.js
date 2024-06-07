/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import './Lettering.less';

const block = 'in-lettering';

export default function Lettering({ className, tag = 'div' }) {
  const TagName = tag;
  let classes = block;
  if (className) {
    classes = `${block} ${className}`;
  }

  return <TagName className={classes}>instana Inc.</TagName>;
}
