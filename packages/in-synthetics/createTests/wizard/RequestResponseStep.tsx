/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { ChangeEvent, useState } from 'react';
import { Field, MapForm, Item } from 'formalistic';

import { Result, SyntheticLocation } from '@instana/types/typeDefinitions';
import { Li, ScrollBox, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  Code as CodeType,
  apiScriptTest,
  apiSimpleTest,
  browserScriptTest,
  browserSimpleTest,
  dummyLocations
} from 'in-synthetics/utils/constants';
import BrowserSimpleTestSection from 'in-synthetics/createTests/wizard/BrowserSimpleTestSection';
import ApiSimpleTestSection from 'in-synthetics/createTests/wizard/ApiSimpleTestSection';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import FileInputButton from 'in-components/form/FileInputButton/FileInputButton';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { BluePrint } from 'in-synthetics/createTests/data/simpleModeBluePrints';
import Section, { SubTitle } from 'in-synthetics/createTests/wizard/Section';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { getLocationsAsResultObservable } from 'in-synthetics/api';
import SaveError from 'in-components/form/SaveError/SaveError';
import { validate } from 'in-synthetics/utils/scriptUploader';
import { Progress, Error as ScriptError } from 'in-types';
import Code from 'in-synthetics/packages/Code';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/wizard/RequestResponseStep.mless';

export interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  selectedBlueprint: BluePrint;
  scriptErrors: ScriptError[];
  setScriptErrors: React.Dispatch<React.SetStateAction<ScriptError[]>>;
  scriptDetails: CodeType;
  setScriptDetails: React.Dispatch<React.SetStateAction<CodeType>>;
}

export interface LocationsResponse {
  data?: Record<string, any>[];
  errors?: Error[];
  progress: Progress;
  time?: number;
}

interface State {
  loading: boolean;
  script?: string;
  errorMessage?: string;
}

export default function RequestResponseStep({
  form,
  updateForm,
  selectedBlueprint,
  scriptErrors,
  setScriptErrors,
  scriptDetails,
  setScriptDetails
}: Props) {
  const configForm = form.get('configuration') as MapForm<any>;
  const syntheticType = configForm.get('syntheticType') as Field<string>;
  const methodField = configForm.get('operation') as Field<string>;
  const urlField = configForm.get('url') as Field<string>;
  const locations: LocationsResponse = useObservable<any, []>(
    () =>
      getLocationsAsResultObservable(syntheticType.value).map((result: Result<SyntheticLocation[]> | null) => {
        if (result == null) {
          return null;
        }
        return (result as Result<SyntheticLocation[]>) ?? dummyLocations;
      }),
    []
  );
  const locationsField = form.get('locations') as Field<string[]>;
  const [state, setState] = useState<State>({ loading: false });
  const script = configForm.get('script') as Field<string>;
  const renderScript: boolean =
    selectedBlueprint.type === apiScriptTest || selectedBlueprint.type === browserScriptTest;

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
  function renderLocations() {
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
            <CheckboxFancy
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
      setState({
        loading: false
      });
      return;
    }
    try {
      const text = await e.target.files[0].text();
      setScriptDetails({ modified: false, name: e.target.files[0].name });
      setScriptErrors(validate(text));
      setState({
        loading: false,
        script: text
      });
      updateForm(
        form.updateIn(['configuration', 'script'], (field: Item) =>
          (field as Field<string>).setValue(text).setTouched(true)
        )
      );
    } catch (e) {
      setState({
        loading: false,
        errorMessage: t('in-synthetics:dialog.createTest.requestStep.failureToReadFileContent', {
          error: (e as { message: string }).message ?? 'Unknown error'
        })
      });
      setScriptDetails({ modified: false, name: '' });
    }
  }

  function updateCode(text: string) {
    setScriptErrors(validate(text));
    setState({
      loading: false,
      script: text
    });
    updateForm(
      form.updateIn(['configuration', 'script'], (field: Item) =>
        (field as Field<string>).setValue(text).setTouched(true)
      )
    );
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
                <FileInputButton accept="text/javascript" onChange={onChange} disabled={state.loading} />
                {state.errorMessage && <SaveError>{state.errorMessage}</SaveError>}
              </>
            )}
            <SubTitle>{t('in-synthetics:dialog.createTest.requestStep.popSubTitle')}</SubTitle>
            {renderLocations()}
          </div>

          {renderScript && (
            <div className={locals.scriptUpload}>
              {script.map(field => (
                <>
                  <Code
                    value={field.value}
                    onChange={updateCode}
                    maxHeight="39vh"
                    maxWidth="63vw"
                    placeholder={t('in-synthetics:dialog.createTest.requestStep.enterTheScriptMessage')}
                  />
                  {scriptErrors && scriptErrors.length !== 0 && <ErrorList errors={scriptErrors} />}
                </>
              ))}
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
