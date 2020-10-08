import { createMapForm, createField, notBlankValidator } from 'formalistic';

import { finishedProgress, emptyArray } from 'in-services/fixedObjects';
import { generateUniqueShortId } from 'in-services/util/id';
import { hasError } from 'in-services/util/result';

export const staticBooleanType = 'staticBoolean';
export const staticNumberType = 'staticNumber';
export const staticStringType = 'staticString';
export const dynamicType = 'dynamic';
export const defaultType = staticStringType;

export const hardCodedDynamicValues = Object.freeze([
  { value: { tagName: 'kubernetes.cluster.label', key: null }, label: 'Kubernetes Cluster Labels' },
  { value: { tagName: 'kubernetes.pod.name', key: null }, label: 'Kubernetes Pod Name' },
  { value: { tagName: 'kubernetes.pod.label', key: 'app' }, label: 'Kubernetes Pod Label under "app"' }, //(this one exists on our demo cluster on k8s-test)
  { value: { tagName: 'kubernetes.node.name', key: null }, label: 'Kubernetes Node Name' },
  { value: { tagName: 'ec2.ipv4', key: null }, label: 'AWS EC2 host public IP' }
]);

const exampleCustomPayload = {
  fields: [
    { type: staticStringType, key: 'testString', value: 'value1' },
    { type: staticBooleanType, key: 'testBool', value: true },
    { type: staticNumberType, key: 'testNumber', value: 42 },
    {
      type: dynamicType,
      key: 'dynamicK8sClusterName',
      value: { tagName: 'kubernetes.cluster.label', key: null }
    },
    {
      key: 'myDynamicPayload',
      type: dynamicType,
      value: {
        tagName: 'kubernetes.pod.label',
        key: 'app' // key-matching is always EQUALS
      }
    },
    {
      key: 'mySecondDynamicPayload',
      type: dynamicType,
      value: {
        tag: 'kubernetes.cluster.name',
        key: null // only non-null for key-value pairs
      }
    }
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
