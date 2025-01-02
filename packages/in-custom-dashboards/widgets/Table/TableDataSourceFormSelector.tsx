/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Item } from 'formalistic';
import React from 'react';

import { default as EventTableElements } from 'in-custom-dashboards/widgets/Table/eventsTable/FormComponent';
import { InfrastructureTableForm } from 'in-custom-dashboards/widgets/Table/infrastructure/FormComponent';
import { dataSources } from 'in-custom-dashboards/widgets/Table';

interface TableDataSourceFormSelectorProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}

export default function TableDataSourceFormSelector({ form, onChange }: TableDataSourceFormSelectorProps) {
  const sourceField = form.get('source');
  const source = sourceField.value;

  switch (source) {
    case dataSources.EVENTS.type:
    case dataSources.KUBERNETES_EVENTS.type:
      return <EventTableElements form={form} onChange={onChange} />;
    case dataSources.INFRA.type:
      return <InfrastructureTableForm form={form} onChange={onChange} />;
    default:
      return null;
  }
}
