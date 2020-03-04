import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import WidgetEditor from 'in-custom-dashboards/CustomDashboard/WidgetEditor/WidgetEditor';
import { getNewCustomDashboardLink } from 'in-custom-dashboards/navigation/url';
import { setDuplicationSource } from 'in-custom-dashboards/duplicationSupport';
import SetAsLandingPage from 'in-custom-dashboards/SetAsLandingPage';
import Grid from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import DashboardHeader from 'in-new-components/DashboardHeader';
import getElementDimensions from 'in-hoc/getElementDimensions';
import SetBodyColor from 'in-components/SetBodyColor';
import WithTvMode from 'in-new-components/WithTvMode';
import Button from 'in-new-components/Button';
import Sticky from 'in-components/Sticky';
import theme from 'in-themes';

export default getElementDimensions(CustomDashboardPresenter);

function CustomDashboardPresenter(props) {
  const {
    config,
    setConfig,
    isEditing,
    isDeletable,
    isResizable,
    isConfigurable,
    isDraggable,
    onLayoutChange,
    onRenameDashboard,
    width
  } = props;

  return (
    <WithTvMode>
      {({ enabled, setEnabled }) => (
        <>
          <SetBodyColor color={theme.lib.colors.N100} />

          {enabled && (
            <Grid
              tvMode
              width={width}
              config={config}
              isEditing={false}
              isDeletable={false}
              isResizable={false}
              isConfigurable={false}
              isDraggable={false}
            />
          )}

          {!enabled && (
            <WidgetEditor config={config} setConfig={setConfig}>
              {({ onAddWidget, onEditWidget, onRemoveWidget }) => (
                <Sticky
                  header={
                    <>
                      <DashboardHeader
                        icon="lib_views_grid"
                        label={config.title}
                        title="Dashboard"
                        renderButtonLine={() => (
                          <ButtonLine {...props} onAddWidget={onAddWidget} onEditWidget={onEditWidget} />
                        )}
                        renderButtonLineSecondary={() => (
                          <SecondaryButtonLine
                            {...props}
                            onAddWidget={onAddWidget}
                            onEditWidget={onEditWidget}
                            setTvModeEnabled={setEnabled}
                          />
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
                  {
                    <Grid
                      width={width}
                      config={config}
                      onLayoutChange={onLayoutChange}
                      onEditWidget={onEditWidget}
                      onRemoveWidget={onRemoveWidget}
                      isEditing={isEditing}
                      isDeletable={isDeletable}
                      isResizable={isResizable}
                      isConfigurable={isConfigurable}
                      isDraggable={isDraggable}
                    />
                  }
                </Sticky>
              )}
            </WidgetEditor>
          )}
        </>
      )}
    </WithTvMode>
  );
}

function ButtonLine({
  config,
  isEditing,
  setEditing,
  onDeleteCustomDashboard,
  onSaveConfiguration,
  onCancel,
  showDuplicateDashboard = true,
  editable
}) {
  if (isEditing) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
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
    </>
  );
}

function SecondaryButtonLine({ isEditing, onAddWidget, setTvModeEnabled, customDashboardId }) {
  if (isEditing) {
    return (
      <Button kind="create" onClick={onAddWidget}>
        Add Widget
      </Button>
    );
  }

  return (
    <>
      <SetAsLandingPage customDashboardId={customDashboardId} />
      <Button kind="secondary" onClick={() => setTvModeEnabled(true)}>
        TV Mode
      </Button>
    </>
  );
}
