import React from 'react/addons';
import moment from 'moment';
import irpt from 'react-immutable-proptypes';
import d3 from 'd3';

import TooltipFrame from 'in-components/Tooltips/VerticalFrame';
import StatusLine from 'in-components/Tooltips/StatusLine';
import Heading from 'in-components/Tooltips/Heading';
import Content from 'in-components/Tooltips/Content';
import TimePicker from 'in-components/TimePicker';
import Icon from 'in-components/Icon';

import * as highlightedSnapshotStore from 'in-services/stores/highlightedSnapshot';
import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import {getFullSnapshot, extractCoordinates} from 'in-services/snapshots';
import {getIssues, getColorForIssue} from 'in-services/issueTracker';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import * as timelineStore from 'in-services/stores/timeline';
import {mapSeverityToHealth} from 'in-services/health';
import * as tracking from 'in-services/tracking';
import * as time from 'in-services/time';

import {getLabel} from 'in-sdk/snapshot';

import ServerTime from 'in-components/ServerTime';
import enhance from 'in-components/hoc/enhance';

import './Timeline.less';

const rpt = React.PropTypes;
const block = 'in-timeline';

const Timeline = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    timeframe: rpt.number.isRequired,
    openIssues: irpt.list,
    focusedMoment: rpt.number
  },

  statics: {
    createObservables() {
      return {
        timeframe: timelineStore.timeframe,
        openIssues: getIssues().debounce(500),
        focusedMoment: timelineStore.focusedMoment
      };
    }
  },

  getInitialState() {
    return {
      renderedForTimestamp: Date.now(),
      hoveredIssue: null,
      hoveredSnapshot: null,
      timePickerProperty: null,
      open: false,
      tooltipX: -1,
      tooltipY: -1,
      scale: d3.scale.linear().range([100, 0])
    };
  },

  componentWillMount() {
    // force a redraw of this component every few seconds to animate the
    // timeline
    this.interval = setInterval(() => {
      this.setState({
        renderedForTimestamp: Date.now()
      });
    }, 1000);
  },

  componentWillUnmount() {
    clearInterval(this.interval);
  },

  render() {
    return (
      <div className={block + '__wrapper'}>
        {this.renderTimePicker()}
        {this.renderTooltip()}
        <div className={block}>
          <div className={block + '__button-from'}
                  onClick={this.toggle}>
            <Icon className={block + '__icon'} type='dot' />
            <span className={block + '__button-text'}>
              {this.getUntil()}
            </span>
          </div>

          <div className={block + '__line'}>
            {this.renderIssueLine()}
            {this.renderIssues()}
            {this.renderFocusedMoment()}
          </div>

          <div className={block + '__button-to'}>
            <span className={block + '__button-text'}>
              Now,&nbsp;
              <ServerTime />
            </span>
            <Icon className={block + '__icon'} type='dot' />
          </div>
        </div>
      </div>
    );
  },

  toggle() {
    this.setState({
      open: !this.state.open
    });
  },

  getUntil() {
    return moment(time.getServerTime() - this.props.timeframe).fromNow();
  },

  getScale() {
    const now = time.getServerTime();
    const maxOldestPermittedIssue = now - this.props.timeframe;
    return this.state.scale.domain([now, maxOldestPermittedIssue]);
  },

  renderIssueLine() {
    const issue = this.state.hoveredIssue;
    if (!issue) {
      return null;
    }

    const scale = this.getScale();
    let right = scale(issue.get('end')).toFixed(2);
    if (right < 0) {
      right = 0 + '%';
    } else {
      right = (100 - Math.min(100, right)) + '%';
    }

    return (
      <div  className={block + '__issue-line'}
            style={{
              left: scale(issue.get('start')).toFixed(2) + '%',
              right,
              borderColor: getColorForIssue(issue)
            }}>
      </div>
    );
  },

  renderIssues() {
    const openIssues = this.props.openIssues;
    if (!openIssues) {
      return null;
    }

    const now = time.getServerTime();
    const maxOldestPermittedIssue = now - this.props.timeframe;
    const issues = openIssues.filter(issue => issue.get('start') > maxOldestPermittedIssue);

    const scale = this.state.scale.domain([now, maxOldestPermittedIssue]);
    return issues
      .map(issue => {
        return (
          <Icon key={issue.get('id')}
                type={mapSeverityToHealth(issue.getIn(['problem', 'severity']))}
                className={block + '__problem'}
                style={{
                  left: scale(issue.get('start')).toFixed(2) + '%',
                  color: getColorForIssue(issue)
                }}
                onMouseEnter={this.mouseIn.bind(this, issue)}
                onMouseLeave={this.mouseOut}
                onClick={() => this.focusSnapshot(issue)}/>
        );
      });
  },

  renderTimePicker() {
    if(!this.state.open) {
      return null;
    }

    return (
      <div className={block + '__timepicker'}>
        <TimePicker onClick={this.onTimePickerItemClicked}/>
      </div>
    );
  },

  onTimePickerItemClicked(newTime) {
    tracking.trackEvent(tracking.events.changingTimeWindowUsingTimeline);
    timelineStore.setTimeframe(newTime);
    this.toggle();
  },

  renderTooltip() {
    if (!this.state.hoveredIssue) {
      return null;
    }

    const issue = this.state.hoveredIssue;
    const color = getColorForIssue(issue);
    return (
      <div className={block + '__tooltip'}
           style={{
             top: this.state.tooltipY + 'px',
             left: this.state.tooltipX + 'px'
           }}>
         <div className={block + '__tooltip-wrapper'}>
          <TooltipFrame>
            <StatusLine left={this.state.hoveredSnapshot ? getLabel(this.state.hoveredSnapshot) : 'Loading…'}
                        right={moment(issue.get('start')).fromNow()}/>
            <Heading style={{color}}>
              {issue.getIn(['problem', 'problemText'])}
            </Heading>
            <Content>
              {issue.getIn(['problem', 'fixSuggestion'])}
            </Content>
          </TooltipFrame>
        </div>
      </div>
    );
  },

  renderFocusedMoment() {
    if (!this.props.focusedMoment) {
      return null;
    }

    const now = time.getServerTime();
    const maxOldestPermittedIssue = now - this.props.timeframe;
    const scale = this.state.scale.domain([now, maxOldestPermittedIssue]);

    return (
      <div className={block + '__focused-moment'}
           style={{
             left: scale(this.props.focusedMoment).toFixed(2) + '%'
           }}/>
    );
  },

  mouseIn(issue, event) {
    this.setState({
      hoveredIssue: issue,
      tooltipX: event.pageX,
      tooltipY: -10
    });
    const problem = issue.get('problem');
    const problemCoordinates = extractCoordinates(problem);
    this.addSubscription(
      getFullSnapshot(problemCoordinates)
      .subscribe(hoveredSnapshot => this.setState({hoveredSnapshot}))
    );
    highlightedSnapshotStore.select(problemCoordinates);
  },

  mouseOut() {
    this.setState({
      hoveredIssue: null,
      hoveredSnapshot: null,
      tooltipX: -1,
      tooltipY: -1
    });
    this.disposeSubscriptions();
    highlightedSnapshotStore.clear();
  },

  focusSnapshot(issue) {
    const problemCoordinates = extractCoordinates(issue.get('problem'));
    selectedSnapshotStore.select(problemCoordinates);
  }
});

export default enhance(Timeline);
