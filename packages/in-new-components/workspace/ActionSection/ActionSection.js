/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import locals from './ActionSection.mless';

export function ActionSection({ left, right }) {
  return (
    <div className={locals.section}>
      <div className={locals.left}>{left}</div>

      <div className={locals.right}>{right}</div>
    </div>
  );
}

export function Action(props) {
  return <Button {...props} kind="subtle" size="compact" className={locals.button} />;
}
