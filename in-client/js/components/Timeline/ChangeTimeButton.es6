import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import * as timelineStore from 'in-services/stores/timeline';
import TimePicker from 'in-components/TimePicker';
import Icon from 'in-components/Icon';

import './ChangeTimeButton.less';

const block = 'in-timeline-change-time-button';

const ChangeTimeButton = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  getInitialState() {
    return { open: false, timeframe: 0, currentTime: '10M' };
  },

  componentWillMount() {
    this.addSubscription(timelineStore.timeframe.subscribe(timeframe => this.setState({timeframe})));
  },

  render() {
    return (
      <div className={block}>
        {this.renderTimePicker()}
        <Icon type={'timer'}
              className={block + '__icon'}
              onClick={this.toggleTimePicker} />
        <span className={block + '__text'} >
          {this.state.currentTime}
        </span>
      </div>
    );
  },

  renderTimePicker() {
    if (this.state.open) {
      return (<TimePicker onTimeSelected={this.onTimeChanged}
                          className={block + '__timepicker'}/>);
    }
    return null;
  },

  onTimeChanged(labels) {
    this.setState({
      open: false,
      currentTime: labels.short
    });
  },

  toggleTimePicker() {
    this.setState({ open: !this.state.open });
  }
});

export default ChangeTimeButton;
