/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { ChangeEvent, useState } from 'react';
import { Field, MapForm, Item } from 'formalistic';

import { useObservable } from '@instana/hooks';
import { Stack } from '@instana/components';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import FileInputButton from 'in-components/form/FileInputButton/FileInputButton';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { HTTPMethods } from 'in-synthetics/form/createSyntheticTestForm';
import Section, { SubTitle } from 'in-synthetics/components/Section';
import { BluePrint } from 'in-synthetics/data/simpleModeBluePrints';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { dummyLocations } from 'in-synthetics/utils/constants';
import SaveError from 'in-components/form/SaveError/SaveError';
import { validate } from 'in-synthetics/utils/scriptUploader';
import { Progress, Error as ScriptError } from 'in-types';
import FormGroup from 'in-components/form/FormGroup';
import { getLocations } from 'in-synthetics/api';
import Code from 'in-synthetics/packages/Code';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './RequestResponseStep.mless';

export interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  selectedBlueprint: BluePrint;
  scriptErrors: ScriptError[];
  setScriptErrors: React.Dispatch<React.SetStateAction<ScriptError[]>>;
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
  setScriptErrors
}: Props) {
  const configForm = form.get('configuration') as MapForm<any>;
  const methodField = configForm.get('operation') as Field<string>;
  const urlField = configForm.get('url') as Field<string>;
  const locations: LocationsResponse = useObservable<any, []>(() => getLocations(), []) || dummyLocations;
  const locationsField = form.get('locations') as Field<string[]>;
  const [state, setState] = useState<State>({ loading: false });
  const script = configForm.get('script') as Field<string>;

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
    if (!locations.data?.filter(Boolean)?.length) {
      return (
        <div className={locals.locationContainer}>
          <NoDataAvailable text={t('in-synthetics:dialog.createTest.noLocationFound')} />
        </div>
      );
    }

    return (
      <div>
        {locations.data?.filter(Boolean).map(location => (
          <CheckboxFancy
            key={location.id}
            label={location.displayLabel}
            checked={locationsField?.value?.includes(location.id)}
            onChange={() => onLocationSelect(location)}
          />
        ))}
      </div>
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
      updateCode(text);
    } catch (e) {
      setState({
        loading: false,
        errorMessage: t('in-synthetics:dialog.createTest.requestStep.failureToReadFileContent', {
          error: (e as { message: string }).message ?? 'Unknown error'
        })
      });
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
  }

  return (
    <Section headingText={t('in-synthetics:dialog.createTest.requestStep.title')}>
      {selectedBlueprint.type === 'Ping API' && (
        <div className={locals.requestContainer}>
          <SubTitle>{t('in-synthetics:dialog.createTest.requestStep.subTitle')}</SubTitle>
          <Stack direction="horizontal">
            <FormGroup>
              <Label htmlFor={'httpMethod'} hasError={!methodField?.valid && methodField?.touched}>
                {t('in-synthetics:dialog.createTest.requestStep.labelOperation')}
              </Label>
              <ComboBox
                name={'httpMethod'}
                value={methodField?.value}
                options={HTTPMethods}
                onChange={e => {
                  if (e != null && !(e instanceof Array)) {
                    updateForm(
                      form.updateIn(['configuration', 'operation'], (field: Item) =>
                        (field as Field<string>).setValue(e.value).setTouched(true)
                      )
                    );
                  }
                }}
                defaultValue={HTTPMethods[0].value}
                isClearable={false}
                isOptionDisabled={(option: any) => option.isdisabled}
                isDisabled // Only GET is being supported in the first iteration
              />
              <TouchedMessages field={methodField} />
            </FormGroup>

            {urlField.map(field => (
              <FormGroup className={locals.urlInput}>
                <Label htmlFor="url" hasError={!field.valid && field.touched}>
                  {t('in-synthetics:dialog.createTest.requestStep.labelUrl')}
                </Label>
                <Input
                  name="url"
                  value={field.value}
                  onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                    updateForm(
                      form.updateIn(['configuration', 'url'], (field: Item) =>
                        (field as Field<string>).setValue(target?.value).setTouched(true)
                      )
                    );
                  }}
                  hasError={!field.valid && field.touched}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Stack>
        </div>
      )}

      <div className={locals.requestContainer}>
        <Stack direction="horizontal" gap="normal">
          <div>
            {selectedBlueprint.type === 'Script API' && (
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

          {selectedBlueprint.type === 'Script API' && (
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
