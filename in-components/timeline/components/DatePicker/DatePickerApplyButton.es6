import { combineLatest } from 'reactive-observables';
import 'react-day-picker/lib/style.css';
import React from 'react';

import { isDateTimeValid$ as focusedMomentValid$ } from 'in-components/timeline/components/DatePicker/stores/focusedMomentDatePickerStore';
import { isDateTimeValid$ as fromValid$ } from 'in-components/timeline/components/DatePicker/stores/fromDatePickerStore';
import { isDateTimeValid$ as toValid$ } from 'in-components/timeline/components/DatePicker/stores/toDatePickerStore';
import { windowSize$ } from 'in-components/timeline/components/DatePicker/stores/windowSizeStore';
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL } from 'in-components/timeline/timelineStore';
import { closeTimeSelector } from 'in-components/timeline/timelineStore';
import { getFixedTimeframeUrl } from 'in-stores/navigation';
import { alwaysNull } from 'in-services/fixedStreams';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    if (props.live) {
      return {
        href: windowSize$.flatMap(windowSize => getFixedTimeframeUrl({ windowSize })),
        windowSize: windowSize$
      };
    }

    const config$ = combineLatest([focusedMomentValid$, fromValid$, toValid$])
      .throttle(200)
      .map(([focusedMomentValid, fromValid, toValid]) => {
        return {
          fixedTimestampsAreValid:
            focusedMomentValid.date &&
              focusedMomentValid.time &&
              fromValid.date &&
              fromValid.time &&
              toValid.date &&
              toValid.time,
          focusedMoment: focusedMomentValid.timestamp,
          from: fromValid.timestamp,
          to: toValid.timestamp
        };
      })
      .map(validations => {
        const windowSize = validations.to - validations.from;
        if (validations.fixedTimestampsAreValid) {
          return {
            focusedMoment: validations.focusedMoment,
            to: validations.to,
            isValid: true,
            windowSize
          };
        }
        return {
          isValid: false,
          windowSize
        };
      })
      .distinct();

    return {
      windowSize: config$.map(config => config.windowSize),
      href: config$.flatMap(config => {
        if (config.isValid) {
          return getFixedTimeframeUrl({
            focusedMoment: config.focusedMoment,
            windowSize: Math.max(MAX_ZOOM_LEVEL, config.windowSize),
            to: config.to
          });
        }
        return alwaysNull;
      })
    };
  },
  function ApplyButton({ href, windowSize }) {
    if (windowSize > MIN_ZOOM_LEVEL) {
      return (
        <Tooltip content="The selected time window is too big (max 31 days)">
          <Button size="sm" disabled>
            Apply
          </Button>
        </Tooltip>
      );
    }

    if (windowSize < MAX_ZOOM_LEVEL) {
      return (
        <Tooltip content="The given timewindow is too small (1 minute).">
          <Button size="sm" disabled>
            Apply
          </Button>
        </Tooltip>
      );
    }

    const isDisabled = href ? false : true;
    return (
      <Button onClick={stopAndCloseDialog} href={href} size="sm" disabled={isDisabled}>
        Apply
      </Button>
    );
  }
);

function stopAndCloseDialog(e) {
  e.stopPropagation();
  closeTimeSelector();
}
