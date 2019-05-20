import { compose, lifecycle } from 'recompose';
import React from 'react';

import {
  init as initEventsInTimeframe,
  disposeSubscription as disposeEventsInTimeframeSubscription
} from 'in-stores/eventsInTimeframe';
import TimelineCanvasReactWrapper from 'in-views/eventView/components/timeline/components/TimelineCanvasReactWrapper';
import { init as initTimelineStore, isCollapsed$ } from 'in-components/timeline/timelineStore';
import TimelineMenu from 'in-views/eventView/components/timeline/components/TimelineMenu';
import EventTooltip from 'in-views/eventView/components/timeline/components/EventTooltip';
import { evaluateClassNames } from 'in-services/util/classnames';
import { init as initEvents } from 'in-stores/events';
import { getSetting$ } from 'in-services/settings';
import connectTo from 'in-hoc/connectTo';

import './Timeline.less';

const block = 'in-events-timeline';

export default compose(
  connectTo({
    isCollapsed: isCollapsed$,
    autoCollapseTimeline: getSetting$('autoCollapseTimeline')
  }),
  lifecycle({
    componentDidMount() {
      initTimelineStore(true);
      initEvents();
      initEventsInTimeframe(true);
    },
    componentWillUnmount() {
      disposeEventsInTimeframeSubscription();
    }
  })
)(Timeline);

function Timeline({ isCollapsed, autoCollapseTimeline }) {
  return (
    <div className={`${block}__wrapper`}>
      <EventTooltip />

      <div
        className={evaluateClassNames({
          [block]: true,
          [`${block}--expanded`]: !isCollapsed,
          [`${block}--no-auto-collapse`]: !autoCollapseTimeline
        })}
      >
        <div className={`${block}__menu`}>
          <TimelineMenu />
          <TimelineCanvasReactWrapper />
        </div>
      </div>
    </div>
  );
}
