/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useLocation } from 'react-router';
import React from 'react';

// @ts-expect-error migrate to TS
import AnalyzeDataSourceSelector from 'in-analyze/components/AnalyzeHeader/AnalyzeDataSourceSelector';
// @ts-expect-error migrate to TS
import DashboardHeaderButton from 'in-components/DashboardHeader/DashboardHeaderButton';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import { ActiveConfiguration, AnalyzeHeaderProps } from 'in-analyze/components/AnalyzeHeader/types';
import { productAreaTrackingNames, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import { getActiveConfiguration } from 'in-analyze/components/AnalyzeHeader/utils';
import DashboardHeader, { themes } from 'in-components/DashboardHeader';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import Label from 'in-analyze/components/AnalyzeHeader/Label';
import Overlay from 'in-components/overlays/Overlay/Overlay';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';
import { emptyArray } from 'in-services/fixedObjects';
import Title from 'in-components/Title/Title';
import { t } from 'in-i18n';

import locals from './AnalyzeHeader.mless';

export default function AnalyzeHeader({
  renderQuickFilterBar,
  isGrouped,
  formModel = emptyArray,
  withoutShadow
}: AnalyzeHeaderProps) {
  const location = useLocation();
  const activeConfiguration = getActiveConfiguration(location) as ActiveConfiguration;

  const HeaderLabel = (
    <Overlay props={{ activeConfiguration, isGrouped, formModel }} withoutWrapper content={AnalyzeDataSourceSelector}>
      {({ toggle, isOpen, ref }) => (
        <DashboardHeaderButton size="normal" className={locals.button} ref={ref} onClick={toggle} expanded={isOpen}>
          <Label activeConfiguration={activeConfiguration} />
        </DashboardHeaderButton>
      )}
    </Overlay>
  );

  const dashboardHeaderProps = {
    showHistoricDataWarning: false,
    contextConfigurations: [
      {
        renderContext: () => t('in-analyze:components.analyzeHeader.analytics'),
        contextIcon: 'lib_analyze_inverted'
      }
    ],
    renderMetaInformation: activeConfiguration?.beta ? () => <BetaBadge /> : undefined,
    label: HeaderLabel,
    title: t('in-analyze:analyzeHeader.title')
  };

  return (
    <>
      <DashboardHeader {...dashboardHeaderProps} />
      <Title title={getLabelByType(activeConfiguration.dataSource)} />
      <ViewTrackingMeta
        data={{
          productArea: productAreaTrackingNames[activeConfiguration.productArea as never],
          pageRootName: t('in-analyze:components.analyzeHeader.analytics')
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
