/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
import { List, Map } from 'immutable';

import { Button, Link, LoadingSkeleton, Stack, SvgIcon, Typography } from '@instana/components';
import { Observable, combineLatest } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

//@ts-expect-error
import { SnapshotData, getPhysicalHierarchy, getSnapshot, getSnapshotVersions } from 'in-stores/snapshot';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { APPLICATION, ENDPOINT, SERVICE, entityTypes, operators } from 'in-analyze/applicationFilter';
import AIProbabilityBadge from 'in-events/components/legacy/AIProbabilityBadge';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import { Application, Endpoint, ServiceLabel, TimeConfig } from 'in-types';
import getApplication from 'in-applications/subscriptions/getApplication';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLinkToAnalyze } from 'in-applications/navigation/paths';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import PluginIcon from 'in-components/PluginIcon/PluginIcon';
import { setTimeConfig } from 'in-stores/time/config';

import locals from 'in-events/components/legacy/EventList.mless';

export type ExplainabilityKeys =
  | 'percentageFailedNotThroughRC'
  | 'numCallsInAggregationNotThroughRC'
  | 'incoming'
  | 'relevantSnapshotID'
  | 'numCallsInAggregationThroughRC'
  | 'connectedServiceId'
  | 'percentageFailedThroughRC';
export interface ExplainabilityValues {
  percentageFailedNotThroughRC: number;
  numCallsInAggregationNotThroughRC: number;
  incoming: boolean;
  relevantSnapshotID: string;
  numCallsInAggregationThroughRC: number;
  connectedServiceId: string;
  percentageFailedThroughRC: number;
}

interface RootCauseEntityDetailsParams {
  rcaSnapshotID: string;
  rcaEntityType: string;
  explainabilityMetadata: List<Map<ExplainabilityKeys, ExplainabilityValues[ExplainabilityKeys]>>;
  probabilityScore: number;
  relatedAPID: string | null;
  setNextEntity: () => void;
  numOfSnapshots: number;
  incidentTimeWindow: TimeConfig;
}

export default function RootCauseEntityDetails({
  rcaSnapshotID,
  rcaEntityType,
  explainabilityMetadata,
  probabilityScore,
  relatedAPID,
  setNextEntity,
  numOfSnapshots,
  incidentTimeWindow
}: RootCauseEntityDetailsParams) {
  const [entityQuery, setEntityQuery] = useState<
    Observable<SnapshotData> | Observable<Endpoint | undefined> | Observable<ServiceLabel | undefined> | null
  >(null);
  const [hierarchyQuery, setHierarchyQuery] = useState<Observable<List<string>> | null>(null);
  const [timeWindow, setTimeWindow] = useState(incidentTimeWindow);
  const [serviceQuery, setServiceQuery] = useState<Observable<ServiceLabel | undefined> | null>(null);
  const { location } = useNavigation();

  const relatedApplicationInformation = useObservable(
    relatedAPID
      ? getApplication({ id: relatedAPID })
          .map(data => data.data)
          .throttle(250)
      : null,
    [rcaSnapshotID]
  );

  const hierarchySnapshots = useObservable(() => {
    if (hierarchyQuery) {
      return hierarchyQuery.flatMap(item =>
        combineLatest(
          item
            .toArray()
            .filter(id => id !== rcaSnapshotID) //filter out selected entity to avoid duplication for hosts
            .map(id => getSnapshot(id, timeWindow))
        )
      );
    } else {
      return null;
    }
  }, [timeWindow, hierarchyQuery]);

  const entityData = useObservable(entityQuery, [entityQuery]) ?? null;
  const serviceLabelInformation = useObservable(serviceQuery, [serviceQuery]) ?? null;

  useEffect(() => {
    if (rcaEntityType === 'infrastructure' || rcaEntityType === 'process') {
      // Need to get snapshot versions first and then retrieve appropriate snapshot
      setEntityQuery(
        getSnapshotVersions(rcaSnapshotID).map((versions: List<string>) => {
          if (List.isList(versions)) {
            const snapVersions = versions.toJS();
            if (snapVersions.length > 0) {
              const { to, from } = snapVersions[snapVersions.length - 1];

              const timeConfigFromSnapVersion = {
                windowSize: (to || Date.now()) - from,
                to,
                focusedMoment: to
              } as TimeConfig;
              setTimeConfig(location, timeConfigFromSnapVersion);
              setTimeWindow(timeConfigFromSnapVersion);
              setHierarchyQuery(
                getPhysicalHierarchy({ snapshotId: rcaSnapshotID, timeConfig: timeConfigFromSnapVersion })
              );
              setEntityQuery(getSnapshot(rcaSnapshotID, timeConfigFromSnapVersion));
            }
          }
        })
      );
    } else if (rcaEntityType === 'endpoint') {
      setEntityQuery(
        getEndpointInfo({ id: rcaSnapshotID })
          .map(data => data.data)
          .throttle(250)
      );
    } else if (rcaEntityType === 'service') {
      setEntityQuery(
        getServiceLabel({ id: rcaSnapshotID })
          .map(data => data.data)
          .throttle(250)
      );
    } else if (rcaEntityType === 'application') {
      setEntityQuery(
        getApplication({ id: rcaSnapshotID })
          .map(data => data.data)
          .throttle(250)
      );
    }
  }, [rcaSnapshotID, rcaEntityType, location]);

  useEffect(() => {
    //what about when service query returns null and service id exists?
    if (
      !serviceQuery &&
      rcaEntityType !== 'infrastructure' &&
      rcaEntityType !== 'process' &&
      entityData &&
      entityData.serviceId
    ) {
      setServiceQuery(
        getServiceLabel({ id: entityData.serviceId })
          .map(data => data.data)
          .throttle(250)
      );
    }
  }, [entityData, rcaSnapshotID, serviceQuery, rcaEntityType]);

  const urlForEntity = useGenerateLinksForEntity(
    rcaEntityType,
    rcaSnapshotID,
    relatedApplicationInformation,
    entityData,
    incidentTimeWindow,
    serviceLabelInformation
  );

  if (!entityData || !rcaSnapshotID) return <LoadingIndicator />;

  const rcaErrorPercent = extractAggregatedErrorRateFromExplainability(
    explainabilityMetadata,
    'percentageFailedThroughRC'
  );

  const notThroughRCAErrorPercent = extractAggregatedErrorRateFromExplainability(
    explainabilityMetadata,
    'percentageFailedNotThroughRC'
  );

  return (
    <div className={locals.entityDescription}>
      <Stack gap="small">
        <Stack direction="horizontal">
          <Stack gap="xxsmall">
            <Typography variant="body-bold">{t('in-events:RCA.probableRootCauseLabel')}</Typography>
            {entityData !== null && rcaEntityType !== 'infrastructure' && rcaEntityType !== 'process' && (
              <Link href={urlForEntity}>
                <EntityPath
                  relatedApplicationInformation={relatedApplicationInformation}
                  entityInformation={entityData}
                  serviceLabelInformation={serviceLabelInformation}
                  entityType={rcaEntityType}
                />
              </Link>
            )}
            {entityData !== null &&
              hierarchySnapshots &&
              (rcaEntityType === 'infrastructure' || rcaEntityType === 'process') && (
                <Link href={urlForEntity}>
                  <NonAppDataEntityPath
                    relatedApplicationInformation={relatedApplicationInformation}
                    hierarchySnapshots={hierarchySnapshots}
                    entityInformation={entityData}
                    serviceLabelInformation={serviceLabelInformation}
                    entityType={rcaEntityType}
                  />
                </Link>
              )}
            {entityData === null && <LoadingSkeleton className={locals.loadingEntity} />}
          </Stack>
          <AIProbabilityBadge probabilityScore={probabilityScore} loading={entityData === null} />
        </Stack>
        {explainabilityMetadata && (
          <Stack gap="xxsmall">
            <Typography variant="body-bold">{t('in-events:RCA.evidence')}</Typography>
            <Typography variant="body-regular">
              {t('in-events:RCA.evidenceTextFailed', {
                root_cause_entity_type: rcaEntityType,
                root_cause_entity_name: Map.isMap(entityData) ? entityData?.get('label') : entityData?.label,
                rca_error_percent: rcaErrorPercent.toFixed(2)
              })}
            </Typography>
            <Typography variant="body-regular">
              {determineWhichNotFailedTextToUse(
                rcaErrorPercent,
                notThroughRCAErrorPercent,
                rcaEntityType,
                Map.isMap(entityData) ? entityData?.get('label') : entityData?.label
              )}
            </Typography>
          </Stack>
        )}
        <Button
          onClick={setNextEntity}
          disabled={!numOfSnapshots || numOfSnapshots <= 1}
          icon="lib_actions_sync"
          iconSize="s"
          className={locals.regenerateButton}
        >
          {t('in-events:RCA.regenerateProbableRootCause')}
        </Button>
      </Stack>
    </div>
  );
}

function determineWhichNotFailedTextToUse(
  rcaErrorPercent: number,
  notThroughRCAErrorPercent: number,
  rootCauseEntityType: string,
  rootCauseEntityName: string
) {
  const translationDataObject = {
    root_cause_entity_type: rootCauseEntityType,
    root_cause_entity_name: rootCauseEntityName,
    non_rca_error_rate: notThroughRCAErrorPercent.toFixed(2)
  };

  if (notThroughRCAErrorPercent < rcaErrorPercent) {
    return t('in-events:RCA.evidenceTextNotFailedLower', translationDataObject);
  } else if (notThroughRCAErrorPercent === rcaErrorPercent) {
    return t('in-events:RCA.evidenceTextNotFailedSame', translationDataObject);
  } else {
    return t('in-events:RCA.evidenceTextNotFailedHigher', translationDataObject);
  }
}

function extractAggregatedErrorRateFromExplainability(
  explainabilityMetadata: List<Map<ExplainabilityKeys, ExplainabilityValues[ExplainabilityKeys]>>,
  error_rate_key: ExplainabilityKeys
) {
  if (!explainabilityMetadata) return 0;

  const aggreagatedInfo = explainabilityMetadata.find(service => service?.get('connectedServiceId') === 'all');
  let errorPercentage = aggreagatedInfo.get(error_rate_key) as number;

  if (typeof errorPercentage === 'number') {
    errorPercentage = errorPercentage * 100;
    return errorPercentage;
  } else {
    return NaN;
  }
}

interface EntityPathProps {
  relatedApplicationInformation: Application | null | undefined;
  entityInformation: SnapshotData;
  serviceLabelInformation: ServiceLabel | null | undefined;
  entityType: string;
}

function EntityPath({
  relatedApplicationInformation,
  entityInformation,
  serviceLabelInformation,
  entityType
}: EntityPathProps) {
  const relatedAPlabel = relatedApplicationInformation?.label;
  const relatedServiceLabel = serviceLabelInformation?.label;
  const entityLabel = Map.isMap(entityInformation) ? entityInformation?.get('label') : entityInformation?.label;
  return (
    <Stack direction="horizontal" gap="small" align="center">
      {relatedAPlabel && (
        <Stack direction="horizontal" gap="xsmall" align="center">
          <SvgIcon type={getIcon('application')} color={themes.default.cds.link.primary} />
          {`${relatedAPlabel} >`}
        </Stack>
      )}
      {relatedServiceLabel && isServiceLabelValid(relatedServiceLabel) && (
        <Stack direction="horizontal" gap="xsmall" align="center">
          <SvgIcon type={getIcon('service')} color={themes.default.cds.link.primary} />
          {`${relatedServiceLabel} >`}
        </Stack>
      )}
      {entityLabel && (
        <Stack direction="horizontal" gap="xsmall" align="center">
          <SvgIcon type={getIcon(entityType)} color={themes.default.cds.link.primary} />
          {entityLabel}
        </Stack>
      )}
    </Stack>
  );
}

interface NonAppDataEntityPathProps {
  relatedApplicationInformation: Application | null | undefined;
  entityInformation: SnapshotData | null;
  hierarchySnapshots: SnapshotData[] | null | undefined;
  serviceLabelInformation: ServiceLabel | null | undefined;
  entityType: string;
}

function NonAppDataEntityPath({
  relatedApplicationInformation,
  hierarchySnapshots,
  entityInformation,
  serviceLabelInformation,
  entityType
}: NonAppDataEntityPathProps) {
  const hostLabel = hierarchySnapshots
    ?.map(
      snapshot =>
        snapshot.get('plugin') === 'host' && { label: snapshot.get('label'), pluginType: snapshot.get('plugin') }
    )
    .pop();
  const relatedServiceLabel = serviceLabelInformation?.label;
  const relatedAPlabel = relatedApplicationInformation?.label;
  const entityLabel = Map.isMap(entityInformation) ? entityInformation?.get('label') : entityInformation?.label;

  return (
    <Stack direction="horizontal" gap="small" align="center">
      {relatedAPlabel && (
        <Stack direction="horizontal" gap="xsmall" align="center">
          <SvgIcon type={getIcon('application')} color={themes.default.cds.link.primary} />
          {`${relatedAPlabel} >`}
        </Stack>
      )}
      {relatedServiceLabel && isServiceLabelValid(relatedServiceLabel) && (
        <Stack direction="horizontal" gap="xsmall" align="center">
          <SvgIcon type={getIcon('service')} color={themes.default.cds.link.primary} />
          {`${relatedServiceLabel} >`}
        </Stack>
      )}
      {hostLabel && (
        <Stack direction="horizontal" gap="xsmall" align="center">
          <PluginIcon plugin={hostLabel.pluginType} color={themes.default.cds.link.primary} />
          {`${hostLabel.label} >`}
        </Stack>
      )}
      {entityLabel && (
        <Stack direction="horizontal" gap="xsmall" align="center">
          <SvgIcon type={getIcon(entityType)} color={themes.default.cds.link.primary} />
          {entityLabel}
        </Stack>
      )}
    </Stack>
  );
}

/* Utils for building links with TFEs for analytics page */

function getIcon(entityType: string): string {
  if (entityType === 'infrastructure') {
    return 'lib_infrastructure';
  } else if (entityType === 'process') {
    return 'lib_infra_process';
  } else if (entityType === 'endpoint') {
    return 'lib_infra_endpoint';
  } else if (entityType === 'service') {
    return 'lib_infra_service';
  } else if (entityType === 'application') {
    return 'lib_application';
  } else {
    return 'lib_infra_unknownIcon';
  }
}

function useGenerateLinksForEntity(
  entityType: string,
  originalID: string,
  relatedApplicationInformation: Application | null | undefined,
  entityInformation: SnapshotData | null,
  incidentTimeWindow: TimeConfig,
  serviceLabelInformation: ServiceLabel | null
): string | undefined {
  const getLinkToApplicationAnalyze = useLinkToAnalyze();

  //Convert entity information to json if it comes in as a map in case of getSnapshot
  if (entityInformation && Map.isMap(entityInformation)) entityInformation = entityInformation.toJS();

  if (relatedApplicationInformation && relatedApplicationInformation && entityInformation) {
    return getLinkToApplicationAnalyze({
      serviceName: entityType === 'service' ? entityInformation?.label : undefined,
      boundaryScope: 'ALL',
      facets: { 'call.erroneous': [true] },
      formModel:
        entityType !== 'application' && entityType !== 'service'
          ? generateFormModelForLinkToEntity(
              entityType,
              entityInformation,
              originalID,
              serviceLabelInformation,
              relatedApplicationInformation.label,
              entityType === 'endpoint' ? entityInformation?.label : undefined
            ) || undefined
          : undefined,
      timeConfig: incidentTimeWindow
    });
  } else if (entityInformation) {
    if (entityType !== 'application') {
      return getLinkToApplicationAnalyze({
        boundaryScope: 'ALL',
        facets: { 'call.erroneous': [true] },
        formModel:
          generateNonSmartAlertFormModelForLinkToEntity(
            entityType,
            entityInformation,
            originalID,
            serviceLabelInformation
          ) || undefined,
        timeConfig: incidentTimeWindow
      });
    } else if (entityType === 'application') {
      return getLinkToApplicationAnalyze({
        boundaryScope: 'ALL',
        applicationName: entityInformation.label,
        facets: { 'call.erroneous': [true] },
        timeConfig: incidentTimeWindow
      });
    }
  }
  return undefined;
}

function isServiceLabelValid(label: string) {
  return label !== 'UNKNOWN' && label !== 'Unspecified';
}

function generateNonSmartAlertFormModelForLinkToEntity(
  entityType: string,
  entityInformation: SnapshotData,
  originalID: string,
  serviceLabelInformation: ServiceLabel | null
): FormModelElement[] | null {
  let initialFormModel = null;

  if (serviceLabelInformation && serviceLabelInformation.label && isServiceLabelValid(serviceLabelInformation.label)) {
    initialFormModel = getTagFilterForSourceOrDestinationAndCombine(
      'service.name',
      serviceLabelInformation.label,
      null
    );
  }
  const isInfrastructureAProcess =
    entityInformation && entityInformation.plugin && entityInformation.plugin === 'process';

  if (entityType === 'infrastructure' && !isInfrastructureAProcess) {
    initialFormModel = getTagFilterForSourceOrDestinationAndCombine('host.snapshotId', originalID, initialFormModel);
  } else if (entityType === 'process' || isInfrastructureAProcess) {
    initialFormModel = getTagFilterForSourceOrDestinationAndCombine('process.snapshotId', originalID, initialFormModel);
  } else if (entityType === 'endpoint') {
    initialFormModel = getTagFilterForSourceOrDestinationAndCombine(
      ENDPOINT.name,
      entityInformation.label,
      initialFormModel
    );
  } else if (entityType === 'service') {
    initialFormModel = getTagFilterForSourceOrDestinationAndCombine(
      SERVICE.name,
      entityInformation.label,
      initialFormModel
    );
  }

  return initialFormModel;
}

function generateFormModelForLinkToEntity(
  entityType: string,
  entityInformation: SnapshotData,
  originalID: string,
  serviceLabelInformation: ServiceLabel | null,
  applicationLabel: string | null,
  endpointLabel: string | null
): FormModelElement[] | null {
  let initialFormModel = null;
  if (applicationLabel) {
    initialFormModel = getTagFilterForSourceOrDestinationAndCombine(
      APPLICATION.name,
      applicationLabel,
      initialFormModel
    );
  }
  if (endpointLabel) {
    initialFormModel = getTagFilterForSourceOrDestinationAndCombine(ENDPOINT.name, endpointLabel, initialFormModel);
  }
  if (serviceLabelInformation && serviceLabelInformation.label && isServiceLabelValid(serviceLabelInformation.label)) {
    initialFormModel = getTagFilterForSourceOrDestinationAndCombine(
      'service.name',
      serviceLabelInformation.label,
      null
    );
  }

  // Todo: cleanup after rca rework in backend that differentiates between process and infra
  const isInfrastructureAProcess =
    entityInformation && entityInformation.plugin && entityInformation.plugin === 'process';

  if (entityType === 'infrastructure' && !isInfrastructureAProcess) {
    initialFormModel = getTagFilterForSourceOrDestinationAndCombine('host.snapshotId', originalID, initialFormModel);
  } else if (entityType === 'process' || isInfrastructureAProcess) {
    initialFormModel = getTagFilterForSourceOrDestinationAndCombine('process.snapshotId', originalID, initialFormModel);
  }
  return initialFormModel;
}

function getTagFilterForSourceOrDestinationAndCombine(
  name: string,
  value: string,
  initialVal: FormModelElement[] | null
): FormModelElement[] {
  const filterToJoin = joinExpressions({
    logicalOperator: 'OR',
    expressions: [
      {
        type: 'TAG_FILTER',
        name: name,
        value: value,
        operator: operators.EQUALS,
        entity: entityTypes.SOURCE
      },
      {
        type: 'TAG_FILTER',
        name: name,
        value: value,
        operator: operators.EQUALS,
        entity: entityTypes.DESTINATION
      }
    ]
  });

  if (initialVal) {
    return joinExpressions({ logicalOperator: 'AND', expressions: [initialVal, filterToJoin] });
  } else {
    return filterToJoin;
  }
}
