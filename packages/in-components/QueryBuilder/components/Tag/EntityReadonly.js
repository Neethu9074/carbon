/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { SOURCE, DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';

import locals from './Entity.mless';

export default function EntityReadOnly({ entity }) {
  if (entity === SOURCE || entity === DESTINATION) {
    return (
      <div className={locals.wrapper}>
        <SvgIcon
          className={locals.icon}
          style={{ cursor: 'not-allowed' }}
          type={entity === SOURCE ? 'lib_application_call_source' : 'lib_application_call_destination'}
        />
      </div>
    );
  }
  return null;
}
