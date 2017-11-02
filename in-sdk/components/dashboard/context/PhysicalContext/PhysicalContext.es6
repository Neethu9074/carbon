import React from 'react';

import getPhysicalContext from 'in-services/subscription/getPhysicalContext';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getClusterMembers } from 'in-stores/clusterMembers';
import HealthDot from 'in-components/health/HealthDot';
import { focusedMoment$ } from 'in-stores/timeline';
import { nothing } from 'in-services/fixedStreams';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './PhysicalContext.less';

const block = 'in-physical-context';

export default connectTo(
  props => ({
    context: focusedMoment$.flatMap(time => getPhysicalContext({ snapshotId: props.snapshotId, time })),
    appSnapshotId: getClusterMembers(props.snapshotId).map(clusterMembers => clusterMembers.first())
  }),
  function PhysicalContext({ context, appSnapshotId }) {
    if (!context) {
      return <LoadingIndicator type="dark" />;
    }

    return (
      <div className={block}>
        <Item snapshotId={appSnapshotId} />
        <Item snapshotId={context.get('container')} />
        <Item snapshotId={context.get('host')} />
        <Item snapshotId={context.get('hostHardware')} />
        <Item snapshotId={context.get('zone')} />
      </div>
    );
  }
);

const Item = connectTo(
  props => ({
    snapshot: props.snapshotId ? getSnapshot(props.snapshotId) : nothing
  }),
  function Item({ snapshot }) {
    if (!snapshot) {
      return null;
    }

    return (
      <div className={`${block}__item`}>
        <HealthDot snapshotId={snapshot.get('id')} />
        <PluginIcon snapshot={snapshot} className={`${block}__icon`} />
        {getLabel(snapshot)}
      </div>
    );
  }
);
