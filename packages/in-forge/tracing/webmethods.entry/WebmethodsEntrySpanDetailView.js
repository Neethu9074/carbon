/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import AdditionalAttributesSection from 'in-sdk/components/traceDetails/AdditionalAttributesSection';
import { HttpSpanDetailViewDescriptionList } from 'in-forge/tracing/http/HttpSpanDetailView';
import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Di, Dl } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function WebmethodsEntrySpanDetailView({ span }) {
  return (
    <Dl>
      <HttpSpanDetailViewDescriptionList span={span} />
      <WebmethodsEntryDescriptionItems span={span} />
      <ErrorDescriptionItem error={span.getIn(['data', 'webmethods', 'error'])} />
    </Dl>
  );
}

function WebmethodsEntryDescriptionItems({ span }) {
  return (
    <AdditionalAttributesSection title={t('in-forge:tracing.webmethods.titleAttributes')}>
      <Di title={t('in-forge:tracing.webmethods.titlePackage')}>{span.getIn(['data', 'webmethods', 'package'])}</Di>
      <Di title={t('in-forge:tracing.webmethods.titleService')}>{span.getIn(['data', 'webmethods', 'service'])}</Di>
      <Di title={t('in-forge:tracing.webmethods.titleServiceType')}>
        {span.getIn(['data', 'webmethods', 'serviceType'])}
      </Di>
    </AdditionalAttributesSection>
  );
}
