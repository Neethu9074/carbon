/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { CustomPayloadFieldUnion } from '@instana/types';

// @ts-expect-error this is not yet converted to TS
import { createTagBasedPayloadConfigurator } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
// @ts-expect-error this is not yet converted to TS
import CustomPayloadCard from 'in-alerting/smart-alerts/components/details/CustomPayloadCard';
import someCommonTags from 'in-alerting/smart-alerts/components/details/SomeCommonTagsTagCatalog.json';
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
