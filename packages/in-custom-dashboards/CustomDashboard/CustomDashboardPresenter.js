/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { uniqBy } from 'lodash';
import React from 'react';

import {
  HorizontalIndicator,
  Button,
  CarbonOverflowMenu as OverflowMenu,
  CarbonOverflowMenuItem as OverflowMenuItem
} from '@instana/components';

import {
  customDashboardTopLevelFiltersEnabled,
  customDashboardsExportPdfEntireDashboard,
  customDashboardsFastQueryModeEnabled
} from 'in-services/featureFlags';
import EntityPageMainNotificationLightCardV2 from 'in-components/EntityPageMainNotification/EntityPageMainNotificationLightCardV2';
import { FastQueryModeToggle } from 'in-custom-dashboards/CustomDashboard/FastQueryModeToggle/FastQueryModeToggle';
import { setLandingPage, isLandingPage } from 'in-client/js/LandingPage/supportedLandingPages/customDashboards';
import TopLevelFilterBar from 'in-custom-dashboards/CustomDashboard/FilterContext/TopLevelFilterBar';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import { FilterContext } from 'in-custom-dashboards/CustomDashboard/FilterContext/FilterContext';
import DashboardErroneousResultPresenter from 'in-components/DashboardErroneousResultPresenter';
import DashboardSwitcher from 'in-custom-dashboards/DashboardSwitcher/DashboardSwitcher';
import DefaultLoadingDashboard from 'in-components/Loading/DefaultLoadingDashboard';
import { dashboardTvModeUrlParameter } from 'in-custom-dashboards/navigation/url';
import SetAsLandingPage from 'in-client/js/LandingPage/SetAsLandingPage';
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
                  <section aria-label={t('in-components:pageStructure.contentAriaLabel')} className={locals.wrapper}>
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
                  </section>
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
  onCopyAllWidgets,
  canCreatePublicCustomDashboards,
  onShare
}) {
  return (
    <>
      {customDashboardsFastQueryModeEnabled && <FastQueryModeToggle />}
      {editable && (
        <Button kind="action" onClick={onAddWidget} icon="lib_openclose_add_circle_outline">
          {t('in-custom-dashboards:customDashboard.customDashboardPresenter.addWidget')}
        </Button>
      )}
      <OverflowMenu
        aria-label={t('in-custom-dashboards:customDashboard.customDashboardPresenter.customDashboardOptions')}
        flipped
      >
        <OverflowMenuItem
          itemText={t('in-custom-dashboards:customDashboard.customDashboardPresenter.editPermissions')}
          onClick={canCreatePublicCustomDashboards ? onShare : undefined}
          disabled={!canCreatePublicCustomDashboards}
          requireTitle={!canCreatePublicCustomDashboards}
          title={
            !canCreatePublicCustomDashboards
              ? t('in-custom-dashboards:customDashboard.customDashboardPresenter.editOptionTooltip')
              : undefined
          }
        />
        <OverflowMenuItem
          itemText={t('in-custom-dashboards:customDashboard.customDashboardPresenter.tvMode')}
          disabled={playwithEnabled}
          onClick={() => setTvModeEnabled(true)}
        />
        <MenuItemLandingPage
          setLandingPage={() => setLandingPage(customDashboardId)}
          isLandingPage={pageKey => isLandingPage(pageKey, customDashboardId)}
        />

        {editable && (
          <OverflowMenuItem
            itemText={t('in-custom-dashboards:customDashboard.customDashboardPresenter.editName')}
            onClick={onRenameDashboard}
          />
        )}

        {editable ? (
          <OverflowMenuItem
            itemText={t('in-custom-dashboards:customDashboard.customDashboardPresenter.editAsJson')}
            onClick={onEditAsJson}
          />
        ) : (
          <OverflowMenuItem
            itemText={t('in-custom-dashboards:customDashboard.customDashboardPresenter.viewAsJson')}
            disabled={playwithEnabled}
            onClick={onViewAsJson}
          />
        )}
        <CopyToClipboard
          getText={() => onCopyAllWidgets()}
          successText={t('in-custom-dashboards:customDashboard.customDashboardPresenter.copiedAllWidgets')}
        >
          {copyToClipboardRef => (
            <OverflowMenuItem
              itemText={t('in-custom-dashboards:customDashboard.customDashboardPresenter.copyAllWidgets')}
              disabled={playwithEnabled}
              ref={copyToClipboardRef}
            />
          )}
        </CopyToClipboard>
        {customDashboardsExportPdfEntireDashboard && (
          <OverflowMenuItem
            itemText={t('in-custom-dashboards:customDashboard.grid.grid.exportPDF')}
            disabled={playwithEnabled}
            onClick={() => onPDFDashboardDownload(customDashboardId)}
          />
        )}
        <OverflowMenuItem
          itemText={t('in-custom-dashboards:customDashboard.customDashboardPresenter.duplicate')}
          disabled={playwithEnabled}
          onClick={onDuplicateDashboard}
        />
        {editable && (
          <OverflowMenuItem
            itemText={t('in-custom-dashboards:customDashboard.customDashboardPresenter.delete')}
            disabled={playwithEnabled}
            onClick={onDeleteCustomDashboard}
          />
        )}
      </OverflowMenu>
    </>
  );
}

function MenuItemLandingPage({ setLandingPage, isLandingPage }) {
  return (
    <SetAsLandingPage isLandingPage={isLandingPage}>
      {({ isAlreadyLandingPage, label }) =>
        !isAlreadyLandingPage && <OverflowMenuItem itemText={label} onClick={setLandingPage} />
      }
    </SetAsLandingPage>
  );
}
