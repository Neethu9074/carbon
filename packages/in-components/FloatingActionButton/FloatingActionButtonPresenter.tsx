/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { floatingActionButtons$ } from 'in-components/FloatingActionButton/stores/floatingActionButtons';
// @ts-expect-error import connectTo from 'in-hoc/connectTo';
import connectTo from 'in-hoc/connectTo';

import locals from 'in-components/FloatingActionButton/FloatingActionButtonPresenter.mless';

export default connectTo({
  floatingActionButtons: floatingActionButtons$
})(FloatingActionButtonPresenter);
function FloatingActionButtonPresenter({ floatingActionButtons = [] }) {
  return floatingActionButtons.length > 0 ? (
    <div className={locals.container}>
      {floatingActionButtons.map((ActionButton, i) => (
        <div key={i}>{ActionButton}</div>
      ))}
    </div>
  ) : null;
}
