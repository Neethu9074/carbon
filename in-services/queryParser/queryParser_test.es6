/* eslint-env mocha */

import {expect} from 'chai';

import {parse} from 'in-services/queryParser';

describe('in-services/queryParser', () => {
  it('must parse uncategorized text as free text query', () => {
    expect(parse('cassandra')).to.deep.equal([
      {
        type: 'freeText',
        options: 'cassandra'
      }
    ]);
  });

  it('must combine separate free word texts to a free text query', () => {
    expect(parse('cassandra node.js')).to.deep.equal([
      {
        type: 'freeText',
        options: 'cassandra node.js'
      }
    ]);
  });

  it('support complicated free text filter', () => {
    expect(parse('"cassandra node.js"  bla')).to.deep.equal([
      {
        type: 'freeText',
        options: 'cassandra node.js bla'
      }
    ]);
  });

  it('must identify key/value pairs', () => {
    expect(parse('tag=production')).to.deep.equal([
      {
        type: 'tag',
        options: 'production'
      }
    ]);
  });

  it('must identify key/value pairs with excess whitespace', () => {
    expect(parse('tag  =development')).to.deep.equal([
      {
        type: 'tag',
        options: 'development'
      }
    ]);
  });

  it('must identify quoted key/value pairs', () => {
    expect(parse('tag="my awesome tag"')).to.deep.equal([
      {
        type: 'tag',
        options: 'my awesome tag'
      }
    ]);
  });

  it('must support complicated keys', () => {
    expect(parse('host.tag="my awesome tag"')).to.deep.equal([
      {
        type: 'host.tag',
        options: 'my awesome tag'
      }
    ]);
  });

  it('must support multiple key/value pairs', () => {
    expect(parse('host.tag="my awesome tag" foo=bar')).to.deep.equal([
      {
        type: 'host.tag',
        options: 'my awesome tag'
      },
      {
        type: 'foo',
        options: 'bar'
      }
    ]);
  });

  it('must not parse quotes in a greedy fashion', () => {
    expect(parse('host.tag="my awesome tag" foo="bar"')).to.deep.equal([
      {
        type: 'host.tag',
        options: 'my awesome tag'
      },
      {
        type: 'foo',
        options: 'bar'
      }
    ]);
  });

  it('must support combinations of key/value pairs and free text', () => {
    expect(parse('node.js host.tag ="my awesome tag" "what up" foo=bar')).to.deep.equal([
      {
        type: 'host.tag',
        options: 'my awesome tag'
      },
      {
        type: 'foo',
        options: 'bar'
      },
      {
        type: 'freeText',
        options: 'node.js what up'
      }
    ]);
  });

  it('support flatten queries', () => {
    expect(parse('cassandra \ntag=foo\nnode.js')).to.deep.equal([
      {
        type: 'tag',
        options: 'foo'
      },
      {
        type: 'freeText',
        options: 'cassandra node.js'
      }
    ]);
  });
});
