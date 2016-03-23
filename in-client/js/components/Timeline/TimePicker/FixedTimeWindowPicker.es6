import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import * as timelineStore from 'in-stores/timeline';
import DatePicker from 'in-components/DatePicker';
import * as tracking from 'in-services/tracking';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import {
  selectedDateFrom,
  selectedDateTo,
  setDateFrom,
  setTimeFrom,
  setTimeTo,
  setDateTo
} from '../stores';

import './FixedTimeWindowPicker.less';


const rpt = React.PropTypes;
const block = 'in-fixed-time-window-picker';

export default connectTo({
    dateFrom: selectedDateFrom,
    dateTo: selectedDateTo
  },
  React.createClass({

    displayName: 'FixedTimeWindowPicker',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      dateFrom: rpt.instanceOf(Date),
      dateTo: rpt.instanceOf(Date)
    },

    render() {
      return (
        <div className={block}>
          <DatePicker heading={'From'}
                      date={this.props.dateFrom}
                      onTimeChanged={setTimeFrom}
                      onDateClicked={setDateFrom}/>
          <DatePicker heading={'To'}
                      date={this.props.dateTo}
                      onTimeChanged={setTimeTo}
                      onDateClicked={setDateTo}/>

          <Button className={block + '__apply-button'}
                  onClick={this.applyTime}>
            Apply
          </Button>
        </div>
      );
    },

    applyTime() {
      const from = this.props.dateFrom.getTime();
      const to = this.props.dateTo.getTime(); // to timestamp

      tracking.events.changingTimeWindowUsingTimeline();
      timelineStore.setTimeframe(to - from, to);
    }
  })
);
