/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Dispatch, Fragment, SetStateAction } from 'react';

import { SvgIcon, toInteractiveElement } from '@instana/components';
import { t } from '@instana/i18n-react';

import { bytesZeroDecimalPlaces, millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import KeyValueHeader from 'in-synthetics/dashboards/details/components/KeyValueHeader';
import Entry from 'in-synthetics/dashboards/details/components/Entry';
import { TestResultEntry } from 'in-synthetics/utils/constants';

import locals from 'in-synthetics/dashboards/details/components/EntriesList.mless';

interface EntriesListProps {
  entries: TestResultEntry[];
  pages: { [index: string]: any };
  expanded: string;
  setExpanded: Dispatch<SetStateAction<string>>;
}

export default function EntriesList({ entries, pages, expanded, setExpanded }: EntriesListProps) {
  const render: JSX.Element[] = [];
  const groupByPageRef = entries.reduce((group: any, entry: TestResultEntry) => {
    const { pageref } = entry;
    group[pageref] = group[pageref] ?? [];
    group[pageref].push(entry);
    return group;
  }, {});

  if (entries.length !== 0) {
    pages.forEach((value: any, key: string) => {
      render.push(
        <EntryByPage
          key={key}
          entries={groupByPageRef[key] != undefined ? groupByPageRef[key] : []}
          id={key}
          expanded={expanded}
          setExpanded={setExpanded}
          values={value}
        />
      );
    });
  }

  return <>{render}</>;
}

interface EntryByPageProps {
  entries: TestResultEntry[];
  id: string;
  expanded: string;
  setExpanded: Dispatch<SetStateAction<string>>;
  values: { [index: string]: any };
}

function EntryByPage({ entries, id, expanded, setExpanded, values }: EntryByPageProps) {
  return (
    <div className={locals.group}>
      <div
        className={locals.header}
        {...toInteractiveElement({
          ariaLabel: expanded
            ? t('in-synthetics:dashboard.detailsPage.showLessSubDetails')
            : t('in-synthetics:dashboard.detailsPage.showMoreSubDetails'),
          onDefaultInteraction: () =>
            setExpanded((prev: string) => {
              return prev === id ? '' : id;
            })
        })}
      >
        <div className={locals.left}>
          <SvgIcon type="lib_document" size="s" />
          <Fragment>
            <KeyValueHeader
              value={values.url || t('in-synthetics:dashboard.detailsPage.noDataAvailable.notFound')}
              content={values.url || t('in-synthetics:dashboard.detailsPage.noDataAvailable.notFound')}
            />
            <KeyValueHeader
              label={t('in-synthetics:dashboard.detailsPage.browserDetails.page.request')}
              value={entries.length}
            />
            <KeyValueHeader
              label={t('in-synthetics:dashboard.detailsPage.browserDetails.page.size')}
              value={`${bytesZeroDecimalPlaces(values.totalResponseSize)}`}
            />
            <KeyValueHeader
              label={t('in-synthetics:dashboard.detailsPage.browserDetails.page.time')}
              value={`${millisToTwoDecimalSeconds(values.totalTime)}`}
            />
          </Fragment>
        </div>
        <div className={locals.right}>
          <SvgIcon type={expanded === id ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} size="s" />
        </div>
      </div>
      {expanded === id && (
        <div className={locals.entries}>
          {entries.map((entry: TestResultEntry, i: number) => (
            <Entry key={i} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
