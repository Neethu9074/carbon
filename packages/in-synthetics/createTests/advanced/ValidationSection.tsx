/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm, ValidationResult } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Button, Stack, SvgIcon } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

// @ts-expect-error Module needs to be translated to TS
import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import { Validations } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { Placeholders, Validation } from 'in-synthetics/utils/constants';
import { notBlankValidator } from 'in-services/validators/string';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { ErrorType } from 'in-synthetics/utils/constants';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/advanced/ConfigurationSection.mless';

interface ValidationProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  expectSelections: Validation[];
  setExpectSelections: React.Dispatch<React.SetStateAction<Validation[]>>;
  invalidJSON: ErrorType;
  setInvalidJSON: React.Dispatch<React.SetStateAction<ErrorType>>;
}

export default function ValidationSection({
  form,
  updateForm,
  expectSelections,
  setExpectSelections,
  invalidJSON,
  setInvalidJSON
}: ValidationProps) {
  const configForm = form.get('configuration') as MapForm<any>;
  const expectStatus = configForm.get('expectStatus') as Field<string>;
  const expectMatch = configForm.get('expectMatch') as Field<string>;

  function addNewValidationRow() {
    setExpectSelections([...expectSelections, { id: generateUniqueShortId(), key: '', value: '', fieldName: '' }]);
  }

  function deleteHeaderAction(index: string, field: string) {
    expectSelections.splice(
      expectSelections.findIndex(selection => selection.id === index),
      1
    );
    setExpectSelections([...expectSelections]);
    resetFields(field);
  }

  function resetFields(field: string) {
    switch (field) {
      case 'expectStatus':
        updateForm(
          form.updateIn(['configuration', field], (field: Item) =>
            (field as Field<string>).setValue('').setTouched(false)
          )
        );
        break;
      case 'expectJson':
        setInvalidJSON({ invalid: false, message: '' });
        updateForm(
          form.updateIn(['configuration', field], (field: Item) =>
            (field as Field<Record<string, string>>).setValue({}).setTouched(false)
          )
        );
        break;
      case 'expectMatch':
        updateForm(
          form.updateIn(['configuration', field], (field: Item) =>
            (field as Field<string>).setValue('').setTouched(false)
          )
        );
        break;
    }
  }

  return (
    <div>
      {expectSelections.map(selection => {
        return (
          <Stack direction="horizontal" key={selection.id}>
            <FormGroup className={locals.statusBox}>
              <ComboBox
                name={'validation'}
                value={selection.key}
                options={Validations}
                defaultValue={Validations[0].value}
                isClearable={false}
                onChange={e => {
                  if (e != null && !(e instanceof Array)) {
                    const updatedSelections = expectSelections.slice();
                    for (let i = 0; i < updatedSelections.length; i++) {
                      if (updatedSelections[i].id === selection.id) {
                        updatedSelections[i].key = e.value;
                        updatedSelections[i].value =
                          selection.key === 'Expect Status'
                            ? '200'
                            : selection.key === 'Expect JSON'
                            ? JSON.stringify({})
                            : '';
                        updatedSelections[i].fieldName = Placeholders[e.value].field;
                      }
                    }
                    setExpectSelections([...updatedSelections]);
                    resetFields(selection.fieldName);
                  }
                }}
                isOptionDisabled={option =>
                  expectSelections.filter(selection => selection.key === option.value).length > 0
                }
              />
            </FormGroup>
            {selection.key !== '' && (
              <FormGroup className={locals.descriptionInput}>
                <>
                  {selection.key !== 'Expect JSON' ? (
                    <>
                      <Input
                        name={selection.fieldName}
                        placeholder={Placeholders[selection.key].label}
                        value={selection.value.toString()}
                        hasError={
                          selection.key === 'Expect Status'
                            ? !expectStatus.valid && expectStatus.touched
                            : !expectMatch.valid && expectMatch.touched
                        }
                        onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                          const updatedSelections = expectSelections.slice();
                          for (let i = 0; i < updatedSelections.length; i++) {
                            if (updatedSelections[i].id === selection.id) {
                              updatedSelections[i].value = target.value;
                            }
                          }
                          setExpectSelections([...updatedSelections]);
                          updateForm(
                            form.updateIn(['configuration', selection.fieldName], (field: Item) =>
                              (field as Field<string>).setValue(target.value).setTouched(true)
                            )
                          );
                        }}
                      />
                      {selection.key === 'Expect Status'
                        ? !expectStatus.valid && expectStatus.touched && <TouchedMessages field={expectStatus} />
                        : !expectMatch.valid && expectMatch.touched && <TouchedMessages field={expectMatch} />}
                    </>
                  ) : (
                    <>
                      <DebouncedTextArea
                        rows={7}
                        name="expectJson"
                        placeholder={Placeholders[selection.key].label}
                        value={selection.value}
                        hasError={invalidJSON.invalid}
                        onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                          const valueNotBlank: ValidationResult = notBlankValidator(target.value);
                          const valueUndefined: ValidationResult = notUndefinedValidator(target.value);
                          if (valueUndefined) {
                            setInvalidJSON({ invalid: true, message: valueUndefined[0].message! });
                          } else if (valueNotBlank) {
                            setInvalidJSON({ invalid: true, message: valueNotBlank[0].message! });
                          } else {
                            let config: {};
                            try {
                              config = JSON.parse(target.value);
                              if (!config || typeof config !== 'object') {
                                setInvalidJSON({
                                  invalid: true,
                                  message: t(
                                    'in-synthetics:dialog.createTest.advancedMode.configStep.jsonRootMustBeAnObject'
                                  )
                                });
                              } else {
                                const updatedSelections = expectSelections.slice();
                                for (let i = 0; i < updatedSelections.length; i++) {
                                  if (updatedSelections[i].id === selection.id) {
                                    updatedSelections[i].value = JSON.stringify(config);
                                  }
                                }
                                setExpectSelections([...updatedSelections]);
                                updateForm(
                                  form.updateIn(['configuration', 'expectJson'], (field: Item) =>
                                    (field as Field<Record<string, string>>).setValue(config).setTouched(true)
                                  )
                                );
                                setInvalidJSON({ invalid: false, message: '' });
                              }
                            } catch {
                              setInvalidJSON({
                                invalid: true,
                                message: t(
                                  'in-synthetics:dialog.createTest.advancedMode.configStep.failedToParseInputAsJson'
                                )
                              });
                            }
                          }
                        }}
                      />
                      {invalidJSON.invalid && <ValidationBlock>{invalidJSON.message}</ValidationBlock>}
                    </>
                  )}
                </>
              </FormGroup>
            )}
            <div className={classNames(locals.deleteAction, locals.deleteValidation)}>
              <SvgIcon
                type="lib_actions_delete"
                onClick={() => deleteHeaderAction(selection.id, selection.fieldName)}
              />
            </div>
          </Stack>
        );
      })}
      {expectSelections.length !== 3 && (
        <Button
          className={locals.validationsBtn}
          kind="action"
          onClick={addNewValidationRow}
          icon="lib_openclose_add_circle_outline"
        >
          {t('in-synthetics:dialog.createTest.advancedMode.configStep.addValidations')}
        </Button>
      )}
    </div>
  );
}
