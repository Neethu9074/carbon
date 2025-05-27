/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';
import { get } from 'lodash';

import { MenuButton, MenuItem } from '@instana/carbon';
import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  dashboardAlertsFullyQualified,
  syntheticResultsListPath,
  syntheticsDashboard,
  syntheticsSummaryPath
} from 'in-synthetics/navigation/paths';
import {
  clickSyntheticMonitoringConfigurationTabTracker,
  clickSyntheticMonitoringResultsTabTracker
} from 'in-synthetics/tracking/tracker';
import { TestResponse, dummyTest, dataScopes, DataScopeType } from 'in-synthetics/utils/constants';
import { smartAlertCarbonTableEnabled, syntheticRunNowEnabled } from 'in-services/featureFlags';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import DashboardHeader, { DashboardHeaderProps } from 'in-components/DashboardHeader';
import { showUpdateErrorMessage } from 'in-synthetics/createTests/utils/userFeedback';
import CreateSmartAlert from 'in-alerting/smart-alerts/synthetics/CreateSmartAlert';
import deserializeErrorMessage from 'in-synthetics/utils/deserializeErrorMessage';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import getSyntheticTest from 'in-synthetics/subscriptions/getSyntheticTest';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import hasEmptyStrings from 'in-synthetics/utils/hasEmptyStrings';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import tabs from 'in-synthetics/dashboards/summary/tabs/index';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { getTest, updateTest } from 'in-synthetics/api';
import { Location } from 'in-stores/navigation/types';
import Footer from 'in-components/Footer';
import { SyntheticTest } from 'in-types';
import { role } from 'in-stores/user';

import locals from './SyntheticSummary.mless';

const SyntheticSummaryDashboard = () => {
  const { trackCta } = useSegmentTracking();
  const location: Location = useLocation();
  const testId: string = getMatrixParameter(location, syntheticsDashboard, 'testId') ?? '';
  const runType: string = getMatrixParameter(location, syntheticsDashboard, 'runType') ?? '';
  const [count, setReloadCount] = useState(0);
  const [dataScope, setDataScope] = useState(dataScopes.find(dataScope => dataScope.value === runType));
  const test: TestResponse = useObservable<any, [number]>(() => getTest(testId), [count]) || dummyTest;
  const hideButtonInAlertsTab = smartAlertCarbonTableEnabled
    ? location.pathname !== dashboardAlertsFullyQualified
    : true;
  const showDatascopeDropdown =
    syntheticRunNowEnabled && [syntheticsSummaryPath, syntheticResultsListPath].includes(location.pathname);
  const props = {
    testId,
    location,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/')),
    test,
    setReloadCount,
    dataScope,
    setDataScope,
    showDatascopeDropdown,
    viewPath: syntheticsDashboard
  };

  function trackSyntheticTabChange(tab: string) {
    switch (tab) {
      case t('in-synthetics:dashboard.summary.resultsTab'):
        clickSyntheticMonitoringResultsTabTracker(trackCta);
        break;
      case t('in-synthetics:dashboard.summary.configurationTab'):
        clickSyntheticMonitoringConfigurationTabTracker(trackCta);
        break;
    }
  }

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.synthetic_monitoring,
          pageRootName: pageNames.synthetic_test,
          pagePath: location?.pathname
        }}
      />

      <TabView
        HeaderComponent={Header}
        location={location}
        // @ts-expect-error
        tabs={tabs}
        props={props}
        result$={getSyntheticTest({ testId: testId })}
        withProps={result => ({
          testName: get(result, ['data', 'label'])
        })}
        tabChangeTracker={props => trackSyntheticTabChange(props.tab)}
      />
      <Footer />
      {role?.canConfigureGlobalSyntheticSmartAlerts && hideButtonInAlertsTab && (
        <FloatingActionButtons>
          <CreateSmartAlert testId={testId} />
        </FloatingActionButtons>
      )}
    </>
  );
};

const Header = (
  props: Omit<DashboardHeaderProps, 'icon' | 'title' | 'label' | 'renderButtonLine' | 'renderMetaInformation'>
) => {
  return (
    <DashboardHeader
      {...props}
      icon={'lib_synthetic'}
      title={t('in-synthetics:dashboard.testList.mainLabel')}
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={role?.canConfigureSyntheticTests ? RenderButtonLine : undefined}
      renderButtonLineSecondary={({ setDataScope, dataScope, showDatascopeDropdown }: RenderButtonLineSecondaryProps) =>
        showDatascopeDropdown && (
          <MenuButton
            id="runType"
            kind="tertiary"
            size="sm"
            menuAlignment="bottom-end"
            label={t('in-synthetics:dashboard.testList.options.dashboardHeaderLabel', {
              dataScopeLabel: dataScope.label
            })}
          >
            {dataScopes.map(item => (
              <MenuItem
                key={item.value}
                label={item.label}
                onClick={() => {
                  setDataScope(item);
                }}
              />
            ))}
          </MenuButton>
        )
      }
      renderMetaInformation={RenderMetaInformation}
    />
  );
};

interface RenderButtonLineSecondaryProps {
  setDataScope: React.Dispatch<React.SetStateAction<DataScopeType>>;
  dataScope: DataScopeType;
  showDatascopeDropdown: boolean;
}
interface RenderMetaInformationProps {
  test: TestResponse;
}

const RenderMetaInformation = ({ test }: RenderMetaInformationProps) => {
  const isActive: boolean = test.data?.active;
  const errorCode: string = get(test.errors?.at(0), ['code']) || '';

  return errorCode === 'NOT_FOUND' ? (
    <div className={locals.metaInformation}>
      <span className={locals.label}>{t('in-synthetics:dashboard.testList.deleted')}</span>
    </div>
  ) : (
    <div className={locals.metaInformation}>
      <span className={locals.label}>
        {isActive ? t('in-synthetics:dashboard.testList.active') : t('in-synthetics:dashboard.testList.paused')}
      </span>
    </div>
  );
};

interface RenderButtonLineProps {
  test: TestResponse;
  setReloadCount: React.Dispatch<React.SetStateAction<number>>;
}

const RenderButtonLine = ({ test, setReloadCount }: RenderButtonLineProps) => {
  const isActive: boolean = test.data?.active;
  const errorCode: string = get(test.errors?.at(0), ['code']) || '';
  const totalLocations: number = test.data?.locations?.length ?? 0;

  const pauseOrResume = (data: SyntheticTest) => {
    const { active, customProperties, configuration } = data;
    const syntheticType: string = configuration.syntheticType;
    let updatedConfiguration = configuration;

    if (syntheticType === 'HTTPAction') {
      updatedConfiguration = {
        ...configuration,
        // @ts-expect-error headers property can be available for some test types
        headers: hasEmptyStrings(configuration?.headers) ? {} : configuration.headers
      };
    }

    const testConfig: SyntheticTest = {
      ...data,
      active: !active,
      customProperties: hasEmptyStrings(customProperties || {}) ? {} : customProperties,
      configuration: updatedConfiguration
    };

    updateTest(testConfig).once(
      () => {
        setReloadCount(count => ++count);
      },
      error => {
        showUpdateErrorMessage(deserializeErrorMessage(error.message));
      }
    );
  };

  return errorCode === 'NOT_FOUND' ? (
    <Button kind="primary" disabled icon={'lib_actions_delete'}>
      {' '}
      {t('in-synthetics:dashboard.testList.deleted')}
    </Button>
  ) : (
    //If a test has no location(s) associated with it, disable Pause/Resume button
    <Button
      kind="primary"
      icon={isActive ? 'lib_actions_pause' : 'lib_actions_play'}
      onClick={() => pauseOrResume(test.data)}
      disabled={totalLocations <= 0}
    >
      {isActive ? t('in-synthetics:dashboard.testList.pause') : t('in-synthetics:dashboard.testList.resume')}
    </Button>
  );
};

export default SyntheticSummaryDashboard;
