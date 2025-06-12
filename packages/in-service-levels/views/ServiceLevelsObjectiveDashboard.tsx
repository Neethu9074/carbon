/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Error, isApplicationSloEntity, Result, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { combineLatest, just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  serviceLevelsObjectiveAlertsFullyQualified,
  serviceLevelsObjectiveSummaryFullyQualified
} from 'in-service-levels/navigation/path';
import tabs, {
  ApplicationSloTabData,
  isApplicationSloTabData,
  SloTabData
} from 'in-service-levels/components/SloDashboard/tabs';
import SloMetaInfoHeader from 'in-service-levels/components/SloDashboard/components/SloMetaInfoHeader/SloMetaInfoHeader';
import { defaultServiceLevelObjectiveUrlParameters, SloUrlState } from 'in-service-levels/navigation/urlParameters';
import SloTimeWindowProvider from 'in-service-levels/components/SloDashboard/components/SloTimeWindowProvider';
import SloDashboardHeader from 'in-service-levels/components/SloDashboard/components/SloDashboardHeader';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import FloatingActionButton from 'in-components/FloatingActionButton/FloatingActionButton';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/slo/CreateSmartAlertDialog';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import { LabeledEntity, SloMonitoredEntity } from 'in-service-levels/types';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import { getSloConfiguration } from 'in-service-levels/api/sloConfiguration';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { loadEntities } from 'in-service-levels/utils/loadEntities';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { productAreas } from 'in-services/tracking/productAreas';
import { hasError, isLoading } from 'in-services/util/result';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { pendingResult } from 'in-services/fixedObjects';
import Footer from 'in-components/Footer/Footer';
import useUrlState from 'in-hooks/useUrlState';
import { all } from 'in-hooks/utils/progress';
import { t } from 'in-i18n';

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
  const isSmartAlertsDashboardList = location.pathname === serviceLevelsObjectiveAlertsFullyQualified;

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.slo,
          pageRootName:
            location.pathname === serviceLevelsObjectiveSummaryFullyQualified
              ? pageNames.slo_summary
              : pageNames.slo_config
        }}
      />
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
      {(!smartAlertCarbonTableEnabled || (smartAlertCarbonTableEnabled && !isSmartAlertsDashboardList)) && (
        <FloatingActionButtons>
          <FloatingActionButton
            icon="lib_alerts_create"
            kind="primaryv2"
            onClick={() => addActiveDialog(<CreateSmartAlertDialog preselectedSloId={tabData?.configuration.id} />)}
          >
            {t('in-service-levels:general.addButtonLabel', { context: 'smartAlert' })}
          </FloatingActionButton>
        </FloatingActionButtons>
      )}
    </>
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
        Observable<Result<ServiceLevelObjectiveConfiguration | SloMonitoredEntity | SloMonitoredEntity[]>>
      > = [createResultWithIdentifier(just(result), ResultIdentifier.CONFIG)];

      observables.push(createResultWithIdentifier(loadEntities(entity), ResultIdentifier.ENTITY));

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

      const entities: LabeledEntity[] = (entityResult?.data as LabeledEntity[]) ?? [unknownEntity];

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
