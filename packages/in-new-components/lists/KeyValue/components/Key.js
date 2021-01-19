/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from './Key.mless';

export default function Key({ label }) {
  if (!label) {
    return null;
  }
  return <span className={locals.label}>{label}</span>;
}
