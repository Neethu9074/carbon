/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function EJBSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.ejb.titleModule')}>{span.getIn(['data', 'ejb', 'module'])}</Di>
      <Di title={t('in-forge:tracing.ejb.titleApp')}>{span.getIn(['data', 'ejb', 'app'])}</Di>
      <Di title={t('in-forge:tracing.ejb.titleBean')}>{span.getIn(['data', 'ejb', 'bean'])}</Di>
      <Di title={t('in-forge:tracing.ejb.titleMethod')}>{span.getIn(['data', 'ejb', 'method'])}</Di>
      <Di title={t('in-forge:tracing.ejb.titleNode')}>{span.getIn(['data', 'ejb', 'node'])}</Di>
      <Di title={t('in-forge:tracing.ejb.titleId')}>{span.getIn(['data', 'ejb', 'id'])}</Di>
      <Di title={t('in-forge:tracing.ejb.titleConnection')}>{span.getIn(['data', 'ejb', 'connection'])}</Di>
      <Di title={t('in-forge:tracing.ejb.titleResult')}>{span.getIn(['data', 'ejb', 'result'])}</Di>
      <Di title={t('in-forge:tracing.ejb.titleType')}>{span.getIn(['data', 'ejb', 'sort'])}</Di>
      <Di title={t('in-forge:tracing.ejb.titleError')}>{span.getIn(['data', 'ejb', 'error'])}</Di>
    </Dl>
  );
}
