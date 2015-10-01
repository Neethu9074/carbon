import React from 'react/addons';

import ServerTime from 'in-components/ServerTime';
import TimePicker from 'in-components/TimePicker';

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
    return {
      open: false,
      renderedForTimestamp: Date.now()
    };
  },

  render() {
    return (
      <div className={block}>
        {this.renderTimePicker()}

        <TimeRange renderedForTimestamp={this.state.renderedForTimestamp}/>
        <ChangeTimeButton onClick={this.onTimeChanged}/>
        <Eventline tick={this.onTick}/>
        <ServerTime className={block + '__servertime'}/>
      </div>
    );
  },

  onTick(time) {
    this.setState({ renderedForTimestamp: time });
  },

  renderTimePicker() {
    if (this.state.open) {
      return (<TimePicker onTimeSelected={this.onTimeChanged}
                          className={block + '__timepicker'}/>);
    }
    return null;
  },

  onTimeChanged() {
    this.setState({
      open: !this.state.open,
      renderedForTimestamp: Date.now()
    });
  }
});

export default Timeline;
