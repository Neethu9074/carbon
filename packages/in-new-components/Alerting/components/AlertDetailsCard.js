/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Card from 'in-new-components/Card/Card';

import locals from './AlertDetailsCard.mless';

export default function AlertDetailsCard({ children }) {
  return <Card bodyClassName={locals.cardBody}>{children}</Card>;
}
