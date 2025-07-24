/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { SvgIcon, Stack } from '@instana/components';

import IndeterminateLoadingIndicator from 'in-components/LoadingIndicators/IndeterminateLoadingIndicator';
import useInfrastructureEntities from 'in-infrastructure/Explore/hooks/useInfrastructureEntities';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getIconType as getInfraIconType } from 'in-infrastructure/infrastructureIconType';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import SelectorOverlay from 'in-components/SelectorOverlay/SelectorOverlay';
import { defaultOrder } from 'in-infrastructure/Explore/constants';
import DropdownButton from 'in-components/Button/DropdownButton';
import { TagOptions } from 'in-components/SelectorOverlay/Node';
import Section from 'in-components/workspace/Section';
import Overlay from 'in-components/overlays/Overlay';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-components/GroupingConfigurator/LoadingIndicator.mless';

interface EntityItem {
  type: string;
  label: string;
  count: number;
}

interface ScopeEntityProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}
const entityType = 'entityType';

export default function ScopeEntity({ form, updateForm }: Readonly<ScopeEntityProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const entityTypeField = form.get('rule').get(entityType);
  const entityLabel = t('in-alerting:smartAlerts.infrastructure.tearSheet.scopeEntity.entityType');

  const timeConfig = useTimeConfig();
  const { tableResult } = useInfrastructureEntities({
    backendQueryModel: EMPTY_EXPRESSION,
    timeConfig,
    order: defaultOrder,
    setOrder: () => null,
    query: '',
    setQuery: () => null
  });

  const entityItems = tableResult?.data?.items;
  const options = getEntityTagOptions(entityItems);
  const selectedEntity = options.find(({ tagName }) => tagName === entityTypeField.value);
  const buttonLabel =
    selectedEntity?.label || t('in-alerting:smartAlerts.infrastructure.tearSheet.scopeEntity.pleaseSelect');
  const buttonIcon = selectedEntity?.icon;
  const hasError = entityTypeField?.messages.length > 0 && entityTypeField?.touched;
  const entityField = (
    <>
      <Overlay
        content={({ close }) => (
          <SelectorOverlay
            options={options}
            onChange={entity => entity.type === 'TAG' && onChange(entity, close)}
            query={searchQuery}
            onQueryChange={setSearchQuery}
            shouldTriggerWindowResize
            disabled={!options}
            withIcons
          />
        )}
        align="bottomLeft"
        withoutWrapper
      >
        {({ toggle, refSetter }) => (
          <DropdownButton
            kind="tertiary"
            onClick={toggle}
            refSetter={refSetter as React.MutableRefObject<HTMLButtonElement>}
          >
            <Stack direction="horizontal" align="center" gap="xsmall">
              {buttonIcon && <SvgIcon className={locals.icon} type={buttonIcon} />} <span>{buttonLabel}</span>
            </Stack>
          </DropdownButton>
        )}
      </Overlay>
      {hasError && <TouchedMessages field={entityTypeField} />}
    </>
  );

  const onChange = ({ tagName }: TagOptions, close: () => void) => {
    const metricField = form.get('rule').get('metricName')?.value;
    if (tagName) {
      let updatedForm = form;
      updatedForm = updatedForm
        .updateIn(['rule', 'entityType'], f => (f as Field<string>).setValue(tagName).setTouched(true))
        .updateIn(['hiddenFields', 'metricLabel'], field => (field as Field<string>).setValue('').setTouched(true))
        .updateIn(['hiddenFields', 'metricPath'], field => (field as Field<string>).setValue('').setTouched(true));
      if (metricField) {
        updatedForm = updatedForm.updateIn(['rule', 'metricName'], field =>
          (field as Field<string>).setValue('').setTouched(true)
        );
      }
      updatedForm = updatedForm
        .updateIn(['groupBy'], field => (field as unknown as Field<string[]>).setValue([]).setTouched(true))
        .updateIn(['tagFilterExpression'], field => (field as Field<string[]>).setValue([]).setTouched(true));

      updateForm(updatedForm);
    }
    close();
  };

  if (!entityItems) {
    return (
      <Section titleHtmlFor={entityType} title={entityLabel}>
        <DropdownButton kind="tertiary">
          <Stack direction="horizontal" gap="disabled">
            <IndeterminateLoadingIndicator size={'xs'} />
            <span className={locals.text}>
              {t('in-alerting:smartAlerts.infrastructure.tearSheet.scopeEntity.loadingEntities')}
            </span>
          </Stack>
        </DropdownButton>
      </Section>
    );
  }

  return (
    <Section key={entityType} title={entityLabel} hasError={hasError}>
      {entityField}
    </Section>
  );
}

export function getEntityTagOptions(entityItems: EntityItem[]): TagOptions[] {
  if (!entityItems || entityItems.length === 0) {
    return [];
  }

  return entityItems.map((entity: EntityItem) => ({
    label: entity.label,
    tagName: entity.type,
    parentLabels: [],
    icon: getInfraIconType(entity.type),
    tagType: 'STRING',
    type: 'TAG'
  }));
}
