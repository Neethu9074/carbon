import React from 'react';

import { getCommonDescriptionItems } from 'in-forge/tracing/page/commonEumSpanItems';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import NavigationTiming from 'in-forge/tracing/page/NavigationTiming';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

export default connectTo(
  props => {
    return {
      allTracesHref: getTraceViewLinkWithQuery(`span.webEum.pageLoadId:"${props.span.get('traceId')}"`)
    };
  },
  function PageRequestSpanDetailView({ span, allTracesHref }) {
    const timing = span.getIn(['data', 'page', 'timing']);

    return (
      <div>
        <Button href={allTracesHref} className="pull-right" kind="secondary">
          All traces belonging to this page load
        </Button>

        <DescriptionList>
          <DescriptionItem title="URL">
            <Link href={span.getIn(['data', 'page', 'url'])} external>
              {span.getIn(['data', 'page', 'url'])}
            </Link>
          </DescriptionItem>

          {getCommonDescriptionItems(span)}

          {timing
            ? <DescriptionItem title="Navigation Timing">
                <NavigationTiming {...timing.toJS()} />
              </DescriptionItem>
            : null}
        </DescriptionList>
      </div>
    );
  }
);
