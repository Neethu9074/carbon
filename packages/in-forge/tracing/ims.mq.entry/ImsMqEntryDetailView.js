/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import AdditionalAttributesSection from 'in-sdk/components/traceDetails/AdditionalAttributesSection';
import { Di, Dl } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function ImsMqEntryDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.ims.titleDestination')}>{span.getIn(['data', 'mq', 'queue'])}</Di>
      </Dl>

      <Dl>
        <ImsDescriptionItems span={span} />
      </Dl>
    </div>
  );
}

function ImsDescriptionItems({ span }) {
  return (
    <AdditionalAttributesSection title={t('in-forge:tracing.ims.titleImsAttributes')}>
      <Di title={t('in-forge:tracing.ims.titleEventKey')}>{span.getIn(['data', 'ims', 'event_key'])}</Di>
      <Di title={t('in-forge:tracing.ims.titleComponent')}>{span.getIn(['data', 'ims', 'component'])}</Di>
    </AdditionalAttributesSection>
  );
}
