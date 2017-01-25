import React from 'react';

import ButtonPanel from 'in-components/timeline/components/DatePicker/v2/ButtonPanel';
import InputFields from 'in-components/timeline/components/DatePicker/v2/InputFields';
import DatePicker from 'in-components/timeline/components/DatePicker/v2/DatePicker';
import InfoPanel from 'in-components/timeline/components/DatePicker/v2/InfoPanel';
import {interactableTimelineHeight$} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';

import {reset as resetFocusedMomentDatePickerStore} from 'in-components/timeline/components/DatePicker/stores/focusedMomentDatePickerStore';
import {reset as resetFromDatePickerStore} from 'in-components/timeline/components/DatePicker/stores/fromDatePickerStore';
import {reset as resetToDatePickerStore} from 'in-components/timeline/components/DatePicker/stores/toDatePickerStore';

import './DateTimePickerPopup.less';


const block = 'in-timeline-date-time-picker-popup';

export default connectTo({
  height: interactableTimelineHeight$
},
React.createClass({
  displayName: 'DateTimePickerPopup',

  componentWillMount() {
    resetFocusedMomentDatePickerStore();
    resetFromDatePickerStore();
    resetToDatePickerStore();
  },

  render() {
    return (
      <div className={block}
           style={{
             bottom: `${this.props.height}px`
           }}>
        <ButtonPanel />
        <div className={`${block}__left`}>
          <InfoPanel />
          <InputFields />
        </div>
        <div className={`${block}__right`}>
          <DatePicker />
        </div>
      </div>
    );
  }
}));
