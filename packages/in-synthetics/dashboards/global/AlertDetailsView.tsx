/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { get } from 'lodash';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import AlertDetails, { AlertDetailsProps } from 'in-alerting/smart-alerts/synthetics/details/AlertDetails';
import { alertsTabDetailsFullyQualified, syntheticsDashboard } from 'in-synthetics/navigation/paths';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { dummyTest, TestResponse } from 'in-synthetics/utils/constants';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { productAreas } from 'in-services/tracking/productAreas';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { Location } from 'in-stores/navigation/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getTest } from 'in-synthetics/api';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

const AlertDetailsView = () => {
  const timeConfig = useTimeConfig();
  const { location } = useNavigation();
  const isDetailsMainPage = isMainPage(location);
  const testId: string = getMatrixParameter(location, syntheticsDashboard, 'testId') ?? '';
  const test: TestResponse = useObservable<any, [number]>(() => getTest(testId), [0]) || dummyTest;
  const props: AlertDetailsProps = {
    testId,
    test,
    location,
    timeConfig,
    isMainPage: isDetailsMainPage
  };

  const renderMainPage = () => {
    if (isDetailsMainPage) {
      return (
        <Sticky header={<ViewSwitcher />}>
          {test.progress.loading ? (
            <LoadingIndicator text={t('in-components:topListCard.loadingData')} height={160} size="xxxl" />
          ) : (
            <LeftRightPadding>
              <ViewTrackingMeta
                data={{
                  productArea: productAreas.synthetic_monitoring,
                  pageRootName: pageNames.global_alerts,
                  pagePath: location?.pathname
                }}
              />
              <AlertDetails {...props} />
            </LeftRightPadding>
          )}
          <Footer />
        </Sticky>
      );
    } else {
      return (
        <Sticky
          header={
            <>
              <DashboardHeader
                icon={'lib_synthetic'}
                title={t('in-synthetics:dashboard.testList.mainLabel')}
                label={get(test, ['data', 'label'])}
                withBorderBottom
              />
              <DashboardHeaderShadowModule />
            </>
          }
        >
          {test.progress.loading ? (
            <LoadingIndicator text={t('in-components:topListCard.loadingData')} height={160} size="xxxl" />
          ) : (
            <LeftRightPadding>
              <ViewTrackingMeta
                data={{
                  productArea: productAreas.synthetic_monitoring,
                  pageRootName: pageNames.local_alerts,
                  pagePath: location?.pathname
                }}
              />
              <AlertDetails {...props} />
            </LeftRightPadding>
          )}
          <Footer />
        </Sticky>
      );
    }
  };

  return renderMainPage();
};

const isMainPage = (location: Location) => {
  return location?.pathname === alertsTabDetailsFullyQualified;
};

export default AlertDetailsView;
