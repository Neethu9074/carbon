/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, ValidationResult } from 'formalistic';
import React, { ChangeEvent, useState } from 'react';
import jsZip from 'jszip';

import {
  Message,
  CarbonButton as Button,
  FileInputButton,
  Stack,
  CarbonTextInput as TextInput
} from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import ConfigSlideContentWrapper from 'in-synthetics/createTests/advanced/ConfigSlideContentWrapper';
import { mainFileNameValidator } from 'in-synthetics/createTests/validators/configValidators';
import { Script, SlideInHeader, SliderState, Zip } from 'in-synthetics/utils/constants';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { notBlankValidator } from 'in-services/validators/string';
import SlideInView from 'in-components/SlideInView/SlideInView';
import SaveError from 'in-components/form/SaveError/SaveError';
import { validate } from 'in-synthetics/utils/scriptUploader';
import { isBlank, isNotBlank } from 'in-services/util/string';
import CodeInput from 'in-synthetics/packages/Code/CodeInput';
import { Error } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/advanced/ScriptsSection.mless';

interface AddScriptProps {
  form: MapForm<any>;
  scriptContent: Script;
  zipFileDetails: Zip;
  isBrowser: boolean;
  setSliderState: (state: SliderState) => void;
  setCustomSlideInHeaderConfig: React.Dispatch<React.SetStateAction<SlideInHeader>>;
  onSubmit: (scriptContent: Script, zipFile: Zip) => void;
}

export default function AddScriptDialogContent({
  form,
  scriptContent,
  zipFileDetails,
  isBrowser,
  setSliderState,
  setCustomSlideInHeaderConfig,
  onSubmit
}: AddScriptProps) {
  const [slideInContentVisible, setSlideInContentVisible] = useState(false);
  const [script, setScript] = useState<Script>(scriptContent);
  const [scriptErrors, setScriptErrors] = useState([] as Error[]);
  const [modified, isModified] = useState(true);
  const [zipFile, setZipFile] = useState(zipFileDetails);
  const [mainFileError, setMainFileError] = useState({ invalid: false, message: '' });

  const handleZipDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const a: HTMLAnchorElement = document.body.appendChild(document.createElement('a'));

    a.download = file.name;
    a.href = url;
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  function zipToBase64(file: File, callBack: (file: File, result: string) => void) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const zip = await jsZip.loadAsync(file);
      setZipFile({ name: file.name, files: Object.keys(zip.files).filter(file => file.endsWith('.js')), blob: file });
      callBack(file, reader.result as unknown as string);
    };
  }

  async function onFileUpload(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      setScript({
        name: '',
        text: '',
        extension: ''
      });
      return;
    }
    try {
      let text = '';
      const extension = e.target.value.substring(e.target.value.lastIndexOf('.') + 1);
      isModified(false);
      setZipFile({ name: '', files: [], blob: null });
      if (extension === 'js' || extension === 'side') {
        text = await e.target.files[0].text();
        setScript({ name: e.target.files[0].name, text, extension });
        if (extension === 'js') {
          setScriptErrors(validate(text));
        } else {
          setScriptErrors([] as Error[]);
        }
      } else {
        setMainFileError({ invalid: false, message: '' });
        const file = e.target.files[0];
        zipToBase64(file, (file, result) => {
          text = result.replace(/^data:application\/[a-z-]+;base64,/, '');
          setScript({ name: file.name, text, scriptFile: '', extension });
        });
      }
    } catch (e) {
      setScript({
        name: '',
        text: '',
        errorMessage: t('in-synthetics:dialog.createTest.requestStep.failureToReadFileContent', {
          error: (e as { message: string }).message ?? 'Unknown error'
        }),
        extension: ''
      });
    }
  }

  function onEditScript(text: string) {
    if (script.extension !== 'side') {
      setScriptErrors(validate(text));
      setScript({
        name: modified ? '' : script.name,
        text,
        extension: modified ? '' : script.extension
      });
      isModified(true);
    }
    setZipFile({ name: '', files: [], blob: null });
  }

  return (
    <SlideInView
      staticContent={
        <ConfigSlideContentWrapper>
          <div className={locals.outerBox}>
            <div className={locals.section}>
              <HorizontalFlexWrapper className={locals.upload}>
                <div>
                  <div className={locals.scriptTitle}>
                    {t('in-synthetics:dialog.createTest.advancedMode.configStep.uploadFileLabel')}
                  </div>
                  <DescriptionText>
                    {isBrowser
                      ? t('in-synthetics:dialog.createTest.advancedMode.configStep.browserUploadFileDescription')
                      : t('in-synthetics:dialog.createTest.advancedMode.configStep.uploadFileDescription')}
                  </DescriptionText>
                </div>
              </HorizontalFlexWrapper>
              <Stack direction="vertical" gap="normal">
                <>
                  <FileInputButton
                    accept={isBrowser ? 'text/javascript,.zip,.side' : 'text/javascript,.zip'}
                    onChange={onFileUpload}
                  />
                  {script.errorMessage && <SaveError>{script.errorMessage}</SaveError>}
                </>
                {zipFile.blob && (
                  <Button
                    onClick={() => handleZipDownload(zipFile.blob!)}
                    kind="ghost"
                    size="sm"
                    renderIcon={() => <IconForButton icon="lib_actions_download" iconSize="s" />}
                  >
                    {t('in-synthetics:dialog.createTest.advancedMode.configStep.downloadZip')}
                  </Button>
                )}
              </Stack>
              {script.extension === 'zip' && (
                <TextInput
                  className={locals.mainFileNameField}
                  disabled={zipFile.files.length === 0}
                  helperText={t('in-synthetics:dialog.createTest.advancedMode.configStep.mainFileNameHelperText')}
                  id={generateUniqueShortId()}
                  invalid={mainFileError.invalid}
                  invalidText={mainFileError.message ?? ''}
                  labelText={t('in-synthetics:dialog.createTest.advancedMode.configStep.mainFileNameLabel')}
                  onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                    const valueNotBlank: ValidationResult = notBlankValidator(target.value);
                    const valueUndefined: ValidationResult = notUndefinedValidator(target.value);
                    const invalidFileName: ValidationResult = mainFileNameValidator(zipFile, target.value);
                    if (valueUndefined) {
                      setMainFileError({ invalid: true, message: valueUndefined[0].message! });
                    } else if (valueNotBlank) {
                      setMainFileError({ invalid: true, message: valueNotBlank[0].message! });
                    } else if (invalidFileName) {
                      setMainFileError({ invalid: true, message: invalidFileName[0].message! });
                    } else {
                      setMainFileError({ invalid: false, message: '' });
                    }
                    script.scriptFile = target.value;
                    setScript({ ...script });
                  }}
                  type="text"
                  value={script.scriptFile}
                  name="fileName"
                />
              )}
            </div>
            <div className={locals.innerBox}>
              <div className={locals.scriptTitle}>
                {t('in-synthetics:dialog.createTest.advancedMode.configStep.scriptLabel')}
              </div>
              {script.extension !== 'zip' && script.extension !== 'side' ? (
                <>
                  <DescriptionText>
                    {t('in-synthetics:dialog.createTest.advancedMode.configStep.scriptDescription')}
                  </DescriptionText>
                  <CodeInput value={script.text} onChange={onEditScript} height="30vh" />
                  {scriptErrors && scriptErrors.length !== 0 && (
                    <ErrorList className={locals.errorList} errors={scriptErrors} />
                  )}
                  {scriptErrors.length === 0 && isNotBlank(script.text) && (
                    <div className={locals.message}>
                      <Message
                        type="success"
                        title={t('in-synthetics:dialog.createTest.advancedMode.configStep.validScriptMessage')}
                      />
                    </div>
                  )}
                </>
              ) : (
                <Message
                  withIcon
                  title={
                    isBrowser && script.extension === 'side'
                      ? t('in-synthetics:dialog.createTest.advancedMode.configStep.sideFileUploadedMessage')
                      : t('in-synthetics:dialog.createTest.advancedMode.configStep.zipFileUploadedMessage')
                  }
                />
              )}
            </div>
          </div>
          <DialogFooter
            form={form}
            onSecondaryActionClick={() =>
              setSliderState({
                slideInConfig: {},
                isVisible: false
              })
            }
            secondaryActionText={t('in-synthetics:dialog.createTest.advancedMode.configStep.buttonBack')}
            renderCustomSaveAction={() => (
              <SaveButton
                type="submit"
                kind="create"
                disabled={
                  isBlank(script.text) ||
                  (scriptErrors && scriptErrors.length !== 0 && script.extension !== 'zip') ||
                  ((mainFileError.invalid || isBlank(script.scriptFile)) && script.extension === 'zip')
                }
                onClick={() => onSubmit(script, zipFile)}
              >
                {isBlank(script.text)
                  ? t('in-synthetics:dialog.createTest.advancedMode.configStep.buttonAdd')
                  : t('in-synthetics:dialog.createTest.advancedMode.configStep.buttonSave')}
              </SaveButton>
            )}
          />
        </ConfigSlideContentWrapper>
      }
      showSlideInContent={slideInContentVisible}
      onShowSlideInContentChange={setSlideInContentVisible}
      enforceMaxHeightForStaticContent
      onAfterSlideOut={() => {
        setCustomSlideInHeaderConfig({
          title: null,
          onClose: null
        });
      }}
    />
  );
}
