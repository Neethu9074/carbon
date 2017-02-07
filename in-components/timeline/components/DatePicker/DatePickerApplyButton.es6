import {combineLatest} from 'reactive-observables';
import 'react-day-picker/lib/style.css';
import React from 'react';

import {isDateTimeValid$ as focusedMomentValid$} from 'in-components/timeline/components/DatePicker/stores/focusedMomentDatePickerStore';
import {isDateTimeValid$ as fromValid$} from 'in-components/timeline/components/DatePicker/stores/fromDatePickerStore';
import {isDateTimeValid$ as toValid$} from 'in-components/timeline/components/DatePicker/stores/toDatePickerStore';
import {windowSize$} from 'in-components/timeline/components/DatePicker/stores/windowSizeStore';
import {MAX_ZOOM_LEVEL} from 'in-components/timeline/timelineStore';
import {getFixedTimeframeUrl} from 'in-stores/navigation';
import {alwaysNull} from 'in-services/fixedStreams';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  if (props.live) {
    return {
      href: windowSize$.flatMap(windowSize => getFixedTimeframeUrl({windowSize})),
    };
  }

  return {
    href: combineLatest([
            focusedMomentValid$,
            fromValid$,
            toValid$
          ])
          .throttle(200)
          .map(([focusedMomentValid, fromValid, toValid]) => {
            return {
              fixedTimestampsAreValid: focusedMomentValid.date &&
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
          .flatMap(validations => validations.fixedTimestampsAreValid
                                           ? getFixedTimeframeUrl({
                                               windowSize: Math.max(MAX_ZOOM_LEVEL, validations.to - validations.from),
                                               focusedMoment: validations.focusedMoment,
                                               to: validations.to
                                             })
                                           : alwaysNull)
          .distinct()
  };
},
function ApplyButton({href}) {
  const isDisabled = href ? false : true;
  return (
    <Button onClick={e => e.stopPropagation()}
            href={href}
            size='sm'
            disabled={isDisabled}>
      Apply
    </Button>
  );
});
