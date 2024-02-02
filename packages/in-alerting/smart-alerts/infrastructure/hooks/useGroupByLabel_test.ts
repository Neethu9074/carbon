/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import { TagCatalog } from '@instana/types';

//@ts-expect-error
import { getGroupByTagCatalog } from 'in-alerting/smart-alerts/infrastructure/data/alertConfigUtils';
import { useGroupByCatalog } from 'in-alerting/smart-alerts/infrastructure/hooks/useGroupByLabel';

describe('in-alerting/smart-alerts/infrastructure/hooks/useGroupByLabel', () => {
  it('test if the groupBy labels are generated from the tagCatalog', () => {
    // GIVEN
    const tagCatalog: TagCatalog = {
      tagTree: [
        {
          label: 'AWS',
          description: undefined,
          children: [
            {
              label: 'accountId',
              description: 'Amazon Account ID',
              tagName: 'aws.accountId',
              type: 'TAG'
            }
          ],
          type: 'LEVEL',
          queryable: false
        },
        {
          label: 'Dynamic Focus',
          description: undefined,
          children: [
            {
              label: 'selftype',
              description: 'Type of the entity',
              tagName: 'dfq.selftype',
              type: 'TAG'
            }
          ],
          type: 'LEVEL',
          queryable: false
        }
      ],
      tags: [
        {
          name: 'ec2.publicName',
          type: 'STRING',
          label: 'ec2.publicName',
          description: '',
          idTag: false,
          canApplyToSource: false,
          canApplyToDestination: false
        },
        {
          name: 'host.os.name',
          type: 'STRING',
          label: 'host.os.name',
          description: '',
          idTag: false,
          canApplyToSource: false,
          canApplyToDestination: false
        }
      ]
    };

    // WHEN
    const { result } = renderHook(() => useGroupByCatalog(tagCatalog));

    // THEN
    expect(result.current).toStrictEqual(getGroupByTagCatalog(tagCatalog));
  });

  it('test case when tagCatalog is empty', () => {
    // GIVEN
    const tagCatalog = undefined;

    // WHEN
    //@ts-expect-error
    const { result } = renderHook(() => useGroupByCatalog(tagCatalog));

    // THEN

    expect(result.current).toStrictEqual(getGroupByTagCatalog(tagCatalog));
  });
});
