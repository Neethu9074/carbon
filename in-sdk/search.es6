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
  const context = contexts[operatorDefinition.context];
  context.push(operatorDefinition);
}

export function getKeywordOperators(context) {
  return contexts[context];
}
