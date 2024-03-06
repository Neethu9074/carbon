/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

import { TagCatalog } from '@instana/types';

import { getQueryBuilder } from 'in-alerting/smart-alerts/infrastructure/components/AlertQueryBuilder';
import { AlertGrouping } from 'in-alerting/smart-alerts/aggregated/components/AlertGrouping';

describe('in-alerting/smart-alerts/infrastructure/details/AlertGrouping.tsx', () => {
  const tagCatalog = {
    tagTree: [
      {
        label: 'Others',
        children: [
          {
            label: 'label',
            description: 'Label/name of entity',
            tagName: 'label',
            type: 'TAG'
          }
        ],
        type: 'LEVEL',
        queryable: false
      }
    ],
    tags: [
      {
        name: 'label',
        type: 'STRING',
        label: 'label',
        description: '',
        idTag: false,
        canApplyToSource: false,
        canApplyToDestination: false
      }
    ],
    tagsByName: [],
    allTagNames: []
  } as TagCatalog;
  const AlertQueryBuilder = getQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;

  describe('AlertQueryBuilder', () => {
    it('Test that the component renders correctly when there are no groupBy options.', () => {
      // GIVEN
      const wrapper = shallow(<AlertGrouping AlertQueryBuilder={() => <></>} groupBy={[]} />);

      // THEN
      expect(wrapper.find(AlertQueryBuilder).exists()).toBeFalsy();
    });

    it('Test that the component renders correctly when there are groupBy options.', () => {
      // GIVEN
      const wrapper = shallow(<AlertGrouping AlertQueryBuilder={AlertQueryBuilder} groupBy={['label']} />);

      // THEN
      expect(wrapper.find(AlertQueryBuilder).exists()).toBeTruthy();
    });
  });
});
