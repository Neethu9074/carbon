import { compose, withProps } from 'recompose';
import { isEqual } from 'lodash';
import React from 'react';

import { getCustomDashboard, updateCustomDashboard, removeCustomDashboard } from 'in-custom-dashboards/api';
import { dashboardIdUrlParameter, goToCustomDashboardList } from 'in-custom-dashboards/navigation/url';
import CustomDashboardPresenter from 'in-custom-dashboards/CustomDashboard/CustomDashboardPresenter';
import { onLayoutChange, onRenameDashboard } from 'in-custom-dashboards/CustomDashboard/editor';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { deepCopy } from 'in-services/util/object';
import withUrlState from 'in-hoc/withUrlState';
import connectTo from 'in-hoc/connectTo';

export default compose(
  withUrlState({
    bind: [dashboardIdUrlParameter]
  }),
  connectTo(({ dashboardId }) => ({
    result: getCustomDashboard(dashboardId)
  })),
  withPropDependingState({
    getInitialState,
    resets: [
      {
        getResettingProps: () => ['result'],
        onReset: getInitialState
      }
    ],
    reducerName: 'setState',
    reducer: (prevState, newState) => ({
      ...prevState,
      ...newState
    })
  }),
  withProps(({ setState }) => ({
    setConfig: config => setState({ config }),
    setSaving: isSaving => setState({ isSaving })
  }))
)(CustomDashboardLoader);

function CustomDashboardLoader(props) {
  const { dashboardId, config, setConfig, result, isSaving, setSaving } = props;

  return (
    <CustomDashboardPresenter
      {...props}
      // Reset state when the config changes
      key={dashboardId}
      customDashboardId={dashboardId}
      editable={config?.writable && !isSaving}
      hasChanges={hasChanges(result, config)}
      isSaving={isSaving}
      onLayoutChange={changes => onLayoutChange(config, setConfig, changes)}
      onDeleteCustomDashboard={onDeleteCustomDashboard}
      onSaveConfiguration={onSaveConfiguration}
      onRenameDashboard={() => onRenameDashboard(config, setConfig)}
    />
  );

  function onDeleteCustomDashboard() {
    addActiveDialog(
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
    setSaving(true);
    updateCustomDashboard(config).subscribe(result => {
      if (result.progress.loading) {
        return;
      }

      if (result.errors.length > 0) {
        // TODO improve error case
        alert('Saving failed');
        return;
      }
    });
  }
}

function getInitialState({ result }) {
  if (!result || !result.data) {
    return {
      persistedConfig: null,
      config: null,
      isSaving: false
    };
  }

  return {
    persistedConfig: result.data,
    config: deepCopy(result.data),
    isSaving: false
  };
}

function hasChanges(result, config) {
  if (!config || !result?.data) {
    return false;
  }

  return !isEqual(result.data, config);
}
