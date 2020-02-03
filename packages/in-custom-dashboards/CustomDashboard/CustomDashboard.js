import React, { useState } from 'react';
import { isEqual } from 'lodash';

import { onLayoutChange, onAddNewWidget, onEditWidget } from 'in-custom-dashboards/CustomDashboard/editor';
import CustomDashboardPresenter from 'in-custom-dashboards/CustomDashboard/CustomDashboardPresenter';
import sampleConfiguration from 'in-custom-dashboards/CustomDashboard/sampleConfiguration';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';

export default function CustomDashboard({ config: originalConfiguration = sampleConfiguration }) {
  const [isEditing, setEditing] = useState(false);
  const [config, setConfig] = useState(originalConfiguration);

  return (
    <CustomDashboardPresenter
      config={config}
      isEditing={isEditing}
      setEditing={setEditing}
      onLayoutChange={changes => onLayoutChange(config, setConfig, changes)}
      onAddNewWidget={() => onAddNewWidget(config, setConfig)}
      onEditWidget={widget => onEditWidget(config, setConfig, widget)}
      onDeleteCustomDashboard={onDeleteCustomDashboard}
      onSaveConfiguration={onSaveConfiguration}
      onCancel={onCancel}
    />
  );

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
