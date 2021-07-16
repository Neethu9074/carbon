/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import {
  getFormatterType,
  markAsFormatterType,
  PERCENTAGE_FORMATTER_TYPE,
  UNDEFINED_FORMATTER_TYPE
} from 'in-services/formatters/number/types';

describe('in-services/formatters/number/types', () => {
  it('must return the undefined type when no better match was found', () => {
    expect(getFormatterType(null)).toEqual(UNDEFINED_FORMATTER_TYPE);
    expect(getFormatterType({})).toEqual(UNDEFINED_FORMATTER_TYPE);
    expect(getFormatterType(() => {})).toEqual(UNDEFINED_FORMATTER_TYPE);
  });

  it('must mark functions', () => {
    const type = PERCENTAGE_FORMATTER_TYPE;
    const formatter = () => {};
    expect(markAsFormatterType(formatter, type)).toEqual(formatter);
    expect(getFormatterType(formatter)).toEqual(type);
  });

  it('must mark objects and the fixed/compact fields', () => {
    const type = PERCENTAGE_FORMATTER_TYPE;
    const formatter = {
      compact: () => {},
      detailed: () => {}
    };
    expect(markAsFormatterType(formatter, type)).toEqual(formatter);
    expect(getFormatterType(formatter)).toEqual(type);
    expect(getFormatterType(formatter.compact)).toEqual(type);
    expect(getFormatterType(formatter.detailed)).toEqual(type);
  });

  it('must support partially annotated formatter objects', () => {
    const type = PERCENTAGE_FORMATTER_TYPE;
    const formatter = {
      compact: () => {},
      detailed: markAsFormatterType(() => {}, type)
    };
    expect(getFormatterType(formatter)).toEqual(type);
    expect(getFormatterType(formatter.compact)).toEqual(UNDEFINED_FORMATTER_TYPE);
    expect(getFormatterType(formatter.detailed)).toEqual(type);
  });
});
