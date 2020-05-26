import React from 'react';

import getIssueDefinitionForSnapshotAndCode from 'in-sdk/agentMonitoringIssueDefinition';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './ProblemDescription.less';

// Style similar to ProblemDescription detail
const block = 'in-event-view-event-problem';

export default connectTo(
  ({ event, timeConfig }) => {
    const entityId = event.get('entityId');
    return {
      snapshot: getSnapshot(entityId, timeConfig).startWith(null)
    };
  },
  function MonitoringIssueDescription({ event, snapshot }) {
    const issueCode = event.getIn(['metadata', 'agent_monitoring_code'], '');
    const issueDefinition = getIssueDefinitionForSnapshotAndCode(snapshot, issueCode);

    const label = issueDefinition.explanationLinkLabel;
    const href = issueDefinition.explanationLinkHref;

    return (
      <DescriptionList>
        <DescriptionItem title="Detail">
          <span className={`${block}__suggestion`}>
            For more information on how to resolve this issue, please consult:{' '}
            <Link href={href} external>
              {label}
            </Link>
          </span>
        </DescriptionItem>
      </DescriptionList>
    );
  }
);
