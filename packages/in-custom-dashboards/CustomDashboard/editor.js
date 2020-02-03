import { deepCopy } from 'in-services/util/object';
import { find } from 'lodash';

export function onLayoutChange(config, setConfig, changes) {
  const newConfig = deepCopy(config);

  changes.forEach(change => {
    const widget = find(newConfig.widgets, ({ id }) => id === change.id);
    widget.width = change.width;
    widget.height = change.height;
    widget.x = change.x;
    widget.y = change.y;
  });

  setConfig(newConfig);
}
