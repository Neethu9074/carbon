/* eslint-disable react/no-multi-comp */
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import React from 'react';

import './DatePicker.less';

const rpt = React.PropTypes;
const block = 'in-date-picker';

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
    return (
      <div className={block}>
        <div className={block + '__heading-wrapper'}>
          {this.props.heading ?
            <h1 className={block + '__heading'}>
            {this.props.heading}
            </h1>
            : null
          }
          {this.props.date.toLocaleDateString()}
        </div>

        <DayPicker initialMonth={this.props.date}
                   modifiers={{isSunday: this.isSunday}}
                   onDayClick={(e, day) => this.props.handleDateClicked(day)}/>
     </div>
    );
  },

  isSunday(day) {
    return day.getDay() === 0;
  }
});
