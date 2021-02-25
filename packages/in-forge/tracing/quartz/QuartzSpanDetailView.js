/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function QuartzSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.quartz.group')}>{span.getIn(['data', 'quartz', 'group'])}</Di>
      <Di title={t('in-forge:tracing.quartz.name')}>{span.getIn(['data', 'quartz', 'name'])}</Di>
      <Di title={t('in-forge:tracing.quartz.type')}>{span.getIn(['data', 'quartz', 'type'])}</Di>
    </Dl>
  );
}
