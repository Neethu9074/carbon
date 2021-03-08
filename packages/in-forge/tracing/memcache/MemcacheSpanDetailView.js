/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { yesOrNo } from 'in-services/formatters/boolean';

export default function MemcacheSpanDetailView({ span }) {
  const command = span.getIn(['data', 'memcache', 'command']);

  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.memcache.titleCommand')}>{command}</Di>
        <Di title={t('in-forge:tracing.memcache.titleKey')}>{span.getIn(['data', 'memcache', 'key'])}</Di>

        {command === 'get' ? <Di title={t('in-forge:tracing.memcache.titleHit')}>{yesOrNo(span.getIn(['data', 'memcache', 'hit']) == 1)}</Di> : null}

        <Di title={t('in-forge:tracing.memcache.titleKeys')}>{span.getIn(['data', 'memcache', 'keys'])}</Di>
        <Di title={t('in-forge:tracing.memcache.titleHitCount')}>{span.getIn(['data', 'memcache', 'hits'])}</Di>
        <Di title={t('in-forge:tracing.memcache.titleNamespace')}>{span.getIn(['data', 'memcache', 'namespace'])}</Di>
        <Di title={t('in-forge:tracing.memcache.titleServer')}>{span.getIn(['data', 'memcache', 'server'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'memcache', 'error'])} />
      </Dl>
    </div>
  );
}
