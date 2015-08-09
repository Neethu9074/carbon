

const translationTable = {};

export function setHumanReadablePluginName(pluginId, singular, plural) {
  translationTable[pluginId] = {
    singular,
    plural
  };
}

export function getSingular(pluginId) {
  return get(pluginId, 'singular');
}

export function getPlural(pluginId) {
  return get(pluginId, 'plural');
}

function get(pluginId, prop) {
  if (!(pluginId in translationTable)) {
    return pluginId;
  }
  return translationTable[pluginId][prop];
}
