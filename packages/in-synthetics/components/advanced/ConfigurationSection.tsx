/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm, ValidationResult } from 'formalistic';
import React, { useState } from 'react';
import classNames from 'classnames';

import { Button, Stack, SvgIcon } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import {
  onlyUniqueKeyNames,
  requestHeaderNameValidator,
  requestHeaderValueValidator
} from 'in-synthetics/utils/configValidators';
// @ts-expect-error Module needs to be translated to TS
import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import ValidationSection from 'in-synthetics/components/advanced/ValidationSection';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { HTTPMethods } from 'in-synthetics/form/createSyntheticTestForm';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { Validation } from 'in-synthetics/utils/constants';
import { ConfigItem } from 'in-synthetics/utils/constants';
import ComboBox from 'in-components/ComboBox/ComboBox';
import FormGroup from 'in-components/form/FormGroup';
import { isNotBlank } from 'in-services/util/string';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './ConfigurationSection.mless';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

export default function ConfigurationSection({ form, updateForm }: Props) {
  const configForm = form.get('configuration') as MapForm<any>;
  const methodField = configForm.get('operation') as Field<string>;
  const urlField = configForm.get('url') as Field<string>;
  const allowInsecure = configForm.get('allowInsecure') as Field<boolean>;
  const followRedirect = configForm.get('followRedirect') as Field<boolean>;
  const body = configForm.get('body') as Field<string>;
  const validationString = configForm.get('validationString') as Field<string>;
  const expectStatus = configForm.get('expectStatus') as Field<string>;
  const expectJson = configForm.get('expectJson') as Field<Record<string, string>>;
  const expectMatch = configForm.get('expectMatch') as Field<string>;
  const getDefaultExpectValues = (): Validation[] => {
    const expectedObject: Validation[] = [];
    if (isNotBlank(expectStatus.value)) {
      expectedObject.push({
        id: generateUniqueShortId(),
        key: 'Expect Status',
        value: expectStatus.value,
        fieldName: 'expectStatus'
      });
    }
    if (Object.keys(expectJson.value).length !== 0) {
      expectedObject.push({
        id: generateUniqueShortId(),
        key: 'Expect JSON',
        value: expectJson.value,
        fieldName: 'expectJson'
      });
    }
    if (isNotBlank(expectMatch.value)) {
      expectedObject.push({
        id: generateUniqueShortId(),
        key: 'Expect Match',
        value: expectMatch.value,
        fieldName: 'expectMatch'
      });
    }
    return expectedObject.length > 0
      ? expectedObject
      : [{ id: generateUniqueShortId(), key: 'Expect Status', value: expectStatus.value, fieldName: 'expectStatus' }];
  };
  const getDefaultHeaders = (): ConfigItem[] => {
    const headersValue = (configForm.get('headers') as Field<Record<string, string>>).value;
    const headerObject: ConfigItem[] = [];
    Object.keys(headersValue).map(key =>
      headerObject.push({
        id: generateUniqueShortId(),
        key,
        value: headersValue[key],
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      })
    );
    return headerObject;
  };
  const [headers, setHeaders] = useState(getDefaultHeaders());
  const [invalidHeader, setInvalidHeader] = useState({ invalid: false, message: '' });

  const [expectSelections, setExpectSelections] = useState(getDefaultExpectValues());
  const [invalidJSON, setInvalidJSON] = useState({ invalid: false, message: '' });

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

  function validateHeaders(headers: ConfigItem[], value: string, index: number, isHeaderName: boolean): ConfigItem[] {
    const headerName = isHeaderName ? value : headers[index].key;
    const headerValue = isHeaderName ? headers[index].value : value;
    const nameUndefined: ValidationResult = notUndefinedValidator(headerName);
    const nameNotBlank: ValidationResult = notBlankValidator(headerName);
    const nameNotValid: ValidationResult = requestHeaderNameValidator(headerName);
    const valueUndefined: ValidationResult = notUndefinedValidator(headerValue);
    const valueNotBlank: ValidationResult = notBlankValidator(headerValue);
    const valueNotValid: ValidationResult = requestHeaderValueValidator(headerValue);

    if (nameUndefined) {
      headers[index].error['name'] = { invalid: true, message: nameUndefined[0].message! };
    } else if (nameNotBlank) {
      headers[index].error['name'] = { invalid: true, message: nameNotBlank[0].message! };
    } else if (nameNotValid) {
      headers[index].error['name'] = { invalid: true, message: nameNotValid[0].message! };
    } else {
      headers[index].error['name'] = { invalid: false, message: '' };
    }

    if (valueUndefined) {
      headers[index].error['value'] = { invalid: true, message: valueUndefined[0].message! };
    } else if (valueNotBlank) {
      headers[index].error['value'] = { invalid: true, message: valueNotBlank[0].message! };
    } else if (valueNotValid) {
      headers[index].error['value'] = { invalid: true, message: valueNotValid[0].message! };
    } else {
      headers[index].error['value'] = { invalid: false, message: '' };
    }
    return headers;
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
            <FormGroup className={locals.descriptionInput}>
              <Label htmlFor="url" hasError={!field.valid && field.touched}>
                {t('in-synthetics:dialog.createTest.requestStep.labelUrl')}
              </Label>
              <Input
                name="url"
                value={field.value}
                onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                  updateForm(
                    form.updateIn(['configuration', 'url'], (field: Item) =>
                      (field as Field<string>).setValue(target?.value).setTouched(true)
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
        {headers.map(header => {
          return (
            <Stack direction="horizontal" component="li" key={header.id}>
              <FormGroup className={locals.descriptionInput}>
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
              <FormGroup className={locals.descriptionInput}>
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
                <SvgIcon type="lib_actions_delete" onClick={() => deleteHeaderAction(header.id)} />
              </div>
            </Stack>
          );
        })}
        <section>{invalidHeader.invalid && <ValidationBlock>{invalidHeader.message}</ValidationBlock>}</section>
        <div>
          <Button
            className={locals.validationsBtn}
            kind="action"
            icon="lib_openclose_add_circle_outline"
            onClick={addNewHeaderRow}
          >
            {t('in-synthetics:dialog.createTest.advancedMode.configStep.addHeader')}
          </Button>
        </div>
      </div>
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
      <div className={locals.configContainer}>
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
      </div>
      <div className={locals.configContainer}>
        <ValidationSection
          form={form}
          updateForm={updateForm}
          expectSelections={expectSelections}
          setExpectSelections={setExpectSelections}
          setInvalidJSON={setInvalidJSON}
          invalidJSON={invalidJSON}
        />
      </div>
      <div className={locals.configContainer}>
        <Stack direction="horizontal">
          <CheckboxFancy
            wrapperClassName={locals.configCheckbox}
            onChange={({ target }) => {
              updateForm(
                form.updateIn(['configuration', 'followRedirect'], (field: Item) =>
                  (field as Field<boolean>).setValue(target.checked).setTouched(true)
                )
              );
            }}
            checked={followRedirect.value}
            size="larger"
            label={t('in-synthetics:dialog.createTest.advancedMode.configStep.followRedirect')}
            disabled={false}
          />
          <CheckboxFancy
            wrapperClassName={locals.configCheckbox}
            onChange={({ target }) => {
              updateForm(
                form.updateIn(['configuration', 'allowInsecure'], (field: Item) =>
                  (field as Field<boolean>).setValue(target.checked).setTouched(true)
                )
              );
            }}
            checked={allowInsecure.value}
            size="larger"
            label={t('in-synthetics:dialog.createTest.advancedMode.configStep.allowInsecure')}
            disabled={false}
          />
        </Stack>
      </div>
    </div>
  );
}
