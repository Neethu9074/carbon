/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function RocketMqSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.rocketmq.topic')}>{span.getIn(['data', 'rocketmq', 'topic'])}</Di>
      </Dl>
    </div>
  );
}
