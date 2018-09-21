import { just } from 'reactive-observables';
import React from 'react';

import { getApplicationDashboard, getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import { getEntityOfType, parseEndpointEntityId } from './entityUtils';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import { always } from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './EntityInformation.less';

export const loadingPlaceholder = {};
export const alwaysLoadingPlaceholder$ = always(loadingPlaceholder);

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
    const { entity, parentEntity, entityId, entityType } = props;
    if (!entity) {
      return null;
    } else if (
      isLoading(entity) ||
      hasErrors(entity) ||
      (parentEntity && (isLoading(parentEntity) || hasErrors(parentEntity)))
    ) {
      // This component is used too often within the same view, e.g. trace view with lots of
      // spans. Our loading indicator is too expensive for Chrome to render more than a few hundred
      // times. So show no loading indicator instead.
      return null;
    } else if (entityType === 'App20') {
      const href$ = getApplicationDashboard(entityId);
      return <EntityInformation20 {...props} href$={href$} />;
    } else if (entityType === 'Service20') {
      const href$ = getServiceDashboard(entityId);
      return <EntityInformation20 {...props} href$={href$} />;
    } else if (entityType === 'Endpoint20') {
      const endpoint = parseEndpointEntityId(entityId);
      const href$ = getEndpointDashboard(endpoint.name, {
        serviceId: endpoint.serviceId
      });
      const parentHref$ = getServiceDashboard(parentEntity.data.id);
      return (
        <div>
          <EntityInformation20 {...props} href$={href$} />
          <EntityInformation20 entity={props.parentEntity} label="Of:" href$={parentHref$} />
        </div>
      );
    } else {
      return <EntityInformation10 {...props} />;
    }
  }
);

function isLoading(entity) {
  return entity === loadingPlaceholder || (entity.progress && entity.progress.loading);
}

function hasErrors(entity) {
  return entity.errors && entity.errors.length > 0;
}

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

function EntityInformation20({ entity, label, href$ }) {
  const entityLabel = entity.data.label;
  return (
    <div className={block}>
      <span className={`${block}__label`}>{label != undefined ? label : 'On:'}</span>
      <Link href$={href$}>{entityLabel}</Link>
    </div>
  );
}
