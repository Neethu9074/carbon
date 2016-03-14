import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import getMostImportantIssue from 'in-hoc/getMostImportantIssue';
import {mapSeverityToHealth, health} from 'in-services/health';
import IssueDescription from 'in-components/IssueDescription';
import {getClassName} from 'in-services/react';
import {theme} from 'in-services/theme';
import Icon from 'in-components/Icon';

import Tooltip from '../Tooltip';
import './HealthIcon.less';

const block = 'in-health-icon';

export default getMostImportantIssue(
               React.createClass({
  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    mostImportantIssue: irpt.map
  },

  render() {
    const mostImportantIssue = this.props.mostImportantIssue;
    if (!mostImportantIssue) {
      return null;
    }

    const severity = mostImportantIssue.getIn(['problem', 'severity']);

    let iconType;
    switch (mapSeverityToHealth(severity)) {
      case health.warning:
        iconType = 'warning';
        break;
      case health.danger:
        iconType = 'critical';
        break;
      default:
        iconType = 'change';
    }

    const color = theme.health[severity];

    return (
      <Tooltip content={<IssueDescription issue={mostImportantIssue}
                                          snapshotId={this.props.snapshotId}/>}>
        <Icon type={iconType}
              className={getClassName(this, block)}
              style={{ color }} />
      </Tooltip>
    );
  }
}));
