import React from 'react';

import { getCommonDescriptionItems } from 'in-forge/tracing/page/commonEumSpanItems';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getTraceViewLinkShowingTrace } from 'in-stores/navigation/view';
import convertHexToLong from 'in-services/subscription/hexToLong';
import { selectedTraceId$ } from 'in-stores/traces';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

const statusMapping = {
  e: 'Page transition aborted due to error',
  u: 'Unsupported status provided',
  c: 'Successful page transition',
  a: 'Aborted page transition'
};

export default connectTo(
  props => {
    const pageLoadTraceId = props.span.getIn(['data', 'spa', 'plt']);
    if (!pageLoadTraceId) {
      return {};
    }

    const pageLoadTraceId$ = convertHexToLong(pageLoadTraceId);

    return {
      pageLoadTraceId: pageLoadTraceId$,
      selectedTraceId: selectedTraceId$,
      pageLoadTraceLink: pageLoadTraceId$.flatMap(traceId => getTraceViewLinkShowingTrace(traceId))
    };
  },
  function SpaSpanDetailView({ span, pageLoadTraceLink, pageLoadTraceId, selectedTraceId }) {
    return (
      <div>
        {pageLoadTraceLink && pageLoadTraceId !== selectedTraceId
          ? <Button href={pageLoadTraceLink} className="pull-right" kind="secondary">
              Open page load trace
            </Button>
          : null}

        <DescriptionList>
          <DescriptionItem title="URL">
            {span.getIn(['data', 'spa', 'url'])}
          </DescriptionItem>
          <DescriptionItem title="Status">
            {statusMapping[span.getIn(['data', 'spa', 'status'], statusMapping.u)]}
          </DescriptionItem>
          <DescriptionItem title="Explanation">
            {span.getIn(['data', 'spa', 'explanation'])}
          </DescriptionItem>

          {getCommonDescriptionItems(span)}
        </DescriptionList>
      </div>
    );
  }
);
