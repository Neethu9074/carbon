/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { Stack, Typography } from '@instana/components';

import ConfigurationCommonSection from 'in-synthetics/createTests/advanced/ConfigurationCommonSection';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { Invalid } from 'in-synthetics/utils/constants';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label/Label';
import { isBlank } from 'in-services/util/string';
import Input from 'in-components/form/Input';
import { Trans, t } from 'in-i18n';

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

  return (
    <>
      <div className={locals.configContainer}>
        <Typography variant="body-bold">
          {t('in-synthetics:dialog.createTest.advancedMode.configStep.hostDetailsSectionLabel')}
        </Typography>
        <Stack direction="horizontal">
          <FormGroup className={locals.descriptionInput}>
            <Label>{t('in-synthetics:dialog.createTest.advancedMode.certificateCheck.inputHostName')}</Label>
            <Input
              name="hostName"
              data-testid="host-name"
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
              data-testid="port-number"
              value={portField.value}
              onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                updateForm(
                  form.updateIn(['configuration', 'port'], (field: Item) =>
                    (field as Field<number | string>)
                      .setValue(isBlank(target.value) || isNaN(+target.value) ? target.value : +target.value)
                      .setTouched(true)
                  )
                );
              }}
              hasError={!portField.valid && portField.touched}
            />
            <TouchedMessages field={portField} />
          </FormGroup>
        </Stack>
      </div>
      <div className={locals.configContainer}>
        <FormGroup className={locals.descriptionInput}>
          <Typography variant="body-bold">
            {t('in-synthetics:dialog.createTest.advancedMode.certificateCheck.failureConfigLabel')}
          </Typography>
          <Stack direction="horizontal">
            <div className={locals.alignText}>
              <Trans
                i18nKey="in-synthetics:dialog.createTest.advancedMode.certificateCheck.failureConfigText"
                components={{
                  certificateValidityDays: (
                    <Input
                      name="daysRemaining"
                      data-testid="days-remaining"
                      value={daysRemainingCheckField.value}
                      className={locals.validityInput}
                      onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                        updateForm(
                          form.updateIn(['configuration', 'daysRemainingCheck'], (field: Item) =>
                            (field as Field<number | string>)
                              .setValue(isBlank(target.value) || isNaN(+target.value) ? target.value : +target.value)
                              .setTouched(true)
                          )
                        );
                      }}
                      hasError={!daysRemainingCheckField.valid && daysRemainingCheckField.touched}
                    />
                  )
                }}
              />
            </div>
          </Stack>
          <TouchedMessages field={daysRemainingCheckField} />
        </FormGroup>
      </div>
      <ConfigurationCommonSection
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
      />
    </>
  );
}
