import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import convert from 'in-analyze/TraceDetail/components/CallDetails/fakedSpanConverter';
import SpanForgeDetails from 'in-components/SpanForgeDetails/SpanForgeDetails';
import { Di, Dl } from 'in-new-components/HorizontalDescriptionList';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function SpanDetails({ call, span, isInternalVisible }) {
    return (
      <Fragment>
        {isInternalVisible && (
          <Dl>
            <Di title="Span Type">{span.name}</Di>
          </Dl>
        )}
        <SpanForgeDetails key={call.id} span={fromJS(convert(span))} />
      </Fragment>
    );
  }
);
