import React from 'react/addons';

import {mapSeverityToHealth, health} from 'in-services/health';
import Icon from 'in-components/Icon';

import './Filter.less';

const block = 'in-notificationcenter-filter';

const rpt = React.PropTypes;

const Filter = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    onFilterSelected: rpt.func.isRequired,
    isSelected: rpt.bool.isRequired,
    type: rpt.string.isRequired,
    count: rpt.number
  },

  getIconWithCount(type, count, typeObject) {
    const iconBlock = block + '__icon' + ' ' + block + '__icon' + '--' + type;
    const className = this.props.isSelected ?
      block + ' ' + block + '__selected' :
      block;

    return (
      <div className={className}
           onClick={() => this.props.onFilterSelected(type, typeObject.predicate)}>

        <Icon type={type} className={iconBlock}/>
        <span>{count}</span>

      </div>
    );
  },

  getContentType(isSelected) {
    const getIconWithCount = this.getIconWithCount;
    const isIssueHealth = this.isIssueHealth;
    const select = this.props.onFilterSelected;
    const type = this.props.type;

    switch (type) {
      case 'all':
        return {
          getContent() {
            const className = isSelected ?
              block + ' ' + block + '__selected' :
              block;
            return (<span className={className}
                         onClick={() => select('all', () => { return true; })}>
                     All
                   </span>);
          }
        };

      case 'critical':
        return {
          getContent(count) { return getIconWithCount('critical', count, this); },
          predicate: (issue) => isIssueHealth(issue, health.danger)
        };

      case 'warning':
        return {
          getContent(count) { return getIconWithCount('warning', count, this); },
          predicate: (issue) => isIssueHealth(issue, health.warning)
        };

      case 'system':
        return {
          getContent(count) { return getIconWithCount('system', count, this); },
          predicate: (issue) => isIssueHealth(issue, health.ok)
        };
      default:
        return null;
    }
  },

  isIssueHealth(issue, healthToCheck) {
    const severity = issue.getIn(['problem', 'severity']);
    const issueHealth = mapSeverityToHealth(severity);
    return issueHealth === healthToCheck;
  },

  render() {
    const props = this.props;
    const type = this.getContentType(props.isSelected);
    return type.getContent(props.count);
  }
});

export default Filter;
