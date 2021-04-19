/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable react/display-name */
import { uniqBy } from 'lodash';
import React from 'react';

import EntityPageMainNotificationLightCardV2 from 'in-new-components/EntityPageMainNotification/EntityPageMainNotificationLightCardV2';
import { setLandingPage, isLandingPage } from 'in-client/js/LandingPage/supportedLandingPages/customDashboards';
import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import { MoreMenu, MoreMenuButton, MoreMenuSetAsLandingPageButton } from 'in-new-components/MoreMenu';
import DashboardErroneousResultPresenter from 'in-new-components/DashboardErroneousResultPresenter';
import DashboardHeaderButton from 'in-new-components/DashboardHeader/DashboardHeaderButton';
import DashboardSwitcher from 'in-custom-dashboards/DashboardSwitcher/DashboardSwitcher';
import DefaultLoadingDashboard from 'in-new-components/Loading/DefaultLoadingDashboard';
import { dashboardTvModeUrlParameter } from 'in-custom-dashboards/navigation/url';
import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import Grid from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import getElementDimensions from 'in-hoc/getElementDimensions';
import SaveButton from 'in-components/form/SaveButton';
import WithTvMode from 'in-new-components/WithTvMode';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import { lightV2 } from 'in-themes/themes';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './CustomDashboardPresenter.mless';

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

  let titleOverwrite = config?.title;
  if (result?.errors?.length > 0) {
    if (result.errors[0]?.code === 'NOT_FOUND') {
      titleOverwrite = t('in-custom-dashboards:customDashboard.customDashboardPresenter.dashboardNotFound');
    } else {
      titleOverwrite = t('in-custom-dashboards:customDashboard.customDashboardPresenter.failure');
    }
  }

  const loadingSection = result?.progress?.loading && <DefaultLoadingDashboard lightMode />;

  const errorSection =
    result?.errors?.[0]?.code === 'NOT_FOUND' ? (
      <EntityPageMainNotificationLightCardV2
        icon="lib_missing_data"
        title={t('in-custom-dashboards:customDashboard.customDashboardPresenter.dashboardNotFound')}
        explanation={t('in-custom-dashboards:customDashboard.customDashboardPresenter.dashboardNotFoundExplain')}
      />
    ) : (
      <DashboardErroneousResultPresenter errors={result?.errors} />
    );

  return (
    <LocallyChangedTheme theme={lightV2}>
      <WithTvMode urlParameter={dashboardTvModeUrlParameter}>
        {({ enabled, setEnabled, wrapperDomNode }) => (
          <>
            {enabled && (
              <>
                {loadingSection}
                {errorSection}
                {config && (
                  <Grid
                    tvMode
                    scrollAreaDomNode={wrapperDomNode}
                    width={width}
                    config={config}
                    isResizable={false}
                    isConfigurable={false}
                    isDraggable={false}
                  />
                )}
              </>
            )}

            {!enabled && (
              <Sticky
                header={
                  <>
                    <DashboardHeader
                      theme={themes.light}
                      label={<DashboardSwitcher titleOverwrite={titleOverwrite} />}
                      renderButtonLine={config && (() => <ButtonLine {...props} />)}
                      renderButtonLineSecondary={
                        config &&
                        (() => (
                          <SecondaryButtonLine {...props} setTvModeEnabled={setEnabled} onAddWidget={onAddWidget} />
                        ))
                      }
                      renderTopLevelButtonLine={config && (() => <TopLevelButtonLine {...props} />)}
                    />
                    {result && <HorizontalIndicator progress={result.progress} />}
                    <DashboardHeaderShadowModule />

                    <Title
                      title={t('in-custom-dashboards:customDashboard.customDashboardPresenter.customDashboard')}
                      dynamic={config && config.title}
                    />
                    <ViewTrackingMeta
                      data={{
                        productArea: 'Custom Dashboard',
                        pageRootName: 'Custom Dashboard',
                        widgetTypes: uniqBy(config?.widgets.map(w => w.type) ?? []).join(', ')
                      }}
                    />
                  </>
                }
              >
                {loadingSection}
                {errorSection}
                {config && (
                  <div className={locals.wrapper}>
                    <Grid
                      width={width}
                      config={config}
                      onLayoutChange={onLayoutChange}
                      onEditWidget={onEditWidget}
                      onRemoveWidget={onRemoveWidget}
                      onDuplicateWidget={onDuplicateWidget}
                      isResizable={editable}
                      isConfigurable={editable}
                      isDraggable={editable}
                    />
                  </div>
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
        {t('in-custom-dashboards:customDashboard.customDashboardPresenter.saveChange')}
      </SaveButton>
      <Button icon="lib_openclose_cancel" kind="subtle" onClick={onDiscardChanges}>
        {t('in-custom-dashboards:customDashboard.customDashboardPresenter.discardChange')}
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
  onEditAsJson,
  onViewAsJson
}) {
  return (
    <>
      {editable && (
        <Button kind="action" onClick={onAddWidget} icon="lib_openclose_add_circle_outline">
          {t('in-custom-dashboards:customDashboard.customDashboardPresenter.addWidget')}
        </Button>
      )}

      <MoreMenu kind="secondaryDarker">
        <MoreMenuButton icon="lib_actions_maximize" onClick={() => setTvModeEnabled(true)}>
          {t('in-custom-dashboards:customDashboard.customDashboardPresenter.tvMode')}
        </MoreMenuButton>
        <MoreMenuSetAsLandingPageButton
          setLandingPage={() => setLandingPage(customDashboardId)}
          isLandingPage={pageKey => isLandingPage(pageKey, customDashboardId)}
        />
        {editable && (
          <MoreMenuButton icon="lib_actions_edit" onClick={onRenameDashboard}>
            {t('in-custom-dashboards:customDashboard.customDashboardPresenter.editName')}
          </MoreMenuButton>
        )}
        {editable ? (
          <MoreMenuButton icon="lib_views_file" onClick={onEditAsJson}>
            {t('in-custom-dashboards:customDashboard.customDashboardPresenter.editAsJson')}
          </MoreMenuButton>
        ) : (
          <MoreMenuButton icon="lib_views_file" onClick={onViewAsJson}>
            {t('in-custom-dashboards:customDashboard.customDashboardPresenter.viewAsJson')}
          </MoreMenuButton>
        )}
        <MoreMenuButton icon="lib_actions_copy" onClick={onDuplicateDashboard}>
          {t('in-custom-dashboards:customDashboard.customDashboardPresenter.duplicate')}
        </MoreMenuButton>
        {editable && (
          <MoreMenuButton icon="lib_actions_delete" onClick={onDeleteCustomDashboard}>
            {t('in-custom-dashboards:customDashboard.customDashboardPresenter.delete')}
          </MoreMenuButton>
        )}
      </MoreMenu>
    </>
  );
}

function TopLevelButtonLine({ editable, onShare, canCreatePublicCustomDashboards }) {
  if (!editable) {
    return null;
  }

  let shareButton = (
    <DashboardHeaderButton
      icon="lib_actions_share"
      onClick={canCreatePublicCustomDashboards ? onShare : undefined}
      disabled={!canCreatePublicCustomDashboards}
    >
      {t('in-custom-dashboards:customDashboard.customDashboardPresenter.share')}
    </DashboardHeaderButton>
  );

  if (!canCreatePublicCustomDashboards) {
    shareButton = (
      <Tooltip content={t('in-custom-dashboards:customDashboard.customDashboardPresenter.shareButtonTooltip')}>
        {shareButton}
      </Tooltip>
    );
  }

  return shareButton;
}
