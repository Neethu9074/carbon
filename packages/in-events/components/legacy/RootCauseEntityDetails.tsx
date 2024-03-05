/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
import { List, Map } from 'immutable';

import { Link, LoadingSkeleton, Stack, SvgIcon, Typography } from '@instana/components';
import { Application, Endpoint, ServiceLabel, TimeConfig } from '@instana/types';
import { Observable, combineLatest } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

//@ts-expect-error
import { SnapshotData, getPhysicalHierarchy, getSnapshot, getSnapshotVersions } from 'in-stores/snapshot';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { ENDPOINT, SERVICE, entityTypes, operators } from 'in-analyze/applicationFilter';
import EventListPagination from 'in-components/EventListPagination/EventListPagination';
import AIProbabilityBadge from 'in-events/components/legacy/AIProbabilityBadge';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLinkToAnalyze } from 'in-applications/navigation/paths';
import PluginIcon from 'in-components/PluginIcon/PluginIcon';
import { setTimeConfig } from 'in-stores/time/config';

import locals from 'in-events/components/legacy/EventList.mless';

interface RootCauseEntityDetailsParams {
  selectedSnapshotMetadata: Map<string, string>;
  probabilityScore: number | null | undefined;
  relatedAPID: string | null;
  pageNum: number;
  setPageNum: React.Dispatch<React.SetStateAction<number>>;
  numOfSnapshots: number | null;
  incidentTimeWindow: TimeConfig;
}

interface EntityPathProps {
  relatedApplicationInformation: Application | null | undefined;
  entityInformation: SnapshotData;
  serviceLabelInformation: ServiceLabel | null | undefined;
  entityType: string;
}

interface NonAppDataEntityPathProps {
  relatedApplicationInformation: Application | null | undefined;
  entityInformation: SnapshotData | null;
  hierarchySnapshots: SnapshotData[] | null | undefined;
  serviceLabelInformation: ServiceLabel | null | undefined;
  entityType: string;
}

export default function RootCauseEntityDetails({
  selectedSnapshotMetadata,
  probabilityScore,
  relatedAPID,
  pageNum,
  setPageNum,
  numOfSnapshots,
  incidentTimeWindow
}: RootCauseEntityDetailsParams): JSX.Element {
  const [entityQuery, setEntityQuery] = useState<
    Observable<SnapshotData> | Observable<Endpoint | undefined> | Observable<ServiceLabel | undefined> | null | string
  >(null);
  const [hierarchyQuery, setHierarchyQuery] = useState<Observable<List<string>> | null>(null);
  const [timeWindow, setTimeWindow] = useState(incidentTimeWindow);
  const [serviceQuery, setServiceQuery] = useState<Observable<ServiceLabel | undefined> | null | string>(null);
  const { location } = useNavigation();
  const entityType = selectedSnapshotMetadata.get('EntityType');
  const originalID = selectedSnapshotMetadata.get('UntransformedEntityID');

  const relatedApplicationInformation = useObservable(
    relatedAPID
      ? getApplication({ id: relatedAPID })
          .map(data => data.data)
          .throttle(250)
      : null,
    [selectedSnapshotMetadata]
  );

  const hierarchySnapshots = useObservable(() => {
    if (hierarchyQuery) {
      return hierarchyQuery.flatMap(item =>
        combineLatest(
          item
            .toArray()
            .filter(id => id !== originalID) //filter out selected entity to avoid duplication for hosts
            .map(id => getSnapshot(id, timeWindow))
        )
      );
    } else {
      return null;
    }
  }, [timeWindow, hierarchyQuery]);
  // generates a list of event information based on Observables
  //@ts-expect-error
  const entityInformation = useObservable(entityQuery, [entityQuery], { resetStateOnObservableChange: true }) ?? null;
  //@ts-expect-error
  const serviceLabelInformation = useObservable(serviceQuery, [serviceQuery]) ?? null;

  const urlForEntity = useGenerateLinksForEntity(
    entityType,
    originalID,
    relatedApplicationInformation,
    entityInformation,
    incidentTimeWindow,
    serviceLabelInformation
  );

  useEffect(() => {
    if (entityType === 'infrastructure' || entityType === 'process') {
      // Need to get snapshot versions first and then retrieve appropriate snapshot
      setEntityQuery(
        getSnapshotVersions(originalID).map((versions: List<string>) => {
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
                getPhysicalHierarchy({ snapshotId: originalID, timeConfig: timeConfigFromSnapVersion })
              );
              setEntityQuery(getSnapshot(originalID, timeConfigFromSnapVersion));
            }
          }
        })
      );
    } else if (entityType === 'endpoint') {
      setEntityQuery(
        getEndpointInfo({ id: originalID })
          .map(data => data.data)
          .throttle(250)
      );
    } else if (entityType === 'service') {
      setEntityQuery(
        getServiceLabel({ id: originalID })
          .map(data => data.data)
          .throttle(250)
      );
    } else if (entityType === 'application') {
      setEntityQuery(
        getApplication({ id: originalID })
          .map(data => data.data)
          .throttle(250)
      );
    }
  }, [originalID, entityType, selectedSnapshotMetadata, location]);

  useEffect(() => {
    //what about when service query returns null and service id exists?
    if (
      !serviceQuery &&
      entityType !== 'infrastructure' &&
      entityType !== 'process' &&
      entityInformation &&
      entityInformation.serviceId
    ) {
      setServiceQuery(
        getServiceLabel({ id: entityInformation.serviceId })
          .map(data => data.data)
          .throttle(250)
      );
    }
  }, [entityInformation, originalID, serviceQuery, entityType]);

  useEffect(() => {
    if (serviceLabelInformation && entityInformation && entityInformation.serviceId !== serviceLabelInformation?.id)
      setServiceQuery(null);
  }, [entityInformation, serviceLabelInformation, selectedSnapshotMetadata]);

  return (
    <div className={locals.entityDescription}>
      <Stack gap="small">
        <Stack direction="horizontal" gap="small" align="center">
          <Typography variant="body-bold">{t('in-events:RCA.probableRootCauseLabel')}</Typography>
          {entityInformation !== null && entityType !== 'infrastructure' && entityType !== 'process' && (
            <Link href={urlForEntity}>
              <EntityPath
                relatedApplicationInformation={relatedApplicationInformation}
                entityInformation={entityInformation}
                serviceLabelInformation={serviceLabelInformation}
                entityType={entityType}
              />
            </Link>
          )}
          {entityInformation !== null &&
            hierarchySnapshots &&
            (entityType === 'infrastructure' || entityType === 'process') && (
              <Link href={urlForEntity}>
                <NonAppDataEntityPath
                  relatedApplicationInformation={relatedApplicationInformation}
                  hierarchySnapshots={hierarchySnapshots}
                  entityInformation={entityInformation}
                  serviceLabelInformation={serviceLabelInformation}
                  entityType={entityType}
                />
              </Link>
            )}
          {entityInformation === null && <LoadingSkeleton className={locals.loadingEntity} />}
          <AIProbabilityBadge probabilityScore={probabilityScore} loading={entityInformation === null} />
        </Stack>
        <EventListPagination pageNum={pageNum} numPages={numOfSnapshots || 1} setPageNum={setPageNum} />
      </Stack>
    </div>
  );
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
      applicationName: relatedApplicationInformation.label,
      endpointName: entityType === 'endpoint' ? entityInformation?.label : undefined,
      serviceName: entityType === 'service' ? entityInformation?.label : undefined,
      boundaryScope: 'ALL',
      formModel:
        entityType !== 'application' && entityType !== 'service'
          ? generateFormModelForLinkToEntity(entityType, entityInformation, originalID, serviceLabelInformation) ||
            undefined
          : undefined,
      timeConfig: incidentTimeWindow
    });
  } else if (entityInformation) {
    if (entityType !== 'application') {
      return getLinkToApplicationAnalyze({
        boundaryScope: 'ALL',
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
        timeConfig: incidentTimeWindow
      });
    }
  }
  return undefined;
}

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

function isServiceLabelValid(label: string) {
  return label !== 'UNKNOWN' && label !== 'Unspecified';
}
