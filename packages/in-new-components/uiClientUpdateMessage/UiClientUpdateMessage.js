/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Button from 'in-new-components/Button/Button';

import locals from './UiClientUpdateMessage.mless';

export default function UiClientUpdateMessage() {
  return (
    <div className={locals.container}>
      <h1 className={locals.title}>New version of Instana available</h1>
      <nav className={locals.controls}>
        <Button kind="action" onClick={() => window.location.reload()}>
          Reload to update
        </Button>
      </nav>
    </div>
  );
}
