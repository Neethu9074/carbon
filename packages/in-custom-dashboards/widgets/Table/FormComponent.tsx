/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';

import { useFormatterFormSideEffects } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import TableFromSelector from 'in-custom-dashboards/widgets/Table/TableFormSelector';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { dataSources } from 'in-custom-dashboards/widgets/Table';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-components/workspace/Sections';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

export default function TableWidgetFormComponent({ form, onChange }: { form: MapForm<any>; onChange: any }) {
  const sourceField = form?.get('source');
  const source = sourceField.value;
  const updateForm = useFormatterFormSideEffects(form, updatedForm => {
    onChange([], () => updatedForm);
  });

  return (
    <Stack gap="normal">
      <Header>{t('in-custom-dashboards:widgets.table.form.title')}</Header>

      <Stack gap="xsmall">
        <Sections>
          <SelectInSection
            label={t('in-custom-dashboards:widgets.table.form.dataSource')}
            id="dataSource-selector"
            value={source}
            onChange={e =>
              updateForm(form.updateIn(['source'], field => field.setValue(e.target.value).setTouched(true)))
            }
            additionalContent={<TouchedMessages field={sourceField} />}
          >
            <option value="">{t('in-custom-dashboards:widgets.table.form.pleaseSelect')}</option>
            {Object.entries(dataSources).map(([key, value]) => (
              <option key={key} value={value.type}>
                {value.label}
              </option>
            ))}
          </SelectInSection>
        </Sections>
      </Stack>

      <TableFromSelector form={form} onChange={onChange} />
    </Stack>
  );
}
