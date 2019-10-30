import React, { Fragment } from 'react';
import { compose } from 'recompose';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import HeaderWithTimeSelection from 'in-new-components/time/TimeSelection/HeaderWithTimeSelection';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import IntegrationDashboardList from 'in-integrations/landing/IntegrationDashboardList';
import { landingConfigUrlParameter } from 'in-integrations/navigation/matrix';
import getReferences from 'in-integrations/subscriptions/getReferences';
import { setTimeConfig } from 'in-stores/time/config';
import withUrlState from 'in-hoc/withUrlState';
import connectTo from 'in-hoc/connectTo';

export default compose(
  withUrlState({
    bind: [landingConfigUrlParameter]
  }),
  connectTo(({ config }) => ({
    references: getReferences({ config: ensureAllValuesAreStrings(config) })
      .filter(result => result.data)
      .map(result => result.data)
  }))
)(IntegrationLandingPage);

function IntegrationLandingPage({ config, references }) {
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
          <SecondLevelNavigationItem isActive icon="lib_actions_search" label="Results" />
        </SecondLevelNavigation>
      </HeaderWithTimeSelection>
      <MaxWidthFullscreenContainer>
        <IntegrationDashboardList entities={infrastructureSnapshots} query={parseQueryConfig(config)} />
      </MaxWidthFullscreenContainer>
    </Fragment>
  );
}

function parseQueryConfig(config) {
  return Object.keys(config)
    .filter(key => key !== 'timestamp')
    .map(key => key + '=' + config[key])
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
    if (typeof obj[k] === 'object') Object.assign(acc, flattenObject(obj[k], pre + k));
    else acc[pre + k] = obj[k];
    return acc;
  }, {});
