/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { Ul, Li } from 'in-new-components/lists/List';

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
