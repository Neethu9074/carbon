/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import { datasourceInstanaAgentPath, datasourceOtelCollectorPath } from 'in-plg/navigation/paths';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DashboardHeader from 'in-components/DashboardHeader';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

export default function DatasourceHeader() {
  const { createHrefToPath, matchLocation } = useNavigation();

  return (
    <Sticky
      header={
        <>
          <DashboardHeader
            icon="lib_datasource"
            label={t('in-plg:datasources.datasources')}
            title={t('in-plg:datasources.datasources')}
          />
          <>
            <DashboardHeaderModule>
              <SecondLevelNavigation>
                <SecondLevelNavigationItem
                  href={createHrefToPath(datasourceInstanaAgentPath)}
                  label={t('in-plg:datasources.instanaAgents')}
                  isActive={matchLocation(datasourceInstanaAgentPath)}
                />
                <SecondLevelNavigationItem
                  href={createHrefToPath(datasourceOtelCollectorPath)}
                  label={t('in-plg:datasources.openTelemetryCollectors')}
                  isActive={matchLocation(datasourceOtelCollectorPath)}
                />
              </SecondLevelNavigation>
            </DashboardHeaderModule>
            <DashboardHeaderShadowModule />
          </>
        </>
      }
    />
  );
}
