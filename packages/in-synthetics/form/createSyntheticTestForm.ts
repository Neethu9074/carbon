/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createMapForm, createField, ValidationResult } from 'formalistic';

import { arrayValidator, numberValidator, stringValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { BluePrint } from 'in-synthetics/data/simpleModeBluePrints';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { minValidator } from 'in-services/validators/number';
import { t } from 'in-i18n';

interface HTTPMethodType {
  value: 'GET' | 'POST' | 'PUT' | 'DELETE';
  label: string;
  isdisabled?: boolean;
}

export function createForm(selectedBlueprint?: BluePrint, savedState?: Record<string, any>) {
  return createMapForm({
    validator: syntheticFormValidator
  })
    .put(
      'configuration',
      selectedBlueprint?.type === 'Script API'
        ? createScriptConfigurationForm(savedState ?? {})
        : createActionConfigurationForm(savedState ?? {})
    )
    .put(
      'response',
      createField({
        value: savedState?.response,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'playbackMode',
      createField({
        value: savedState?.response || playbackModes[0].value,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'locations',
      createField({
        value: savedState?.locations ?? [],
        validator: arrayValidator
      })
    )
    .put(
      'label',
      createField({
        value: savedState?.label ?? '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'description',
      createField({
        value: savedState?.description ?? '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'testFrequency',
      createField({
        value: savedState?.testFrequency ?? 15,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(1))
      })
    );
}

function createActionConfigurationForm(savedState?: Record<string, any>) {
  return createMapForm()
    .put(
      'syntheticType',
      createField({
        value: savedState?.syntheticType ?? 'HTTPAction',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'url',
      createField({
        value: savedState?.url,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator, validUrl)
      })
    )
    .put(
      'operation',
      createField({
        value: savedState?.method || HTTPMethods[0].value,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(HTTPMethods.map(method => method.value))
        )
      })
    );
}

function createScriptConfigurationForm(savedState?: Record<string, any>) {
  return createMapForm()
    .put(
      'syntheticType',
      createField({
        value: savedState?.syntheticType ?? 'HTTPScript',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'script',
      createField({
        value: savedState?.fileContent,
        validator: notUndefinedValidator
      })
    );
}

export const syntheticFormValidator = (data: any) => {
  if (data == null) {
    return null;
  }

  return null;
};

export const HTTPMethods: readonly HTTPMethodType[] = Object.freeze([
  { value: 'GET', label: t('in-synthetics:dialog.httpMethods.get') },
  { value: 'POST', label: t('in-synthetics:dialog.httpMethods.post'), isdisabled: true },
  { value: 'PUT', label: t('in-synthetics:dialog.httpMethods.put'), isdisabled: true },
  { value: 'DELETE', label: t('in-synthetics:dialog.httpMethods.delete'), isdisabled: true }
]);

export function validUrl(value: string): ValidationResult {
  if (!/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/.test(value)) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.form.validUrl')
      }
    ];
  }
  return undefined;
}

export const playbackModes = Object.freeze([
  { value: 'Simultaneous', label: t('in-synthetics:dialog.createTest.scheduling.simultaneous') },
  { value: 'Staggered', label: t('in-synthetics:dialog.createTest.scheduling.staggered') }
]);
