/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TagFilter } from '@instana/types';

import { toUIGrouping } from 'in-alerting/smart-alerts/aggregated/utils/groupfilterExpression';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';

describe('in-alerting/smart-alerts/aggregated/utils/groupfilterExpression.ts', () => {
  describe('toUIGrouping', () => {
    it('Test groupBy is empty', () => {
      // GIVEN
      const groupBy: string[] = [];
      const expectedResult: TagFilter[] = [];

      // WHEN
      const result = toUIGrouping(groupBy);

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
      const result = toUIGrouping(groupBy);

      // THEN
      expect(result).toEqual(expectedResult);
    });
  });
});
