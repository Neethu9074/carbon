/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env mocha */

import { expect } from 'chai';

import {
  getEndpointIds,
  getServiceIds,
  isAnalyticsWithHiddenTagsLocation,
  transformHiddenTags
} from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeHiddenTagsViewParameterConversion/transformHelper';
import { cloneLocation } from 'in-stores/navigation/routing/clone';

const casesWithHiddenTags = [
  {
    name: 'service.id',
    // test data
    before: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          dataSource: 'calls',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~service.id~operator~EQUALS~value~ce4b152bac7b99744d8314838e49b799afd6dd96~entity~DESTINATION)(type~CONJUNCTION~logicalOperator~AND)(type~TAG*_FILTER~name~call.erroneous~operator~EQUALS~value)(logicalOperator~AND~type~CONJUNCTION)(type~TAG*_FILTER~name~technology~operator~EQUALS~value~nginx~entity~DESTINATION)~'
        }
      }
    },
    serviceResults: [{ data: { id: 'ce4b152bac7b99744d8314838e49b799afd6dd96', label: 'nginx-web', types: ['HTTP'] } }],
    endpointResults: [],
    // validation data
    after: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          dataSource: 'calls',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~service.name~operator~EQUALS~value~nginx-web~entity~DESTINATION)(type~CONJUNCTION~logicalOperator~AND)(type~TAG*_FILTER~name~call.type~operator~EQUALS~value~HTTP)(type~CONJUNCTION~logicalOperator~AND)(type~TAG*_FILTER~name~call.erroneous~operator~EQUALS~value)(logicalOperator~AND~type~CONJUNCTION)(type~TAG*_FILTER~name~technology~operator~EQUALS~value~nginx~entity~DESTINATION)~'
        }
      }
    },
    parsedServiceIds: ['ce4b152bac7b99744d8314838e49b799afd6dd96'],
    parsedEndpointIds: []
  },
  {
    name: 'service.id and endpoint.id',
    // test data
    before: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          dataSource: 'calls',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~endpoint.id~operator~EQUALS~value~sMU46hsqUgQtvIuQ2q1vbMUD95c~entity~DESTINATION)(type~CONJUNCTION~logicalOperator~OR)(type~TAG*_FILTER~name~service.id~operator~EQUALS~value~ce4b152bac7b99744d8314838e49b799afd6dd96~entity~DESTINATION)(type~CONJUNCTION~logicalOperator~OR)(type~TAG*_FILTER~name~endpoint.id~operator~EQUALS~value~PlSjLFOnqvh52NGEE0X0VrHbJnM~entity~DESTINATION)~'
        }
      }
    },
    serviceResults: [
      { data: { id: 'ce4b152bac7b99744d8314838e49b799afd6dd96', label: 'nginx-web', types: ['HTTP'] } },
      { data: { id: '5131abcd21ea6e99111d71795fd9ad592bbc08a0', label: 'groundskeeper', types: ['HTTP', 'SDK'] } },
      { data: { id: '7bad5981bde769adba9a1894eb16db3c628c1846', label: 'eum-acceptor', types: ['HTTP'] } }
    ],
    endpointResults: [
      {
        data: {
          id: 'sMU46hsqUgQtvIuQ2q1vbMUD95c',
          label: 'GET /internal/{tenantName}/{tenantUnit}/precomputedFilter',
          serviceId: '5131abcd21ea6e99111d71795fd9ad592bbc08a0'
        }
      },
      {
        data: {
          id: 'PlSjLFOnqvh52NGEE0X0VrHbJnM',
          label: 'GET /ping',
          serviceId: '7bad5981bde769adba9a1894eb16db3c628c1846'
        }
      }
    ],
    // validation data
    after: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          dataSource: 'calls',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~service.name~operator~EQUALS~value~groundskeeper~entity~DESTINATION)(type~CONJUNCTION~logicalOperator~AND)(type~TAG*_FILTER~name~endpoint.name~operator~EQUALS~value~GET_/internal/{tenantName}/{tenantUnit}/precomputedFilter~entity~DESTINATION)(type~CONJUNCTION~logicalOperator~OR)(type~TAG*_FILTER~name~service.name~operator~EQUALS~value~nginx-web~entity~DESTINATION)(type~CONJUNCTION~logicalOperator~AND)(type~TAG*_FILTER~name~call.type~operator~EQUALS~value~HTTP)(type~CONJUNCTION~logicalOperator~OR)(type~TAG*_FILTER~name~service.name~operator~EQUALS~value~eum-acceptor~entity~DESTINATION)(type~CONJUNCTION~logicalOperator~AND)(type~TAG*_FILTER~name~endpoint.name~operator~EQUALS~value~GET_/ping~entity~DESTINATION)~'
        }
      }
    },
    parsedServiceIds: ['ce4b152bac7b99744d8314838e49b799afd6dd96'],
    parsedEndpointIds: ['sMU46hsqUgQtvIuQ2q1vbMUD95c', 'PlSjLFOnqvh52NGEE0X0VrHbJnM']
  }
];

const casesWithoutHiddenTags = [
  {
    name: 'call.erroneous and technology',
    before: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          dataSource: 'calls',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~call.erroneous~operator~EQUALS~value)(logicalOperator~AND~type~CONJUNCTION)(type~TAG*_FILTER~name~technology~operator~EQUALS~value~nginx~entity~DESTINATION)~'
        }
      }
    }
  },
  {
    name: 'empty filter',
    before: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          dataSource: 'calls',
          tagFilterExpression: '!~'
        }
      }
    }
  }
];

// catalog of normal users
const catalogTagWithHiddenTags = createTagCatalog(true);
// catalog of stan user or with a special role
const catalogTagWithoutHiddenTags = createTagCatalog(false);

describe('in-applications/analyze/AnalyzeView2_0/components/AnalyzeHiddenTagsViewParameterConversion/transformHelper', () => {
  describe('transformHiddenTags', () => {
    casesWithHiddenTags.forEach(({ name, before, serviceResults, endpointResults, after }) => {
      it(`must convert ${name}`, () => {
        const transformed = cloneLocation(before);
        transformHiddenTags({ location: transformed, serviceResults, endpointResults });
        expect(transformed).to.deep.equal(after);
      });
    });
  });

  describe('getServiceIds', () => {
    casesWithHiddenTags.forEach(({ name, before, parsedServiceIds }) => {
      it(`must convert ${name}`, () => {
        const location = cloneLocation(before);
        expect(getServiceIds(location)).to.deep.equal(parsedServiceIds);
      });
    });
  });

  describe('getEndpointIds', () => {
    casesWithHiddenTags.forEach(({ name, before, parsedEndpointIds }) => {
      it(`must convert ${name}`, () => {
        const location = cloneLocation(before);
        expect(getEndpointIds(location)).to.deep.equal(parsedEndpointIds);
      });
    });
  });

  describe('isAnalyticsWithHiddenTagsLocation', () => {
    describe('UA locations with hidden tags - normal user', () => {
      casesWithHiddenTags.forEach(({ name, before }) => {
        it(`must identify ${name}`, () => {
          expect(isAnalyticsWithHiddenTagsLocation(before, catalogTagWithHiddenTags, [], [])).to.equal(true);
        });
      });
    });

    describe('UA locations with hidden tags - normal user - ignore previously unresolved serviceIds and endpointIds ', () => {
      casesWithHiddenTags.forEach(({ name, before, parsedServiceIds, parsedEndpointIds }) => {
        it(`must ignore previously unresolved IDs ${name}`, () => {
          expect(
            isAnalyticsWithHiddenTagsLocation(before, catalogTagWithHiddenTags, parsedServiceIds, parsedEndpointIds)
          ).to.equal(false);
        });
      });
    });

    describe('UA locations with hidden tags - stan user', () => {
      casesWithHiddenTags.forEach(({ name, before }) => {
        it(`must not identify ${name}`, () => {
          expect(isAnalyticsWithHiddenTagsLocation(before, catalogTagWithoutHiddenTags, [], [])).to.equal(false);
        });
      });
    });

    describe('UA locations without hidden tags - normal user', () => {
      casesWithoutHiddenTags.forEach(({ name, before }) => {
        it(`must not identify ${name}`, () => {
          expect(isAnalyticsWithHiddenTagsLocation(before, catalogTagWithHiddenTags, [], [])).to.equal(false);
        });
      });
    });
  });
});

function createTagCatalog(hidden) {
  return {
    tagTree: [
      {
        label: 'Endpoint',
        description: null,
        icon: null,
        children: [
          {
            label: 'ID',
            icon: 'lib_application_endpoint',
            tagName: 'endpoint.id',
            queryable: true,
            hidden: hidden,
            type: 'TAG'
          }
        ],
        type: 'LEVEL',
        queryable: false
      },
      {
        label: 'Service',
        description: null,
        icon: null,
        children: [
          {
            label: 'ID',
            icon: 'lib_application_service',
            tagName: 'service.id',
            queryable: true,
            hidden: hidden,
            type: 'TAG'
          }
        ]
      }
    ],
    tags: [
      {
        name: 'service.id',
        label: 'ID',
        type: 'STRING',
        description: null,
        canApplyToSource: true,
        canApplyToDestination: true
      },
      {
        name: 'endpoint.id',
        label: 'ID',
        type: 'STRING',
        description: null,
        canApplyToSource: true,
        canApplyToDestination: true
      }
    ]
  };
}
