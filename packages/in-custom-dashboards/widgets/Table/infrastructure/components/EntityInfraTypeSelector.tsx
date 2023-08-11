/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { TimeConfig, TagFilterExpression, Order } from '@instana/types';
import { t } from '@instana/i18n-react';

import IndeterminateLoadingIndicator from 'in-components/LoadingIndicators/IndeterminateLoadingIndicator';
import useInfrastructureEntities from 'in-infrastructure/Explore/hooks/useInfrastructureEntities';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { OrderBy } from 'in-logging/analyze/AnalyzeView/components/Logs/types';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import Section from 'in-components/workspace/Section/Section';

import locals from 'in-components/GroupingConfigurator/LoadingIndicator.mless';

export const entityType = 'entityType';

interface EntityInfraTypeSelectorProps {
  timeConfig: TimeConfig;
  backendQueryModel: TagFilterExpression;
  setOrder: (order: OrderBy) => void | null;
  order: Order;
  setTagFilterExpression: React.Dispatch<React.SetStateAction<FormModelElement[]>>;
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
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

  if (!entityItems) {
    return (
      <Section titleHtmlFor={entityType} title={entityLabel}>
        <div className={locals.wrapper}>
          <IndeterminateLoadingIndicator size={27} />
          <span className={locals.text}>
            {t('in-custom-dashboards:widgets.table.form.infrastructure.loadingEntities')}
          </span>
        </div>
      </Section>
    );
  }

  return entityTypeField?.map((field: Field<string>) => (
    <SelectInSection
      id={entityType}
      label={entityLabel}
      value={field.value}
      disabled={!entityItems}
      hasError={!field.valid && field.touched}
      onChange={onChange}
      additionalContent={<TouchedMessages field={entityTypeField} />}
    >
      <option value="">{t('in-custom-dashboards:widgets.table.form.pleaseSelect')}</option>
      {entityItems?.map(({ id, type, label }: any, index: number) => (
        <option key={`${id}-${index}`} value={type}>
          {label}
        </option>
      ))}
    </SelectInSection>
  ));
}
