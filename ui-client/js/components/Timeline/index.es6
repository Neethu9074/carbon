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
import DropUp from 'instana-ui-components/DropUp';

import {health, mapSeverityToHealth} from 'instana-ui-services/health';
import {theme} from 'instana-ui-services/theme';
import * as timelineStore from 'instana-ui-services/stores/timeline';
import {getOpenIssues} from 'instana-ui-services/issueTracker';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {IntlMixin} from 'react-intl';
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
    SubscriptionMixin,
    IntlMixin
  ],

  propTypes: {
    timeframe: rpt.number.isRequired,
    openIssues: irpt.list
  },

  statics: {
    createObservables() {
      return {
        timeframe: timelineStore.timeframe,
        openIssues: getOpenIssues()
      };
    }
  },

  getInitialState() {
    return {
      hoveredProblem: null,
      hoveredSnapshot: null,
      timePickerProperty: null,
      tooltipX: -1,
      tooltipY: -1
    };
  },

  render() {
    const iconConfig = {
      type: 'timeline_warning',
      color: theme.health.warning
    };

    return (
      <div className={block + '__wrapper'}>
        {this.renderTimePicker()}
        {this.renderTooltip()}
        <div className={block}>
          <DropUp header={'header 1'} onClick={this.onDropUpItemClicked}>
            {'item 1'}
            {'item 2'}
            {'item 3'}
          </DropUp>

          <div className={block + '__line'}>
            {this.renderProblems()}
          </div>

          <div className={block + '__button-to'}>
            Today
            <Icon className={block + '__icon'} type={iconConfig.type} />
          </div>
        </div>
      </div>
    );
  },

  onDropUpItemClicked(itemName) {
    console.log(itemName);
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
                left: this.getPosition(problem) + '%',
                color: iconConfig.color
              }}
              onMouseEnter={this.mouseIn.bind(this, problem)}
              onMouseLeave={this.mouseOut}/>
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
      default:
        throw new Error('Unrecognized health ' + this.state.health);
    }
  },

  getPosition(problem) {
    const start = problem.get('start');
    const top = Date.now();
    const bottom = top - this.props.timeframe;

    const scale = d3.scale.linear();
    scale.domain([top, bottom]);
    scale.range([100, 0]);

    return scale(start);
  },

  renderTimePicker() {
    const property = this.state.timePickerProperty;
    if(!property) {
      return null;
    }

    return null;
    //
    // return (
    //   <div className={block + '__timepicker'}>
    //     <button type='button'
    //             className={block + '__timepicker-button--set'}
    //             onClick={() => {/*TODO: set time to property*/}}>
    //
    //       {this.getIntlMessage('map.timepicker.buttons.set')}
    //     </button>
    //   </div>
    // );
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
  }
});

export default enhance(Timeline);
