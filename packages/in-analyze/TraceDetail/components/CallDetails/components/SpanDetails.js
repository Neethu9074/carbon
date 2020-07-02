import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import CustomDataDescriptionItem from 'in-forge/tracing/sdk/CustomDataDescriptionItem';
import convert from 'in-analyze/TraceDetail/components/CallDetails/fakedSpanConverter';
import SpanForgeDetails from 'in-components/SpanForgeDetails/SpanForgeDetails';
import { Di, Dl } from 'in-new-components/HorizontalDescriptionList';
import { getSpanDefinition } from 'in-sdk/tracing';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function SpanDetails({ call, span, isInternalVisible }) {
    const convertedSpan = fromJS(convert(span));
    const spanDefinition = getSpanDefinition(span.name, span);
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
          <Di title="Type">{spanDefinition.typeName.singular}</Di>
          <Di title="Category">{spanDefinition.category}</Di>
        </Dl>
        <SpanForgeDetails key={call.id} span={convertedSpan} />
        <CustomDataDescriptionItem span={convertedSpan} />
      </Fragment>
    );
  }
);
