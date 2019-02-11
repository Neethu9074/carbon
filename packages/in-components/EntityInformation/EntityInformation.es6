import { just } from 'reactive-observables';
import React from 'react';

import {
  is10Type,
  is20Type,
  is20Endpoint,
  is20Application,
  is20Service,
  isLoading,
  hasErrors,
  create20EntityConnectToMapFromEvent
} from 'in-services/entityUtils';
import { getApplicationDashboard, getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './EntityInformation.less';

const block = 'in-event-view-event-information';

export default connectTo(
  props => {
    const { snapshot, entityId, entityType, metadata, timeConfig } = props;
    if (snapshot) {
      // if we get a snapshot (1.0 entity data), just use that
      return {
        entity: just(snapshot)
      };
    } else if (is10Type(entityType)) {
      // it is an 1.0 entity but the snapshot is not yet loaded, so load it now
      return {
        entity: getSnapshot(entityId, timeConfig).startWith(null)
      };
    } else {
      return create20EntityConnectToMapFromEvent(entityType, entityId, metadata, timeConfig);
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

    if (is20Type(entityType)) {
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
  if (is20Application(entityType)) {
    href$ = getApplicationDashboard(entityId);
  } else if (is20Service(entityType)) {
    href$ = getServiceDashboard(entityId);
  } else if (is20Endpoint(entityType)) {
    const endpoint = entity.data;
    href$ = getEndpointDashboard(endpoint.id, {
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
