import icons from 'in-components/SvgIcon/registry.json';

export function getIconType(snapshotOrPlugin) {
  let plugin = snapshotOrPlugin;
  if (typeof snapshotOrPlugin === 'object') {
    plugin = snapshotOrPlugin.get('plugin');
  }

  const name = `lib_infra_${plugin}`;
  return icons[name] ? name : 'lib_infra_unknownIcon';
}
