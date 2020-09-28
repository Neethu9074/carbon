import { createMapForm, createField, notBlankValidator } from 'formalistic';

import { finishedProgress, emptyArray } from 'in-services/fixedObjects';
import { generateUniqueShortId } from 'in-services/util/id';
import { hasError } from 'in-services/util/result';

export const staticBooleanType = 'staticBoolean';
export const staticNumberType = 'staticNumber';
export const staticStringType = 'staticString';
export const dynamicType = 'dynamic';
export const defaultType = staticStringType;

const exampleCustomPayload = {
  fields: [
    { type: staticStringType, key: 'testString', value: 'value1' },
    { type: staticBooleanType, key: 'testBool', value: true },
    { type: staticNumberType, key: 'testNumber', value: 42 }
    /*
    {
      type: dynamicType,
      key: 'dynamicK8sClusterName',
      value: { tagName: 'entity.kubernetes.cluster.label', key: null }
    },
    {
      key: 'myDynamicPayload',
      type: dynamicType,
      value: {
        tagName: 'entity.kubernetes.cluster.label',
        key: 'alertingGroup' // key-matching is always EQUALS
      }
    },
    {
      key: 'mySecondDynamicPayload',
      type: dynamicType,
      value: {
        tag: 'entity.kubernetes.cluster.name',
        key: null // only non-null for key-value pairs
      }
    }
    */
  ],
  lastUpdated: 1600683042893
};

export const enrichedWithUniqId = (item = {}) => {
  item.id = item.key + generateUniqueShortId();
  return item;
};

export const toServerItemModel = (item = {}) => {
  const { key, type, value } = item;
  return { key, type, value };
};

export const mockResult = {
  progress: finishedProgress,
  data: {
    fields: exampleCustomPayload.fields.map(enrichedWithUniqId)
  },
  errors: emptyArray
};

export function mergeResultWithPayloadForm(form, result) {
  if (hasError(result)) {
    return {
      ...result,
      errors: emptyArray,
      data: { items: [] }
    };
  }
  return {
    ...result,
    data: {
      ...result,
      items: form
    }
  };
}

export function createFormFieldForField(field) {
  return createMapForm()
    .put(
      'key',
      createField({
        validator: notBlankValidator,
        value: field.key ?? ''
      })
    )
    .put(
      'id',
      createField({
        value: field.id
      })
    )
    .put(
      'type',
      createField({
        value: field.type ?? defaultType
      })
    )
    .put(
      'value',
      createField({
        value: field.value ?? ''
      })
    );
}
