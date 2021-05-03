/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';
import { just } from '@instana/observables';
import { Link } from '@instana/components';

import {
  isInfraEntityType,
  isAppDataEntityType,
  isEndpointEntity,
  isApplicationEntity,
  isServiceEntity,
  isLoading,
  hasErrors,
  createAppDataEntityConnectToMapFromEvent
} from 'in-services/entityUtils';
import { getApplicationDashboard, getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './EntityInformation.mless';

export default connectTo(
  props => {
    const { snapshot, entityId, entityType, metadata, timeConfig } = props;
    if (snapshot) {
      // if we get a snapshot (1.0 entity data), just use that
      return {
        entity: just(snapshot)
      };
    } else if (isInfraEntityType(entityType)) {
      // it is an 1.0 entity but the snapshot is not yet loaded, so load it now
      return {
        entity: getSnapshot(entityId, timeConfig).startWith(null)
      };
    } else {
      return createAppDataEntityConnectToMapFromEvent(entityType, entityId, metadata);
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

    if (isAppDataEntityType(entityType)) {
      return <LegacyAppDataEntityInformation {...props} />;
    } else {
      // !entityType || entityType === 'Entity10'
      return <InfraEntityInformation {...props} />;
    }
  }
);

function InfraEntityInformation({
  entity,
  linkTimeConfig,
  useSnapshotLink = false,
  kind = 'dark',
  getLabelCallback = label => label,
  pathname
}) {
  return (
    <EntityInformationPresenter>
      <HierarchicalLink
        timeConfig={linkTimeConfig}
        snapshot={entity}
        className={locals.link}
        pathname={pathname}
        useSnapshotLink={useSnapshotLink}
        kind={kind}
        calculateHierarchy
        getLabel={snapshotLabel => getLabelCallback(snapshotLabel)}
      />
    </EntityInformationPresenter>
  );
}

function LegacyAppDataEntityInformation({ entity, entityType, label, linkTimeConfig, boundaryScope }) {
  const data = entity.data;
  let href$;
  let iconType;
  if (isApplicationEntity(entityType)) {
    href$ = getApplicationDashboard(data.id, {
      timeConfig: linkTimeConfig,
      boundaryScope
    });
    iconType = 'lib_application';
  } else if (isServiceEntity(entityType)) {
    href$ = getServiceDashboard(data.id, {
      timeConfig: linkTimeConfig,
      boundaryScope
    });
    iconType = 'lib_application_service';
  } else if (isEndpointEntity(entityType)) {
    href$ = getEndpointDashboard(data.id, {
      serviceId: data.serviceId,
      timeConfig: linkTimeConfig,
      boundaryScope
    });
    iconType = 'lib_application_endpoint';
  }

  return (
    <EntityInformationPresenter label={label}>
      <Link href$={href$} className={locals.entity}>
        <SvgIcon className={locals.entityIcon} type={iconType} size="xs" />
        {data.label}
      </Link>
    </EntityInformationPresenter>
  );
}

function EntityInformationPresenter({ children, label = t('in-events:entityInfoPresenterDefaultLabel') }) {
  return (
    <div className={locals.container}>
      <span className={locals.label}>{label}</span>
      {children}
    </div>
  );
}
