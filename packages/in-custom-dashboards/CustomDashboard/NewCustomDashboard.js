import React, { useState } from 'react';
import { find } from 'lodash';

import CustomDashboardPresenter from 'in-custom-dashboards/CustomDashboard/CustomDashboardPresenter';
import AddNewWidgetDialog from 'in-custom-dashboards/CustomDashboard/dialog/AddNewWidgetDialog';
import { onLayoutChange } from 'in-custom-dashboards/CustomDashboard/editor';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { deepCopy } from 'in-services/util/object';

export default function NewCustomDashboard() {
  // TODO default value
  const [config, setConfig] = useState();

  return (
    <CustomDashboardPresenter
      config={config}
      isEditing
      onLayoutChange={changes => onLayoutChange(config, setConfig, changes)}
      onAddNewWidget={onAddNewWidget}
      onEditWidget={onEditWidget}
    />
  );

  function onAddNewWidget() {
    setActiveDialog(<AddNewWidgetDialog />);
  }

  function onEditWidget(id) {
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
}
