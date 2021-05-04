/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import { Card } from '@instana/components';

import SidebarTagList from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/SidebarTagList';
import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import convert from 'in-applications/analyze/components/TraceDetails/components/CallDetails/fakedSpanConverter';
import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import SpanForgeDetails from 'in-components/SpanForgeDetails/SpanForgeDetails';
import { getSpanDefinition, getTypeLabelSingular } from 'in-sdk/tracing';
import { Di, Dl } from 'in-new-components/HorizontalDescriptionList';
import { expandNestedSerializedJson } from 'in-services/util/json';
import { flatten } from 'in-forge/tracing/sdk/flatten';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function SpanDetails({ call, span, isInternalVisible }) {
    const convertedSpan = fromJS(convert(span));
    const spanDefinition = getSpanDefinition(span.name, span);
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
      </Fragment>
    );
  }
);

function CustomTags({ span }) {
  let custom = span.getIn(['data', 'sdk', 'custom', 'tags']);
  if (!custom || custom.isEmpty()) {
    return null;
  }

  const speciallyRenderedTags = [
    // span.data.sdk.custom.tags.message is to be rendered using ErrorDescriptionItem
    'message'
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
      <Card title={t('in-analyze:traceDetail.components.callDetails.tags')} withoutPadding>
        <SidebarTagList tags={tags} />
      </Card>
    </>
  );
}
