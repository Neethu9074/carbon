/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { HttpSpanDetailViewDescriptionList } from 'in-forge/tracing/http/HttpSpanDetailView';
import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { emptyList } from 'in-services/fixedImmutables';
import { identity } from 'in-services/util/function';

import locals from './AwsLambdaEntryDetailView.mless';

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
    <Fragment>
      <Di title="Event Type">CloudWatch Event(s)</Di>
      <ListWithMore
        title="Event Resources"
        span={span}
        pathToItems={['data', 'lambda', 'cw', 'events', 'resources']}
        pathToMore={['data', 'lambda', 'cw', 'events', 'more']}
        labelMore="resources"
      />
    </Fragment>
  );
}

function CloudWatchLogsDetails({ span }) {
  return (
    <Fragment>
      <Di title="Event Type">CloudWatch Event(s)</Di>
      <Di title="Log Group">{span.getIn(['data', 'lambda', 'cw', 'logs', 'group'])}</Di>
      <Di title="Log Stream">{span.getIn(['data', 'lambda', 'cw', 'logs', 'stream'])}</Di>
      <ListWithMore
        title="Log Events"
        span={span}
        pathToItems={['data', 'lambda', 'cw', 'logs', 'events']}
        pathToMore={['data', 'lambda', 'cw', 'logs', 'more']}
        labelMore="events"
      />
    </Fragment>
  );
}

function S3EventDetails({ span }) {
  return (
    <Fragment>
      <Di title="Event Type">AWS S3 Event(s)</Di>
      <ListWithMore
        title="Event Details"
        span={span}
        pathToItems={['data', 'lambda', 's3', 'events']}
        itemMapper={s3Event => `${s3Event.event}: ${s3Event.bucket} - ${s3Event.object}`}
        pathToMore={['data', 'lambda', 's3', 'more']}
        labelMore="S3 events"
      />
    </Fragment>
  );
}

function SqsDetails({ span }) {
  return (
    <Fragment>
      <Di title="Event Type">AWS SQS Message(s)</Di>
      <ListWithMore
        title="Queues"
        span={span}
        pathToItems={['data', 'lambda', 'sqs', 'messages']}
        itemMapper={sqsMessage => sqsMessage.queue}
        pathToMore={['data', 'lambda', 'sqs', 'more']}
        labelMore="messages"
      />
    </Fragment>
  );
}

function UnknownTriggerDetails() {
  return (
    <Fragment>
      <Di title="Event Type">AWS Event</Di>
      <Di title="Event Details">
        An API Gateway call that does not use the Lambda Proxy option or an unidentified Lambda trigger.
      </Di>
    </Fragment>
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
  return (
    <Fragment>
      <div className={locals.header}>Lambda Attributes</div>
      <Di title="ARN">{span.getIn(['data', 'lambda', 'arn'])}</Di>
      <Di title="Function Name">{span.getIn(['data', 'lambda', 'functionName'])}</Di>
      <Di title="Version">{span.getIn(['data', 'lambda', 'functionVersion'])}</Di>
      <Di title="Trigger">{span.getIn(['data', 'lambda', 'trigger'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'lambda', 'error'])} />
    </Fragment>
  );
}
