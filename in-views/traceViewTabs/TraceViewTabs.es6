import React from 'react';

import { traceAnalyticsViewLink$, traceViewLink$ } from 'in-stores/navigation/view';
import { analysedTraces$ } from 'in-stores/traces/analytics/analysedTraces';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import { evaluateClassNames } from 'in-services/util/classnames';
import { traceAnalyticsEnabled } from 'in-services/featureFlags';
import { totalTraceCountActiveFilter$ } from 'in-stores/traces';
import Count from 'in-views/traceViewTabs/components/Count';
import traceRoutes from 'in-client/js/routes/tracesRoutes';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './TraceViewTabs.less';

const block = 'in-trace-view-tabs';
const tabElement = `${block}__tab`;
const activeTabElement = `${tabElement}--active`;
const linkElement = `${block}__link`;

export default connectTo(
  {
    navigationParameters: navigationParameters$
  },
  function TraceViewTabs({ navigationParameters }) {
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

                <Link href$={traceViewLink$} className={linkElement}>
                  <em>Traces</em> <Count count$={totalTraceCountActiveFilter$} />
                </Link>
              </li>
              <li
                className={evaluateClassNames({
                  [tabElement]: true,
                  [activeTabElement]: navigationParameters.pathname.indexOf('/traces/analytics') === 0
                })}
              >
                <Link href$={traceAnalyticsViewLink$} className={linkElement}>
                  <em>Analytics</em> <Count count$={analysedTraces$.map(map => map.size)} />
                </Link>
              </li>
            </ul>
          : null}

        {traceRoutes}

      </FullscreenOverlayView>
    );
  }
);
