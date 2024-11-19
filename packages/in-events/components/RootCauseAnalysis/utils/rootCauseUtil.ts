/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { List, Map } from 'immutable';

import { Application, ServiceLabel, TimeConfig } from '@instana/types';

import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { APPLICATION, ENDPOINT, SERVICE, entityTypes, operators } from 'in-analyze/applicationFilter';
import { GetLinkToAnalyzeProps, useLinkToAnalyze } from 'in-applications/navigation/paths';
import { Location, MatrixParameters, Parameters } from 'in-stores/navigation/types';
import { snapshotIdUrlParameter } from 'in-stores/snapshot/urlParameters';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getIconType } from 'in-infrastructure/infrastructureIconType';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { setTimeConfig } from 'in-stores/time/config';
import { Nullish } from 'in-types';

const endpointIDURLParameter = 'endpointId';
const serviceIDURLParameter = 'serviceId';
const appIDURLParameter = 'appId';

// ====== Relevant Types ======

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

// Typescript Probable Root Cause Reference
export type ProbableCauseSnapshotKeys = 'entityID' | 'explainability' | 'probFailure' | 'events' | 'snapshotId';

export interface ProbableCauseSnapshotValues {
  entityID: Map<string, string>;
  explainability: List<Map<ExplainabilityKeys, ExplainabilityValues[ExplainabilityKeys]>>;
  probFailure: number;
  events: List<string>;
  snapshotId?: string;
}

export type ProbableCauseType = Map<ProbableCauseSnapshotKeys, ProbableCauseSnapshotValues[ProbableCauseSnapshotKeys]>;

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

  const applicationAnalyzeOptions: Partial<GetLinkToAnalyzeProps> = {
    boundaryScope: 'ALL',
    facets: { 'call.erroneous': [true] },
    timeConfig: incidentTimeWindow
  };

  let tagFilterFormModel = undefined;

  if (relatedApplicationInformation && entityInformation) {
    tagFilterFormModel = createTagFilterExpressionForAnalysisOfApplicationSA(
      entityType,
      entityInformation,
      originalID,
      serviceLabelInformation,
      relatedApplicationInformation.label,
      entityType === 'endpoint' ? entityInformation?.label : undefined
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

function createTagFilterExpressionForAnalysisOfApplicationSA(
  entityType: string,
  entityInformation: SnapshotData,
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
  const isInfrastructureAProcess =
    entityInformation && entityInformation.plugin && entityInformation.plugin === 'process';

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

function createTagFilterExpressionForAnalysis(
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
  if (entityType === 'infrastructure') {
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
