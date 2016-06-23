import invariant from 'invariant';

import {fullyQualifiedPlugins} from 'in-forge/constants';

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
      ['number'].indexOf(operatorDefinition.type) !== -1,
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
