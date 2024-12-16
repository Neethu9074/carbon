/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';

import { SvgIcon, Stack, Typography, Spacer, SearchInput } from '@instana/components';

import { score, filter } from 'in-plg/pages/onboarding/content/ContentUtils';
import { getEntriesForFreeTrial } from 'in-plg/pages/onboarding/content';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { productAreas } from 'in-services/tracking/productAreas';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import createTracker from 'in-waiting-for-deployment/tracker';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { pageNames } from 'in-services/tracking/pageNames';
import CardGrid from 'in-plg/components/Card/CardGrid';
import { t } from 'in-i18n';

import locals from './AgentCatalog.mless';

export default function AgentCatalog(props) {
  const trackingService = !props.fromOnboarding ? createTracker('agent.installation') : createTracker('onboarding');
  const entities = getEntriesForFreeTrial();

  let [query, setQuery] = useState('');
  let [filteredEntities, SetFilteredEntities] = useState(entities);
  const onQueryChange = newQuery => {
    setQuery(newQuery);
    filteredEntities = newQuery === '' ? entities : filter(score(entities, newQuery));
    SetFilteredEntities(filteredEntities);
  };
  const breadCrumbs = [
    <Breadcrumb
      href={`#/agents${props?.fromOnboarding ? '/onboarding' : ''}/installation`}
      className={locals.breadcrumb}
    >
      <Stack direction="horizontal" align="center">
        <SvgIcon type="lib_infrastructure" />
        <Typography variant="body-bold">{t('in-plg:agentDetails.common.agentDeployment')}</Typography>
      </Stack>
    </Breadcrumb>
  ];

  useEffect(() => {
    trackingService.catalogPageOpened();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack direction="vertical">
      <ViewTrackingMeta
        data={{
          productArea: productAreas.agents,
          pageRootName: pageNames.agent_catalog
        }}
      />
      <Stack>
        <BreadcrumbHeader />
        <Breadcrumbs items={breadCrumbs} />
      </Stack>
      <LeftRightPadding className={locals.catalog}>
        <Stack direction="vertical">
          <SearchInput
            width="100%"
            onChange={onQueryChange}
            query={query}
            autoFocus
            onBlur={() => {
              if (query) {
                trackingService.catalogPageSearchUsed({ query });
              }
            }}
            hasError={false}
            placeholder={t('in-components:searchInput.placeholderSearch')}
          />
          <Spacer vertical="xxsmall" />
          <Typography variant="heading-200">{`${t('in-plg:agentDetails.common.agentDeployment')} (${
            filteredEntities.length
          })`}</Typography>
          <CardGrid data={filteredEntities} {...props} />
        </Stack>
      </LeftRightPadding>
    </Stack>
  );
}
