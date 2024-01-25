/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Error, isApplicationSloEntity, Result, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { combineLatest, just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import tabs, {
  ApplicationSloTabData,
  isApplicationSloTabData,
  SloTabData
} from 'in-service-levels/components/SloDashboard/tabs';
import SloTimeWindowProvider from 'in-service-levels/components/SloDashboard/components/SloTimeWindowProvider';
import SloDashboardHeader from 'in-service-levels/components/SloDashboard/components/SloDashboardHeader';
import { defaultServiceLevelObjectiveUrlParameters } from 'in-service-levels/navigation/urlParameters';
import SloMetaInfoHeader from 'in-service-levels/components/SloDashboard/components/SloMetaInfoHeader';
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

  const tabProps = useObservable(() => {
    return getData(sloId);
  }, [sloId]);

  const tabData = tabProps?.data;
  const entity = tabData?.entity;
  const service = tabData && isApplicationSloTabData(tabData) ? tabData.service : undefined;
  const configuration = tabData?.configuration;
  const sloTimeWindow = configuration?.timeWindow;

  return (
    <SloTimeWindowProvider sloConfigId={sloId} sloTimeWindow={sloTimeWindow}>
      <TabView
        location={location}
        HeaderComponent={SloDashboardHeader}
        tabs={tabs}
        props={tabProps ?? {}}
        additionalHeader={<SloMetaInfoHeader configuration={configuration} entity={entity} service={service} />}
      />
    </SloTimeWindowProvider>
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

      // If an entity, service or endpoint got deleted we get a NOT_FOUND error for labels from the backend and the status will be rejected.
      // However, the NOT_FOUND error is an expected error that can happen and we should display the SLO details anyway.
      const entityErrors = (results[1]?.errors ?? ([] as Error[])).filter(({ code }) => code !== 'NOT_FOUND');
      const serviceErrors = (results[2]?.errors ?? ([] as Error[])).filter(({ code }) => code !== 'NOT_FOUND');
      const endpointErrors = (results[3]?.errors ?? ([] as Error[])).filter(({ code }) => code !== 'NOT_FOUND');

      // We need to cast here, because the types for combineLatest don't handle non uniform observables very well.
      // And we don't have a better way to combine such non uniform observables with better typing
      const configuration = results[0].data as ServiceLevelObjectiveConfiguration;
      const entity: LabeledEntity = (results[1]?.data as LabeledEntity) ?? {
        label: t('in-service-levels:general.entityTypes.label', { context: 'unknown' })
      };
      const service: LabeledEntity = (results[2]?.data as LabeledEntity) ?? undefined;
      const endpoint: LabeledEntity = (results[3]?.data as LabeledEntity) ?? undefined;

      return {
        progress: all(...results.map(r => r.progress)),
        data: {
          configuration,
          entity,
          service,
          endpoint
        },

        errors: results.flatMap((r, index) => {
          if (index === 1) return entityErrors;
          if (index === 2) return serviceErrors;
          if (index === 3) return endpointErrors;
          return r.errors;
        })
      };
    });
}
