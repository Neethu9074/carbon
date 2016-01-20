import React from 'react/addons';
import moment from 'moment';

import './TimeRange.less';

const block = 'in-timeline-timerange';

export default React.createClass({
  displayName: 'TimeRange',

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    serverTime: React.PropTypes.number.isRequired,
    scale: React.PropTypes.func.isRequired,
    maxOldestPermittedIssueTimestamp: React.PropTypes.number.isRequired
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
