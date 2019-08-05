import React from 'react';

import ContextPopup from 'in-sdk/components/dashboard/context/PhysicalContext/ContextPopup';
import getPhysicalContext from 'in-subscription/getPhysicalContext';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getClusterMembers } from 'in-stores/clusterMembers';
import HealthDot from 'in-components/health/HealthDot';
import { getContext, getLabel } from 'in-sdk/snapshot';
import { timeConfig$ } from 'in-stores/time/config';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './PhysicalContext.less';

const block = 'in-physical-context';

export default connectTo(
  props => ({
    context: timeConfig$.flatMap(timeConfig => getPhysicalContext({ snapshotId: props.snapshotId, timeConfig })),
    appSnapshotId: getClusterMembers(props.snapshotId).map(clusterMembers => clusterMembers.first())
  }),
  function PhysicalContext({ context, appSnapshotId }) {
    if (!context) {
      return <LoadingIndicator type="dark" />;
    }

    return (
      <div className={block}>
        <Item snapshotId={appSnapshotId} additionalContextFrom={context.get('process')} />
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
    snapshot: getSnapshot(props.snapshotId),
    additionalContextSnapshot: getSnapshot(props.additionalContextFrom)
  }),
  function Item({ snapshot, additionalContextSnapshot }) {
    if (!snapshot) {
      return null;
    }

    let context = getContext(snapshot);
    if (additionalContextSnapshot) {
      context = context.mergeDeep(getContext(additionalContextSnapshot));
    }

    return (
      <div className={`${block}__item`}>
        <HealthDot snapshotId={snapshot.get('id')} />
        <PluginIcon snapshot={snapshot} className={`${block}__icon`} />
        {context.size > 0 ? (
          <SvgIcon
            type="tag"
            size="xxs"
            className={`${block}__tag`}
            onClick={() => setActiveDialog(<ContextPopup context={context} />)}
          />
        ) : null}
        {getLabel(snapshot)}
      </div>
    );
  }
);
