import { createLogger } from 'instalog';

export default function generatePluginBasedSnapshotTransformation(label, fallback) {
  const logger = createLogger('in-sdk.' + label);

  // plugin: (snapshot) => ExtractedValue
  const mappings = {};

  return {
    addMapping(plugin, provider) {
      if (plugin in mappings) {
        logger.info('Duplicated registration of ' + label + 'Provider for ' + 'plugin' + plugin);
      }
      mappings[plugin] = provider;
    },

    get(snapshot) {
      const plugin = snapshot.get('plugin');
      const mapping = mappings[plugin] || fallback;
      if (!mapping) {
        const msg = 'No ' + label + 'Provider for plugin ' + plugin + ' found.';
        logger.error(msg);
        throw new Error(msg);
      }
      return mapping(snapshot);
    }
  };
}
