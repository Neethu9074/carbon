import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import WidgetEditor from 'in-custom-dashboards/CustomDashboard/WidgetEditor/WidgetEditor';
import { getNewCustomDashboardLink } from 'in-custom-dashboards/navigation/url';
import { setDuplicationSource } from 'in-custom-dashboards/duplicationSupport';
import Grid from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import DashboardHeader from 'in-new-components/DashboardHeader';
import Button from 'in-new-components/Button';
import Sticky from 'in-components/Sticky';

import locals from './CustomDashboardPresenter.mless';

export default function CustomDashboardPresenter(props) {
  const { config, setConfig, isEditing, onLayoutChange, onRenameDashboard } = props;

  return (
    <>
      <WidgetEditor config={config} setConfig={setConfig}>
        {({ onAddWidget, onEditWidget, onRemoveWidget }) => (
          <Sticky
            header={
              <>
                <DashboardHeader
                  icon="lib_views_grid"
                  label={config.title}
                  title={config.title}
                  renderButtonLine={() => (
                    <ButtonLine {...props} onAddWidget={onAddWidget} onEditWidget={onEditWidget} />
                  )}
                  renderMetaInformation={() => (
                    <>
                      {isEditing && (
                        <Button size="compact" kind="subtle" onClick={onRenameDashboard}>
                          Rename
                        </Button>
                      )}
                    </>
                  )}
                />
                <DashboardHeaderShadowModule />
              </>
            }
          >
            <Grid
              config={config}
              onLayoutChange={onLayoutChange}
              onEditWidget={onEditWidget}
              onRemoveWidget={onRemoveWidget}
              isEditing={isEditing}
            />
          </Sticky>
        )}
      </WidgetEditor>
    </>
  );
}

function ButtonLine({
  config,
  isEditing,
  setEditing,
  onAddWidget,
  onDeleteCustomDashboard,
  onSaveConfiguration,
  onCancel,
  showDuplicateDashboard = true,
  editable
}) {
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

        <Button kind="create" onClick={onAddWidget}>
          Add Widget
        </Button>
      </div>
    );
  }

  return (
    <div className={locals.buttonGroups}>
      {/* div is used to build a flexgroup element group */}
      <div>
        {editable && (
          <Button kind="primaryv2" onClick={() => setEditing(true)}>
            Edit Dashboard
          </Button>
        )}
        {showDuplicateDashboard && (
          <Button
            kind="secondary"
            href$={getNewCustomDashboardLink(config.id)}
            onClick={() => setDuplicationSource(config)}
          >
            Duplicate Dashboard
          </Button>
        )}
        {editable && <Button kind="secondary">Share</Button>}
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
