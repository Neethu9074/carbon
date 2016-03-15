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
                   modifiers={{
                     isSelected: day => dateUtils.isSameDay(day, this.props.date)
                   }}
                   onDayClick={(e, day) => this.props.handleDateClicked(day)}/>
     </div>
    );
  }
});
