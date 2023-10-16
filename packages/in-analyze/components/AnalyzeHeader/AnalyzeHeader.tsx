/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

// @ts-expect-error migrate to TS
import AnalyzeDataSourceSelector from 'in-analyze/components/AnalyzeHeader/AnalyzeDataSourceSelector';
// @ts-expect-error migrate to TS
import DashboardHeaderButton from 'in-components/DashboardHeader/DashboardHeaderButton';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import { ActiveConfiguration, AnalyzeHeaderProps } from 'in-analyze/components/AnalyzeHeader/types';
import { productAreaTrackingNames, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import { getActiveConfiguration } from 'in-analyze/components/AnalyzeHeader/utils';
import { analyzeDocs } from 'in-analyze/components/AnalyzeHeader/constants';
import TimeSelection from 'in-components/time/TimeSelection/TimeSelection';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import DashboardHeader, { themes } from 'in-components/DashboardHeader';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import Label from 'in-analyze/components/AnalyzeHeader/Label';
import Overlay from 'in-components/overlays/Overlay/Overlay';
import { pageNames } from 'in-services/tracking/pageNames';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';
import { clickedDocsLink } from 'in-analyze/tracker';
import Title from 'in-components/Title/Title';
import { t } from 'in-i18n';

import locals from './AnalyzeHeader.mless';

export default function AnalyzeHeader({
  renderQuickFilterBar,
  isGrouped,
  formModel = emptyArray,
  withoutShadow,
  label,
  headerHref$,
  onHeaderClick,
  contextConfigurations = undefined,
  liveModeDisabled,
  liveModeDisabledTooltip
}: AnalyzeHeaderProps) {
  const location = useLocation();
  const activeConfiguration = getActiveConfiguration(location) as ActiveConfiguration;

  const HeaderLabel =
    label !== undefined ? (
      label
    ) : (
      <Overlay props={{ activeConfiguration, isGrouped, formModel }} withoutWrapper content={AnalyzeDataSourceSelector}>
        {({ toggle, isOpen, ref }) => (
          <DashboardHeaderButton size="normal" className={locals.button} ref={ref} onClick={toggle} expanded={isOpen}>
            <Label activeConfiguration={activeConfiguration} />
          </DashboardHeaderButton>
        )}
      </Overlay>
    );

  const contextConfig =
    contextConfigurations !== undefined
      ? contextConfigurations
      : [
          {
            renderContext: () => t('in-analyze:components.analyzeHeader.analytics'),
            contextIcon: 'lib_analyze_inverted'
          }
        ];

  const renderMetaInformation = () => {
    const { beta, dataSource } = activeConfiguration;
    const docsLink = analyzeDocs[dataSource];
    const linkLabel = t('in-analyze:analyzeHeader.readDocs');
    const handleTracking = () => {
      clickedDocsLink(emptyObject);
    };

    return (
      <div className={locals.metaInformation}>
        {beta && <BetaBadge />}
        {docsLink && (
          <Link onClick={handleTracking} external href={docsLink}>
            {linkLabel}
          </Link>
        )}
      </div>
    );
  };

  const renderTimeSelection = () => {
    return (
      <TimeSelection
        darkTheme={false}
        liveModeDisabled={liveModeDisabled}
        liveModeDisabledTooltip={liveModeDisabledTooltip}
      />
    );
  };

  const dashboardHeaderProps = {
    showHistoricDataWarning: false,
    contextConfigurations: contextConfig,
    renderMetaInformation,
    label: HeaderLabel,
    title: t('in-analyze:analyzeHeader.title'),
    headerHref$: headerHref$,
    onHeaderClick: onHeaderClick,
    renderTimeSelection: renderTimeSelection
  };

  return (
    <>
      <DashboardHeader {...dashboardHeaderProps} />
      <Title title={getLabelByType(activeConfiguration.dataSource)} />
      <ViewTrackingMeta
        data={{
          productArea: productAreaTrackingNames[activeConfiguration.productArea as never],
          pageRootName: pageNames.analytics
        }}
      />
      {renderQuickFilterBar && (
        <DashboardHeaderModule theme={themes.light} withTopBorder>
          {renderQuickFilterBar()}
        </DashboardHeaderModule>
      )}
      {!withoutShadow && <DashboardHeaderShadowModule />}
    </>
  );
}
