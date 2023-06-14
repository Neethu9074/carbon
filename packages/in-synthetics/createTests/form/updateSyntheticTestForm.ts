/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createMapForm, createField } from 'formalistic';

import {
  HTTPMethodType,
  HTTPMethods,
  createZipScriptConfigurationForm,
  syntheticFormValidator
} from 'in-synthetics/createTests/form/createSyntheticTestForm';
import { arrayValidator, booleanValidator, numberValidator, stringValidator } from 'in-services/validators/jsonType';
import { regExpValidator, statusCodeValidator } from 'in-synthetics/createTests/validators/configValidators';
import { arrayNotEmptyValidator } from 'in-synthetics/createTests/validators/validator';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import urlValidator from 'in-synthetics/createTests/validators/urlValidator';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { minValidator } from 'in-services/validators/number';

export function createForm(savedState: Record<string, any>) {
  return createMapForm({
    validator: syntheticFormValidator
  })
    .put(
      'configuration',
      savedState?.configuration?.syntheticType === 'HTTPScript'
        ? savedState?.configuration?.script
          ? createScriptFileConfigurationForm(savedState?.configuration)
          : createScriptsBundleConfigurationForm(savedState?.configuration)
        : createActionConfigurationForm(savedState?.configuration)
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
        value: savedState?.testFrequency,
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
        value: savedState?.customProperties ?? {}
      })
    );
}

function createActionConfigurationForm(configuration: Record<string, any>) {
  return createMapForm()
    .put(
      'syntheticType',
      createField({
        value: configuration?.syntheticType,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'operation',
      createField({
        value: configuration?.operation,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(HTTPMethods.map((method: HTTPMethodType) => method.value))
        )
      })
    )
    .put(
      'url',
      createField({
        value: configuration?.url,
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
        value: configuration?.headers ?? {}
      })
    )
    .put(
      'expectStatus',
      createField({
        value: configuration?.expectStatus?.toString() ?? '',
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
        value: configuration?.expectJson ?? {}
      })
    )
    .put(
      'expectMatch',
      createField({
        value: configuration?.expectMatch ?? '',
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
        value: configuration?.body ?? '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'validationString',
      createField({
        value: configuration?.validationString ?? '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'followRedirect',
      createField({
        value: configuration?.followRedirect,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    )
    .put(
      'allowInsecure',
      createField({
        value: configuration?.allowInsecure,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    );
}

function createScriptFileConfigurationForm(configuration: Record<string, any>) {
  return createMapForm()
    .put(
      'syntheticType',
      createField({
        value: configuration?.syntheticType,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'script',
      createField({
        value: configuration?.script,
        validator: notUndefinedValidator
      })
    );
}

function createScriptsBundleConfigurationForm(configuration: Record<string, any>) {
  return createMapForm()
    .put(
      'syntheticType',
      createField({
        value: configuration?.syntheticType,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put('scripts', createZipScriptConfigurationForm(configuration.scripts.bundle, configuration.scripts.scriptFile!));
}
