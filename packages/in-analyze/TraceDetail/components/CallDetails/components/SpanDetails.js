/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import CustomDataDescriptionItem from 'in-forge/tracing/sdk/CustomDataDescriptionItem';
import convert from 'in-analyze/TraceDetail/components/CallDetails/fakedSpanConverter';
import SpanForgeDetails from 'in-components/SpanForgeDetails/SpanForgeDetails';
import { getSpanDefinition, getTypeLabelSingular } from 'in-sdk/tracing';
import { Di, Dl } from 'in-new-components/HorizontalDescriptionList';
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
          <Di title={t('in-analyze:traceDetail.components.callDetails.type')}>{getTypeLabelSingular(span)}</Di>
          <Di title={t('in-analyze:traceDetail.components.callDetails.category')}>{spanDefinition.category}</Di>
        </Dl>
        <SpanForgeDetails key={call.id} span={convertedSpan} />
        <CustomDataDescriptionItem span={convertedSpan} />
      </Fragment>
    );
  }
);
