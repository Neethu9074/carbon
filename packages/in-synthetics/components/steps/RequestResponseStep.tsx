/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, MapForm, Item } from 'formalistic';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Stack } from '@instana/components';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { HTTPMethods } from 'in-synthetics/form/createSyntheticTestForm';
import Section, { SubTitle } from 'in-synthetics/components/Section';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { dummyLocations } from 'in-synthetics/utils/constants';
import FormGroup from 'in-components/form/FormGroup';
import { getLocations } from 'in-synthetics/api';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { Progress } from 'in-types';
import { t } from 'in-i18n';

import locals from './RequestResponseStep.mless';

export interface Props {
  form: MapForm;
  updateForm: (form: MapForm) => void;
}

export interface LocationsResponse {
  data?: Record<string, any>[];
  errors?: Error[];
  progress: Progress;
  time?: number;
}

export default function RequestResponseStep({ form, updateForm }: Props) {
  const configForm = form.get('configuration') as MapForm;
  const methodField = configForm.get('operation') as Field<string>;
  const urlField = configForm.get('url') as Field<string>;
  const locations: LocationsResponse = useObservable<any, []>(() => getLocations(), []) || dummyLocations;
  const locationsField = form.get('locations') as Field<string[]>;

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

  return (
    <Section headingText={t('in-synthetics:dialog.createTest.requestStep.title')}>
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

      <div>
        <SubTitle>{t('in-synthetics:dialog.createTest.requestStep.popSubTitle')}</SubTitle>
        {renderLocations()}
      </div>
    </Section>
  );
}
