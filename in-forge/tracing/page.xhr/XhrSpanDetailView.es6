import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {getTraceViewLinkShowingTrace} from 'in-stores/navigation/view';
import convertHexToLong from 'in-services/subscription/hexToLong';
import {selectedTraceId$} from 'in-stores/traces';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
  const pageLoadTraceId = props.span.getIn(['data', 'page_xhr', 'plt']);
  if (!pageLoadTraceId) {
    return {};
  }

  const pageLoadTraceId$ = convertHexToLong(pageLoadTraceId);

  return {
    pageLoadTraceId: pageLoadTraceId$,
    selectedTraceId: selectedTraceId$,
    pageLoadTraceLink: pageLoadTraceId$
      .flatMap(traceId => getTraceViewLinkShowingTrace(traceId))
  };
}, function XhrSpanDetailView({span, pageLoadTraceLink, pageLoadTraceId, selectedTraceId}) {
  return (
    <div>
      {pageLoadTraceLink && pageLoadTraceId !== selectedTraceId ?
        <Button href={pageLoadTraceLink}
                className='pull-right'
                kind='secondary'>
          Open page load trace
        </Button>
      : null}

      <DescriptionList>
        <DescriptionItem title='Host'>
          {span.getIn(['data', 'http', 'host'])}
        </DescriptionItem>
        <DescriptionItem title='URL'>
          {span.getIn(['data', 'http', 'url'])}
        </DescriptionItem>
        <DescriptionItem title='Method'>
          {span.getIn(['data', 'http', 'method'])}
        </DescriptionItem>
        <DescriptionItem title='Status Code'>
          {span.getIn(['data', 'http', 'status'])}
        </DescriptionItem>
        <DescriptionItem title='Error'>
          {span.getIn(['data', 'http', 'error'])}
        </DescriptionItem>
        <DescriptionItem title='Page Load'>
          {span.getIn(['data', 'http', 'error'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
});
