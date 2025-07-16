/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  CarbonTabs as Tabs,
  CarbonTabList as TabList,
  CarbonTab as Tab,
  CarbonTabPanels as TabPanels,
  CarbonTabPanel as TabPanel,
  CarbonLayer as Layer
} from '@instana/components';
import { PaginatedResult, Result, TestResultListItem } from '@instana/types';
import { ProductiveCard } from '@instana/ibm-products';

import { DNSRecordTable } from 'in-synthetics/dashboards/details/components/DNSRecordTable';
import { parseIsmCustomMetrics } from 'in-synthetics/dashboards/details/utils';
import { t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/details/components/DNSTestDetails.mless';

export const DNSTestDetails = ({ resultList }: { resultList: Result<PaginatedResult<TestResultListItem>> }) => {
  const dnsCustomMetrics = resultList.data?.items[0]?.testResultCommonProperties?.ismDetails ?? {};
  const dnsQueryType = resultList.data?.items[0]?.testResultCommonProperties?.dnsQueryType;

  return (
    <ProductiveCard
      title={t('in-synthetics:dashboard.detailsPage.dns.title')}
      className={locals.dnsProperties}
      description={t('in-synthetics:dashboard.detailsPage.dns.description', { queryType: dnsQueryType })}
    >
      <Layer>
        <Tabs>
          <TabList contained aria-label="">
            {Object.keys(dnsCustomMetrics).map(recordType => {
              return <Tab key={recordType}>{recordType}</Tab>;
            })}
          </TabList>
          <TabPanels>
            {Object.keys(dnsCustomMetrics).map(recordType => {
              const parsedDNSCustomMetrics =
                dnsCustomMetrics[recordType] && typeof dnsCustomMetrics[recordType] === 'string'
                  ? parseIsmCustomMetrics(dnsCustomMetrics[recordType])
                  : undefined;
              return (
                parsedDNSCustomMetrics && (
                  <TabPanel key={recordType} title={recordType} data-testid={`${recordType}_tab`}>
                    <DNSRecordTable records={parsedDNSCustomMetrics} />
                  </TabPanel>
                )
              );
            })}
          </TabPanels>
        </Tabs>
      </Layer>
    </ProductiveCard>
  );
};
