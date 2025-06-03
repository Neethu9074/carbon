/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ChangeEvent, Fragment } from 'react';
import { Field, Item, MapForm } from 'formalistic';

import {
  CarbonStack as Stack,
  CarbonTextInput as TextInput,
  CarbonRadioButtonGroup as RadioButtonGroup,
  CarbonRadioButton as RadioButton,
  CarbonDropdown as Dropdown,
  CarbonIconButton as IconButton,
  CarbonButton as Button,
  SvgIcon,
  CarbonInlineNotification as InlineNotification,
  Spacer,
  Typography
} from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { DNSFilterQueryTime } from '@instana/types';

import {
  AssertionFilterOperators,
  DNSQueryTypes,
  DNSTransportOptions,
  Invalid,
  TargetFilter,
  AssertionTargetFilter,
  assertionQueryTypes
} from 'in-synthetics/utils/constants';
import ConfigurationCommonSection from 'in-synthetics/createTests/advanced/ConfigurationCommonSection';
import { checkQueryTypeAssertionMismatch } from 'in-synthetics/createTests/validators/dnsValidators';
import { assertionValidator } from 'in-synthetics/createTests/validators/validator';
import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import { isBlank, isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/advanced/ConfigurationSection.mless';

interface DNSConfigurationProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  targetFilters: AssertionTargetFilter[];
  setTargetFilters: React.Dispatch<React.SetStateAction<AssertionTargetFilter[]>>;
  invalidTimeout: Invalid;
  setInvalidTimeout: React.Dispatch<React.SetStateAction<Invalid>>;
  showAssertionsWarning: boolean;
  setShowAssertionsWarning: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DNSConfiguration({
  form,
  updateForm,
  targetFilters,
  setTargetFilters,
  invalidTimeout,
  setInvalidTimeout,
  showAssertionsWarning,
  setShowAssertionsWarning
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
        },
        inValidResolutionRecord: false
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
    checkTargetFiltersEmpty(queryTypeField.value, [...targetFilters]);
    setTargetFilters([...targetFilters]);
    updateForm(
      form.updateIn(['configuration', 'targetValues'], (field: Item) =>
        (field as Field<AssertionTargetFilter[]>).setValue([...targetFilters]).setTouched(true)
      )
    );
  }

  const checkTargetFiltersEmpty = (queryType: string, updatedTargetFilters: AssertionTargetFilter[]) => {
    const isTargetFiltersEmpty = !updatedTargetFilters.some(
      targetFilter =>
        isNotBlank(targetFilter.key) && isNotBlank(targetFilter.operator) && isNotBlank(targetFilter.value)
    );
    if (queryType === 'ALL_CONDITIONS' && isTargetFiltersEmpty) {
      setShowAssertionsWarning(true);
    } else {
      setShowAssertionsWarning(false);
    }
  };

  return (
    <>
      <div className={locals.configContainer}>
        <Stack gap={4}>
          <Typography variant="body-bold">
            {t('in-synthetics:dialog.createTest.advancedMode.configStep.testCriteriaLabel')}
          </Typography>
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
                checkTargetFiltersEmpty(selectedItem?.value!, targetFilters);
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
              <span>{t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.assertionsTitle')}</span>
            </h4>
            <p>{t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.assertionsSubtitle')}</p>
          </Fragment>
          {showAssertionsWarning && (
            <div>
              <InlineNotification
                kind="warning"
                lowContrast
                title={t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.assertionsNotificationTitle')}
                subtitle={t(
                  'in-synthetics:dialog.createTest.advancedMode.configStep.dns.assertionsNotificationDescription'
                )}
                className={locals.fullInline}
                hideCloseButton
              />
              <Spacer size="xsmall" />
            </div>
          )}
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
                          'key',
                          queryTypeField.value,
                          'DNS'
                        );
                        targetFilter.error = validator.error;
                      }
                    });
                    checkTargetFiltersEmpty(queryTypeField.value, [...targetFilters]);
                    setTargetFilters([...targetFilters]);
                    updateForm(
                      form.updateIn(['configuration', 'targetValues'], (field: Item) =>
                        (field as Field<AssertionTargetFilter[]>).setValue([...targetFilters]).setTouched(true)
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
                    targetFilters.forEach(targetFilter => {
                      if (targetFilter.id === selectedFilter.id) {
                        targetFilter.operator = selectedItem!.value;
                        const validator = assertionValidator(
                          selectedFilter,
                          selectedItem?.value!,
                          'operator',
                          queryTypeField.value,
                          'DNS'
                        );
                        targetFilter.error = validator.error;
                      }
                    });
                    checkTargetFiltersEmpty(queryTypeField.value, [...targetFilters]);
                    setTargetFilters([...targetFilters]);
                    updateForm(
                      form.updateIn(['configuration', 'targetValues'], (field: Item) =>
                        (field as Field<AssertionTargetFilter[]>).setValue([...targetFilters]).setTouched(true)
                      )
                    );
                  }}
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
                          'value',
                          queryTypeField.value,
                          'DNS'
                        );
                        targetFilter.error = validator.error;
                      }
                    });
                    checkTargetFiltersEmpty(queryTypeField.value, [...targetFilters]);
                    setTargetFilters([...targetFilters]);
                    updateForm(
                      form.updateIn(['configuration', 'targetValues'], (field: Item) => {
                        const valueField = field as Field<AssertionTargetFilter[]>;
                        valueField.setValue([...targetFilters]).setTouched(true);
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
                <IconButton
                  kind="ghost"
                  onClick={() => deleteTargetFilterRow(selectedFilter.id)}
                  label={t('in-synthetics:dialog.createTest.advancedMode.configStep.deleteButtonLabel')}
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
            {t('in-synthetics:dialog.createTest.advancedMode.configStep.addFieldLabel')}
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
      <ConfigurationCommonSection
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
      />
    </>
  );
}
