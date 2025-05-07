/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { LoadingSkeleton, Stack, SvgIcon, Tooltip } from '@instana/components';
import { Link, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

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
import {
  useLinkToApplicationDashboard,
  useLinkToEndpointDashboard,
  useLinkToServiceDashboard
} from 'in-applications/navigation/paths';
import { getSnapshot, getSnapshotOrDefaultOnTimeout } from 'in-stores/snapshot';
import { snapshotIdUrlParameter } from 'in-stores/snapshot/urlParameters';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from './EntityInformation.mless';

export default function EntityInformation(props) {
  const { snapshot, entityId, entityType, metadata, timeConfig, onClose, isCveRedirect, plugin } = props;

  const determineEntityInformationCall = () => {
    if (snapshot) {
      // if we get a snapshot (1.0 entity data), just use that
      return just(snapshot);
    } else if (isInfraEntityType(entityType)) {
      // it is an 1.0 entity but the snapshot is not yet loaded, so load it now
      // Use getSnapshotOrDefaultOnTimeout because if snapshot fails then it times out instead of sending failure result or null directly
      return getSnapshotOrDefaultOnTimeout(entityId, null, 5000, timeConfig).startWith(pendingResult);
    } else {
      const appDataEntity = createAppDataEntityConnectToMapFromEvent(entityType, entityId, metadata);
      return appDataEntity.entity;
    }
  };

  const entity = useObservable(determineEntityInformationCall(), [entityId]);

  if (metadata && metadata.has('infraSmartAlert') && !isPerEntityInfraSmartAlert(metadata, plugin)) {
    return <InfraSmartAlertEntityInformation metadata={metadata} />;
  }

  if ((entity && (isLoading(entity) || hasErrors(entity))) || entity === undefined) {
    return <LoadingSkeleton />;
  }

  // If our websocket timed out on the call for the entity
  // Should only occur on infra entities but just in case allowed it for app data entities too
  if (entity === null) {
    return <GenericUnidentifiedEntityInformation {...props} />;
  }

  if (isAppDataEntityType(entityType)) {
    return <LegacyAppDataEntityInformation {...props} entity={entity} />;
  } else {
    // !entityType || entityType === 'Entity10'
    return <InfraEntityInformation {...props} entity={entity} onClose={onClose} isCveRedirect={isCveRedirect} />;
  }
}

function isPerEntityInfraSmartAlert(metadata, plugin) {
  const groupingInfo = metadata.get('groupingTags', {}).toJS();
  const groupByTags = Object.keys(groupingInfo);
  return groupByTags.length === 1 && groupByTags[0] === `id.${plugin}`;
}

function InfraSmartAlertEntityInformation({ metadata }) {
  // Currently infra smart does not have an unique snapshotId. Hence we are not able to find the triggering entity.
  // Instead we display the entityName.
  const entityName = metadata.get('entityName', '');

  return (
    <EntityInformationPresenter shouldDisplayDefaultLabel>
      <Typography variant="body-small">
        {t('in-events:infraSmartAlerts.pseudoAggregatedEntityLabel', { entityName: entityName })}
      </Typography>
    </EntityInformationPresenter>
  );
}

function InfraEntityInformation({
  entity,
  linkTimeConfig,
  useSnapshotLink = false,
  kind = 'dark',
  getLabelCallback = label => label,
  pathname,
  shouldDisplayDefaultLabel = true,
  isCveRedirect,
  onClose
}) {
  const hostSnapshot = useObservable(
    getHostSnapshotId(entity).flatMap(hostId => getSnapshot(hostId, linkTimeConfig)),
    []
  );
  const snapshot = entity?.get('plugin') === 'hostWinService' ? hostSnapshot : undefined;
  return (
    <EntityInformationPresenter shouldDisplayDefaultLabel={shouldDisplayDefaultLabel}>
      <HierarchicalLink
        timeConfig={linkTimeConfig}
        snapshot={snapshot ?? entity}
        className={locals.link}
        pathname={pathname}
        useSnapshotLink={useSnapshotLink}
        kind={kind}
        calculateHierarchy
        getLabel={snapshotLabel => getLabelCallback(snapshotLabel)}
        isCveRedirect={isCveRedirect}
        onClose={onClose}
      />
    </EntityInformationPresenter>
  );
}

function LegacyAppDataEntityInformation({ entity, entityType, label, linkTimeConfig, boundaryScope }) {
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
  const getLinkToServiceDashboard = useLinkToServiceDashboard();
  const getLinkToEndpointDashboard = useLinkToEndpointDashboard();

  const data = entity.data;
  let href;
  let iconType;
  if (isApplicationEntity(entityType)) {
    href = getLinkToApplicationDashboard({
      applicationId: data.id,
      timeConfig: linkTimeConfig,
      boundaryScope
    });
    iconType = 'lib_application';
  } else if (isServiceEntity(entityType)) {
    href = getLinkToServiceDashboard({
      serviceId: data.id,
      timeConfig: linkTimeConfig,
      boundaryScope
    });
    iconType = 'lib_application_service';
  } else if (isEndpointEntity(entityType)) {
    href = getLinkToEndpointDashboard({
      serviceId: data.serviceId,
      endpointId: data.id,
      timeConfig: linkTimeConfig,
      boundaryScope
    });
    iconType = 'lib_application_endpoint';
  }

  return (
    <EntityInformationPresenter label={label}>
      <Link href={href} className={locals.entity}>
        <SvgIcon className={locals.entityIcon} type={iconType} size="xs" />
        {data.label}
      </Link>
    </EntityInformationPresenter>
  );
}

/** Used in cases when a snapshot or entity could not be ascertained
 * @param {Object} props
 * @param {*} props.linkTimeConfig - Time config of current page
 * @param {*} props.entityType - Entity type of triggering entity
 * @param {*} props.entityId - Entity ID of trigerring entity
 * @param {*} props.boundaryScope - Possible boundary scope of given entity
 */
function GenericUnidentifiedEntityInformation({ linkTimeConfig, entityType, entityId, boundaryScope }) {
  const { createHref } = useNavigation();

  const entityLabel = t('in-events:unidentifiedEntity');

  if (isAppDataEntityType(entityType)) {
    const genericEntity = {
      data: {
        id: entityId,
        serviceId: undefined
      }
    };

    return (
      <Stack direction="horizontal" gap="small">
        <LegacyAppDataEntityInformation
          entity={genericEntity}
          entityType={entityType}
          label={entityLabel}
          linkTimeConfig={linkTimeConfig}
          boundaryScope={boundaryScope}
        />
        <Tooltip align="rightMiddle" content={t('in-events:unidentifiedEntityTooltip')}>
          <SvgIcon type="lib_help_error_help_outline" size="s" />
        </Tooltip>
      </Stack>
    );
  } else {
    const query = { ...location.query };
    query[snapshotIdUrlParameter.name] = entityId;
    const pathname = '/physical/dashboard';
    const linkToPhysicalDashboard = createHref({
      ...location,
      pathname,
      query,
      matrix: {}
    });

    return (
      <EntityInformationPresenter shouldDisplayDefaultLabel>
        <Stack direction="horizontal" gap="small">
          <Link href={linkToPhysicalDashboard}>{entityLabel}</Link>
          <Tooltip align="rightMiddle" content={t('in-events:unidentifiedEntityTooltip')}>
            <SvgIcon type="lib_help_error_help_outline" size="s" />
          </Tooltip>
        </Stack>
      </EntityInformationPresenter>
    );
  }
}

function EntityInformationPresenter({ children, shouldDisplayDefaultLabel, label }) {
  if (shouldDisplayDefaultLabel && !label) label = t('in-events:entityInfoPresenterDefaultLabel');
  return (
    <div className={locals.container}>
      <span className={locals.label}>{label}</span>
      {children}
    </div>
  );
}
