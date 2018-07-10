import { padStart } from 'lodash';
import React from 'react';

import { getCommonDescriptionItems } from 'in-forge/tracing/page/commonEumSpanItems';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/paths/tracePaths';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import NavigationTiming from 'in-forge/tracing/page/NavigationTiming';
import BackendTraceButton from 'in-components/BackendTraceButton';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './PageRequestSpanDetailView.es6.mless';

export default connectTo(
  props => {
    const observables = {
      allTracesHref: getTraceViewLinkWithQuery(`span.website.pageLoadId:"${props.span.get('traceId')}"`)
    };
    const backendTracesList = props.span.getIn(['data', 'page', 'backend_traces']);
    if (backendTracesList && backendTracesList.size === 1) {
      observables.backendTraceIdResult = getTraceSummary({ id: padStart(backendTracesList.get(0), 16, '0') }).map(
        result => {
          if (!result.progress.loading && result.errors.length === 0) {
            return {
              progress: {
                loading: false
              },
              errors: [],
              data: result.data.id
            };
          } else {
            return result;
          }
        }
      );
    }
    return observables;
  },
  function PageRequestSpanDetailView({ span, allTracesHref, backendTraceIdResult }) {
    const timing = span.getIn(['data', 'page', 'timing']);
    return (
      <div>
        <div className={locals.buttonContainer + ' pull-right'}>
          <Button href={allTracesHref} className={locals.button} kind="secondary">
            All traces belonging to this page load
          </Button>
          <BackendTraceButton backendTraceIdResult={backendTraceIdResult} />
        </div>

        <DescriptionList>
          <DescriptionItem title="URL">
            <Link href={span.getIn(['data', 'page', 'url'])} external>
              {span.getIn(['data', 'page', 'url'])}
            </Link>
          </DescriptionItem>

          {getCommonDescriptionItems(span)}

          {timing && (
            <DescriptionItem title="Navigation Timing">
              <NavigationTiming {...timing.toJS()} />
            </DescriptionItem>
          )}
        </DescriptionList>
      </div>
    );
  }
);
