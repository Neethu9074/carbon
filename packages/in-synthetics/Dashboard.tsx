/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import Tests from 'in-synthetics/Tests';

import locals from './Dashboard.mless';

export default function Dashboard() {
  return (
    <article className={locals.dashboard}>
      <Tests />
    </article>
  );
}
