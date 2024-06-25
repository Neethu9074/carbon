/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
import { List, Map } from 'immutable';

import { Button, Link, LoadingSkeleton, Spacer, Stack, SvgIcon, Typography } from '@instana/components';
import { Observable, combineLatest } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { t, Trans } from '@instana/i18n-react';

//@ts-expect-error
import { SnapshotData, getPhysicalHierarchy, getSnapshot, getSnapshotVersions } from 'in-stores/snapshot';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { APPLICATION, ENDPOINT, SERVICE, entityTypes, operators } from 'in-analyze/applicationFilter';
import { Location, MatrixParameters, Parameters } from 'in-stores/navigation/types';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import AIProbabilityBadge from 'in-events/components/legacy/AIProbabilityBadge';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import { Application, Endpoint, ServiceLabel, TimeConfig } from 'in-types';
import getApplication from 'in-applications/subscriptions/getApplication';
import { snapshotIdUrlParameter } from 'in-stores/snapshot/urlParameters';
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
  entityID: Map<string, string>;
  explainabilityMetadata: List<Map<ExplainabilityKeys, ExplainabilityValues[ExplainabilityKeys]>>;
  probabilityScore: number;
  relatedAPID: string | null;
  incidentTimeWindow: TimeConfig;
}

const endpointIDURLParameter = 'endpointId';
const serviceIDURLParameter = 'serviceId';
const appIDURLParameter = 'appId';

export default function RootCauseEntityDetails({
  rcaSnapshotID,
  rcaEntityType,
  entityID,
  explainabilityMetadata,
  probabilityScore,
  relatedAPID,
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
  // Generate links to dashboards
  const linkToEntity = useGenerateLinkToDashboard(rcaEntityType, rcaSnapshotID, location, relatedAPID);
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
            {entityData !== null && rcaEntityType !== 'infrastructure' && rcaEntityType !== 'process' && (
              <EntityPath
                relatedApplicationInformation={relatedApplicationInformation}
                entityInformation={entityData}
                serviceLabelInformation={serviceLabelInformation}
                entityType={rcaEntityType}
                originalID={rcaSnapshotID}
              />
            )}
            {entityData !== null &&
              hierarchySnapshots &&
              (rcaEntityType === 'infrastructure' || rcaEntityType === 'process') && (
                <NonAppDataEntityPath
                  relatedApplicationInformation={relatedApplicationInformation}
                  hierarchySnapshots={hierarchySnapshots}
                  entityInformation={entityData}
                  serviceLabelInformation={serviceLabelInformation}
                  entityId={entityID}
                  entityType={rcaEntityType}
                  originalID={rcaSnapshotID}
                />
              )}
            {entityData === null && <LoadingSkeleton className={locals.loadingEntity} />}
          </Stack>
          <AIProbabilityBadge probabilityScore={probabilityScore} loading={entityData === null} />
        </Stack>
        {explainabilityMetadata && (
          <Stack gap="xxsmall">
            <Typography variant="body-bold">{t('in-events:RCA.evidence')}</Typography>
            <Trans
              i18nKey="in-events:RCA.evidenceTextFailed"
              components={{
                //@ts-expect-error
                linkToEntity: <Link href={linkToEntity} />,
                entityIcon:
                  rcaEntityType !== ('infrastructure' || 'process') ? (
                    <SvgIcon type={getIcon(rcaEntityType)} color={themes.default.cds.link.primary} size="xs" />
                  ) : (
                    <PluginIcon
                      plugin={translateFullyQualifiedPluginToShortPluginName(entityID.get('pluginId')) || ''}
                      color={themes.default.cds.link.primary}
                      size="xs"
                    />
                  )
              }}
              values={{
                root_cause_entity_type: rcaEntityType,
                root_cause_entity_name: Map.isMap(entityData) ? entityData?.get('label') : entityData?.label,
                rca_error_percent: rcaErrorPercent.toFixed(2)
              }}
              parent="span"
            />
            <FailedText
              rcaErrorPercent={rcaErrorPercent}
              notThroughRCAErrorPercent={notThroughRCAErrorPercent}
              rootCauseEntityType={rcaEntityType}
              rootCauseEntityName={Map.isMap(entityData) ? entityData?.get('label') : entityData?.label}
              linkToEntity={linkToEntity}
              entityIcon={
                rcaEntityType !== ('infrastructure' || 'process') ? (
                  <SvgIcon type={getIcon(rcaEntityType)} color={themes.default.cds.link.primary} size="xs" />
                ) : (
                  <PluginIcon
                    plugin={translateFullyQualifiedPluginToShortPluginName(entityID.get('pluginId')) || ''}
                    color={themes.default.cds.link.primary}
                    size="xs"
                  />
                )
              }
            />
          </Stack>
        )}
        <Button kind="primary" icon="lib_application_call" href={urlForEntity} size="compact">
          {t('in-applications:buttonAnalyzeCalls')}
        </Button>
      </Stack>
    </div>
  );
}

function FailedText({
  rcaErrorPercent,
  notThroughRCAErrorPercent,
  rootCauseEntityType,
  rootCauseEntityName,
  linkToEntity,
  entityIcon
}: {
  rcaErrorPercent: number;
  notThroughRCAErrorPercent: number;
  rootCauseEntityType: string;
  rootCauseEntityName: string;
  linkToEntity: string | undefined;
  entityIcon: JSX.Element;
}) {
  const translationDataObject = {
    root_cause_entity_type: rootCauseEntityType,
    root_cause_entity_name: rootCauseEntityName,
    non_rca_error_rate: notThroughRCAErrorPercent.toFixed(2)
  };

  if (notThroughRCAErrorPercent < rcaErrorPercent) {
    //return t('in-events:RCA.evidenceTextNotFailedLower', translationDataObject);
    return (
      <Trans
        i18nKey="in-events:RCA.evidenceTextNotFailedLower"
        //@ts-expect-error
        components={{ linkToEntity: <Link href={linkToEntity} />, entityIcon: entityIcon }}
        values={translationDataObject}
        parent="span"
      />
    );
  } else if (notThroughRCAErrorPercent === rcaErrorPercent) {
    //return t('in-events:RCA.evidenceTextNotFailedSame', translationDataObject);
    return (
      <Trans
        i18nKey="in-events:RCA.evidenceTextNotFailedSame"
        //@ts-expect-error
        components={{ linkToEntity: <Link href={linkToEntity} />, entityIcon: entityIcon }}
        values={translationDataObject}
        parent="span"
      />
    );
  } else {
    //return t('in-events:RCA.evidenceTextNotFailedHigher', translationDataObject);
    return (
      <Trans
        i18nKey="in-events:RCA.evidenceTextNotFailedHigher"
        //@ts-expect-error
        components={{ linkToEntity: <Link href={linkToEntity} />, entityIcon: entityIcon }}
        values={translationDataObject}
        parent="span"
      />
    );
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
  originalID: string;
  serviceLabelInformation: ServiceLabel | null | undefined;
  entityType: string;
}

function EntityPath({
  relatedApplicationInformation,
  entityInformation,
  originalID,
  serviceLabelInformation,
  entityType
}: EntityPathProps) {
  const { location } = useNavigation();

  // Pulling out labels
  const relatedAPlabel = relatedApplicationInformation?.label;
  const relatedServiceLabel = serviceLabelInformation?.label;
  const entityLabel = Map.isMap(entityInformation) ? entityInformation?.get('label') : entityInformation?.label;

  // Pulling out IDs for service and APs
  const relatedAPID = relatedApplicationInformation ? relatedApplicationInformation.id : null;
  const relatedServiceID = serviceLabelInformation ? serviceLabelInformation.id : null;

  // Generate links to dashboards
  const linkToEntity = useGenerateLinkToDashboard(entityType, originalID, location, relatedAPID);
  const linkToAP = useGenerateLinkToDashboard('application', relatedAPID, location, null);
  const linkToService = useGenerateLinkToDashboard('service', relatedServiceID, location, relatedAPID);

  return (
    <Stack gap="xsmall">
      <Stack gap="xsmall">
        <Typography variant="body-bold">
          {t('in-events:RCA.probableRootCauseLabel', {
            entity_type: entityType ? entityType.charAt(0).toUpperCase() + entityType.slice(1).toLowerCase() : 'Entity'
          })}
        </Typography>
        <Link href={linkToEntity}>
          <Stack direction="horizontal" gap="xsmall" align="center">
            <SvgIcon type={getIcon(entityType)} color={themes.default.cds.link.primary} />
            {entityLabel}
          </Stack>
        </Link>
      </Stack>
      {relatedServiceLabel && isServiceLabelValid(relatedServiceLabel) && (
        <Stack direction="horizontal" gap="xsmall" align="center">
          <Spacer horizontal="small" />
          <div>
            <div className={locals.infraLineDown} />
            <div className={locals.infraLineRight} />
          </div>
          <Typography variant="body-small">{'In service: '}</Typography>
          <Link href={linkToService}>
            <Stack direction="horizontal" gap="xsmall" align="center">
              <SvgIcon type={getIcon('service')} color={themes.default.cds.link.primary} />
              <Typography variant="body-small" component="a">
                {relatedServiceLabel}
              </Typography>
            </Stack>
          </Link>
        </Stack>
      )}
      {relatedAPlabel && (
        <Stack direction="horizontal" gap="xsmall" align="center">
          <Spacer horizontal="small" />
          <div>
            <div className={locals.infraLineDown} />
            <div className={locals.infraLineRight} />
          </div>

          <Typography variant="body-small">{'As part of application perspective: '}</Typography>
          <Link href={linkToAP}>
            <Stack direction="horizontal" gap="xsmall" align="center">
              <SvgIcon type={getIcon('application')} color={themes.default.cds.link.primary} size="s" />
              <Typography variant="body-small" component="a">
                {relatedAPlabel}
              </Typography>
            </Stack>
          </Link>
        </Stack>
      )}
    </Stack>
  );
}

interface NonAppDataEntityPathProps {
  relatedApplicationInformation: Application | null | undefined;
  entityInformation: SnapshotData;
  originalID: string;
  hierarchySnapshots: SnapshotData[] | null | undefined;
  serviceLabelInformation: ServiceLabel | null | undefined;
  entityId: Map<string, string>;
  entityType: string;
}

function NonAppDataEntityPath({
  relatedApplicationInformation,
  hierarchySnapshots,
  entityInformation,
  originalID,
  serviceLabelInformation,
  entityId,
  entityType
}: NonAppDataEntityPathProps) {
  const { location } = useNavigation();

  // Pulling out labels
  const hostLabel = hierarchySnapshots
    ?.map(
      snapshot =>
        snapshot.get('plugin') === 'host' && {
          label: snapshot.get('label'),
          pluginType: snapshot.get('plugin'),
          id: snapshot.get('id')
        }
    )
    .pop();
  const relatedServiceLabel = serviceLabelInformation?.label;
  const relatedAPlabel = relatedApplicationInformation?.label;
  const entityLabel = Map.isMap(entityInformation) ? entityInformation?.get('label') : entityInformation?.label;

  // Pulling out IDs for service and APs
  const relatedAPID = relatedApplicationInformation ? relatedApplicationInformation.id : null;
  const relatedHostID = hostLabel ? hostLabel.id : null;
  const relatedServiceID = serviceLabelInformation ? serviceLabelInformation.id : null;

  // Generate links to dashboards
  const linkToEntity = useGenerateLinkToDashboard(entityType, originalID, location, relatedAPID);
  const linkToHostOfEntity = useGenerateLinkToDashboard('infrastructure', relatedHostID, location, relatedAPID);
  const linkToService = useGenerateLinkToDashboard('service', relatedServiceID, location, relatedAPID);
  const linkToAP = useGenerateLinkToDashboard('application', relatedAPID, location, null);

  const pluginToShortPluginName = translateFullyQualifiedPluginToShortPluginName(entityId.get('pluginId')) || 'entity';
  return (
    <Stack gap="xsmall">
      <Stack gap="xsmall">
        <Typography variant="body-bold">
          {t('in-events:RCA.probableRootCauseLabel', {
            entity_type:
              pluginToShortPluginName.charAt(0).toUpperCase() + pluginToShortPluginName.slice(1).toLowerCase()
          })}
        </Typography>
        <Link href={linkToEntity}>
          <Stack direction="horizontal" gap="xsmall" align="center">
            <PluginIcon
              plugin={pluginToShortPluginName !== 'entity' ? pluginToShortPluginName : ''}
              color={themes.default.cds.link.primary}
            />
            {entityLabel}
          </Stack>
        </Link>
      </Stack>
      {hostLabel && (
        <Stack direction="horizontal" gap="xsmall" align="center">
          <Spacer horizontal="small" />
          <div>
            <div className={locals.infraLineDown} />
            <div className={locals.infraLineRight} />
          </div>
          <Typography variant="body-small">{'Runs on: '}</Typography>
          <Link href={linkToHostOfEntity}>
            <Stack direction="horizontal" gap="xsmall" align="center">
              <PluginIcon plugin={hostLabel.pluginType} color={themes.default.cds.link.primary} />
              <Typography variant="body-small" component="a">
                {hostLabel.label}
              </Typography>
            </Stack>
          </Link>
        </Stack>
      )}
      {relatedServiceLabel && isServiceLabelValid(relatedServiceLabel) && (
        <Stack direction="horizontal" gap="xsmall" align="center">
          <Spacer horizontal="small" />
          <div>
            <div className={locals.infraLineDown} />
            <div className={locals.infraLineRight} />
          </div>
          <Typography variant="body-small">{'In service: '}</Typography>
          <Link href={linkToService}>
            <Stack direction="horizontal" gap="xsmall" align="center">
              <SvgIcon type={getIcon('service')} color={themes.default.cds.link.primary} />
              <Typography variant="body-small" component="a">
                {relatedServiceLabel}
              </Typography>
            </Stack>
          </Link>
        </Stack>
      )}
      {relatedAPlabel && (
        <Stack direction="horizontal" gap="xsmall" align="center">
          <Spacer horizontal="small" />
          <div>
            <div className={locals.infraLineDown} />
            <div className={locals.infraLineRight} />
          </div>
          <Typography variant="body-small">{'As part of application: '}</Typography>
          <Link href={linkToAP}>
            <Stack direction="horizontal" gap="xsmall" align="center">
              <SvgIcon type={getIcon('application')} color={themes.default.cds.link.primary} size="s" />
              <Typography variant="body-small" component="a">
                {relatedAPlabel}
              </Typography>
            </Stack>
          </Link>
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

function useGenerateLinkToDashboard(
  entityType: string,
  originalID: string | null | undefined,
  location: Location,
  relatedAPID: string | null
) {
  const { createHref } = useNavigation();
  const query = { ...location.query };
  const matrixParam = {} as MatrixParameters;
  let pathname = '';

  if (!originalID) return undefined;

  if (entityType === 'infrastructure' || entityType === 'process') {
    query[snapshotIdUrlParameter.name] = originalID;
    pathname = '/physical/dashboard';
  } else if (entityType === 'endpoint') {
    pathname = '/endpoint/summary';
    matrixParam['/endpoint'] = buildMatrixParam(endpointIDURLParameter, originalID, relatedAPID);
  } else if (entityType === 'service') {
    pathname = '/service/summary';
    matrixParam['/service'] = buildMatrixParam(serviceIDURLParameter, originalID, relatedAPID);
    //query[serviceIDURLParameter] = originalID;
  } else if (entityType === 'application') {
    pathname = '/application/summary';
    matrixParam['/application'] = buildMatrixParam(appIDURLParameter, originalID, null);
  }

  if (pathname !== '') {
    return createHref({
      ...location,
      pathname,
      query,
      matrix: matrixParam
    });
  }
  return undefined;
}

function buildMatrixParam(
  entityURLParameterType: string,
  originalEntityID: string,
  relatedAPID: string | null
): Parameters {
  const builtMatrixParam = { [entityURLParameterType]: originalEntityID };

  if (relatedAPID) {
    builtMatrixParam[appIDURLParameter] = relatedAPID;
  }

  return builtMatrixParam;
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
