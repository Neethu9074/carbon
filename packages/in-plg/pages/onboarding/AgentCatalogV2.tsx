/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';

import { Stack, Typography, SearchInput } from '@instana/components';

import { score, filter } from 'in-plg/pages/onboarding/content/ContentUtils';
import { getEntriesForFreeTrialV2 } from 'in-plg/pages/onboarding/content';
import HeaderV2, { breadcrumb } from 'in-plg/components/HeaderV2/HeaderV2';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import createTracker from 'in-waiting-for-deployment/tracker';
import { pageNames } from 'in-services/tracking/pageNames';
import CardGridV2 from 'in-plg/components/Card/CardGridV2';
import { datasourceTypes } from 'in-plg/navigation/paths';
import { t } from 'in-i18n';

export default function AgentCatalogV2(props: any) {
  const { fromOnboarding, selectedDatasource } = props;
  const trackingService = !fromOnboarding ? createTracker('agent.installation') : createTracker('onboarding');
  const entities = getEntriesForFreeTrialV2();

  let [query, setQuery] = useState('');
  let [filteredEntities, SetFilteredEntities] = useState(entities);

  const onQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    let filteredEntitiesLocal = entities;
    if (newQuery !== '') {
      (Object.keys(entities) as Array<keyof typeof entities>).forEach(datasource => {
        filteredEntitiesLocal = {
          ...filteredEntitiesLocal,
          [datasource]: {
            ...filteredEntitiesLocal[datasource],
            data: filter(score(filteredEntitiesLocal[datasource].data, newQuery))
          }
        };
      });
    }
    SetFilteredEntities(filteredEntitiesLocal);
  };

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
      {!fromOnboarding && selectedDatasource && (
        <HeaderV2
          breadcrumb={getBreadcrump(selectedDatasource)}
          title={t('in-plg:agentDetails.common.datasourceCatalogHeader', {
            context: getDatasourceHeadingContext(selectedDatasource)
          })}
        />
      )}
      <LeftRightPadding>
        <Stack direction="vertical">
          {fromOnboarding && (
            <Typography variant="heading-04">{t('in-plg:agentDetails.common.dataSources')}</Typography>
          )}

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

          <CardGridV2 data={filteredEntities} {...props} />
        </Stack>
      </LeftRightPadding>
    </Stack>
  );
}

const getDatasourceHeadingContext = (type: string) => {
  let context = '';
  switch (type) {
    case datasourceTypes.instana_agent:
      context = 'INSTANA_AGENT';
      break;
    case datasourceTypes.otel_collector:
      context = 'OTEL_COLLECTOR';
      break;
  }
  return context;
};

const getBreadcrump = (selectedDatasource: string) => {
  const firstLevel: breadcrumb = { title: t('in-plg:agentDetails.common.dataSources'), href: `/datasources` };
  let secondLevel: breadcrumb = { title: '', href: null };
  if (selectedDatasource === datasourceTypes.instana_agent) {
    secondLevel = { title: t('in-plg:agentDetails.common.instanaAgents'), href: null };
  } else if (selectedDatasource === datasourceTypes.otel_collector) {
    secondLevel = { title: t('in-plg:agentDetails.common.openTelemetryCollectors'), href: null };
  }
  return [firstLevel, secondLevel];
};
