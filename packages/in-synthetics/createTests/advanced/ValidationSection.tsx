/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Button, Stack, SvgIcon } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

// @ts-expect-error Module needs to be translated to TS
import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import { expectJson, expectStatus, placeholders, Validation } from 'in-synthetics/utils/constants';
import { Validations } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import { jsonValidator } from 'in-synthetics/createTests/validators/jsonValidator';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
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
  const expectStatusField = configForm.get('expectStatus') as Field<string>;
  const expectMatchField = configForm.get('expectMatch') as Field<string>;

  function addNewValidationRow() {
    setExpectSelections([...expectSelections, { id: generateUniqueShortId(), key: '', value: '', fieldName: '' }]);
  }

  function deleteHeaderAction(index: string, field: string) {
    expectSelections.splice(
      expectSelections.findIndex(selection => selection.id === index),
      1
    );
    setExpectSelections([...expectSelections]);
    resetFields(field, 'delete');
  }

  function resetFields(field: string, action: string) {
    switch (field) {
      case 'expectStatus':
        updateForm(
          form.updateIn(['configuration', field], (field: Item) =>
            (field as Field<string>).setValue(action === 'delete' ? '' : '200').setTouched(false)
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
                    // stores the previous expect option which was selected in the combobox
                    let previousKey;
                    for (let i = 0; i < updatedSelections.length; i++) {
                      if (updatedSelections[i].id === selection.id) {
                        previousKey = updatedSelections[i].key;
                        if (previousKey === expectJson) {
                          setInvalidJSON({ invalid: false, message: '' });
                        }
                        updatedSelections[i].key = e.value;
                        updatedSelections[i].value =
                          selection.key === expectStatus
                            ? '200'
                            : selection.key === expectJson
                            ? JSON.stringify({})
                            : '';
                        updatedSelections[i].fieldName = placeholders[e.value].field;
                      }
                    }
                    // previousKey does not exist if it's a newly added row
                    if (previousKey) {
                      if (selection.key == expectStatus) {
                        if (previousKey === 'Expect JSON') {
                          updateForm(
                            form
                              .updateIn(['configuration', 'expectStatus'], (field: Item) =>
                                (field as Field<string>).setValue('200').setTouched(false)
                              )
                              .updateIn(['configuration', 'expectJson'], (field: Item) =>
                                (field as Field<Record<string, string>>).setValue({}).setTouched(false)
                              )
                          );
                        } else {
                          updateForm(
                            form
                              .updateIn(['configuration', 'expectStatus'], (field: Item) =>
                                (field as Field<string>).setValue('200').setTouched(false)
                              )
                              .updateIn(['configuration', 'expectMatch'], (field: Item) =>
                                (field as Field<string>).setValue('').setTouched(false)
                              )
                          );
                        }
                      } else if (selection.key == expectJson) {
                        updateForm(
                          form
                            .updateIn(['configuration', 'expectJson'], (field: Item) =>
                              (field as Field<Record<string, string>>).setValue({}).setTouched(false)
                            )
                            .updateIn(['configuration', placeholders[previousKey!].field], (field: Item) =>
                              (field as Field<string>).setValue('').setTouched(false)
                            )
                        );
                      } else if (selection.key == 'Expect Match') {
                        if (previousKey === 'Expect JSON') {
                          updateForm(
                            form
                              .updateIn(['configuration', 'expectMatch'], (field: Item) =>
                                (field as Field<string>).setValue('').setTouched(false)
                              )
                              .updateIn(['configuration', 'expectJson'], (field: Item) =>
                                (field as Field<Record<string, string>>).setValue({}).setTouched(false)
                              )
                          );
                        } else {
                          updateForm(
                            form
                              .updateIn(['configuration', 'expectMatch'], (field: Item) =>
                                (field as Field<string>).setValue('').setTouched(false)
                              )
                              .updateIn(['configuration', 'expectStatus'], (field: Item) =>
                                (field as Field<string>).setValue('').setTouched(false)
                              )
                          );
                        }
                      }
                    } else {
                      resetFields(selection.fieldName, 'add');
                    }
                    setExpectSelections([...updatedSelections]);
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
                  {selection.key !== expectJson ? (
                    <>
                      <Input
                        name={selection.fieldName}
                        placeholder={placeholders[selection.key].label}
                        value={selection.value.toString()}
                        hasError={
                          selection.key === expectStatus
                            ? !expectStatusField.valid && expectStatusField.touched
                            : !expectMatchField.valid && expectMatchField.touched
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
                      {selection.key === expectStatus
                        ? !expectStatusField.valid &&
                          expectStatusField.touched && <TouchedMessages field={expectStatusField} />
                        : !expectMatchField.valid &&
                          expectMatchField.touched && <TouchedMessages field={expectMatchField} />}
                    </>
                  ) : (
                    <>
                      <DebouncedTextArea
                        rows={7}
                        name="expectJson"
                        placeholder={placeholders[selection.key].label}
                        value={selection.value}
                        hasError={invalidJSON.invalid}
                        onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                          const validation = jsonValidator(target.value);
                          if (!validation[0].invalid) {
                            const config = JSON.parse(target.value);
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
                          }
                          setInvalidJSON({ invalid: validation[0].invalid, message: validation[0].message });
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
