/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

import { TagCatalog, TagFilter } from '@instana/types';

import { AlertGrouping, getGroupingFE } from 'in-alerting/smart-alerts/infrastructure/details/AlertGrouping';
import { getQueryBuilder } from 'in-alerting/smart-alerts/infrastructure/components/AlertQueryBuilder';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';

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

  describe('getGroupingFE', () => {
    it('Test groupBy is empty', () => {
      // GIVEN
      const groupBy: string[] = [];
      const expectedResult: TagFilter[] = [];

      // WHEN
      const result = getGroupingFE(groupBy);

      // THEN
      expect(result).toEqual(expectedResult);
    });

    it('Test groupBy is not empty', () => {
      // GIVEN
      const groupBy = ['group1', 'group2'];
      const expectedResult = [
        {
          value: '',
          operator: '',
          name: 'group1',
          entity: NOT_APPLICABLE,
          type: 'TAG_FILTER'
        },
        {
          value: '',
          operator: '',
          name: 'group2',
          entity: NOT_APPLICABLE,
          type: 'TAG_FILTER'
        }
      ];

      // WHEN
      const result = getGroupingFE(groupBy);

      // THEN
      expect(result).toEqual(expectedResult);
    });
  });
});
