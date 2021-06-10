/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function EhcacheSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.ehcache.titleElements')}>{span.getIn(['data', 'elements'])}</Di>
        <Di title={t('in-forge:tracing.ehcache.titleHits')}>{span.getIn(['data', 'hits'])}</Di>
      </Dl>
    </div>
  );
}
