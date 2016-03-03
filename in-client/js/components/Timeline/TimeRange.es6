import PureRenderMixin from 'react-addons-pure-render-mixin';
import moment from 'moment';
import React from 'react';

import './TimeRange.less';


const rpt = React.PropTypes;
const block = 'in-timeline-timerange';

export default React.createClass({
  displayName: 'TimeRange',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    maxOldestPermittedIssueTimestamp: rpt.number.isRequired,
    serverTime: rpt.number.isRequired,
    scale: rpt.func.isRequired
  },

  render() {
    return (
      <div className={block}>
        {this.getTiles()}
      </div>
    );
  },

  getTiles() {
    const now = this.props.serverTime;
    const max = this.props.maxOldestPermittedIssueTimestamp;
    const scale = this.props.scale;
    const range = now - max;
    const numItems = 8;
    const spaceBetweenEachItem = 1 / numItems;

    const array = [];
    for (let i = 0; i < numItems; i++) {
      array.push((range / numItems) / 2 + max + range * i * spaceBetweenEachItem);
    }

    return array.map(time => {
      return (
        <div  key={time}
              className={block + '__tile'}
              style={{left: scale(time) + '%'}}>
          {moment(time).format('HH:mm:ss')}
        </div>);
    });
  }
});
