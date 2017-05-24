import React from 'react';

import { traceViewLink$, traceAnalyticsViewLink$ } from 'in-stores/navigation/view';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import { selectedTracesCount$ } from 'in-stores/traces/analytics';
import { totalTraceCountActiveFilter$ } from 'in-stores/traces';
import { evaluateClassNames } from 'in-services/util/classnames';
import { traceAnalyticsEnabled } from 'in-services/featureFlags';
import Count from 'in-views/traceViewTabs/components/Count';
import connectTo from 'in-hoc/connectTo';

import './TraceViewTabs.less';

const block = 'in-trace-view-tabs';
const tabElement = `${block}__tab`;
const activeTabElement = `${tabElement}--active`;
const linkElement = `${block}__link`;

export default connectTo(
  {
    navigationParameters: navigationParameters$,
    traceViewLink: traceViewLink$,
    traceAnalyticsViewLink: traceAnalyticsViewLink$
  },
  function TraceViewTabs({ children, navigationParameters, traceViewLink, traceAnalyticsViewLink }) {
    return (
      <FullscreenOverlayView className={block}>
        {traceAnalyticsEnabled
          ? <ul className={`${block}__tabs`}>
              <li
                className={evaluateClassNames({
                  [tabElement]: true,
                  [activeTabElement]: navigationParameters.pathname.indexOf('/traces/search') === 0
                })}
              >
                <a href={traceViewLink} className={linkElement}>
                  <em>Traces</em> <Count count$={totalTraceCountActiveFilter$} />
                </a>
              </li>
              <li
                className={evaluateClassNames({
                  [tabElement]: true,
                  [activeTabElement]: navigationParameters.pathname.indexOf('/traces/analytics') === 0
                })}
              >
                <a href={traceAnalyticsViewLink} className={linkElement}>
                  <em>Analytics</em> <Count count$={selectedTracesCount$} />
                </a>
              </li>
            </ul>
          : null}

        {children}
      </FullscreenOverlayView>
    );
  }
);
