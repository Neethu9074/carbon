/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactElement, useContext, useMemo, useState } from 'react';
import { get, isNull } from 'lodash';

import { Button, CarbonTabPanel, Link, LoadingSkeleton, Spacer, Stack, SvgIcon, Typography } from '@instana/components';
import { Tearsheet } from '@instana/ibm-products';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { t, Trans } from '@instana/i18n-react';

import {
  extractAggregatedErrorRateFromExplainability,
  getIconForRCADisplay,
  isServiceLabelValidToDisplayInRCA,
  trackClick,
  TrackRcaClickProps,
  useGenerateLinkToAnalyzePage,
  useGenerateLinkToDashboard
} from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
import {
  EVENT_RCA_ANALYZE_CLICK,
  EVENT_RCA_ENTITY_CLICK,
  EVENT_RCA_LLM_INVESTIGATION_START_CLICK,
  EVENT_RCA_TOPOLOGY_VIEW_CLICK
} from 'in-services/tracking/tracking';
import {
  rcaTopologyEnabled,
  rcaAiAutomatedInvestigationEnabled,
  automationActionAiGenerationUnitEnabled
} from 'in-services/featureFlags';
import determineEntityTypeFromEntityIDMap from 'in-events/components/RootCauseAnalysis/utils/determineEntityTypeFromEntityIDMap';
import { RCAEntityDataType } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAppropriateRCAEntityData';
import RootCauseTopologyDialog from 'in-events/components/RootCauseAnalysis/Topology/RootCauseTopologyDialog';
import SelectedRootCauseContext from 'in-events/components/RootCauseAnalysis/hooks/SelectedRootCauseContext';
import getIncidentTimeConfig from 'in-events/components/RootCauseAnalysis/utils/getIncidentTimeConfig';
import { RootCauseDataContext } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import { Application, EntityId, Event, Nullish, ServiceLabel, Snapshot, TimeConfig } from 'in-types';
import AIProbabilityBadge from 'in-events/components/RootCauseAnalysis/AIProbabilityBadge';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import { RootCause } from 'in-events/components/RootCauseAnalysis/utils/types';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import getApplication from 'in-applications/subscriptions/getApplication';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import MoreMenuButton from 'in-components/MoreMenu/MoreMenuButton';
import PluginIcon from 'in-components/PluginIcon/PluginIcon';
import MoreMenu from 'in-components/MoreMenu/MoreMenu';
import { setTimeConfig } from 'in-stores/time/config';

import locals from 'in-events/components/legacy/EventList.mless';

interface RootCauseEntityDetailsParams {
  incident: Event;
  rootCauses: RootCause[];
  setOpenInvestigation: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RootCauseEntityDetails({
  incident,
  rootCauses,
  setOpenInvestigation
}: RootCauseEntityDetailsParams) {
  const { selectedRootCause: rootCauseTab } = useContext(SelectedRootCauseContext);
  const selectedRootCause = rootCauses[rootCauseTab];
  const { location } = useNavigation();

  const [isTopologyOpen, setIsTopologyOpen] = useState(false);

  const rcaEntityType = determineEntityTypeFromEntityIDMap(selectedRootCause.entityID);
  const rcaSnapshotID =
    rcaEntityType === 'infrastructure' || rcaEntityType === 'process'
      ? selectedRootCause.snapshotId
      : selectedRootCause.entityID.steadyId;

  const incidentTimeWindow = useMemo(() => getIncidentTimeConfig(incident), [incident]);

  const probabilityScore = selectedRootCause.probFailure;
  const rcaTrackingData = {
    event: incident,
    location,
    rootCauseTab,
    rcaEntityType,
    probabilityScore
  };

  /*
    These query state variables hold on to the necessary observable queries that will later get used by our data state variables.
    These can be dynamic based on the given type of entity hence why they are state vars
  */

  const { rootCauses: rootcausesdata } = useContext(RootCauseDataContext);

  const {
    entityData,
    hierarchySnapshots,
    infraServiceLabelInformation,
    nonInfraServiceLabelInformation,
    loadingSnapshotData,
    loadingStackData
  } = rootcausesdata[rootCauseTab];
  /*
    These are data variables that maintain the result of the above query variables
  */

  const relatedAPID = get(incident, 'metadata.app20ApplicationId', null);
  // Holds the result of our related application perspective observable
  const relatedApplicationInformation = useObservable(
    relatedAPID
      ? getApplication({ id: relatedAPID })
          .map(data => data.data)
          .throttle(250)
      : null,
    [relatedAPID || '']
  );

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
  const linkToEntityDashboard = useGenerateLinkToDashboard(
    rcaEntityType,
    rcaSnapshotID,
    location,
    relatedAPID,
    incidentTimeWindow
  );

  // If no snapshot ID just don't display RCA
  if (!rcaSnapshotID) return null;

  if (!loadingSnapshotData && !entityData) {
    return (
      <>
        <CarbonTabPanel key={rcaSnapshotID}>
          <div className={locals.entityDescription}>
            <UnknownEntityPath
              rcaTrackingData={rcaTrackingData}
              entityID={rcaSnapshotID}
              entityType={rcaEntityType}
              relatedApplicationInformation={relatedApplicationInformation}
              timeWindow={incidentTimeWindow}
            />
          </div>
        </CarbonTabPanel>
      </>
    );
  }

  // If no entity data yet return loading indicator
  if (!entityData) return <LoadingIndicator />;

  /*
    The following are variables for extracing values for explainability
  */

  // Aggregated error percentage of calls going through our root cause entity
  const rcaErrorPercent = extractAggregatedErrorRateFromExplainability(
    selectedRootCause.explainability,
    'percentageFailedThroughRC'
  );

  // Aggregated error percentage of calls from same services above not going through root cause entity
  const notThroughRCAErrorPercent = extractAggregatedErrorRateFromExplainability(
    selectedRootCause.explainability,
    'percentageFailedNotThroughRC'
  );

  return (
    <>
      <CarbonTabPanel key={rcaSnapshotID} style={{ background: 'none' }}>
        <div className={locals.entityDescription}>
          <Stack gap="small">
            <Stack direction="horizontal">
              <Stack gap="xxsmall">
                {entityData !== null && rcaEntityType !== 'infrastructure' && rcaEntityType !== 'process' && (
                  <EntityPath
                    rcaTrackingData={rcaTrackingData}
                    relatedApplicationInformation={relatedApplicationInformation}
                    entityInformation={entityData as Snapshot}
                    serviceLabelInformation={nonInfraServiceLabelInformation}
                    entityType={rcaEntityType}
                    originalID={rcaSnapshotID}
                    timeWindow={incidentTimeWindow}
                  />
                )}
                {entityData !== null &&
                  hierarchySnapshots &&
                  !loadingStackData &&
                  (rcaEntityType === 'infrastructure' || rcaEntityType === 'process') && (
                    <InfrastructureVisualHierarchy
                      rcaTrackingData={rcaTrackingData}
                      relatedApplicationInformation={relatedApplicationInformation}
                      hierarchySnapshots={hierarchySnapshots}
                      entityInformation={entityData as Snapshot}
                      serviceLabelInformation={infraServiceLabelInformation}
                      entityId={selectedRootCause.entityID}
                      entityType={rcaEntityType}
                      originalID={rcaSnapshotID}
                      timeWindow={incidentTimeWindow}
                    />
                  )}
                {(loadingSnapshotData ||
                  ((rcaEntityType === 'infrastructure' || rcaEntityType === 'process') && loadingStackData)) && (
                  <LoadingSkeleton className={locals.loadingEntity} />
                )}

                {!loadingSnapshotData && !entityData && (
                  <>
                    <CarbonTabPanel key={rcaSnapshotID}>
                      <div className={locals.entityDescription}>
                        <UnknownEntityPath
                          rcaTrackingData={rcaTrackingData}
                          entityID={rcaSnapshotID}
                          entityType={rcaEntityType}
                          relatedApplicationInformation={relatedApplicationInformation}
                          timeWindow={incidentTimeWindow}
                        />
                      </div>
                    </CarbonTabPanel>
                  </>
                )}
              </Stack>
              <AIProbabilityBadge probabilityScore={selectedRootCause.probFailure} loading={entityData === null} />
            </Stack>
            {!isNull(selectedRootCause.explainability) && (
              <Stack gap="xsmall">
                <Typography variant="body-bold">{t('in-events:RCA.evidence')}</Typography>
                <Stack direction="horizontal" distribution="spaceBetween">
                  <div className={locals.evidenceContainer}>
                    <Stack gap="disabled">
                      <Typography variant="heading-04">{rcaErrorPercent.toFixed(2)}%</Typography>
                      <Trans
                        i18nKey="in-events:RCA.evidenceTextFailed"
                        components={{
                          //@ts-expect-error
                          linkToEntity: <Link href={linkToEntityDashboard} />,
                          entityIcon: (
                            <SvgIcon
                              type={getIconForRCADisplay(rcaEntityType, rcaEntityType)}
                              color={themes.default.cds.link.primary}
                              size="xs"
                            />
                          )
                        }}
                        values={{
                          root_cause_entity_type: rcaEntityType,
                          root_cause_entity_name: entityData?.label,
                          rca_error_percent: rcaErrorPercent.toFixed(2)
                        }}
                        parent="span"
                      />
                    </Stack>
                  </div>
                  <div className={locals.evidenceContainer}>
                    <FailedText
                      notThroughRCAErrorPercent={notThroughRCAErrorPercent}
                      rootCauseEntityType={rcaEntityType}
                      rootCauseEntityName={entityData.label || ''}
                      linkToEntity={linkToEntityDashboard}
                      entityIcon={
                        <SvgIcon
                          type={getIconForRCADisplay(rcaEntityType, rcaEntityType)}
                          color={themes.default.cds.link.primary}
                          size="xs"
                        />
                      }
                    />
                  </div>
                </Stack>
              </Stack>
            )}
            <Stack direction="horizontal" align="center">
              <Button
                kind="tertiary"
                icon="lib_application_call"
                href={urlForAnalysisPage}
                size="compact"
                onClick={() => {
                  const payload = { urlForEntity: urlForAnalysisPage };
                  trackClick({ ...rcaTrackingData, ctaEvent: EVENT_RCA_ANALYZE_CLICK, payload });
                }}
                className={locals.analyzeButton}
              >
                {t('in-applications:buttonAnalyzeCalls')}
              </Button>
              {rcaTopologyEnabled && (
                <>
                  <Button
                    kind="tertiary"
                    icon="lib_actions_force_layout"
                    size="compact"
                    onClick={() => {
                      trackClick({ ...rcaTrackingData, ctaEvent: EVENT_RCA_TOPOLOGY_VIEW_CLICK });
                      setIsTopologyOpen(true);
                    }}
                  >
                    {t('in-events:RCA.topology.viewTopology')}
                  </Button>
                  {/* @ts-expect-error */}
                  <Tearsheet
                    closeIconDescription="Close"
                    title={
                      !isNull(entityData) ? (
                        <Stack direction="horizontal" gap="xsmall" align="center" distribution="start">
                          <SvgIcon type={getIconForRCADisplay(rcaEntityType)} />
                          {entityData.label}
                        </Stack>
                      ) : (
                        <LoadingSkeleton />
                      )
                    }
                    label={t('in-events:RCA.topology.dialogTitle')}
                    open={isTopologyOpen}
                    onClose={() => setIsTopologyOpen(false)}
                  >
                    <RootCauseTopologyDialog
                      relatedApplicationInformation={relatedApplicationInformation}
                      incident={incident}
                      timeConfig={incidentTimeWindow}
                      rootCauses={rootCauses}
                    />
                  </Tearsheet>
                </>
              )}
              {rcaAiAutomatedInvestigationEnabled && automationActionAiGenerationUnitEnabled && (
                <Button
                  kind="tertiary"
                  icon="lib_launch_ai"
                  size="compact"
                  onClick={() => {
                    setOpenInvestigation(true);
                    trackClick({ ...rcaTrackingData, ctaEvent: EVENT_RCA_LLM_INVESTIGATION_START_CLICK });
                  }}
                  className={locals.analyzeButton}
                >
                  {t('in-events:RCA.singleEntityLLM.investigateButtonLabel')}
                </Button>
              )}
            </Stack>
          </Stack>
        </div>
      </CarbonTabPanel>
    </>
  );
}

function FailedText({
  notThroughRCAErrorPercent,
  rootCauseEntityType,
  rootCauseEntityName,
  linkToEntity,
  entityIcon
}: {
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

  return (
    <Stack gap="disabled">
      <Typography variant="heading-04">{translationDataObject.non_rca_error_rate}%</Typography>
      <Trans
        i18nKey="in-events:RCA.evidenceTextNotFailed"
        //@ts-expect-error
        components={{ linkToEntity: <Link href={linkToEntity} />, entityIcon: entityIcon }}
        values={translationDataObject}
        parent="span"
      />
    </Stack>
  );
}

interface EntityPathProps {
  rcaTrackingData: TrackRcaClickProps;
  relatedApplicationInformation: Application | null | undefined;
  entityInformation: RCAEntityDataType['entityData'];
  originalID: string;
  serviceLabelInformation: ServiceLabel | null | undefined;
  entityType: string;
  timeWindow: TimeConfig;
}

function EntityPath({
  rcaTrackingData,
  relatedApplicationInformation,
  entityInformation,
  originalID,
  serviceLabelInformation,
  entityType,
  timeWindow
}: EntityPathProps) {
  const { location } = useNavigation();

  // Pulling out labels
  const relatedAPlabel = relatedApplicationInformation?.label;
  const relatedServiceLabel = serviceLabelInformation?.label;
  const entityLabel = entityInformation?.label;

  // Pulling out IDs for service and APs
  const relatedAPID = relatedApplicationInformation ? relatedApplicationInformation.id : null;
  const relatedServiceID = serviceLabelInformation ? serviceLabelInformation.id : null;

  // Generate links to dashboards
  const linkToEntity = useGenerateLinkToDashboard(entityType, originalID, location, relatedAPID, timeWindow);
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
            const payload = { mainEntity: true, entityType: entityType };
            trackClick({ ...rcaTrackingData, ctaEvent: EVENT_RCA_ENTITY_CLICK, payload });
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
          timeWindow={timeWindow}
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
          timeWindow={timeWindow}
        />
      )}
    </Stack>
  );
}

interface UnknownEntityPathProps {
  rcaTrackingData: TrackRcaClickProps;
  relatedApplicationInformation: Application | Nullish;
  entityType: string;
  entityID: string;
  timeWindow: TimeConfig;
}

function UnknownEntityPath({
  rcaTrackingData,
  relatedApplicationInformation,
  entityType,
  entityID,
  timeWindow
}: UnknownEntityPathProps) {
  const { location } = useNavigation();

  const relatedAPID = relatedApplicationInformation ? relatedApplicationInformation.id : null;

  // Generate links to dashboards
  const linkToEntity = useGenerateLinkToDashboard(entityType, entityID, location, relatedAPID, timeWindow);
  return (
    <Stack gap="xsmall">
      <Typography variant="body-bold">
        {t('in-events:RCA.probableRootCauseLabel', {
          entity_type: entityType ? entityType.charAt(0).toUpperCase() + entityType.slice(1).toLowerCase() : 'Entity'
        })}
      </Typography>
      <Link
        href={linkToEntity}
        onClick={() => {
          const payload = { mainEntity: true, entityType: entityType };
          trackClick({ ...rcaTrackingData, ctaEvent: EVENT_RCA_ENTITY_CLICK, payload });
        }}
      >
        <Stack direction="horizontal" gap="xsmall" align="center">
          <SvgIcon type={getIconForRCADisplay(entityType)} color={themes.default.cds.link.primary} />
          {t('in-custom-dashboards:widgets.unknownEntityLabel')}
        </Stack>
      </Link>
    </Stack>
  );
}

interface InfrastructureVisualHierarchyProps {
  rcaTrackingData: TrackRcaClickProps;
  relatedApplicationInformation: Application | null | undefined;
  entityInformation: Snapshot;
  originalID: string;
  hierarchySnapshots: Snapshot[] | null | undefined;
  serviceLabelInformation: ServiceLabel[] | null | undefined;
  entityId: EntityId;
  entityType: string;
  timeWindow: TimeConfig;
}
interface RelevantSnapshotData {
  label: string;
  pluginType: string;
  id: string;
}

const InfrastructureVisualHierarchy = ({
  rcaTrackingData,
  relatedApplicationInformation,
  hierarchySnapshots,
  entityInformation,
  originalID,
  serviceLabelInformation,
  entityId,
  entityType,
  timeWindow
}: InfrastructureVisualHierarchyProps) => {
  const { location } = useNavigation();

  let hostDataFromHierarchy: RelevantSnapshotData | null = null;
  let podDataFromHierarchy: RelevantSnapshotData | null = null;
  let containerDContainerFromHierarchy: RelevantSnapshotData | null = null;

  let firstServiceLabel = '',
    firstServiceID = '';

  // Pulling out labels
  hierarchySnapshots?.forEach(snapshot => {
    const relevantSnapshotData = {
      label: snapshot.label as string,
      pluginType: snapshot.plugin as string,
      id: snapshot.id as string
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

  setTimeConfig(location, timeWindow);

  const AdditionalServices = () => {
    return (
      <Stack direction="horizontal" gap="xsmall" align="center">
        <Typography variant="body-small">{`+ ${serviceLabelInformation?.length} services`}</Typography>
        <MoreMenu icon="lib_openclose_add_box" size="compact">
          {serviceLabelInformation?.map(service => (
            <ServiceLink
              serviceID={service.id}
              serviceLabel={service.label}
              relatedAPID={relatedAPID}
              timeWindow={timeWindow}
            />
          ))}
        </MoreMenu>
      </Stack>
    );
  };

  const relatedAPlabel = relatedApplicationInformation?.label;
  const entityLabel = entityInformation?.label;

  // Pulling out IDs for service and APs
  const relatedAPID = relatedApplicationInformation ? relatedApplicationInformation.id : null;
  const relatedHostID = hostDataFromHierarchy ? (hostDataFromHierarchy as RelevantSnapshotData).id : null;
  const relatedPodID = podDataFromHierarchy ? (podDataFromHierarchy as RelevantSnapshotData).id : null;
  const relatedContainerdID = containerDContainerFromHierarchy
    ? (containerDContainerFromHierarchy as RelevantSnapshotData).id
    : null;

  // Generate links to dashboards
  const linkToEntity = useGenerateLinkToDashboard(entityType, originalID, location, relatedAPID, timeWindow);

  const pluginToShortPluginName = translateFullyQualifiedPluginToShortPluginName(entityId.pluginId) || 'entity';
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
            const payload = { mainEntity: true, entityType: entityType };
            trackClick({ ...rcaTrackingData, ctaEvent: EVENT_RCA_ENTITY_CLICK, payload });
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
          timeWindow={timeWindow}
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
          timeWindow={timeWindow}
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
          timeWindow={timeWindow}
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
          AdditionalServices={
            serviceLabelInformation && serviceLabelInformation?.length > 1 ? AdditionalServices() : undefined
          }
          timeWindow={timeWindow}
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
          timeWindow={timeWindow}
        />
      )}
    </Stack>
  );
};

interface InfraEntityDisplayProps {
  entityType: string;
  entityID: string;
  entityLabel: string;
  relatedAPID: string | null;
  displayLabel: string;
  renderIcon: ReactElement;
  timeWindow: TimeConfig;
  AdditionalServices?: ReactElement;
}

function EntityDisplay({
  entityType,
  entityID,
  entityLabel,
  relatedAPID,
  displayLabel,
  renderIcon,
  AdditionalServices,
  timeWindow
}: InfraEntityDisplayProps) {
  const SEGMENT_EVENT_PROPERTY_CHANNEL = 'root cause analysis';
  const { trackCta } = useSegmentTracking();

  const { location } = useNavigation();

  const linkToEntity = useGenerateLinkToDashboard(entityType, entityID, location, relatedAPID, timeWindow);

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
          trackCta(EVENT_RCA_ENTITY_CLICK, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
        }}
      >
        <Stack direction="horizontal" gap="xsmall" align="center">
          {renderIcon}
          <Typography variant="body-small" component="a">
            {entityLabel}
          </Typography>
        </Stack>
      </Link>
      {AdditionalServices}
    </Stack>
  );
}

interface ServiceLinkProps {
  serviceID: string;
  serviceLabel: string;
  relatedAPID: string | null;
  timeWindow: TimeConfig;
}

function ServiceLink({ serviceID, serviceLabel, relatedAPID, timeWindow }: ServiceLinkProps) {
  const { location } = useNavigation();

  const linkToService = useGenerateLinkToDashboard('service', serviceID, location, relatedAPID, timeWindow);
  return <MoreMenuButton href={linkToService}>{serviceLabel}</MoreMenuButton>;
}
