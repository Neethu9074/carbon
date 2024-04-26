/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, Item, MapForm, createField } from 'formalistic';
import React, { useState } from 'react';

import { Stack } from '@instana/components';

import { getRetryIntervalDescriptionText } from 'in-synthetics/utils/getRetryIntervalDescriptionText';
import Section, { ActionTitle, Description } from 'in-synthetics/createTests/wizard/Section';
import { timeoutValidator } from 'in-synthetics/createTests/validators/configValidators';
import { displayRetryIntervalSlider } from 'in-synthetics/utils/sliderHelperFunctions';
import { Invalid, retriesObject, timeoutObject } from 'in-synthetics/utils/constants';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { numberValidator } from 'in-services/validators/jsonType';
import { minValidator } from 'in-services/validators/number';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/advanced/ConfigurationSection.mless';

interface SSLCertificateProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  invalidTimeout: Invalid;
  setInvalidTimeout: React.Dispatch<React.SetStateAction<Invalid>>;
}

export default function SSLCertificateConfiguration({
  form,
  updateForm,
  invalidTimeout,
  setInvalidTimeout
}: SSLCertificateProps) {
  const configForm = form.get('configuration') as MapForm<any>;
  const hostNameField = configForm.get('hostname') as Field<string>;
  const portField = configForm.get('port') as Field<number>;
  const daysRemainingCheckField = configForm.get('daysRemainingCheck') as Field<number>;
  const timeoutField = configForm.get('timeout') as Field<string>;
  const retriesField = configForm.get('retries') as Field<number>;
  const retryIntervalField = configForm.get('retryInterval') as Field<number>;

  const [timeout, setTimeout] = useState({
    value: timeoutField.value.replace(/\D/g, ''),
    unit: timeoutField.value.replace(/\d/g, '')
  });
  const selectedUnit = Object.keys(timeoutObject).filter(item => timeoutObject[item].value === timeout.unit)[0];

  return (
    <>
      <div className={locals.configContainer}>
        <Stack direction="horizontal">
          <FormGroup className={locals.descriptionInput}>
            <Label>{t('in-synthetics:dialog.createTest.advancedMode.certificateCheck.inputHostName')}</Label>
            <Input
              name="hostName"
              value={hostNameField.value}
              onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                updateForm(
                  form.updateIn(['configuration', 'hostname'], (field: Item) =>
                    (field as Field<string>).setValue(target.value).setTouched(true)
                  )
                );
              }}
              hasError={!hostNameField.valid && hostNameField.touched}
            />
            <TouchedMessages field={hostNameField} />
          </FormGroup>
          <FormGroup className={locals.descriptionInput}>
            <Label>{t('in-synthetics:dialog.createTest.advancedMode.certificateCheck.inputPortNumber')}</Label>
            <Input
              name="portNo"
              value={portField.value}
              onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                updateForm(
                  form.updateIn(['configuration', 'port'], (field: Item) =>
                    (field as Field<number>).setValue(+target.value).setTouched(true)
                  )
                );
              }}
              hasError={!portField.valid && portField.touched}
            />
            <TouchedMessages field={portField} />
          </FormGroup>
        </Stack>
        <FormGroup className={locals.descriptionInput}>
          <Stack direction="horizontal">
            <div className={locals.alignText}>
              {t('in-synthetics:dialog.createTest.advancedMode.certificateCheck.inputDaysLine1')}
            </div>
            <Input
              name="daysRemaining"
              value={daysRemainingCheckField.value}
              onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                updateForm(
                  form.updateIn(['configuration', 'daysRemainingCheck'], (field: Item) =>
                    (field as Field<number>).setValue(+target.value).setTouched(true)
                  )
                );
              }}
              hasError={!daysRemainingCheckField.valid && daysRemainingCheckField.touched}
            />
            <div className={locals.alignText}>
              {t('in-synthetics:dialog.createTest.advancedMode.certificateCheck.inputDaysLine2')}
            </div>
          </Stack>
          <TouchedMessages field={daysRemainingCheckField} />
        </FormGroup>
      </div>
      <div className={locals.configContainer}>
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
                <CheckboxFancy
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
                  asRadioButton
                />
              </Col>
            ))}
          </Row>
          <Stack direction="horizontal">
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
                    (field as Field<string>).setValue(Number(target?.value).toString() + timeout.unit).setTouched(true)
                  )
                );
              }}
            />
            <div className={locals.alignText}>{timeoutObject[selectedUnit]?.label}</div>
          </Stack>
          {invalidTimeout.invalid && <ValidationBlock>{invalidTimeout.message}</ValidationBlock>}
        </FormGroup>
      </div>
      <div className={locals.configContainer}>
        <FormGroup className={locals.descriptionInput}>
          <Label>{t('in-synthetics:dialog.createTest.advancedMode.configStep.retryFieldLabel')}</Label>
          <Row className={locals.row}>
            {retriesObject.map(retry => (
              <Col lg={4} key={retry.value}>
                <CheckboxFancy
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
                  asRadioButton
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
                {getRetryIntervalDescriptionText(retriesField.value, retryIntervalField?.value)}
              </Description>
              {displayRetryIntervalSlider(retryIntervalField, form, updateForm)}
              <TouchedMessages field={retryIntervalField} />
            </Section>
          )}
        </FormGroup>
      </div>
    </>
  );
}
