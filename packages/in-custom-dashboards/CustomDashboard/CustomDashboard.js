import React, { useState } from 'react';
import { compose } from 'recompose';
import { isEqual } from 'lodash';

import { getCustomDashboard, updateCustomDashboard, removeCustomDashboard } from 'in-custom-dashboards/api';
import { dashboardIdUrlParameter, goToCustomDashboardList } from 'in-custom-dashboards/navigation/url';
import CustomDashboardPresenter from 'in-custom-dashboards/CustomDashboard/CustomDashboardPresenter';
import { onLayoutChange, onRenameDashboard } from 'in-custom-dashboards/CustomDashboard/editor';
import sampleConfiguration from 'in-custom-dashboards/CustomDashboard/sampleConfiguration';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import withUrlState from 'in-hoc/withUrlState';
import connectTo from 'in-hoc/connectTo';

export default compose(
  withUrlState({
    bind: [dashboardIdUrlParameter]
  }),
  connectTo(({ dashboardId }) => ({
    config: getCustomDashboard(dashboardId)
  }))
)(CustomDashboardLoader);

function CustomDashboardLoader({ dashboardId, config }) {
  if (!dashboardId || !config || !config.data || config.data.id !== dashboardId) {
    return null;
  }
  return (
    <CustomDashboard
      // Reset state when the config changes
      key={config.data.id}
      config={config.data}
    />
  );
}

function CustomDashboard({ config: originalConfiguration = sampleConfiguration }) {
  const [isEditing, setEditing] = useState(false);
  const [config, setConfig] = useState(originalConfiguration);

  return (
    <CustomDashboardPresenter
      config={config}
      setConfig={setConfig}
      isEditing={isEditing}
      setEditing={setEditing}
      editable={config.writable}
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
        header="Confirm deletion"
        description={
          <span>
            Are you sure you want to delete the dashboard <strong>{config.title}</strong>?
          </span>
        }
        bButtonLabel="Delete Dashboard"
        onB={() => {
          close();
          removeCustomDashboard(config.id).subscribe(result => {
            if (result.progress.loading) {
              return;
            }

            if (result.errors.length > 0) {
              // TODO improve error case
              alert('Removal failed');
              return;
            }

            goToCustomDashboardList();
          });
        }}
      />
    );
  }

  function onSaveConfiguration() {
    updateCustomDashboard(config).subscribe(result => {
      if (result.progress.loading) {
        return;
      }

      if (result.errors.length > 0) {
        // TODO improve error case
        alert('Saving failed');
        return;
      }

      setEditing(false);
    });
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
            setConfig(originalConfiguration);
            close();
          }}
        />
      );
    }
  }
}
