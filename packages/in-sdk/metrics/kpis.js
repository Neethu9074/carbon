const registry = {};

export function registerKpiDefinition(plugin, kpiDefinitions) {
  registry[plugin] = kpiDefinitions;
}

export function getKpiDefinitions(snapshot) {
  const kpiDefinitions = registry[snapshot.get('plugin')];

  if (kpiDefinitions) {
    return kpiDefinitions;
  }

  return [];
}
