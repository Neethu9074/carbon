/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Ul, Li } from '@instana/components';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable';

import locals from './EmptyList.mless';

export default function EmptyList() {
  return (
    <Ul>
      <Li className={locals.content}>
        <NoDataAvailable height={90} />
      </Li>
    </Ul>
  );
}
