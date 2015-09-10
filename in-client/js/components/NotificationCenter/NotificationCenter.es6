import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {mapSeverityToHealth, health} from 'in-services/health';
import * as timelineStore from 'in-services/stores/timeline';
import {getIssues} from 'in-services/issueTracker';
import enhance from 'in-components/hoc/enhance';
import Icon from 'in-components/Icon';

import IssueItemList from './IssueItemList';
import Filter from './Filter';

import './NotificationCenter.less';

const block = 'in-notificationcenter';
const rpt = React.PropTypes;

const NotificationCenter = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    toggleNotificationCenter: rpt.func.isRequired,
    timeframe: rpt.number.isRequired,
    allIssues: irpt.list,
    open: rpt.bool
  },

  statics: {
    createObservables() {
      return {
        timeframe: timelineStore.timeframe,
        allIssues: getIssues()
      };
    }
  },

  getInitialState() {
    return {
      filterPredicate: () => true,
      selectedType: null
    };
  },

  render() {
    const className = this.props.open ?
      block + ' ' + block + '__open' :
      block;

    const selectedType = this.state.selectedType;
    const counter = this.getIssuesCounter();

    return (
      <div className={className}>

        <div className={block + '__header'}>
          {'Notifications'}
          <Icon type={'arrow_left'}
                className={block + '__icon'}
                onClick={this.props.toggleNotificationCenter}/>
        </div>

        <div className={block + '__status-bar'}>
          <Filter onFilterSelected = {this.onFilterSelected}
                  isSelected = {selectedType === 'all'}
                  type = {'all'} />

          <Filter onFilterSelected={this.onFilterSelected}
                  isSelected = {selectedType === 'critical'}
                  count={counter.errors}
                  type={'critical'} />

          <Filter onFilterSelected={this.onFilterSelected}
                  isSelected = {selectedType === 'warning'}
                  count={counter.warnings}
                  type={'warning'} />

          <Filter onFilterSelected={this.onFilterSelected}
                  isSelected = {selectedType === 'system'}
                  count={counter.commons}
                  type={'system'} />
        </div>

        {this.renderIssues()}
      </div>
    );
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

    return (<IssueItemList issues={issues} />);
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
