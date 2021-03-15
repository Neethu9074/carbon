/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function ZendFrameworkSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.zf.route')}>{span.getIn(['data', 'zf', 'route'])}</Di>
        <Di title={t('in-forge:tracing.zf.module')}>{span.getIn(['data', 'zf', 'module'])}</Di>
        <Di title={t('in-forge:tracing.zf.controller')}>{span.getIn(['data', 'zf', 'controller'])}</Di>
        <Di title={t('in-forge:tracing.zf.action')}>{span.getIn(['data', 'zf', 'action'])}</Di>
      </Dl>
    </div>
  );
}
