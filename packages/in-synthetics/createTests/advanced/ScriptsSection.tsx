/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm, ValidationResult, createField, notBlankValidator } from 'formalistic';
import React, { useState } from 'react';

import { Stack, SvgIcon } from '@instana/components';
import { just } from '@instana/observables';
import { Button } from '@instana/legacy';

import {
  timeoutObject,
  retriesObject,
  Code,
  Invalid,
  SlideInHeader,
  SliderState,
  Zip,
  scriptTestType,
  Script,
  InvalidCertificateParams
} from 'in-synthetics/utils/constants';
import { certificateCheckScriptUpdater } from 'in-synthetics/createTests/utils/certificateCheckScriptUpdater';
import { createZipScriptConfigurationForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import { certificateCheckBasicScript } from 'in-synthetics/createTests/utils/certificateCheckBasicScript';
import { getRetryIntervalDescriptionText } from 'in-synthetics/utils/getRetryIntervalDescriptionText';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
// eslint-disable-next-line no-restricted-imports
import List from 'in-settings/components/List';
import AddScriptDialogContent from 'in-synthetics/createTests/advanced/AddScriptDialogContent';
import Section, { ActionTitle, Description } from 'in-synthetics/createTests/wizard/Section';
import { scriptDetailsUpdater } from 'in-synthetics/createTests/utils/scriptDetailsUpdater';
import { timeoutValidator } from 'in-synthetics/createTests/validators/configValidators';
import { checkForInvalidHost } from 'in-synthetics/createTests/validators/urlValidator';
import { displayRetryIntervalSlider } from 'in-synthetics/utils/sliderHelperFunctions';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { stringValidator, numberValidator } from 'in-services/validators/jsonType';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { isBlank, isNotBlank } from 'in-services/util/string';
import { minValidator } from 'in-services/validators/number';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/advanced/ScriptsSection.mless';

interface ScriptProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  setSliderState: (state: SliderState) => void;
  setCustomSlideInHeaderConfig: React.Dispatch<React.SetStateAction<SlideInHeader>>;
  isUpdateConfig: boolean;
  scriptDetails: Code;
  setScriptDetails: React.Dispatch<React.SetStateAction<Code>>;
  commonAttributes: Record<string, any>;
  setCommonAttributes: (type: Record<string, any>) => void;
  isBrowser: boolean;
  invalidTimeout: Invalid;
  setInvalidTimeout: React.Dispatch<React.SetStateAction<Invalid>>;
  certificateCheckHostNameError: InvalidCertificateParams;
  setCertificateCheckHostNameError: React.Dispatch<React.SetStateAction<InvalidCertificateParams>>;
  certificateCheckDaysRemainingError: InvalidCertificateParams;
  setCertificateCheckDaysRemainingError: React.Dispatch<React.SetStateAction<InvalidCertificateParams>>;
}

export default function ScriptsSection({
  form,
  updateForm,
  setSliderState,
  setCustomSlideInHeaderConfig,
  isUpdateConfig,
  scriptDetails,
  setScriptDetails,
  commonAttributes,
  setCommonAttributes,
  isBrowser,
  invalidTimeout,
  setInvalidTimeout,
  certificateCheckHostNameError,
  setCertificateCheckHostNameError,
  certificateCheckDaysRemainingError,
  setCertificateCheckDaysRemainingError
}: ScriptProps) {
  const configForm = form.get('configuration') as MapForm<any>;
  const syntheticType = (configForm.get('syntheticType') as Field<string>).value;
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [script, setScript] = useState(scriptDetailsUpdater(configForm, isUpdateConfig, isUpdated, scriptDetails));
  const [zipFile, setZipFile] = useState<Zip>({ name: '', files: [] });

  // Certificate Check implementation
  const certificateCheck = configForm.get('certificateCheck') as Field<boolean>;
  const [basicScript, setBasicScript] = useState(certificateCheckBasicScript);
  let certificateCheckScript: string[] = ['', ''];
  if (certificateCheck.value) {
    const startIndex = script.text.lastIndexOf('("');
    const endIndex = script.text.lastIndexOf('");');
    certificateCheckScript = script.text
      .substring(startIndex + 2, endIndex)
      .split(',')
      .map(arg => arg.replaceAll('"', '').trim());
  }
  const [hostName, setHostName] = useState(isUpdateConfig ? certificateCheckScript[0] : '');
  const [daysRemaining, setDaysRemaining] = useState(isUpdateConfig ? certificateCheckScript[1] : '');

  const timeoutField = configForm.get('timeout') as Field<string>;
  const retriesField = configForm.get('retries') as Field<number>;
  const retryIntervalField = configForm.get('retryInterval') as Field<number>;
  const markSyntheticCall = configForm.get('markSyntheticCall') as Field<boolean>;

  const [timeout, setTimeout] = useState({
    value: timeoutField.value.replace(/\D/g, ''),
    unit: timeoutField.value.replace(/\d/g, '')
  });
  const selectedUnit = Object.keys(timeoutObject).filter(item => timeoutObject[item].value === timeout.unit)[0];

  const getColumnLabel = () => {
    return (isUpdateConfig && !isUpdated) || (scriptDetails?.modified && isBlank(scriptDetails?.name))
      ? ''
      : t('in-synthetics:dialog.createTest.advancedMode.configStep.scriptFileName');
  };
  const [columnLabel, setColumnLabel] = useState(getColumnLabel());

  function deleteScript() {
    if (script.extension !== 'zip') {
      updateForm(
        form.updateIn(['configuration', 'script'], (field: Item) =>
          (field as Field<string>).setValue('').setTouched(true)
        )
      );
    } else {
      //@ts-expect-error-next-line
      let updatedForm = form.updateIn(['configuration', 'scripts', 'bundle'], (field: Item) =>
        (field as Field<string>).setValue('').setTouched(true)
      );
      //@ts-expect-error-next-line
      updatedForm = updatedForm.updateIn(['configuration', 'scripts', 'scriptFile'], (field: Item) =>
        (field as Field<string>).setValue('').setTouched(true)
      );
      updateForm(updatedForm);
    }
    setScript({ name: '', text: '', extension: '' });
    setColumnLabel(t('in-synthetics:dialog.createTest.advancedMode.configStep.scriptFileName'));
    setIsUpdated(true);
    if (!isUpdateConfig) {
      setScriptDetails({ modified: true, name: '' });
    }
  }

  const getScriptFileName = () => {
    let scriptName;
    if (isUpdateConfig && !isUpdated) {
      scriptName = configForm.get('script')
        ? t('in-synthetics:dialog.updateTest.scriptSavedMessage')
        : t('in-synthetics:dialog.updateTest.bundleSavedMessage');
    } else {
      scriptName = isBlank(script.extension)
        ? t('in-synthetics:dialog.createTest.advancedMode.configStep.scriptEditedManuallyMessage')
        : script.name;
    }
    return scriptName;
  };

  const columnDefinition = [
    {
      id: 'file_name',
      label: columnLabel,
      sortable: false,
      getContent() {
        return (
          <HorizontalFlexWrapper className={locals.row}>
            <span>{getScriptFileName()}</span>
            <SvgIcon type="lib_actions_delete" onClick={deleteScript} />
          </HorizontalFlexWrapper>
        );
      }
    }
  ];

  const loadEntities = () => {
    let scriptEntities;
    if (script.extension !== 'zip') {
      scriptEntities =
        configForm.get('script') && isNotBlank((configForm.getIn(['script']) as Field<string>)?.value)
          ? [configForm.getIn(['script']) as Field<string>]
          : [];
    } else {
      scriptEntities =
        configForm.get('scripts') && isNotBlank((configForm.getIn(['scripts', 'bundle']) as Field<string>)?.value)
          ? [configForm.getIn(['scripts', 'bundle']) as Field<string>]
          : [];
    }
    return just(scriptEntities);
  };

  const title =
    script.text !== '' || (isUpdateConfig && !isUpdated)
      ? t('in-synthetics:dialog.createTest.advancedMode.configStep.editscriptAction')
      : t('in-synthetics:dialog.createTest.advancedMode.configStep.addscriptAction');

  const getScriptFileContent = (scriptContent: Script) => {
    let scriptFile = '';
    // If we upload or enter a script that isn't a JSON string, JSON.parse() will throw an exception
    // In those cases, control enters the catch block and we assign the original script value to scriptFile.
    try {
      if (scriptContent.extension !== 'side') {
        scriptFile = String(JSON.parse(scriptContent.text));
      } else {
        scriptFile = scriptContent.text;
      }
    } catch (e) {
      scriptFile = scriptContent.text;
    }
    return scriptFile;
  };

  const getupdatedForm = (scriptContent: Script, testType: string) => {
    let updatedForm;
    if (scriptContent.extension !== 'zip') {
      let scriptFile = getScriptFileContent(scriptContent);
      if (!form.get('configuration').get('script')) {
        updatedForm = form.put(
          'configuration',
          form
            .get('configuration')
            .put(
              'script',
              createField({
                value: scriptFile,
                validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
              }).setTouched(true)
            )
            .updateIn(['syntheticType'], (field: Item) => (field as Field<string>).setValue(testType).setTouched(true))
            .remove('scripts')
        );
      } else {
        updatedForm = form.put(
          'configuration',
          form
            .get('configuration')
            .updateIn(['script'], (field: Item) => (field as Field<string>).setValue(scriptFile).setTouched(true))
            .updateIn(['syntheticType'], (field: Item) => (field as Field<string>).setValue(testType).setTouched(true))
            .remove('scripts')
        );
      }
      updateForm(updatedForm);
    } else if (!form.get('configuration').get('scripts')) {
      updatedForm = form.put(
        'configuration',
        form
          .get('configuration')
          .put('scripts', createZipScriptConfigurationForm(scriptContent.text, scriptContent.scriptFile!))
          .updateIn(['syntheticType'], (field: Item) => (field as Field<string>).setValue(testType).setTouched(true))
          .remove('script')
      );
    } else {
      updatedForm = form.put(
        'configuration',
        form
          .get('configuration')
          .updateIn(['scripts', 'bundle'], (field: Item) =>
            (field as Field<string>).setValue(scriptContent.text).setTouched(true)
          )
          .updateIn(['scripts', 'scriptFile'], (field: Item) =>
            (field as Field<string>).setValue(scriptContent.scriptFile!).setTouched(true)
          )
          .updateIn(['syntheticType'], (field: Item) => (field as Field<string>).setValue(testType).setTouched(true))
          .remove('script')
      );
    }
    return updatedForm;
  };

  const getScriptSection = (certificateCheckField: Field<boolean>) => {
    if (certificateCheckField.value) {
      // TODO: This is the Certificate Check section
      // We need to add the logic that takes the input values
      // and replace them in the pre-defined hard coded script
      // This is the Script that should be part of the form that is being send to
      // the backend for processing as a normal HTTPScript test.
      return (
        <div className={locals.configContainer}>
          <FormGroup className={locals.descriptionInput}>
            <Label>{t('in-synthetics:dialog.createTest.advancedMode.certificateCheck.inputHostName')}</Label>
            <Input
              name="hostName"
              value={hostName}
              onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                const valueNotBlank: ValidationResult = notBlankValidator(target.value);
                const valueUndefined: ValidationResult = notUndefinedValidator(target.value);
                const invalidHostNameFormat: ValidationResult = checkForInvalidHost(target.value);
                if (valueUndefined) {
                  setCertificateCheckHostNameError({
                    invalid: true,
                    message: valueUndefined[0].message!,
                    touched: true
                  });
                } else if (valueNotBlank!.length > 0) {
                  setCertificateCheckHostNameError({
                    invalid: true,
                    message: valueNotBlank![0].message!,
                    touched: true
                  });
                } else if (invalidHostNameFormat) {
                  setCertificateCheckHostNameError({
                    invalid: true,
                    message: invalidHostNameFormat[0].message!,
                    touched: true
                  });
                } else {
                  setCertificateCheckHostNameError({ invalid: false, message: '', touched: true });
                }
                // form gets updated within certificateCheckScriptUpdater()
                setBasicScript(
                  certificateCheckScriptUpdater(basicScript, target.value, daysRemaining, form, updateForm)
                );
                setHostName(target.value);
              }}
              hasError={certificateCheckHostNameError.invalid && certificateCheckHostNameError.touched}
            />
            {certificateCheckHostNameError.invalid && (
              <ValidationBlock>{certificateCheckHostNameError.message}</ValidationBlock>
            )}
            <div className={locals.top}>
              <Stack direction="horizontal">
                <div className={locals.alignText}>
                  {t('in-synthetics:dialog.createTest.advancedMode.certificateCheck.inputDaysLine1')}
                </div>
                <Input
                  name="days"
                  value={daysRemaining}
                  onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                    const valueNotBlank: ValidationResult = notBlankValidator(target.value);
                    const valueUndefined: ValidationResult = notUndefinedValidator(target.value);
                    const valueIsNumber: ValidationResult = numberValidator(+target.value);
                    const valueNotNegative: ValidationResult = minValidator(0)(+target.value);
                    if (valueNotBlank!.length > 0) {
                      setCertificateCheckDaysRemainingError({
                        invalid: true,
                        message: valueNotBlank![0].message!,
                        touched: true
                      });
                    } else if (valueUndefined) {
                      setCertificateCheckDaysRemainingError({
                        invalid: true,
                        message: valueUndefined[0].message!,
                        touched: true
                      });
                    } else if (valueIsNumber) {
                      setCertificateCheckDaysRemainingError({
                        invalid: true,
                        message: valueIsNumber[0].message!,
                        touched: true
                      });
                    } else if (valueNotNegative) {
                      setCertificateCheckDaysRemainingError({
                        invalid: true,
                        message: valueNotNegative[0].message!,
                        touched: true
                      });
                    } else {
                      setCertificateCheckDaysRemainingError({ invalid: false, message: '', touched: true });
                    }
                    // form gets updated within certificateCheckScriptUpdater()
                    setBasicScript(
                      certificateCheckScriptUpdater(basicScript, hostName, target.value, form, updateForm)
                    );
                    setDaysRemaining(target.value);
                  }}
                  hasError={certificateCheckDaysRemainingError.invalid && certificateCheckDaysRemainingError.touched}
                />
                <div className={locals.alignText}>
                  {t('in-synthetics:dialog.createTest.advancedMode.certificateCheck.inputDaysLine2')}
                </div>
              </Stack>
            </div>
            {certificateCheckDaysRemainingError.invalid && (
              <ValidationBlock>{certificateCheckDaysRemainingError.message}</ValidationBlock>
            )}
          </FormGroup>
        </div>
      );
    } else {
      return (
        <List
          getHeader={() => t('in-synthetics:dialog.createTest.advancedMode.configStep.scriptLabel')}
          columnDefinitions={columnDefinition}
          renderNoDataAvailable={() => (
            <NoDataAvailable
              type="lib_help_error_warning_outline"
              height={100}
              className={locals.boldText}
              text={t('in-synthetics:dialog.createTest.advancedMode.configStep.scriptNotAdded')}
            />
          )}
          pageSize={1}
          initialOrderBy={''}
          rightHeader={
            <Button
              className={locals.selectButton}
              kind="action"
              onClick={() => {
                setSliderState({
                  slideInConfig: {
                    component: (
                      <AddScriptDialogContent
                        form={form}
                        scriptContent={script}
                        zipFileDetails={zipFile}
                        setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
                        onSubmit={(scriptContent, zipFileContent) => {
                          const testType = isBrowser
                            ? scriptTestType(scriptContent.extension, syntheticType)
                            : syntheticType;
                          const columnLabelUpdated = isBlank(scriptContent.extension)
                            ? ''
                            : t('in-synthetics:dialog.createTest.advancedMode.configStep.scriptFileName');
                          updateForm(getupdatedForm(scriptContent, testType));
                          setScript(scriptContent);
                          setZipFile(zipFileContent);
                          setSliderState({
                            slideInConfig: {},
                            isVisible: false
                          });
                          setColumnLabel(columnLabelUpdated);
                          setIsUpdated(true);
                          if (isBrowser) {
                            setCommonAttributes({ ...commonAttributes, syntheticType: testType });
                          }
                        }}
                        setSliderState={setSliderState}
                        isBrowser={isBrowser}
                      />
                    ),
                    title: title
                  },
                  isVisible: true
                });
              }}
              icon={
                script.text !== '' || (isUpdateConfig && !isUpdated)
                  ? 'lib_actions_edit'
                  : 'lib_openclose_add_circle_outline'
              }
            >
              {script.text !== '' || (isUpdateConfig && !isUpdated)
                ? t('in-synthetics:dialog.createTest.advancedMode.configStep.editscriptAction')
                : t('in-synthetics:dialog.createTest.advancedMode.configStep.addscriptAction')}
            </Button>
          }
          isSearchable={false}
          loadEntities={loadEntities}
        />
      );
    }
  };

  return (
    <>
      {getScriptSection(certificateCheck)}
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
              <Description>{getRetryIntervalDescriptionText(retriesField.value, retryIntervalField.value)}</Description>
              {displayRetryIntervalSlider(retryIntervalField, form, updateForm)}
              <TouchedMessages field={retryIntervalField} />
            </Section>
          )}
        </FormGroup>
      </div>
      <div className={locals.configContainer}>
        <Stack direction="horizontal">
          <CheckboxFancy
            wrapperClassName={locals.configCheckbox}
            onChange={({ target }) => {
              updateForm(
                form.updateIn(['configuration', 'markSyntheticCall'], (field: Item) =>
                  (field as Field<boolean>).setValue(target.checked).setTouched(true)
                )
              );
            }}
            checked={markSyntheticCall.value}
            size="larger"
            label={t('in-synthetics:dialog.createTest.advancedMode.configStep.markSyntheticCall')}
            disabled={false}
          />
        </Stack>
      </div>
    </>
  );
}
