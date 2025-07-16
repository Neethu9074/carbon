/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, Item, MapForm } from 'formalistic';
import React, { Fragment } from 'react';

import {
  Stack,
  Typography,
  SvgIcon,
  CarbonDropdown as Dropdown,
  CarbonIconButton as IconButton
} from '@instana/components';
import { TextInput, Button, Stack as CarbonStack } from '@instana/carbon';
import { generateUniqueShortId } from '@instana/utils';

import {
  Invalid,
  AssertionTargetFilter,
  sslAssertionTypes,
  AssertionFilterOperators
} from 'in-synthetics/utils/constants';
import ConfigurationCommonSection from 'in-synthetics/createTests/advanced/ConfigurationCommonSection';
import { assertionValidator } from 'in-synthetics/createTests/validators/validator';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import { syntheticSslImprovementEnabled } from 'in-services/featureFlags';
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
  validationFilters: AssertionTargetFilter[];
  setValidationFilters: React.Dispatch<React.SetStateAction<AssertionTargetFilter[]>>;
}

export default function SSLCertificateConfiguration({
  form,
  updateForm,
  invalidTimeout,
  setInvalidTimeout,
  validationFilters,
  setValidationFilters
}: SSLCertificateProps) {
  const configForm = form.get('configuration') as MapForm<any>;
  const hostNameField = configForm.get('hostname') as Field<string>;
  const portField = configForm.get('port') as Field<number>;
  const daysRemainingCheckField = configForm.get('daysRemainingCheck') as Field<number>;

  function addNewTargetFilterRow() {
    const updatedTargetFilters = [
      ...validationFilters,
      {
        id: generateUniqueShortId(),
        key: '',
        operator: '',
        value: '',
        error: {
          key: {
            invalid: false,
            message: ''
          },
          operator: {
            invalid: false,
            message: ''
          },
          value: {
            invalid: false,
            message: ''
          }
        },
        inValidResolutionRecord: false
      }
    ];
    setValidationFilters([...updatedTargetFilters]);
    updateForm(
      form.updateIn(['configuration', 'validationRules'], (field: Item) =>
        (field as Field<AssertionTargetFilter[]>).setValue([...updatedTargetFilters]).setTouched(true)
      )
    );
  }

  function deleteTargetFilterRow(idToDelete: string) {
    validationFilters.splice(
      validationFilters.findIndex(validationFilter => validationFilter.id === idToDelete),
      1
    );
    setValidationFilters([...validationFilters]);
    updateForm(
      form.updateIn(['configuration', 'validationRules'], (field: Item) =>
        (field as Field<AssertionTargetFilter[]>).setValue([...validationFilters]).setTouched(true)
      )
    );
  }
  return (
    <>
      <div className={locals.configContainer}>
        <Stack gap="xsmall">
          <Typography variant="body-bold">
            {t('in-synthetics:dialog.createTest.advancedMode.configStep.hostDetailsSectionLabel')}
          </Typography>
          <Stack direction="horizontal" gap="small">
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
      {syntheticSslImprovementEnabled && (
        <div className={locals.configContainer}>
          <CarbonStack gap={3}>
            <Fragment>
              <h4 className={locals.headline}>
                <span>{t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.assertionsTitle')}</span>
              </h4>
              <p>{t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.assertionsSubtitle')}</p>
            </Fragment>
            {validationFilters.map(selectedFilter => {
              return (
                <CarbonStack key={selectedFilter.id} className={locals.queryStack} orientation="horizontal" gap={6}>
                  <Dropdown
                    id={generateUniqueShortId()}
                    className={locals.queryWidth}
                    items={sslAssertionTypes}
                    initialSelectedItem={sslAssertionTypes.find(
                      sslAssertionType => sslAssertionType.value === selectedFilter.key
                    )}
                    label=""
                    titleText={t('in-synthetics:dialog.createTest.advancedMode.configStep.ssl.attributeLabel')}
                    type="default"
                    onChange={({ selectedItem }) => {
                      validationFilters.forEach(targetFilter => {
                        if (targetFilter.id === selectedFilter.id) {
                          targetFilter.key = selectedItem!.value;
                          const validator = assertionValidator(
                            selectedFilter,
                            selectedItem?.value!,
                            'key',
                            '',
                            'SSLCertificate'
                          );
                          targetFilter.error = validator.error;
                        }
                      });
                      setValidationFilters([...validationFilters]);
                      updateForm(
                        form.updateIn(['configuration', 'validationRules'], (field: Item) =>
                          (field as Field<AssertionTargetFilter[]>).setValue([...validationFilters]).setTouched(true)
                        )
                      );
                    }}
                  />
                  <Dropdown
                    id={generateUniqueShortId()}
                    className={locals.queryWidth}
                    items={AssertionFilterOperators}
                    initialSelectedItem={AssertionFilterOperators.find(
                      operator => operator.value === selectedFilter.operator
                    )}
                    label=""
                    titleText={t('in-synthetics:dialog.createTest.advancedMode.configStep.operatorLabel')}
                    type="default"
                    onChange={({ selectedItem }) => {
                      validationFilters.forEach(targetFilter => {
                        if (targetFilter.id === selectedFilter.id) {
                          targetFilter.operator = selectedItem!.value;
                          const validator = assertionValidator(
                            selectedFilter,
                            selectedItem?.value!,
                            'operator',
                            '',
                            'SSLCertificate'
                          );
                          targetFilter.error = validator.error;
                        }
                      });
                      setValidationFilters([...validationFilters]);
                      updateForm(
                        form.updateIn(['configuration', 'validationRules'], (field: Item) =>
                          (field as Field<AssertionTargetFilter[]>).setValue([...validationFilters]).setTouched(true)
                        )
                      );
                    }}
                  />
                  <TextInput
                    id={generateUniqueShortId()}
                    className={locals.queryWidth}
                    type="text"
                    value={selectedFilter.value}
                    placeholder={t('in-synthetics:dialog.createTest.advancedMode.configStep.ssl.attributeValueLabel')}
                    labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.ssl.valueLabel')}
                    onChange={({ target }) => {
                      validationFilters.forEach(targetFilter => {
                        if (targetFilter.id === selectedFilter.id) {
                          targetFilter.value = target.value;
                          const validator = assertionValidator(
                            selectedFilter,
                            target?.value,
                            'value',
                            '',
                            'SSLCertificate'
                          );
                          targetFilter.error = validator.error;
                        }
                      });
                      setValidationFilters([...validationFilters]);
                      updateForm(
                        form.updateIn(['configuration', 'validationRules'], (field: Item) => {
                          const valueField = field as Field<AssertionTargetFilter[]>;
                          valueField.setValue([...validationFilters]).setTouched(true);
                          if (valueField.touched && selectedFilter.error.value.invalid) {
                            selectedFilter.inValidResolutionRecord = true;
                          } else {
                            selectedFilter.inValidResolutionRecord = false;
                          }
                          return valueField;
                        })
                      );
                    }}
                    invalid={selectedFilter.inValidResolutionRecord}
                    invalidText={selectedFilter.inValidResolutionRecord ? selectedFilter.error.value.message : ''}
                  />
                  {validationFilters.length > 1 && (
                    <IconButton
                      kind="ghost"
                      onClick={() => deleteTargetFilterRow(selectedFilter.id)}
                      label={t('in-synthetics:dialog.createTest.advancedMode.configStep.deleteButtonLabel')}
                      align="top"
                    >
                      <SvgIcon type="lib_actions_delete" />
                    </IconButton>
                  )}
                </CarbonStack>
              );
            })}
            <Button
              kind="tertiary"
              onClick={addNewTargetFilterRow}
              size="sm"
              renderIcon={() => <IconForButton icon="lib_openclose_add" iconSize="s" />}
            >
              {t('in-synthetics:dialog.createTest.advancedMode.configStep.addFieldLabel')}
            </Button>
          </CarbonStack>
        </div>
      )}
      <ConfigurationCommonSection
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
      />
    </>
  );
}
