/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { SOURCE, DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { t } from 'in-i18n';

import locals from './Entity.mless';

export default function EntityReadOnly({ entity }) {
  if (entity === SOURCE || entity === DESTINATION) {
    return (
      <>
        <div className={locals.wrapper}>
          <SvgIcon
            className={locals.icon}
            size="xs"
            style={{ cursor: 'not-allowed' }}
            type={entity === SOURCE ? 'lib_arrow_outgoing' : 'lib_arrow_incoming'}
          />
        </div>
        <div className={locals.name}>
          {entity === SOURCE
            ? t('in-components:queryBuilder.sourceAbbreviated')
            : t('in-components:queryBuilder.destinationAbbreviated')}
        </div>
      </>
    );
  }
  return null;
}
