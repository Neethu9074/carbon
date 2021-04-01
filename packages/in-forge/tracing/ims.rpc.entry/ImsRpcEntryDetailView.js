/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import AdditionalAttributesSection from 'in-sdk/components/traceDetails/AdditionalAttributesSection';
import { RpcSpanDetailViewDescriptionList } from 'in-forge/tracing/rpc/RpcSpanDetailView';
import { Di, Dl } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function ImsRpcEntryDetailView({ span }) {
  return (
    <Dl>
      <RpcSpanDetailViewDescriptionList span={span} />
      <ImsDescriptionItems span={span} />
    </Dl>
  );
}

function ImsDescriptionItems({ span }) {
  return (
    <AdditionalAttributesSection title="IMS Attributes">
      <Di title={t('in-forge:tracing.ims.titleEventKey')}>{span.getIn(['data', 'ims', 'event_key'])}</Di>
      <Di title={t('in-forge:tracing.ims.titleComponent')}>{span.getIn(['data', 'ims', 'component'])}</Di>
    </AdditionalAttributesSection>
  );
}
