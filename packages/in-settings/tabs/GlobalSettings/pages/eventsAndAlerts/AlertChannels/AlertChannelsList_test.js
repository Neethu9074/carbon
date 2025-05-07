/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  createTeamsQueryFilter,
  handleTeamsFilter
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelsList';

describe('handleTeamsFilter', () => {
  it('general case', () => {
    const entityOne = {
      rbacTags: [
        { id: 1, displayName: 'Team A' },
        { id: 2, displayName: 'Team B' },
        { id: 3, displayName: 'team c' },
        { id: 4, displayName: 'Team D' }
      ]
    };
    const filters = ['team'];
    expect(handleTeamsFilter(entityOne, filters)).toEqual(true);

    const entityTwo = {
      rbacTags: [
        { id: 1, displayName: 'Team A' },
        { id: 2, displayName: 'Team B' },
        { id: 3, displayName: 'team c' },
        { id: 4, displayName: 'Team D' }
      ]
    };
    const filtersTwo = ['team a'];
    expect(handleTeamsFilter(entityTwo, filtersTwo)).toEqual(true);

    const entityThree = {
      rbacTags: [
        { id: 1, displayName: 'Team A' },
        { id: 2, displayName: 'Team B' },
        { id: 3, displayName: 'team c' },
        { id: 4, displayName: 'Team D' }
      ]
    };
    const filtersThree = ['team a', 'team c'];
    expect(handleTeamsFilter(entityThree, filtersThree)).toEqual(true);

    const entityFour = {
      rbacTags: [
        { id: 1, displayName: 'Team A' },
        { id: 2, displayName: 'Team BB' },
        { id: 3, displayName: 'team c' },
        { id: 4, displayName: 'Team DD' }
      ]
    };
    const filtersFour = ['team b!', 'team d'];
    expect(handleTeamsFilter(entityFour, filtersFour)).toEqual(false);

    const entityFive = {
      rbacTags: [
        { id: 1, displayName: 'Team A' },
        { id: 2, displayName: 'Team BB' },
        { id: 3, displayName: 'team c' },
        { id: 4, displayName: 'Team DD' }
      ]
    };
    const filtersFive = ['team bb!', 'team d!'];
    expect(handleTeamsFilter(entityFive, filtersFive)).toEqual(false);

    expect(handleTeamsFilter(entityFive, [])).toEqual(true);

    const entitySix = {
      rbacTags: [
        { id: 1, displayName: 'Team A' },
        { id: 2, displayName: 'Team BB' },
        { id: 3, displayName: 'team c' },
        { id: 4, displayName: 'Team DD' }
      ]
    };
    const filtersSix = ['team bb!', 'team dD!'];
    expect(handleTeamsFilter(entitySix, filtersSix)).toEqual(true);
  });
});

describe('createTeamsQueryFilter', () => {
  const entities = [
    {
      name: 'one',
      rbacTags: [
        { id: 1, displayName: 'Team A' },
        { id: 2, displayName: 'Team BBB' },
        { id: 3, displayName: 'team c' },
        { id: 4, displayName: 'Team D' }
      ]
    },
    {
      name: 'two',
      rbacTags: [
        { id: 1, displayName: 'Team E' },
        { id: 2, displayName: 'Team F' },
        { id: 3, displayName: 'team g' },
        { id: 4, displayName: 'Team h' }
      ]
    },
    {
      name: 'three',
      rbacTags: [{ id: 1, displayName: 'Team A' }]
    },
    {
      name: 'four',
      rbacTags: [{ id: 1, displayName: 'Team AA' }]
    }
  ];

  it('general case', () => {
    const resultOne = [
      {
        name: 'one',
        rbacTags: [
          { id: 1, displayName: 'Team A' },
          { id: 2, displayName: 'Team BBB' },
          { id: 3, displayName: 'team c' },
          { id: 4, displayName: 'Team D' }
        ]
      },
      {
        name: 'three',
        rbacTags: [{ id: 1, displayName: 'Team A' }]
      },
      {
        name: 'four',
        rbacTags: [{ id: 1, displayName: 'Team AA' }]
      }
    ];
    const resultTwo = [
      {
        name: 'one',
        rbacTags: [
          { id: 1, displayName: 'Team A' },
          { id: 2, displayName: 'Team BBB' },
          { id: 3, displayName: 'team c' },
          { id: 4, displayName: 'Team D' }
        ]
      },
      {
        name: 'three',
        rbacTags: [{ id: 1, displayName: 'Team A' }]
      }
    ];

    const resultThree = [
      {
        name: 'one',
        rbacTags: [
          { id: 1, displayName: 'Team A' },
          { id: 2, displayName: 'Team BBB' },
          { id: 3, displayName: 'team c' },
          { id: 4, displayName: 'Team D' }
        ]
      }
    ];

    expect(createTeamsQueryFilter(entities, ':teams:team a')).toEqual(resultOne);
    expect(createTeamsQueryFilter(entities, ':teams:team')).toEqual(entities);
    expect(createTeamsQueryFilter(entities, ':teams:team A')).toEqual(resultOne);
    expect(createTeamsQueryFilter(entities, ':teams:team A!')).toEqual(resultTwo);
    expect(createTeamsQueryFilter(entities, ':teams:team A!,team B')).toEqual(resultThree);
    expect(createTeamsQueryFilter(entities, ':teams:TEAM c!,team B')).toEqual(resultThree);
    expect(createTeamsQueryFilter(entities, ':teams:TEAM c!,team B,team c!')).toEqual(resultThree);
    expect(createTeamsQueryFilter(entities, ':teams:TEAM c!,team B, team c!')).toEqual([]);
    expect(createTeamsQueryFilter(entities, '')).toEqual(false);
    expect(createTeamsQueryFilter(entities, ':teams')).toEqual(false);
    expect(createTeamsQueryFilter(entities, ':teams:')).toEqual(entities);
  });
});
