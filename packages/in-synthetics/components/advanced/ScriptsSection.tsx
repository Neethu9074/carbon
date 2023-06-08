/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm, createField, notBlankValidator } from 'formalistic';
import React, { useState } from 'react';

import { Button, SvgIcon } from '@instana/components';
import { just } from '@instana/observables';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
// eslint-disable-next-line no-restricted-imports
import List from 'in-settings/components/List';
import AddScriptDialogContent from 'in-synthetics/components/advanced/AddScriptDialogContent';
import { createZipScriptConfigurationForm } from 'in-synthetics/form/createSyntheticTestForm';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { SliderState } from 'in-synthetics/components/TestConfigDialogPresenter';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { Code, SlideInHeader, Zip } from 'in-synthetics/utils/constants';
import { stringValidator } from 'in-services/validators/jsonType';
import { isBlank, isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from './ScriptsSection.mless';

interface ScriptProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  setSliderState: (state: SliderState) => void;
  setCustomSlideInHeaderConfig: React.Dispatch<React.SetStateAction<SlideInHeader>>;
  isUpdateConfig: boolean;
  scriptDetails: Code;
  setScriptDetails: React.Dispatch<React.SetStateAction<Code>>;
}

export default function ScriptsSection({
  form,
  updateForm,
  setSliderState,
  setCustomSlideInHeaderConfig,
  isUpdateConfig,
  scriptDetails,
  setScriptDetails
}: ScriptProps) {
  const configForm = form.get('configuration') as MapForm<any>;
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [script, setScript] = useState(
    isUpdateConfig && !isUpdated
      ? configForm.get('script')
        ? {
            name: t('in-synthetics:dialog.updateTest.scriptSavedMessage'),
            text: (configForm.get('script') as Field<string>).value,
            extension: 'js'
          }
        : {
            name: t('in-synthetics:dialog.updateTest.bundleSavedMessage'),
            text: (configForm.getIn(['scripts', 'bundle']) as Field<string>).value,
            scriptFile: (configForm.getIn(['scripts', 'scriptFile']) as Field<string>).value,
            extension: 'zip'
          }
      : scriptDetails?.modified
      ? {
          name: scriptDetails.name,
          text: (configForm.get('script') as Field<string>).value,
          extension: isNotBlank(scriptDetails.name) ? 'js' : ''
        }
      : { name: '', text: '', extension: 'js' }
  );
  const [zipFile, setZipFile] = useState<Zip>({ name: '', files: [] });
  const [columnLabel, setColumnLabel] = useState(
    (isUpdateConfig && !isUpdated) || (scriptDetails.modified && isBlank(scriptDetails.name))
      ? ''
      : t('in-synthetics:dialog.createTest.advancedMode.configStep.scriptFileName')
  );

  function deleteScript() {
    if (script.extension !== 'zip') {
      updateForm(
        form.updateIn(['configuration', 'script'], (field: Item) =>
          (field as Field<string>).setValue('').setTouched(true)
        )
      );
    } else {
      //@ts-ignore-next-line
      let updatedForm = form.updateIn(['configuration', 'scripts', 'bundle'], (field: Item) =>
        (field as Field<string>).setValue('').setTouched(true)
      );
      //@ts-ignore-next-line
      updatedForm = updatedForm.updateIn(['configuration', 'scripts', 'scriptFile'], (field: Item) =>
        (field as Field<string>).setValue('').setTouched(true)
      );
      updateForm(updatedForm);
    }
    setScript({ name: '', text: '', extension: '' });
    setColumnLabel(t('in-synthetics:dialog.createTest.advancedMode.configStep.scriptFileName'));
    setIsUpdated(true);
    setScriptDetails({ modified: true, name: '' });
  }

  const columnDefinition = [
    {
      id: 'file_name',
      label: columnLabel,
      sortable: false,
      getContent() {
        return (
          <HorizontalFlexWrapper className={locals.row}>
            <span>
              {isUpdateConfig && !isUpdated
                ? configForm.get('script')
                  ? t('in-synthetics:dialog.updateTest.scriptSavedMessage')
                  : t('in-synthetics:dialog.updateTest.bundleSavedMessage')
                : isBlank(script.extension)
                ? t('in-synthetics:dialog.createTest.advancedMode.configStep.scriptEditedManuallyMessage')
                : script.name}
            </span>
            <SvgIcon type="lib_actions_delete" onClick={deleteScript} />
          </HorizontalFlexWrapper>
        );
      }
    }
  ];

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
                    onSubmit={(scriptContent, zipFile) => {
                      let updatedForm;
                      if (scriptContent.extension !== 'zip') {
                        if (!form.get('configuration').get('script')) {
                          updatedForm = form.put(
                            'configuration',
                            form
                              .get('configuration')
                              .put(
                                'script',
                                createField({
                                  value: scriptContent.text,
                                  validator: composeAndShortCircuitOnError(
                                    notUndefinedValidator,
                                    stringValidator,
                                    notBlankValidator
                                  )
                                }).setTouched(true)
                              )
                              .remove('scripts')
                          );
                        } else {
                          updatedForm = form
                            .updateIn(['configuration', 'script'], (field: Item) =>
                              (field as Field<string>).setValue(scriptContent.text).setTouched(true)
                            )
                            .remove('scripts');
                        }
                        updateForm(updatedForm);
                      } else {
                        if (!form.get('configuration').get('scripts')) {
                          updatedForm = form.put(
                            'configuration',
                            form
                              .get('configuration')
                              .put(
                                'scripts',
                                createZipScriptConfigurationForm(scriptContent.text, scriptContent.scriptFile!)
                              )
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
                              .remove('script')
                          );
                        }
                        updateForm(updatedForm);
                      }
                      setScript(scriptContent);
                      setZipFile(zipFile);
                      setSliderState({
                        slideInConfig: {},
                        isVisible: false
                      });
                      setColumnLabel(
                        isBlank(scriptContent.extension)
                          ? ''
                          : t('in-synthetics:dialog.createTest.advancedMode.configStep.scriptFileName')
                      );
                      setIsUpdated(true);
                    }}
                    setSliderState={setSliderState}
                  />
                ),
                title:
                  script.text !== '' || (isUpdateConfig && !isUpdated)
                    ? t('in-synthetics:dialog.createTest.advancedMode.configStep.editscriptAction')
                    : t('in-synthetics:dialog.createTest.advancedMode.configStep.addscriptAction')
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
      loadEntities={() => {
        return just(
          script.extension !== 'zip'
            ? configForm.get('script') && isNotBlank((configForm.getIn(['script']) as Field<string>)?.value)
              ? [configForm.getIn(['script']) as Field<string>]
              : []
            : configForm.get('scripts') && isNotBlank((configForm.getIn(['scripts', 'bundle']) as Field<string>)?.value)
            ? [configForm.getIn(['scripts', 'bundle']) as Field<string>]
            : []
        );
      }}
    />
  );
}
