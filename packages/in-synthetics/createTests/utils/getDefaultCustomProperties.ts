/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';

import { generateUniqueShortId } from '@instana/utils';

import { ConfigItem } from 'in-synthetics/utils/constants';

const getDefaultCustomProperties = (form: MapForm<any>): ConfigItem[] => {
  const customProperties = (form.get('customProperties') as Field<Record<string, string>>).value;
  const customPropertyKeys = Object.keys(customProperties);
  if (customPropertyKeys.length) {
    const customPropertiesObject: ConfigItem[] = [];
    customPropertyKeys.forEach(key =>
      customPropertiesObject.push({
        id: generateUniqueShortId(),
        key: key,
        value: customProperties[key],
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      })
    );
    return customPropertiesObject;
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

export default getDefaultCustomProperties;
