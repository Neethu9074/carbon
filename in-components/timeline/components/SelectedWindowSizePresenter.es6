import {TransitionMotion, spring} from 'react-motion';
import {create} from 'reactive-observables';
import moment from 'moment';
import React from 'react';

import {timeframe$} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';

import './SelectedWindowSizePresenter.less';

const block = 'in-selected-window-size-presenter';


const shownMessage$ = create();

// automatically clear temporary notifications after 6 seconds
shownMessage$
  .debounce(3000, {leading: false})
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
    shownMessage: shownMessage$
  }, function SelectedWindowSizePresenter({shownMessage}) {
    const items = [];
    if (shownMessage) {
      items.push({
        key: 'message',
        style: {opacity: spring(1)},
        data: shownMessage
      });
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
                     className={block}
                     style={{
                       opacity: config.style.opacity
                     }}>
                  Selected time window: {moment.duration(config.data).humanize()}
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
