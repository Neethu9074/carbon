/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm, Item } from 'formalistic';
import React from 'react';

import { Spacer, Stack } from '@instana/components';

import { useFormatterFormSideEffects } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { eventColumns } from 'in-custom-dashboards/widgets/Table/eventsTable/EventColumns';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import InputInSection from 'in-components/form/Input/InputInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpAction from 'in-components/workspace/HelpAction';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import Sections from 'in-components/workspace/Sections';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Table/eventsTable/FormComponent.mless';

export default function FormComponent({
  form,
  onChange
}: {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}) {
  const dynamicFocusQuery = form.get('dynamicFocusQuery');
  const columnField = form.get('columns') as Field<string[]>;

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
        <InputInSection
          label={t('in-custom-dashboards:widgets.table.form.query')}
          id="metic-configurator-event-dynamic-focus-query"
          type="text"
          value={dynamicFocusQuery?.value}
          onChange={e =>
            updateForm(
              form.updateIn(['dynamicFocusQuery'], (field: Item) =>
                (field as Field<string>).setValue(e.target.value).setTouched(true)
              )
            )
          }
          hasError={!dynamicFocusQuery?.valid && dynamicFocusQuery?.touched}
          additionalContent={<TouchedMessages field={dynamicFocusQuery} />}
          actions={<HelpAction>{t('in-custom-dashboards:widgets.table.form.helpAction')}</HelpAction>}
          maxLength={512}
        />
      </Sections>

      <Sections>
        <Row className={locals.checkBoxField}>
          <Col md={2} key="titleCheckbox">
            <span className={locals.textTitle}>{t('in-custom-dashboards:widgets.table.form.columns')}</span>
          </Col>
          {Object.entries(eventColumns).map(([key, columnName]) => (
            <Col md={2} key={key}>
              <CheckboxFancy
                label={columnName}
                checked={columnField?.value?.includes(key)}
                onChange={() => onColumnSelect(key)}
              />
            </Col>
          ))}
        </Row>
        <div>
          <Col mdOffset={2} md={10} key="errorCheckbox">
            <span className={locals.textTitle}>
              <TouchedMessages field={columnField} />
            </span>
          </Col>
        </div>
      </Sections>
      <Spacer vertical="medium" />
    </Stack>
  );
}
