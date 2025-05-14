/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createMapForm, createField } from 'formalistic';

import {
  HTTPMethodType,
  HTTPMethods,
  createZipScriptConfigurationForm
} from 'in-synthetics/createTests/form/createSyntheticTestForm';
import {
  lookupValidator,
  responseTimeValidator,
  dnsServerValidator
} from 'in-synthetics/createTests/validators/dnsValidators';
import urlValidator, {
  checkForInvalidHost,
  checkForInvalidPort
} from 'in-synthetics/createTests/validators/urlValidator';
import { arrayValidator, booleanValidator, numberValidator, stringValidator } from 'in-services/validators/jsonType';
import { regExpValidator, statusCodeValidator } from 'in-synthetics/createTests/validators/configValidators';
import { arrayNotEmptyValidator } from 'in-synthetics/createTests/validators/validator';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { minValidator } from 'in-services/validators/number';

export function updateForm(savedState: Record<string, any>) {
  const getScriptConfiguration = () => {
    const isFile: boolean = savedState?.configuration?.script != undefined;
    return isFile
      ? createScriptFileConfigurationForm(savedState?.configuration)
      : createScriptsBundleConfigurationForm(savedState?.configuration);
  };

  const getActionConfiguration = () => {
    return savedState?.configuration?.syntheticType === 'HTTPAction'
      ? createActionConfigurationForm(savedState?.configuration)
      : createAdvancedBrowserActionConfigurationForm(savedState?.configuration);
  };

  const getConfigurationToRender = () => {
    let config;
    if (['HTTPScript', 'WebpageScript', 'BrowserScript'].includes(savedState?.configuration?.syntheticType)) {
      config = getScriptConfiguration();
    } else if (['HTTPAction', 'WebpageAction'].includes(savedState?.configuration?.syntheticType)) {
      config = getActionConfiguration();
    } else if (savedState?.configuration?.syntheticType === 'DNS') {
      config = createDNSConfigurationForm(savedState?.configuration);
    } else {
      config = createAdvancedSSLCertificateConfigurationForm(savedState?.configuration);
    }
    return config;
  };

  let updateTestForm = createMapForm({
    validator: notUndefinedValidator
  })
    .put('configuration', getConfigurationToRender())
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
      'customProperties',
      createField({
        value: savedState?.customProperties ?? {}
      })
    );
  if (syntheticRbacLimitedEnabled) {
    return updateTestForm
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
  return updateTestForm.put(
    'applicationId',
    createField({
      value: savedState?.applicationId ?? null,
      validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator)
    })
  );
}

function createActionConfigurationForm(configuration: Record<string, any>) {
  const actionConfig = createMapForm()
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
        validator: statusCodeValidator
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
        validator: regExpValidator
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
      'timeout',
      createField({
        value: configuration?.timeout,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'retries',
      createField({
        value: configuration?.retries,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(0))
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
    )
    .put(
      'markSyntheticCall',
      createField({
        value: configuration?.markSyntheticCall,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    );

  if (configuration?.retryInterval) {
    return actionConfig.put(
      'retryInterval',
      createField({
        value: configuration?.retryInterval,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(1))
      })
    );
  } else {
    return actionConfig;
  }
}

function addRecordVideoConfig(currentConfig: any, configuration: Record<string, any>) {
  return currentConfig.put(
    'recordVideo',
    createField({
      value: configuration?.recordVideo ?? false,
      validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
    })
  );
}

function createScriptFileConfigurationForm(configuration: Record<string, any>) {
  const actionConfig = createMapForm()
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
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'timeout',
      createField({
        value: configuration?.timeout,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'retries',
      createField({
        value: configuration?.retries,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(0))
      })
    )
    .put(
      'markSyntheticCall',
      createField({
        value: configuration?.markSyntheticCall,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    );

  let updatedActionConfig = ['BrowserScript', 'WebpageScript'].includes(configuration.syntheticType)
    ? addRecordVideoConfig(actionConfig, configuration)
    : actionConfig;

  if (configuration?.retryInterval) {
    return updatedActionConfig.put(
      'retryInterval',
      createField({
        value: configuration?.retryInterval,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(1))
      })
    );
  } else {
    return updatedActionConfig;
  }
}

function createScriptsBundleConfigurationForm(configuration: Record<string, any>) {
  const actionConfig = createMapForm()
    .put(
      'syntheticType',
      createField({
        value: configuration?.syntheticType,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'scripts',
      createZipScriptConfigurationForm(configuration?.scripts?.bundle, configuration?.scripts?.scriptFile!)
    )
    .put(
      'timeout',
      createField({
        value: configuration?.timeout,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'retries',
      createField({
        value: configuration?.retries,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(0))
      })
    )
    .put(
      'markSyntheticCall',
      createField({
        value: configuration?.markSyntheticCall,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    );

  let updatedActionConfig = ['BrowserScript', 'WebpageScript'].includes(configuration.syntheticType)
    ? addRecordVideoConfig(actionConfig, configuration)
    : actionConfig;

  if (configuration?.retryInterval) {
    return updatedActionConfig.put(
      'retryInterval',
      createField({
        value: configuration?.retryInterval,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(1))
      })
    );
  } else {
    return updatedActionConfig;
  }
}

function createAdvancedBrowserActionConfigurationForm(configuration: Record<string, any>) {
  const actionConfig = createMapForm()
    .put(
      'syntheticType',
      createField({
        value: configuration?.syntheticType,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
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
      'timeout',
      createField({
        value: configuration?.timeout,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'retries',
      createField({
        value: configuration?.retries,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(0))
      })
    )
    .put(
      'markSyntheticCall',
      createField({
        value: configuration?.markSyntheticCall,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    );

  let updatedActionConfig =
    configuration.syntheticType === 'WebpageAction' ? addRecordVideoConfig(actionConfig, configuration) : actionConfig;

  if (configuration?.retryInterval) {
    return updatedActionConfig.put(
      'retryInterval',
      createField({
        value: configuration?.retryInterval,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(1))
      })
    );
  } else {
    return updatedActionConfig;
  }
}

function createAdvancedSSLCertificateConfigurationForm(configuration?: Record<string, any>) {
  const sslConfig = createMapForm()
    .put(
      'syntheticType',
      createField({
        value: configuration?.syntheticType,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'hostname',
      createField({
        value: configuration?.hostname,
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
        value: configuration?.port,
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
        value: configuration?.daysRemainingCheck,
        validator: composeAndShortCircuitOnError(notBlankValidator, numberValidator, minValidator(0))
      })
    )
    .put(
      'timeout',
      createField({
        value: configuration?.timeout,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'retries',
      createField({
        value: configuration?.retries,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(0))
      })
    )
    .put(
      'acceptSelfSignedCertificate',
      createField({
        value: configuration?.acceptSelfSignedCertificate,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    );

  if (configuration?.retryInterval) {
    return sslConfig.put(
      'retryInterval',
      createField({
        value: configuration?.retryInterval,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(1))
      })
    );
  } else {
    return sslConfig;
  }
}

function createDNSConfigurationForm(configuration?: Record<string, any>) {
  const dnsConfig = createMapForm()
    .put(
      'syntheticType',
      createField({
        value: configuration?.syntheticType,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'lookup',
      createField({
        value: configuration?.lookup,
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
        value: configuration?.lookupServerName,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    )
    .put(
      'port',
      createField({
        value: configuration?.port,
        validator: composeAndShortCircuitOnError(notBlankValidator, numberValidator, checkForInvalidPort)
      })
    )
    .put(
      'queryTime',
      createField({
        value: configuration?.queryTime ?? {
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
        value: configuration?.queryType,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'transport',
      createField({
        value: configuration?.transport,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'recursiveLookups',
      createField({
        value: configuration?.recursiveLookups,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    )
    .put(
      'acceptCNAME',
      createField({
        value: configuration?.acceptCNAME,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    )
    .put(
      'server',
      createField({
        value: configuration?.server,
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
        value: configuration?.serverRetries,
        validator: composeAndShortCircuitOnError(notBlankValidator, numberValidator)
      })
    )
    .put(
      'targetValues',
      createField({
        value: configuration?.targetValues ?? []
      })
    )
    .put(
      'timeout',
      createField({
        value: configuration?.timeout,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'retries',
      createField({
        value: configuration?.retries,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(0))
      })
    )
    .put(
      'markSyntheticCall',
      createField({
        value: configuration?.markSyntheticCall,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator, notBlankValidator)
      })
    );
  if (configuration?.retryInterval) {
    return dnsConfig.put(
      'retryInterval',
      createField({
        value: configuration?.retryInterval,
        validator: composeAndShortCircuitOnError(numberValidator, minValidator(1))
      })
    );
  } else {
    return dnsConfig;
  }
}
