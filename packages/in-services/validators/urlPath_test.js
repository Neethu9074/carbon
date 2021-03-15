/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha, node */
import { expect } from 'chai';

import { parse, build, validate } from 'in-services/validators/urlPath';

describe('in-services/validators/urlPath', () => {
  describe('parse', () => {
    it('should return an empty array when giving null, undefined, or empty string', () => {
      expect(parse(null)).to.have.length(0);
      expect(parse(undefined)).to.have.length(0);
      expect(parse('')).to.have.length(0);
    });

    describe('FIXED', () => {
      it('should parse the query', () => {
        const result = parse('foobar');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'FIXED',
          name: 'foobar'
        });
      });

      it('should parse the query', () => {
        const result = parse('/foobar');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'FIXED',
          name: 'foobar'
        });
      });

      it('should parse the query', () => {
        const result = parse('foobar/');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'FIXED',
          name: 'foobar'
        });
      });

      it('should parse the query', () => {
        const result = parse('/foobar/');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'FIXED',
          name: 'foobar'
        });
      });

      it('should parse the query', () => {
        const result = parse('/product-type');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'FIXED',
          name: 'product-type'
        });
      });
    });

    describe('PARAMETER', () => {
      it('should parse the query', () => {
        const result = parse('{foobar}');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'PARAMETER',
          name: 'foobar'
        });
      });

      it('should parse the query', () => {
        const result = parse('/{foobar}');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'PARAMETER',
          name: 'foobar'
        });
      });

      it('should parse the query', () => {
        const result = parse('{foobar}/');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'PARAMETER',
          name: 'foobar'
        });
      });

      it('should parse the query', () => {
        const result = parse('/{foobar}/');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'PARAMETER',
          name: 'foobar'
        });
      });
    });

    describe('MATCH_ALL', () => {
      it('should parse the query', () => {
        const result = parse('*');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'MATCH_ALL'
        });
      });

      it('should parse the query', () => {
        const result = parse('/*');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'MATCH_ALL'
        });
      });

      it('should parse the query', () => {
        const result = parse('*/');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'MATCH_ALL'
        });
      });

      it('should parse the query', () => {
        const result = parse('/*/');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'MATCH_ALL'
        });
      });
    });

    describe('UNSUPPORTED', () => {
      it('should parse the query', () => {
        const result = parse('**');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'UNSUPPORTED',
          name: '**'
        });
      });

      it('should parse the query', () => {
        const result = parse('/{foo}bar');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'UNSUPPORTED',
          name: '{foo}bar'
        });
      });

      it('should parse the query', () => {
        const result = parse('{missing/');
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal({
          type: 'UNSUPPORTED',
          name: '{missing'
        });
      });
    });

    describe('mutli', () => {
      it('should parse the query', () => {
        const result = parse('/api/{query}/*');
        expect(result).to.have.length(3);
        expect(result[0]).to.deep.equal({
          type: 'FIXED',
          name: 'api'
        });
        expect(result[1]).to.deep.equal({
          type: 'PARAMETER',
          name: 'query'
        });
        expect(result[2]).to.deep.equal({
          type: 'MATCH_ALL'
        });
      });
    });
  });

  describe('validate', () => {
    it('should return null when giving null, undefined, or empty array', () => {
      expect(validate(null)).to.equal(null);
      expect(validate(undefined)).to.equal(null);
      expect(validate([])).to.equal(null);
    });

    it('should give an invalid result when the parsed result contains an UNSUPPORTED type', () => {
      expect(
        validate([
          {
            type: 'FIXED',
            name: 'api'
          }
        ])
      ).to.equal(null);
      expect(
        validate([
          {
            type: 'FIXED',
            name: 'api'
          },
          {
            type: 'UNSUPPORTED',
            name: 'api'
          },
          {
            type: 'FIXED',
            name: 'api'
          }
        ])
      ).to.have.length(1);
    });
  });

  describe('build', () => {
    it('should return empty string when giving null, undefined, or empty array', () => {
      expect(build(null)).to.equal('');
      expect(build(undefined)).to.equal('');
      expect(build([])).to.equal('');
    });

    it('should return the original string, if a string is given', () => {
      expect(build('foobar')).to.equal('foobar');
    });

    it('should build the original string', () => {
      expect(
        build([
          {
            type: 'FIXED',
            name: 'api'
          }
        ])
      ).to.equal('/api');

      expect(
        build([
          {
            type: 'FIXED',
            name: 'api'
          },
          {
            type: 'PARAMETER',
            name: 'query'
          },
          {
            type: 'FIXED',
            name: 'color'
          },
          {
            type: 'MATCH_ALL'
          }
        ])
      ).to.equal('/api/{query}/color/*');
    });
  });
});
