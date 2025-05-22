/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm, ValidationResult } from 'formalistic';
import React, { useState } from 'react';
import classNames from 'classnames';

import { Stack, Button, IconButton, Typography } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import {
  onlyUniqueKeyNames,
  requestHeaderNameValidator,
  requestHeaderValueValidator
} from 'in-synthetics/createTests/validators/configValidators';
// @ts-expect-error Module needs to be translated to TS
import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import { Invalid, Validation, expectJson, expectMatch, expectStatus, ConfigItem } from 'in-synthetics/utils/constants';
import ConfigurationCommonSection from 'in-synthetics/createTests/advanced/ConfigurationCommonSection';
import ValidationSection from 'in-synthetics/createTests/advanced/ValidationSection';
import { HTTPMethods } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import ComboBox from 'in-components/ComboBox/ComboBox';
import { isNotBlank } from 'in-services/util/string';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/advanced/ConfigurationSection.mless';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  isUpdateConfig: boolean;
  headers: ConfigItem[];
  setHeaders: React.Dispatch<React.SetStateAction<ConfigItem[]>>;
  invalidHeader: Invalid;
  setInvalidHeader: React.Dispatch<React.SetStateAction<Invalid>>;
  invalidJSON: Invalid;
  setInvalidJSON: React.Dispatch<React.SetStateAction<Invalid>>;
  invalidTimeout: Invalid;
  setInvalidTimeout: React.Dispatch<React.SetStateAction<Invalid>>;
}

export default function ConfigurationSection({
  form,
  updateForm,
  isUpdateConfig,
  headers,
  setHeaders,
  invalidHeader,
  setInvalidHeader,
  invalidJSON,
  setInvalidJSON,
  invalidTimeout,
  setInvalidTimeout
}: Props) {
  const configForm = form.get('configuration') as MapForm<any>;
  const methodField = configForm.get('operation') as Field<string>;
  const urlField = configForm.get('url') as Field<string>;
  const body = configForm.get('body') as Field<string>;
  const validationString = configForm.get('validationString') as Field<string>;
  const expectStatusField = configForm.get('expectStatus') as Field<string>;
  const expectJsonField = configForm.get('expectJson') as Field<Record<string, string>>;
  const expectMatchField = configForm.get('expectMatch') as Field<string>;

  const getDefaultExpectValues = (): Validation[] => {
    const expectedObject: Validation[] = [];
    if (isNotBlank(expectStatusField.value)) {
      expectedObject.push({
        id: generateUniqueShortId(),
        key: expectStatus,
        value: expectStatusField.value,
        fieldName: 'expectStatus'
      });
    }
    if (Object.keys(expectJsonField.value).length !== 0) {
      expectedObject.push({
        id: generateUniqueShortId(),
        key: expectJson,
        value: isUpdateConfig ? JSON.stringify(expectJsonField.value) : expectJsonField.value,
        fieldName: 'expectJson'
      });
    }
    if (isNotBlank(expectMatchField.value)) {
      expectedObject.push({
        id: generateUniqueShortId(),
        key: expectMatch,
        value: expectMatchField.value,
        fieldName: 'expectMatch'
      });
    }
    return expectedObject.length > 0
      ? expectedObject
      : [{ id: generateUniqueShortId(), key: expectStatus, value: expectStatusField.value, fieldName: 'expectStatus' }];
  };
  const [expectSelections, setExpectSelections] = useState(getDefaultExpectValues());

  function addNewHeaderRow() {
    setHeaders([
      ...headers,
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
      form.updateIn(['configuration', 'headers'], (field: Item) =>
        (field as Field<{ [index: string]: string }>).setTouched(false)
      )
    );
  }

  function deleteHeaderAction(index: string) {
    headers.splice(
      headers.findIndex(h => h.id === index),
      1
    );
    setHeaders([...headers]);
    checkForUniqueHeaderNames();
    updateHeaders(true);
  }

  function checkForUniqueHeaderNames() {
    const uniqueKeyName = onlyUniqueKeyNames(headers, 'headers');
    if (uniqueKeyName) {
      setInvalidHeader({ invalid: true, message: uniqueKeyName[0].message! });
    } else {
      setInvalidHeader({ invalid: false, message: '' });
    }
  }

  function updateHeaders(isDeleteAction: boolean) {
    updateForm(
      form.updateIn(['configuration', 'headers'], (field: Item) =>
        (field as Field<{ [index: string]: string }>)
          .setValue(
            headers.reduce((headerObj: { [index: string]: string }, h: ConfigItem) => {
              if (isNotBlank(h.key) || isNotBlank(h.value)) headerObj[h.key] = h.value;
              return headerObj;
            }, {})
          )
          .setTouched(!isDeleteAction)
      )
    );
  }

  function validateHeaders(
    updatedHeaders: ConfigItem[],
    value: string,
    index: number,
    isHeaderName: boolean
  ): ConfigItem[] {
    const headerName = isHeaderName ? value : updatedHeaders[index].key;
    const headerValue = isHeaderName ? updatedHeaders[index].value : value;
    const nameUndefined: ValidationResult = notUndefinedValidator(headerName);
    const nameNotBlank: ValidationResult = notBlankValidator(headerName);
    const nameNotValid: ValidationResult = requestHeaderNameValidator(headerName);
    const valueUndefined: ValidationResult = notUndefinedValidator(headerValue);
    const valueNotBlank: ValidationResult = notBlankValidator(headerValue);
    const valueNotValid: ValidationResult = requestHeaderValueValidator(headerValue);

    if (nameUndefined) {
      updatedHeaders[index].error['name'] = { invalid: true, message: nameUndefined[0].message! };
    } else if (nameNotBlank) {
      updatedHeaders[index].error['name'] = { invalid: true, message: nameNotBlank[0].message! };
    } else if (nameNotValid) {
      updatedHeaders[index].error['name'] = { invalid: true, message: nameNotValid[0].message! };
    } else {
      updatedHeaders[index].error['name'] = { invalid: false, message: '' };
    }

    if (valueUndefined) {
      updatedHeaders[index].error['value'] = { invalid: true, message: valueUndefined[0].message! };
    } else if (valueNotBlank) {
      updatedHeaders[index].error['value'] = { invalid: true, message: valueNotBlank[0].message! };
    } else if (valueNotValid) {
      updatedHeaders[index].error['value'] = { invalid: true, message: valueNotValid[0].message! };
    } else {
      updatedHeaders[index].error['value'] = { invalid: false, message: '' };
    }
    return updatedHeaders;
  }

  return (
    <div>
      <div className={locals.configContainer}>
        <Stack direction="horizontal">
          <FormGroup>
            <Label htmlFor={'httpMethod'} hasError={!methodField?.valid && methodField?.touched}>
              {t('in-synthetics:dialog.createTest.advancedMode.configStep.operation')}
            </Label>
            <ComboBox
              name={'httpMethod'}
              value={methodField?.value}
              options={HTTPMethods}
              defaultValue={HTTPMethods[0].value}
              isClearable={false}
              isOptionDisabled={(option: any) => option.isdisabled}
              isDisabled
              onChange={e => {
                if (e != null && !(e instanceof Array)) {
                  updateForm(
                    form.updateIn(['configuration', 'operation'], (field: Item) =>
                      (field as Field<string>).setValue(e.value).setTouched(true)
                    )
                  );
                }
              }}
            />
            <TouchedMessages field={methodField} />
          </FormGroup>

          {urlField.map(field => (
            <FormGroup className={locals.descriptionInput} key={field.value}>
              <Label htmlFor="url" hasError={!field.valid && field.touched}>
                {t('in-synthetics:dialog.createTest.requestStep.labelUrl')}
              </Label>
              <Input
                name="url"
                value={field.value}
                onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                  updateForm(
                    form.updateIn(['configuration', 'url'], (urlFormField: Item) =>
                      (urlFormField as Field<string>).setValue(target?.value).setTouched(true)
                    )
                  );
                }}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Stack>
      </div>
      <div className={locals.configContainer}>
        <Stack gap="small">
          <Typography variant="body-bold">
            {t('in-synthetics:dialog.createTest.advancedMode.configStep.headerSectionLabel')}
          </Typography>
          {headers.map(header => {
            return (
              <Stack direction="horizontal" component="li" key={header.id}>
                <FormGroup className={locals.headerInput}>
                  <Label htmlFor="header">{t('in-synthetics:dialog.createTest.advancedMode.configStep.header')}</Label>
                  <Input
                    name="header"
                    value={header.key}
                    hasError={header.error['name'].invalid}
                    onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                      let updatedHeaders = headers.slice();
                      const index = updatedHeaders.findIndex((h: ConfigItem) => h.id === header.id);
                      updatedHeaders[index].key = target.value;
                      checkForUniqueHeaderNames();
                      updatedHeaders = validateHeaders(updatedHeaders, target.value, index, true);
                      setHeaders([...updatedHeaders]);
                      updateHeaders(false);
                    }}
                  />
                  {header.error['name'].invalid && <ValidationBlock>{header.error['name'].message}</ValidationBlock>}
                </FormGroup>
                <FormGroup className={locals.headerInput}>
                  <Label htmlFor="headerValue">
                    {t('in-synthetics:dialog.createTest.advancedMode.configStep.headerValue')}
                  </Label>
                  <Input
                    name="headerValue"
                    value={header.value}
                    hasError={header.error['value'].invalid}
                    onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                      let updatedHeaders = headers.slice();
                      const index = updatedHeaders.findIndex((h: ConfigItem) => h.id === header.id);
                      updatedHeaders[index].value = target.value;
                      updatedHeaders = validateHeaders(updatedHeaders, target.value, index, false);
                      setHeaders([...updatedHeaders]);
                      updateHeaders(false);
                    }}
                  />
                  {header.error['value'].invalid && <ValidationBlock>{header.error['value'].message}</ValidationBlock>}
                </FormGroup>
                <div className={classNames(locals.deleteAction, locals.deleteHeader)}>
                  <IconButton kind="action" type="lib_actions_delete" onClick={() => deleteHeaderAction(header.id)} />
                </div>
              </Stack>
            );
          })}
          <section>
            {invalidHeader.invalid && <ValidationBlock>{invalidHeader.message}</ValidationBlock>}
            <Button
              className={locals.validationsBtn}
              kind="action"
              icon="lib_openclose_add_circle_outline"
              onClick={addNewHeaderRow}
            >
              {t('in-synthetics:dialog.createTest.advancedMode.configStep.addHeader')}
            </Button>
          </section>
        </Stack>
      </div>
      {methodField?.value !== 'GET' && (
        <div className={locals.configContainer}>
          <FormGroup className={locals.descriptionInput}>
            <Label htmlFor="body">{t('in-synthetics:dialog.createTest.advancedMode.configStep.body')}</Label>
            <DebouncedTextArea
              rows={3}
              name="body"
              value={body.value}
              onChange={({ target }: React.ChangeEvent<any>) => {
                updateForm(
                  form.updateIn(['configuration', 'body'], (field: Item) =>
                    (field as Field<string>).setValue(target.value).setTouched(true)
                  )
                );
              }}
            />
          </FormGroup>
        </div>
      )}
      <div className={locals.configContainer}>
        <Stack gap="small">
          <Typography variant="body-bold">
            {t('in-synthetics:dialog.createTest.advancedMode.configStep.validationsSectionLabel')}
          </Typography>
          <FormGroup className={locals.descriptionInput}>
            <Label htmlFor="validationString">
              {t('in-synthetics:dialog.createTest.advancedMode.configStep.validationString')}
            </Label>
            <Input
              name="validationString"
              value={validationString.value}
              onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                updateForm(
                  form.updateIn(['configuration', 'validationString'], (field: Item) =>
                    (field as Field<string>).setValue(target?.value).setTouched(true)
                  )
                );
              }}
            />
          </FormGroup>
          <ValidationSection
            form={form}
            updateForm={updateForm}
            expectSelections={expectSelections}
            setExpectSelections={setExpectSelections}
            setInvalidJSON={setInvalidJSON}
            invalidJSON={invalidJSON}
          />
        </Stack>
      </div>
      <ConfigurationCommonSection
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
      />
    </div>
  );
}
