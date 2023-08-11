/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { expect } from 'chai';

import { getSuggestionsTagFilterExpression } from 'in-components/QueryBuilder/tagFilter/tagSuggestions';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';

const createTagFilter = (name, value) => {
  return {
    type: 'TAG_FILTER',
    name: name,
    operator: 'EQUALS',
    value: value,
    entity: 'DESTINATION'
  };
};

const CONJUNCTION_AND = {
  type: 'CONJUNCTION',
  logicalOperator: 'AND'
};

const CONJUNCTION_OR = {
  type: 'CONJUNCTION',
  logicalOperator: 'OR'
};

const OPEN_BRACKET = {
  type: 'OPEN_BRACKET'
};

const CLOSE_BRACKET = {
  type: 'CLOSE_BRACKET'
};

describe('in-components/QueryBuilder/tagFilter/tagSuggestions#getSuggestionsTagFilterExpression', () => {
  /**
   * Query:
   * ActiveTag
   */
  it('must return a default backend model if only one tag is present', () => {
    const formModel = [createTagFilter('service.name', '')];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    };
    const result = getSuggestionsTagFilterExpression(formModel, 0);
    expect(result).to.deep.equal(expected);
  });

  /**
   * Query:
   * Tag AND ActiveTag AND Tag
   */
  it('must add conjuncted elements to expression', () => {
    const formModel = [
      createTagFilter('service.name', 'ui-backend'),
      CONJUNCTION_AND,
      createTagFilter('application.name', ''),
      CONJUNCTION_AND,
      createTagFilter('endpoint.name', '/GET')
    ];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [createTagFilter('service.name', 'ui-backend'), createTagFilter('endpoint.name', '/GET')]
    };
    const result = getSuggestionsTagFilterExpression(formModel, 2);
    expect(result).to.deep.equal(expected);
  });

  it('must retain filters with missing values and single argument operators', () => {
    const formModel = [
      tagFilter('call.type', 'NOT_EMPTY'),
      CONJUNCTION_AND,
      tagFilter('technology', 'IS_EMPTY'),
      CONJUNCTION_AND,
      tagFilter('call.type', undefined)
    ];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [tagFilter('technology', 'IS_EMPTY'), tagFilter('call.type', 'NOT_EMPTY')]
    };
    const result = getSuggestionsTagFilterExpression(formModel, 4);
    expect(result).to.deep.equal(expected);
  });

  it('must ignore filters with missing values or keys', () => {
    const formModel = [
      createTagFilter('technology', undefined),
      CONJUNCTION_AND,
      createTagFilter('service.name', undefined),
      CONJUNCTION_AND,
      createTagFilter('endpoint.name', null),
      CONJUNCTION_AND,
      createTagFilter('call.name', ''),
      CONJUNCTION_AND,
      tagFilter('call.tag', 'EQUALS', 'address', ''),
      CONJUNCTION_AND,
      tagFilter('call.erroneous', 'EQUALS', 'true')
    ];
    const expected = tagFilter('call.erroneous', 'EQUALS', 'true');
    const result = getSuggestionsTagFilterExpression(formModel, 0);
    expect(result).to.deep.equal(expected);
  });

  /**
   * Query:
   * Tag AND Tag AND ActiveTag AND Tag AND Tag
   */
  it('must add multiple conjuncted elements to expression', () => {
    const formModel = [
      createTagFilter('endpoint.id', '2'),
      CONJUNCTION_AND,
      createTagFilter('service.name', 'ui-backend'),
      CONJUNCTION_AND,
      createTagFilter('application.name', ''),
      CONJUNCTION_AND,
      createTagFilter('endpoint.name', '/GET'),
      CONJUNCTION_AND,
      createTagFilter('endpoint.test', '4')
    ];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [
        createTagFilter('service.name', 'ui-backend'),
        createTagFilter('endpoint.id', '2'),
        createTagFilter('endpoint.name', '/GET'),
        createTagFilter('endpoint.test', '4')
      ]
    };
    const result = getSuggestionsTagFilterExpression(formModel, 4);
    expect(result).to.deep.equal(expected);
  });

  /**
   * Query:
   * Tag OR Tag AND ActiveTag AND Tag OR Tag
   */
  it('must ignore out of scope elements', () => {
    const formModel = [
      createTagFilter('endpoint.id', '2'),
      CONJUNCTION_OR,
      createTagFilter('service.name', 'ui-backend'),
      CONJUNCTION_AND,
      createTagFilter('application.name', ''),
      CONJUNCTION_AND,
      createTagFilter('endpoint.name', '/GET'),
      CONJUNCTION_OR,
      createTagFilter('endpoint.id', '2')
    ];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [createTagFilter('service.name', 'ui-backend'), createTagFilter('endpoint.name', '/GET')]
    };
    const result = getSuggestionsTagFilterExpression(formModel, 4);
    expect(result).to.deep.equal(expected);
  });

  /**
   * Query:
   * ( Tag OR Tag ) AND ActiveTag AND ( Tag AND Tag )
   */
  it('must add bracket expression', () => {
    const formModel = [
      OPEN_BRACKET,
      createTagFilter('endpoint.id', '2'),
      CONJUNCTION_OR,
      createTagFilter('service.name', 'ui-backend'),
      CLOSE_BRACKET,
      CONJUNCTION_AND,
      createTagFilter('application.name', ''),
      CONJUNCTION_AND,
      OPEN_BRACKET,
      createTagFilter('endpoint.name', '/GET'),
      CONJUNCTION_AND,
      createTagFilter('endpoint.id', '2'),
      CLOSE_BRACKET
    ];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [
        {
          type: 'EXPRESSION',
          logicalOperator: 'OR',
          elements: [createTagFilter('endpoint.id', '2'), createTagFilter('service.name', 'ui-backend')]
        },
        {
          type: 'EXPRESSION',
          logicalOperator: 'AND',
          elements: [createTagFilter('endpoint.name', '/GET'), createTagFilter('endpoint.id', '2')]
        }
      ]
    };
    const result = getSuggestionsTagFilterExpression(formModel, 6);
    expect(result).to.deep.equal(expected);
  });

  /**
   * Query:
   * ( Tag OR Tag ) AND ActiveTag OR ( Tag AND Tag )
   */
  it('must ignore bracket expression', () => {
    const formModel = [
      OPEN_BRACKET,
      createTagFilter('endpoint.id', '2'),
      CONJUNCTION_OR,
      createTagFilter('service.name', 'ui-backend'),
      CLOSE_BRACKET,
      CONJUNCTION_AND,
      createTagFilter('application.name', ''),
      CONJUNCTION_OR,
      OPEN_BRACKET,
      createTagFilter('endpoint.name', '/GET'),
      CONJUNCTION_AND,
      createTagFilter('endpoint.id', '2'),
      CLOSE_BRACKET
    ];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'OR',
      elements: [createTagFilter('endpoint.id', '2'), createTagFilter('service.name', 'ui-backend')]
    };
    const result = getSuggestionsTagFilterExpression(formModel, 6);
    expect(result).to.deep.equal(expected);
  });

  /**
   * Query:
   * Tag AND ( Tag OR Tag ) AND ActiveTag AND ( Tag AND Tag ) AND Tag
   */
  it('must add bracket expression and continue', () => {
    const formModel = [
      createTagFilter('endpoint.test', '4'),
      CONJUNCTION_AND,
      OPEN_BRACKET,
      createTagFilter('endpoint.id', '2'),
      CONJUNCTION_OR,
      createTagFilter('service.name', 'ui-backend'),
      CLOSE_BRACKET,
      CONJUNCTION_AND,
      createTagFilter('application.name', ''),
      CONJUNCTION_AND,
      OPEN_BRACKET,
      createTagFilter('endpoint.name', '/GET'),
      CONJUNCTION_AND,
      createTagFilter('endpoint.id', '2'),
      CLOSE_BRACKET,
      CONJUNCTION_AND,
      createTagFilter('application.test', 'hello')
    ];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [
        {
          type: 'EXPRESSION',
          logicalOperator: 'OR',
          elements: [createTagFilter('endpoint.id', '2'), createTagFilter('service.name', 'ui-backend')]
        },
        createTagFilter('endpoint.test', '4'),
        {
          type: 'EXPRESSION',
          logicalOperator: 'AND',
          elements: [createTagFilter('endpoint.name', '/GET'), createTagFilter('endpoint.id', '2')]
        },
        createTagFilter('application.test', 'hello')
      ]
    };
    const result = getSuggestionsTagFilterExpression(formModel, 8);
    expect(result).to.deep.equal(expected);
  });

  /**
   * Query:
   * Tag AND ( ( Tag OR TAG ) OR ActiveTag ) AND Tag
   */
  it('must ignore statement until hitting outer bracket', () => {
    const formModel = [
      createTagFilter('endpoint.test', '4'),
      CONJUNCTION_AND,
      OPEN_BRACKET,
      OPEN_BRACKET,
      createTagFilter('endpoint.id', '2'),
      CONJUNCTION_OR,
      createTagFilter('service.name', 'ui-backend'),
      CLOSE_BRACKET,
      CONJUNCTION_OR,
      createTagFilter('application.name', ''),
      CLOSE_BRACKET,
      CONJUNCTION_AND,
      createTagFilter('endpoint.name', '/GET')
    ];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [createTagFilter('endpoint.test', '4'), createTagFilter('endpoint.name', '/GET')]
    };
    const result = getSuggestionsTagFilterExpression(formModel, 9);
    expect(result).to.deep.equal(expected);
  });

  /**
   * Query:
   * ActiveTag AND ( ( Tag OR TAG ) AND TAG
   */
  it('can handle missing bracket', () => {
    const formModel = [
      createTagFilter('application.name', ''),
      CONJUNCTION_AND,
      OPEN_BRACKET,
      OPEN_BRACKET,
      createTagFilter('endpoint.test', '4'),
      CONJUNCTION_OR,
      createTagFilter('endpoint.id', '2'),
      CLOSE_BRACKET,
      CONJUNCTION_AND,
      createTagFilter('endpoint.name', '/GET')
    ];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [
        {
          type: 'EXPRESSION',
          logicalOperator: 'OR',
          elements: [createTagFilter('endpoint.test', '4'), createTagFilter('endpoint.id', '2')]
        },
        createTagFilter('endpoint.name', '/GET')
      ]
    };
    const result = getSuggestionsTagFilterExpression(formModel, 0);
    expect(result).to.deep.equal(expected);
  });

  /**
   * Query:
   * Tag AND AND ActiveTag OR AND Tag
   */
  it('must return at invalid conjuncted elements', () => {
    const formModel = [
      createTagFilter('service.name', 'ui-backend'),
      CONJUNCTION_AND,
      CONJUNCTION_AND,
      createTagFilter('application.name', ''),
      CONJUNCTION_OR,
      CONJUNCTION_AND,
      createTagFilter('endpoint.name', '/GET')
    ];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    };
    const result = getSuggestionsTagFilterExpression(formModel, 3);
    expect(result).to.deep.equal(expected);
  });

  /**
   * Query:
   * Tag AND ( AND ActiveTag AND ) AND Tag
   */
  it('must return at invalid closing brackets', () => {
    const formModel = [
      createTagFilter('service.name', 'ui-backend'),
      CONJUNCTION_AND,
      OPEN_BRACKET,
      CONJUNCTION_AND,
      createTagFilter('application.name', ''),
      CONJUNCTION_AND,
      CLOSE_BRACKET,
      CONJUNCTION_AND,
      createTagFilter('endpoint.name', '/GET')
    ];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    };
    const result = getSuggestionsTagFilterExpression(formModel, 4);
    expect(result).to.deep.equal(expected);
  });

  /**
   * Query:
   * Tag AND Tag ActiveTag Tag AND Tag
   */
  it('must return at invalid missing conjunctions', () => {
    const formModel = [
      createTagFilter('service.name', 'ui-backend'),
      CONJUNCTION_AND,
      createTagFilter('service.id', '2'),
      createTagFilter('application.name', ''),
      createTagFilter('endpoint.id', '3'),
      CONJUNCTION_AND,
      createTagFilter('endpoint.name', '/GET')
    ];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    };
    const result = getSuggestionsTagFilterExpression(formModel, 3);
    expect(result).to.deep.equal(expected);
  });

  /**
   * Query:
   * ActiveTag AND ( Tag OR)
   */
  it('must skip invalid bracket expression', () => {
    const formModel = [
      createTagFilter('application.name', ''),
      CONJUNCTION_AND,
      OPEN_BRACKET,
      createTagFilter('endpoint.name', '/GET'),
      CONJUNCTION_OR,
      CLOSE_BRACKET
    ];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    };
    const result = getSuggestionsTagFilterExpression(formModel, 0);
    expect(result).to.deep.equal(expected);
  });

  /**
   * Query:
   * (OR Tag) AND ActiveTag
   */
  it('must skip invalid bracket expression', () => {
    const formModel = [
      CLOSE_BRACKET,
      CONJUNCTION_OR,
      createTagFilter('endpoint.name', '/GET'),
      OPEN_BRACKET,
      CONJUNCTION_AND,
      createTagFilter('application.name', '')
    ];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    };
    const result = getSuggestionsTagFilterExpression(formModel, 0);
    expect(result).to.deep.equal(expected);
  });

  /**
   * Query:
   * ActiveTag AND (Tag OR
   */
  it('must skip incomplete bracket expression', () => {
    const formModel = [
      createTagFilter('endpoint.name', ''),
      CONJUNCTION_AND,
      OPEN_BRACKET,
      createTagFilter('application.name', 'foo'),
      CONJUNCTION_OR
    ];
    const expected = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    };
    const result = getSuggestionsTagFilterExpression(formModel, 0);
    expect(result).to.deep.equal(expected);
  });
});
