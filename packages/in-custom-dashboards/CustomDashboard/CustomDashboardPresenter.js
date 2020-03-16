/* eslint-disable react/display-name */

import React from 'react';

import { setLandingPage, isLandingPage } from 'in-client/js/LandingPage/supportedLandingPages/customDashboards';
import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import { MoreMenu, MoreMenuButton, MoreMenuSetAsLandingPageButton } from 'in-new-components/MoreMenu';
import DashboardErroneousResultPresenter from 'in-new-components/DashboardErroneousResultPresenter';
import WidgetEditor from 'in-custom-dashboards/CustomDashboard/WidgetEditor/WidgetEditor';
import DashboardSwitcher from 'in-custom-dashboards/DashboardSwitcher/DashboardSwitcher';
import DefaultLoadingDashboard from 'in-new-components/Loading/DefaultLoadingDashboard';
import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import Grid from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import getElementDimensions from 'in-hoc/getElementDimensions';
import SaveButton from 'in-components/form/SaveButton';
import SetBodyColor from 'in-components/SetBodyColor';
import WithTvMode from 'in-new-components/WithTvMode';
import Button from 'in-new-components/Button';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import theme from 'in-themes';

export default getElementDimensions(CustomDashboardPresenter);

function CustomDashboardPresenter(props) {
  const { result, config, setConfig, onLayoutChange, width, editable } = props;

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
                        theme={themes.light}
                        label={<DashboardSwitcher titleOverwrite={config && config.title} />}
                        renderButtonLine={config && (() => <ButtonLine {...props} />)}
                        renderButtonLineSecondary={
                          config &&
                          (() => (
                            <SecondaryButtonLine {...props} setTvModeEnabled={setEnabled} onAddWidget={onAddWidget} />
                          ))
                        }
                      />
                      {result && <HorizontalIndicator progress={result.progress} />}
                      <DashboardHeaderShadowModule />

                      <Title title="Dashboard" dynamic={config && config.title} />
                    </>
                  }
                >
                  {result && result.progress && result.progress.loading && <DefaultLoadingDashboard lightMode />}
                  {result && <DashboardErroneousResultPresenter errors={result.errors} />}
                  {config && (
                    <Grid
                      width={width}
                      config={config}
                      onLayoutChange={onLayoutChange}
                      onEditWidget={onEditWidget}
                      onRemoveWidget={onRemoveWidget}
                      isEditing
                      isDeletable={editable}
                      isResizable={editable}
                      isConfigurable={editable}
                      isDraggable={editable}
                    />
                  )}
                </Sticky>
              )}
            </WidgetEditor>
          )}
        </>
      )}
    </WithTvMode>
  );
}

function ButtonLine({ onSaveConfiguration, hasChanges, editable, isSaving }) {
  if (!isSaving && (!editable || !hasChanges)) {
    return null;
  }

  return (
    <SaveButton
      icon="lib_actions_sync"
      kind="primaryv2"
      onClick={onSaveConfiguration}
      type="button"
      isSaving={isSaving}
    >
      Save changes
    </SaveButton>
  );
}

function SecondaryButtonLine({
  onAddWidget,
  setTvModeEnabled,
  customDashboardId,
  onDeleteCustomDashboard,
  onRenameDashboard,
  editable
}) {
  return (
    <>
      {editable && (
        <Button kind="action" onClick={onAddWidget} icon="lib_openclose_add_circle_outline">
          Add Widget
        </Button>
      )}

      {editable && (
        <Button kind="secondaryDarker" icon="lib_actions_share">
          Share
        </Button>
      )}

      <MoreMenu kind="secondaryDarker">
        <MoreMenuButton icon="lib_actions_maximize" onClick={() => setTvModeEnabled(true)}>
          TV Mode
        </MoreMenuButton>
        <MoreMenuSetAsLandingPageButton
          setLandingPage={() => setLandingPage(customDashboardId)}
          isLandingPage={pageKey => isLandingPage(pageKey, customDashboardId)}
        />
        {editable && (
          <MoreMenuButton icon="lib_actions_edit" onClick={onRenameDashboard}>
            Edit Name
          </MoreMenuButton>
        )}
        <MoreMenuButton icon="lib_views_popup">Duplicate</MoreMenuButton>
        {editable && (
          <MoreMenuButton icon="lib_actions_delete" onClick={onDeleteCustomDashboard}>
            Delete
          </MoreMenuButton>
        )}
      </MoreMenu>
    </>
  );
}
