import React from 'react';

import * as focusedMomentStore from 'in-components/timeline/components/DatePicker/stores/focusedMomentDatePickerStore';
import * as windowSizeStore from 'in-components/timeline/components/DatePicker/stores/windowSizeStore';
import * as fromStore from 'in-components/timeline/components/DatePicker/stores/fromDatePickerStore';
import { setDateStore } from 'in-components/timeline/components/DatePicker/stores/currentDateStore';
import * as toStore from 'in-components/timeline/components/DatePicker/stores/toDatePickerStore';
import DateTimeBlock from 'in-components/timeline/components/DatePicker/DateTimeBlock';
import { live$ } from 'in-components/timeline/components/DatePicker/stores/liveStore';
import SelectBox from 'in-components/timeline/components/DatePicker/SelectBox';
import connectTo from 'in-hoc/connectTo';

import './InputFields.less';

const block = 'in-timeline-date-time-picker-input-fields';

export default connectTo(
  {
    live: live$
  },
  function InputFields({ live }) {
    return live ? <LiveInputFields /> : <FixedTimestampInputFields />;
  }
);

const LiveInputFields = connectTo(
  {
    windowSize: windowSizeStore.windowSize$
  },
  function LiveInputFields({ windowSize }) {
    return (
      <div className={block}>
        <SelectBox heading="Window Size" value={windowSize} onChange={windowSizeStore.setWindowSize} />
      </div>
    );
  }
);

class FixedTimestampInputFields extends React.Component {
  static displayName = 'FixedTimestampInputFields';

  componentWillUnmount() {
    setDateStore(null);
  }

  render() {
    return (
      <div className={block}>
        <DateTimeBlock heading="From" store={fromStore} setDateStore={fromStore} showInputDescriptions />

        <DateTimeBlock heading="To" setDateStore={toStore} store={toStore} />

        <div className={`${block}__separator`} />

        <DateTimeBlock heading="Selected Moment" setDateStore={focusedMomentStore} store={focusedMomentStore} />
      </div>
    );
  }
}
