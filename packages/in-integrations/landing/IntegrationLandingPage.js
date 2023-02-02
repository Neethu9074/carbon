/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import ContentWrapper from 'in-components/LocationAwareTabView/components/ContentWrapper';
import IntegrationDashboardList from 'in-integrations/landing/IntegrationDashboardList';
import { landingConfigUrlParameter } from 'in-integrations/navigation/matrix';
import getReferences from 'in-integrations/subscriptions/getReferences';
import TabView from 'in-components/LocationAwareTabView/TabView';
import DashboardHeader from 'in-components/DashboardHeader';
import { setTimeConfig } from 'in-stores/time/config';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

const tabs = [
  {
    label: t('in-integrations:landing.results'),
    icon: 'lib_actions_search',
    path: '/',
    component: Summary,
    noTopPadding: true
  }
];

export default function IntegrationLandingPage() {
  const urlStateDefinition = {
    bind: [landingConfigUrlParameter]
  };

  const [{ config }, setUrlState] = useUrlState(urlStateDefinition);

  const flattenedConfig = ensureAllValuesAreStrings(config, setUrlState);

  const references = useObservable(
    getReferences({ config: ensureAllValuesAreStrings(config, setUrlState) })
      .filter(result => result.data)
      .map(result => result.data),
    [config]
  );

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
    <TabView
      props={{
        entities: infrastructureSnapshots,
        query: parseQueryConfig(flattenedConfig)
      }}
      HeaderComponent={Header}
      tabs={tabs}
      withoutBreadcrumb
      withoutPadding
    />
  );
}

function Header() {
  return <DashboardHeader />;
}

function Summary({ entities, query }) {
  return (
    <ContentWrapper>
      <IntegrationDashboardList entities={entities} query={query} />
    </ContentWrapper>
  );
}

function parseQueryConfig(flattenedConfig) {
  return Object.keys(flattenedConfig)
    .filter(key => key !== 'timestamp' && key !== '@timestamp' && key !== 'time')
    .map(key => key + '=' + flattenedConfig[key])
    .join(' and ');
}

function ensureAllValuesAreStrings(config, setUrlState) {
  if (!config) {
    return {};
  }
  setUrlState({ config: flattenObject(config) });

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
