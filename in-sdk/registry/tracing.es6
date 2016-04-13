// maps type => spanDefinition
export const registry = {};


export function registerSpanDefinition(spanDefinition) {
  registry[spanDefinition.type] = spanDefinition;
}


export function getSpanDefinition(type) {
  const definiton = registry[type];
  if (definiton) {
    return definiton;
  }
  throw new Error(`No span definition found for type: ${type}`);
}
