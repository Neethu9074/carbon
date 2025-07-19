/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  businessImpactFullyQualified,
  businessConversionGoalsFullyQualified,
  websiteMonitoringPath
} from 'in-websites/navigation/paths';
// @ts-expect-error needs migration to TS
import StickySidebarNavigationAndContent from 'in-components/layout/SideNavigationAndContent';
import ConversionGoals from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/ConversionGoals';
import { websitesBusinessConversionGoalsEnabled } from 'in-services/featureFlags';
import Summary from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/Summary';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface BusinessMonitoringProps {
  websiteId: string;
  timeConfig: TimeConfig;
  tagFilters: any;
}

export default function BusinessImpact(props: BusinessMonitoringProps) {
  return (
    <StickySidebarNavigationAndContent
      navigationTree={[
        {
          pages: [
            {
              label: t('in-websites:websiteDashboard.tabs.businessMonitoring.summaryTab'),
              path: businessImpactFullyQualified,
              component: () => <Summary {...props} />
            },
            websitesBusinessConversionGoalsEnabled && {
              label: t('in-websites:websiteDashboard.tabs.businessMonitoring.conversionGoalsTab'),
              path: businessConversionGoalsFullyQualified,
              component: () => <ConversionGoals {...props} />
            }
          ]
        }
      ]}
      redirectToDefaultPage={businessImpactFullyQualified}
      redirectFrom={websiteMonitoringPath}
      {...props}
    />
  );
}
