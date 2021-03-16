/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './ViewAllWrapper.mless';

export default function ViewAllWrapper({ renderViewAll, ...props }) {
  return <div className={locals.viewAll}>{renderViewAll(props, locals.viewAllLink)}</div>;
}
