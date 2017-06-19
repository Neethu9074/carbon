import React from 'react';

import { getCommonDescriptionItems } from 'in-forge/tracing/page/commonEumSpanItems';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getTraceViewLinkShowingTrace } from 'in-stores/navigation/view';
import Notification from 'in-sdk/components/traceDetails/Notification';
import convertHexToLong from 'in-services/subscription/hexToLong';
import Code from 'in-sdk/components/traceDetails/Code';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const pageLoadTraceId = props.span.getIn(['data', 'pageErr', 'plt']);
    if (!pageLoadTraceId) {
      return {};
    }

    const pageLoadTraceId$ = convertHexToLong(pageLoadTraceId);

    return {
      pageLoadTraceId: pageLoadTraceId$,
      pageLoadTraceLink: pageLoadTraceId$.flatMap(traceId => getTraceViewLinkShowingTrace(traceId))
    };
  },
  function PageErrorSpanDetailView({ span, pageLoadTraceLink, pageLoadTraceId }) {
    const error = span.getIn(['data', 'pageErr', 'error']);
    const isErrorNotReadableDueToSameOriginPolicy = /^Script Error\.?/i.test(error.get('message', ''));

    return (
      <div>
        {pageLoadTraceLink && pageLoadTraceId
          ? <Button href={pageLoadTraceLink} className="pull-right" kind="secondary">
              Open page load trace
            </Button>
          : null}

        <DescriptionList>
          <DescriptionItem title="URL">
            <a href={span.getIn(['data', 'pageErr', 'url'])} target="_blank" rel="noopener noreferrer">
              {span.getIn(['data', 'pageErr', 'url'])}
            </a>
          </DescriptionItem>

          {getCommonDescriptionItems(span)}

          {!isErrorNotReadableDueToSameOriginPolicy && error
            ? <DescriptionItem title="Error Message">
                {error.get('message')}
              </DescriptionItem>
            : null}

          {!isErrorNotReadableDueToSameOriginPolicy && error && error.get('stack')
            ? <DescriptionItem title="Stack Trace">
                <Code code={error.get('stack')} />
              </DescriptionItem>
            : null}
        </DescriptionList>

        {isErrorNotReadableDueToSameOriginPolicy
          ? <Notification type="info">
              <strong>Error details not accessible.</strong>{' '}
              Due to same-origin policy restrictions, the browser did not permit access to the error message and{' '}
              stack trace of this uncaught error. To gain visibility into these error details, please add the{' '}
              <code>crossorigin=&quot;anonymous&quot;</code> attribute to HTML script tags and serve JavaScript files{' '}
              with an <code>Access-Control-Allow-Origin: *</code> HTTP header.
            </Notification>
          : null}
      </div>
    );
  }
);
