import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {mapSeverityToHealth, mapHealthToColor, health} from 'in-services/health';
import {getIssues} from 'in-services/issueTracker';
import enhance from 'in-components/hoc/enhance';

import IssueItemList from './IssueItemList';
import Filter from './Filter';

import './NotificationCenter.less';

const FILTER_TYPES = {
  ALL: 'all',
  CRITICAL: 'critical',
  WARNING: 'warning',
  SYSTEM: 'system'
};

const block = 'in-notificationcenter';

const rpt = React.PropTypes;

const NotificationCenter = React.createClass({
  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    toggleNotificationCenter: rpt.func.isRequired,
    allIssues: irpt.list,
    style: rpt.object,
    open: rpt.bool
  },

  statics: {
    createObservables() {
      return {
        allIssues: getIssues()
      };
    }
  },

  getInitialState() {
    return {
      filterPredicate: () => true,
      selectedType: FILTER_TYPES.ALL
    };
  },

  render() {
    return (
      <div className={block}>
        {'Notifications'}
        {this.renderFilterMenu()}
        {this.renderIssues()}
      </div>
    );
  },

  renderFilterMenu() {
    const selectedType = this.state.selectedType;
    const counter = this.getIssuesCounter();

    return (
      <div className={block + '__status-bar'}>
        <Filter onFilterSelected = {this.onFilterSelected}
                isSelected = {selectedType === FILTER_TYPES.ALL}
                type = {FILTER_TYPES.ALL}
                color={'#FFFFFF'}
                predicate={() => true}/>

        <Filter onFilterSelected={this.onFilterSelected}
                isSelected = {selectedType === FILTER_TYPES.CRITICAL}
                count={counter.errors}
                type={FILTER_TYPES.CRITICAL}
                color={mapHealthToColor(health.danger)}
                predicate={issue => this.isIssueHealth(issue, health.danger)}/>

        <Filter onFilterSelected={this.onFilterSelected}
                isSelected = {selectedType === FILTER_TYPES.WARNING}
                count={counter.warnings}
                type={FILTER_TYPES.WARNING}
                color={mapHealthToColor(health.warning)}
                predicate={issue => this.isIssueHealth(issue, health.warning)}/>

        <Filter onFilterSelected={this.onFilterSelected}
                isSelected = {selectedType === FILTER_TYPES.SYSTEM}
                count={counter.commons}
                type={FILTER_TYPES.SYSTEM}
                color={mapHealthToColor(health.ok)}
                predicate={issue => this.isIssueHealth(issue, health.ok)}/>
      </div>
    );
  },

  isIssueHealth(issue, healthToCheck) {
    const severity = issue.getIn(['problem', 'severity']);
    const issueHealth = mapSeverityToHealth(severity);
    return issueHealth === healthToCheck;
  },

  onFilterSelected(type, predicate) {
    this.setState({
      filterPredicate: predicate,
      selectedType: type
    });
  },

  renderIssues() {
    const allIssues = this.props.allIssues;
    if (!allIssues) {
      return null;
    }

    const filter = this.state.filterPredicate;
    const issues = allIssues.filter(issue => filter(issue));

    return (<IssueItemList issues={issues} style={this.props.style} />);
  },

  getIssuesCounter() {
    const allIssues = this.props.allIssues;

    let errors = 0;
    let warnings = 0;
    let commons = 0;
    if (!allIssues) {
      return { errors, warnings, commons };
    }

    allIssues.forEach(issue => {
      const issueHealth = mapSeverityToHealth(issue.getIn(['problem', 'severity']));
      if (!issueHealth) {
        return;
      }

      switch (issueHealth) {
        case health.danger:
          errors++;
          break;
        case health.warning:
          warnings++;
          break;
        default:
          commons++;
      }
    });

    return { errors, warnings, commons };
  }
});

export default enhance(NotificationCenter);
