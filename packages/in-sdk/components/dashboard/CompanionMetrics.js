/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { combineLatest } from '@instana/observables';

import CustomMetricsV2, { DEFAULT_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import { getCustomMetricsSpecs } from 'in-sdk/snapshot/snapshot';
import { toTitleCase } from 'in-services/util/string';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => {
    return {
      companions: props.companions$
        .flatMap(companionIds => {
          const companions$ = companionIds.toArray().map(snapshotId => getSnapshot(snapshotId));
          return combineLatest(companions$, false);
        })
        .map(companions => companions.filter(Boolean))
    };
  },
  function CompanionMetrics({ companions, timeConfig }) {
    if (!companions) {
      return null;
    }

    const resolveTitlePrefix = companion => {
      const plugin = companion.get('plugin');
      return t(`in-forge:pluginName_${plugin}`) ?? toTitleCase(companion.get('data')?.get('kind'));
    };

    return (
      <>
        {companions.map(companion => (
          <CustomMetricsV2
            key={companion.get('id')}
            snapshot={companion}
            timeConfig={timeConfig}
            specs={getCustomMetricsSpecs(companion.get('plugin')) ?? DEFAULT_SPECS}
            titlePrefix={resolveTitlePrefix(companion)}
          />
        ))}
      </>
    );
  }
);
