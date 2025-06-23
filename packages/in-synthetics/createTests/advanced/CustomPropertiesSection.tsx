/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm, ValidationResult } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { IconButton, Stack, Button } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import { onlyUniqueKeyNames } from 'in-synthetics/createTests/validators/configValidators';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { ConfigItem, Invalid } from 'in-synthetics/utils/constants';
import { notBlankValidator } from 'in-services/validators/string';
import FormGroup from 'in-components/form/FormGroup';
import { isNotBlank } from 'in-services/util/string';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/advanced/CustomPropertiesSection.mless';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  customProperties: ConfigItem[];
  setCustomProperties: React.Dispatch<React.SetStateAction<ConfigItem[]>>;
  invalidCustomProperty: Invalid;
  setInvalidCustomProperty: React.Dispatch<React.SetStateAction<Invalid>>;
  runNow?: boolean;
}

export default function CustomPropertiesSection({
  form,
  updateForm,
  customProperties,
  setCustomProperties,
  invalidCustomProperty,
  setInvalidCustomProperty,
  runNow = false
}: Props) {
  function addNewCustomPropertyRow() {
    setCustomProperties([
      ...customProperties,
      {
        id: generateUniqueShortId(),
        key: '',
        value: '',
        error: {
          name: {
            invalid: false,
            message: ''
          },
          value: {
            invalid: false,
            message: ''
          }
        }
      }
    ]);
    updateForm(
      form.updateIn(['customProperties'], (field: Item) =>
        (field as Field<{ [index: string]: string }>).setTouched(false)
      )
    );
  }

  function deleteCustomPropertyAction(index: string) {
    customProperties.splice(
      customProperties.findIndex(cp => cp.id === index),
      1
    );
    setCustomProperties([...customProperties]);
    checkForUniquePropertyNames();
    updateCustomProperties(true);
  }

  function checkForUniquePropertyNames() {
    const uniqueKeyName = onlyUniqueKeyNames(customProperties, 'properties');
    if (uniqueKeyName) {
      setInvalidCustomProperty({ invalid: true, message: uniqueKeyName[0].message! });
    } else {
      setInvalidCustomProperty({ invalid: false, message: '' });
    }
  }

  function updateCustomProperties(isDeleteAction: boolean) {
    updateForm(
      form.updateIn(['customProperties'], (field: Item) =>
        (field as Field<{ [index: string]: string }>)
          .setValue(
            customProperties.reduce((customPropertiesObj: { [index: string]: string }, cp: ConfigItem) => {
              if (isNotBlank(cp.key) || isNotBlank(cp.value)) customPropertiesObj[cp.key] = cp.value;
              return customPropertiesObj;
            }, {})
          )
          .setTouched(!isDeleteAction)
      )
    );
  }

  function validateCustomProperties(
    updatedCustomProperties: ConfigItem[],
    value: string,
    index: number,
    isPropertyName: boolean
  ): ConfigItem[] {
    const propertyName = isPropertyName ? value : updatedCustomProperties[index].key;
    const propertyValue = isPropertyName ? updatedCustomProperties[index].value : value;
    const nameUndefined: ValidationResult = notUndefinedValidator(propertyName);
    const nameNotBlank: ValidationResult = notBlankValidator(propertyName);
    const valueUndefined: ValidationResult = notUndefinedValidator(propertyValue);
    const valueNotBlank: ValidationResult = notBlankValidator(propertyValue);
    if (nameUndefined) {
      updatedCustomProperties[index].error['name'] = { invalid: true, message: nameUndefined[0].message! };
    } else if (nameNotBlank) {
      updatedCustomProperties[index].error['name'] = { invalid: true, message: nameNotBlank[0].message! };
    } else {
      updatedCustomProperties[index].error['name'] = { invalid: false, message: '' };
    }
    if (valueUndefined) {
      updatedCustomProperties[index].error['value'] = { invalid: true, message: valueUndefined[0].message! };
    } else if (valueNotBlank) {
      updatedCustomProperties[index].error['value'] = { invalid: true, message: valueNotBlank[0].message! };
    } else {
      updatedCustomProperties[index].error['value'] = { invalid: false, message: '' };
    }
    return updatedCustomProperties;
  }

  return (
    <div
      className={classNames({
        [locals.propertiesContainer]: true,
        [locals.runNow]: runNow
      })}
    >
      {customProperties.map(customProperty => {
        return (
          <Stack direction="horizontal" component="li" key={customProperty.id}>
            <FormGroup className={locals.descriptionInput}>
              <Label htmlFor="customProperty">
                {t('in-synthetics:dialog.createTest.advancedMode.customProperties.property')}
              </Label>
              <Input
                name="customProperty"
                value={customProperty.key}
                hasError={customProperty.error['name'].invalid}
                onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                  let updatedCustomProperties = customProperties.slice();
                  const index = updatedCustomProperties.findIndex(
                    (property: ConfigItem) => property.id === customProperty.id
                  );
                  updatedCustomProperties[index].key = target.value;
                  checkForUniquePropertyNames();
                  updatedCustomProperties = validateCustomProperties(
                    updatedCustomProperties,
                    target.value,
                    index,
                    true
                  );
                  setCustomProperties([...updatedCustomProperties]);
                  updateCustomProperties(false);
                }}
              />
              {customProperty.error['name'].invalid && (
                <ValidationBlock>{customProperty.error['name'].message}</ValidationBlock>
              )}
            </FormGroup>
            <FormGroup className={locals.descriptionInput}>
              <Label htmlFor="customPropertyValue">
                {t('in-synthetics:dialog.createTest.advancedMode.customProperties.propertyValue')}
              </Label>
              <Input
                name="customPropertyValue"
                value={customProperty.value}
                hasError={customProperty.error['value'].invalid}
                onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                  let updatedCustomProperties = customProperties.slice();
                  const index = updatedCustomProperties.findIndex(
                    (property: ConfigItem) => property.id === customProperty.id
                  );
                  updatedCustomProperties[index].value = target.value;
                  updatedCustomProperties = validateCustomProperties(
                    updatedCustomProperties,
                    target.value,
                    index,
                    false
                  );
                  setCustomProperties([...updatedCustomProperties]);
                  updateCustomProperties(false);
                }}
              />
              {customProperty.error['value'].invalid && (
                <ValidationBlock>{customProperty.error['value'].message}</ValidationBlock>
              )}
            </FormGroup>
            <div className={locals.deleteProperty}>
              <IconButton
                kind="action"
                type="lib_actions_delete"
                onClick={() => deleteCustomPropertyAction(customProperty.id)}
              />
            </div>
          </Stack>
        );
      })}
      <section>
        {invalidCustomProperty.invalid && <ValidationBlock>{invalidCustomProperty.message}</ValidationBlock>}
      </section>
      <div>
        <Button
          className={locals.addPropertyBtn}
          kind="action"
          icon="lib_openclose_add_circle_outline"
          onClick={addNewCustomPropertyRow}
        >
          {t('in-synthetics:dialog.createTest.advancedMode.customProperties.addProperty')}
        </Button>
      </div>
    </div>
  );
}
