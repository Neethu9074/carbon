/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ApiTeam } from 'in-settings/tabs/SecurityAndAccess/api/teams';

const MOCK_SCOPE = {
  applications: [
    {
      scopeId: 'Fwx93plkTtKv09MHqT5d6Q'
    },
    {
      scopeId: 'rkJOEJHXR9uWSKY_oFt7Ig'
    },
    {
      scopeId: 'DhhTCsgSS4aA--SFO5HqpA'
    }
  ],
  kubernetesClusters: [
    {
      scopeId: 'e415bd1f-7a0f-4baa-a6b0-1228b98fe73c'
    },
    {
      scopeId: '249b92f7-ecec-4eab-abe4-e9537cd9b9e8'
    },
    {
      scopeId: 'd511d046-e5e8-460b-bb1b-422ce38dc6ad'
    }
  ],
  kubernetesNamespaces: [
    {
      scopeId: '6b3ba044-150a-45b0-9e57-6b6fdab5f25f'
    },
    {
      scopeId: '391b00b3-7925-4654-9bdc-791e750c91f5'
    },
    {
      scopeId: 'd0847d07-7b81-4fb6-a423-77ed9d6a96d6'
    }
  ],
  websites: [
    {
      scopeId: 'Y8IMON9uTEqLhKIeGhkowA'
    },
    {
      scopeId: '9L45Pko4Q7OzmOWGf-tzyg'
    },
    {
      scopeId: 'TKFb18BISQq40rD2H5ST9A'
    },
    {
      scopeId: 'baIoR_snTpqRfLSvCwucLQ'
    },
    {
      scopeId: 'jzQmdfqQSnqnHs1sILiTyg'
    }
  ],
  mobileApps: [
    {
      scopeId: 'SXSWCo0qS3GbleY4Wua2oQ'
    },
    {
      scopeId: 'V8cRZXoDQ-emMRW62C2snQ'
    },
    {
      scopeId: 'AISNixBeRlCnpuNfTubeJQ'
    },
    {
      scopeId: 'g3HfCiimSe2TvKrB50OajA'
    },
    {
      scopeId: 't10QW9-rS8-jZjccW9Jc9Q'
    },
    {
      scopeId: 'IUGCkGKKQoqfBWCi8LTFag'
    },
    {
      scopeId: 'zNi_X_EUQfm4JlhopHpnww'
    }
  ],
  syntheticTests: [
    {
      scopeId: 'Ls3vKfNfrXEIeJhAWNFn'
    },
    {
      scopeId: 'M8WYjNaiGq5WBANce70V'
    },
    {
      scopeId: '89MFwY4SHKQHBZ9hZgyk'
    },
    {
      scopeId: 'ISl6EpkFP6KVEL9zPQ4T'
    }
  ],
  businessPerspectives: [
    {
      scopeId: 'iPrRlzpMRKWlO3ejg4579A'
    },
    {
      scopeId: '6KEyKNamRzCZ9BkGs4XBkg'
    },
    {
      scopeId: 'wgOcWfEwT6ehHGRQ7GzUMg'
    },
    {
      scopeId: '4pIor3oTQXqicnZZuJyEqg'
    },
    {
      scopeId: 'oiuE4I8CSAKyKq0osEt9Sw'
    },
    {
      scopeId: 'XYHED6AfQ12VMov6Q0DdTw'
    },
    {
      scopeId: 'rVxB3-WwQQ6zSeuP8IVi5Q'
    }
  ],
  syntheticCredentials: [
    {
      scopeId: 'agentDownload'
    },
    {
      scopeId: 'andreaUserName'
    },
    {
      scopeId: 'apiToken'
    }
  ],
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
      scopeId: 'entity.host.fqdn:"mytestclusteriq25n-mytestclusteriq25n1.fyre.ibm.com"',
      scopeRoleId: '-1'
    }
  ],
  actionFilters: [
    {
      scopeId: 'tags=Bry test&type=GITHUB',
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
