/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// eslint-disable-next-line no-restricted-imports
import { Trans as InternalTrans } from 'react-i18next';
import { just, combineLatest } from '@instana/observables';
import React from 'react';

import { replaceHtmlChars, sanitize } from 'in-services/formatters/html';
import { generateStableHash } from 'in-services/util/id';
import useObservable from 'in-hooks/useObservable';

export default function Trans({ values, ...props }) {
  const validatedAndConvertedValues = useObservable(() => validateAndConvertValues(values), [
    generateStableHash(values)
  ]);
  if (values && !validatedAndConvertedValues) {
    return null;
  }
  return <InternalTrans {...props} values={validatedAndConvertedValues} />;
}

Trans.propTypes = InternalTrans.propTypes;

function validateAndConvertValues(values) {
  if (!values) {
    return null;
  }

  const observables = Object.entries(values).map(([key, value]) => {
    if (typeof value === 'string' || value instanceof String) {
      if (!value._secure) {
        // react-i18next's Trans component has problems to securely handle end-user provided
        // values. We therefore enforce sanitization and escaping of these unless strings
        // are explicitly marked as secure.
        // See bug ticket: https://github.com/i18next/react-i18next/pull/1235
        return sanitize(value.toString()).map(sanitizedValue => [key, replaceHtmlChars(sanitizedValue)]);
      }

      // toString to convert from String object to the primitive type
      return just([key, value.toString()]);
    } else {
      return just([key, value]);
    }
  });

  return combineLatest(observables).map(Object.fromEntries);
}

// Are you really sure that the string CANNOT contain insecure content AND you
// want to render it without escaping? Then use markAsSecureString
// to skip escaping/sanitization.
//
// Warning: 99% of the time you will not want this!
export function markAsSecureString(s) {
  const secureString = new String(s);
  secureString._secure = true;
  return secureString;
}
