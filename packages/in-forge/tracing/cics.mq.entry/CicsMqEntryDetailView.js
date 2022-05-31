/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import AdditionalAttributesSection from 'in-sdk/components/traceDetails/AdditionalAttributesSection';
import { Di, Dl } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function CicsMqEntryDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.cics.titleDestination')}>{span.getIn(['data', 'mq', 'queue'])}</Di>
      </Dl>

      <Dl>
        <CicsDescriptionItems span={span} />
      </Dl>
    </div>
  );
}

function CicsDescriptionItems({ span }) {
  return (
    <AdditionalAttributesSection title={t('in-forge:tracing.cics.titleCicsAttributes')}>
      <Di title={t('in-forge:tracing.cics.titleUserId')}>{span.getIn(['data', 'cics', 'user_id'])}</Di>
      <Di title={t('in-forge:tracing.cics.titleTaskNumber')}>{span.getIn(['data', 'cics', 'task_number'])}</Di>
      <Di title={t('in-forge:tracing.cics.titleRegion')}>{span.getIn(['data', 'cics', 'region'])}</Di>
    </AdditionalAttributesSection>
  );
}
