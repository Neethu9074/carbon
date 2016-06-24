import invariant from 'invariant';

import {fullyQualifiedPlugins} from 'in-forge/constants';

const searchableTypes = {};

// maps from context to map of operators, e.g.
// {
//   entity: [
//     {
//       context: 'entity',
//       type: 'number',
//       keyword: 'host.cpuCount'
//     }
//   ]
// }
const contexts = {
  entity: []
};


addKeywordOperator({
  context: 'entity',
  type: 'string',
  keyword: 'tag',
  field: 'processor_tags'
});


addKeywordOperator({
  context: 'entity',
  type: 'selection',
  keyword: 'type',
  field: 'plugin_id',
  validate(selection, queryPart) {
    if (this.getSelectableItems().indexOf(selection.toLowerCase()) === -1) {
      return `Unknown entity type ${selection} for key type at row ${queryPart.row}.`;
    }
    return null;
  },
  getSelectableItems() {
    return Object.keys(searchableTypes);
  },
  toValue(selection) {
    return searchableTypes[selection.toLowerCase()];
  }
});


// Example for an operatorDefinition:
// {
//   context: 'entity',
//   type: 'number',
//   keyword: 'host.cpuCount'
// }
export function addKeywordOperator(operatorDefinition) {
  if (__DEV__) {
    invariant(
      operatorDefinition.context in contexts,
      `Context type: ${operatorDefinition.context} is unknown.`
    );

    invariant(
      ['number', 'string', 'selection'].indexOf(operatorDefinition.type) !== -1,
      `Unsupported operator type: ${operatorDefinition.type}.`
    );
  }

  const context = contexts[operatorDefinition.context];
  context.push(operatorDefinition);
}


export function getKeywordOperators(requestedContexts) {
  let result = [];

  for (let i = 0, len = requestedContexts.length; i < len; i++) {
    const requestedContext = requestedContexts[i];
    if (__DEV__) {
      invariant(requestedContext in contexts, `Context '${requestedContext}' is unknown.`);
    }
    result = result.concat(contexts[requestedContext]);
  }

  return result;
}


export function createPluginFieldPath(shortPluginId, fieldPath) {
  const longPluginId = fullyQualifiedPlugins[shortPluginId];
  if (__DEV__ && !longPluginId) {
    throw new Error(`Unable to translate short plugin ID ${shortPluginId} to long one.`);
  }

  const cleanedFieldPath = fieldPath.map(cleanPathElement).join('.');
  return `data.${cleanPathElement(longPluginId)}.${cleanedFieldPath}`;
}


function cleanPathElement(element) {
  return element.replace(/\./g, '__');
}


export function addSearchableType(label, shortPluginId) {
  searchableTypes[label.toLowerCase()] = fullyQualifiedPlugins[shortPluginId];
}
