/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function ElasticsearchSpanGroupingDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.elasticsearch.titleAction')}>{span.getIn(['data', 'elasticsearch', 'action'])}</Di>
      <Di title={t('in-forge:tracing.elasticsearch.titleIndex')}>{span.getIn(['data', 'elasticsearch', 'index'])}</Di>
    </Dl>
  );
}
