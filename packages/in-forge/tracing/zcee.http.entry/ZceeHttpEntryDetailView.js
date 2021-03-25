/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import AdditionalAttributesSection from 'in-sdk/components/traceDetails/AdditionalAttributesSection';
import { HttpSpanDetailViewDescriptionList } from 'in-forge/tracing/http/HttpSpanDetailView';
import { Di, Dl } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function ZceeHttpEntryDetailView({ span }) {
  return (
    <Dl>
      <HttpSpanDetailViewDescriptionList span={span} />
      <ZceeDescriptionItems span={span} />
    </Dl>
  );
}

function ZceeDescriptionItems({ span }) {
  return (
    <AdditionalAttributesSection title="z/OS Connect EE Attributes Attributes">
      <Di title={t('in-forge:tracing.zcee.titleServiceName')}>{span.getIn(['data', 'zcee', 'service_name'])}</Di>
      <Di title={t('in-forge:tracing.zcee.titleApiName')}>{span.getIn(['data', 'zcee', 'api_name'])}</Di>
      <Di title={t('in-forge:tracing.zcee.titleRequestId')}>{span.getIn(['data', 'zcee', 'request_id'])}</Di>
      <Di title={t('in-forge:tracing.zcee.titleCorrelator')}>{span.getIn(['data', 'zcee', 'correlator'])}</Di>
    </AdditionalAttributesSection>
  );
}
