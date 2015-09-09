import React from 'react/addons';

import {mapSeverityToHealth, health} from 'in-services/health';
import Icon from 'in-components/Icon';

import './Filter.less';

const block = 'in-notificationcenter-filter';
const rpt = React.PropTypes;

const contentTypes = {
  all: {
    getContent() { return <span>All</span>; },
    predicate: () => { return true; }
  },
  critical: {
    getContent(count) { return getIconWithCount('critical', count); },
    predicate: (issue) => isIssueHealth(issue, health.danger)
  },
  warning: {
    getContent(count) { return getIconWithCount('warning', count); },
    predicate: (issue) => isIssueHealth(issue, health.warning)
  },
  system: {
    getContent(count) { return getIconWithCount('system', count); },
    predicate: (issue) => isIssueHealth(issue, health.ok)
  }
};

function isIssueHealth(issue, healthToCheck) {
  const severity = issue.getIn(['problem', 'severity']);
  const issueHealth = mapSeverityToHealth(severity);
  return issueHealth === healthToCheck;
}

function getIconWithCount(type, count) {
  return (
    <div>
      <Icon type={type}
            className={block + '__icon' + '--' + type}/>
      <span>{count}</span>
    </div>
  );
}

const Filter = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    setFilter: rpt.func.isRequired,
    type: rpt.string.isRequired,
    count: rpt.number
  },

  render() {
    const type = contentTypes[this.props.type];
    const predicate = type.predicate;

    return (
      <div className={block}
           onClick={() => this.props.setFilter(predicate)}>
        {type.getContent(this.props.count)}
      </div>
    );
  }
});

export default Filter;
