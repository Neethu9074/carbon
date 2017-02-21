import {dateUtils} from 'react-day-picker/utils';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import React from 'react';

import {currentDateStore$} from 'in-components/timeline/components/DatePicker/stores/currentDateStore';
import {formatDate} from 'in-services/formatters/date';
import {bigBangTimestamp$} from 'in-stores/timeline';
import {alwaysNull} from 'in-services/fixedStreams';
import {serverTime$} from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';

import './DatePicker.less';


const block = 'in-timeline-date-picker';

export default connectTo({
  selectedTime: currentDateStore$.flatMap(store => store ? store.timestamp$ : alwaysNull),
  bigBangTimestamp: bigBangTimestamp$,
  currentDateStore: currentDateStore$,
  serverTime: serverTime$,
},
React.createClass({
  displayName: 'DatePicker',

  getInitialState() {
    return {
      initialMonth: new Date()
    };
  },

  render() {
    const bigBangTimestamp = this.props.bigBangTimestamp;
    const currentDateStore = this.props.currentDateStore;
    const selectedTime = this.props.selectedTime;
    const serverTime = this.props.serverTime;

    if (!bigBangTimestamp || !serverTime) {
      return null;
    }

    return (
      <div className={block}
           style={{
             width: currentDateStore ? 250 : 0
           }}>
        {currentDateStore ?
          <DayPicker initialMonth={this.state.initialMonth}
                     modifiers={{
                       selected: day => dateUtils.isSameDay(day, new Date(selectedTime)),
                       inactive: day => !dateUtils.isDayInRange(day, {
                         from: new Date(bigBangTimestamp),
                         to: new Date(serverTime)
                       })
                     }}
                     onDayClick={(e, day) => currentDateStore.setDateString(formatDate(day))} />
          : null
        }
      </div>
    );
  }
}));
