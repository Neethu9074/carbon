import React from 'react/addons';
import moment from 'moment';

import {getCurrentScaleProperties} from 'in-services/time';
import {getServerTime} from 'in-services/time';

import './TimeRange.less';

const block = 'in-timeline-timerange';

const TimeRange = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    renderedForTimestamp: React.PropTypes.number
  },

  render() {
    console.log('render');
    return (
      <div className={block}>
        {this.getTiles()}
      </div>
    );
  },

  getTiles() {
    const now = getServerTime();
    const max = getCurrentScaleProperties().maxOldestPermittedIssue;
    const scale = getCurrentScaleProperties().scale;
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

export default TimeRange;
