/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo } from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';
import { just } from '@instana/observables';

// @ts-ignore
import { getEnrichedAnalyzeTagFilterFormModel, impactedTracesTagFilterExpressionGenerator } from 'in-events/components/AnalyzeApplicationEventButton';
import { MobileAppSmartAlertConfig, WebsiteSmartAlertConfig } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { getEnrichedAnalyzeTagFilterFormModelImpactedBeacons } from 'in-eum/ImpactedUsers/AnalyzeImpactedUsersButton';
import { ApplicationSmartAlertConfig } from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { getEntitySelectionAsTagFilterFormModel } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { joinExpressions, FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
// @ts-ignore
import * as entityUtils from 'in-services/entityUtils';
import ImpactedUsers from 'in-eum/ImpactedUsers/ImpactedUsers';
import { SnapshotData, getSnapshot } from 'in-stores/snapshot';
import { emptyMap } from 'in-services/fixedImmutables';
import { EventOrMap } from 'in-events/types';
import { minutes } from 'in-services/time';

export interface SmartAlertImpactedUsersProps {
  event: EventOrMap;
  snapshot?: SnapshotData;
  alertConfig?: ApplicationSmartAlertConfig | MobileAppSmartAlertConfig | WebsiteSmartAlertConfig;
  eventEntity?: any;
  isKPI: boolean;
}

export default function SmartAlertImpactedUsers({
  event,
  alertConfig,
  snapshot,
  eventEntity,
  isKPI
}: SmartAlertImpactedUsersProps) {
  const [entityType, timeConfig] = useMemo(
    () => [event.get('entityType'), getImpactedTimeConfigFromEvent(event)],
    [event]
  );

  const analyzedEventEntity: any = useObservable(() => {
    if (eventEntity) {
      return just(eventEntity);
    }

    if (snapshot) {
      // if we get a snapshot (1.0 entity data), just use that
      return just(snapshot);
    } else if (entityUtils.isInfraEntityType(entityType)) {
      // it is an 1.0 entity but the snapshot is not yet loaded, so load it now
      return getSnapshot(event.get('entityId') as string, timeConfig).startWith(null);
    } else {
      return entityUtils.createAppDataEntityConnectToMapFromEvent(
        entityType,
        event.get('entityId'),
        event.get('metadata')
      ).entity;
    }
  }, [entityType, event, snapshot, timeConfig]);

  const filterExpressions = useMemo(
    () => createFilterExpressionsForAppAlert(event, timeConfig, alertConfig, analyzedEventEntity),
    [alertConfig, analyzedEventEntity, event, timeConfig]
  );

  // Application, Website and Mobile App alerts are the only supported
  if (
    (!entityUtils.isAppDataEntityType(entityType) &&
      !entityUtils.isWebsiteEntityType(entityType) &&
      !entityUtils.isMobileAppEntityType(entityType)) ||
    !filterExpressions
  ) {
    return null;
  }

  return (
    <ImpactedUsers
      entityType={entityType}
      alertType={alertConfig?.rule?.alertType}
      timeConfig={timeConfig}
      joinFilterForImpactedUsers={filterExpressions.impacted}
      joinFilterForTotalUsers={filterExpressions.total}
      isKPI={isKPI}
    />
  );
}

function getImpactedTimeConfigFromEvent(event: EventOrMap): TimeConfig {
  const now = Date.now();
  const eventFrom = ((event.get('start') || event.start) as number) || now;
  const eventTo = ((event.get('state') as string) === 'closed' ? (event.get('end') as number) : null) || now;

  return {
    to: eventTo,
    focusedMoment: eventTo,
    windowSize: Math.max(minutes.toMillis(10), eventTo - eventFrom),
    autoRefresh: false
  };
}

function createFilterExpressionsForAppAlert(
  event: EventOrMap,
  timeConfig: TimeConfig,
  alertConfig?: ApplicationSmartAlertConfig | MobileAppSmartAlertConfig | WebsiteSmartAlertConfig,
  eventEntity?: any
) {
  const entityType = event.get('entityType');

  eventEntity = eventEntity ?? {};

  let serviceName: string | undefined = undefined;
  let endpointName: string | undefined = undefined;
  let applicationId: string | undefined = eventEntity.applicationId;
  let websiteId: string | undefined = eventEntity.websiteId;
  let mobileAppId: string | undefined = eventEntity.mobileAppId;
  let alertId: string | undefined = eventEntity.alertId;
  let applicationName: string | undefined = eventEntity.applicationName;
  let serviceId: string | undefined = eventEntity.serviceId;
  let endpointId: string | undefined = eventEntity.endpointId;

  if (event.has('metadata')) {
    alertId = event.getIn(['metadata', 'eventSpecificationId'], '');
    if (entityUtils.isApplicationEntity(entityType)) {
      applicationName = applicationName || event.getIn(['metadata', 'entityLabel'], '');
    } else if (entityUtils.isServiceEntity(entityType)) {
      serviceName = serviceName || event.getIn(['metadata', 'entityLabel'], '');
    } else if (entityUtils.isEndpointEntity(entityType)) {
      endpointName = endpointName || event.getIn(['metadata', 'entityLabel'], '');
      serviceName = serviceName || event.getIn(['metadata', 'app20EndpointServiceLabel'], '');
    }
  }

  if (eventEntity.data) {
    if (entityUtils.isApplicationEntity(entityType)) {
      applicationId = applicationId || eventEntity.data.id;
    } else if (entityUtils.isServiceEntity(entityType)) {
      serviceId = serviceId || eventEntity.data.id;
    } else if (entityUtils.isEndpointEntity(entityType)) {
      serviceId = serviceId || eventEntity.data.serviceId;
      endpointId = endpointId || eventEntity.data.id;
    } else if (entityUtils.isWebsiteEntityType(entityType)) {
      websiteId = websiteId || eventEntity.websiteId;
    } else if (entityUtils.isMobileAppEntityType(entityType)) {
      mobileAppId = mobileAppId || eventEntity.mobileAppId;
    }
  }

  const adaptiveBaselineInfo = event.getIn(['metadata', 'adaptiveBaselineInfo'], emptyMap).toJS();

  if (!alertConfig && !applicationId && !serviceName && !endpointName) {
    return null;
  }

  if (!alertConfig) {
    return { impacted: getQueryModelForAppAlertWithoutAlertConfig(), total: null };
  }

  if (alertConfig?.rule?.alertType === 'throughput') {
    // we don't show the affected services/endpoints list for this blueprint type, because there is no simple property
    // to differentiate single calls from being violated or non-violated. Thus, we have to come up with a new way to do
    // this distinction.

    // Here we are handling the case of what tagFilterExpression we have to pass when we have a throughput alert
    // along with the entity type.
    if (entityUtils.isWebsiteEntityType(entityType) || entityUtils.isMobileAppEntityType(entityType)) {
      return {
        impacted: getQueryModelForAppAlertFromAlertConfig(true),
        total: getQueryModelForAppAlertFromAlertConfig(true)
      };
    }
    return { impacted: getQueryModelForAppAlertFromAlertConfig(false), total: null };
  }

  return {
    impacted: getQueryModelForAppAlertFromAlertConfig(false),
    total: getQueryModelForAppAlertFromAlertConfig(true)
  };

  function getQueryModelForAppAlertWithoutAlertConfig() {
    return toBackendQueryModel(
      joinExpressions({
        expressions: [
          applicationId
            ? getEntitySelectionAsTagFilterFormModel(
                { [applicationId]: { applicationId, inclusive: true, services: {} } },
                'ALL',
                applicationId,
                applicationName,
                serviceId,
                endpointId
              )
            : null,
          serviceName ? tagFilter('service.name', EQUALS, serviceName, null, DESTINATION) : null,
          endpointName ? tagFilter('endpoint.name', EQUALS, endpointName, null, DESTINATION) : null
        ].filter(Boolean) as Array<FormModelElement>
      })
    );
  }

  function getQueryModelForAppAlertFromAlertConfig(excludeViolationRelatedFilters: boolean) {
    //If the alert type is throughput, and it is a website or mobile app alert
    if (
      alertConfig?.rule?.alertType === 'throughput' &&
      (entityUtils.isWebsiteEntityType(entityType) || entityUtils.isMobileAppEntityType(entityType))
    ) {
      const entityId = entityUtils.isMobileAppEntityType(entityType) ? mobileAppId : websiteId;
      return toBackendQueryModel(
        getEnrichedAnalyzeTagFilterFormModelImpactedBeacons({
          alertId: null,
          entityId: entityId,
          entityType: entityType,
          excludeViolationRelatedFilters: excludeViolationRelatedFilters
        })
      );
    }
    //If the alert type is throughput, and it is an application alert
    else if (alertConfig?.rule?.alertType === 'throughput' && entityUtils.isApplicationEntity(entityType)) {
      return toBackendQueryModel(
        getEnrichedAnalyzeTagFilterFormModel({
          alertConfig,
          applicationId: applicationId,
          applicationName: applicationName,
          serviceId: serviceId,
          endpointId: endpointId,
          timeConfig: timeConfig,
          excludeViolationRelatedFilters,
          adaptiveBaselineInfo
        })
      );
    }
    //If alert type is not throughput, and it is a website or mobile app entity
    else if (entityUtils.isWebsiteEntityType(entityType) || entityUtils.isMobileAppEntityType(entityType)) {
      const entityId = entityUtils.isMobileAppEntityType(entityType) ? mobileAppId : websiteId;
      return toBackendQueryModel(
        getEnrichedAnalyzeTagFilterFormModelImpactedBeacons({
          alertId: alertId,
          entityId: entityId,
          entityType: entityType,
          excludeViolationRelatedFilters: excludeViolationRelatedFilters
        })
      );
    }
    //Alert type is not throughput, and it is an application entity
    else {
      return toBackendQueryModel(
        impactedTracesTagFilterExpressionGenerator({
          alertId: alertId,
          applicationId: applicationId
        })
      );
    }
  }
}
