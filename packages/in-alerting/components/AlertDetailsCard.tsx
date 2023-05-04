/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Card } from '@instana/components';
import React from 'react';

import locals from 'in-alerting/components/AlertDetailsCard.mless';

export default function AlertDetailsCard({ children }) {
  return <Card bodyClassName={locals.cardBody}>{children}</Card>;
}
