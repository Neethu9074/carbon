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
  alertConfig?: ApplicationSmartAlertConfig;
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

  // only application alert is supported for now
  if (!entityUtils.isAppDataEntityType(entityType) || !filterExpressions) {
    return null;
  }

  return (
    <ImpactedUsers
      alertType={alertConfig?.rule.alertType}
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
  alertConfig?: ApplicationSmartAlertConfig,
  eventEntity?: any
) {
  const entityType = event.get('entityType');

  eventEntity = eventEntity ?? {};

  let serviceName: string | undefined = undefined;
  let endpointName: string | undefined = undefined;
  let applicationId: string | undefined = eventEntity.applicationId;
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
    }
  }

  const adaptiveBaselineInfo = event.getIn(['metadata', 'adaptiveBaselineInfo'], emptyMap).toJS();

  if (!alertConfig && !applicationId && !serviceName && !endpointName) {
    return null;
  }

  if (!alertConfig) {
    return { impacted: getQueryModelForAppAlertWithoutAlertConfig(), total: null };
  }

  if (alertConfig.rule.alertType === 'throughput') {
    // we don't show the affected services/endpoints list for this blueprint type, because there is no simple property
    // to differentiate single calls from being violated or non-violated. Thus, we have to come up with a new way to do
    // this distinction.
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
    if (alertConfig?.rule.alertType === 'throughput') {
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

    return toBackendQueryModel(
      impactedTracesTagFilterExpressionGenerator({
        alertId: alertId,
        applicationId: applicationId
      })
    );
  }
}
