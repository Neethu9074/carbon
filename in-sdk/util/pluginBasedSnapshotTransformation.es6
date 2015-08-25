

import {createLogger} from 'instalog';

export default function generatePluginBasedSnapshotTransformation(label) {
  const logger = createLogger('in-sdk.' + label);

  // pluginId: (snapshot) => ExtractedValue
  const mappings = {};

  return {
    addMapping(pluginId, provider) {
      if (pluginId in mappings) {
        logger.info(
          'Duplicated registration of ' + label + 'Provider for ' +
          'pluginId' + pluginId
        );
      }
      mappings[pluginId] = provider;
    },

    get(snapshot, params) {
      const pluginId = snapshot.get('pluginId');
      const mapping = mappings[pluginId];
      if (!mapping) {
        const msg = 'No ' + label + 'Provider for pluginId ' + pluginId +
          ' found.';
        logger.error(msg);
        throw new Error(msg);
      }
      return mapping(snapshot, params);
    }
  };
}
