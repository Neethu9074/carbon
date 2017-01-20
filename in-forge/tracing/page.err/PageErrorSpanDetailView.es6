import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {getTraceViewLinkShowingTrace} from 'in-stores/navigation/view';
import convertHexToLong from 'in-services/subscription/hexToLong';
import Code from 'in-sdk/components/traceDetails/Code';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  const pageLoadTraceId = props.span.getIn(['data', 'pageErr', 'plt']);
  if (!pageLoadTraceId) {
    return {};
  }

  const pageLoadTraceId$ = convertHexToLong(pageLoadTraceId);

  return {
    pageLoadTraceId: pageLoadTraceId$,
    pageLoadTraceLink: pageLoadTraceId$
      .flatMap(traceId => getTraceViewLinkShowingTrace(traceId))
  };
}, function PageErrorSpanDetailView({span, pageLoadTraceLink, pageLoadTraceId}) {
  const error = span.getIn(['data', 'pageErr', 'error']);

  return (
    <div>
      {pageLoadTraceLink && pageLoadTraceId ?
        <Button href={pageLoadTraceLink}
                className='pull-right'
                kind='secondary'>
          Open page load trace
        </Button>
      : null}

      <DescriptionList>
        <DescriptionItem title='Application'>
          {span.getIn(['data', 'pageErr', 'appName'])}
        </DescriptionItem>

        <DescriptionItem title='URL'>
          <a href={span.getIn(['data', 'pageErr', 'url'])}
             target='_blank'
             rel='noopener noreferrer'>
            {span.getIn(['data', 'pageErr', 'url'])}
          </a>
        </DescriptionItem>

        {error ?
          <DescriptionItem title='Error'>
            <Code code={JSON.stringify(error, 0, 2)}
                  lang='json' />
          </DescriptionItem>
        : null}
      </DescriptionList>
    </div>
  );
});
