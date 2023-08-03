/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field } from 'formalistic';
import React from 'react';

import { TimeConfig, TagFilterExpression, Order } from '@instana/types';
import { t } from '@instana/i18n-react';

import { FormConfig } from 'in-custom-dashboards/widgets/Table/infrastructure/components/TableSizeConfigurator';
import useInfrastructureEntities from 'in-infrastructure/Explore/hooks/useInfrastructureEntities';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { OrderBy } from 'in-logging/analyze/AnalyzeView/components/Logs/types';
import SelectInSection from 'in-components/form/Select/SelectInSection';

export const entityType = 'entityType';

interface EntityInfraTypeSelectorProps extends FormConfig {
  timeConfig: TimeConfig;
  backendQueryModel: TagFilterExpression;
  setOrder: (order: OrderBy) => void | null;
  order: Order;
  setTagFilterExpression: React.Dispatch<React.SetStateAction<FormModelElement[]>>;
}

export default function EntityInfraTypeSelector({
  form,
  updateForm,
  timeConfig,
  backendQueryModel,
  order,
  setOrder,
  setTagFilterExpression
}: EntityInfraTypeSelectorProps) {
  const { tableResult } = useInfrastructureEntities({
    backendQueryModel,
    timeConfig,
    order,
    setOrder
  });

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateForm(
      form
        .updateIn(['tagFilterExpression'], field => field.setValue([]).setTouched(true))
        .updateIn(['grouping'], field => field.setValue([]).setTouched(true))
        .updateIn([entityType], field => field.setValue(event.target.value).setTouched(true))
    );

    setTagFilterExpression([]);
  };

  const entityItems = tableResult?.data?.items;
  const entityTypeField = form.get(entityType);

  const entityLabel = t('in-custom-dashboards:widgets.table.form.infrastructure.entityType');

  return entityTypeField?.map((field: Field<string>) => (
    <SelectInSection
      id={entityType}
      label={entityLabel}
      value={field.value}
      hasError={!field.valid && field.touched}
      onChange={onChange}
      additionalContent={<TouchedMessages field={entityTypeField} />}
    >
      <option value="">{t('in-custom-dashboards:widgets.table.form.pleaseSelect')}</option>
      {entityItems?.map(({ id, type, label }: { id: string; type: string; label: string }, index: number) => (
        <option key={`${id}-${index}`} value={type}>
          {label}
        </option>
      ))}
    </SelectInSection>
  ));
}
