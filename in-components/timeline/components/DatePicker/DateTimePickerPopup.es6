import React from 'react';

import ButtonPanel from 'in-components/timeline/components/DatePicker/ButtonPanel';
import InputFields from 'in-components/timeline/components/DatePicker/InputFields';
import DatePicker from 'in-components/timeline/components/DatePicker/DatePicker';
import { interactableTimelineHeight$ } from 'in-components/timeline/timelineStore';
import InfoPanel from 'in-components/timeline/components/DatePicker/InfoPanel';
import connectTo from 'in-hoc/connectTo';

import {
  reset as resetFocusedMomentDatePickerStore
} from 'in-components/timeline/components/DatePicker/stores/focusedMomentDatePickerStore';
import {
  reset as resetFromDatePickerStore
} from 'in-components/timeline/components/DatePicker/stores/fromDatePickerStore';
import { reset as resetToDatePickerStore } from 'in-components/timeline/components/DatePicker/stores/toDatePickerStore';
import { reset as resetWindowSizeStore } from 'in-components/timeline/components/DatePicker/stores/windowSizeStore';
import { reset as resetLiveToggle } from 'in-components/timeline/components/DatePicker/stores/liveStore';

import './DateTimePickerPopup.less';

const block = 'in-timeline-date-time-picker-popup';

export default connectTo(
  {
    height: interactableTimelineHeight$
  },
  class extends React.Component {
    static displayName = 'DateTimePickerPopup';

    componentWillMount() {
      resetFocusedMomentDatePickerStore();
      resetFromDatePickerStore();
      resetToDatePickerStore();
      resetWindowSizeStore();
      resetLiveToggle(this.props.openInView);
    }

    render() {
      return (
        <div
          className={block}
          style={{
            bottom: `${this.props.height}px`
          }}
        >
          <ButtonPanel />
          <div className={`${block}__left`}>
            <InputFields />
          </div>
          <div className={`${block}__middle`}>
            <DatePicker />
          </div>
          <div className={`${block}__right`}>
            <InfoPanel />
          </div>
        </div>
      );
    }
  }
);
