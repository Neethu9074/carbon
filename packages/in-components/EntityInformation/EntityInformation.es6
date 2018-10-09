import { just } from 'reactive-observables';
import React from 'react';

import { getApplicationDashboard, getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import { getEntityOfType, isLoading, hasErrors } from './entityUtils';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './EntityInformation.less';

const block = 'in-event-view-event-information';

export default connectTo(
  props => {
    if (props.snapshot) {
      return {
        entity: just(props.snapshot)
      };
    } else {
      return getEntityOfType(props.entityId, props.entityType, props.timeConfig);
    }
  },
  function EntityInformation(props) {
    const { entity, entityType } = props;
    if (!entity) {
      return null;
    }
    if (isLoading(entity) || hasErrors(entity)) {
      // This component is used too often within the same view, e.g. trace view with lots of
      // spans. Our loading indicator is too expensive for Chrome to render more than a few hundred
      // times. So show no loading indicator instead.
      return null;
    }

    if (entityType === 'Endpoint20' || entityType === 'Service20' || entityType === 'App20') {
      return <EntityInformation20 {...props} />;
    } else {
      // !entityType || entityType === 'Entity10'
      return <EntityInformation10 {...props} />;
    }
  }
);

function EntityInformation10({
  entity,
  label,
  useSnapshotLink = false,
  kind = 'dark',
  getLabelCallback = label => label
}) {
  return (
    <div className={block}>
      <span className={`${block}__label`}>{label != undefined ? label : 'On:'}</span>
      <HierarchicalLink
        snapshot={entity}
        className={`${block}__link`}
        useSnapshotLink={useSnapshotLink}
        kind={kind}
        calculateHierarchy
        getLabel={snapshotLabel => getLabelCallback(snapshotLabel)}
      />
    </div>
  );
}

function EntityInformation20({ entityId, entity, entityType, label }) {
  let href$;
  if (entityType === 'App20') {
    href$ = getApplicationDashboard(entityId);
  } else if (entityType === 'Service20') {
    href$ = getServiceDashboard(entityId);
  } else if (entityType === 'Endpoint20') {
    const endpoint = entity.data;
    href$ = getEndpointDashboard(endpoint.label, {
      serviceId: endpoint.serviceId
    });
  }

  return (
    <div className={block}>
      <span className={`${block}__label`}>{label != undefined ? label : 'On:'}</span>
      <Link href$={href$}>{entity.data.label}</Link>
    </div>
  );
}
