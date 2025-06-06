/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { TagFilterEntity } from '@instana/types';
import { SvgIcon } from '@instana/components';

import { SOURCE, DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { t } from 'in-i18n';

import locals from './Entity.mless';

export default function EntityReadOnly({ entity }: { entity: TagFilterEntity }) {
  if (entity === SOURCE || entity === DESTINATION) {
    return (
      <>
        <div className={locals.wrapper}>
          <SvgIcon
            className={classNames({
              [locals.entity_icon_disablehover]: true
            })}
            size="xs"
            type={entity === SOURCE ? 'lib_arrow_outgoing' : 'lib_arrow_incoming'}
          />
        </div>
        <div
          className={classNames({
            [locals.entity_disablehover]: true
          })}
        >
          {entity === SOURCE
            ? t('in-components:queryBuilder.sourceAbbreviated')
            : t('in-components:queryBuilder.destinationAbbreviated')}
        </div>
      </>
    );
  }
  return null;
}
