/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React from 'react';

import { onlyWithAPidAndNameMatchingQuery } from 'in-custom-dashboards/widgets/Slo/sli/SliManageList';
import { getSliConfigurations } from 'in-custom-dashboards/widgets/Slo/stories/apiMock';
import SliList from 'in-custom-dashboards/widgets/Slo/sli/SliList';

export default {
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
