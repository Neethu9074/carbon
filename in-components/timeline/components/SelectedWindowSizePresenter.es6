import {TransitionMotion, spring} from 'react-motion';
import {create} from 'reactive-observables';
import React from 'react';

import {timeframe$, isCollapsed$} from 'in-components/timeline/timelineStore';
import {formatDurationAccurately} from 'in-services/formatters/date';
import {setTimeout, clearTimeout} from 'in-services/chronos';
import connectTo from 'in-hoc/connectTo';

import './SelectedWindowSizePresenter.less';

const block = 'in-selected-window-size-presenter';


const shownMessage$ = create();

// automatically clear temporary notifications after 6 seconds
shownMessage$
  .debounce(3000, {setTimeout, clearTimeout, leading: false})
  .subscribe(message => {
    if (!message) {
      return;
    }

    shownMessage$.emit(null);
  });

// automatically show a message when the focused moment is changed
timeframe$
  .skipFirst()
  .map(timeframe => timeframe.windowSize)
  .distinct()
  .subscribe(windowSize => {
    shownMessage$.emit(windowSize);
  });


export default connectTo({
    shownMessage: shownMessage$,
    isCollapsed: isCollapsed$
  }, function SelectedWindowSizePresenter({shownMessage, isCollapsed}) {
    const items = [];
    if (shownMessage) {
      items.push({
        key: 'message',
        style: {opacity: spring(1)},
        data: shownMessage
      });
    }

    let classes = block;
    if (!isCollapsed) {
      classes = `${classes} ${block}--timeline-expanded`;
    }

    return (
      <TransitionMotion willLeave={willLeave}
                        willEnter={willEnter}
                        styles={items}>
        {interpolatedStyles =>
          <div>
            {interpolatedStyles.map(config => {
              return (
                <div key={config.key}
                     className={classes}
                     style={{
                       opacity: config.style.opacity
                     }}>
                  <div className={block + '__time'}>
                    {formatDurationAccurately(config.data)}
                  </div>
                </div>
              );
            })}
          </div>
        }
      </TransitionMotion>
    );
  }
);


function willEnter() {
  return {opacity: 0};
}

function willLeave() {
  return {opacity: spring(0)};
}
