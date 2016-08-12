import 'in-sdk/search/defaultOperators';

export {addKeywordOperator, getKeywordOperators} from 'in-sdk/search/registry';
export {addSearchableEntityType, addSearchableTraceType} from 'in-sdk/search/defaultOperators';


export function createPluginFieldPath(shortPluginId, fieldPath) {
  const cleanedFieldPath = fieldPath.map(cleanPathElement).join('.');
  return `search.${shortPluginId}.${cleanedFieldPath}`;
}


function cleanPathElement(element) {
  return element.replace(/\./g, '__');
}
