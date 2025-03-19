/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import SloBlueprintColumnContent from 'in-service-levels/components/SloList/components/SloBlueprintColumnContent';
import SloEntityColumnContent from 'in-service-levels/components/SloList/components/SloEntityColumnContent';
import SloNameColumnContent from 'in-service-levels/components/SloList/components/SloNameColumnContent';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import SloActions from 'in-service-levels/components/SloList/components/SloActions';
import SloList from 'in-service-levels/components/SloList/SloList';
import { success } from 'in-services/util/result';

export default {
  component: SloList
};

const data = [
  {
    configuration: {
      name: 'Stans first SLO',
      target: 0.5,
      entity: { type: 'website' },
      indicator: { blueprint: 'latency' }
    },
    status: Math.random(),
    entity: { label: 'Stans Blog' }
  },
  {
    configuration: {
      name: 'Stans second SLO',
      target: 0.9,
      entity: { type: 'application' },
      indicator: { blueprint: 'availability' }
    },
    status: Math.random(),
    entity: { label: 'Stans Lab' }
  }
];

const result = success({
  items: data,
  page: 1,
  pageSize: 20,
  totalHits: data.length
});

export function SloListColumnContent() {
  const columnDefinitions = [
    {
      id: 'name',
      label: 'name',
      getContent: item => <SloNameColumnContent item={item} />
    },
    {
      id: 'entity',
      label: 'entity',
      getContent: item => <SloEntityColumnContent item={item} />
    },
    {
      id: 'blueprint',
      label: 'blueprint',
      getContent: item => <SloBlueprintColumnContent item={item} />
    },
    {
      id: 'actions',
      getContent: () => <SloActions />
    }
  ];

  return (
    <ServerTablePresenter
      page={1}
      pageSize={20}
      columnDefinitions={columnDefinitions}
      orderBy="name"
      orderDirection="ASC"
      result={result}
    />
  );
}
