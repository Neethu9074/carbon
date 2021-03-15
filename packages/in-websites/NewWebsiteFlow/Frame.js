/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Card from 'in-new-components/Card';

import locals from './Frame.mless';

export default function Frame({ children, title }) {
  return (
    <Card title={title} className={locals.frame}>
      {children}
    </Card>
  );
}
