/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Pill from 'in-new-components/Pill';

import locals from './Badge.mless';

export default function TableBadge(props) {
  return (
    <Pill kind="light" {...props} className={locals.badge}>
      {props.children}
    </Pill>
  );
}
