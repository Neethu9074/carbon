/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import AdditionalAttributesSection from 'in-sdk/components/traceDetails/AdditionalAttributesSection';
import { RpcSpanDetailViewDescriptionList } from 'in-forge/tracing/rpc/RpcSpanDetailView';
import { Di, Dl } from 'in-components/HorizontalDescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function CtgRpcEntryDetailView({ span }) {
  return (
    <Dl>
      <RpcSpanDetailViewDescriptionList span={span} />
      <CtgDescriptionItems span={span} />
      {span.getIn(['data', 'ctg', 'calls']) && (
        <AdditionalAttributesSection title={t('in-forge:tracing.ctg.titleCalls')}>
          <Di verticalDisplay>{getCtgCalls(span)}</Di>
        </AdditionalAttributesSection>
      )}
    </Dl>
  );
}

function CtgDescriptionItems({ span }) {
  return (
    <AdditionalAttributesSection title={t('in-forge:tracing.ctg.titleCtgAttributes')}>
      <Di title={t('in-forge:tracing.ctg.ctgReturnCode')}>{span.getIn(['data', 'ctg', 'ctg_return_code'])}</Di>
      <Di title={t('in-forge:tracing.ctg.cicsReturnCode')}>{span.getIn(['data', 'ctg', 'cics_return_code'])}</Di>
      <Di title={t('in-forge:tracing.ctg.transactionName')}>{span.getIn(['data', 'ctg', 'transaction_name'])}</Di>
    </AdditionalAttributesSection>
  );
}

function getCtgCalls(span) {
  return span
    .getIn(['data', 'ctg', 'calls'], emptyMap)
    .map((v, k) => {
      return (
        <Di title={t('in-forge:tracing.ctg.calls', { call: k })} key={`${k}`}>
          {v.replaceAll(',', '\n')}
        </Di>
      );
    })
    .valueSeq()
    .toArray();
}
