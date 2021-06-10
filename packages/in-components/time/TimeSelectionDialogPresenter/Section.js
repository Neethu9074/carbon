/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './Section.mless';

export default function Section({ title, light, children }) {
  return (
    <div
      className={classNames({
        [locals.wrapper]: true,
        [locals.lightWrapper]: light
      })}
    >
      <h1 className={locals.header}>{title}</h1>
      {children}
    </div>
  );
}
