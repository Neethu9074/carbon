import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {selectedDateFrom, setDateFrom, selectedDateTo, setDateTo} from 'in-stores/timeline';
import DatePicker from 'in-components/DatePicker';
import connectTo from 'in-hoc/connectTo';

import './FixedTimeWindowPicker.less';


const rpt = React.PropTypes;
const block = 'in-fixed-time-window-picker';

export default connectTo(
  () => {
    return {
      dateFrom: selectedDateFrom,
      dateTo: selectedDateTo
    };
  },
  React.createClass({

    displayName: 'FixedTimeWindowPicker',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      dateFrom: rpt.any,
      dateTo: rpt.any
    },

    render() {
      return (
        <div className={block}>
          <DatePicker heading={'From'}
                      date={this.props.dateFrom}
                      handleDateClicked={setDateFrom}/>
          <DatePicker heading={'To'}
                      date={this.props.dateTo}
                      handleDateClicked={setDateTo}/>
        </div>
      );
    }
  })
);
