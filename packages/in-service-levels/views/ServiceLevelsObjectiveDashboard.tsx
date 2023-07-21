/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { isApplicationSloEntity, Result, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { combineLatest, just, Observable } from '@instana/observables';

import SloDashboardHeader from 'in-service-levels/components/SloDashboard/components/SloDashboardHeader';
import tabs, { ApplicationSloTabData, SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import { defaultServiceLevelObjectiveUrlParameters } from 'in-service-levels/navigation/urlParameters';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import { getSloConfiguration } from 'in-service-levels/api/configuration';
import { loadEntity } from 'in-service-levels/hooks/useSloEntitiesLabels';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { LabeledEntity } from 'in-service-levels/types';
import useUrlState from 'in-hooks/useUrlState';
import { all } from 'in-hooks/utils/progress';

export default function ServiceLevelsObjectiveDashboard() {
  const location = useLocation();
  const [{ sloId }] = useUrlState<{ sloId: string }>({
    bind: [defaultServiceLevelObjectiveUrlParameters.sloId]
  });

  return (
    <TabView location={location} result$={getData(sloId)} HeaderComponent={SloDashboardHeader} tabs={tabs} props={{}} />
  );
}

function getData(sloId: string): Observable<Result<SloTabData | ApplicationSloTabData>> {
  return getSloConfiguration(sloId)
    .flatMap((result): Observable<Result<unknown>[]> => {
      if (isLoading(result) || hasError(result)) {
        return just([result, pendingResult]);
      }

      const { entity } = result.data!;
      const observables = [just(result), loadEntity(entity)];

      if (isApplicationSloEntity(entity)) {
        const { serviceId, endpointId } = entity;
        if (serviceId) {
          observables.push(getServiceLabel({ id: serviceId }));
        }
        if (endpointId) {
          observables.push(getEndpointInfo({ id: endpointId }));
        }
      }

      return combineLatest<Result<unknown>>(observables);
    })
    .map((results): Result<SloTabData | ApplicationSloTabData> => {
      if (isLoading(...results)) return pendingResult as Result<SloTabData>;

      return {
        progress: all(...results.map(r => r.progress)),
        data: {
          // We need to cast here, because the types for combineLatest don't handle non uniform observables very well.
          // And we don't have a better way to combine such non uniform observables with better typing
          configuration: results[0].data! as ServiceLevelObjectiveConfiguration,
          entity: results[1]?.data! as LabeledEntity,
          service: results[2]?.data! as LabeledEntity | undefined,
          endpoint: results[3]?.data! as LabeledEntity | undefined
        },
        errors: results.flatMap(r => r.errors)
      };
    });
}
