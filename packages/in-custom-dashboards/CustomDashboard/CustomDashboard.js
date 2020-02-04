import React, { useState } from 'react';
import { isEqual } from 'lodash';

import CustomDashboardPresenter from 'in-custom-dashboards/CustomDashboard/CustomDashboardPresenter';
import { onLayoutChange, onRenameDashboard } from 'in-custom-dashboards/CustomDashboard/editor';
import sampleConfiguration from 'in-custom-dashboards/CustomDashboard/sampleConfiguration';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';

export default function CustomDashboard({ config: originalConfiguration = sampleConfiguration }) {
  const [isEditing, setEditing] = useState(false);
  const [config, setConfig] = useState(originalConfiguration);

  return (
    <CustomDashboardPresenter
      config={config}
      setConfig={setConfig}
      isEditing={isEditing}
      setEditing={setEditing}
      onLayoutChange={changes => onLayoutChange(config, setConfig, changes)}
      onDeleteCustomDashboard={onDeleteCustomDashboard}
      onSaveConfiguration={onSaveConfiguration}
      onCancel={onCancel}
      onRenameDashboard={() => onRenameDashboard(config, setConfig)}
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
