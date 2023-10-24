/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';
import { isEmpty } from 'lodash';

import { Card } from '@instana/components';
import { t } from '@instana/i18n-react';

import { defaultPage, ResultDetailsResponse, TestResultEntry, TestResultHARPage } from 'in-synthetics/utils/constants';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import EntriesList from 'in-synthetics/dashboards/details/components/EntriesList';
import Filter from 'in-synthetics/dashboards/details/components/Filter';
import { getFilterType } from 'in-synthetics/utils/browserFileTypes';

interface TimelineProps {
  details: ResultDetailsResponse;
  startTime: number;
  finishTime: number;
  isBrowserType: boolean;
}

export default function BrowserTestTimeline({ details, startTime, finishTime, isBrowserType }: TimelineProps) {
  const [filter, setFilter] = useState({ query: '', type: '' });
  const [pageRefExpanded, setPageRefExpanded] = useState(defaultPage);

  const { data } = details;

  /* Sometimes data property could be null or undefined. */
  if (data === undefined || data === null || isEmpty(data)) {
    return (
      <Card title={t('in-synthetics:dashboard.detailsPage.timeLineWidget')}>
        <NoDataAvailable
          type="lib_synthetic"
          height={160}
          text={t('in-synthetics:dashboard.detailsPage.noDataAvailable.message', { component: 'Timeline' })}
        />
      </Card>
    );
  }

  let filteredEntries: TestResultEntry[] = data?.har?.log.entries.filter((entry: TestResultEntry) => {
    const type: string = getFilterType(entry.response.content.type.toLowerCase()).toLowerCase();
    if (filter.type && !type.includes(filter.type.toLowerCase())) {
      return false;
    }
    if (
      filter.query.length >= 2 &&
      filter.query &&
      !entry.request.url.toLowerCase().includes(filter.query.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  let indexArr: string[] = [];
  filteredEntries?.forEach((entry: TestResultEntry) => {
    if (!indexArr.includes(entry.pageref)) indexArr.push(entry.pageref);
  });

  const pagesToMap = new Map(
    data?.har?.log.pages
      .filter((page: TestResultHARPage) => {
        if (!indexArr.includes(page.id)) {
          return false;
        }
        return true;
      })
      .map((page: TestResultHARPage) => [
        page.id,
        {
          url: page._url || '',
          totalTime: page.pageTimings.totalTime || 0,
          totalResponseSize: page.totalResponseSize || 0
        }
      ])
  );

  return (
    <Card title={t('in-synthetics:dashboard.detailsPage.timeLineWidget')}>
      <Filter setFilter={setFilter} filter={filter} isBrowserType={isBrowserType} />
      <EntriesList
        earliestTimestamp={startTime}
        endTimestamp={finishTime}
        filteredEntries={filteredEntries}
        pages={pagesToMap}
        pageRefExpanded={pageRefExpanded}
        setPageRefExpanded={setPageRefExpanded}
      />
    </Card>
  );
}
