/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React, { useState } from 'react';
import classNames from 'classnames';

import { Button, Stack, SvgIcon } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

// @ts-expect-error Module needs to be translated to TS
import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import ValidationSection from 'in-synthetics/components/advanced/ValidationSection';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { HTTPMethods } from 'in-synthetics/form/createSyntheticTestForm';
import { Validation } from 'in-synthetics/utils/constants';
import ComboBox from 'in-components/ComboBox/ComboBox';
import { Header } from 'in-synthetics/utils/constants';
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
  const headersField = configForm.get('headers') as Field<Record<string, string>>;
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
  const getDefaultHeaders = (): Header[] => {
    const headersValue = (configForm.get('headers') as Field<Record<string, string>>).value;
    const headerObject: Header[] = [];
    Object.keys(headersValue).map(key =>
      headerObject.push({ id: generateUniqueShortId(), key: key, value: headersValue[key] })
    );
    return headerObject;
  };
  const [headers, setHeaders] = useState(getDefaultHeaders());
  const [isDuplicateHeader, setIsDuplicateHeader] = useState(false);

  const [expectSelections, setExpectSelections] = useState(getDefaultExpectValues());
  const [invalidJSON, setInvalidJSON] = useState({ invalid: false, message: '' });

  function addNewHeaderRow() {
    setHeaders([...headers, { id: generateUniqueShortId(), key: '', value: '' }]);
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
    updateHeaders(true);
  }

  function updateHeaders(isDeleteAction: boolean) {
    updateForm(
      form.updateIn(['configuration', 'headers'], (field: Item) =>
        (field as Field<{ [index: string]: string }>)
          .setValue(
            headers.reduce((headerObj: { [index: string]: string }, h: Header) => {
              if (isNotBlank(h.key) || isNotBlank(h.value)) headerObj[h.key] = h.value;
              return headerObj;
            }, {})
          )
          .setTouched(!isDeleteAction)
      )
    );
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
                  hasError={!headersField.valid && headersField.touched && header.key === ''}
                  onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                    const updatedHeaders = headers.slice();
                    let hasDuplicateHeader = false;
                    for (let i = 0; i < updatedHeaders.length; i++) {
                      if (updatedHeaders[i].id === header.id) {
                        updatedHeaders[i].key = target.value;
                        if (
                          updatedHeaders.filter(h => isNotBlank(h.key) && h.key === updatedHeaders[i].key).length > 1
                        ) {
                          hasDuplicateHeader = true;
                        }
                      }
                    }
                    setHeaders([...updatedHeaders]);
                    setIsDuplicateHeader(hasDuplicateHeader);
                    updateHeaders(false);
                  }}
                />
                {!headersField.valid && headersField.touched && header.key === '' && (
                  <TouchedMessages field={headersField} />
                )}
              </FormGroup>
              <FormGroup className={locals.descriptionInput}>
                <Label htmlFor="headerValue">
                  {t('in-synthetics:dialog.createTest.advancedMode.configStep.headerValue')}
                </Label>
                <Input
                  name="headerValue"
                  value={header.value}
                  onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                    const index = headers.findIndex((h: Header) => h.id === header.id);
                    headers[index].value = target.value;
                    setHeaders(headers);
                    updateHeaders(false);
                  }}
                />
              </FormGroup>
              <div className={classNames(locals.deleteAction, locals.deleteHeader)}>
                <SvgIcon type="lib_actions_delete" onClick={() => deleteHeaderAction(header.id)} />
              </div>
            </Stack>
          );
        })}
        <section>
          {isDuplicateHeader && (
            <ValidationBlock>
              {t('in-synthetics:dialog.createTest.advancedMode.configStep.HeadersCannotBeDuplicated')}
            </ValidationBlock>
          )}
        </section>
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
