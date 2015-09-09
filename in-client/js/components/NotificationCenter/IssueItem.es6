import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {health, mapSeverityToHealth} from 'in-services/health';
import {theme} from 'in-services/theme';
import Icon from 'in-components/Icon';

import './IssueItem.less';

const block = 'in-notificationcenter-issueitem';
const rpt = React.PropTypes;


const IssueItem = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    issue: irpt.map.isRequired
  },

  render() {
    const issue = this.props.issue;

    return (
      <div className={block}>

        <div className={block + '__header'}
             style={{color: this.getIssueColor(issue)}}>
          {issue.get('problem').get('problemText')}
        </div>

        <div className={block + '__suggestion'}>
          suggestion
        </div>

        <div className={block + '__time'}>
          {'17m ago'}
        </div>

        <div className={block + '__breakingline'}/>

      </div>
    );
  },

  getIssueColor(issue) {
    return issue.get('state') === 'OPEN' ? this.getColor(issue) : theme.health.ok;
  },

  getColor(issue) {
    switch (mapSeverityToHealth(issue.getIn(['problem', 'severity']))) {
      case health.warning:
        return theme.health.warning;
      case health.danger:
        return theme.health.danger;
      default:
        return theme.health.ok;
    }
  }
});

export default IssueItem;
