/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ApiTeam } from 'in-settings/tabs/SecurityAndAccess/api/teams';

const MOCK_SCOPE = {
  applications: ['Fwx93plkTtKv09MHqT5d6Q', 'rkJOEJHXR9uWSKY_oFt7Ig', 'DhhTCsgSS4aA--SFO5HqpA'],
  kubernetesClusters: [
    'e415bd1f-7a0f-4baa-a6b0-1228b98fe73c',
    '249b92f7-ecec-4eab-abe4-e9537cd9b9e8',
    'd511d046-e5e8-460b-bb1b-422ce38dc6ad'
  ],
  kubernetesNamespaces: [
    '6b3ba044-150a-45b0-9e57-6b6fdab5f25f',
    '391b00b3-7925-4654-9bdc-791e750c91f5',
    'd0847d07-7b81-4fb6-a423-77ed9d6a96d6'
  ],
  websites: [
    'Y8IMON9uTEqLhKIeGhkowA',
    '9L45Pko4Q7OzmOWGf-tzyg',
    'TKFb18BISQq40rD2H5ST9A',
    'baIoR_snTpqRfLSvCwucLQ',
    'jzQmdfqQSnqnHs1sILiTyg'
  ],
  mobileApps: [
    'SXSWCo0qS3GbleY4Wua2oQ',
    'V8cRZXoDQ-emMRW62C2snQ',
    'AISNixBeRlCnpuNfTubeJQ',
    'g3HfCiimSe2TvKrB50OajA',
    't10QW9-rS8-jZjccW9Jc9Q',
    'IUGCkGKKQoqfBWCi8LTFag',
    'zNi_X_EUQfm4JlhopHpnww'
  ],
  syntheticTests: ['Ls3vKfNfrXEIeJhAWNFn', 'M8WYjNaiGq5WBANce70V', '89MFwY4SHKQHBZ9hZgyk', 'ISl6EpkFP6KVEL9zPQ4T'],
  businessPerspectives: [
    'iPrRlzpMRKWlO3ejg4579A',
    '6KEyKNamRzCZ9BkGs4XBkg',
    'wgOcWfEwT6ehHGRQ7GzUMg',
    '4pIor3oTQXqicnZZuJyEqg',
    'oiuE4I8CSAKyKq0osEt9Sw',
    'XYHED6AfQ12VMov6Q0DdTw',
    'rVxB3-WwQQ6zSeuP8IVi5Q'
  ],
  syntheticCredentials: ['agentDownload', 'andreaUserName', 'apiToken'],
  restrictedApplicationFilter: {
    restrictingApplicationId: null,
    label: 'Andreas Test group2',
    tagFilterExpression: {
      type: 'TAG_FILTER',
      name: 'service.name',
      stringValue: 'acceptor',
      numberValue: null,
      booleanValue: null,
      key: null,
      value: 'acceptor',
      operator: 'EQUALS',
      entity: 'DESTINATION'
    },
    scope: 'INCLUDE_NO_DOWNSTREAM'
  },
  logFilters: null,
  infraDfqFilters: [
    {
      id: 'entity.host.fqdn:"mytestclusteriq25n-mytestclusteriq25n1.fyre.ibm.com"',
      scopeRoleId: '-1'
    }
  ],
  actionFilters: [
    {
      id: 'tags=Bry test&type=GITHUB',
      scopeRoleId: '-1'
    }
  ]
};

const MOCK_TEAMTAG_USAGE = {
  alertChannels: 2,
  customDashboards: 100
};

export const MOCK_TEAM: ApiTeam = {
  id: 'Oxzg-a28TUGWLZ7Z2AwkgA',
  tag: 'andreas test',
  info: {
    description: 'my description and some more description'
  },
  //@ts-expect-error data type not yet final
  scope: MOCK_SCOPE,
  teamTagUsed: MOCK_TEAMTAG_USAGE,
  members: [
    {
      userId: '63eb0ff0b35b6c0001dfc7e5',
      roleIds: [
        {
          roleId: 'zw9g5lcPQFaHRBJazX_bzg',
          viaIdP: false
        },
        {
          roleId: 'UxrteCbGQQOKDFuHuG5Ycg',
          viaIdP: false
        }
      ]
    },
    {
      userId: '661fbdbd3aae6d00013c4d27',
      roleIds: [
        {
          roleId: 'zw9g5lcPQFaHRBJazX_bzg',
          viaIdP: false
        },
        {
          roleId: 'UxrteCbGQQOKDFuHuG5Ycg',
          viaIdP: false
        }
      ]
    },
    {
      userId: '64ba3caf5cad590001fe4ae0',
      roleIds: [
        {
          roleId: '-1',
          viaIdP: false
        }
      ]
    },
    {
      userId: '654331b6898b000001e2ec68',
      roleIds: [
        {
          roleId: 'zw9g5lcPQFaHRBJazX_bzg',
          viaIdP: false
        },
        {
          roleId: 'bV92wVUQSB6nXFDYofliBg',
          viaIdP: false
        },
        {
          roleId: 'UxrteCbGQQOKDFuHuG5Ycg',
          viaIdP: false
        }
      ]
    }
  ]
};
