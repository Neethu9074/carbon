/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';
import { Card } from '@instana/components';

import { urlStateDefinition, sortOptions } from 'in-kubernetes/Dashboards/CronJob/Jobs/utils';
import SortingConfigurator from 'in-components/SortingConfigurator/SortingConfigurator';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { JobList } from 'in-kubernetes/Dashboards/CronJob/JobList';
import SearchInput from 'in-components/SearchInput';
import useUrlState from 'in-hooks/useUrlState';

import locals from 'in-kubernetes/Dashboards/CronJob/Jobs/Jobs.mless';

export default function Jobs(props: any) {
  // There are two loading related boolean variables here: isLoading and isInitialLoading.
  // where as isInitialLoading is only True when data is loaded for the first time
  // isLoading is true when data is loaded for the first time and when MORE data is loading
  // Here UL is returned if there is previously loaded data otherwise LoadingIndicator is returned
  const [{ orderBy, orderDirection, page, query }, setUrlState] = useUrlState(urlStateDefinition) as any;
  return (
    <Card>
      <Stack>
        <HorizontalFlexWrapper className={locals.header}>
          <div>
            <SortingConfigurator
              options={sortOptions}
              orderBy={{
                by: orderBy,
                direction: orderDirection
              }}
              onChange={({ by, direction }) =>
                setUrlState({
                  orderBy: by,
                  orderDirection: direction
                })
              }
            />
          </div>
          <SearchInput
            inputClassName={locals.searchInput}
            query={query}
            onChange={updatedQuery => setUrlState({ query: updatedQuery, page: 1 })}
          />
        </HorizontalFlexWrapper>
        <JobList {...props} page={page} query={query} orderBy={orderBy} orderDirection={orderDirection} />
      </Stack>
    </Card>
  );
}
