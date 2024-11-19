/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  Error,
  isApplicationSloEntity,
  isSyntheticSloEntity,
  Result,
  ServiceLevelObjectiveConfiguration
} from '@instana/types';
import { combineLatest, just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import tabs, {
  ApplicationSloTabData,
  isApplicationSloTabData,
  SloTabData
} from 'in-service-levels/components/SloDashboard/tabs';
import { defaultServiceLevelObjectiveUrlParameters, SloUrlState } from 'in-service-levels/navigation/urlParameters';
import SloTimeWindowProvider from 'in-service-levels/components/SloDashboard/components/SloTimeWindowProvider';
import SloDashboardHeader from 'in-service-levels/components/SloDashboard/components/SloDashboardHeader';
import { loadEntities, loadEntity, MonitoredEntity } from 'in-service-levels/hooks/useSloEntitiesLabels';
import SloMetaInfoHeader from 'in-service-levels/components/SloDashboard/components/SloMetaInfoHeader';
import { serviceLevelsObjectiveSummaryFullyQualified } from 'in-service-levels/navigation/path';
import { SloTrackerProvider, sloTrackers } from 'in-service-levels/hooks/SloTrackerProvider';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import FloatingActionButton from 'in-components/FloatingActionButton/FloatingActionButton';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/slo/CreateSmartAlertDialog';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import { getSloConfiguration } from 'in-service-levels/api/configuration';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { productAreas } from 'in-services/tracking/productAreas';
import { hasError, isLoading } from 'in-services/util/result';
import { pageNames } from 'in-services/tracking/pageNames';
import { pendingResult } from 'in-services/fixedObjects';
import { LabeledEntity } from 'in-service-levels/types';
import Footer from 'in-components/Footer/Footer';
import useUrlState from 'in-hooks/useUrlState';
import { all } from 'in-hooks/utils/progress';

const unknownEntity: LabeledEntity = {
  id: '',
  label: t('in-service-levels:general.entityTypes.label', { context: 'unknown' }),
  deleted: true
};

interface ResultWithIdentifier<I> extends Result<I> {
  subscriptionIdentifier: string;
}

export default function ServiceLevelsObjectiveDashboard() {
  const location = useLocation();
  const [{ sloId }] = useUrlState<SloUrlState>({
    bind: [defaultServiceLevelObjectiveUrlParameters.sloId]
  });

  const tabProps = useObservable(() => {
    return getData(sloId);
  }, [sloId]);

  const tabData = tabProps?.data;
  const entities = tabData?.entities;
  const service = tabData && isApplicationSloTabData(tabData) ? tabData.service : undefined;
  const endpoint = tabData && isApplicationSloTabData(tabData) ? tabData.endpoint : undefined;
  const configuration = tabData?.configuration;
  const sloTimeWindow = configuration?.timeWindow;
  const openCreateSmartAlertDialog = () =>
    addActiveDialog(<CreateSmartAlertDialog preselectedSloId={tabData?.configuration.id} />);

  return (
    <SloTrackerProvider
      trackers={sloTrackers}
      meta={{
        productArea: productAreas.slo,
        pageName:
          location.pathname === serviceLevelsObjectiveSummaryFullyQualified
            ? pageNames.slo_summary
            : pageNames.slo_config
      }}
    >
      <SloTimeWindowProvider
        sloConfigId={sloId}
        sloTimeWindow={sloTimeWindow}
        timeWindowTypeParameterDefinition={defaultServiceLevelObjectiveUrlParameters.timeWindowType}
      >
        <TabView
          location={location}
          HeaderComponent={SloDashboardHeader}
          tabs={tabs}
          props={tabProps ?? {}}
          additionalHeader={
            <SloMetaInfoHeader
              configuration={configuration}
              entities={entities}
              service={service}
              endpoint={endpoint}
            />
          }
        />
      </SloTimeWindowProvider>
      <Footer />
      <FloatingActionButtons>
        <FloatingActionButton icon="lib_alerts_create" kind="primaryv2" onClick={openCreateSmartAlertDialog}>
          {t('in-service-levels:general.addButtonLabel', { context: 'smartAlert' })}
        </FloatingActionButton>
      </FloatingActionButtons>
    </SloTrackerProvider>
  );
}

const ResultIdentifier = Object.freeze({
  CONFIG: 'CONFIG',
  ENTITY: 'ENTITY',
  SERVICE: 'SERVICE',
  ENDPOINT: 'ENDPOINT'
} as const);

function getData(sloId: string): Observable<Result<SloTabData | ApplicationSloTabData>> {
  return getSloConfiguration(sloId)
    .flatMap((result): Observable<Result<unknown>[]> => {
      if (isLoading(result) || hasError(result)) {
        return just([result, pendingResult]);
      }

      const { entity } = result.data!;
      const observables: Array<
        Observable<Result<ServiceLevelObjectiveConfiguration | MonitoredEntity | MonitoredEntity[]>>
      > = [createResultWithIdentifier(just(result), ResultIdentifier.CONFIG)];

      if (isSyntheticSloEntity(entity)) {
        observables.push(
          createResultWithIdentifier(loadEntities('synthetic', entity.syntheticTestIds), ResultIdentifier.ENTITY)
        );
      } else {
        observables.push(createResultWithIdentifier(loadEntity(entity), ResultIdentifier.ENTITY));
      }

      if (isApplicationSloEntity(entity)) {
        const { serviceId, endpointId } = entity;
        if (serviceId) {
          observables.push(createResultWithIdentifier(getServiceLabel({ id: serviceId }), ResultIdentifier.SERVICE));
        }
        if (endpointId) {
          observables.push(createResultWithIdentifier(getEndpointInfo({ id: endpointId }), ResultIdentifier.ENDPOINT));
        }
      }

      return combineLatest<Result<unknown>>(observables);
    })
    .map((results): Result<SloTabData | ApplicationSloTabData> => {
      if (isLoading(...results)) return pendingResult as Result<SloTabData>;

      const entityResult = getResultByIdentifier(results, ResultIdentifier.ENTITY);
      const serviceResult = getResultByIdentifier(results, ResultIdentifier.SERVICE);
      const endpointResult = getResultByIdentifier(results, ResultIdentifier.ENDPOINT);

      // If an entity, service or endpoint got deleted we get a NOT_FOUND error for labels from the backend and the status will be rejected.
      // However, the NOT_FOUND error is an expected error that can happen and we should display the SLO details anyway.
      const entityErrors = (entityResult?.errors ?? ([] as Error[])).filter(({ code }) => code !== 'NOT_FOUND');
      const serviceErrors = (serviceResult?.errors ?? ([] as Error[])).filter(({ code }) => code !== 'NOT_FOUND');
      const endpointErrors = (endpointResult?.errors ?? ([] as Error[])).filter(({ code }) => code !== 'NOT_FOUND');

      // We need to cast here, because the types for combineLatest don't handle non uniform observables very well.
      // And we don't have a better way to combine such non uniform observables with better typing
      const configuration = results[0].data as ServiceLevelObjectiveConfiguration;
      const { entity } = configuration;

      const entities: LabeledEntity[] = isSyntheticSloEntity(entity)
        ? entity.syntheticTestIds.map(synthTestId => {
            const data = (entityResult?.data ?? []) as LabeledEntity[];
            const foundEntity = data.find(({ id }) => id === synthTestId);
            return foundEntity ?? unknownEntity;
          })
        : [(entityResult?.data as LabeledEntity) ?? unknownEntity];

      const service: LabeledEntity = (serviceResult?.data as LabeledEntity) ?? undefined;
      const endpoint: LabeledEntity = (endpointResult?.data as LabeledEntity) ?? undefined;

      return {
        progress: all(...results.map(r => r.progress)),
        data: {
          configuration,
          entities,
          service,
          endpoint
        },

        errors: results.flatMap(r => {
          if (isResultFor(r, ResultIdentifier.ENTITY)) return entityErrors;
          if (isResultFor(r, ResultIdentifier.SERVICE)) return serviceErrors;
          if (isResultFor(r, ResultIdentifier.ENDPOINT)) return endpointErrors;
          return r.errors;
        })
      };
    });
}

function createResultWithIdentifier<I>(
  subscription: Observable<Result<I>>,
  subscriptionIdentifier: string
): Observable<ResultWithIdentifier<I>> {
  return subscription.map(result => ({ ...result, subscriptionIdentifier }));
}

function isResultWithIdentifier<I>(result: Result<I>): result is ResultWithIdentifier<I> {
  return 'subscriptionIdentifier' in result;
}

function isResultFor<I>(
  result: ResultWithIdentifier<any> | Result<any>,
  subscriptionIdentifier: ResultWithIdentifier<I>['subscriptionIdentifier']
): boolean {
  return isResultWithIdentifier(result) && result.subscriptionIdentifier === subscriptionIdentifier;
}

function getResultByIdentifier<I>(
  results: ResultWithIdentifier<any>[] | Result<any>[],
  subscriptionIdentifier: ResultWithIdentifier<I>['subscriptionIdentifier']
): ResultWithIdentifier<I> | undefined {
  const result = results.find(result => isResultFor(result, subscriptionIdentifier));

  if (result && isResultWithIdentifier(result)) return result;

  return undefined;
}
