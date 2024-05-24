/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './SectionLine.mless';

export default function SectionLine({ withBottomMargin = true }) {
  return (
    <div
      className={classNames({
        [locals.line]: true,
        [locals.marginBottom]: withBottomMargin
      })}
    />
  );
}
