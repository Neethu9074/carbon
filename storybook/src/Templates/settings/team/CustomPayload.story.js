/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { action } from '@storybook/addon-actions';
import React from 'react';

import {
  staticStringType,
  staticBooleanType,
  staticNumberType,
  dynamicType,
  enrichedWithUniqId
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/form';
import { CustomPayload } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/CustomPayloadPage';
import { finishedProgress, emptyArray } from 'in-services/fixedObjects';
import SectionLine from 'in-settings/components/SectionLine';
import Code from 'in-components/Code';

const onChange = action('onChange');

export default {
  title: 'Organisms|CustomPayloadPage',
  component: CustomPayload
};

export function Pending() {
  return (
    <>
      <p>Visualizes how the form looks like when it is in the process of retrieving data from the server.</p>
      <CustomPayload
        result={{
          progress: {
            loading: true
          },
          errors: []
        }}
      />
    </>
  );
}

export function Failed_Data_Retrieval() {
  return (
    <>
      <p>The following table visualizes what a table looks like when data retrieval has failed.</p>
      <CustomPayload
        onChange={onChange}
        result={{
          progress: {
            loading: false
          },
          errors: [
            {
              message: 'Unexpected server error',
              code: 'SERVER'
            }
          ]
        }}
      />
    </>
  );
}

export function Empty() {
  return (
    <>
      <p>When no values are configured, then the table looks like this.</p>
      <CustomPayload
        onChange={onChange}
        result={{
          progress: {
            loading: false
          },
          errors: [],
          data: {
            items: []
          }
        }}
      />
    </>
  );
}

export function WithAllTypesOfData() {
  const exampleCustomPayload = {
    fields: [
      { type: staticStringType, key: 'testString', value: 'some value' },
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

  const mockResult = {
    progress: finishedProgress,
    data: {
      fields: exampleCustomPayload.fields.map(enrichedWithUniqId)
    },
    errors: emptyArray
  };
  const [payload, setPayload] = React.useState('');
  const successFulSave = payload => {
    setPayload(payload);
  };
  return (
    <>
      <p>With some data of different type.</p>
      <SectionLine />
      <CustomPayload onChange={onChange} result={mockResult} save={successFulSave} />

      <p>For debugging, this will be filled after successful saving:</p>
      <Code lang="json" code={JSON.stringify(payload, null, 4)} softWrap showLineNumbers />
    </>
  );
}
