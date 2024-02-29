/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { t } from '@instana/i18n-react';

import {
  entityType,
  grouping,
  datasets,
  tagFilterExpression
} from 'in-custom-dashboards/widgets/Table/infrastructure/form';
// @ts-expect-error needs ts migration
import SelectorOverlay from 'in-components/SelectorOverlay/SelectorOverlay';
import IndeterminateLoadingIndicator from 'in-components/LoadingIndicators/IndeterminateLoadingIndicator';
import { metricsPath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { getIconType as getInfraIconType } from 'in-infrastructure/infrastructureIconType';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import DropdownButton from 'in-components/Button/DropdownButton';
import Section from 'in-components/workspace/Section';
import Overlay from 'in-components/overlays/Overlay';

import locals from 'in-components/GroupingConfigurator/LoadingIndicator.mless';

interface EntityItem {
  type: string;
  label: string;
  count: number;
}

interface EntityInfraTypeSelectorProps {
  setTagFilterExpression: React.Dispatch<React.SetStateAction<FormModelElement[]>>;
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  entityItems: EntityItem[];
}

export default function EntityInfraTypeSelector({
  form,
  updateForm,
  setTagFilterExpression,
  entityItems
}: EntityInfraTypeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const metricsForm = form.get(datasets).get(metricsPath);
  const metricsFormSize = metricsForm.size;
  const entityTypeField = form.get(entityType);
  const entityLabel = t('in-custom-dashboards:widgets.table.form.infrastructure.entityType');

  // Remove dataset in case entity type has changed
  const onChange = ({ type }: EntityItem, close: () => void) => {
    const updatedForm = getFormWithoutDatasets(form, metricsFormSize);
    updateEntityInfraType(updatedForm, type, updateForm);
    setTagFilterExpression([]);
    close();
  };

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

  return entityTypeField?.map((field: Field<string>) => {
    const options = getEntityOptions(entityItems);
    const selectedEntity = options.find(({ type }) => type === field.value)?.label;
    const buttonLabel = selectedEntity || t('in-custom-dashboards:widgets.table.form.pleaseSelect');
    const hasError = entityTypeField?.messages.length > 0 && entityTypeField?.touched;

    return (
      <Section key={entityType} title={entityLabel} hasError={hasError}>
        <Overlay
          content={({ close }) => (
            <SelectorOverlay
              options={options}
              onChange={(entity: EntityItem) => onChange(entity, close)}
              query={searchQuery}
              onQueryChange={setSearchQuery}
              shouldTriggerWindowResize
              disabled={!options}
              strict
              withIcons
            />
          )}
          align="bottomLeft"
          withoutWrapper
        >
          {({ toggle, refSetter }) => (
            <DropdownButton
              kind="secondary"
              onClick={toggle}
              refSetter={refSetter as React.MutableRefObject<HTMLButtonElement>}
            >
              {buttonLabel}
            </DropdownButton>
          )}
        </Overlay>
        {hasError && <TouchedMessages field={entityTypeField} />}
      </Section>
    );
  });
}

function getFormWithoutDatasets(form: MapForm<any>, metricsFormSize: number) {
  for (let i = 0; i < metricsFormSize; i++) {
    // @ts-expect-error
    form = form.updateIn([datasets, metricsPath], (field: Item) => field.remove(0));
  }

  return form;
}

function updateEntityInfraType(form: MapForm<any>, newEntityValue: string, updateForm: (form: MapForm<any>) => void) {
  updateForm(
    form
      .updateIn([tagFilterExpression], (field: Item) => (field as Field<string[]>).setValue([]).setTouched(true))
      .updateIn([grouping], (field: Item) => (field as Field<string[]>).setValue([]).setTouched(true))
      .updateIn([entityType], (field: Item) => (field as Field<string>).setValue(newEntityValue).setTouched(true))
  );
}

function getEntityOptions(entityItems: EntityItem[]) {
  if (!entityItems || entityItems.length === 0) {
    return [];
  }

  return entityItems.map((entity: EntityItem) => ({
    ...entity,
    breadcrumbAndLabel: entity.label,
    icon: getInfraIconType(entity.type)
  }));
}
