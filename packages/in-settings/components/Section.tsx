/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './Section.mless';

export default function Section({ restrictWidth, children, className }) {
  return (
    <div
      style={{
        maxWidth: restrictWidth
      }}
      className={classNames(locals.section, className)}
    >
      {children}
    </div>
  );
}
