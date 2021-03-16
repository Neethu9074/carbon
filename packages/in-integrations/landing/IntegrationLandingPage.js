/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withProps } from 'recompose';
import React, { Fragment } from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import HeaderWithTimeSelection from 'in-new-components/time/TimeSelection/HeaderWithTimeSelection';
import IntegrationDashboardList from 'in-integrations/landing/IntegrationDashboardList';
import { landingConfigUrlParameter } from 'in-integrations/navigation/matrix';
import getReferences from 'in-integrations/subscriptions/getReferences';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { setTimeConfig } from 'in-stores/time/config';
import withUrlState from 'in-hoc/withUrlState';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default compose(
  withUrlState({
    bind: [landingConfigUrlParameter]
  }),
  withProps(({ config }) => ({
    flattenedConfig: ensureAllValuesAreStrings(config)
  })),
  connectTo(({ flattenedConfig }) => ({
    references: getReferences({ config: flattenedConfig })
      .filter(result => result.data)
      .map(result => result.data)
  }))
)(IntegrationLandingPage);

function IntegrationLandingPage({ flattenedConfig, references }) {
  let infrastructureSnapshots = null;
  if (references) {
    if (references.timeConfig && references.timeConfig.size > 0) {
      setTimeConfig(references.timeConfig);
    }
    if (references.infrastructureEntities) {
      infrastructureSnapshots = references.infrastructureEntities;
    }
  }

  return (
    <Fragment>
      <HeaderWithTimeSelection>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem isActive icon="lib_actions_search" label={t('in-integrations:landing.results')} />
        </SecondLevelNavigation>
      </HeaderWithTimeSelection>
      <LeftRightPadding>
        <IntegrationDashboardList entities={infrastructureSnapshots} query={parseQueryConfig(flattenedConfig)} />
      </LeftRightPadding>
    </Fragment>
  );
}

function parseQueryConfig(flattenedConfig) {
  return Object.keys(flattenedConfig)
    .filter(key => key !== 'timestamp' && key !== '@timestamp' && key !== 'time')
    .map(key => key + '=' + flattenedConfig[key])
    .join(' and ');
}

function ensureAllValuesAreStrings(config) {
  if (!config) {
    return {};
  }
  config = flattenObject(config);

  return Object.keys(config).reduce((copy, key) => {
    copy[key] = String(config[key]);
    return copy;
  }, {});
}

const flattenObject = (obj, prefix = '') =>
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (obj[k] && typeof obj[k] === 'object') Object.assign(acc, flattenObject(obj[k], pre + k));
    else acc[pre + k] = obj[k];
    return acc;
  }, {});
