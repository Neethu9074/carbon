import React, { useState } from 'react';
import { find, isEqual } from 'lodash';

import CustomDashboardPresenter from 'in-custom-dashboards/CustomDashboard/CustomDashboardPresenter';
import AddNewWidgetDialog from 'in-custom-dashboards/CustomDashboard/dialog/AddNewWidgetDialog';
import sampleConfiguration from 'in-custom-dashboards/CustomDashboard/sampleConfiguration';
import { onLayoutChange } from 'in-custom-dashboards/CustomDashboard/editor';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { deepCopy } from 'in-services/util/object';

export default function CustomDashboard({ config: originalConfiguration = sampleConfiguration }) {
  const [isEditing, setEditing] = useState(false);
  const [config, setConfig] = useState(originalConfiguration);

  return (
    <CustomDashboardPresenter
      config={config}
      isEditing={isEditing}
      setEditing={setEditing}
      onLayoutChange={changes => onLayoutChange(config, setConfig, changes)}
      onAddNewWidget={onAddNewWidget}
      onEditWidget={onEditWidget}
      onDeleteCustomDashboard={onDeleteCustomDashboard}
      onSaveConfiguration={onSaveConfiguration}
      onCancel={onCancel}
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

  function onDeleteCustomDashboard() {
    setActiveDialog(
      <ConfirmationDialog
        header="Confirm Dashboard Deletion"
        description={
          <span>
            Are you sure that you want to delete the dashboard <strong>{config.title}</strong>?
          </span>
        }
        bButtonLabel="Delete Dashboard"
        onB={() => alert('Not Implemented 😅!')}
      />
    );
  }

  function onSaveConfiguration() {
    setEditing(false);
  }

  function onCancel() {
    if (isEqual(originalConfiguration, config)) {
      setEditing(false);
    } else {
      setActiveDialog(
        <ConfirmationDialog
          header="Confirm cancelation"
          description={
            <span>
              You have made changes to the dashboard <strong>{config.title}</strong>. When you leave now, you will lose
              the changes you have made.
            </span>
          }
          bButtonLabel="Leave edit mode and discard changes"
          onB={() => {
            setEditing(false);
            close();
          }}
        />
      );
    }
  }
}
