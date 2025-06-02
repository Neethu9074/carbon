/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, Item, MapForm, createField } from 'formalistic';
import React, { useState } from 'react';

import { CarbonStack as Stack, RadioButton, CarbonCheckbox as Checkbox, Typography } from '@instana/components';

import { getRetryIntervalDescriptionText } from 'in-synthetics/utils/getRetryIntervalDescriptionText';
import Section, { ActionTitle, Description } from 'in-synthetics/createTests/wizard/Section';
import { timeoutValidator } from 'in-synthetics/createTests/validators/configValidators';
import { displayRetryIntervalSlider } from 'in-synthetics/utils/sliderHelperFunctions';
import { Invalid, retriesObject, timeoutObject } from 'in-synthetics/utils/constants';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import isBrowserTestType from 'in-synthetics/utils/isBrowserTestType';
import { numberValidator } from 'in-services/validators/jsonType';
import { minValidator } from 'in-services/validators/number';
import FormGroup from 'in-components/form/FormGroup';
import { Col, Row } from 'in-components/layout/Grid';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/advanced/ConfigurationSection.mless';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  invalidTimeout: Invalid;
  setInvalidTimeout: React.Dispatch<React.SetStateAction<Invalid>>;
}

export default function ConfigurationCommonSection({ form, updateForm, invalidTimeout, setInvalidTimeout }: Props) {
  const configForm = form.get('configuration') as MapForm<any>;
  const syntheticType = configForm.get('syntheticType') as Field<string>;
  const timeoutField = configForm.get('timeout') as Field<string>;
  const retriesField = configForm.get('retries') as Field<number>;
  const retryIntervalField = configForm.get('retryInterval') as Field<number>;
  const [timeout, setTimeout] = useState({
    value: timeoutField.value.replace(/\D/g, ''),
    unit: timeoutField.value.replace(/\d/g, '')
  });
  const selectedUnit = Object.keys(timeoutObject).filter(item => timeoutObject[item].value === timeout.unit)[0];
  const isBrowserTest: boolean = isBrowserTestType(syntheticType.value);

  return (
    <>
      <div className={locals.configContainer}>
        <Stack gap={4}>
          <Typography variant="body-bold">
            {t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutAndRetrySectionLabel')}
          </Typography>
          <FormGroup className={locals.descriptionInput}>
            <Label className={locals.timeoutLabel}>
              {t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutFieldLabel')}
            </Label>
            <div className={locals.subText}>
              {t('in-synthetics:dialog.createTest.advancedMode.configStep.timeUnitsLabel')}
            </div>
            <Row className={locals.row}>
              {Object.keys(timeoutObject).map(unit => (
                <Col lg={4} key={unit}>
                  <RadioButton
                    key={unit}
                    label={timeoutObject[unit].label}
                    checked={timeoutObject[unit].value === timeout.unit}
                    onChange={() => {
                      setTimeout({ value: '0', unit: timeoutObject[unit].value });
                      updateForm(
                        form.updateIn(['configuration', 'timeout'], (field: Item) =>
                          (field as Field<string>).setValue('0' + timeoutObject[unit].value).setTouched(true)
                        )
                      );
                    }}
                  />
                </Col>
              ))}
            </Row>
            <Stack orientation="horizontal">
              <div className={locals.alignText}>
                {t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutFieldDescription')}
              </div>
              <Input
                name="timeout"
                hasError={invalidTimeout.invalid && timeoutField.touched}
                value={timeout.value}
                onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                  setTimeout({ value: target?.value, unit: timeout.unit });
                  const timeoutInvalid = timeoutValidator(target?.value, timeout.unit);
                  setInvalidTimeout({ invalid: timeoutInvalid[0].invalid, message: timeoutInvalid[0].message });
                  updateForm(
                    form.updateIn(['configuration', 'timeout'], (field: Item) =>
                      (field as Field<string>)
                        .setValue(Number(target?.value).toString() + timeout.unit)
                        .setTouched(true)
                    )
                  );
                }}
              />
              <div className={locals.alignText}>{timeoutObject[selectedUnit]?.label}</div>
            </Stack>
            {invalidTimeout.invalid && <ValidationBlock>{invalidTimeout.message}</ValidationBlock>}
          </FormGroup>
          <FormGroup className={locals.headerInput}>
            <Label>{t('in-synthetics:dialog.createTest.advancedMode.configStep.retryFieldLabel')}</Label>
            <Row className={locals.row}>
              {retriesObject.map(retry => (
                <Col lg={4} key={retry.value}>
                  <RadioButton
                    key={retry.value}
                    label={retry.label}
                    checked={retry.value === retriesField.value}
                    onChange={() => {
                      if (retry.value === 0) {
                        updateForm(
                          form
                            .updateIn(['configuration', 'retries'], (field: Item) =>
                              (field as Field<number>).setValue(retry.value).setTouched(true)
                            )
                            .updateIn(['configuration', 'retryInterval'], (field: Item) =>
                              (field as Field<number>).setValue(1).setTouched(true)
                            )
                        );
                      } else {
                        updateForm(
                          form
                            .put(
                              'configuration',
                              form.get('configuration').put(
                                'retryInterval',
                                createField({
                                  value: 1,
                                  validator: composeAndShortCircuitOnError(numberValidator, minValidator(1))
                                })
                              )
                            )
                            .updateIn(['configuration', 'retries'], (field: Item) =>
                              (field as Field<number>).setValue(retry.value).setTouched(true)
                            )
                        );
                      }
                    }}
                  />
                </Col>
              ))}
            </Row>

            {(retriesField.value === 1 || retriesField.value === 2) && (
              <Section>
                <ActionTitle>
                  {t('in-synthetics:dialog.createTest.advancedMode.configStep.retryIntervalFieldLabel')}
                </ActionTitle>
                <Description>
                  {getRetryIntervalDescriptionText(retriesField.value, retryIntervalField.value)}
                </Description>
                {displayRetryIntervalSlider(retryIntervalField, form, updateForm)}
                <TouchedMessages field={retryIntervalField} />
              </Section>
            )}
          </FormGroup>
        </Stack>
      </div>
      <div className={locals.configContainer}>
        <Stack gap={6}>
          <Typography variant="body-bold">
            {t('in-synthetics:dialog.createTest.advancedMode.configStep.additionalOptionsSectionLabel')}
          </Typography>
          <Stack orientation="horizontal">
            {syntheticType.value === 'HTTPAction' && (
              <>
                <Checkbox
                  id="followRedirect"
                  onChange={({ target }) => {
                    updateForm(
                      form.updateIn(['configuration', 'followRedirect'], (field: Item) =>
                        (field as Field<boolean>).setValue(target.checked).setTouched(true)
                      )
                    );
                  }}
                  checked={(configForm.get('followRedirect') as Field<boolean>).value}
                  labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.followRedirect')}
                />
                <Checkbox
                  id="allowInsecure"
                  onChange={({ target }) => {
                    updateForm(
                      form.updateIn(['configuration', 'allowInsecure'], (field: Item) =>
                        (field as Field<boolean>).setValue(target.checked).setTouched(true)
                      )
                    );
                  }}
                  checked={(configForm.get('allowInsecure') as Field<boolean>).value}
                  labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.allowInsecure')}
                />
              </>
            )}
            {syntheticType.value === 'SSLCertificate' ? (
              <Checkbox
                id="acceptSelfSignedCertificate"
                checked={(configForm.get('acceptSelfSignedCertificate') as Field<boolean>).value}
                labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.acceptSelfSignedCertificate')}
                onChange={({ target }) => {
                  updateForm(
                    form.updateIn(['configuration', 'acceptSelfSignedCertificate'], (field: Item) =>
                      (field as Field<boolean>).setValue(target.checked).setTouched(true)
                    )
                  );
                }}
              />
            ) : (
              <Checkbox
                id="markSyntheticCall"
                onChange={({ target }) => {
                  updateForm(
                    form.updateIn(['configuration', 'markSyntheticCall'], (field: Item) =>
                      (field as Field<boolean>).setValue(target.checked).setTouched(true)
                    )
                  );
                }}
                checked={(configForm.get('markSyntheticCall') as Field<boolean>).value}
                labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.markSyntheticCall')}
              />
            )}
            {isBrowserTest && (
              <Checkbox
                id="recordVideo"
                checked={(configForm.get('recordVideo') as Field<boolean>).value}
                labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.recordVideo')}
                onChange={({ target }) => {
                  updateForm(
                    form.updateIn(['configuration', 'recordVideo'], (field: Item) =>
                      (field as Field<boolean>).setValue(target.checked).setTouched(true)
                    )
                  );
                }}
              />
            )}
          </Stack>
        </Stack>
      </div>
    </>
  );
}
