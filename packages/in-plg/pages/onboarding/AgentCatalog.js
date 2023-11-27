/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { SvgIcon, Stack, Typography, Spacer } from '@instana/components';

import { score, filter } from 'in-plg/pages/onboarding/content/ContentUtils';
import { getEntriesForFreeTrial } from 'in-plg/pages/onboarding/content';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import CardGrid from 'in-plg/components/Card/CardGrid';
import SearchInput from 'in-components/SearchInput';

export default function AgentCatalog() {
  const entities = getEntriesForFreeTrial();

  let [query, setQuery] = useState('');
  let [filteredEntities, SetFilteredEntities] = useState(entities);
  const onQueryChange = newQuery => {
    setQuery(newQuery);
    filteredEntities = newQuery === '' ? entities : filter(score(entities, newQuery));
    SetFilteredEntities(filteredEntities);
  };

  const breadCrumbs = [
    <Breadcrumb href={'#/agents/installation'}>
      <Stack direction="horizontal" align="center">
        <SvgIcon type="lib_infrastructure" />
        <Typography variant="body-bold">{'Agents Catalog'}</Typography>
      </Stack>
    </Breadcrumb>
  ];
  return (
    <Stack direction="vertical">
      <Stack>
        <BreadcrumbHeader />
        <Breadcrumbs items={breadCrumbs} />
      </Stack>
      <LeftRightPadding>
        <Stack direction="vertical">
          <SearchInput width="100%" onChange={onQueryChange} query={query} autoFocus hasError={false} />
          <Spacer vertical="xxsmall" />
          <Typography variant="heading-200">{`Agent catalogs (${filteredEntities.length})`}</Typography>
          <CardGrid data={filteredEntities} />
        </Stack>
      </LeftRightPadding>
    </Stack>
  );
}
