/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import { TimeConfig } from '@instana/types';
import { t } from '@instana/i18n-react';

import { genAiObservability, llmMetricsMonitoring, tracesMonitoring } from 'in-gen-ai-observability/navigation/paths';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import AnalyzeGenAiCallsButton from 'in-gen-ai-observability/components/AnalyzeGenAiCallsButton';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DashboardHeader from 'in-components/DashboardHeader';
import Sticky from 'in-components/Sticky';

interface MonitoringProps {
  timeConfig: TimeConfig;
  children?: React.ReactNode;
}

export default function ViewSwitcher({ timeConfig, children }: MonitoringProps) {
  const { createHrefToPath, matchLocation } = useNavigation();

  return (
    <Sticky
      header={
        <section>
          <DashboardHeader
            {...timeConfig}
            icon="lib_infra_ai"
            label={t('in-components:mainNavigation.viewSwitcherLabelGenAiObservability')}
            title={t('in-components:mainNavigation.viewSwitcherLabelGenAiObservability')}
            labelForTitle={t('in-components:mainNavigation.viewSwitcherLabelGenAiObservability')}
            renderButtonLine={() => <AnalyzeGenAiCallsButton />}
            isBeta
          />

          <DashboardHeaderModule>
            <SecondLevelNavigation>
              <SecondLevelNavigationItem
                href={createHrefToPath(llmMetricsMonitoring)}
                label={t('in-gen-ai-observability:mainDashboard.llm')}
                isActive={
                  matchLocation(llmMetricsMonitoring) ||
                  (matchLocation(genAiObservability) && !matchLocation(tracesMonitoring))
                }
              />
            </SecondLevelNavigation>
          </DashboardHeaderModule>
          <DashboardHeaderShadowModule />
        </section>
      }
    >
      {children}
    </Sticky>
  );
}
