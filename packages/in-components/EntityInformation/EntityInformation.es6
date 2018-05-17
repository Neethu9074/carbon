import React from 'react';

import { getApplicationDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import getApplication from 'in-subscription/application/getApplication';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import getService from 'in-subscription/application/getService';
import { always } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import { just } from 'reactive-observables';
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
    } else if (props.entityType === 'App20') {
      return {
        entity: getApplication({ id: props.entityId })
      };
    } else if (props.entityType === 'Service20') {
      if (!props.timeConfig) {
        //  Can't render 2.0 service information without a time config.
        return {
          entity: just(null)
        };
      }
      return {
        entity: getService({
          id: props.entityId,
          filter: {
            timeConfig: props.timeConfig
          }
        })
      };
    } else {
      return {
        entity: getSnapshot(props.entityId, props.time)
      };
    }
  },
  function EntityInformation(props) {
    const { entity, entityId, entityType } = props;
    if (!entity) {
      return null;
    } else if (
      entity === loadingPlaceholder ||
      (entity.progress && entity.progress.loading) ||
      (entity.errors && entity.errors.length > 0)
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
    } else {
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

function EntityInformation20({ entity, label, href$ }) {
  const entityLabel = entity.data.label;
  return (
    <div className={block}>
      <span className={`${block}__label`}>{label != undefined ? label : 'On:'}</span>
      <Link href$={href$}>{entityLabel}</Link>
    </div>
  );
}
