/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Result, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { combineLatest, just, Observable } from '@instana/observables';

import SloDashboardHeader from 'in-service-levels/components/SloDashboard/components/SloDashboardHeader';
import { defaultServiceLevelObjectiveUrlParameters } from 'in-service-levels/navigation/urlParameters';
import tabs, { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
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

function getData(sloId: string): Observable<Result<SloTabData>> {
  return getSloConfiguration(sloId)
    .flatMap((result): Observable<[Result<ServiceLevelObjectiveConfiguration>, Result<LabeledEntity>]> => {
      if (isLoading(result) || hasError(result)) {
        return just([result, pendingResult]);
      }
      return combineLatest([just(result), loadEntity(result.data!.entity)]);
    })
    .map((results): Result<SloTabData> => {
      if (isLoading(...results)) return pendingResult as Result<SloTabData>;

      return {
        progress: all(...results.map(r => r.progress)),
        data: {
          configuration: results[0].data!,
          entity: results[1]?.data!
        },
        errors: results.flatMap(r => r.errors)
      };
    });
}
