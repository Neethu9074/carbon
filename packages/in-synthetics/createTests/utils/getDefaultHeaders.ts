/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';

import { generateUniqueShortId } from '@instana/utils';

import { ConfigItem } from 'in-synthetics/utils/constants';

const getDefaultHeaders = (form: MapForm<any>) => {
  const headers = form.get('configuration')?.get('headers')
    ? (form.get('configuration')?.get('headers') as Field<Record<string, string>>)?.value
    : {};
  const headersKeys = Object.keys(headers);
  if (headersKeys.length) {
    const headersObject: ConfigItem[] = [];
    headersKeys.forEach(key =>
      headersObject.push({
        id: generateUniqueShortId(),
        key: key,
        value: headers[key],
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      })
    );
    return headersObject;
  } else {
    return [
      {
        id: generateUniqueShortId(),
        key: '',
        value: '',
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      }
    ];
  }
};

export default getDefaultHeaders;
