/* eslint-disable react/no-multi-comp */
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {dateUtils} from 'react-day-picker/utils';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import moment from 'moment';
import React from 'react';

import './DatePicker.less';


const block = 'in-date-picker';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'DatePicker',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    onDateClicked: rpt.func.isRequired,
    onTimeChanged: rpt.func.isRequired,
    date: rpt.instanceOf(Date),
    heading: rpt.string
  },

  render() {
    const date = this.props.date;

    return (
      <div className={block}>
        {this.props.heading ?
          <h1 className={block + '__heading'}>
            {this.props.heading}
          </h1>
          : null
        }

        <div className={block + '__inputs'}>
          <div>
            <span className={block + '__input--heading'}>
              Date
            </span>
            <br/>
            <input type='text'
                   className={block + '__input'}
                   value={moment(date).format('YYYY-MM-DD')}
                   disabled={true}/>
          </div>
          <div>
            <span className={block + '__input--heading'}>
              Time
            </span>
            <br/>
            <input type='text'
                   className={block + '__input'}
                   value={moment(date).format('LT')}
                   onChange={(e) => this.onTimeChanged(e)}/>
          </div>
        </div>

        <DayPicker initialMonth={date}
                   modifiers={{
                     isSelected: day => dateUtils.isSameDay(day, date)
                   }}
                   onDayClick={(e, day) => this.props.onDateClicked(day)}/>
     </div>
    );
  },

  onTimeChanged(event) {
    const time = moment(event.target.value, 'HH-mm-ss');
    if (time.isValid()) {
      this.props.onTimeChanged(time);
    }
  }
});
