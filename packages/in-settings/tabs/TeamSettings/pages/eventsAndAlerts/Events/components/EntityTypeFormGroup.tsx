/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { disallowAppDataLegacyEventsEnabled, hideAppDataLegacyEventsEnabled } from 'in-services/featureFlags';
import { isAppDataEntityType } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
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
          onChange('entityType', e ? (e as Option).value : null, updatedForm => {
            return updatedForm.updateIn(['metricName'], field =>
              (field as Field<Nullish>).setValue(null).setTouched(false)
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
  if (!isAppDataEntityType(entityType)) {
    return true;
  }

  return (
    (!hideAppDataLegacyEventsEnabled && !disallowAppDataLegacyEventsEnabled) ||
    // We can always expose the deprecated type in read-only state, so that the selected option is populated correctly
    readOnly
  );
}
