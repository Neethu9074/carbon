import PureRenderMixin from 'react-addons-pure-render-mixin';
import {combineLatest} from 'reactive-observables';
import React from 'react';
import d3 from 'd3';

import {selectedDateFrom, selectedDateTo} from 'in-stores/timeline';
import * as serverTimeStore from 'in-stores/serverTime';
import * as timelineStore from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import ChangeTimeButton from './ChangeTimeButton';
import TimePicker from './TimePicker';
import Eventline from './Eventline';

import './Timeline.less';


const block = 'in-timeline';
const rpt = React.PropTypes;

export default connectTo(
  () => {
    return {
      serverTime: serverTimeStore.serverTime,
      maxOldestPermittedIssueTimestamp: combineLatest(
          [serverTimeStore.serverTime, timelineStore.timeframe]
        ).map(([serverTime, timeframe]) => serverTime - timeframe.windowSize),
      selectedDateFrom,
      selectedDateTo
    };
  },
  React.createClass({

  displayName: 'Timeline',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    maxOldestPermittedIssueTimestamp: rpt.number.isRequired,
    serverTime: rpt.number.isRequired,
    selectedDateFrom: rpt.any,
    selectedDateTo: rpt.any
  },

  getInitialState() {
    return {
      open: false
    };
  },

  componentWillMount() {
    this.scale = d3.scale.linear().range([100, 0])
      .domain([
        this.props.serverTime,
        this.props.maxOldestPermittedIssueTimestamp
      ]);
  },

  componentWillReceiveProps(nextProps) {
    this.scale = this.scale.domain([
      nextProps.serverTime,
      nextProps.maxOldestPermittedIssueTimestamp
    ]);
  },

  render() {
    if (!this.props.selectedDateFrom || !this.props.selectedDateTo) {
      return null;
    }

    return (
      <div className={block}>
        {this.renderTimePicker()}

        <ChangeTimeButton label={this.props.selectedDateFrom.toLocaleString()}
                          toggleTimePicker={() => this.toggleTimePicker('left')}
                          align={'left'}/>

        <Eventline renderedForTimestamp={this.props.serverTime}
                   scale={this.scale}
                   maxOldestPermittedIssueTimestamp={this.props.maxOldestPermittedIssueTimestamp} />

        <ChangeTimeButton label={this.props.selectedDateTo.toLocaleString()}
                          toggleTimePicker={() => this.toggleTimePicker('right')}
                          align={'right'}/>
      </div>
    );
  },

  renderTimePicker() {
    if (this.state.open) {
      const className = ' ' + block + '__timepicker__' + this.state.align;
      return <TimePicker className={block + '__timepicker' + className} />;
    }
    return null;
  },

  toggleTimePicker(align) {
    this.setState({
      open: !this.state.open,
      align
    });
  }
}));
