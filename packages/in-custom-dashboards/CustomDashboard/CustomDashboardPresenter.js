/* eslint-disable react/display-name */

import React from 'react';

import { setLandingPage, isLandingPage } from 'in-client/js/LandingPage/supportedLandingPages/customDashboards';
import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import { MoreMenu, MoreMenuButton, MoreMenuSetAsLandingPageButton } from 'in-new-components/MoreMenu';
import DashboardErroneousResultPresenter from 'in-new-components/DashboardErroneousResultPresenter';
import DashboardSwitcher from 'in-custom-dashboards/DashboardSwitcher/DashboardSwitcher';
import DefaultLoadingDashboard from 'in-new-components/Loading/DefaultLoadingDashboard';
import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import Grid from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import getElementDimensions from 'in-hoc/getElementDimensions';
import SaveButton from 'in-components/form/SaveButton';
import SetBodyColor from 'in-components/SetBodyColor';
import WithTvMode from 'in-new-components/WithTvMode';
import Button from 'in-new-components/Button';
import { lightV2 } from 'in-themes/themes';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import theme from 'in-themes';

export default getElementDimensions(CustomDashboardPresenter);

function CustomDashboardPresenter(props) {
  const {
    result,
    config,
    onLayoutChange,
    width,
    editable,
    onAddWidget,
    onEditWidget,
    onRemoveWidget,
    onDuplicateWidget
  } = props;

  return (
    <LocallyChangedTheme theme={lightV2}>
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
                    onDuplicateWidget={onDuplicateWidget}
                    isDeletable={editable}
                    isResizable={editable}
                    isConfigurable={editable}
                    isDraggable={editable}
                  />
                )}
              </Sticky>
            )}
          </>
        )}
      </WithTvMode>
    </LocallyChangedTheme>
  );
}

function ButtonLine({ onSaveConfiguration, hasChanges, editable, isSaving, onDiscardChanges }) {
  if (!isSaving && (!editable || !hasChanges)) {
    return null;
  }

  return (
    <>
      <SaveButton
        icon="lib_actions_sync"
        kind="primaryv2"
        onClick={onSaveConfiguration}
        type="button"
        isSaving={isSaving}
      >
        Save changes
      </SaveButton>
      <Button icon="lib_openclose_cancel" kind="subtle" onClick={onDiscardChanges}>
        Discard Changes
      </Button>
    </>
  );
}

function SecondaryButtonLine({
  onAddWidget,
  setTvModeEnabled,
  customDashboardId,
  onDeleteCustomDashboard,
  onRenameDashboard,
  onDuplicateDashboard,
  editable,
  onShare
}) {
  return (
    <>
      {editable && (
        <Button kind="action" onClick={onAddWidget} icon="lib_openclose_add_circle_outline">
          Add Widget
        </Button>
      )}

      {editable && (
        <Button kind="secondaryDarker" icon="lib_actions_share" onClick={onShare}>
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
        <MoreMenuButton icon="lib_views_popup" onClick={onDuplicateDashboard}>
          Duplicate
        </MoreMenuButton>
        {editable && (
          <MoreMenuButton icon="lib_actions_delete" onClick={onDeleteCustomDashboard}>
            Delete
          </MoreMenuButton>
        )}
      </MoreMenu>
    </>
  );
}
