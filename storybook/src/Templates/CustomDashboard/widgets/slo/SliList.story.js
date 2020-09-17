import { action } from '@storybook/addon-actions';
import React from 'react';

import { onlyWithAPidAndNameMatchingQuery } from 'in-custom-dashboards/widgets/Slo/SliManageList';
import SliList from 'in-custom-dashboards/widgets/Slo/SliList';
import { getSliConfigurations } from './apiMock';

export default {
  title: 'Templates|CustomDashboard/widgets/SLO/SLI-list',
  component: SliList
};

export function Search() {
  const all_services_mock = 'btg-B701Rx6o9QNXUS4TVw';
  const queryState = React.useState('');
  return (
    <SliList
      onChange={({ query }) => {
        queryState[1](query);
      }}
      query={queryState[0]}
      selectSli={action('sli selected')}
      getItems={() =>
        getSliConfigurations().map(onlyWithAPidAndNameMatchingQuery(all_services_mock, queryState[0])) ?? null
      }
    />
  );
}
