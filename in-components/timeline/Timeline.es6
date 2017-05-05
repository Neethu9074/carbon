import React from 'react';

import SelectedWindowSizePresenter from 'in-components/timeline/components/SelectedWindowSizePresenter';
import TimelineCanvasReactWrapper from 'in-components/timeline/components/TimelineCanvasReactWrapper';
import TimelineTimeframeMarker from 'in-components/timeline/components/TimelineTimeframeMarker';
import { isCollapsed$, showTimeSelector$ } from 'in-components/timeline/timelineStore';
import TimelineNavigation from 'in-components/timeline/components/TimelineNavigation';
import DateTimePickerPopup from 'in-components/timeline/components/DatePicker';
import TimelineMenu from 'in-components/timeline/components/TimelineMenu';
import EventTooltip from 'in-components/timeline/components/EventTooltip';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getSetting$ } from 'in-services/settings';
import connectTo from 'in-hoc/connectTo';

import './Timeline.less';

const block = 'in-timeline';

export default connectTo(
  {
    isCollapsed: isCollapsed$,
    showTimeSelector: showTimeSelector$,
    autoCollapseTimeline: getSetting$('autoCollapseTimeline')
  },
  function Timeline({ showTimeSelector, isCollapsed, autoCollapseTimeline }) {
    return (
      <div>
        <EventTooltip />

        {showTimeSelector ? <DateTimePickerPopup openInView={showTimeSelector} /> : null}

        <div
          className={evaluateClassNames({
            [block]: true,
            [`${block}--expanded`]: !isCollapsed,
            [`${block}--no-auto-collapse`]: !autoCollapseTimeline || showTimeSelector
          })}
        >
          <div className={`${block}__wrapper`}>
            <TimelineMenu />
            <TimelineCanvasReactWrapper />
          </div>
          <div className={block + '__bottom'}>
            <TimelineNavigation />
            <TimelineTimeframeMarker />
          </div>
        </div>

        <SelectedWindowSizePresenter />
      </div>
    );
  }
);
