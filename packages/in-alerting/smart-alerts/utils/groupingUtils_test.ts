/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TagCatalog } from '@instana/types';

import { moveOthersChildrenOnTop } from 'in-alerting/smart-alerts/utils/groupingUtils';

describe('moveOthersChildrenOnTop', () => {
  it('should move the "Others" category to the top of the tag tree', () => {
    // GIVEN
    const tagCat: TagCatalog = {
      tags: [],
      tagTree: [
        {
          label: 'AWS',
          children: [
            {
              label: 'accountId',
              description: 'Amazon Account ID',
              icon: 'lib_views_tag',
              tagName: 'aws.accountId',
              type: 'TAG'
            }
          ],
          type: 'LEVEL',
          queryable: false
        },
        {
          label: 'Others',
          children: [
            {
              label: 'label',
              description: 'Label/name of entity',
              icon: 'lib_views_tag',
              tagName: 'label',
              type: 'TAG'
            }
          ],
          type: 'LEVEL',
          queryable: false
        }
      ]
    };
    const expectedResult = {
      tags: [],
      tagTree: [
        {
          label: 'label',
          description: 'Label/name of entity',
          icon: 'lib_views_tag',
          tagName: 'label',
          type: 'TAG'
        },
        {
          label: 'AWS',
          children: [
            {
              label: 'accountId',
              description: 'Amazon Account ID',
              icon: 'lib_views_tag',
              tagName: 'aws.accountId',
              type: 'TAG'
            }
          ],
          type: 'LEVEL',
          queryable: false
        }
      ]
    };

    // THEN
    expect(moveOthersChildrenOnTop(tagCat)).toEqual(expectedResult);
  });
});
