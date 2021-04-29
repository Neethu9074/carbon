/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Card } from '@instana/components';
import React from 'react';

import locals from './Frame.mless';

export default function Frame({ children, title }) {
  return (
    <Card title={title} className={locals.frame}>
      {children}
    </Card>
  );
}
