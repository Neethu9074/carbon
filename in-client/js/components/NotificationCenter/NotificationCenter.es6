import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import * as timelineStore from 'in-services/stores/timeline';
import {getIssues} from 'in-services/issueTracker';
import enhance from 'in-components/hoc/enhance';
import * as time from 'in-services/time';
import Icon from 'in-components/Icon';

import IssueItem from './IssueItem';
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
    openIssues: irpt.list
  },

  statics: {
    createObservables() {
      return {
        timeframe: timelineStore.timeframe,
        openIssues: getIssues().debounce(500)
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

        <div className={block + '__list'}>
          {this.renderIssues()}
        </div>

      </div>
    );
  },

  setFilter(predicate) {
    this.setState({ filterPredicate: predicate });
  },

  renderIssues() {
    const openIssues = this.props.openIssues;
    if (!openIssues) {
      return null;
    }

    const filter = this.state.filterPredicate;
    const now = time.getServerTime();
    const maxOldestPermittedIssue = now - this.props.timeframe;
    const issues = openIssues
      .filter(issue => (issue.get('start') > maxOldestPermittedIssue && filter(issue)));

    return (
      <ul>
        {issues.map((issue, index) => {
          return (
            <li key={index}
                className={block + '__list-item'}>
              <IssueItem issue={issue}/>
            </li>
          );
        })}
     </ul>
   );
  }
});

export default enhance(NotificationCenter);
