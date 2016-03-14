import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import IssueDescription from 'in-components/IssueDescription';
import getIssues from 'in-hoc/getIssues';
import {theme} from 'in-services/theme';

import Tooltip from '../Tooltip';
import './HealthIconListing.less';


const block = 'in-health-listing';
const rpt = React.PropTypes;

export default getIssues(
               React.createClass({

  displayName: 'HealthIconListing',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    className: rpt.string,
    issues: rpt.array
  },

  render() {
    const issues = this.props.issues;
    if (!issues) {
      return null;
    }

    // the list is sorted so the first is the one with the hightest severity
    const color = theme.health[issues[0].getIn(['problem', 'severity'])];

    return (
      <Tooltip content={
        <div>
          {issues.map(issue =>
            <IssueDescription key={issue.get('id')}
                              issue={issue}
                              snapshotId={this.props.snapshotId}/>)}
        </div>
      }>
        <div className={block}
             style={{background: color}}>
          {issues.length}
        </div>
      </Tooltip>
    );
  }
}));
