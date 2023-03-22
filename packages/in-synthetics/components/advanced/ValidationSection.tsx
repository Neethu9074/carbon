/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { Button, Stack } from '@instana/components';

// @ts-expect-error
import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { Validations } from 'in-synthetics/form/createSyntheticTestForm';
import { AdvancedModeProps } from 'in-synthetics/utils/constants';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

import locals from './ConfigurationSection.mless';

interface Visible {
  combo0: boolean;
  combo1: boolean;
  combo2: boolean;
}

export interface Selection {
  combo0: string;
  combo1: string;
  combo2: string;
}

interface ValidationProps extends AdvancedModeProps {
  isVisible: Visible;
  setIsVisible: React.Dispatch<React.SetStateAction<Visible>>;
  comboBoxSelections: Selection;
  setComboBoxSelections: React.Dispatch<React.SetStateAction<Selection>>;
}

export default function ValidationSection({
  form,
  updateForm,
  isVisible,
  setIsVisible,
  comboBoxSelections,
  setComboBoxSelections
}: ValidationProps) {
  const configForm = form.get('configuration') as MapForm;
  const expectedStatus = configForm.get('expectedStatus') as Field<string>;
  const expectedJSON = configForm.get('expectedJSON') as Field<string>;
  const expectedMatch = configForm.get('expectedMatch') as Field<string>;

  const statusElement = (
    <>
      <Input
        name="expectedStatus"
        placeholder={t('in-synthetics:dialog.createTest.advancedMode.configStep.expectStatusPlaceholder')}
        value={expectedStatus.value}
        hasError={!expectedStatus.valid && expectedStatus.touched}
        onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
          updateForm(
            form.updateIn(['configuration', 'expectedStatus'], (field: Item) =>
              (field as Field<string>).setValue(target.value).setTouched(true)
            )
          );
        }}
      />
      <TouchedMessages field={expectedStatus} />
    </>
  );

  const JSONElement = (
    <>
      <DebouncedTextArea
        rows={7}
        name="expectedJSON"
        placeholder={t('in-synthetics:dialog.createTest.advancedMode.configStep.expectJSONPlaceholder')}
        value={expectedJSON.value}
        hasError={!expectedJSON.valid && expectedJSON.touched}
        onChange={({ target }: React.ChangeEvent<any>) => {
          updateForm(
            form.updateIn(['configuration', 'expectedJSON'], (field: Item) =>
              (field as Field<string>).setValue(target.value).setTouched(true)
            )
          );
        }}
      />
      <TouchedMessages field={expectedJSON} />
    </>
  );

  const matchElement = (
    <>
      <Input
        name="expectedMatch"
        placeholder={t('in-synthetics:dialog.createTest.advancedMode.configStep.expectMatchPlaceholder')}
        value={expectedMatch.value}
        hasError={!expectedMatch.valid && expectedMatch.touched}
        onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
          updateForm(
            form.updateIn(['configuration', 'expectedMatch'], (field: Item) =>
              (field as Field<string>).setValue(target.value).setTouched(true)
            )
          );
        }}
      />
      <TouchedMessages field={expectedMatch} />
    </>
  );

  const resetStatus = () => {
    updateForm(
      form.updateIn(['configuration', 'expectedStatus'], (field: Item) =>
        (field as Field<string>).setValue('200').setTouched(false)
      )
    );
  };

  const resetJSON = () => {
    updateForm(
      form.updateIn(['configuration', 'expectedJSON'], (field: Item) =>
        (field as Field<string>).setValue('').setTouched(false)
      )
    );
  };

  const resetMatch = () => {
    updateForm(
      form.updateIn(['configuration', 'expectedMatch'], (field: Item) =>
        (field as Field<string>).setValue('').setTouched(false)
      )
    );
  };

  function addNewValidationRow() {
    resetFields(comboBoxSelections.combo0, comboBoxSelections.combo1);
    if (isVisible.combo1) {
      setIsVisible({ combo0: true, combo1: true, combo2: true });
    } else {
      setIsVisible({ combo0: true, combo1: true, combo2: false });
    }
  }

  function resetFields(selection0: string, selection1: string) {
    if (selection0 === 'Expect Status') {
      if (selection1 !== '' && isVisible.combo1) {
        if (selection1 === 'Expect JSON') resetMatch();
        else resetJSON();
      } else {
        resetMatch();
        resetJSON();
      }
    } else if (selection0 === 'Expect JSON') {
      if (selection1 !== '' && isVisible.combo1) {
        if (selection1 === 'Expect Status') resetMatch();
        else resetStatus();
      } else {
        resetMatch();
        resetStatus();
      }
    } else if (selection0 === 'Expect Match') {
      if (selection1 !== '' && isVisible.combo1) {
        if (selection1 === 'Expect Status') resetJSON();
        else resetStatus();
      } else {
        resetJSON();
        resetStatus();
      }
    } else {
      resetStatus();
      resetJSON();
      resetMatch();
    }
  }

  return (
    <div>
      {isVisible.combo0 && (
        <Stack direction="horizontal">
          <FormGroup className={locals.statusBox}>
            <ComboBox
              name={'validation'}
              value={comboBoxSelections.combo0}
              options={Validations}
              defaultValue={Validations[0].value}
              isClearable={false}
              onChange={e => {
                if (e != null && !(e instanceof Array)) {
                  setComboBoxSelections({
                    combo0: e.value,
                    combo1: comboBoxSelections.combo1,
                    combo2: comboBoxSelections.combo2
                  });
                  resetFields(e.value, comboBoxSelections.combo1);
                }
              }}
              isOptionDisabled={option =>
                option.value === comboBoxSelections.combo1 || option.value === comboBoxSelections.combo2
              }
            />
          </FormGroup>
          {comboBoxSelections.combo0 !== '' && (
            <FormGroup className={locals.descriptionInput}>
              {comboBoxSelections.combo0 === Validations[0].value
                ? statusElement
                : comboBoxSelections.combo0 === Validations[1].value
                ? JSONElement
                : matchElement}
            </FormGroup>
          )}
        </Stack>
      )}
      {isVisible.combo1 && (
        <Stack direction="horizontal">
          <FormGroup className={locals.statusBox}>
            <ComboBox
              name={'validation'}
              value={comboBoxSelections.combo1}
              options={Validations}
              isClearable={false}
              onChange={e => {
                if (e != null && !(e instanceof Array)) {
                  setComboBoxSelections({
                    combo0: comboBoxSelections.combo0,
                    combo1: e.value,
                    combo2: comboBoxSelections.combo2
                  });
                  resetFields(comboBoxSelections.combo0, e.value);
                }
              }}
              isOptionDisabled={option =>
                option.value === comboBoxSelections.combo0 || option.value === comboBoxSelections.combo2
              }
            />
          </FormGroup>
          {comboBoxSelections.combo1 !== '' && (
            <FormGroup className={locals.descriptionInput}>
              {comboBoxSelections.combo1 === Validations[0].value
                ? statusElement
                : comboBoxSelections.combo1 === Validations[1].value
                ? JSONElement
                : matchElement}
            </FormGroup>
          )}
        </Stack>
      )}
      {isVisible.combo2 && (
        <Stack direction="horizontal">
          <FormGroup className={locals.statusBox}>
            <ComboBox
              name={'validation'}
              value={comboBoxSelections.combo2}
              options={Validations}
              isClearable={false}
              onChange={e => {
                if (e != null && !(e instanceof Array)) {
                  setComboBoxSelections({
                    combo0: comboBoxSelections.combo0,
                    combo1: comboBoxSelections.combo1,
                    combo2: e.value
                  });
                }
              }}
              isOptionDisabled={option =>
                option.value === comboBoxSelections.combo0 || option.value === comboBoxSelections.combo1
              }
            />
          </FormGroup>
          {comboBoxSelections.combo2 !== '' && (
            <FormGroup className={locals.descriptionInput}>
              {comboBoxSelections.combo2 === Validations[0].value
                ? statusElement
                : comboBoxSelections.combo2 === Validations[1].value
                ? JSONElement
                : matchElement}
            </FormGroup>
          )}
        </Stack>
      )}
      {(!isVisible.combo0 || !isVisible.combo1 || !isVisible.combo2) && (
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
