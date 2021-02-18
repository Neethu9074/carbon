/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export const getApplicationResult = {
  data: {
    id: 'btg-B701Rx6o9QNXUS4TVw',
    label: 'All Services',
    boundaryScope: 'INBOUND',
    entityType: 'APPLICATION'
  },
  progress: {
    percentage: null,
    loading: false,
    note: null
  }
};

export const getApplicationsResult = {
  data: {
    items: [
      {
        application: {
          id: 'btg-B701Rx6o9QNXUS4TVw',
          label: 'All Services',
          boundaryScope: 'INBOUND',
          entityType: 'APPLICATION'
        },
        metrics: {}
      },
      {
        application: {
          id: '4i2Oy5MuSLi0g2PPSgk9kg',
          label: 'Stepans AP',
          boundaryScope: 'INBOUND',
          entityType: 'APPLICATION'
        },
        metrics: {}
      },
      {
        application: {
          id: 'gCT5YKIQRhmj20Y5lZP58Q',
          label: 'delete me soon ceh',
          boundaryScope: 'ALL',
          entityType: 'APPLICATION'
        },
        metrics: {}
      },
      {
        application: {
          id: 'fTiSRhKaTKO2hLIy2V1Ylg',
          label: 'delete me soon 2 ceh',
          boundaryScope: 'ALL',
          entityType: 'APPLICATION'
        },
        metrics: {}
      },
      {
        application: {
          id: '3q8uyCA5QyyDl5jby4dd0w',
          label: 'test-acceptor',
          boundaryScope: 'ALL',
          entityType: 'APPLICATION'
        },
        metrics: {}
      },
      {
        application: {
          id: '1qvXgVfLTNqi8gGTcCaNUw',
          label: ' FabianS',
          boundaryScope: 'INBOUND',
          entityType: 'APPLICATION'
        },
        metrics: {}
      },
      {
        application: {
          id: 'PLEb723nS_Cp2vWxH9Cyng',
          label: 'FabianS',
          boundaryScope: 'ALL',
          entityType: 'APPLICATION'
        },
        metrics: {}
      }
    ],
    page: 1,
    pageSize: 7,
    totalHits: 45
  },
  time: 1607598136870,
  adjustedWindowSize: null,
  errors: [],
  progress: {
    percentage: null,
    loading: false,
    note: null
  }
};

export const getServicesResult = {
  data: {
    items: [
      {
        service: {
          id: '6097d596c3d9024034b3d03b2b5c43acea65e5a4',
          label: 'acceptor',
          types: ['HTTP', 'SDK'],
          technologies: ['dropwizardApplicationContainer'],
          entityType: 'SERVICE'
        },
        metrics: {}
      },
      {
        service: {
          id: '7bad5981bde769adba9a1894eb16db3c628c1846',
          label: 'eum-acceptor',
          types: ['HTTP', 'SDK'],
          technologies: ['dropwizardApplicationContainer'],
          entityType: 'SERVICE'
        },
        metrics: {}
      },
      {
        service: {
          id: 'a0e72c3e79acfd75b41cbf57bf0e58816aeaa4e0',
          label: 'serverless-acceptor',
          types: ['HTTP', 'SDK'],
          technologies: ['dropwizardApplicationContainer', 'nodeJsRuntimePlatform'],
          entityType: 'SERVICE'
        },
        metrics: {}
      },
      {
        service: {
          id: '5131abcd21ea6e99111d71795fd9ad592bbc08a0',
          label: 'groundskeeper',
          types: ['HTTP', 'SDK'],
          technologies: ['dropwizardApplicationContainer', 'nginx'],
          entityType: 'SERVICE'
        },
        metrics: {}
      },
      {
        service: {
          id: '28766c5dd1af6d77217bac54024b3abb3195db07',
          label: 'eum-frontend',
          types: ['HTTP'],
          technologies: ['nodeJsRuntimePlatform'],
          entityType: 'SERVICE'
        },
        metrics: {}
      },
      {
        service: {
          id: '01292b3f4d27028ec9d0cdd5f06cc0c485de8d6f',
          label: 'appdata-reader',
          types: ['RPC', 'SDK', 'BATCH'],
          technologies: ['dropwizardApplicationContainer'],
          entityType: 'SERVICE'
        },
        metrics: {}
      },
      {
        service: {
          id: '1db3ddeaf9372d41d72fd9f2e6ef2744937a9b37',
          label: 'catalogue-demo',
          types: ['HTTP'],
          technologies: ['springbootApplicationContainer'],
          entityType: 'SERVICE'
        },
        metrics: {}
      }
    ],
    page: 1,
    pageSize: 7,
    totalHits: 137
  },
  time: 1607606463167,
  adjustedWindowSize: null,
  errors: [],
  progress: {
    percentage: null,
    loading: false,
    note: null
  }
};

export const getEndpointsResult = {
  data: {
    items: [
      {
        endpoint: {
          id: 'TtX0eOe2uxE53M5PfL0VzsxhDKQ',
          label: 'POST /metrics',
          type: 'HTTP',
          serviceId: '6097d596c3d9024034b3d03b2b5c43acea65e5a4',
          technologies: ['dropwizardApplicationContainer', 'kubernetesService'],
          syntheticType: 'NON_SYNTHETIC',
          synthetic: false,
          entityType: 'ENDPOINT'
        },
        metrics: {}
      },
      {
        endpoint: {
          id: '3kUbLmFHBLYLrkasPXeuZWR8zDE',
          label: 'POST /traces',
          type: 'HTTP',
          serviceId: '6097d596c3d9024034b3d03b2b5c43acea65e5a4',
          technologies: ['dropwizardApplicationContainer', 'kubernetesService'],
          syntheticType: 'NON_SYNTHETIC',
          synthetic: false,
          entityType: 'ENDPOINT'
        },
        metrics: {}
      },
      {
        endpoint: {
          id: 'oETFj2WyPusvXgRW_181J3fH_t8',
          label: 'POST /response',
          type: 'HTTP',
          serviceId: '6097d596c3d9024034b3d03b2b5c43acea65e5a4',
          technologies: ['dropwizardApplicationContainer', 'kubernetesService'],
          syntheticType: 'NON_SYNTHETIC',
          synthetic: false,
          entityType: 'ENDPOINT'
        },
        metrics: {}
      },
      {
        endpoint: {
          id: 's0lA8NBwuZyyWKAqdAxur49pMmo',
          label: 'POST /profiles',
          type: 'HTTP',
          serviceId: '6097d596c3d9024034b3d03b2b5c43acea65e5a4',
          technologies: ['dropwizardApplicationContainer', 'kubernetesService'],
          syntheticType: 'NON_SYNTHETIC',
          synthetic: false,
          entityType: 'ENDPOINT'
        },
        metrics: {}
      },
      {
        endpoint: {
          id: 'sbZCMbapXF3_eExPoyQvae7RH3g',
          label: 'POST /events/v1',
          type: 'HTTP',
          serviceId: '6097d596c3d9024034b3d03b2b5c43acea65e5a4',
          technologies: ['dropwizardApplicationContainer', 'kubernetesService'],
          syntheticType: 'NON_SYNTHETIC',
          synthetic: false,
          entityType: 'ENDPOINT'
        },
        metrics: {}
      },
      {
        endpoint: {
          id: 'SXFAVbwE7iWzT9eI9bRfNzdylnk',
          label: 'sdk.unused-parent-span-for-logging',
          type: 'SDK',
          serviceId: '6097d596c3d9024034b3d03b2b5c43acea65e5a4',
          technologies: ['dropwizardApplicationContainer', 'kubernetesService'],
          syntheticType: 'NON_SYNTHETIC',
          synthetic: false,
          entityType: 'ENDPOINT'
        },
        metrics: {}
      },
      {
        endpoint: {
          id: 'a48kZ6J7Yz8uX59r-drA__ILTQQ',
          label: 'POST /events',
          type: 'HTTP',
          serviceId: '6097d596c3d9024034b3d03b2b5c43acea65e5a4',
          technologies: ['jvmRuntimePlatform', 'kubernetesService'],
          syntheticType: 'NON_SYNTHETIC',
          synthetic: false,
          entityType: 'ENDPOINT'
        },
        metrics: {}
      }
    ],
    page: 1,
    pageSize: 7,
    totalHits: 7
  },
  time: 1607606717829,
  adjustedWindowSize: null,
  errors: [],
  progress: {
    percentage: null,
    loading: false,
    note: null
  }
};

export const storedApplicationsSelection = {
  'abc-123': {
    id: 'abc-123',
    inclusive: true,
    // label: 'All Services',
    services: {
      'def-456': {
        id: 'def-456',
        inclusive: true,
        // label: 'serverless-acceptor',
        endpoints: {
          'ghi-789': {
            id: 'ghi-789',
            inclusive: true
            // label: 'serverless-acceptor',
          },
          'jkl-101112': {
            id: 'jkl-101112',
            inclusive: true
            // label: 'serverless-acceptor',
          }
        }
      }
    }
  }
};
