/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function IbmmqSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.jms.titleDestination')}>{span.getIn(['data', 'ibm-mq', 'queue'])}</Di>
        <Di title={t('in-forge:tracing.jms.titleType')}>{span.getIn(['data', 'sdk', 'custom', 'tags', 'spanType'])}</Di>
      </Dl>
    </div>
  );
}
