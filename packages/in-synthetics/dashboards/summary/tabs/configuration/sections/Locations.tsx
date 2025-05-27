/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Result, SyntheticLocation, SyntheticTest } from '@instana/types/typeDefinitions';
import { t } from '@instana/i18n-react';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
// eslint-disable-next-line no-restricted-imports
import List from 'in-settings/components/List';
import { columnDefinitions } from 'in-synthetics/createTests/advanced/LocationsSection';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { getLocationsAsResultObservable } from 'in-synthetics/api';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

interface Props {
  test: SyntheticTest;
}

const LocationSection = ({ test }: Props) => {
  const EMPTY = [] as SyntheticLocation[];
  const locationsByTest = test.locations;

  const locations = getLocationsAsResultObservable('')
    .map((result: Result<SyntheticLocation[]> | null) => {
      if (result == null) {
        return EMPTY;
      }
      return result?.data?.filter(Boolean)?.filter(location => locationsByTest.includes(location.id ?? ''));
    })
    .map(result => result ?? EMPTY);

  return (
    <ExpandableLightCard
      className={locals.expandableCard}
      title={t('in-synthetics:dashboard.configuration.locationsTitle')}
      darkFrame
      useMaxAvailableHeight
      bodyWithoutPadding
      openByDefault
    >
      <List<SyntheticLocation>
        title={null}
        loadEntities={() => locations}
        columnDefinitions={columnDefinitions()}
        getHeader={() => null}
        isSearchable={false}
        rightHeader={null}
        renderNoDataAvailable={() => (
          <NoDataAvailable
            type="lib_synthetic"
            height={160}
            text={t('in-synthetics:dashboard.locationList.noDataAvailable.message', { component: 'Locations' })}
          />
        )}
      />
    </ExpandableLightCard>
  );
};

export default LocationSection;
