/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createListForm, Field, MapForm } from 'formalistic';
import React from 'react';

import { putAllDataSourceFieldsForOneRule } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { isDeprecatedAppDataEntityType } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import { disallowAppDataLegacyEventsEnabled, hideAppDataLegacyEventsEnabled } from 'in-services/featureFlags';
import { customEventRulesValidator } from '../customEventRuleValidations';
import { CustomEventSpecificationWithMetadata, Nullish } from 'in-types';
import ComboBox, { Option, Options } from 'in-components/ComboBox';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

type FormUpdater<ENTITY> = (mapForm: MapForm, entity: ENTITY) => MapForm;

interface EntityTypeFormGroupProps {
  form: MapForm;
  pluginsWithMetricDefinitions: Options;
  onChange: (
    fieldName: string,
    value: string | Nullish,
    updateFormDefinition: FormUpdater<CustomEventSpecificationWithMetadata>
  ) => MapForm;

  disabled: boolean;
}

export function EntityTypeFormGroup({
  form,
  pluginsWithMetricDefinitions,
  onChange,
  disabled
}: EntityTypeFormGroupProps) {
  const entityTypeField = form.get('entityType') as Field<string>;

  return (
    <FormGroup>
      <Label htmlFor="event-entity-type" hasError={!entityTypeField.valid && entityTypeField.touched}>
        {t('in-settings:tabs.entityType')}
      </Label>
      <ComboBox
        isDisabled={disabled}
        name="event-entity-type"
        value={entityTypeField.value}
        options={pluginsWithMetricDefinitions?.filter(plugin => entityTypesFilter(plugin.value, disabled))}
        onChange={e => {
          const newEntityType = (e as Option).value;
          onChange('entityType', e ? newEntityType : null, updatedForm => {
            return updatedForm.put(
              'rules',
              createListForm({
                validator: customEventRulesValidator,
                items: [putAllDataSourceFieldsForOneRule(newEntityType, {})]
              })
            );
          });
        }}
        isClearable={false}
      />
      <TouchedMessages field={entityTypeField} />
    </FormGroup>
  );
}

function entityTypesFilter(entityType: string, readOnly: boolean): boolean {
  if (!isDeprecatedAppDataEntityType(entityType)) {
    return true;
  }

  return (
    (!hideAppDataLegacyEventsEnabled && !disallowAppDataLegacyEventsEnabled) ||
    // We can always expose the deprecated type in read-only state, so that the selected option is populated correctly
    readOnly
  );
}
