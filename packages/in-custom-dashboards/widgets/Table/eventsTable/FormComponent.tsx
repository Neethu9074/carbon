/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { Spacer, Stack, Checkbox } from '@instana/components';

import { kubernetesEventColumns } from 'in-custom-dashboards/widgets/Table/kubernetesTable/KubernetesEventsColumns';
import { useFormatterFormSideEffects } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { eventColumns } from 'in-custom-dashboards/widgets/Table/eventsTable/EventColumns';
//@ts-expect-error
import { trim } from 'in-components/SearchBar/Input';
import { dataSources } from 'in-custom-dashboards/widgets/Table/index';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DfqSearchBar from 'in-components/SearchBar/DfqSearchBar';
import HelpAction from 'in-components/workspace/HelpAction';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

export default function FormComponent({
  form,
  onChange
}: {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}) {
  const columnField = form.get('columns') as Field<string[]>;

  const [dynamicFocusQuery] = useState(form.get('dynamicFocusQuery').value);

  const dataSource = form.get('source').value;
  const eventColumnsBasedOnDatasource = getEventColumnsBasedOnDatasource(dataSource);

  function getEventColumnsBasedOnDatasource(source: string) {
    switch (source) {
      case dataSources.KUBERNETES_EVENTS.type:
        return kubernetesEventColumns;
      default:
        return eventColumns;
    }
  }

  function handleDfqChange(value: string) {
    updateForm(
      form.updateIn(['dynamicFocusQuery'], (field: Item) =>
        (field as Field<string>).setValue(trim(value)).setTouched(true)
      )
    );
  }

  const updateForm = useFormatterFormSideEffects(form, updatedForm => {
    onChange([], () => updatedForm);
  });

  function onColumnSelect(columnName: string) {
    const selectedColumns = columnField.value;
    if (selectedColumns.includes(columnName)) {
      selectedColumns.splice(selectedColumns.indexOf(columnName), 1);
    } else {
      selectedColumns.push(columnName);
    }
    updateForm(
      form.updateIn(['columns'], (field: Item) => (field as Field<string[]>).setValue(selectedColumns).setTouched(true))
    );
  }

  return (
    <Stack gap="normal">
      <Sections>
        <Section title={t('in-custom-dashboards:widgets.table.form.query')}>
          <Stack direction="horizontal" align="center" distribution="stretch" gap="normal">
            <DfqSearchBar
              theme="light"
              onQueryValueChange={handleDfqChange}
              queryValue={dynamicFocusQuery}
              manageFiltersDisabled
            />
            <HelpAction>{t('in-custom-dashboards:widgets.table.form.helpAction')}</HelpAction>
          </Stack>
        </Section>
      </Sections>
      <Sections>
        <Section title={t('in-custom-dashboards:widgets.table.form.columns')}>
          <Stack direction="horizontal" align="center" distribution="stretch" gap="large">
            {Object.entries(eventColumnsBasedOnDatasource).map(([key, columnName]) => (
              <Checkbox
                label={columnName}
                checked={columnField?.value?.includes(key)}
                onChange={() => onColumnSelect(key)}
                key={key}
              />
            ))}
          </Stack>
          <TouchedMessages field={columnField} />
        </Section>
      </Sections>
      <Spacer vertical="medium" />
    </Stack>
  );
}
