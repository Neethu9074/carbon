/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function AceSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.jms.titleDestination')}>{span.getIn(['data', 'ace', 'flow'])}</Di>
        <Di title={t('in-forge:tracing.jms.titleType')}>{span.getIn(['data', 'sdk', 'custom', 'tags', 'spanType'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'ace', 'error'])} />
      </Dl>
    </div>
  );
}
