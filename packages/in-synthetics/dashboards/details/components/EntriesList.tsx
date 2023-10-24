/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Dispatch, Fragment, SetStateAction } from 'react';

import { SvgIcon, toInteractiveElement } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { t } from '@instana/i18n-react';

import { bytesZeroDecimalPlaces, millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import BrowserTimeline from 'in-synthetics/dashboards/details/components/browser/BrowserTimeline';
import KeyValueHeader from 'in-synthetics/dashboards/details/components/KeyValueHeader';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import Entry from 'in-synthetics/dashboards/details/components/Entry';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import { TestResultEntry } from 'in-synthetics/utils/constants';

import locals from 'in-synthetics/dashboards/details/components/EntriesList.mless';

interface EntriesListProps {
  earliestTimestamp: number;
  endTimestamp: number;
  filteredEntries: TestResultEntry[];
  pages: { [index: string]: any };
  pageRefExpanded: string;
  setPageRefExpanded: Dispatch<SetStateAction<string>>;
}

export default function EntriesList({
  earliestTimestamp,
  endTimestamp,
  filteredEntries,
  pages,
  pageRefExpanded,
  setPageRefExpanded
}: EntriesListProps) {
  const render: JSX.Element[] = [];
  const groupByPageRef = filteredEntries?.reduce((group: any, entry: TestResultEntry) => {
    const { pageref } = entry;
    group[pageref] = group[pageref] ?? [];
    group[pageref].push(entry);
    return group;
  }, {});

  if (filteredEntries?.length === 0) {
    return (
      <NoDataAvailable
        type="lib_synthetic"
        height={160}
        text={t('in-synthetics:dashboard.detailsPage.noDataAvailable.message', { component: 'Timeline' })}
      />
    );
  }

  pages.forEach((value: any, key: string) => {
    render.push(
      <EntryByPage
        key={key}
        earliestTimestamp={earliestTimestamp}
        endTimestamp={endTimestamp}
        filteredEntries={groupByPageRef[key] != undefined ? groupByPageRef[key] : []}
        id={key}
        pageRefExpanded={pageRefExpanded}
        setPageRefExpanded={setPageRefExpanded}
        values={value}
      />
    );
  });

  return <>{render}</>;
}

interface EntryByPageProps {
  earliestTimestamp: number;
  endTimestamp: number;
  filteredEntries: TestResultEntry[];
  id: string;
  pageRefExpanded: string;
  setPageRefExpanded: Dispatch<SetStateAction<string>>;
  values: { [index: string]: any };
}

const EntryByPage = ({
  earliestTimestamp,
  endTimestamp,
  filteredEntries,
  id,
  pageRefExpanded,
  setPageRefExpanded,
  values
}: EntryByPageProps) => {
  const { width, ref } = useResizeObserverCustom<HTMLDivElement>();
  return (
    <div
      {...toInteractiveElement({
        ariaLabel: pageRefExpanded
          ? t('in-synthetics:dashboard.detailsPage.showLessSubDetails')
          : t('in-synthetics:dashboard.detailsPage.showMoreSubDetails'),
        onDefaultInteraction: () =>
          setPageRefExpanded((prev: string) => {
            return prev === id ? '' : id;
          })
      })}
    >
      <div>
        <div className={locals.groupFirstRow}>
          <div ref={ref} className={locals.leftContent}>
            <SvgIcon type="lib_document" size="s" />
            <Fragment>
              <KeyValueHeader
                value={values.url || t('in-synthetics:dashboard.detailsPage.noDataAvailable.notFound')}
                content={values.url || t('in-synthetics:dashboard.detailsPage.noDataAvailable.notFound')}
              />
              <KeyValueHeader
                label={t('in-synthetics:dashboard.detailsPage.browserDetails.page.request')}
                value={filteredEntries.length}
              />
              <KeyValueHeader
                label={t('in-synthetics:dashboard.detailsPage.browserDetails.page.size')}
                value={`${bytesZeroDecimalPlaces(values.totalResponseSize)}`}
              />
              <KeyValueHeader
                label={t('in-synthetics:dashboard.detailsPage.browserDetails.page.time')}
                value={`${millisToTwoDecimalSeconds(values.totalTime)}`}
              />
              {filteredEntries?.length >= 0 && (
                <BrowserTimeline
                  width={(width || 1500) / 2}
                  entriesToRender={filteredEntries}
                  earliestTimestamp={earliestTimestamp}
                  endTimestamp={endTimestamp}
                />
              )}
            </Fragment>
          </div>
          <div className={locals.rightContent}>
            <SvgIcon type={pageRefExpanded === id ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} size="s" />
          </div>
        </div>
        {pageRefExpanded === id && (
          <div className={locals.entries}>
            {filteredEntries.map((entry: TestResultEntry) => (
              <Entry
                key={generateUniqueShortId()}
                entry={entry}
                earliestTimestamp={earliestTimestamp}
                endTimestamp={endTimestamp}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
