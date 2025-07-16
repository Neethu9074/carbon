/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React, { useState } from 'react';
import { createField, Field, Item, MapForm } from 'formalistic';

import {
  CarbonStack as Stack,
  CarbonRadioButton as RadioButton,
  Typography,
  ValidationBlock,
  CarbonDropdown as Dropdown,
  CarbonNumberInput as NumberInput,
  CarbonMultiSelect as MultiSelect,
  CarbonColumn as Col,
  CarbonRow as Row
} from '@instana/components';
import { SyntheticLocation } from '@instana/types';

import getDefaultCustomProperties from 'in-synthetics/createTests/utils/getDefaultCustomProperties';
import CustomPropertiesSection from 'in-synthetics/createTests/advanced/CustomPropertiesSection';
import { timeoutValidator } from 'in-synthetics/createTests/validators/configValidators';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { retriesObject, timeoutObject } from 'in-synthetics/utils/constants';
import { numberValidator } from 'in-services/validators/jsonType';
import { minValidator } from 'in-services/validators/number';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label/Label';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/dialog/CreateSyntheticOnDemandTestDialogPresenter.mless';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  testLocations: string[];
  onlineLocations: SyntheticLocation[];
}
function CreateSyntheticOnDemandTestDialogPresenter({ form, updateForm, testLocations, onlineLocations }: Props) {
  const locationsField = form.get('locations') as Field<string[]>;
  const timeoutField = form.get('configuration').get('timeout') as Field<string>;
  const [invalidTimeout, setInvalidTimeout] = useState({ invalid: false, message: '' });
  const [timeout, setTimeout] = useState({
    value: timeoutField.value.replace(/\D/g, ''),
    unit: timeoutField.value.replace(/\d/g, '')
  });
  const [customProperties, setCustomProperties] = useState(getDefaultCustomProperties(form));
  const [locations, setLocations] = useState<string[]>(testLocations);
  const [invalidCustomProperty, setInvalidCustomProperty] = useState({ invalid: false, message: '' });
  const [retryInterval, setRetryInterval] = useState<number>(1);
  const [retries, setRetries] = useState<number>(0);
  const updateLocations = ({ selectedItems }: { selectedItems: SyntheticLocation[] }) => {
    const selectedId = selectedItems.map(item => item.id!);
    setLocations(selectedId);
    updateForm(
      form.updateIn(['locations'], (field: Item) => (field as Field<string[]>).setValue(selectedId).setTouched(true))
    );
  };
  const customLabel =
    (locations?.length === testLocations.length && testLocations.every(loc => locations.includes(loc))
      ? t('in-synthetics:dialog.createOnDemandTest.multiSelectLabel')
      : onlineLocations
          ?.filter(loc => locations.includes(loc.id!))
          .map(loc => loc.displayLabel)
          .join(', ')) ?? t('in-synthetics:dialog.createTest.advancedMode.selectTests.selectLocation');
  return (
    <>
      <div className={locals.customizationWidth}>
        <Typography variant="body-bold">{t('in-synthetics:dialog.createOnDemandTest.properties')}</Typography>
        <div>
          <Stack gap={4}>
            <Row className={locals.row}>
              <Col sm={2}>
                <FormGroup className={locals.descriptionInput}>
                  <MultiSelect
                    id={'location'}
                    items={onlineLocations ?? []}
                    itemToString={item => item?.displayLabel ?? ''}
                    label={
                      locations.length > 0
                        ? customLabel
                        : t('in-synthetics:dialog.createTest.advancedMode.selectTests.selectLocation')
                    }
                    titleText={t('in-synthetics:dialog.createOnDemandTest.location')}
                    selectedItems={onlineLocations?.filter(loc => locations.includes(loc.id!))}
                    initialSelectedItems={onlineLocations?.filter(loc => testLocations.includes(loc.id!))}
                    onChange={updateLocations}
                    invalid={locationsField.touched && !locationsField.valid}
                    invalidText={locationsField.messages?.[0]?.message ?? ''}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Stack>
        </div>

        <Stack gap={4}>
          <Typography variant="body-bold">
            {t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutAndRetrySectionLabel')}
          </Typography>
          <FormGroup className={locals.descriptionInput}>
            <Label className={locals.timeoutLabel}>
              {t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutFieldLabel')}
            </Label>

            <Row>
              <Col className={locals.col} sm={1}>
                <div className={locals.alignText}>
                  {t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutFieldDescription')}
                </div>
              </Col>
              <Col className={locals.col} sm={1}>
                <NumberInput
                  id="timeout"
                  value={timeout.value}
                  min={0}
                  onChange={(
                    _event: React.MouseEvent<HTMLButtonElement>,
                    state: { value: string | number; direction: string }
                  ) => {
                    const newValue = state.value.toString();

                    // Update local state
                    setTimeout({ value: newValue, unit: timeout.unit });

                    // Validate
                    const [validation] = timeoutValidator(newValue, timeout.unit);
                    setInvalidTimeout({ invalid: validation.invalid, message: validation.message });
                    // Update form
                    updateForm(
                      form.updateIn(['configuration', 'timeout'], (field: Item) =>
                        (field as Field<string>).setValue(`${newValue}${timeout.unit}`).setTouched(true)
                      )
                    );
                  }}
                />
              </Col>
              <Col className={locals.col}>
                <Dropdown
                  id="unit"
                  items={Object.keys(timeoutObject)}
                  itemToString={key => timeoutObject[key!].label}
                  label=""
                  initialSelectedItem={Object.keys(timeoutObject)[0]}
                  titleText=""
                  onChange={({ selectedItem }) => {
                    const newUnit = timeoutObject[selectedItem!]?.value ?? '';
                    selectedItem && setTimeout({ value: timeout.value, unit: newUnit });
                    // Update form
                    updateForm(
                      form.updateIn(['configuration', 'timeout'], (field: Item) =>
                        (field as Field<string>).setValue(`${timeout.value}${newUnit}`).setTouched(true)
                      )
                    );
                  }}
                />
              </Col>
            </Row>

            {invalidTimeout.invalid && <ValidationBlock>{invalidTimeout.message}</ValidationBlock>}
          </FormGroup>
          <Stack gap={4}>
            <FormGroup className={locals.headerInput}>
              <Label>{t('in-synthetics:dialog.createTest.advancedMode.configStep.retryFieldLabel')}</Label>
              <Row className={locals.retryRow}>
                {retriesObject.map(retry => (
                  <RadioButton
                    key={retry.value}
                    labelText={retry.label}
                    checked={retry.value === retries}
                    onChange={() => {
                      setRetries(retry.value);
                      if (retry.value > 0) {
                        updateForm(
                          form.put(
                            'configuration',
                            form
                              .get('configuration')
                              .put(
                                'retries',
                                (form.get('configuration').get('retries') as Field<number>)
                                  .setValue(retry.value)
                                  .setTouched(true)
                              )

                              .put(
                                'retryInterval',
                                createField({
                                  value: 1,
                                  validator: composeAndShortCircuitOnError(numberValidator, minValidator(1))
                                })
                              )
                          )
                        );
                      } else {
                        updateForm(
                          form.updateIn(['configuration', 'retries'], (field: Item) =>
                            (field as Field<number>).setValue(retry.value).setTouched(true)
                          )
                        );
                      }
                    }}
                  />
                ))}
              </Row>
              {(retries === 1 || retries === 2) && (
                <Row>
                  <Col className={locals.col} sm={1}>
                    <div className={locals.alignText}>
                      {t('in-synthetics:dialog.createOnDemandTest.retryInterval', {
                        retryCount: retries === 1 ? 'once' : 'twice'
                      })}
                    </div>
                  </Col>
                  <Col className={locals.col} sm={1}>
                    <NumberInput
                      id="retryInterval"
                      value={retryInterval}
                      min={1}
                      max={10}
                      onChange={(
                        _event: React.MouseEvent<HTMLButtonElement>,
                        state: { value: string | number; direction: string }
                      ) => {
                        const newValue = state.value.toString();
                        setRetryInterval(parseInt(newValue, 10));
                        // Update form
                        updateForm(
                          form.put(
                            'configuration',
                            form.get('configuration').put(
                              'retryInterval',
                              createField({
                                value: newValue,
                                validator: composeAndShortCircuitOnError(numberValidator, minValidator(1))
                              })
                            )
                          )
                        );
                      }}
                    />
                  </Col>
                  <Col className={locals.col}>
                    <Dropdown
                      id="unit"
                      items={Object.keys(timeoutObject)}
                      itemToString={key => timeoutObject[key!].label}
                      label=""
                      initialSelectedItem={Object.keys(timeoutObject)[1]}
                      titleText=""
                      disabled
                    />
                  </Col>
                </Row>
              )}
            </FormGroup>
          </Stack>
        </Stack>
      </div>
      <div className={locals.customProperties}>
        <Stack gap={4}>
          <Typography variant="body-bold">
            {t('in-synthetics:dialog.createTest.advancedMode.customPropertiesTitle')}
          </Typography>
          <CustomPropertiesSection
            form={form}
            updateForm={updateForm}
            customProperties={customProperties}
            setCustomProperties={setCustomProperties}
            invalidCustomProperty={invalidCustomProperty}
            setInvalidCustomProperty={setInvalidCustomProperty}
            runNow
          />
        </Stack>
      </div>
    </>
  );
}
export default CreateSyntheticOnDemandTestDialogPresenter;
