/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React, { useMemo, useState } from 'react';
import { debounce } from 'lodash';

import { Spacer, Stack } from '@instana/components';

import { useFormatterFormSideEffects } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
//@ts-expect-error
import SearchBarDfq from 'in-custom-dashboards/widgets/Table/eventsTable/SearchBarDfq';
import { eventColumns } from 'in-custom-dashboards/widgets/Table/eventsTable/EventColumns';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
//@ts-expect-error
import { trim } from 'in-components/SearchBar/Input';
import TouchedMessages from 'in-components/form/TouchedMessages';
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

  const [dynamicFocusQuery, setDynamicFocusQuery] = useState(form.get('dynamicFocusQuery').value);

  function handleDfqChangeFn(value: string) {
    updateForm(
      form.updateIn(['dynamicFocusQuery'], (field: Item) =>
        (field as Field<string>).setValue(trim(value)).setTouched(true)
      )
    );
  }

  const handleChange = useHandleChange(handleDfqChangeFn, form, setDynamicFocusQuery);

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
            <SearchBarDfq
              theme="light"
              dfqHandleChange={handleChange}
              dfqEntry={dynamicFocusQuery}
              dfqInsideCustomWidget
              saveFilterDisabled
            />
            <HelpAction>{t('in-custom-dashboards:widgets.table.form.helpAction')}</HelpAction>
          </Stack>
        </Section>
      </Sections>
      <Sections>
        <Section title={t('in-custom-dashboards:widgets.table.form.columns')}>
          <Stack direction="horizontal" align="center" distribution="stretch" gap="large">
            {Object.entries(eventColumns).map(([key, columnName]) => (
              <CheckboxFancy
                label={columnName}
                checked={columnField?.value?.includes(key)}
                onChange={() => onColumnSelect(key)}
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

function useHandleChange(
  handleDebounceFn: (arg: string) => void,
  form: MapForm<any>,
  setDynamicFocusQuery: (arg: string) => void
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = useMemo(() => debounce(handleDebounceFn, 500), [form]);
  return function handleChange(dfQuery: string) {
    setDynamicFocusQuery(trim(dfQuery));
    debounceFn(trim(dfQuery));
  };
}
