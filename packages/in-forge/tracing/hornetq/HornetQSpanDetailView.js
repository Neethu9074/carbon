/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function HornetQSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.hornetq.titleAddress')}>{span.getIn(['data', 'hornetq', 'address'])}</Di>
        <Di title={t('in-forge:tracing.hornetq.titleUserID')}>{span.getIn(['data', 'hornetq', 'userId'])}</Di>
        <Di title={t('in-forge:tracing.hornetq.titleSize')}>{span.getIn(['data', 'hornetq', 'size'])}</Di>
        <Di title={t('in-forge:tracing.hornetq.titleLarge')}>{span.getIn(['data', 'hornetq', 'large'])}</Di>
        <Di title={t('in-forge:tracing.hornetq.titleDurable')}>{span.getIn(['data', 'hornetq', 'durable'])}</Di>
        <Di title={t('in-forge:tracing.hornetq.titleBlocking')}>{span.getIn(['data', 'hornetq', 'blocking'])}</Di>
      </Dl>
    </div>
  );
}
