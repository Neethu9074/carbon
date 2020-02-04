import { deepCopy } from 'in-services/util/object';
import { isNotBlank } from 'in-services/util/string';
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

export function onRenameDashboard(config, setConfig) {
  const newTitle = prompt('Please enter the new name for this dashboard', config.title);
  if (isNotBlank(newTitle)) {
    const newConfig = deepCopy(config);
    newConfig.title = newTitle;
    setConfig(newConfig);
  }
}
