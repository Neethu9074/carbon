/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get, isEmpty, isNull } from 'lodash';

import { Application, Endpoint, Event, ServiceLabel, Snapshot, TimeConfig } from '@instana/types';

import { QualifiedRCAEntityTypes } from 'in-events/components/RootCauseAnalysis/utils/determineEntityTypeFromEntityIDMap';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { APPLICATION, ENDPOINT, SERVICE, entityTypes, operators } from 'in-analyze/applicationFilter';
import { GetLinkToAnalyzeProps, useLinkToAnalyze } from 'in-applications/navigation/paths';
import { Location, MatrixParameters, Parameters } from 'in-stores/navigation/types';
import { Explainability } from 'in-events/components/RootCauseAnalysis/utils/types';
import { snapshotIdUrlParameter } from 'in-stores/snapshot/urlParameters';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { getIconType } from 'in-infrastructure/infrastructureIconType';
import { productAreas } from 'in-services/tracking/productAreas';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { CTA_CLICKED } from 'in-services/util/constants';
import { getEventTrackingType } from 'in-stores/events';
import { setTimeConfig } from 'in-stores/time/config';
import { Nullish } from 'in-types';

const endpointIDURLParameter = 'endpointId';
const serviceIDURLParameter = 'serviceId';
const appIDURLParameter = 'appId';

// ====== Functions for generating links to analyze page for RCA Entities ======

/**
 * Given a set of parameters this hook generates the URL to the analyze page containing appropriate tag filters for the analyze page for a given RCA entity. Can return null if no entity information is provided
 * @param entityType - String containing 'endpoint', 'infrastructure', 'service' or 'application as these are valid RCA types
 * @param originalID - String containing either snapshot ID of an infra entity or original ID of all other types
 * @param relatedApplicationInformation - Application that the root cause entity belongs to
 * @param entityInformation - SnapshotData of the identified root cause entity
 * @param incidentTimeWindow - TimeConfig of the given incident
 * @param serviceLabelInformation - ServiceLabel of the service that the root cause entitiy belongs to
 * @returns string containing the URL of the generated analysis page for the given entity OR null if one could not be generated
 * */
export function useGenerateLinkToAnalyzePage(
  entityType: QualifiedRCAEntityTypes,
  originalID: string,
  relatedApplicationInformation: Application | null | undefined,
  entityInformation: Snapshot | Endpoint | ServiceLabel | null,
  incidentTimeWindow: TimeConfig,
  serviceLabelInformation: ServiceLabel | null
): string | undefined {
  const getLinkToApplicationAnalyze = useLinkToAnalyze();

  const applicationAnalyzeOptions: Partial<GetLinkToAnalyzeProps> = {
    boundaryScope: 'ALL',
    facets: { 'call.erroneous': [true] },
    timeConfig: incidentTimeWindow
  };

  let tagFilterFormModel = undefined;

  if (relatedApplicationInformation && entityInformation) {
    tagFilterFormModel = createTagFilterExpressionForAnalysisOfApplicationSA(
      entityType,
      originalID,
      serviceLabelInformation,
      relatedApplicationInformation.label,
      entityType === 'endpoint' ? get(entityInformation, 'label', null) : null
    );
  } else if (entityInformation) {
    tagFilterFormModel = createTagFilterExpressionForAnalysis(
      entityType,
      entityInformation,
      originalID,
      serviceLabelInformation
    );
  }

  if (entityInformation) {
    return getLinkToApplicationAnalyze({
      ...applicationAnalyzeOptions,
      serviceName: entityType === 'service' ? entityInformation?.label : undefined,
      formModel: entityType !== 'application' && entityType !== 'service' ? tagFilterFormModel : undefined,
      applicationName: entityType === 'application' ? entityInformation?.label : undefined
    });
  } else {
    return undefined;
  }
}

export function createTagFilterExpressionForAnalysisOfApplicationSA(
  entityType: QualifiedRCAEntityTypes,
  definitiveEntityID: string,
  serviceLabelInformation: ServiceLabel | null,
  applicationLabel: string | null,
  endpointLabel: string | null
): FormModelElement[] | undefined {
  let tagFilter: FormModelElement[] | Nullish = undefined;

  const addValueToTagFilterExpressionIfItExists = (name: string, val: string | Nullish, conditional?: boolean) => {
    let checkToSeeIfConditionalExists = conditional === undefined || conditional === null;
    if (!checkToSeeIfConditionalExists) {
      if (val && conditional) {
        tagFilter = getTagFilterForSourceOrDestinationAndCombine(name, val, tagFilter);
      }
    } else {
      if (val) {
        tagFilter = getTagFilterForSourceOrDestinationAndCombine(name, val, tagFilter);
      }
    }
  };

  addValueToTagFilterExpressionIfItExists(APPLICATION.name, applicationLabel);
  addValueToTagFilterExpressionIfItExists(ENDPOINT.name, endpointLabel);
  addValueToTagFilterExpressionIfItExists('service.name', serviceLabelInformation?.label);

  // Todo: cleanup after rca rework in backend that differentiates between process and infra
  const isInfrastructureAProcess = entityType === 'process';

  addValueToTagFilterExpressionIfItExists(
    'host.snapshotId',
    definitiveEntityID,
    entityType === 'infrastructure' && !isInfrastructureAProcess
  );
  addValueToTagFilterExpressionIfItExists(
    'process.snapshotId',
    definitiveEntityID,
    entityType === 'infrastructure' && isInfrastructureAProcess
  );

  return tagFilter;
}

export function createTagFilterExpressionForAnalysis(
  entityType: string,
  entityInformation: SnapshotData,
  originalID: string,
  serviceLabelInformation: ServiceLabel | null
): FormModelElement[] | undefined {
  let tagFilter: FormModelElement[] | Nullish = undefined;

  const addValueToTagFilterExpressionIfItExists = (name: string, val: string | Nullish, conditional?: boolean) => {
    let checkToSeeIfConditionalExists = conditional === undefined || conditional === null;

    if (!checkToSeeIfConditionalExists) {
      if (val && conditional) {
        tagFilter = getTagFilterForSourceOrDestinationAndCombine(name, val, tagFilter);
      }
    } else {
      if (val) {
        tagFilter = getTagFilterForSourceOrDestinationAndCombine(name, val, tagFilter);
      }
    }
  };

  addValueToTagFilterExpressionIfItExists(
    'service.name',
    serviceLabelInformation?.label,
    isServiceLabelValidToDisplayInRCA(serviceLabelInformation?.label)
  );
  const isInfrastructureAProcess =
    entityInformation && entityInformation.plugin && entityInformation.plugin === 'process';

  // for endpoints with no AP context, we do not want to add the host.snapshotId or the process.snapshotId
  if (entityType === 'infrastructure' || entityType === 'process') {
    addValueToTagFilterExpressionIfItExists('host.snapshotId', originalID, !isInfrastructureAProcess);
    addValueToTagFilterExpressionIfItExists('process.snapshotId', originalID, isInfrastructureAProcess);
  }
  addValueToTagFilterExpressionIfItExists(ENDPOINT.name, entityInformation.label, entityType === 'endpoint');
  addValueToTagFilterExpressionIfItExists(SERVICE.name, entityInformation.label, entityType === 'service');

  return tagFilter;
}

function getTagFilterForSourceOrDestinationAndCombine(
  name: string,
  value: string,
  initialVal: FormModelElement[] | Nullish
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

// ==================================================

/**
 * Given a set of parameters this hook generates a url to any given entity
 * @param entityType - String containing 'endpoint', 'infrastructure', 'service' or 'application as these are valid RCA types
 * @param originalID - String containing either snapshot ID of an infra entity or original ID of all other types
 * @param location - Location variable that can be gotten via the useLocation state var
 * @param relatedAPID - String containing the relevant application ID that the entity you're generating a link for belongs to
 * @returns String containing the URL of a given dashboard
 * */
export function useGenerateLinkToDashboard(
  entityType: string,
  originalID: string | null | undefined,
  location: Location,
  relatedAPID: string | null,
  incidentTimeWindow: TimeConfig
) {
  const { createHref } = useNavigation();
  setTimeConfig(location, incidentTimeWindow);
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

/**
 * Used for extracing aggregated error rate from explainability of RCA
 * @param explainabilityMetadata - Explainability map from rootCause/currentRootCause/<snapshot_id>
 * @param error_rate_key - Key of which error rate we wish to extract (i.e. percentage through RCA entity or percentage not through RCA entity)
 * @returns number containing error percentage from explainability of given error_rate_key
 * */

export function extractAggregatedErrorRateFromExplainability(
  explainabilityMetadata: Explainability[],
  error_rate_key: keyof Explainability
) {
  if (isEmpty(explainabilityMetadata) || isNull(explainabilityMetadata)) return 0;

  const aggreagatedInfo = explainabilityMetadata.find(e => e.connectedServiceId === 'all');
  const errorPercentage = get(aggreagatedInfo, error_rate_key, -1);

  if (typeof errorPercentage === 'boolean' || typeof errorPercentage === 'string' || errorPercentage < 0) {
    return NaN;
  } else {
    return errorPercentage * 100;
  }
}

/**
 * Gets necessary icon to display beside given entity in context of the RCA
 * @param entityType - String containing 'endpoint', 'infrastructure', 'service' or 'application as these are valid RCA types
 * @returns string for appropriate icon to display
 * */
export function getIconForRCADisplay(entityType: string, plugin?: string): string {
  if (entityType === 'infrastructure' && plugin) {
    return getIconType(plugin);
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

/**
 * Tells you whether service label is UNKNOWN or Unspecified in which case we should not display service information
 * @param label - String containing service label
 * @returns boolean containing whether service label is UNKNOWN or Unspecified
 * */
export function isServiceLabelValidToDisplayInRCA(label: string | Nullish): boolean {
  return label ? label !== 'UNKNOWN' && label !== 'Unspecified' : false;
}

/**
 * Categorizes the probability level of a root cause based on the probability score.
 * @param probabilityScore - Number representing the confidence score of the RCA
 * @returns String (either N/A, HIGH, MODERATE, or LOW) which represents the probability level.
 * */
export function getProbabilityLevel(probabilityScore: number | null | undefined): string {
  if (probabilityScore === null || probabilityScore === undefined) {
    return 'N/A';
  } else if (probabilityScore >= 0.7) {
    return 'HIGH';
  } else if (probabilityScore >= 0.35) {
    return 'MODERATE';
  } else {
    return 'LOW';
  }
}
export interface TrackRcaClickProps {
  event: Event;
  location: Location;
  rootCauseTab: number;
  rcaEntityType: string | QualifiedRCAEntityTypes;
  probabilityScore: number;
  ctaEvent?: string;
  payload?: object;
  parentPageCategory?: string;
}
export function trackClick({
  event,
  location,
  rootCauseTab,
  rcaEntityType,
  probabilityScore,
  ctaEvent,
  payload,
  parentPageCategory
}: TrackRcaClickProps) {
  const data = {
    category: event.metadata?.eventConfigurationType,
    path: location.pathname,
    eventId: event.id,
    parentPageCategory: parentPageCategory ? parentPageCategory : productAreas.prc,
    parentPageName: getEventTrackingType(event),
    CTA: ctaEvent,
    data: JSON.stringify(payload),
    menuItem: rootCauseTab,
    objectType: rcaEntityType,
    label: getProbabilityLevel(probabilityScore)
  };
  eventTracker({ data, segmentEventName: CTA_CLICKED });
}
