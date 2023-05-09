/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createMapForm, createField } from 'formalistic';

import { arrayValidator, booleanValidator, numberValidator, stringValidator } from 'in-services/validators/jsonType';
import { regExpValidator, statusCodeValidator } from 'in-synthetics/utils/configValidators';
import { arrayNotEmptyValidator } from 'in-synthetics/components/validators/validator';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { AdvancedBluePrint } from 'in-synthetics/data/advancedModeBluePrints';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { BluePrint } from 'in-synthetics/data/simpleModeBluePrints';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { minValidator } from 'in-services/validators/number';
import urlValidator from 'in-synthetics/utils/urlValidator';
import { t } from 'in-i18n';

interface HTTPMethodType {
  value: 'GET' | 'POST' | 'PUT' | 'DELETE';
  label: string;
  isdisabled?: boolean;
}

interface ValidationsType {
  value: 'Expect Status' | 'Expect JSON' | 'Expect Match';
  label: string;
}

export function createForm(
  simpleMode: boolean = true,
  selectedBlueprint?: BluePrint | AdvancedBluePrint,
  savedState?: Record<string, any>
) {
  return createMapForm({
    validator: syntheticFormValidator
  })
    .put(
      'configuration',
      // @ts-expect-error testType does not exist in BluePrint type
      selectedBlueprint?.type === 'Script API' || selectedBlueprint?.testType === 'HTTPScript'
        ? createScriptConfigurationForm(savedState ?? {})
        : !simpleMode
        ? createAdvancedActionConfigurationForm(savedState ?? {})
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
      'locations',
      createField({
        value: savedState?.locations ?? [],
        validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator, arrayNotEmptyValidator)
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
    )
    .put(
      'applicationId',
      createField({
        value: savedState?.applicationId ?? null,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator)
      })
    )
    .put(
      'customProperties',
      createField({
        value: savedState?.headers ?? { '': '' }
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
        value: savedState?.url ?? '',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          urlValidator
        )
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
        value: savedState?.scriptValue,
        validator: notUndefinedValidator
      })
    );
}

function createAdvancedActionConfigurationForm(savedState?: Record<string, any>) {
  return createMapForm()
    .put(
      'syntheticType',
      createField({
        value: savedState?.syntheticType ?? 'HTTPAction',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
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
    )
    .put(
      'url',
      createField({
        value: savedState?.url ?? '',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          urlValidator
        )
      })
    )
    .put(
      'headers',
      createField({
        value: savedState?.headers ?? {}
      })
    )
    .put(
      'expectStatus',
      createField({
        value: savedState?.expectStatus ?? '',
        validator: composeAndShortCircuitOnError(
          statusCodeValidator,
          notUndefinedValidator,
          stringValidator,
          notBlankValidator
        )
      })
    )
    .put(
      'expectJson',
      createField({
        value: savedState?.expectJson ?? {}
      })
    )
    .put(
      'expectMatch',
      createField({
        value: savedState?.expectMatch ?? '',
        validator: composeAndShortCircuitOnError(
          regExpValidator,
          notUndefinedValidator,
          stringValidator,
          notBlankValidator
        )
      })
    )
    .put(
      'body',
      createField({
        value: savedState?.body ?? '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'validationString',
      createField({
        value: savedState?.validationString ?? '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'followRedirect',
      createField({
        value: savedState?.followRedirect ?? true,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    )
    .put(
      'allowInsecure',
      createField({
        value: savedState?.allowInsecure ?? true,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
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

export const Validations: readonly ValidationsType[] = Object.freeze([
  {
    value: 'Expect Status',
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.expectStatusLabel')
  },
  {
    value: 'Expect JSON',
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.expectJSONLabel')
  },
  {
    value: 'Expect Match',
    label: t('in-synthetics:dialog.createTest.advancedMode.configStep.expectMatchLabel')
  }
]);
