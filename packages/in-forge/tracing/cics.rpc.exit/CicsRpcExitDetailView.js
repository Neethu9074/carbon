/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import AdditionalAttributesSection from 'in-sdk/components/traceDetails/AdditionalAttributesSection';
import { RpcSpanDetailViewDescriptionList } from 'in-forge/tracing/rpc/RpcSpanDetailView';
import { Di, Dl } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function CicsRpcExitDetailView({ span }) {
  return (
    <Dl>
      <RpcSpanDetailViewDescriptionList span={span} />
      <CicsDescriptionItems span={span} />
    </Dl>
  );
}

function CicsDescriptionItems({ span }) {
  return (
    <AdditionalAttributesSection title="CICS Attributes">
      <Di title={t('in-forge:tracing.cics.titleUserId')}>{span.getIn(['data', 'cics', 'user_id'])}</Di>
      <Di title={t('in-forge:tracing.cics.titleTaskNumber')}>{span.getIn(['data', 'cics', 'task_number'])}</Di>
      <Di title={t('in-forge:tracing.cics.titleRegion')}>{span.getIn(['data', 'cics', 'region'])}</Di>
    </AdditionalAttributesSection>
  );
}
