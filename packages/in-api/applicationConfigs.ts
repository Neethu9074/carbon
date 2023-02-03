/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Observable } from '@instana/observables';

import {
  AbstractApplicationConfig,
  ApplicationConfig,
  ApplicationConfigWithAlertingDetails,
  BinaryOperatorDTO,
  MatchExpressionDTOUnion,
  NewApplicationConfig,
  NewApplicationConfigWithAlertingDetails,
  Result,
  TagFilterExpressionElementUnion,
  TagMatcherDTO,
  BinaryOperatorDTOConjunction
} from 'in-types';
import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { deepFreeze, deepCopy } from 'in-services/util/object';
import { boundaryScopes } from 'in-applications/constants';
import { getKeyValuePairTag } from 'in-applications/tags';
import { emptyArray } from 'in-services/fixedObjects';
import http, { Response } from 'in-services/http';

const basePath = '/api/application-monitoring/settings/application';

type IntermediateConjunction = { conjunction: BinaryOperatorDTOConjunction };
type MappedMatchExpression = Omit<TagMatcherDTO, 'type'> & {
  conjunction?: BinaryOperatorDTOConjunction;
  left?: MappedMatchExpression[];
  right?: MappedMatchExpression[];
} & {
  type?: string;
};

export interface MappedApplicationConfig extends Omit<ApplicationConfig, 'matchSpecification' | 'tagFilterExpression'> {
  matchSpecification: MappedMatchExpression[];
  tagFilterExpression?: FormModelElement[];
}
export interface MappedNewApplicationConfig
  extends Omit<NewApplicationConfig, 'matchSpecification' | 'tagFilterExpression'> {
  matchSpecification: MappedMatchExpression[];
  tagFilterExpression?: FormModelElement[];
}
export interface MappedApplicationConfigWithAlerting
  extends Omit<ApplicationConfigWithAlertingDetails, 'matchSpecification' | 'tagFilterExpression'> {
  matchSpecification: MappedMatchExpression[];
  tagFilterExpression?: FormModelElement[];
}
export interface MappedNewApplicationConfigWithAlerting
  extends Omit<NewApplicationConfigWithAlertingDetails, 'matchSpecification' | 'tagFilterExpression'> {
  matchSpecification: MappedMatchExpression[];
  tagFilterExpression?: FormModelElement[];
}

// observables

const refreshSignalTeams = create().emit(true);
export function refresh() {
  refreshSignalTeams.emit(true);
}

export const getApplicationConfigsAsResultObservable = memoize<void, Result<ApplicationConfig[]>>(
  getApplicationConfigsAsResultObservableInternal,
  () => '',
  60000
);
function getApplicationConfigsAsResultObservableInternal(): Observable<Result<ApplicationConfig[]>> {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http<ApplicationConfig[]>({
        method: 'GET',
        maxRetries: 3,
        url: basePath
      })
    )
  );
}

// regular calls

export function getApplicationConfigs(): Observable<ApplicationConfig[]> {
  return http<ApplicationConfig[]>({
    method: 'GET',
    maxRetries: 3,
    url: `${basePath}`
  }).map(response => response.body);
}

export function getApplicationConfig(id: string): Observable<Result<MappedApplicationConfig>> {
  return http<ApplicationConfig>({
    method: 'GET',
    maxRetries: 3,
    url: `${basePath}/${encodeURIComponent(id)}`,
    mapToResultObject: true
  }).map(mapFromServerResponse);
}

export function addApplicationConfig(config: MappedNewApplicationConfig): Observable<ApplicationConfig> {
  return http<ApplicationConfig>({
    method: 'POST',
    url: `${basePath}`,
    headers: getCsrfHeader(),
    data: mapToServerResponse({ ...config, label: config.label.trim() })
  }).map(response => deepFreeze(response.body));
}

export function updateApplicationConfig(config: MappedApplicationConfig): Observable<ApplicationConfig> {
  return http<ApplicationConfig>({
    method: 'PUT',
    maxRetries: 3,
    url: `${basePath}/${config.id}`,
    headers: getCsrfHeader(),
    data: mapToServerResponse(config)
  }).map(response => deepFreeze(response.body));
}

export function deleteApplicationConfig(id: string): Observable<Response<never>> {
  return http<never>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${basePath}/${id}`
  });
}

// application config calls with additional alerting details
export function getApplicationConfigWithAlerting(id: string): Observable<Result<MappedApplicationConfigWithAlerting>> {
  return http<ApplicationConfigWithAlertingDetails>({
    method: 'GET',
    maxRetries: 3,
    url: `${basePath}/${encodeURIComponent(id)}/withAlerting`,
    mapToResultObject: true
  }).map(mapFromServerResponse) as Observable<Result<MappedApplicationConfigWithAlerting>>;
}

export function addApplicationConfigWithAlerting(
  config: MappedNewApplicationConfigWithAlerting
): Observable<ApplicationConfigWithAlertingDetails> {
  return http<ApplicationConfigWithAlertingDetails>({
    method: 'POST',
    url: `${basePath}/withAlerting`,
    headers: getCsrfHeader(),
    data: mapToServerResponse({ ...config, label: config.label.trim() })
  }).map(response => deepFreeze(response.body));
}

export function updateApplicationConfigWithAlerting(
  config: MappedApplicationConfigWithAlerting
): Observable<ApplicationConfigWithAlertingDetails> {
  return http<ApplicationConfigWithAlertingDetails>({
    method: 'PUT',
    maxRetries: 3,
    url: `${basePath}/${config.id}/withAlerting`,
    headers: getCsrfHeader(),
    data: mapToServerResponse(config)
  }).map(response => deepFreeze(response.body));
}

export function createNewApplicationConfig() {
  return {
    label: '',
    matchSpecification: [],
    scope: 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING',
    boundaryScope: boundaryScopes.inbound
  };
}

function mapToServerResponse(
  config: MappedApplicationConfigWithAlerting | MappedNewApplicationConfigWithAlerting
): ApplicationConfigWithAlertingDetails | NewApplicationConfigWithAlertingDetails;
function mapToServerResponse(config: MappedApplicationConfig | MappedNewApplicationConfig): AbstractApplicationConfig;
function mapToServerResponse(config: MappedApplicationConfig | MappedNewApplicationConfig): AbstractApplicationConfig {
  let matchSpecification: MatchExpressionDTOUnion | undefined = undefined;
  let tagFilterExpression: TagFilterExpressionElementUnion | undefined = undefined;

  if (config.matchSpecification) {
    const originalMatchSpecifications = config.matchSpecification.map(
      // @ts-expect-error TS2339: Property 'secondLevelName' does not exist on type 'MappedMatchExpression'.
      ({ secondLevelName, key, ...specification }) => {
        return {
          ...specification,
          key: secondLevelName ? `${key}.${secondLevelName}` : key
        } as MappedMatchExpression;
      }
    );
    matchSpecification = originalMatchSpecifications.length
      ? mapMatchSpecificationListToTree(originalMatchSpecifications)!
      : undefined;
  } else {
    tagFilterExpression = toBackendQueryModel(config.tagFilterExpression, false);
  }
  return { ...config, matchSpecification, tagFilterExpression };
}

function mapFromServerResponse(
  c: Result<ApplicationConfigWithAlertingDetails>
): Result<MappedApplicationConfigWithAlerting>;
function mapFromServerResponse(c: Result<ApplicationConfig>): Result<MappedApplicationConfig>;
function mapFromServerResponse(
  c: Result<ApplicationConfig | ApplicationConfigWithAlertingDetails>
): Result<MappedApplicationConfig | ApplicationConfigWithAlertingDetails> {
  if (!c.data) {
    return (c as unknown) as Result<MappedApplicationConfig | ApplicationConfigWithAlertingDetails>; // The actual data is not yet present, so the generic type can be safely ignored
  }

  const config = deepCopy(c);
  const matchSpecifications = mapMatchSpecificationTreeToList(config.data?.matchSpecification).map(
    (matchSpecification: MappedMatchExpression) => {
      const keyValueTag = getKeyValuePairTag(matchSpecification.key);
      if (keyValueTag) {
        const name = keyValueTag.fullyQualifiedName;
        const secondLevelName = matchSpecification.key.slice(name.length + 1); // remove the first.
        if (secondLevelName) {
          return { ...matchSpecification, key: name, secondLevelName };
        }
        return { ...matchSpecification, key: name };
      }
      return matchSpecification;
    }
  );

  const boundaryScope =
    (config.data?.boundaryScope != 'DEFAULT' && config.data?.boundaryScope) || boundaryScopes.inbound;

  if (config.data?.tagFilterExpression) {
    return {
      ...config,
      data: {
        ...config.data,
        tagFilterExpression: fromBackendModel(config.data.tagFilterExpression),
        matchSpecification: matchSpecifications,
        boundaryScope
      }
    };
  }
  // setting tagFilterExpression to undefined here to help ts understand the infer the types correctly
  return {
    ...config,
    data: { ...config.data!, matchSpecification: matchSpecifications, boundaryScope, tagFilterExpression: undefined }
  };
}

export function mapMatchSpecificationListToTree(
  matchSpecificationList: MappedMatchExpression[]
): MatchExpressionDTOUnion | null {
  if (!matchSpecificationList || matchSpecificationList.length === 0) {
    return null;
  }
  const tree = (matchSpecificationList.length === 1
    ? matchSpecificationList[0]
    : split(matchSpecificationList)) as MatchExpressionDTOUnion;
  annotateWithTypes(tree);
  return tree;
}

export function split(
  list?: MappedMatchExpression[]
): MatchExpressionDTOUnion[] | BinaryOperatorDTO | readonly never[] {
  if (!list || list.length === 0) {
    return emptyArray;
  }

  let splitList = splitBy(list, 'OR');
  if (Array.isArray(splitList) && splitList.length === list.length) {
    splitList = splitBy(splitList, 'AND');
  }
  if (!Array.isArray(splitList)) {
    let left: MatchExpressionDTOUnion | undefined = undefined;
    if (splitList.left) {
      left =
        splitList.left.length > 1
          ? (split(splitList.left) as MatchExpressionDTOUnion)
          : (splitList.left[0] as MatchExpressionDTOUnion);
    }

    let right: MatchExpressionDTOUnion | undefined = undefined;
    if (splitList.right) {
      if (splitList.right.length > 1) {
        right = split(splitList.right) as MatchExpressionDTOUnion;
      } else {
        const rightLeaf = splitList.right[0];
        delete rightLeaf.conjunction;
        right = rightLeaf as MatchExpressionDTOUnion;
      }
    }
    return { ...splitList, left: left!, right: right! } as BinaryOperatorDTO;
  }
  return splitList as MatchExpressionDTOUnion[];
}

type IntermediateBinaryOperatorDTO = Omit<BinaryOperatorDTO, 'left' | 'right' | 'type'> & {
  left: MappedMatchExpression[];
  right: MappedMatchExpression[];
};
export function splitBy(
  subList: MappedMatchExpression[],
  operator: BinaryOperatorDTOConjunction
): MappedMatchExpression[] | IntermediateBinaryOperatorDTO {
  if (!subList || subList.length === 0) {
    return [];
  }
  if (subList.length === 1) {
    return subList;
  }

  for (let i = 0; i < subList.length - 1; i++) {
    const item: MappedMatchExpression = subList[i];
    if (item.conjunction === operator) {
      delete item.conjunction;
      return {
        conjunction: operator,
        left: subList.splice(0, i + 1),
        right: subList
      };
    }
  }

  return subList;
}

interface MatchExpressionWithoutType {
  left?: MatchExpressionDTOUnion;
  right?: MatchExpressionDTOUnion;
  type?: string;
  conjunction?: BinaryOperatorDTOConjunction;
}
export function annotateWithTypes(node?: MatchExpressionWithoutType) {
  if (!node) {
    return;
  }

  if (node.left || node.right) {
    node.type = 'BINARY_OP';
  } else {
    delete node.conjunction;
    node.type = 'LEAF';
  }

  annotateWithTypes(node.left);
  annotateWithTypes(node.right);
}

export function mapMatchSpecificationTreeToList(tree?: MatchExpressionDTOUnion): MappedMatchExpression[] {
  if (!tree) {
    return [];
  }

  return combineNodes(resolve(tree));
}

function isLeaf(n: MatchExpressionDTOUnion): n is TagMatcherDTO {
  const node = n as BinaryOperatorDTO;
  // Left and Right are non nullable in BinaryOperatorDTO, their absence thus signifies that the node is of type TagMatcherDTO
  // The type field of MatchExpressionDTO is not used here, because it is typed as optional and string, which breaks any type safety is would bring
  return !node.left && !node.right;
}

function resolve(node: TagMatcherDTO | BinaryOperatorDTO): (TagMatcherDTO | IntermediateConjunction)[] {
  if (!node) {
    return [];
  }

  if (isLeaf(node)) {
    return [node];
  }

  const n = node as BinaryOperatorDTO;
  return resolve(n.left)
    .concat([{ conjunction: n.conjunction }])
    .concat(resolve(n.right));
}

// hardly depends on the fact that the list is created out of a binary tree
function combineNodes(list: (TagMatcherDTO | IntermediateConjunction)[]): MappedMatchExpression[] {
  if (list.length === 1) {
    return list as MappedMatchExpression[];
  }

  const result = [];
  for (let i = 0; i < list.length; i += 2) {
    const item = list[i] as MappedMatchExpression;
    if (i < list.length - 1) {
      item.conjunction = (list[i + 1] as IntermediateConjunction).conjunction; // Every second element that has a successor is a conjunction
    }
    result.push(item);
  }
  return result;
}
