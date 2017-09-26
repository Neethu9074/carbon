import { fromJS } from 'immutable';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import SnapshotLabel from 'in-sdk/components/dashboard/summary/SnapshotLabel';
import { getAgentNotifications } from 'in-stores/agentNotification';
import AgentsTable from 'in-views/agentView/components/AgentsTable';
import { emptyMap } from 'in-services/fixedImmutables';
import { combineLatest } from 'reactive-observables';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      agentSnapshots: getAgentNotifications().flatMap(agentNotifications => {
        const agentIds = [];
        for (let i = 0, length = agentNotifications.size; i < length; i++) {
          const agentNotification = agentNotifications.get(i);
          if (agentNotification.get('id') === props.notificationId) {
            agentNotification.getIn(['data', 'agentIds'], []).forEach(id => agentIds.push(id));
            break;
          }
        }
        return combineLatest(agentIds.map(id => getSnapshot(id))).map(snapshots => {
          return fromJS({
            online: snapshots
          });
        });
      })
    };
  },
  function Summary({ snapshot, notificationId, agentSnapshots }) {
    agentSnapshots = agentSnapshots || emptyMap;
    return (
      <MaxWidthFullscreenContainer>
        <SnapshotLabel>
          {`${getLabel(snapshot)}: ${notificationId}`}
        </SnapshotLabel>

        <AgentsTable agentSnapshots={agentSnapshots} />
      </MaxWidthFullscreenContainer>
    );
  }
);
