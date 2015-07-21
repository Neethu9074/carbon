'use strict';

import React from 'react/addons';
import moment from 'moment';
import irpt from 'react-immutable-proptypes';
import d3 from 'd3';

import TooltipFrame from 'instana-ui-components/Tooltips/VerticalFrame';
import Heading from 'instana-ui-components/Tooltips/Heading';
import Content from 'instana-ui-components/Tooltips/Content';
import StatusLine from 'instana-ui-components/Tooltips/StatusLine';
import Icon from 'instana-ui-components/Icon';
import TimePicker from 'instana-ui-components/TimePicker';
import Button from 'instana-ui-components/Button';

import {health, mapSeverityToHealth} from 'instana-ui-services/health';
import {theme} from 'instana-ui-services/theme';
import * as timelineStore from 'instana-ui-services/stores/timeline';
import * as selectedSnapshotStore from 'instana-ui-services/stores/selectedSnapshot';
import {getOpenIssues} from 'instana-ui-services/issueTracker';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {only} from 'instana-ui-services/util/snapshots';
import {create} from 'instana-ui-services/conveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';

import {getLabel} from 'instana-ui-sdk/snapshot';

import enhance from '../enhance';

import './index.less';

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
        openIssues: getOpenIssues(),
        focusedMoment: timelineStore.focusedMoment
      };
    }
  },

  getInitialState() {
    return {
      renderedForTimestamp: Date.now(),
      hoveredProblem: null,
      hoveredSnapshot: null,
      timePickerProperty: null,
      open: false,
      tooltipX: -1,
      tooltipY: -1
    };
  },

  componentWillMount() {
    // force a redraw of this component every few seconds to animate the
    // timeline
    this.interval = setInterval(() => {
      this.setState({
        renderedForTimestamp: Date.now()
      });
    }, 2000);
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
          <Button className={block + '__button-from'}
                  onClick={this.toggle}>
            <Icon className={block + '__icon'} type='timeline' />
            <span className={block + '__button-text'}>
              {this.getUntil()}
            </span>
          </Button>

          <div className={block + '__line'}>
            {this.renderProblems()}
            {this.renderFocusedMoment()}
          </div>

          <div className={block + '__button-to'}>
            <span className={block + '__button-text'}>
              Now
            </span>
            <Icon className={block + '__icon'} type='timeline' />
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
    return moment(Date.now() - this.props.timeframe).fromNow();
  },

  renderProblems() {
    if (!this.props.openIssues) {
      return null;
    }

    const maxOldestPermittedProblem = Date.now() - this.props.timeframe;
    const problems = [];

    this.props.openIssues.forEach(issue => {
      issue.get('problems')
        .filter(problem => problem.get('start') > maxOldestPermittedProblem)
        .forEach(problem => problems.push(problem));
    });

    return problems.map(problem => {
      const iconConfig = this.getIconConfig(problem);
      return (
        <Icon key={problem.get('id')}
              type={iconConfig.type}
              className={block + '__problem'}
              style={{
                left: this.getPosition(problem.get('start')) + '%',
                color: iconConfig.color
              }}
              onMouseEnter={this.mouseIn.bind(this, problem)}
              onMouseLeave={this.mouseOut}
              onClick={() => this.focusSnapshot(problem)}/>
      );
    });
  },

  getIconConfig(problem) {
    switch (mapSeverityToHealth(problem.get('severity'))) {
      case health.warning:
        return {
          type: 'timeline_warning',
          color: theme.health.warning
        };
      case health.danger:
        return {
          type: 'timeline_critical',
          color: theme.health.danger
        };
      case health.ok:
        return {
          type: 'timeline',
          color: theme.health.ok
        };
      default:
        throw new Error('Unrecognized health ' + this.state.health);
    }
  },

  getPosition(time) {
    const top = Date.now();
    const bottom = top - this.props.timeframe;

    const scale = d3.scale.linear();
    scale.domain([top, bottom]);
    scale.range([100, 0]);

    return scale(time);
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
    timelineStore.timeframe.emit(newTime);
    this.toggle();
  },

  renderTooltip() {
    if (!this.state.hoveredProblem) {
      return null;
    }

    const problem = this.state.hoveredProblem;
    const iconConfig = this.getIconConfig(problem);
    return (
      <div className={block + '__tooltip'}
           style={{
             top: this.state.tooltipY + 'px',
             left: this.state.tooltipX + 'px'
           }}>
         <div className={block + '__tooltip-wrapper'}>
          <TooltipFrame>
            <StatusLine left={this.state.hoveredSnapshot ? getLabel(this.state.hoveredSnapshot) : 'Loading...'}
                        right={moment(problem.get('start')).fromNow()}/>
            <Heading style={{color: iconConfig.color}}>
              {problem.get('problemText')}
            </Heading>
            <Content>
              {problem.get('fixSuggestion')}
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

    return (
      <div className={block + '__focused-moment'}
           style={{
             left: this.getPosition(this.props.focusedMoment) + '%'
           }}/>
    );
  },

  mouseIn(problem, event) {
    this.setState({
      hoveredProblem: problem,
      tooltipX: event.pageX,
      tooltipY: -10
    });

    this.addSubscription(
      only(
        create(SnapshotConveyer, {pluginId: problem.get('pluginId')}),
        problem
      )
      .subscribe(hoveredSnapshot => this.setState({hoveredSnapshot}))
    );
  },

  mouseOut() {
    this.setState({
      hoveredProblem: null,
      hoveredSnapshot: null,
      tooltipX: -1,
      tooltipY: -1
    });
    this.disposeSubscriptions();
  },

  focusSnapshot(problem) {
    selectedSnapshotStore.select(problem);
  }
});

export default enhance(Timeline);
