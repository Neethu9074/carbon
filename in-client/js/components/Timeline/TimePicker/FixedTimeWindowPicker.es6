import React from 'react';

import * as timelineStore from 'in-stores/timeline';
import DatePicker from 'in-components/DatePicker';
import * as tracking from 'in-services/tracking';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import {
  dateFrom,
  dateTo,
  setDateTimeFrom,
  setDateTimeTo
} from '../timelineStores';

import './FixedTimeWindowPicker.less';


const rpt = React.PropTypes;
const block = 'in-fixed-time-window-picker';

export default connectTo({
    dateFrom,
    dateTo
  },
  React.createClass({

    displayName: 'FixedTimeWindowPicker',

    propTypes: {
      dateFrom: rpt.instanceOf(Date),
      dateTo: rpt.instanceOf(Date)
    },

    shouldComponentUpdate(nextProps) {
      const shouldUpdate =
        nextProps.dateFrom === this.props.dateFrom &&
        nextProps.dateTo === this.props.dateTo;

      return !shouldUpdate;
    },

    componentWillMount() {
      const now = new Date();
      setDateTimeFrom(now);
      setDateTimeTo(now);
    },

    render() {
      return (
        <div className={block}>
          <DatePicker heading={'From'}
                      setDateTime={setDateTimeFrom}/>
          <DatePicker heading={'To'}
                      setDateTime={setDateTimeTo}/>

          <Button className={block + '__apply-button'}
                  onClick={this.applyTime}>
            Apply
          </Button>
        </div>
      );
    },

    applyTime() {
      let from = this.props.dateFrom;
      let to = this.props.dateTo;
      console.log('set', from, to);

      // only apply valid dates
      if (from && to) {
        from = from.getTime();
        to = to.getTime();

        tracking.events.changingTimeWindowUsingTimeline();
        timelineStore.setTimeframe(to - from, to);
      }
    }
  })
);
