/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GlobalCustomPayloadPage, {
  CustomPayload
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/GlobalCustomPayloadPage';
import {
  staticType,
  dynamicType,
  enrichedWithUniqId
} from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import { pendingResult } from 'in-services/fixedObjects';
import { error, success } from 'in-services/util/result';
import Code from 'in-components/Code';

export default {
  component: GlobalCustomPayloadPage
};

export const Pending = {
  argTypes: { save: { action: 'save' } },
  args: {
    result: pendingResult
  }
};

export const Failed_Data_Retrieval = {
  argTypes: { save: { action: 'save' } },
  args: {
    result: error([
      {
        message: 'Unexpected server error',
        code: 'SERVER'
      }
    ])
  }
};

export const Empty = {
  argTypes: { save: { action: 'save' } },
  args: {
    result: success({
      items: []
    })
  }
};

export function WithAllTypesOfData(args) {
  const exampleCustomPayload = {
    fields: [
      { type: staticType, key: 'testString', value: 'some value' },
      { type: staticType, key: 'testBool', value: 'true' },
      { type: staticType, key: 'testNumber', value: '42' },
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

  const mockResult = success({
    fields: exampleCustomPayload.fields.map(enrichedWithUniqId)
  });
  const [payload, setPayload] = React.useState('');

  const successFulSave = payload => {
    setPayload(payload);
    args.save(payload);
  };

  return (
    <>
      <CustomPayload {...args} result={mockResult} save={successFulSave} />

      <p>For debugging purpose, this will be filled after saving:</p>
      <Code lang="json" code={JSON.stringify(payload, null, 4)} softWrap showLineNumbers />
    </>
  );
}
WithAllTypesOfData.argTypes = { save: { action: 'save' } };
