/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { CustomPayloadFieldUnion } from '@instana/types';

import { createTagBasedPayloadConfigurator } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import { someCommonTags } from 'in-alerting/smart-alerts/components/details/someCommonTagsTagCatalog';
import CustomPayloadCard from 'in-alerting/smart-alerts/components/details/CustomPayloadCard';
import { successObservable } from 'in-services/util/result';

export default {
  component: CustomPayloadCard
};

export const Empty = {};

const customPayloadFields: CustomPayloadFieldUnion[] = [
  {
    key: 'simple',
    type: 'staticString',
    value: 'some random value'
  },
  {
    key: 'dynamicPayload',
    type: 'dynamic',
    value: {
      tagName: 'beacon.page.name',
      key: '/index'
    }
  }
];

export const AllTypes = {
  args: {
    customPayloadFields,
    TagBasedPayloadConfigurator: createTagBasedPayloadConfigurator({
      getTagCatalog: () => successObservable(someCommonTags)
    })
  }
};
