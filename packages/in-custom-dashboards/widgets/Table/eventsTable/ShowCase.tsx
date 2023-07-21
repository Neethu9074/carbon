/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';

import { RawEvent, TimeConfig } from '@instana/types';

import { TablePresenter } from 'in-custom-dashboards/widgets/Table/eventsTable/TablePresenter';
import { t } from 'in-i18n';

import locals from './ShowCase.mless';

export interface ShowcaseProps extends Partial<RawEvent> {}

const timeConfig: TimeConfig = {
  windowSize: 3600000,
  autoRefresh: false
};

const data: ShowcaseProps[] = [
  {
    end: 1689067312312,
    entityLabel: 'shop-ratings',
    entityTimestamp: 1689066600000,
    entityType: 'Service20',
    id: '1',
    plugin: 'service',
    severity: 10,
    smartAlert: true,
    start: 1689066982312,
    state: 'open',
    title: 'Erroneous call rate for shop-ratings is high',
    type: 'incident'
  },
  {
    end: 1689064995000,
    entityLabel: 'nginx-web',
    entityTimestamp: 1689062510000,
    entityType: 'Service20',
    id: '2',
    plugin: 'service',
    severity: 5,
    smartAlert: false,
    start: 1689064310000,
    state: 'closed',
    title: 'Sudden increase in latency for a fraction of requests',
    type: 'incident'
  },
  {
    end: 1689064995000,
    entityLabel: 'k8s-demo',
    entityTimestamp: 1689060886000,
    entityType: 'App20',
    plugin: 'application',
    severity: 5,
    smartAlert: false,
    start: 1689060916000,
    state: 'open',
    title: 'All Calls of k8s-demo > 88',
    type: 'incident',
    id: '3'
  },
  {
    end: 1689061036318,
    entityLabel: 'nginx-web',
    entityTimestamp: 1689060633000,
    entityType: 'Entity10',
    plugin: 'service',
    severity: 10,
    smartAlert: false,
    start: 1689060701412,
    state: 'closed',
    title: 'Sudden drop in the number of requests',
    type: 'incident',
    id: '4'
  },
  {
    end: 1689061036318,
    entityLabel: 'instana-core/butler',
    entityTimestamp: 1689060633000,
    entityType: 'Entity10',
    plugin: 'service',
    severity: 10,
    smartAlert: false,
    start: 1689060701412,
    state: 'open',
    title: 'Pod failure',
    type: 'incident',
    id: '5'
  },
  {
    end: 1689061036318,
    entityLabel: 'eum-sim',
    entityTimestamp: 1689060633000,
    entityType: 'Entity10',
    plugin: 'service',
    severity: 10,
    smartAlert: false,
    start: 1689060701412,
    state: 'closed',
    title: 'Sudden increase in latency for a fraction of requests',
    type: 'incident',
    id: '6'
  },
  {
    end: 1689061036318,
    entityLabel: 'shop-ratings',
    entityTimestamp: 1689060633000,
    entityType: 'Entity10',
    plugin: 'service',
    severity: 10,
    smartAlert: false,
    start: 1689060701412,
    state: 'open',
    title: 'Erroneous call rate for shop-ratings is high',
    type: 'incident',
    id: '7'
  },
  {
    end: 1689061036318,
    entityLabel: 'outport1.fyre.ibm.com',
    entityTimestamp: 1689060633000,
    entityType: 'Entity10',
    plugin: 'host',
    severity: 10,
    smartAlert: false,
    start: 1689060701412,
    state: 'closed',
    title: 'You will run out of disk space in about 59 minutes',
    type: 'incident',
    id: '8'
  }
];

const rowsPerPage = 3;

export default function ShowCase() {
  const [lastIndex, setLastIndex] = useState(rowsPerPage);
  const [rawEventList, setRawEventList] = useState(data.slice(0, rowsPerPage));
  const [canLoadMore, setCanLoadMore] = useState(true);

  useEffect(() => {
    if (rawEventList.length === data.length) {
      setCanLoadMore(false);
    }
  }, [rawEventList]);

  function loadMoreShowcaseData() {
    setLastIndex(lastIndex + rowsPerPage);
    setRawEventList(data.slice(0, lastIndex + rowsPerPage));
  }

  return (
    <div className={locals.wrapper}>
      <TablePresenter
        title={t('in-custom-dashboards:widgets.table.index.tablePreview')}
        rawEventList={rawEventList}
        headers={['title', 'entityLabel', 'started']}
        timeConfig={timeConfig}
        isPreview
        loadMoreShowcaseData={() => loadMoreShowcaseData()}
        canLoadMore={canLoadMore}
      />
    </div>
  );
}
