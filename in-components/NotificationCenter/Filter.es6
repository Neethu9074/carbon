import React from 'react/addons';

import {mapSeverityToHealth} from 'in-services/health';
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
    predicate: rpt.func.isRequired,
    type: rpt.string.isRequired,
    color: rpt.string,
    count: rpt.number
  },

  getIconWithCount(type, count) {
    const iconBlock = block + '__icon';
    const className = this.props.isSelected ?
      block + ' ' + block + '__selected' :
      block;

    return (
      <div className={className}
           onClick={() => this.props.onFilterSelected(type, this.props.predicate)}>

        <Icon type={type}
              className={iconBlock}
              style={{ color: this.props.color }}/>
        <span>{count}</span>

      </div>
    );
  },

  getContent(isSelected, count) {
    const getIconWithCount = this.getIconWithCount;
    const select = this.props.onFilterSelected;
    const type = this.props.type;

    if (type === 'all') {
      const className = isSelected ?
        block + ' ' + block + '__selected' :
        block;

      return (<span className={className}
                   onClick={() => select('all', () => { return true; })}>
               All
             </span>);
    }

    return getIconWithCount(type, count);
  },

  isIssueHealth(issue, healthToCheck) {
    const severity = issue.getIn(['problem', 'severity']);
    const issueHealth = mapSeverityToHealth(severity);
    return issueHealth === healthToCheck;
  },

  render() {
    const props = this.props;
    return this.getContent(props.isSelected, this.props.count);
  }
});

export default Filter;
