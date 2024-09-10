/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactElement, useEffect, useState } from 'react';
import { List, Map } from 'immutable';

import {
  Button,
  Card,
  IconButton,
  Link,
  LoadingSkeleton,
  Spacer,
  Stack,
  SvgIcon,
  Typography
} from '@instana/components';
import { Observable, combineLatest } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { t, Trans } from '@instana/i18n-react';

import {
  ExplainabilityKeys,
  ExplainabilityValues,
  extractAggregatedErrorRateFromExplainability,
  getIconForRCADisplay,
  isServiceLabelValidToDisplayInRCA,
  useGenerateLinkToDashboard,
  useGenerateLinkToAnalyzePage
} from 'in-events/components/util/rootCauseUtil';
import {
  RCAClickThroughToAnalyze,
  RCAClickThroughToEntity,
  RCATraceLogsClick,
  rootCauseAnalysisSegmentTracker
} from 'in-events/tracker';
import {
  EVENT_RCA_ANALYZE_CLICK,
  EVENT_RCA_ENTITY_CLICK,
  EVENT_RCA_TRACE_AND_ERROR_LOGS_CLICK
} from 'in-services/tracking/tracking';
//@ts-expect-error
import { SnapshotData, getPhysicalHierarchy, getSnapshot, getSnapshotVersions } from 'in-stores/snapshot';
import { getStackForInfrastructure } from 'in-components/Stack/subscriptions/getStack';
import { Application, Endpoint, ServiceLabel, Snapshot, TimeConfig } from 'in-types';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import AIProbabilityBadge from 'in-events/components/legacy/AIProbabilityBadge';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import RootCauseContextDashboard from './RootCauseContextDashboard';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import MoreMenuButton from 'in-components/MoreMenu/MoreMenuButton';
import PluginIcon from 'in-components/PluginIcon/PluginIcon';
import AssociatedEvents from './RootCauseAssociatedEvents';
import { rcaLogsEnabled } from 'in-services/featureFlags';
import MoreMenu from 'in-components/MoreMenu/MoreMenu';
import { setTimeConfig } from 'in-stores/time/config';

import locals from 'in-events/components/legacy/EventList.mless';

interface RootCauseEntityDetailsParams {
  rcaSnapshotID: string;
  rcaEntityType: string;
  entityID: Map<string, string>;
  explainabilityMetadata: List<Map<ExplainabilityKeys, ExplainabilityValues[ExplainabilityKeys]>>;
  probabilityScore: number;
  relatedAPID: string | null;
  incidentTimeWindow: TimeConfig;
  associatedEvents: List<string>;
  latestSnapshot: Snapshot;
}

export default function RootCauseEntityDetails({
  rcaSnapshotID,
  rcaEntityType,
  entityID,
  explainabilityMetadata,
  probabilityScore,
  relatedAPID,
  incidentTimeWindow,
  associatedEvents,
  latestSnapshot
}: RootCauseEntityDetailsParams) {
  /*
    These query state variables hold on to the necessary observable queries that will later get used by our data state variables.
    These can be dynamic based on the given type of entity hence why they are state vars
  */

  // Generic query observable variable that gets information on a given endpoint/servce/infra/app set by the useEffect below
  const [entityQuery, setEntityQuery] = useState<
    Observable<SnapshotData> | Observable<Endpoint | undefined> | Observable<ServiceLabel | undefined> | null
  >(null);

  // Used only for infra entities to set physical hierarchy query
  const [hierarchyQuery, setHierarchyQuery] = useState<Observable<List<string>> | null>(null);

  // Time window variable used for generating links to analyze page and sending query for entity, can be re-set by our infra query
  const [timeWindow, setTimeWindow] = useState(incidentTimeWindow);

  // Service query observable variable that gets service label information that a given entity belongs to
  const [serviceQuery, setServiceQuery] = useState<Observable<ServiceLabel | undefined> | null>(null);

  // Used to make a app stack query for infrastructure entities
  const [stackQuery, setStackQuery] = useState<Observable<any> | null>(null);

  const { location } = useNavigation();

  /*
    These are data variables that maintain the result of the above query variables
  */

  // Holds the result of our entity observable
  const entityData = useObservable(entityQuery, [entityQuery]) ?? null;

  // Holds the result of our service label observable
  const nonInfraServiceLabelInformation = useObservable(serviceQuery, [serviceQuery]) ?? null;

  const [infraServiceLabelInfromation, setInfraServiceLabelInfromation] = useState<ServiceLabel[]>([]);

  // Holds the result of our related application perspective observable
  const relatedApplicationInformation = useObservable(
    relatedAPID
      ? getApplication({ id: relatedAPID })
          .map(data => data.data)
          .throttle(250)
      : null,
    [rcaSnapshotID]
  );
  // Holds the result of our physical hierarchy query
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

  // Holds the result of our infra entity stack query
  const entityStackData = useObservable(stackQuery, [stackQuery]) ?? null;

  // This useEffect sets the entity query state variables + necessary infrastructure query variables
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
              setStackQuery(getStackForInfrastructure({ id: rcaSnapshotID, timeConfig: timeConfigFromSnapVersion }));
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

  // This useEffect will set the service label query variable
  useEffect(() => {
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
    } else if (
      !serviceQuery &&
      (rcaEntityType === 'infrastructure' || rcaEntityType === 'process') &&
      entityStackData &&
      !entityStackData.progress.loading &&
      entityStackData.data
    ) {
      entityStackData.data.application.groups.map((appStackItem: any) => {
        if (appStackItem.type === 'service' && appStackItem.itemCount >= 1) {
          setInfraServiceLabelInfromation(appStackItem.items);
        }
      });
    }
  }, [entityData, rcaSnapshotID, serviceQuery, rcaEntityType, entityStackData]);

  /*
    The following hooks generate the necessary links for the analyze page and dashboard pages
  */

  // Generates link to analysis page
  const urlForAnalysisPage = useGenerateLinkToAnalyzePage(
    rcaEntityType,
    rcaSnapshotID,
    relatedApplicationInformation,
    entityData,
    incidentTimeWindow,
    nonInfraServiceLabelInformation
  );
  // Generate links to dashboard page for given entity
  const linkToEntityDashboard = useGenerateLinkToDashboard(rcaEntityType, rcaSnapshotID, location, relatedAPID);

  // If no snapshot ID just don't display RCA
  if (!rcaSnapshotID) return null;

  // If no entity data yet return loading indicator
  if (!entityData) return <LoadingIndicator />;

  /*
    The following are variables for extracing values for explainability
  */

  // Aggregated error percentage of calls going through our root cause entity
  const rcaErrorPercent = extractAggregatedErrorRateFromExplainability(
    explainabilityMetadata,
    'percentageFailedThroughRC'
  );

  // Aggregated error percentage of calls from same services above not going through root cause entity
  const notThroughRCAErrorPercent = extractAggregatedErrorRateFromExplainability(
    explainabilityMetadata,
    'percentageFailedNotThroughRC'
  );

  const entityTypeName =
    rcaEntityType === 'infrastructure' || rcaEntityType === 'process'
      ? translateFullyQualifiedPluginToShortPluginName(entityID.get('pluginId')) || ''
      : rcaEntityType;

  return (
    <div className={locals.entityDescription}>
      <Stack gap="small">
        <Stack direction="horizontal">
          <Stack gap="xxsmall">
            {entityData !== null && rcaEntityType !== 'infrastructure' && rcaEntityType !== 'process' && (
              <EntityPath
                relatedApplicationInformation={relatedApplicationInformation}
                entityInformation={entityData}
                serviceLabelInformation={nonInfraServiceLabelInformation}
                entityType={rcaEntityType}
                originalID={rcaSnapshotID}
              />
            )}
            {entityData !== null &&
              hierarchySnapshots &&
              !entityStackData?.progress.loading &&
              (rcaEntityType === 'infrastructure' || rcaEntityType === 'process') && (
                <InfrastructureVisualHierarchy
                  relatedApplicationInformation={relatedApplicationInformation}
                  hierarchySnapshots={hierarchySnapshots}
                  entityInformation={entityData}
                  serviceLabelInformation={infraServiceLabelInfromation}
                  entityId={entityID}
                  entityType={rcaEntityType}
                  originalID={rcaSnapshotID}
                />
              )}
            {(entityData === null ||
              ((rcaEntityType === 'infrastructure' || rcaEntityType === 'process') &&
                entityStackData?.progress.loading)) && <LoadingSkeleton className={locals.loadingEntity} />}
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
                linkToEntity: <Link href={linkToEntityDashboard} />,
                entityIcon: (
                  <SvgIcon
                    type={getIconForRCADisplay(rcaEntityType, entityTypeName)}
                    color={themes.default.cds.link.primary}
                    size="xs"
                  />
                )
              }}
              values={{
                root_cause_entity_type: entityTypeName,
                root_cause_entity_name: Map.isMap(entityData) ? entityData?.get('label') : entityData?.label,
                rca_error_percent: rcaErrorPercent.toFixed(2)
              }}
              parent="span"
            />
            <FailedText
              rcaErrorPercent={rcaErrorPercent}
              notThroughRCAErrorPercent={notThroughRCAErrorPercent}
              rootCauseEntityType={entityTypeName}
              rootCauseEntityName={Map.isMap(entityData) ? entityData?.get('label') : entityData?.label}
              linkToEntity={linkToEntityDashboard}
              entityIcon={
                <SvgIcon
                  type={getIconForRCADisplay(rcaEntityType, entityTypeName)}
                  color={themes.default.cds.link.primary}
                  size="xs"
                />
              }
            />
          </Stack>
        )}
        <Button
          kind="primary"
          icon="lib_application_call"
          href={urlForAnalysisPage}
          size="compact"
          onClick={() => {
            const instrumentationEventProperties = { urlForEntity: urlForAnalysisPage };
            RCAClickThroughToAnalyze(instrumentationEventProperties);
            rootCauseAnalysisSegmentTracker(
              EVENT_RCA_ANALYZE_CLICK,
              location?.pathname,
              JSON.stringify(instrumentationEventProperties)
            );
          }}
          className={locals.analyzeButton}
        >
          {t('in-applications:buttonAnalyzeCalls')}
        </Button>
      </Stack>
      {rcaLogsEnabled ? (
        <>
          <div className={locals.sectionLine} />
          <TraceLogs
            nonInfraServiceLabelInformation={nonInfraServiceLabelInformation}
            infraServiceLabelInformation={infraServiceLabelInfromation}
            relatedApplicationInformation={relatedApplicationInformation}
            rcaEntityType={rcaEntityType}
            entityData={entityData}
            incidentTimeWindow={incidentTimeWindow}
          />
        </>
      ) : undefined}
      <div className={locals.sectionLine} />
      <AssociatedEvents associatedEvents={associatedEvents} latestSnapshot={latestSnapshot} />
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
  return (
    <Stack gap="xsmall">
      <Stack gap="xsmall">
        <Typography variant="body-bold">
          {t('in-events:RCA.probableRootCauseLabel', {
            entity_type: entityType ? entityType.charAt(0).toUpperCase() + entityType.slice(1).toLowerCase() : 'Entity'
          })}
        </Typography>
        <Link
          href={linkToEntity}
          onClick={() => {
            const instrumentationEventProperties = { mainEntity: true, entityType: entityType };
            rootCauseAnalysisSegmentTracker(
              EVENT_RCA_ENTITY_CLICK,
              location?.pathname,
              JSON.stringify(instrumentationEventProperties)
            );
            RCAClickThroughToEntity(instrumentationEventProperties);
          }}
        >
          <Stack direction="horizontal" gap="xsmall" align="center">
            <SvgIcon type={getIconForRCADisplay(entityType)} color={themes.default.cds.link.primary} />
            {entityLabel}
          </Stack>
        </Link>
      </Stack>
      {relatedServiceLabel && relatedServiceID && isServiceLabelValidToDisplayInRCA(relatedServiceLabel) && (
        <EntityDisplay
          entityType="service"
          entityID={relatedServiceID}
          entityLabel={relatedServiceLabel}
          relatedAPID={relatedAPID}
          displayLabel={t('in-events:RCA.inService')}
          renderIcon={<SvgIcon type={getIconForRCADisplay('service')} color={themes.default.cds.link.primary} />}
        />
      )}
      {relatedAPlabel && relatedAPID && (
        <EntityDisplay
          entityType="application"
          entityID={relatedAPID}
          entityLabel={relatedAPlabel}
          relatedAPID={null}
          displayLabel={t('in-events:RCA.asPartOfApplicationPerspective')}
          renderIcon={
            <SvgIcon type={getIconForRCADisplay('application')} color={themes.default.cds.link.primary} size="s" />
          }
        />
      )}
    </Stack>
  );
}

interface InfrastructureVisualHierarchyProps {
  relatedApplicationInformation: Application | null | undefined;
  entityInformation: SnapshotData;
  originalID: string;
  hierarchySnapshots: SnapshotData[] | null | undefined;
  serviceLabelInformation: ServiceLabel[] | null | undefined;
  entityId: Map<string, string>;
  entityType: string;
}
interface RelevantSnapshotData {
  label: string;
  pluginType: string;
  id: string;
}

function InfrastructureVisualHierarchy({
  relatedApplicationInformation,
  hierarchySnapshots,
  entityInformation,
  originalID,
  serviceLabelInformation,
  entityId,
  entityType
}: InfrastructureVisualHierarchyProps) {
  const { location } = useNavigation();

  let hostDataFromHierarchy: RelevantSnapshotData | null = null;
  let podDataFromHierarchy: RelevantSnapshotData | null = null;
  let containerDContainerFromHierarchy: RelevantSnapshotData | null = null;

  let firstServiceLabel = '',
    firstServiceID = '';

  // Pulling out labels
  hierarchySnapshots?.forEach(snapshot => {
    const relevantSnapshotData = {
      label: snapshot.get('label'),
      pluginType: snapshot.get('plugin'),
      id: snapshot.get('id')
    };
    if (relevantSnapshotData.pluginType === 'host') {
      hostDataFromHierarchy = relevantSnapshotData;
    } else if (relevantSnapshotData.pluginType === 'kubernetesPod' && !podDataFromHierarchy) {
      podDataFromHierarchy = relevantSnapshotData;
    } else if (relevantSnapshotData.pluginType === 'containerd' && !containerDContainerFromHierarchy) {
      containerDContainerFromHierarchy = relevantSnapshotData;
    }
  });

  if (serviceLabelInformation && serviceLabelInformation.length > 0) {
    firstServiceLabel = serviceLabelInformation[0].label;
    firstServiceID = serviceLabelInformation[0].id;
  }

  const AdditionalServices = () => {
    return (
      <Stack direction="horizontal" gap="xsmall" align="center">
        <Typography variant="body-small">{`+ ${serviceLabelInformation?.length} services`}</Typography>
        <MoreMenu icon="lib_openclose_add_box" size="compact">
          {serviceLabelInformation?.map(service => (
            <ServiceLink serviceID={service.id} serviceLabel={service.label} relatedAPID={relatedAPID} />
          ))}
        </MoreMenu>
      </Stack>
    );
  };

  const relatedAPlabel = relatedApplicationInformation?.label;
  const entityLabel = Map.isMap(entityInformation) ? entityInformation?.get('label') : entityInformation?.label;

  // Pulling out IDs for service and APs
  const relatedAPID = relatedApplicationInformation ? relatedApplicationInformation.id : null;
  const relatedHostID = hostDataFromHierarchy ? (hostDataFromHierarchy as RelevantSnapshotData).id : null;
  const relatedPodID = podDataFromHierarchy ? (podDataFromHierarchy as RelevantSnapshotData).id : null;
  const relatedContainerdID = containerDContainerFromHierarchy
    ? (containerDContainerFromHierarchy as RelevantSnapshotData).id
    : null;

  // Generate links to dashboards
  const linkToEntity = useGenerateLinkToDashboard(entityType, originalID, location, relatedAPID);

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
        <Link
          href={linkToEntity}
          onClick={() => {
            const instrumentationEventProperties = { mainEntity: true, entityType: entityType };
            rootCauseAnalysisSegmentTracker(
              EVENT_RCA_ENTITY_CLICK,
              location?.pathname,
              JSON.stringify(instrumentationEventProperties)
            );

            RCAClickThroughToEntity(instrumentationEventProperties);
          }}
        >
          <Stack direction="horizontal" gap="xsmall" align="center">
            <PluginIcon
              plugin={pluginToShortPluginName !== 'entity' ? pluginToShortPluginName : ''}
              color={themes.default.cds.link.primary}
            />
            {entityLabel}
          </Stack>
        </Link>
      </Stack>
      {hostDataFromHierarchy && relatedHostID && (
        <EntityDisplay
          entityType="infrastructure"
          entityID={relatedHostID}
          entityLabel={(hostDataFromHierarchy as RelevantSnapshotData).label}
          relatedAPID={relatedAPID}
          displayLabel={t('in-events:RCA.runsOn')}
          renderIcon={
            <PluginIcon
              plugin={(hostDataFromHierarchy as RelevantSnapshotData).pluginType}
              color={themes.default.cds.link.primary}
            />
          }
        />
      )}
      {podDataFromHierarchy && relatedPodID && (
        <EntityDisplay
          entityType="infrastructure"
          entityID={relatedPodID}
          entityLabel={(podDataFromHierarchy as RelevantSnapshotData).label}
          relatedAPID={relatedAPID}
          displayLabel={t('in-events:RCA.runningIn')}
          renderIcon={
            <PluginIcon
              plugin={(podDataFromHierarchy as RelevantSnapshotData).pluginType}
              color={themes.default.cds.link.primary}
            />
          }
        />
      )}
      {containerDContainerFromHierarchy && relatedContainerdID && (
        <EntityDisplay
          entityType="infrastructure"
          entityID={relatedContainerdID}
          entityLabel={(containerDContainerFromHierarchy as RelevantSnapshotData).label}
          relatedAPID={relatedAPID}
          displayLabel={t('in-events:RCA.runningIn')}
          renderIcon={
            <PluginIcon
              plugin={(containerDContainerFromHierarchy as RelevantSnapshotData).pluginType}
              color={themes.default.cds.link.primary}
            />
          }
        />
      )}
      {firstServiceLabel && firstServiceID && isServiceLabelValidToDisplayInRCA(firstServiceLabel) && (
        <EntityDisplay
          entityType="service"
          entityID={firstServiceID}
          entityLabel={firstServiceLabel}
          relatedAPID={relatedAPID}
          displayLabel={t('in-events:RCA.inService')}
          renderIcon={<SvgIcon type={getIconForRCADisplay('service')} color={themes.default.cds.link.primary} />}
          testing={serviceLabelInformation && serviceLabelInformation?.length > 1 ? AdditionalServices() : undefined}
        />
      )}
      {relatedAPlabel && relatedAPID && (
        <EntityDisplay
          entityType="application"
          entityID={relatedAPID}
          entityLabel={relatedAPlabel}
          relatedAPID={null}
          displayLabel={t('in-events:RCA.asPartOfApplicationPerspective')}
          renderIcon={
            <SvgIcon type={getIconForRCADisplay('application')} color={themes.default.cds.link.primary} size="s" />
          }
        />
      )}
    </Stack>
  );
}

interface InfraEntityDisplayProps {
  entityType: string;
  entityID: string;
  entityLabel: string;
  relatedAPID: string | null;
  displayLabel: string;
  renderIcon: ReactElement;
  testing?: ReactElement;
}

function EntityDisplay({
  entityType,
  entityID,
  entityLabel,
  relatedAPID,
  displayLabel,
  renderIcon,
  testing
}: InfraEntityDisplayProps) {
  const { location } = useNavigation();

  const linkToEntity = useGenerateLinkToDashboard(entityType, entityID, location, relatedAPID);

  return (
    <Stack direction="horizontal" gap="xsmall" align="center">
      <Spacer horizontal="small" />
      <div>
        <div className={locals.infraLineDown} />
        <div className={locals.infraLineRight} />
      </div>
      <Typography variant="body-small">{displayLabel}</Typography>
      <Link
        href={linkToEntity}
        onClick={() => {
          const instrumentationEventProperties = { mainEntity: false, entityType: entityType };
          rootCauseAnalysisSegmentTracker(
            EVENT_RCA_ENTITY_CLICK,
            location?.pathname,
            JSON.stringify(instrumentationEventProperties)
          );

          RCAClickThroughToEntity(instrumentationEventProperties);
        }}
      >
        <Stack direction="horizontal" gap="xsmall" align="center">
          {renderIcon}
          <Typography variant="body-small" component="a">
            {entityLabel}
          </Typography>
        </Stack>
      </Link>
      {testing}
    </Stack>
  );
}

function ServiceLink({ serviceID, serviceLabel, relatedAPID }: any) {
  const { location } = useNavigation();

  const linkToService = useGenerateLinkToDashboard('service', serviceID, location, relatedAPID);
  return <MoreMenuButton href={linkToService}>{serviceLabel}</MoreMenuButton>;
}

interface RootCauseTraceLogsProps {
  nonInfraServiceLabelInformation: ServiceLabel | null;
  infraServiceLabelInformation: ServiceLabel[];
  relatedApplicationInformation: Application | null | undefined;
  rcaEntityType: string;
  entityData: SnapshotData;
  incidentTimeWindow: TimeConfig;
}

function TraceLogs({
  nonInfraServiceLabelInformation,
  infraServiceLabelInformation,
  relatedApplicationInformation,
  rcaEntityType,
  entityData,
  incidentTimeWindow
}: RootCauseTraceLogsProps) {
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <Card
      leftHeaderContent={<Typography variant="body-bold">{t('in-events:RCA.relatedMessagesAndLogsLabel')}</Typography>}
      onHeaderBackgroundClicked={() => {
        const instrumentationEventProperties = { expanded: !expanded };
        rootCauseAnalysisSegmentTracker(
          EVENT_RCA_TRACE_AND_ERROR_LOGS_CLICK,
          location?.pathname,
          JSON.stringify(instrumentationEventProperties)
        );
        RCATraceLogsClick(instrumentationEventProperties);
        setExpanded(!expanded);
      }}
      headerClassName={locals.associatedEventsCardHeader}
      rightHeaderContent={
        <IconButton color="black" type={expanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} size="compact" />
      }
      className={locals.associatedEventsCard}
      hasMarginBottom={expanded}
      useMaxAvailableHeight={false}
    >
      {expanded && entityData !== null && (
        <RootCauseContextDashboard
          applicationBoundaryScope="ALL"
          serviceId={nonInfraServiceLabelInformation?.id || infraServiceLabelInformation[0]?.id}
          serviceName={nonInfraServiceLabelInformation?.label || infraServiceLabelInformation[0]?.label}
          applicationId={relatedApplicationInformation?.id}
          applicationName={relatedApplicationInformation?.label}
          endpointId={rcaEntityType === 'endpoint' ? entityData.steadyId : undefined}
          endpointName={rcaEntityType === 'endpoint' ? entityData.label : undefined}
          timeConfig={incidentTimeWindow}
        />
      )}
    </Card>
  );
}
