/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createMapForm, createField, createListForm, notBlankValidator, composeValidators } from 'formalistic';
import { compose, withProps, withState } from 'recompose';

import FileDownloadConfigurationDialogPresenter from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileDownloadConfigurationDialogPresenter';
import { addSourceMapConfiguration, updateSourceMapConfiguration } from 'in-websites/api/websites';
import { isBlank, isNotBlank } from 'in-services/util/string';
import { close } from 'in-components/DialogPresenter/store';

export default compose(
  withState('form', 'setForm', ({ config }) => createForm(config)),
  withState('message', 'setMessage', null),
  withProps(({ form, setForm, setMessage, websiteId, onFinished }) => ({
    onChange(path, value) {
      setForm(form.updateIn(path, field => field.setValue(value).setTouched(true)));
    },
    addMatchingRule() {
      setForm(form.updateIn(['matchingRules'], list => list.setTouched(true).push(createMatchingRuleForm())));
    },
    removeMatchingRule(index) {
      setForm(form.updateIn(['matchingRules'], list => list.setTouched(true).remove(index)));
    },
    addHeader() {
      setForm(form.updateIn(['headers'], list => list.setTouched(true).push(createHeaderForm())));
    },
    removeHeader(index) {
      setForm(form.updateIn(['headers'], list => list.setTouched(true).remove(index)));
    },
    onSubmit(e) {
      e.preventDefault();

      if (!form.hierarchyValid) {
        setForm(form.setTouched(true, { recurse: true }));
        return;
      }

      const config = form.toJS();
      // convert to expected backend structure
      config.headers = config.headers.reduce((headers, header) => {
        headers[header.key] = header.value;
        return headers;
      }, {});

      config.matchingRules.forEach(rule => {
        const host = deserializePattern(rule.host);
        const path = deserializePattern(rule.path);
        rule.hostPrefix = host.prefix;
        rule.hostEquality = host.equality;
        rule.hostSuffix = host.suffix;
        rule.pathPrefix = path.prefix;
        rule.pathEquality = path.equality;
        rule.pathSuffix = path.suffix;
      });

      let response$;
      let successMessage;
      setMessage({ message: 'Saving configuration…', type: 'success', isSaving: true });
      if (config.id) {
        response$ = updateSourceMapConfiguration(websiteId, config);
        successMessage = 'Configuration updated.';
      } else {
        response$ = addSourceMapConfiguration(websiteId, config);
        successMessage = 'New configuration saved.';
      }

      response$.once(
        () => {
          onFinished({ message: successMessage, type: 'success' });
          close();
        },
        error => {
          setMessage({ message: `Failed to save configuration: ${error.message}`, type: 'error' });
        }
      );
    }
  }))
)(FileDownloadConfigurationDialogPresenter);

export function createForm(config) {
  let matchingRules = createListForm({
    validator: isAtLeastOneMatchingRuleDefinedValidator
  });
  if (config) {
    config.matchingRules.forEach(rule => {
      matchingRules = matchingRules.push(createMatchingRuleForm(rule));
    });
  }

  if (matchingRules.size < 1) {
    // Have at least one empty matching rule so that the form doesn't look broken.
    matchingRules = matchingRules.push(createMatchingRuleForm());
  }

  let headers = createListForm();
  if (config) {
    Object.keys(config.headers).forEach(key => {
      headers = headers.push(createHeaderForm(key, config.headers[key]));
    });
  }

  return createMapForm()
    .put(
      'id',
      createField({
        value: config ? config.id : null
      })
    )
    .put(
      'basicAuthUserName',
      createField({
        value: config ? config.basicAuthUserName : ''
      })
    )
    .put(
      'basicAuthPassword',
      createField({
        value: config ? config.basicAuthPassword : ''
      })
    )
    .put('matchingRules', matchingRules)
    .put('headers', headers);
}

function createMatchingRuleForm(rule = null) {
  return createMapForm({
    items: {
      allowTransmissionViaInsecureChannel: createField({
        value: rule ? Boolean(rule.allowTransmissionViaInsecureChannel) : false
      }),
      host: createField({
        value: rule ? serializePattern(rule.hostPrefix, rule.hostEquality, rule.hostSuffix) : '',
        validator: composeValidators(notBlankValidator, atMostOneWildcardValidator)
      }),
      path: createField({
        value: rule ? serializePathPattern(rule.pathPrefix, rule.pathEquality, rule.pathSuffix) : '/*',
        validator: composeValidators(notBlankValidator, pathValidator, atMostOneWildcardValidator)
      })
    }
  });
}

function serializePattern(prefix, equality, suffix) {
  if (isNotBlank(equality)) {
    return equality;
  }

  let value = '';
  if (isNotBlank(prefix)) {
    value = `${value}${prefix}*`;
  }

  if (isNotBlank(suffix)) {
    if (isBlank(value)) {
      value = `*${suffix}`;
    } else {
      value = `${value}${suffix}`;
    }
  }

  return value;
}

function serializePathPattern(prefix, equality, suffix) {
  if (isNotBlank(equality)) {
    return equality;
  }

  let value = '';
  if (isNotBlank(prefix)) {
    value = `${value}${prefix.startsWith('/') ? '' : '/'}${prefix}*`;
  }

  if (isNotBlank(suffix)) {
    if (isBlank(value)) {
      value = `*${suffix}`;
    } else {
      value = `${value}${suffix}`;
    }
  }

  if (isBlank(value)) {
    value = '/*';
  }

  return value;
}

function createHeaderForm(key, value) {
  return createMapForm()
    .put(
      'key',
      createField({
        value: key || '',
        validator: notBlankValidator
      })
    )
    .put(
      'value',
      createField({
        value: value || '',
        validator: notBlankValidator
      })
    );
}

function isAtLeastOneMatchingRuleDefinedValidator(items) {
  if (items.length > 0) {
    return null;
  }
  return [
    {
      severity: 'error',
      message: 'At least one matching rule is required.'
    }
  ];
}

function atMostOneWildcardValidator(value) {
  if (isBlank(value)) {
    // validate via the not blank validator
    return null;
  }

  let numberOfWildcards = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === '*') {
      numberOfWildcards++;
    }
  }

  if (numberOfWildcards > 1) {
    return [
      {
        severity: 'error',
        message: 'The segment match condition can only contain at most one wildcard character.'
      }
    ];
  }

  return null;
}

function pathValidator(value) {
  if (isBlank(value)) {
    // validate via the not blank validator
    return null;
  }

  if (value === '*' || value[0] === '/') {
    return null;
  }

  return [
    {
      severity: 'error',
      message: 'Path matching rules must start with a slash character: /'
    }
  ];
}

function deserializePattern(pattern) {
  if (isBlank(pattern)) {
    return {
      prefix: '',
      equality: '',
      suffix: ''
    };
  }

  const index = pattern.indexOf('*');
  if (index === -1) {
    return {
      prefix: '',
      equality: pattern,
      suffix: ''
    };
  }

  return {
    prefix: pattern.substring(0, index),
    equality: '',
    suffix: pattern.substring(index + 1)
  };
}
