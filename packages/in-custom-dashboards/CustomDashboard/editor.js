/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { find } from 'lodash';

import { deepCopy } from 'in-services/util/object';

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
