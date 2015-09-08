import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

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
    allIssues: irpt.list
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
      filterPredicate: () => true
    };
  },

  render() {
    return (
      <div className={block}>

        <div className={block + '__header'}>
          {'Notifications'}
          <Icon type={'arrow_left'}
                className={block + '__icon'}
                onClick={this.props.toggleNotificationCenter}/>
        </div>

        <div className={block + '__status-bar'}>
          <Filter setFilter={this.setFilter} type={'all'} />
          <Filter setFilter={this.setFilter} count={1} type={'critical'} />
          <Filter setFilter={this.setFilter} count={1} type={'warning'} />
          <Filter setFilter={this.setFilter} count={1} type={'system'} />
        </div>

        {this.renderIssues()}
      </div>
    );
  },

  setFilter(predicate) {
    this.setState({ filterPredicate: predicate });
  },

  renderIssues() {
    const allIssues = this.props.allIssues;
    if (!allIssues) {
      return null;
    }

    const filter = this.state.filterPredicate;
    const issues = allIssues.filter(issue => filter(issue));

    return <IssueItemList issues={issues} />;
  }
});

export default enhance(NotificationCenter);
