/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Card } from '@instana/components';
import React, { ReactNode } from 'react';

import locals from 'in-alerting/components/AlertDetailsCard.mless';

export type childrenProp = {
  children: ReactNode;
};
export default function AlertDetailsCard({ children }: childrenProp) {
  return <Card bodyClassName={locals.cardBody}>{children}</Card>;
}
