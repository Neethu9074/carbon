import React from 'react/addons';

import ServerTime from 'in-components/ServerTime';

import ChangeTimeButton from './ChangeTimeButton';
import Eventline from './Eventline';
import TimeRange from './TimeRange';

import './Timeline.less';

const block = 'in-timeline';

const Timeline = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  getInitialState() {
    return { renderedForTimestamp: Date.now() };
  },

  render() {
    return (
      <div className={block}>
        <TimeRange renderedForTimestamp={this.state.renderedForTimestamp}/>
        <ChangeTimeButton/>
        <Eventline tick={this.onTick}/>
        <ServerTime className={block + '__servertime'}/>
      </div>
    );
  },

  onTick(time) {
    this.setState({ renderedForTimestamp: time });
  }
});

export default Timeline;
