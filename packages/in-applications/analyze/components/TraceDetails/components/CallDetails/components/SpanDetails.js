/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';

import SidebarTagList from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/SidebarTagList';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import convert from 'in-applications/analyze/components/TraceDetails/components/CallDetails/fakedSpanConverter';
import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import SpanForgeDetails from 'in-components/SpanForgeDetails/SpanForgeDetails';
import { getSpanDefinition, getTypeLabelSingular } from 'in-sdk/tracing';
import { expandNestedSerializedJson } from 'in-services/util/json';
import { Di, Dl } from 'in-components/HorizontalDescriptionList';
import { flatten } from 'in-forge/tracing/sdk/flatten';
import { t } from 'in-i18n';

export default function SpanDetails({ call, span }) {
  const convertedSpan = fromJS(convert(span, call));
  const spanDefinition = getSpanDefinition(span.name, span);
  const isInternalVisible = useObservable(isInternalVisible$, []);
  const hasCxfType = isInternalVisible && span.data?.cxf?.type;

  if (hasCxfType) {
    var cxfType = span.data.cxf.type;
    switch (span.data.cxf.type) {
      case 'apache':
        cxfType = 'Apache CXF';
        break;
      case 'ri':
        cxfType = 'JAX-WS RI';
        break;
      case 'rt':
        cxfType = 'JAX-WS RT';
        break;
    }
  }
  return (
    <Fragment>
      {isInternalVisible && (
        <Dl>
          <Di title="span.n">{span.name}</Di>
          <Di title="span.ec">{span.errorCount}</Di>
          <Di title="span.kind">{span.kind}</Di>
        </Dl>
      )}
      <Dl>
        {hasCxfType && <Di title={t('in-analyze:traceDetail.components.callDetails.cxfType')}>{cxfType}</Di>}
        <Di title={t('in-analyze:traceDetail.components.callDetails.type')}>{getTypeLabelSingular(convertedSpan)}</Di>
        <Di title={t('in-analyze:traceDetail.components.callDetails.category')}>{spanDefinition.category}</Di>
      </Dl>
      <SpanForgeDetails key={call.id} span={convertedSpan} />
      <CustomTags span={convertedSpan} />
      {isInternalVisible && <CustomMetrics span={convertedSpan} />}
    </Fragment>
  );
}

function CustomTags({ span }) {
  let custom = span.getIn(['data', 'sdk', 'custom', 'tags']);
  if (!custom || custom.isEmpty()) {
    return null;
  }

  const speciallyRenderedTags = [
    // span.data.sdk.custom.tags.message is to be rendered using ErrorDescriptionItem
    'message',
    // span.data.sdk.custom.tags.metrics is to be rendered using CustomMetrics
    'metrics'
  ];

  const errorMessage = span.getIn(['data', 'sdk', 'custom', 'tags', 'message']);
  custom = custom.filter((value, key) => !speciallyRenderedTags.includes(key));
  let tags = flatten(expandNestedSerializedJson(custom.toJS()));
  tags = Object.keys(tags).map(key => ({
    name: key,
    value: String(tags[key])
  }));

  return (
    <>
      {errorMessage && (
        <Dl>
          <ErrorDescriptionItem error={errorMessage} />
        </Dl>
      )}
      {tags.length > 0 && (
        <Card title={t('in-analyze:traceDetail.components.callDetails.tags')} hasMarginBottom>
          <SidebarTagList tags={tags} />
        </Card>
      )}
    </>
  );
}

function CustomMetrics({ span }) {
  const custom =
    span.getIn(['data', 'sdk', 'custom', 'tags', 'metrics']) ?? span.getIn(['data', 'sdk', 'custom', 'metrics']);
  if (!custom || custom.isEmpty()) {
    return null;
  }

  let tags = flatten(expandNestedSerializedJson(custom.toJS()));
  tags = Object.keys(tags).map(key => ({
    name: key,
    value: String(tags[key])
  }));

  return (
    <Card title={t('in-analyze:traceDetail.components.callDetails.metrics')} hasMarginBottom>
      <SidebarTagList tags={tags} />
    </Card>
  );
}
