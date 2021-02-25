/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { emptyList } from 'in-services/fixedImmutables';

export default function RedisSpanDetailView({ span }) {
  const subCommands = span.getIn(['data', 'redis', 'subCommands'], emptyList);
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.redis.connection')}>{span.getIn(['data', 'redis', 'connection'])}</Di>
        <Di title={t('in-forge:tracing.redis.driver')}>{span.getIn(['data', 'redis', 'driver'])}</Di>
        <Di title={t('in-forge:tracing.redis.command')}>{span.getIn(['data', 'redis', 'command'])}</Di>
        {subCommands.size > 0 ? <Di title={t('in-forge:tracing.redis.commandsInTransaction')}>{subCommands.join(', ')}</Di> : null}
        <Di title={t('in-forge:tracing.redis.key')}>{span.getIn(['data', 'redis', 'key'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'redis', 'error'])} />
      </Dl>
    </div>
  );
}
