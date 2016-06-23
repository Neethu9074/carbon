/* eslint-env mocha */

import {expect} from 'chai';

import {parse} from 'in-services/search/queryParser';

describe('in-services/queryParser', () => {
  it('must parse uncategorized text as free text query', () => {
    expect(parse('cassandra')).to.deep.equal([
      {
        type: 'freeText',
        text: 'cassandra'
      }
    ]);
  });

  it('must combine separate free word texts to a free text query', () => {
    expect(parse('cassandra node.js')).to.deep.equal([
      {
        type: 'freeText',
        text: 'cassandra node.js'
      }
    ]);
  });

  it('support complicated free text filter', () => {
    expect(parse('"cassandra node.js"  bla')).to.deep.equal([
      {
        type: 'freeText',
        text: 'cassandra node.js bla'
      }
    ]);
  });

  it('must identify key/value pairs', () => {
    expect(parse('tag=production')).to.deep.equal([
      {
        type: 'kv',
        key: 'tag',
        value: 'production',
        row: 1
      }
    ]);
  });

  it('must identify key/value pairs with excess whitespace', () => {
    expect(parse('tag  =development')).to.deep.equal([
      {
        type: 'kv',
        key: 'tag',
        value: 'development',
        row: 1
      }
    ]);
  });

  it('must identify quoted key/value pairs', () => {
    expect(parse('tag="my awesome tag"')).to.deep.equal([
      {
        type: 'kv',
        key: 'tag',
        value: 'my awesome tag',
        row: 1
      }
    ]);
  });

  it('must support complicated keys', () => {
    expect(parse('host.tag="my awesome tag"')).to.deep.equal([
      {
        type: 'kv',
        key: 'host.tag',
        value: 'my awesome tag',
        row: 1
      }
    ]);
  });

  it('must support multiple key/value pairs', () => {
    expect(parse('host.tag="my awesome tag" foo=bar')).to.deep.equal([
      {
        type: 'kv',
        key: 'host.tag',
        value: 'my awesome tag',
        row: 1
      },
      {
        type: 'kv',
        key: 'foo',
        value: 'bar',
        row: 1
      }
    ]);
  });

  it('must not parse quotes in a greedy fashion', () => {
    expect(parse('host.tag="my awesome tag" foo="bar"')).to.deep.equal([
      {
        type: 'kv',
        key: 'host.tag',
        value: 'my awesome tag',
        row: 1
      },
      {
        type: 'kv',
        key: 'foo',
        value: 'bar',
        row: 1
      }
    ]);
  });

  it('must support combinations of key/value pairs and free text', () => {
    expect(parse('node.js host.tag ="my awesome tag" "what up" foo=bar')).to.deep.equal([
      {
        type: 'kv',
        key: 'host.tag',
        value: 'my awesome tag',
        row: 1
      },
      {
        type: 'kv',
        key: 'foo',
        value: 'bar',
        row: 1
      },
      {
        type: 'freeText',
        text: 'node.js what up'
      }
    ]);
  });

  it('must support multi-line queries', () => {
    expect(parse('cassandra \ntag=foo\nnode.js')).to.deep.equal([
      {
        type: 'kv',
        key: 'tag',
        value: 'foo',
        row: 2
      },
      {
        type: 'freeText',
        text: 'cassandra node.js'
      }
    ]);
  });

  it('must report failures', () => {
    expect(() => parse('cassandra~foo')).to.throw(/Unexpected character at row 1: ~/);
  });

  it('must provide helpful debugging information on parsing errors', () => {
    try {
      parse('cassandra\nblub~foo');
      throw new Error('Parsing must fail');
    } catch (e) {
      expect(e.row).to.equal(2);
      expect(e.char).to.equal('~');
    }
  });
});
