/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';

import { useDataSourceFormSideEffects } from 'in-custom-dashboards/widgets/Table/hooks/useFormSideEffects';
import TableDataSourceFormSelector from 'in-custom-dashboards/widgets/Table/TableDataSourceFormSelector';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { hasInfrastructureAnalyzeAccess } from 'in-stores/permission';
import { dataSources } from 'in-custom-dashboards/widgets/Table';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-components/workspace/Sections';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

interface TableWidgetFormComponentProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}

export default function TableWidgetFormComponent({ form, onChange }: TableWidgetFormComponentProps) {
  const sourceField = form?.get('source');
  const source = sourceField.value;

  const updateForm = useDataSourceFormSideEffects(form, updatedForm => {
    onChange([], () => updatedForm);
  });

  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateForm(form.updateIn(['source'], field => field.setValue(event.target.value).setTouched(true)));
  };

  let filteredDataSources = Object.values(dataSources).filter(value => value.isEnabled);

  // Handle if user doesn't have analyze infrastructure permission
  if (!hasInfrastructureAnalyzeAccess) {
    filteredDataSources = filteredDataSources.filter(value => value.type !== 'INFRASTRUCTURE_METRICS');
  }

  return (
    <Stack gap="normal">
      <Header>{t('in-custom-dashboards:widgets.table.form.title')}</Header>

      <Stack gap="xsmall">
        <Sections>
          <SelectInSection
            label={t('in-custom-dashboards:widgets.table.form.dataSource')}
            id="dataSource-selector"
            value={source}
            onChange={handleOnChange}
            additionalContent={<TouchedMessages field={sourceField} />}
          >
            <option value="">{t('in-custom-dashboards:widgets.table.form.pleaseSelect')}</option>
            {filteredDataSources.map(({ type, label }) => (
              <option key={type} value={type}>
                {label}
              </option>
            ))}
          </SelectInSection>
        </Sections>
      </Stack>

      <TableDataSourceFormSelector form={form} onChange={onChange} />
    </Stack>
  );
}
