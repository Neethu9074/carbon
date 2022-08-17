/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { HttpSpanDetailViewDescriptionList } from 'in-forge/tracing/http/HttpSpanDetailView';
import { t } from 'in-i18n';

const TRIGGER_BLOB = 'Blob';
const TRIGGER_COSMOSDB = 'CosmosDB';
const TRIGGER_EVENTGRID = 'Event Grid';
const TRIGGER_EVENTHUB = 'Event Hub';
const TRIGGER_KAFKA = 'Kafka';
const TRIGGER_HTTP = 'HTTP';
const TRIGGER_QUEUE = 'Queue';
const TRIGGER_RABBITMQ = 'RabbitMQ';
const TRIGGER_SERVICEBUS = 'Service Bus';
const TRIGGER_TABLE = 'Table';
const TRIGGER_TIMER = 'Timer';

export default function AzureFunctionsSpanDetailView({ span }) {
    return (
        <Dl>
            <TriggerTypeSpecificFields span={span} />
            <CommonDescriptionItems span={span} />
        </Dl>
      );
}

function CommonDescriptionItems({ span }) {
    return (
      <AdditionalAttributesSection title={t('in-forge:tracing.azf.titleAZFAttributes')}>
        <Di title={t('in-forge:tracing.azf.titleTrigger')}>{span.getIn(['data', 'azf', 'triggername'])}</Di>
        <Di title={t('in-forge:tracing.azf.titleFunctionName')}>{span.getIn(['data', 'azf', 'methodname'])}</Di>
      </AdditionalAttributesSection>
    );
}

export function TriggerTypeSpecificFields({ span }) {
    const trigger = span.getIn(['data', 'azf', 'triggername']);
  
    if (trigger === TRIGGER_HTTP) {
      return <HttpSpanDetailViewDescriptionList span={span} />;
    } else {
      return <UnknownTriggerDetails span={span} />;
    }
}
  
function UnknownTriggerDetails() {
    return (
      <>
        <Di title={t('in-forge:tracing.azf.titleEventType')}>
          {t('in-forge:tracing.azf.AZFEvent')}
        </Di>
        <Di title={t('in-forge:tracing.azf.titleDetails')}>
          {t('in-forge:tracing.azf.AZFEventDetails')}
        </Di>
      </>
    );
}
