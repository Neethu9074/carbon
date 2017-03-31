/* eslint-env mocha */
import { expect } from 'chai';

import {
  replaceWith,
  getSubstringTillDotBackwards,
  getCursorTillNextDot
} from 'in-components/SearchBar/misc/stringUtils';

describe('in-components/SearchBar/misc/stringUtils', () => {
  it('returns empty string if nothing is given', () => {
    expect(getSubstringTillDotBackwards()).to.equal('');
  });

  it('returns empty string on emptry string', () => {
    expect(getSubstringTillDotBackwards('')).to.equal('');
  });

  it('returns given input if it does not contain a dot', () => {
    expect(getSubstringTillDotBackwards('foo')).to.equal('foo');
  });

  it('returns all content till a dot is found, exclusive', () => {
    expect(getSubstringTillDotBackwards('foo.')).to.equal('');
    expect(getSubstringTillDotBackwards('foo.bar')).to.equal('bar');
    expect(getSubstringTillDotBackwards('foo.bar.hasso')).to.equal('hasso');
  });

  it('returns all content till a dot is found for a given cursor', () => {
    expect(getSubstringTillDotBackwards('foo.bar.hasso', 7)).to.equal('bar');
  });

  it('', () => {
    expect(getCursorTillNextDot('')).to.equal(0);
  });

  it('', () => {
    expect(getCursorTillNextDot('foo')).to.equal(3);
  });

  it('', () => {
    expect(getCursorTillNextDot('foo.bar')).to.equal(3);
    expect(getCursorTillNextDot('foo.bar', 5)).to.equal(7);
    expect(getCursorTillNextDot('foo.bar.', 5)).to.equal(7);
    expect(getCursorTillNextDot('foo.bar.hasso', 5)).to.equal(7);
    expect(getCursorTillNextDot('foo.bar.hasso', 8)).to.equal(13);
    expect(getCursorTillNextDot('foo.', 3)).to.equal(3);
  });

  it('return empty string on given empty string', () => {
    expect(replaceWith('', 0, 0, '')).to.deep.equal({ cursorAfterInsertion: 0, string: '' });
  });

  it('can replace the hole string', () => {
    expect(replaceWith('oldie', 0, 5, 'but goldie')).to.deep.equal({ cursorAfterInsertion: 10, string: 'but goldie' });
  });

  it('can replace parts of a string', () => {
    expect(replaceWith('oldie but goldie', 10, 16, 'foo')).to.deep.equal({
      cursorAfterInsertion: 13,
      string: 'oldie but foo'
    });
    expect(replaceWith('entity.loc', 7, 10, 'location')).to.deep.equal({
      cursorAfterInsertion: 15,
      string: 'entity.location'
    });
    expect(
      replaceWith('entity.location AND span:"jkdfks" span.ty /regex madness/ span.type', 39, 41, 'type')
    ).to.deep.equal({
      cursorAfterInsertion: 43,
      string: 'entity.location AND span:"jkdfks" span.type /regex madness/ span.type'
    });
  });
});
