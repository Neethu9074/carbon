/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './Marker.mless';

export default function Marker({ className, label }) {
  let name = locals.marker;
  if (className) {
    name += ` ${className}`;
  }

  return <span className={name}>{label}</span>;
}
