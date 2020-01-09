const registry = {};

export function registerKpiDefinition(plugin, kpiDefinitions) {
  registry[plugin] = kpiDefinitions;
}

export function getKpiDefinitions(plugin) {
  const kpiDefinitions = registry[plugin];

  if (kpiDefinitions) {
    return kpiDefinitions;
  }

  return [];
}
