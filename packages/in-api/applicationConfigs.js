/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { create } from '@instana/observables';

import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { boundaryScopes } from 'in-applications/constants';
import { getKeyValuePairTag } from 'in-applications/tags';
import { emptyArray } from 'in-services/fixedObjects';
import { deepFreeze } from 'in-services/util/object';
import { deepCopy } from 'in-services/util/object';
import http from 'in-services/http';

const basePath = '/api/application-monitoring/settings/application';

// observables

const refreshSignalTeams = create().emit(true);
export function refresh() {
  refreshSignalTeams.emit(true);
}

export const getApplicationConfigsAsResultObservable = memoize(
  getApplicationConfigsAsResultObservableInternal,
  () => '',
  60000
);
function getApplicationConfigsAsResultObservableInternal() {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: basePath
      })
    )
  );
}

// regular calls

export function getApplicationConfigs() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `${basePath}`
  }).map(response => response.body.map(mapFromServerResponse));
}

export function getApplicationConfig(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `${basePath}/${encodeURIComponent(id)}`,
    mapToResultObject: true
  }).map(mapFromServerResponse);
}

export function addApplicationConfig(config) {
  return http({
    method: 'POST',
    url: `${basePath}`,
    headers: getCsrfHeader(),
    data: mapToServerResponse(config)
  }).map(response => deepFreeze(response.body));
}

export function updateApplicationConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `${basePath}/${config.id}`,
    headers: getCsrfHeader(),
    data: mapToServerResponse(config)
  }).map(response => deepFreeze(response.body));
}

export function deleteApplicationConfig(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${basePath}/${id}`
  });
}

export function createNewApplicationConfig() {
  return {
    label: '',
    matchSpecification: [],
    scope: 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING',
    boundaryScope: boundaryScopes.inbound
  };
}

function mapToServerResponse(config) {
  if (config.matchSpecification) {
    for (let i = 0; i < config.matchSpecification.length; i++) {
      const matchSpecification = config.matchSpecification[i];
      if (matchSpecification.secondLevelName) {
        matchSpecification.key = `${matchSpecification.key}.${matchSpecification.secondLevelName}`;
      }
      delete matchSpecification.secondLevelName;
    }

    config.matchSpecification = mapMatchSpecificationListToTree(config.matchSpecification);
  } else {
    config.matchSpecification = null;
    config.tagFilterExpression = toBackendQueryModel(config.tagFilterExpression, false);
  }
  return config;
}

function mapFromServerResponse(config) {
  if (!config.data) {
    return config;
  }

  config = deepCopy(config);
  config.data.matchSpecification = mapMatchSpecificationTreeToList(config.data.matchSpecification);

  for (let i = 0; i < config.data.matchSpecification.length; i++) {
    const matchSpecification = config.data.matchSpecification[i];

    const keyValueTag = getKeyValuePairTag(matchSpecification.key);
    if (keyValueTag) {
      const name = keyValueTag.fullyQualifiedName;
      const secondLevelName = matchSpecification.key.slice(name.length + 1); // remove the first.
      if (secondLevelName) {
        matchSpecification.secondLevelName = secondLevelName;
      }
      matchSpecification.key = name;
    }
  }

  if (config.data.tagFilterExpression) {
    config.data.tagFilterExpression = fromBackendModel(config.data.tagFilterExpression);
  }

  config.data.boundaryScope =
    (config.data.boundaryScope != 'DEFAULT' && config.data.boundaryScope) || boundaryScopes.inbound;

  return config;
}

export function mapMatchSpecificationListToTree(matchSpecificationList) {
  if (!matchSpecificationList || matchSpecificationList.length === 0) {
    return null;
  }
  const tree = matchSpecificationList.length === 1 ? matchSpecificationList[0] : split(matchSpecificationList);
  annotateWithTypes(tree);
  return tree;
}

export function split(list) {
  if (!list || list.length === 0) {
    return emptyArray;
  }

  let splitList = splitBy(list, 'OR');
  if (splitList.length === list.length) {
    splitList = splitBy(splitList, 'AND');
  }

  if (splitList.left) {
    splitList.left = splitList.left.length > 1 ? split(splitList.left) : splitList.left[0];
  }

  if (splitList.right) {
    if (splitList.right.length > 1) {
      splitList.right = split(splitList.right);
    } else {
      splitList.right = splitList.right[0];
      delete splitList.right.conjunction;
    }
  }
  return splitList;
}

export function splitBy(subList, operator) {
  if (!subList || subList.length === 0) {
    return emptyArray;
  }
  if (subList.length === 1) {
    return subList;
  }

  for (let i = 0; i < subList.length - 1; i++) {
    const item = subList[i];
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

export function annotateWithTypes(node) {
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

export function mapMatchSpecificationTreeToList(tree) {
  if (!tree) {
    return emptyArray;
  }

  return combineNodes(resolve(tree));
}

function resolve(node) {
  if (!node) {
    return [];
  }

  if (!node.left && !node.right) {
    return [node];
  }

  return resolve(node.left)
    .concat([{ conjunction: node.conjunction }])
    .concat(resolve(node.right));
}

// hardly depends on the fact that the list is created out of a binary tree
function combineNodes(list) {
  if (list.length === 1) {
    return list;
  }

  const result = [];
  for (let i = 0; i < list.length; i += 2) {
    const item = list[i];
    if (i < list.length - 1) {
      item.conjunction = list[i + 1].conjunction;
    }
    result.push(item);
  }
  return result;
}
