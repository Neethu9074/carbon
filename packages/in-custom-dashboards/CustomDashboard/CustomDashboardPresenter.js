import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import Grid from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import DashboardHeader from 'in-new-components/DashboardHeader';
import Button from 'in-new-components/Button';

import locals from './CustomDashboardPresenter.mless';

export default function CustomDashboardPresenter({
  config,
  isEditing,
  setEditing,
  onLayoutChange,
  onAddNewWidget,
  onEditWidget,
  onDeleteCustomDashboard,
  onSaveConfiguration,
  onCancel
}) {
  return (
    <>
      <DashboardHeader
        icon="lib_views_grid"
        label={config.title}
        title={config.title}
        renderButtonLine={renderButtonLine}
      />
      <DashboardHeaderShadowModule />
      <Grid config={config} onLayoutChange={onLayoutChange} onEditWidget={onEditWidget} isEditing={isEditing} />
    </>
  );

  function renderButtonLine() {
    if (isEditing) {
      return (
        <div className={locals.buttonGroups}>
          {/* div is used to build a flexgroup element group */}
          <div>
            <Button kind="primaryv2" onClick={onSaveConfiguration}>
              Save Configuration
            </Button>
            {onDeleteCustomDashboard && (
              <Button kind="danger" onClick={onDeleteCustomDashboard}>
                Delete Dashboard
              </Button>
            )}
            {onCancel && (
              <Button kind="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button kind="secondary">Share</Button>
          </div>

          <Button kind="create" onClick={onAddNewWidget}>
            Add Widget
          </Button>
        </div>
      );
    }

    return (
      <div className={locals.buttonGroups}>
        {/* div is used to build a flexgroup element group */}
        <div>
          <Button kind="primaryv2" onClick={() => setEditing(true)}>
            Edit Dashboard
          </Button>
          <Button kind="secondary">Duplicate Dashboard</Button>
          <Button kind="secondary">Share</Button>
        </div>

        {/* div is used to build a flexgroup element group */}
        <div>
          <Button kind="secondary" icon="lib_actions_settings">
            Deploy Agent
          </Button>
          <Button kind="secondary" icon="lib_alerts_user_impacted">
            Add Users
          </Button>
        </div>
      </div>
    );
  }
}
