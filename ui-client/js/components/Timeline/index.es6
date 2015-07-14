'use strict';

import React from 'react/addons';
import moment from 'moment';
import irpt from 'react-immutable-proptypes';
import d3 from 'd3';

import Icon from 'instana-ui-components/Icon';
import {health, mapSeverityToHealth} from 'instana-ui-services/health';
import {theme} from 'instana-ui-services/theme';
import * as timelineStore from 'instana-ui-services/stores/timeline';
import {getOpenIssues} from 'instana-ui-services/issueTracker';

import enhance from '../enhance';

import './index.less';

const rpt = React.PropTypes;
const block = 'in-timeline';

const Timeline = React.createClass({
  mixins: [React.addons.PureRenderMixin],

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

  render() {
    return (
      <div className={block} ref='timeline'>
        <span className={block + '__from'}>Today</span>

        <div className={block + '__line'}>
          {this.renderProblems()}
        </div>

        <span className={block + '__until'}>
          {this.getUntil()}
        </span>
      </div>
    );
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
                top: this.getPosition(problem) + '%',
                color: iconConfig.color
              }} />
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
    scale.range([0, 100]);

    return scale(start);
  }
});

export default enhance(Timeline);
