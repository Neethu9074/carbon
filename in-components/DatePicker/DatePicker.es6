/* eslint-disable react/no-multi-comp */
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {dateUtils} from 'react-day-picker/utils';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
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
    handleDateClicked: rpt.func.isRequired,
    heading: rpt.string,
    date: rpt.any
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
                   value={date.toLocaleDateString()}
                   disabled={true}/>
          </div>
          <div>
            <span className={block + '__input--heading'}>
              Time
            </span>
            <br/>
            <input type='text'
                   className={block + '__input'}
                   defaultValue={date.toLocaleTimeString()}/>
          </div>
        </div>

        <DayPicker initialMonth={date}
                   modifiers={{
                     isSelected: day => dateUtils.isSameDay(day, date)
                   }}
                   onDayClick={(e, day) => this.props.handleDateClicked(day)}/>
     </div>
    );
  }
});
