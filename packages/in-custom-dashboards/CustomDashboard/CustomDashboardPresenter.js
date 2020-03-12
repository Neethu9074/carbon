/* eslint-disable react/display-name */

import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardErroneousResultPresenter from 'in-new-components/DashboardErroneousResultPresenter';
import WidgetEditor from 'in-custom-dashboards/CustomDashboard/WidgetEditor/WidgetEditor';
import DashboardSwitcher from 'in-custom-dashboards/DashboardSwitcher/DashboardSwitcher';
import DefaultLoadingDashboard from 'in-new-components/Loading/DefaultLoadingDashboard';
import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import SetAsLandingPage from 'in-custom-dashboards/SetAsLandingPage';
import Grid from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import getElementDimensions from 'in-hoc/getElementDimensions';
import SetBodyColor from 'in-components/SetBodyColor';
import WithTvMode from 'in-new-components/WithTvMode';
import Button from 'in-new-components/Button';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import theme from 'in-themes';

export default getElementDimensions(CustomDashboardPresenter);

function CustomDashboardPresenter(props) {
  const {
    result,
    config,
    setConfig,
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
                        theme={themes.light}
                        label={<DashboardSwitcher titleOverwrite={config && config.title} />}
                        renderButtonLine={
                          config &&
                          (() => <ButtonLine {...props} onAddWidget={onAddWidget} onEditWidget={onEditWidget} />)
                        }
                        renderButtonLineSecondary={
                          config &&
                          (() => (
                            <SecondaryButtonLine
                              {...props}
                              onAddWidget={onAddWidget}
                              onEditWidget={onEditWidget}
                              setTvModeEnabled={setEnabled}
                            />
                          ))
                        }
                        renderMetaInformation={
                          config &&
                          (() => (
                            <Button size="compact" kind="subtle" onClick={onRenameDashboard}>
                              Rename
                            </Button>
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
                      isDeletable={isDeletable}
                      isResizable={isResizable}
                      isConfigurable={isConfigurable}
                      isDraggable={isDraggable}
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

function ButtonLine({ onDeleteCustomDashboard, onSaveConfiguration }) {
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
      <Button kind="secondary">Share</Button>
    </>
  );
}

function SecondaryButtonLine({ onAddWidget, setTvModeEnabled, customDashboardId }) {
  return (
    <>
      <Button kind="create" onClick={onAddWidget}>
        Add Widget
      </Button>
      <SetAsLandingPage customDashboardId={customDashboardId} />
      <Button kind="secondary" onClick={() => setTvModeEnabled(true)}>
        TV Mode
      </Button>
    </>
  );
}
