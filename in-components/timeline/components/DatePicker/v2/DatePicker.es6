import {dateUtils} from 'react-day-picker/utils';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import React from 'react';

import {focusedDateInput$} from 'in-components/timeline/components/DatePicker/stores/focusedDateInput';
import {formatDate} from 'in-services/formatters/date';
import {bigBangTimestamp$} from 'in-stores/timeline';
import {serverTime$} from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';

import './DatePicker.less';


const block = 'in-timeline-date-picker';
const rpt = React.PropTypes;

export default connectTo({
  focusedDateInput: focusedDateInput$
},
function DatePicker({focusedDateInput}) {
  return (
    <div className={block}
         style={{
           width: focusedDateInput ? 250 : 0
         }}>
      {focusedDateInput ? <Picker /> : null}
    </div>
  );
});

const Picker = connectTo({
  bigBangTimestamp: bigBangTimestamp$,
  serverTime: serverTime$
},
React.createClass({

  displayName: 'DatePicker',

  propTypes: {
    bigBangTimestamp: rpt.number,
    serverTime: rpt.number
  },

  componentWillMount() {
    // reset();
  },

  getInitialState() {
    return {
      month: new Date()
    };
  },

  render() {
    const date = undefined;
    const bigBangTimestamp = this.props.bigBangTimestamp;
    const serverTime = this.props.serverTime;

    if (!bigBangTimestamp || !serverTime) {
      return null;
    }

    return (
      <div>
        <DayPicker initialMonth={this.state.month}
                   modifiers={{
                     selected: day => dateUtils.isSameDay(day, date),
                     inactive: day => !dateUtils.isDayInRange(day, {
                       from: new Date(bigBangTimestamp),
                       to: new Date(serverTime)
                     })
                   }}
                   onDayClick={(e, day) => console.log(formatDate(day))} />
      </div>
    );
  }
}));
