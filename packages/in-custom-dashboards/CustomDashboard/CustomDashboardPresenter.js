/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { uniqBy } from 'lodash';
import React from 'react';

import { HorizontalIndicator, Button } from '@instana/components';

import {
  carbonButtonEnabled,
  customDashboardTopLevelFiltersEnabled,
  customDashboardsExportPdfEntireDashboard,
  customDashboardsFastQueryModeEnabled
} from 'in-services/featureFlags';
import EntityPageMainNotificationLightCardV2 from 'in-components/EntityPageMainNotification/EntityPageMainNotificationLightCardV2';
import { FastQueryModeToggle } from 'in-custom-dashboards/CustomDashboard/FastQueryModeToggle/FastQueryModeToggle';
import { setLandingPage, isLandingPage } from 'in-client/js/LandingPage/supportedLandingPages/customDashboards';
import TopLevelFilterBar from 'in-custom-dashboards/CustomDashboard/FilterContext/TopLevelFilterBar';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import { MoreMenu, MoreMenuButton, MoreMenuSetAsLandingPageButton } from 'in-components/MoreMenu';
import { FilterContext } from 'in-custom-dashboards/CustomDashboard/FilterContext/FilterContext';
import DashboardErroneousResultPresenter from 'in-components/DashboardErroneousResultPresenter';
import DashboardSwitcher from 'in-custom-dashboards/DashboardSwitcher/DashboardSwitcher';
import DashboardHeaderButton from 'in-components/DashboardHeader/DashboardHeaderButton';
import DefaultLoadingDashboard from 'in-components/Loading/DefaultLoadingDashboard';
import { dashboardTvModeUrlParameter } from 'in-custom-dashboards/navigation/url';
import DashboardHeader, { themes } from 'in-components/DashboardHeader';
import Grid from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { pageNames } from 'in-services/tracking/pageNames';
import { playwithEnabled } from 'in-services/featureFlags';
import SaveButton from 'in-components/form/SaveButton';
import WithTvMode from 'in-components/WithTvMode';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './CustomDashboardPresenter.mless';

export default function CustomDashboardPresenter(props) {
  const { width, ref } = useResizeObserverCustom();

  const {
    result,
    config,
    onLayoutChange,
    editable,
    onAddWidget,
    onEditWidget,
    onRemoveWidget,
    onCopyWidget,
    onDuplicateWidget,
    onZoomWidget,
    topLevelFilters,
    onTopLevelFiltersChange,
    shouldWidgetRenderOutsideViewport
  } = props;

  let titleOverwrite = config?.title;
  if (result?.errors?.length > 0) {
    if (result.errors[0]?.code === 'NOT_FOUND') {
      titleOverwrite = t('in-custom-dashboards:customDashboard.customDashboardPresenter.dashboardNotFound');
    } else {
      titleOverwrite = t('in-custom-dashboards:customDashboard.customDashboardPresenter.failure');
    }
  }

  const loadingSection = result?.progress?.loading && <DefaultLoadingDashboard />;

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
    <div ref={ref}>
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
                    shouldWidgetRenderOutsideViewport={shouldWidgetRenderOutsideViewport}
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
                    {customDashboardTopLevelFiltersEnabled && (
                      <TopLevelFilterBar
                        topLevelFilters={topLevelFilters}
                        onTopLevelFiltersChange={onTopLevelFiltersChange}
                      />
                    )}
                    {result && <HorizontalIndicator progress={result.progress} />}
                    <DashboardHeaderShadowModule />
                    <Title
                      title={t('in-custom-dashboards:customDashboard.customDashboardPresenter.customDashboard')}
                      dynamic={config && config.title}
                    />
                    <ViewTrackingMeta
                      data={{
                        productArea: productAreas.custom_dashboard,
                        pageRootName: pageNames.custom_dashboard,
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
                    <FilterContext.Provider value={topLevelFilters}>
                      <Grid
                        width={width}
                        config={config}
                        onLayoutChange={onLayoutChange}
                        onEditWidget={onEditWidget}
                        onRemoveWidget={onRemoveWidget}
                        onCopyWidget={onCopyWidget}
                        onDuplicateWidget={onDuplicateWidget}
                        onZoomWidget={onZoomWidget}
                        shouldWidgetRenderOutsideViewport={shouldWidgetRenderOutsideViewport}
                        isResizable={editable}
                        isConfigurable={editable}
                        isDraggable={editable}
                      />
                    </FilterContext.Provider>
                  </div>
                )}
              </Sticky>
            )}
          </>
        )}
      </WithTvMode>
    </div>
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
        disabled={playwithEnabled}
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
  onPDFDashboardDownload,
  editable,
  onEditAsJson,
  onViewAsJson,
  onCopyAllWidgets
}) {
  return (
    <>
      {customDashboardsFastQueryModeEnabled && <FastQueryModeToggle />}
      {editable && (
        <Button kind="action" onClick={onAddWidget} icon="lib_openclose_add_circle_outline">
          {t('in-custom-dashboards:customDashboard.customDashboardPresenter.addWidget')}
        </Button>
      )}

      <MoreMenu kind="secondaryDarker">
        <MoreMenuButton icon="lib_actions_maximize" disabled={playwithEnabled} onClick={() => setTvModeEnabled(true)}>
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
          <MoreMenuButton icon="lib_views_file" disabled={playwithEnabled} onClick={onViewAsJson}>
            {t('in-custom-dashboards:customDashboard.customDashboardPresenter.viewAsJson')}
          </MoreMenuButton>
        )}
        <CopyToClipboard
          getText={() => onCopyAllWidgets()}
          successText={t('in-custom-dashboards:customDashboard.customDashboardPresenter.copiedAllWidgets')}
        >
          {copyToClipboardRef => (
            <MoreMenuButton icon="lib_actions_copy" disabled={playwithEnabled} ref={copyToClipboardRef}>
              {t('in-custom-dashboards:customDashboard.customDashboardPresenter.copyAllWidgets')}
            </MoreMenuButton>
          )}
        </CopyToClipboard>
        {customDashboardsExportPdfEntireDashboard && (
          <MoreMenuButton
            icon="lib_actions_download"
            disabled={playwithEnabled}
            onClick={() => onPDFDashboardDownload(customDashboardId)}
          >
            {t('in-custom-dashboards:customDashboard.grid.grid.exportPDF')}
          </MoreMenuButton>
        )}
        <MoreMenuButton icon="lib_group_by" disabled={playwithEnabled} onClick={onDuplicateDashboard}>
          {t('in-custom-dashboards:customDashboard.customDashboardPresenter.duplicate')}
        </MoreMenuButton>
        {editable && (
          <MoreMenuButton icon="lib_actions_delete" disabled={playwithEnabled} onClick={onDeleteCustomDashboard}>
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
      className={carbonButtonEnabled ? locals.carbonShare : undefined}
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
