/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, Field, Item, MapForm } from 'formalistic';
import React, { ChangeEvent, Fragment, useState } from 'react';

import {
  CarbonStack as Stack,
  CarbonTextInput as TextInput,
  CarbonRadioButtonGroup as RadioButtonGroup,
  CarbonRadioButton as RadioButton,
  CarbonDropdown as Dropdown,
  CarbonCheckbox as Checkbox,
  CarbonIconButton as IconButton,
  CarbonButton as Button,
  Label,
  SvgIcon
} from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { DNSFilterQueryTime } from '@instana/types';

import {
  DNSFilterOperators,
  DNSQueryTypes,
  DNSTransportOptions,
  Invalid,
  retriesObject,
  TargetFilter,
  AssertionTargetFilter,
  timeoutObject,
  assertionQueryTypes
} from 'in-synthetics/utils/constants';
import {
  assertionValidator,
  checkQueryTypeAssertionMismatch
} from 'in-synthetics/createTests/validators/dnsValidators';
import { getRetryIntervalDescriptionText } from 'in-synthetics/utils/getRetryIntervalDescriptionText';
import Section, { ActionTitle, Description } from 'in-synthetics/createTests/wizard/Section';
import { timeoutValidator } from 'in-synthetics/createTests/validators/configValidators';
import { displayRetryIntervalSlider } from 'in-synthetics/utils/sliderHelperFunctions';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import { numberValidator } from 'in-services/validators/jsonType';
import { minValidator } from 'in-services/validators/number';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/advanced/ConfigurationSection.mless';

interface DNSConfigurationProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  targetFilters: AssertionTargetFilter[];
  setTargetFilters: React.Dispatch<React.SetStateAction<AssertionTargetFilter[]>>;
  invalidTimeout: Invalid;
  setInvalidTimeout: React.Dispatch<React.SetStateAction<Invalid>>;
}

export default function DNSConfiguration({
  form,
  updateForm,
  targetFilters,
  setTargetFilters,
  invalidTimeout,
  setInvalidTimeout
}: DNSConfigurationProps) {
  const configForm = form.get('configuration') as MapForm<any>;
  const lookupField = configForm.get('lookup') as Field<string>;
  const queryTypeField = configForm.get('queryType') as Field<string>;
  const serverField = configForm.get('server') as Field<string>;
  const portField = configForm.get('port') as Field<number>;
  const responseTimeField = configForm.get('queryTime') as Field<DNSFilterQueryTime>;
  const recursiveLookupsField = configForm.get('recursiveLookups') as Field<boolean>;
  const transportField = configForm.get('transport') as Field<string>;
  const acceptCNAMEField = configForm.get('acceptCNAME') as Field<boolean>;
  const lookupServerNameField = configForm.get('lookupServerName') as Field<boolean>;
  const serverRetriesField = configForm.get('serverRetries') as Field<number>;
  const timeoutField = configForm.get('timeout') as Field<string>;
  const retriesField = configForm.get('retries') as Field<number>;
  const retryIntervalField = configForm.get('retryInterval') as Field<number>;
  const markSyntheticCallField = configForm.get('markSyntheticCall') as Field<boolean>;

  const [timeout, setTimeout] = useState({
    value: timeoutField.value.replace(/\D/g, ''),
    unit: timeoutField.value.replace(/\d/g, '')
  });
  const selectedUnit = Object.keys(timeoutObject).filter(item => timeoutObject[item].value === timeout.unit)[0];

  function addNewTargetFilterRow() {
    const updatedTargetFilters = [
      ...targetFilters,
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
        }
      }
    ];
    setTargetFilters([...updatedTargetFilters]);
    updateForm(
      form.updateIn(['configuration', 'targetValues'], (field: Item) =>
        (field as Field<AssertionTargetFilter[]>).setValue([...updatedTargetFilters]).setTouched(true)
      )
    );
  }

  function deleteTargetFilterRow(idToDelete: string) {
    targetFilters.splice(
      targetFilters.findIndex(targetFilter => targetFilter.id === idToDelete),
      1
    );
    setTargetFilters([...targetFilters]);
    updateForm(
      form.updateIn(['configuration', 'targetValues'], (field: Item) =>
        (field as Field<AssertionTargetFilter[]>).setValue([...targetFilters]).setTouched(true)
      )
    );
  }

  return (
    <>
      <div className={locals.configContainer}>
        <Stack gap={6}>
          <Stack orientation="horizontal" className={locals.serverStack}>
            <TextInput
              id={generateUniqueShortId()}
              type="text"
              value={lookupField.value}
              onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
                updateForm(
                  form.updateIn(['configuration', 'lookup'], (field: Item) =>
                    (field as Field<string>).setValue(target.value).setTouched(true)
                  )
                );
              }}
              helperText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.lookupHelperText')}
              labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.lookupLabel')}
              invalid={lookupField.touched && !lookupField.valid}
              invalidText={lookupField.messages[0]?.message ?? ''}
            />
            <Dropdown
              id="query-type"
              items={DNSQueryTypes}
              initialSelectedItem={DNSQueryTypes.find(queryType => queryType.value === queryTypeField.value)}
              onChange={({ selectedItem }) => {
                const updatedTargetFilters = checkQueryTypeAssertionMismatch(selectedItem?.value!, targetFilters);
                setTargetFilters([...updatedTargetFilters]);
                updateForm(
                  form.updateIn(['configuration', 'targetValues'], (field: Item) =>
                    (field as Field<AssertionTargetFilter[]>).setValue([...updatedTargetFilters]).setTouched(true)
                  )
                );
                updateForm(
                  form.updateIn(['configuration', 'queryType'], (field: Item) =>
                    (field as Field<string>).setValue(selectedItem?.value!).setTouched(true)
                  )
                );
              }}
              label=""
              titleText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.queryType')}
              type="default"
              invalid={queryTypeField.touched && !queryTypeField.valid}
              invalidText={queryTypeField.messages[0]?.message ?? ''}
            />
          </Stack>
          <Stack orientation="horizontal" className={locals.serverStack}>
            <TextInput
              id={generateUniqueShortId()}
              type="text"
              value={serverField.value}
              onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
                updateForm(
                  form.updateIn(['configuration', 'server'], (field: Item) =>
                    (field as Field<string>).setValue(target.value).setTouched(true)
                  )
                );
              }}
              helperText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.serverHelperText')}
              labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.serverLabel')}
              invalid={serverField.touched && !serverField.valid}
              invalidText={serverField.messages[0]?.message ?? ''}
            />
            <TextInput
              id={generateUniqueShortId()}
              type="text"
              value={portField.value}
              onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
                updateForm(
                  form.updateIn(['configuration', 'port'], (field: Item) =>
                    (field as Field<number | string>)
                      .setValue(isBlank(target.value) || isNaN(+target.value) ? target.value : +target.value)
                      .setTouched(true)
                  )
                );
              }}
              helperText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.portHelperText')}
              labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.portLabel')}
              invalid={portField.touched && !portField.valid}
              invalidText={portField.messages[0]?.message ?? ''}
            />
          </Stack>
          <TextInput
            id={generateUniqueShortId()}
            type="text"
            value={responseTimeField.value.value}
            onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
              updateForm(
                form.updateIn(['configuration', 'queryTime'], (field: Item) =>
                  (field as Field<TargetFilter>)
                    .setValue({
                      ...responseTimeField.value,
                      value: target.value
                    })
                    .setTouched(true)
                )
              );
            }}
            helperText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.queryTimeHelperText')}
            labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.queryTimeLabel')}
            invalid={responseTimeField.touched && !responseTimeField.valid}
            invalidText={responseTimeField.messages[0]?.message ?? ''}
          />
        </Stack>
      </div>
      <div className={locals.configContainer}>
        <Stack gap={3}>
          <Fragment>
            <h4 className={locals.headline}>
              <span>{t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.recordTypeTitle')}</span>
            </h4>
            <p>{t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.recordTypeSubtitle')}</p>
          </Fragment>
          {targetFilters.map(selectedFilter => {
            return (
              <Stack key={selectedFilter.id} className={locals.queryStack} orientation="horizontal" gap={6}>
                <Dropdown
                  id={generateUniqueShortId()}
                  className={locals.queryWidth}
                  items={assertionQueryTypes.filter(assertionQueryType => {
                    if (queryTypeField.value === 'A') {
                      return assertionQueryType.value !== 'AAAA';
                    } else if (queryTypeField.value === 'AAAA') {
                      return assertionQueryType.value !== 'A';
                    } else if (queryTypeField.value === 'CNAME') {
                      return assertionQueryType.value === 'CNAME';
                    } else if (queryTypeField.value === 'NS') {
                      return assertionQueryType.value === 'NS' || assertionQueryType.value === 'CNAME';
                    }
                    return true;
                  })}
                  initialSelectedItem={assertionQueryTypes.find(
                    assertionQueryType => assertionQueryType.value === selectedFilter.key
                  )}
                  label=""
                  titleText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.recordTypeLabel')}
                  type="default"
                  onChange={({ selectedItem }) => {
                    targetFilters.forEach(targetFilter => {
                      if (targetFilter.id === selectedFilter.id) {
                        targetFilter.key = selectedItem!.value;
                        const validator = assertionValidator(
                          selectedFilter,
                          selectedItem?.value!,
                          queryTypeField.value,
                          'key'
                        );
                        targetFilter.error = validator.error;
                      }
                    });
                    setTargetFilters([...targetFilters]);
                    updateForm(
                      form.updateIn(['configuration', 'targetValues'], (field: Item) =>
                        (field as Field<AssertionTargetFilter[]>).setValue([...targetFilters]).setTouched(true)
                      )
                    );
                  }}
                  invalid={selectedFilter.error.key.invalid}
                  invalidText={selectedFilter.error.key.message}
                />
                <Dropdown
                  id={generateUniqueShortId()}
                  className={locals.queryWidth}
                  items={DNSFilterOperators}
                  initialSelectedItem={DNSFilterOperators.find(operator => operator.value === selectedFilter.operator)}
                  label=""
                  titleText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.operatorLabel')}
                  type="default"
                  onChange={({ selectedItem }) => {
                    targetFilters.forEach(targetFilter => {
                      if (targetFilter.id === selectedFilter.id) {
                        targetFilter.operator = selectedItem!.value;
                        const validator = assertionValidator(
                          selectedFilter,
                          selectedItem?.value!,
                          queryTypeField.value,
                          'operator'
                        );
                        targetFilter.error = validator.error;
                      }
                    });
                    setTargetFilters([...targetFilters]);
                    updateForm(
                      form.updateIn(['configuration', 'targetValues'], (field: Item) =>
                        (field as Field<AssertionTargetFilter[]>).setValue([...targetFilters]).setTouched(true)
                      )
                    );
                  }}
                  invalid={selectedFilter.error.operator.invalid}
                  invalidText={selectedFilter.error.operator.message}
                />
                <TextInput
                  id={generateUniqueShortId()}
                  className={locals.queryWidth}
                  type="text"
                  value={selectedFilter.value}
                  placeholder={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.resolutionRecordLabel')}
                  labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.resolutionRecordLabel')}
                  onChange={({ target }) => {
                    targetFilters.forEach(targetFilter => {
                      if (targetFilter.id === selectedFilter.id) {
                        targetFilter.value = target.value;
                        const validator = assertionValidator(
                          selectedFilter,
                          target?.value,
                          queryTypeField.value,
                          'value'
                        );
                        targetFilter.error = validator.error;
                      }
                    });
                    setTargetFilters([...targetFilters]);
                    updateForm(
                      form.updateIn(['configuration', 'targetValues'], (field: Item) =>
                        (field as Field<AssertionTargetFilter[]>).setValue([...targetFilters]).setTouched(true)
                      )
                    );
                  }}
                  invalid={selectedFilter.error.value.invalid}
                  invalidText={selectedFilter.error.value.message}
                />
                <IconButton
                  kind="ghost"
                  onClick={() => deleteTargetFilterRow(selectedFilter.id)}
                  label={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.deleteButtonLabel')}
                  align="top"
                >
                  <SvgIcon type="lib_actions_delete" />
                </IconButton>
              </Stack>
            );
          })}
          <Button
            kind="tertiary"
            onClick={addNewTargetFilterRow}
            size="sm"
            renderIcon={() => <IconForButton icon="lib_openclose_add" iconSize="s" />}
          >
            {t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.addRecordTypeLabel')}
          </Button>
        </Stack>
      </div>
      <div className={locals.configContainer}>
        <Stack gap={6}>
          <RadioButtonGroup
            name="recursive-lookup"
            defaultSelected={'lookup-on'}
            legendText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.recursiveLookupLabel')}
            valueSelected={recursiveLookupsField.value ? 1 : 0}
            onChange={value => {
              updateForm(
                form.updateIn(['configuration', 'recursiveLookups'], (field: Item) =>
                  (field as Field<boolean>).setValue(value === 1).setTouched(true)
                )
              );
            }}
          >
            <RadioButton
              id="lookup-on"
              labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.dnsRadioButtonOnLabel')}
              value={1}
            />
            <RadioButton
              id="lookup-off"
              labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.dnsRadioButtonOffLabel')}
              value={0}
            />
          </RadioButtonGroup>
          <div className={locals.configProtocol}>
            <Dropdown
              id="tranport-protocol"
              items={DNSTransportOptions}
              onChange={({ selectedItem }) => {
                updateForm(
                  form.updateIn(['configuration', 'transport'], (field: Item) =>
                    (field as Field<string>).setValue(selectedItem!.value).setTouched(true)
                  )
                );
              }}
              initialSelectedItem={DNSTransportOptions.find(transport => transport.value === transportField.value)}
              label=""
              titleText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.transportProtocolLabel')}
              type="default"
              disabled
            />
          </div>
          <RadioButtonGroup
            name="accept-cname"
            defaultSelected={'accept-cname-off'}
            legendText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.acceptCNAMELabel')}
            valueSelected={acceptCNAMEField.value ? 1 : 0}
            onChange={value => {
              updateForm(
                form.updateIn(['configuration', 'acceptCNAME'], (field: Item) =>
                  (field as Field<boolean>).setValue(value === 1).setTouched(true)
                )
              );
            }}
          >
            <RadioButton
              id="accept-cname-on"
              labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.dnsRadioButtonOnLabel')}
              value={1}
            />
            <RadioButton
              id="accept-cname-off"
              labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.dnsRadioButtonOffLabel')}
              value={0}
            />
          </RadioButtonGroup>
          <RadioButtonGroup
            name="lookup-server-name"
            defaultSelected={'lookup-server-name-on'}
            legendText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.lookupServerNamelabel')}
            valueSelected={lookupServerNameField.value ? 1 : 0}
            onChange={value => {
              updateForm(
                form.updateIn(['configuration', 'lookupServerName'], (field: Item) =>
                  (field as Field<boolean>).setValue(value === 1).setTouched(true)
                )
              );
            }}
            disabled
          >
            <RadioButton
              id="lookup-server-name-on"
              labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.dnsRadioButtonOnLabel')}
              value={1}
            />
            <RadioButton
              id="lookup-server-name-off"
              labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.dnsRadioButtonOffLabel')}
              value={0}
            />
          </RadioButtonGroup>
          <div className={locals.configProtocol}>
            <TextInput
              id={generateUniqueShortId()}
              type="text"
              value={serverRetriesField.value}
              onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
                updateForm(
                  form.updateIn(['configuration', 'serverRetries'], (field: Item) =>
                    (field as Field<number | string>)
                      .setValue(isBlank(target.value) || isNaN(+target.value) ? target.value : +target.value)
                      .setTouched(true)
                  )
                );
              }}
              labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.serverRetriesLabel')}
              invalid={serverRetriesField.touched && !serverRetriesField.valid}
              invalidText={serverRetriesField.messages[0]?.message ?? ''}
            />
          </div>
        </Stack>
      </div>
      <div className={locals.configContainer}>
        <Label className={locals.timeoutLabel}>
          {t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutFieldLabel')}
        </Label>
        <Stack gap={6}>
          <RadioButtonGroup
            name="timeout"
            defaultSelected={timeoutObject['minutes'].id}
            legendText={t('in-synthetics:dialog.createTest.advancedMode.configStep.timeUnitsLabel')}
            valueSelected={timeout.unit}
            onChange={value => {
              setTimeout({ value: '0', unit: String(value) });
              updateForm(
                form.updateIn(['configuration', 'timeout'], (field: Item) =>
                  (field as Field<string>).setValue('0' + String(value)).setTouched(true)
                )
              );
            }}
          >
            {Object.keys(timeoutObject).map(unit => (
              <RadioButton
                key={timeoutObject[unit].id}
                id={timeoutObject[unit].id}
                labelText={timeoutObject[unit].label}
                value={timeoutObject[unit].value}
              />
            ))}
          </RadioButtonGroup>
          <Stack gap={3} orientation="horizontal">
            <TextInput
              id={generateUniqueShortId()}
              labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutFieldDescription')}
              name="timeout"
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
              invalid={invalidTimeout.invalid && timeoutField.touched}
              invalidText={invalidTimeout.message}
            />
            <TextInput
              labelText=""
              className={locals.timeoutUnit}
              hideLabel
              value={timeoutObject[selectedUnit]?.label}
              readOnly
              id={generateUniqueShortId()}
            />
          </Stack>
        </Stack>
      </div>
      <div className={locals.configContainer}>
        <RadioButtonGroup
          name="retry-strategy"
          defaultSelected={retriesObject[0].id}
          legendText={t('in-synthetics:dialog.createTest.advancedMode.configStep.retryFieldLabel')}
          valueSelected={retriesField.value}
          onChange={value => {
            if (value === 0) {
              updateForm(
                form
                  .updateIn(['configuration', 'retries'], (field: Item) =>
                    (field as Field<number>).setValue(Number(value)).setTouched(true)
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
                    (field as Field<number>).setValue(Number(value)).setTouched(true)
                  )
              );
            }
          }}
        >
          {retriesObject.map(retry => (
            <RadioButton key={retry.id} id={retry.id} labelText={retry.label} value={retry.value} />
          ))}
        </RadioButtonGroup>
        {(retriesField.value === 1 || retriesField.value === 2) && (
          <Section>
            <ActionTitle>
              {t('in-synthetics:dialog.createTest.advancedMode.configStep.retryIntervalFieldLabel')}
            </ActionTitle>
            <Description>{getRetryIntervalDescriptionText(retriesField.value, retryIntervalField.value)}</Description>
            {displayRetryIntervalSlider(retryIntervalField, form, updateForm)}
            <TouchedMessages field={retryIntervalField} />
          </Section>
        )}
      </div>
      <div className={locals.configContainer}>
        <Stack orientation="horizontal">
          <Checkbox
            id="markSyntheticCall"
            onChange={({ target }) => {
              updateForm(
                form.updateIn(['configuration', 'markSyntheticCall'], (field: Item) =>
                  (field as Field<boolean>).setValue(target.checked).setTouched(true)
                )
              );
            }}
            checked={markSyntheticCallField.value}
            labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.markSyntheticCall')}
          />
        </Stack>
      </div>
    </>
  );
}
