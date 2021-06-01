/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import AdditionalAttributesSection from 'in-sdk/components/traceDetails/AdditionalAttributesSection';
import { HttpSpanDetailViewDescriptionList } from 'in-forge/tracing/http/HttpSpanDetailView';
import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { emptyList } from 'in-services/fixedImmutables';
import { identity } from 'in-services/util/function';
import { t } from 'in-i18n';

const TRIGGER_AWS_API_GATEWAY = 'aws:api.gateway';
const TRIGGER_AWS_API_GATEWAY_WITHOUT_PROXY = 'aws:api.gateway.noproxy';
const TRIGGER_AWS_APPLICATION_LOAD_BALANCER = 'aws:application.load.balancer';
const TRIGGER_AWS_CLOUDWATCH_EVENTS = 'aws:cloudwatch.events';
const TRIGGER_AWS_CLOUDWATCH_LOGS = 'aws:cloudwatch.logs';
const TRIGGER_AWS_S3 = 'aws:s3';
const TRIGGER_AWS_SQS = 'aws:sqs';

const HTTP_TYPES = [TRIGGER_AWS_API_GATEWAY, TRIGGER_AWS_APPLICATION_LOAD_BALANCER];

export default function AwsLambdaEntryDetailView({ span }) {
  return (
    <Dl>
      <TriggerTypeSpecificFields span={span} />
      <CommonFaasDescriptionItems span={span} />
    </Dl>
  );
}

export function TriggerTypeSpecificFields({ span }) {
  const trigger = span.getIn(['data', 'lambda', 'trigger']);

  if (HTTP_TYPES.indexOf(trigger) >= 0) {
    return <HttpSpanDetailViewDescriptionList span={span} />;
  } else if (trigger === TRIGGER_AWS_API_GATEWAY_WITHOUT_PROXY) {
    return <ApiGatewayNoProxyDetails span={span} />;
  } else if (trigger === TRIGGER_AWS_CLOUDWATCH_EVENTS) {
    return <CloudWatchEventsDetails span={span} />;
  } else if (trigger === TRIGGER_AWS_CLOUDWATCH_LOGS) {
    return <CloudWatchLogsDetails span={span} />;
  } else if (trigger === TRIGGER_AWS_S3) {
    return <S3EventDetails span={span} />;
  } else if (trigger === TRIGGER_AWS_SQS) {
    return <SqsDetails span={span} />;
  } else {
    return <UnknownTriggerDetails span={span} />;
  }
}

function CloudWatchEventsDetails({ span }) {
  return (
    <>
      <Di title={t('in-forge:tracing.aspLambdaEntry.titleEventType')}>
        {t('in-forge:tracing.aspLambdaEntry.bodyCloudWatchEvents')}
      </Di>
      <ListWithMore
        title={t('in-forge:tracing.aspLambdaEntry.titleEventResources')}
        span={span}
        pathToItems={['data', 'lambda', 'cw', 'events', 'resources']}
        pathToMore={['data', 'lambda', 'cw', 'events', 'more']}
        labelMore={t('in-forge:tracing.aspLambdaEntry.labelResources')}
      />
    </>
  );
}

function CloudWatchLogsDetails({ span }) {
  return (
    <>
      <Di title={t('in-forge:tracing.aspLambdaEntry.titleEventType')}>
        {t('in-forge:tracing.aspLambdaEntry.bodyCloudWatchEvents')}
      </Di>
      <Di title={t('in-forge:tracing.aspLambdaEntry.titleLogGroup')}>
        {span.getIn(['data', 'lambda', 'cw', 'logs', 'group'])}
      </Di>
      <Di title={t('in-forge:tracing.aspLambdaEntry.titleLogStream')}>
        {span.getIn(['data', 'lambda', 'cw', 'logs', 'stream'])}
      </Di>
      <ListWithMore
        title={t('in-forge:tracing.aspLambdaEntry.titleLogEvents')}
        span={span}
        pathToItems={['data', 'lambda', 'cw', 'logs', 'events']}
        pathToMore={['data', 'lambda', 'cw', 'logs', 'more']}
        labelMore={t('in-forge:tracing.aspLambdaEntry.labelEvents')}
      />
    </>
  );
}

function S3EventDetails({ span }) {
  return (
    <>
      <Di title={t('in-forge:tracing.aspLambdaEntry.titleEventType')}>
        {t('in-forge:tracing.aspLambdaEntry.bodyAWSEvents')}
      </Di>
      <ListWithMore
        title={t('in-forge:tracing.aspLambdaEntry.titleDetails')}
        span={span}
        pathToItems={['data', 'lambda', 's3', 'events']}
        itemMapper={s3Event => `${s3Event.event}: ${s3Event.bucket} - ${s3Event.object}`}
        pathToMore={['data', 'lambda', 's3', 'more']}
        labelMore={t('in-forge:tracing.aspLambdaEntry.labelS3Events')}
      />
    </>
  );
}

function SqsDetails({ span }) {
  return (
    <>
      <Di title={t('in-forge:tracing.aspLambdaEntry.titleEventType')}>
        {t('in-forge:tracing.aspLambdaEntry.bodyAWSMessages')}
      </Di>
      <ListWithMore
        title={t('in-forge:tracing.aspLambdaEntry.titleQueues')}
        span={span}
        pathToItems={['data', 'lambda', 'sqs', 'messages']}
        itemMapper={sqsMessage => sqsMessage.queue}
        pathToMore={['data', 'lambda', 'sqs', 'more']}
        labelMore={t('in-forge:tracing.aspLambdaEntry.labelMessages')}
      />
    </>
  );
}

function UnknownTriggerDetails() {
  return (
    <>
      <Di title={t('in-forge:tracing.aspLambdaEntry.titleEventType')}>
        {t('in-forge:tracing.aspLambdaEntry.bodyAWSEvent')}
      </Di>
      <Di title={t('in-forge:tracing.aspLambdaEntry.titleDetails')}>
        {t('in-forge:tracing.aspLambdaEntry.bodyAWSEventDetail')}
      </Di>
    </>
  );
}

// we cannot differentiate API gateway calls that are not using the Lambda proxy from other unknown triggers.
const ApiGatewayNoProxyDetails = UnknownTriggerDetails;

function ListWithMore({ title, span, pathToItems, itemMapper = identity, pathToMore, labelMore }) {
  const items = span.getIn(pathToItems, emptyList).toJS();
  const listItems = items.map((item, idx) => <li key={idx}>{itemMapper(item)}</li>);
  if (span.getIn(pathToMore)) {
    listItems.push(<li key="more">… (more {labelMore})</li>);
  }

  return listItems.length > 0 ? (
    <Di title={title} verticalDisplay>
      <ul>{listItems}</ul>
    </Di>
  ) : null;
}

function CommonFaasDescriptionItems({ span }) {
  const millisecondsLeftBeforeTimeout = span.getIn(['data', 'lambda', 'msleft']);
  return (
    <AdditionalAttributesSection title={t('in-forge:tracing.aspLambdaEntry.titleLambdaAttributes')}>
      <Di title={t('in-forge:tracing.aspLambdaEntry.titleARN')}>{span.getIn(['data', 'lambda', 'arn'])}</Di>
      <Di title={t('in-forge:tracing.aspLambdaEntry.titleFunctionName')}>
        {span.getIn(['data', 'lambda', 'functionName'])}
      </Di>
      <Di title={t('in-forge:tracing.aspLambdaEntry.titleVersion')}>
        {span.getIn(['data', 'lambda', 'functionVersion'])}
      </Di>
      <Di title={t('in-forge:tracing.aspLambdaEntry.requestId')}>{span.getIn(['data', 'lambda', 'reqId'])}</Di>
      <Di title={t('in-forge:tracing.aspLambdaEntry.titleTrigger')}>{span.getIn(['data', 'lambda', 'trigger'])}</Di>
      <Di title={t('in-forge:tracing.aspLambdaEntry.coldStart')}>
        {span.getIn(['data', 'lambda', 'coldStart'])
          ? t('in-forge:tracing.aspLambdaEntry.yes')
          : t('in-forge:tracing.aspLambdaEntry.no')}
      </Di>
      {millisecondsLeftBeforeTimeout && (
        <Di title={t('in-forge:tracing.aspLambdaEntry.suspectedTimeout')}>
          {t('in-forge:tracing.aspLambdaEntry.timeoutMessage', { milliseconds: millisecondsLeftBeforeTimeout })}
        </Di>
      )}
      <ErrorDescriptionItem error={span.getIn(['data', 'lambda', 'error'])} />
    </AdditionalAttributesSection>
  );
}
