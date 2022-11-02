/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import AdditionalAttributesSection from 'in-sdk/components/traceDetails/AdditionalAttributesSection';
import { t } from 'in-i18n';

export default function AzureFunctionsSpanDetailView({ span }) {
    return (
        <Dl>
            <CommonDescriptionItems span={span} />
        </Dl>
      );
}

function CommonDescriptionItems({ span }) {
    return (
      <AdditionalAttributesSection title={t('in-forge:tracing.azf.titleAZFAttributes')}>
        <Di title={t('in-forge:tracing.azf.titleTrigger')}>{span.getIn(['data', 'azf', 'triggername'])}</Di>
        <Di title={t('in-forge:tracing.azf.titleMethodName')}>{span.getIn(['data', 'azf', 'methodname'])}</Di>
        <Di title={t('in-forge:tracing.azf.titleFunctionName')}>{span.getIn(['data', 'azf', 'functionname'])}</Di>
        <Di title={t('in-forge:tracing.azf.titleRuntime')}>{span.getIn(['data', 'azf', 'runtime'])}</Di>
      </AdditionalAttributesSection>
    );
}

