import {dateUtils} from 'react-day-picker/utils';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import React from 'react';

import {currentDateFn$} from 'in-components/timeline/components/DatePicker/stores/currentDateFnStore';
import {formatDate} from 'in-services/formatters/date';
import {bigBangTimestamp$} from 'in-stores/timeline';
import {serverTime$} from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';

import './DatePicker.less';


const rpt = React.PropTypes;
const block = 'in-timeline-date-picker';

export default connectTo({
  bigBangTimestamp: bigBangTimestamp$,
  currentDateFn: currentDateFn$,
  serverTime: serverTime$,
},
React.createClass({

  displayName: 'DatePicker',

  propTypes: {
    bigBangTimestamp: rpt.number,
    currentDateFn: rpt.func,
    serverTime: rpt.number
  },

  getInitialState() {
    return {
      month: new Date(),
      selectedDay: null
    };
  },

  render() {
    const selectedDay = this.state.selectedDay || this.state.month;
    const bigBangTimestamp = this.props.bigBangTimestamp;
    const currentDateFn = this.props.currentDateFn;
    const serverTime = this.props.serverTime;

    if (!bigBangTimestamp || !serverTime) {
      return null;
    }

    return (
      <div className={block}
           style={{
             width: currentDateFn ? 250 : 0
           }}>
        {currentDateFn ?
          <DayPicker initialMonth={this.state.month}
                     modifiers={{
                       selected: day => dateUtils.isSameDay(day, selectedDay),
                       inactive: day => !dateUtils.isDayInRange(day, {
                         from: new Date(bigBangTimestamp),
                         to: new Date(serverTime)
                       })
                     }}
                     onDayClick={(e, day) => {
                       this.setState({selectedDay: day});
                       currentDateFn(formatDate(day));
                     }} />
          : null
        }
      </div>
    );
  }
}));
