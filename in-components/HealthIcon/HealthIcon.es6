import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {getIssuesForSnapshot} from 'in-services/issueTracker';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {mapSeverityToHealth, health} from 'in-services/health';
import IssueDiscription from 'in-components/IssueDiscription';
import {getClassName} from 'in-services/react';
import {theme} from 'in-services/theme';

import enhance from '../hoc/enhance';
import Tooltip from '../Tooltip';
import './HealthIcon.less';

const rpt = React.PropTypes;
const block = 'in-health-icon';

const HealthIcon = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    snapshot: irpt.map.isRequired,
    className: rpt.string,
    issues: irpt.list
  },

  statics: {
    createObservables(props) {
      const snapshot = props.snapshot;
      return {
        issues: getIssuesForSnapshot(snapshot)
      };
    }
  },

  render() {
    const issues = this.props.issues;
    if (!issues || issues.size === 0) {
      return null;
    }

    const orderedIssues = issues
      .sortBy(issue => issue.getIn(['problem', 'severity']))
      .toArray()
      .reverse();
    const maxColor = this.getColor(orderedIssues[0]);

    return (
      <Tooltip content={this.getContentForTooltip(orderedIssues)}>

        <div style={{ backgroundColor: maxColor }}
             type={ 'critical' }
             className={getClassName(this, block)}>
          <span className={getClassName(this, block, '__counter')}>
            {orderedIssues.length}
          </span>
        </div>

      </Tooltip>
    );
  },

  getColor(problem) {
    switch (mapSeverityToHealth(problem.getIn(['problem', 'severity']))) {
      case health.ok:
        return theme.health[0];
      case health.warning:
        return theme.health[5];
      case health.danger:
        return theme.health[10];
      default:
        throw new Error('Unknown health ' + mapSeverityToHealth(problem));
    }
  },

  getContentForTooltip(orderedIssues) {
    return (
      <div>
        {orderedIssues.map(issue =>
          <IssueDiscription key={issue.get('id')}
                            issue={issue}
                            plugin={this.props.snapshot.get('pluginId')}/>
        )}
      </div>
    );
  }
});

export default enhance(HealthIcon);
