import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import DatePicker from 'in-components/DatePicker';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import {selectedDateFrom, setDateFrom, selectedDateTo, setDateTo} from '../stores';

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

          <Button className={block + '__apply--button'}
                  onClick={this.applyTime}>
            APPLY
          </Button>
        </div>
      );
    },

    applyTime() {
      console.log('apply timerange from', this.props.dateFrom, 'to', this.props.dateTo);
    }
  })
);
