/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createMapForm, createField } from 'formalistic';

import {
  apiScriptTest,
  apiSimpleTest,
  browserScriptTest,
  browserSimpleTest,
  SSLCertificateTest
} from 'in-synthetics/utils/constants';
import {
  dnsServerValidator,
  lookupValidator,
  responseTimeValidator
} from 'in-synthetics/createTests/validators/dnsValidators';
import urlValidator, {
  checkForInvalidHost,
  checkForInvalidPort
} from 'in-synthetics/createTests/validators/urlValidator';
import { arrayValidator, booleanValidator, numberValidator, stringValidator } from 'in-services/validators/jsonType';
import { regExpValidator, statusCodeValidator } from 'in-synthetics/createTests/validators/configValidators';
import { AdvancedBluePrint } from 'in-synthetics/createTests/data/advancedModeBluePrints';
import { arrayNotEmptyValidator } from 'in-synthetics/createTests/validators/validator';
import { BluePrint } from 'in-synthetics/createTests/data/simpleModeBluePrints';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { minValidator } from 'in-services/validators/number';
import { t } from 'in-i18n';

export interface HTTPMethodType {
  value: 'GET' | 'POST' | 'PUT' | 'DELETE';
  label: string;
  isdisabled?: boolean;
}

export interface ValidationsType {
  value: 'Expect Status' | 'Expect JSON' | 'Expect Match';
  label: string;
}

export function createForm(
  simpleMode: boolean = true,
  selectedBlueprint?: BluePrint | AdvancedBluePrint,
  savedState?: Record<string, any>
) {
  // @ts-expect-error testType does not exist in advanced mode blueprint
  const advancedModeBlueprintTestType: string = selectedBlueprint?.testType;
  const wizardModeBlueprintTestType: string | undefined = selectedBlueprint?.type;
  let config: any;

  savedState = savedState ?? {};

  const getApiScriptTestConfig = () => {
    return !savedState?.script
      ? createAdvancedScriptConfigurationForm(savedState)
      : createScriptConfigurationForm(simpleMode, savedState);
  };
  if (simpleMode) {
    switch (wizardModeBlueprintTestType) {
      case apiScriptTest:
        config = createScriptConfigurationForm(simpleMode, savedState);
        break;
      case apiSimpleTest:
        config = createActionConfigurationForm(savedState);
        break;
      case browserSimpleTest:
        config = createWebpageActionConfigurationForm(savedState);
        break;
      case browserScriptTest:
        config = createBrowserScriptConfigurationForm(simpleMode, savedState);
        break;
    }
  } else {
    switch (advancedModeBlueprintTestType || wizardModeBlueprintTestType) {
      case 'HTTPAction':
      case apiSimpleTest:
        config = createAdvancedActionConfigurationForm(savedState);
        break;
      case 'HTTPScript':
      case apiScriptTest:
        config = getApiScriptTestConfig();
        break;
      case 'BrowserScript':
      case 'WebpageScript':
      case browserScriptTest:
        config = createBrowserScriptConfigurationForm(simpleMode, savedState);
        break;
      case 'WebpageAction':
      case browserSimpleTest:
        config = createAdvancedWebpageActionConfigurationForm(savedState);
        break;
      case 'SSLCertificate':
      case SSLCertificateTest:
        config = createAdvancedSSLCertificateConfigurationForm(savedState);
        break;
      case 'DNS':
        config = createDNSConfigurationForm(savedState);
    }
  }

  let createTestForm = createMapForm({
    validator: notUndefinedValidator
  })
    .put('configuration', config)
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
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator)
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
        value: savedState?.applicationId ?? null
      })
    )
    .put(
      'customProperties',
      createField({
        value: savedState?.customProperties ?? {}
      })
    );
  if (syntheticRbacLimitedEnabled) {
    return createTestForm
      .put(
        'applications',
        createField({
          value: savedState?.applications ?? []
        })
      )
      .put(
        'websites',
        createField({
          value: savedState?.websites ?? []
        })
      )
      .put(
        'mobileApps',
        createField({
          value: savedState?.mobileApps ?? []
        })
      );
  }
  return createTestForm;
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

function createScriptConfigurationForm(simpleMode: boolean, savedState?: Record<string, any>) {
  if (simpleMode) {
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
          value: savedState?.script,
          validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
        })
      );
  } else {
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
          value: savedState?.script,
          validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
        })
      )
      .put(
        'timeout',
        createField({
          value: savedState?.timeout ?? '0m',
          validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
        })
      )
      .put(
        'retries',
        createField({
          value: savedState?.retries ?? 0,
          validator: composeAndShortCircuitOnError(numberValidator, minValidator(0))
        })
      )
      .put(
        'markSyntheticCall',
        createField({
          value: savedState?.markSyntheticCall ?? true,
          validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
        })
      );
  }
}

function createBrowserScriptConfigurationForm(simpleMode: boolean, savedState?: Record<string, any>) {
  if (simpleMode) {
    return createMapForm()
      .put(
        'syntheticType',
        createField({
          value: savedState?.syntheticType ?? 'BrowserScript',
          validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
        })
      )
      .put(
        'script',
        createField({
          value: savedState?.script,
          validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
        })
      );
  } else {
    return createMapForm()
      .put(
        'syntheticType',
        createField({
          value: savedState?.syntheticType ?? 'BrowserScript',
          validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
        })
      )
      .put(
        'script',
        createField({
          value: savedState?.script,
          validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
        })
      )
      .put(
        'timeout',
        createField({
          value: savedState?.timeout ?? '0m',
          validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
        })
      )
      .put(
        'retries',
        createField({
          value: savedState?.retries ?? 0,
          validator: composeAndShortCircuitOnError(numberValidator, minValidator(0))
        })
      )
      .put(
        'markSyntheticCall',
        createField({
          value: savedState?.markSyntheticCall ?? true,
          validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
        })
      )
      .put(
        'recordVideo',
        createField({
          value: savedState?.recordVideo ?? false,
          validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
        })
      );
  }
}

function createWebpageActionConfigurationForm(savedState?: Record<string, any>) {
  return createMapForm()
    .put(
      'syntheticType',
      createField({
        value: savedState?.syntheticType ?? 'WebpageAction',
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
    );
}

function createAdvancedScriptConfigurationForm(savedState?: Record<string, any>) {
  return createMapForm()
    .put(
      'syntheticType',
      createField({
        value: savedState?.syntheticType,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'timeout',
      createField({
        value: savedState?.timeout ?? '0m',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'retries',
      createField({
        value: savedState?.retries ?? 0,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(0))
      })
    )
    .put(
      'markSyntheticCall',
      createField({
        value: savedState?.markSyntheticCall ?? true,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    );
}

export function createZipScriptConfigurationForm(bundle: string, scriptFile: string) {
  return createMapForm()
    .put(
      'bundle',
      createField({
        value: bundle,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'scriptFile',
      createField({
        value: scriptFile,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    );
}

export function createAdvancedActionConfigurationForm(savedState?: Record<string, any>) {
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
        value: savedState?.expectStatus ?? '200',
        validator: statusCodeValidator
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
        validator: regExpValidator
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
      'timeout',
      createField({
        value: savedState?.timeout ?? '0m',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'retries',
      createField({
        value: savedState?.retries ?? 0,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(0))
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
    )
    .put(
      'markSyntheticCall',
      createField({
        value: savedState?.markSyntheticCall ?? true,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    );
}

export function createAdvancedWebpageActionConfigurationForm(savedState?: Record<string, any>) {
  return createMapForm()
    .put(
      'syntheticType',
      createField({
        value: savedState?.syntheticType ?? 'WebpageAction',
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
      'timeout',
      createField({
        value: savedState?.timeout ?? '0m',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'retries',
      createField({
        value: savedState?.retries ?? 0,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(0))
      })
    )
    .put(
      'markSyntheticCall',
      createField({
        value: savedState?.markSyntheticCall ?? true,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    )
    .put(
      'recordVideo',
      createField({
        value: savedState?.recordVideo ?? false,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    );
}

export function createAdvancedSSLCertificateConfigurationForm(savedState?: Record<string, any>) {
  return createMapForm()
    .put(
      'syntheticType',
      createField({
        value: savedState?.syntheticType ?? 'SSLCertificate',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'hostname',
      createField({
        value: savedState?.hostname ?? '',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          checkForInvalidHost
        )
      })
    )
    .put(
      'port',
      createField({
        value: savedState?.port ?? 443,
        validator: composeAndShortCircuitOnError(
          notBlankValidator,
          numberValidator,
          minValidator(1),
          checkForInvalidPort
        )
      })
    )
    .put(
      'daysRemainingCheck',
      createField({
        value: savedState?.daysRemainingCheck ?? '',
        validator: composeAndShortCircuitOnError(notBlankValidator, numberValidator, minValidator(0))
      })
    )
    .put(
      'validationRules',
      createField({
        value: savedState?.validationRules ?? []
      })
    )
    .put(
      'timeout',
      createField({
        value: savedState?.timeout ?? '0m',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'retries',
      createField({
        value: savedState?.retries ?? 0,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(0))
      })
    )
    .put(
      'markSyntheticCall',
      createField({
        value: savedState?.markSyntheticCall ?? true,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    )
    .put(
      'acceptSelfSignedCertificate',
      createField({
        value: savedState?.acceptSelfSignedCertificate ?? false,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    );
}

export function createDNSConfigurationForm(savedState?: Record<string, any>) {
  return createMapForm()
    .put(
      'syntheticType',
      createField({
        value: savedState?.syntheticType ?? 'DNS',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'lookup',
      createField({
        value: savedState?.lookup ?? '',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          lookupValidator
        )
      })
    )
    .put(
      'lookupServerName',
      createField({
        value: savedState?.lookupServerName ?? false,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    )
    .put(
      'port',
      createField({
        value: savedState?.port ?? 53,
        validator: composeAndShortCircuitOnError(notBlankValidator, numberValidator, checkForInvalidPort)
      })
    )
    .put(
      'queryTime',
      createField({
        value: savedState?.queryTime ?? {
          key: 'responseTime',
          operator: 'LESS_THAN',
          value: 120
        },
        validator: composeAndShortCircuitOnError(responseTimeValidator)
      })
    )
    .put(
      'queryType',
      createField({
        value: savedState?.queryType ?? 'A',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'transport',
      createField({
        value: savedState?.transport ?? 'UDP',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'recursiveLookups',
      createField({
        value: savedState?.recursiveLookups ?? true,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    )
    .put(
      'acceptCNAME',
      createField({
        value: savedState?.acceptCNAME ?? false,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    )
    .put(
      'server',
      createField({
        value: savedState?.server ?? '8.8.8.8',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          dnsServerValidator
        )
      })
    )
    .put(
      'serverRetries',
      createField({
        value: savedState?.serverRetries ?? 1,
        validator: composeAndShortCircuitOnError(notBlankValidator, numberValidator)
      })
    )
    .put(
      'targetValues',
      createField({
        value: savedState?.targetValues ?? []
      })
    )
    .put(
      'timeout',
      createField({
        value: savedState?.timeout ?? '0m',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'retries',
      createField({
        value: savedState?.retries ?? 0,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(0))
      })
    )
    .put(
      'markSyntheticCall',
      createField({
        value: savedState?.markSyntheticCall ?? true,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    );
}

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
