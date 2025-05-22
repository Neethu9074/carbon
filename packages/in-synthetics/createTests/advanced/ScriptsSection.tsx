/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm, createField, notBlankValidator } from 'formalistic';
import React, { useState } from 'react';

import { Button, IconButton } from '@instana/components';
import { just } from '@instana/observables';

import { Code, Invalid, SlideInHeader, SliderState, Zip, scriptTestType, Script } from 'in-synthetics/utils/constants';
import { base64ToFileFormat, scriptDetailsUpdater } from 'in-synthetics/createTests/utils/scriptDetailsUpdater';
import { createZipScriptConfigurationForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import ConfigurationCommonSection from 'in-synthetics/createTests/advanced/ConfigurationCommonSection';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
// eslint-disable-next-line no-restricted-imports
import List from 'in-settings/components/List';
import AddScriptDialogContent from 'in-synthetics/createTests/advanced/AddScriptDialogContent';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { isBlank, isNotBlank } from 'in-services/util/string';
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
  setInvalidTimeout
}: ScriptProps) {
  const configForm = form.get('configuration') as MapForm<any>;
  const syntheticType = (configForm.get('syntheticType') as Field<string>).value;
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [script, setScript] = useState(scriptDetailsUpdater(configForm, isUpdateConfig, isUpdated, scriptDetails));
  const [zipFile, setZipFile] = useState<Zip>({
    name: '',
    files: [],
    blob:
      configForm.get('scripts') && isNotBlank((configForm.getIn(['scripts', 'bundle']) as Field<string>)?.value)
        ? base64ToFileFormat((configForm.getIn(['scripts', 'bundle']) as Field<string>)?.value)
        : null
  });

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
      setZipFile({ name: '', files: [], blob: null });
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
            <IconButton kind="action" type="lib_actions_delete" onClick={deleteScript} />
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

  const getScriptSection = () => {
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
  };

  return (
    <>
      {getScriptSection()}
      <ConfigurationCommonSection
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
      />
    </>
  );
}
