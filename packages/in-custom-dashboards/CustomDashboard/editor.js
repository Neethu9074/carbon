import React from 'react';

import AddNewWidgetDialog from 'in-custom-dashboards/CustomDashboard/dialog/AddNewWidgetDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
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

export function onAddNewWidget(config, setConfig) {
  setActiveDialog(
    <AddNewWidgetDialog
      onSave={widget => {
        const newConfig = deepCopy(config);
        newConfig.widgets.push(widget);
        setConfig(newConfig);
      }}
    />
  );
}

export function onEditWidget(config, setConfig, id) {
  const widget = find(config.widgets, eachWidget => id === eachWidget.id);
  setActiveDialog(
    <AddNewWidgetDialog
      widget={widget}
      onSave={widget => {
        const newConfig = deepCopy(config);
        newConfig.widgets = newConfig.widgets.filter(w => w.id !== id);
        newConfig.widgets.push(widget);
        setConfig(newConfig);
      }}
    />
  );
}
