/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, MapForm, Item } from 'formalistic';
import React, { ChangeEvent } from 'react';

import { Li, Message, ScrollBox, Stack, Checkbox } from '@instana/components';
import { Result, SyntheticLocation } from '@instana/types/typeDefinitions';
import { FileInputButton } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  Code as CodeType,
  Script,
  apiScriptTest,
  apiSimpleTest,
  browserScriptTest,
  browserSimpleTest,
  dummyLocations,
  scriptTestType
} from 'in-synthetics/utils/constants';
import BrowserSimpleTestSection from 'in-synthetics/createTests/wizard/BrowserSimpleTestSection';
import ApiSimpleTestSection from 'in-synthetics/createTests/wizard/ApiSimpleTestSection';
import InlineTabNavigation from 'in-components/InlineTabNavigation/InlineTabNavigation';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { BluePrint } from 'in-synthetics/createTests/data/simpleModeBluePrints';
import Section, { SubTitle } from 'in-synthetics/createTests/wizard/Section';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { syntheticInstanaHostedPoPEnabled } from 'in-services/featureFlags';
import { getLocationsAsResultObservable } from 'in-synthetics/api';
import SaveError from 'in-components/form/SaveError/SaveError';
import { validate } from 'in-synthetics/utils/scriptUploader';
import CodeInput from 'in-synthetics/packages/Code/CodeInput';
import { Progress, Error as ScriptError } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/wizard/RequestResponseStep.mless';

export interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  selectedBlueprint: BluePrint;
  script: Script;
  setScript: React.Dispatch<React.SetStateAction<Script>>;
  scriptErrors: ScriptError[];
  setScriptErrors: React.Dispatch<React.SetStateAction<ScriptError[]>>;
  scriptDetails: CodeType;
  setScriptDetails: React.Dispatch<React.SetStateAction<CodeType>>;
  activeTabIndex: number;
  setActiveTabIndex: React.Dispatch<React.SetStateAction<number>>;
}

export interface LocationsResponse {
  data?: Record<string, any>[];
  errors?: Error[];
  progress: Progress;
  time?: number;
}

export default function RequestResponseStep({
  form,
  updateForm,
  selectedBlueprint,
  script,
  setScript,
  scriptErrors,
  setScriptErrors,
  scriptDetails,
  setScriptDetails,
  activeTabIndex,
  setActiveTabIndex
}: Props) {
  const configForm = form.get('configuration') as MapForm<any>;
  const syntheticType = configForm.get('syntheticType') as Field<string>;
  const methodField = configForm.get('operation') as Field<string>;
  const urlField = configForm.get('url') as Field<string>;
  const locationsField = form.get('locations') as Field<string[]>;
  const renderScript: boolean =
    selectedBlueprint.type === apiScriptTest || selectedBlueprint.type === browserScriptTest;
  const isBrowser = selectedBlueprint.type === browserScriptTest ? true : false;
  const locationTypes = ['Private', 'Managed'];

  const tabList = [
    {
      text: t('in-synthetics:dialog.createTest.requestStep.privatePoPLabel')
    },
    {
      text: t('in-synthetics:dialog.createTest.requestStep.managedPoPLabel')
    }
  ];

  const getfileUploadedMessage = (extension: string) => {
    if (extension === 'side')
      return t('in-synthetics:dialog.createTest.advancedMode.configStep.sideFileUploadedMessage');
    else return t('in-synthetics:dialog.createTest.advancedMode.configStep.bundleFileNotSupportedMessage');
  };

  function onLocationSelect(location: Record<string, string>) {
    const selectedLocations = locationsField.value;
    if (selectedLocations.includes(location.id)) {
      selectedLocations.splice(selectedLocations.indexOf(location.id), 1);
    } else {
      selectedLocations.push(location.id);
    }
    updateForm(
      form.updateIn(['locations'], (field: Item) =>
        (field as Field<string[]>).setValue(selectedLocations).setTouched(true)
      )
    );
  }

  /**
   * Loading of locations might take a few seconds as it is being received from an API
   * For that reason we need to consider two more scenarios. Loading state and failure of API call
   */
  function LocationsListBasedOnType({ locationType }: { locationType: string }) {
    const locations: LocationsResponse = useObservable<any, []>(
      () =>
        getLocationsAsResultObservable(syntheticType.value, locationType).map(
          (result: Result<SyntheticLocation[]> | null) => {
            if (result == null) {
              return null;
            }
            return result ?? dummyLocations;
          }
        ),
      []
    );

    if (locations?.progress?.loading) {
      return (
        <div className={locals.locationContainer}>
          <LoadingIndicator size="xl" />
        </div>
      );
    }
    if (!locations?.data?.filter(Boolean)?.length) {
      return (
        <div className={locals.locationContainer}>
          <NoDataAvailable text={t('in-synthetics:dialog.createTest.noLocationFound')} />
        </div>
      );
    }

    return (
      <ScrollBox maxHeight="73.26%" className={locals.scrollBox}>
        {locations.data?.filter(Boolean).map(location => (
          <Li key={location.id}>
            <Checkbox
              label={location.displayLabel}
              checked={locationsField?.value?.includes(location.id)}
              onChange={() => onLocationSelect(location)}
            />
          </Li>
        ))}
      </ScrollBox>
    );
  }

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      setScript({
        name: '',
        text: '',
        extension: ''
      });
      return;
    }

    try {
      const text = await e.target.files[0].text();
      const extension = e.target.value.substring(e.target.value.lastIndexOf('.') + 1);
      const testType = isBrowser ? scriptTestType(extension, syntheticType.value) : syntheticType.value;
      setScriptDetails({ modified: extension === 'side' ? true : false, name: e.target.files[0].name });

      if (extension === 'zip') {
        setScript({ name: '', text, extension });
        return;
      }

      if (extension === 'js') {
        setScriptErrors(validate(text));
      } else {
        setScriptErrors([] as ScriptError[]);
      }

      setScript({ name: e.target.files[0].name, text, extension });
      try {
        updateForm(
          form
            .updateIn(['configuration', 'script'], (field: Item) =>
              (field as Field<string>).setValue(extension === 'js' ? String(JSON.parse(text)) : text).setTouched(true)
            )
            .updateIn(['configuration', 'syntheticType'], (field: Item) =>
              (field as Field<string>).setValue(testType).setTouched(true)
            )
        );
      } catch {
        updateForm(
          form
            .updateIn(['configuration', 'script'], (field: Item) =>
              (field as Field<string>).setValue(text).setTouched(true)
            )
            .updateIn(['configuration', 'syntheticType'], (field: Item) =>
              (field as Field<string>).setValue(testType).setTouched(true)
            )
        );
      }
    } catch (error) {
      setScript({
        name: '',
        text: '',
        errorMessage: t('in-synthetics:dialog.createTest.requestStep.failureToReadFileContent', {
          error: (error as { message: string }).message ?? 'Unknown error'
        }),
        extension: ''
      });
      setScriptDetails({ modified: false, name: '' });
    }
  }

  function updateCode(text: string) {
    setScriptErrors(validate(text));
    setScript({
      name: script.name,
      text,
      extension: script.extension
    });
    try {
      updateForm(
        form.updateIn(['configuration', 'script'], (field: Item) =>
          (field as Field<string>).setValue(String(JSON.parse(text))).setTouched(true)
        )
      );
    } catch (e) {
      updateForm(
        form.updateIn(['configuration', 'script'], (field: Item) =>
          (field as Field<string>).setValue(text).setTouched(true)
        )
      );
    }
    setScriptDetails({ modified: true, name: scriptDetails.modified ? '' : scriptDetails.name });
  }

  return (
    <Section headingText={t('in-synthetics:dialog.createTest.requestStep.title')}>
      {getSectionToRender(selectedBlueprint.type, methodField, urlField, form, updateForm)}
      <div className={locals.requestContainer}>
        <Stack direction="horizontal" gap="normal">
          <div>
            {renderScript && (
              <>
                <SubTitle isUploadScriptSubTitle>
                  {t('in-synthetics:dialog.createTest.requestStep.uploadScriptTitle')}
                </SubTitle>
                <FileInputButton accept={isBrowser ? 'text/javascript,.side' : 'text/javascript'} onChange={onChange} />
                {script.errorMessage && <SaveError>{script.errorMessage}</SaveError>}
              </>
            )}
            <SubTitle>{t('in-synthetics:dialog.createTest.requestStep.popSubTitle')}</SubTitle>
            {syntheticInstanaHostedPoPEnabled && (
              <section>
                <InlineTabNavigation
                  tabList={tabList}
                  activeTabIndex={activeTabIndex}
                  onTabSelect={setActiveTabIndex}
                />
              </section>
            )}
            <LocationsListBasedOnType
              locationType={syntheticInstanaHostedPoPEnabled ? locationTypes[activeTabIndex] : ''}
            />
          </div>

          {renderScript && (
            <div className={locals.scriptUpload}>
              {script.extension === 'js' ? (
                <>
                  <CodeInput
                    value={script.text}
                    onChange={updateCode}
                    maxHeight="39vh"
                    maxWidth="63vw"
                    placeholder={t('in-synthetics:dialog.createTest.requestStep.enterTheScriptMessage')}
                  />
                  {scriptErrors && scriptErrors.length !== 0 && <ErrorList errors={scriptErrors} />}
                </>
              ) : (
                <Message className={locals.message} withIcon title={getfileUploadedMessage(script.extension)} />
              )}
            </div>
          )}
        </Stack>
      </div>
    </Section>
  );
}

const getSectionToRender = (
  bluePrintType: string,
  methodField: Field<string>,
  urlField: Field<string>,
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void
) => {
  switch (bluePrintType) {
    case apiSimpleTest:
      return <ApiSimpleTestSection methodField={methodField} updateForm={updateForm} urlField={urlField} form={form} />;
    case browserSimpleTest:
      return <BrowserSimpleTestSection updateForm={updateForm} urlField={urlField} form={form} />;
    default:
      return null;
  }
};
