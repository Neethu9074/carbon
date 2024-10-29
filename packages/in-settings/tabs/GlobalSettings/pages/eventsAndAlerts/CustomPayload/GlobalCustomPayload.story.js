/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { createTagBasedPayloadConfigurator } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import GlobalCustomPayloadPage, {
  GlobalCustomPayload
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/GlobalCustomPayloadPage';
import {
  staticType,
  dynamicType,
  enrichedWithUniqId
} from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import { error, success, successObservable, successObservableFactory } from 'in-services/util/result';
import { someCommonTags } from 'in-alerting/smart-alerts/components/details/someCommonTagsTagCatalog';
import { pendingResult } from 'in-services/fixedObjects';
import Code from 'in-components/Code';

export default {
  component: GlobalCustomPayloadPage,
  argTypes: { save: { action: 'save' } }
};

export const Pending = {
  args: {
    result: pendingResult
  }
};

export const Failed_Data_Retrieval = {
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
  args: {
    result: success({
      items: []
    })
  }
};

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
      key: 'long_tag_name',
      type: dynamicType,
      value: {
        tagName: 'openshift.deploymentconfig.label',
        key: 'Very long name usually not fit well.'
      }
    },
    {
      key: 'myDynamicPayload',
      type: dynamicType,
      value: {
        tagName: 'kubernetes.pod.label',
        key: 'applicationSprintMainClass'
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

const GlobalTagBasedPayloadConfigurator = createTagBasedPayloadConfigurator({
  getTagCatalog: () => successObservable(someCommonTags),
  getSuggestions: successObservableFactory({
    suggestions: ['a', 'b', 'c', 'aa', 'bb', 'cc', 'aa'],
    results: [],
    totalHits: 20
  })
});

export function WithAllTypesOfData(args) {
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
      <GlobalCustomPayload
        {...args}
        result={mockResult}
        save={successFulSave}
        TagBasedPayloadConfigurator={GlobalTagBasedPayloadConfigurator}
      />

      <p>For debugging purpose, this will be filled after saving:</p>
      <Code lang="json" code={JSON.stringify(payload, null, 4)} softWrap showLineNumbers />
    </>
  );
}

export function WithAllTypesOfDataReadOnly(args) {
  const mockResult = success({
    fields: exampleCustomPayload.fields.map(enrichedWithUniqId)
  });

  return (
    <GlobalCustomPayload
      {...args}
      result={mockResult}
      TagBasedPayloadConfigurator={GlobalTagBasedPayloadConfigurator}
      canConfigureGlobalAlertPayload={false}
    />
  );
}
