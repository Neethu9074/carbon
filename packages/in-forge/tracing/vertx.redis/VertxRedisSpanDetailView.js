/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function VertxRedisSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.vertxRedis.connection')}>{span.getIn(['data', 'vertx', 'redis', 'conn'])}</Di>
        <Di title={t('in-forge:tracing.vertxRedis.command')}>{span.getIn(['data', 'vertx', 'redis', 'cmd'])}</Di>
        <Di title={t('in-forge:tracing.vertxRedis.channel')}>{span.getIn(['data', 'vertx', 'redis', 'channel'])}</Di>
        <Di title={t('in-forge:tracing.vertxRedis.key')}>{span.getIn(['data', 'vertx', 'redis', 'key'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'vertx', 'redis', 'error'])} />
      </Dl>
    </div>
  );
}
