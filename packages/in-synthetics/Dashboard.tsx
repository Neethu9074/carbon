/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { Card, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';

// @ts-expect-error Module needs to be translated to TS
import DashboardHeader from 'in-components/DashboardHeader';
import SortingConfigurator, { SortOrderBy } from 'in-components/SortingConfigurator/SortingConfigurator';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
// @ts-expect-error Module needs to be translated to TS
import Sticky from 'in-components/Sticky';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import TestConfigDialogPresenter from 'in-synthetics/components/TestConfigDialogPresenter';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { UrlState, urlStateDefinition } from 'in-synthetics/utils/constants';
import FloatingActionButton from 'in-components/FloatingActionButton';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { compareIgnoreCase } from 'in-services/util/string';
import { dummyTests } from 'in-synthetics/utils/constants';
import { deepFreeze } from 'in-services/util/object';
import SearchInput from 'in-components/SearchInput';
import { TestsResponse } from 'in-synthetics/Tests';
import { compare } from 'in-services/util/number';
import Pagination from 'in-components/Pagination';
import useUrlState from 'in-hooks/useUrlState';
import { getTests } from 'in-synthetics/api';
import Footer from 'in-components/Footer';
import { SyntheticTest } from 'in-types';
import Tests from 'in-synthetics/Tests';
import { t } from 'in-i18n';

import locals from './Dashboard.mless';

export const sortOptions = deepFreeze([
  { label: t('in-synthetics:dashboard.sortOptions.name'), value: 'name' },
  { label: t('in-synthetics:dashboard.sortOptions.frequency'), value: 'frequency' }
]);

const header = (
  <>
    <DashboardHeader
      icon="lib_infra_ibmCos"
      label={t('in-synthetics:dashboard.testList.mainLabel')}
      title={t('in-synthetics:dashboard.testList.mainLabel')}
    />
    <DashboardHeaderShadowModule />
  </>
);

const pageSize = 15;

export default function Dashboard() {
  const [{ page, orderBy, orderDirection, query }, setState] = useUrlState<UrlState>(urlStateDefinition);
  const [reloadCount, setReloadCount] = useState(0);
  const { data = [], progress }: TestsResponse =
    useObservable<any, [number]>(() => getTests(), [reloadCount]) || dummyTests;
  const offset = (page - 1) * pageSize;
  const until = offset + pageSize;

  function reloadTests() {
    setReloadCount(count => ++count);
  }

  function onAddWidget() {
    addActiveDialog(
      <TestConfigDialogPresenter
        onClose={() => {
          close();
        }}
        reloadTests={reloadTests}
      />
    );
  }

  return (
    <Sticky header={header}>
      <LeftRightPadding>
        <ViewTrackingMeta
          data={{
            productArea: 'EUM: Sythetics',
            pageRootName: 'Synthetics'
          }}
        />
        <Card hasMarginBottom>
          <Stack>
            <HorizontalFlexWrapper className={locals.listHeader}>
              <HorizontalFlexWrapper>
                <div className={locals.sortingConfiguratorWrapper}>
                  <SortingConfigurator
                    options={sortOptions}
                    orderBy={{
                      by: orderBy,
                      direction: orderDirection as SortOrderBy
                    }}
                    onChange={({ by, direction }: any) => {
                      setState({
                        orderBy: by,
                        orderDirection: direction
                      });
                    }}
                  />
                </div>
                <SearchInput
                  query={query}
                  onChange={(updatedQuery: string) => setState({ query: updatedQuery, page: 1 })}
                />
              </HorizontalFlexWrapper>
            </HorizontalFlexWrapper>
            <Tests
              tests={[...getSearchedTests(data, query)].sort(sortBy(orderBy, orderDirection)).slice(offset, until)}
              isLoading={progress.loading}
              reloadTests={reloadTests}
            />
            <Pagination
              currentPage={page}
              numPages={Math.ceil(data.length / pageSize)}
              onChange={(newPage: number) => setState({ page: newPage })}
            />
          </Stack>
        </Card>
      </LeftRightPadding>
      <Footer />

      <FloatingActionButtons>
        <FloatingActionButton onClick={onAddWidget} withBoxShadow icon="lib_line_chart">
          {t('in-synthetics:createTest.buttonLabel')}
        </FloatingActionButton>
      </FloatingActionButtons>
    </Sticky>
  );
}

function sortBy(orderBy: string, orderDirection: string): (a: SyntheticTest, b: SyntheticTest) => -1 | 0 | 1 {
  return (a: SyntheticTest, b: SyntheticTest) => {
    if (orderBy === 'name') {
      return orderDirection === 'ASC' ? compareIgnoreCase(a.label, b.label) : compareIgnoreCase(b.label, a.label);
    }
    if (orderBy === 'frequency') {
      return orderDirection === 'ASC'
        ? compare(a.testFrequency, b.testFrequency)
        : compare(b.testFrequency, a.testFrequency);
    }
    return 1;
  };
}

function getTrimmedLowercase(word: string): string {
  return word.trim().toLowerCase();
}

function getSearchedTests(tests: SyntheticTest[], query: string): SyntheticTest[] {
  const searchQuery = getTrimmedLowercase(query);
  if (!searchQuery) return tests;
  return tests.filter(({ label, description = '' }) => {
    return (
      (getTrimmedLowercase(label).includes(searchQuery) || getTrimmedLowercase(description).includes(searchQuery)) ??
      false
    );
  });
}
