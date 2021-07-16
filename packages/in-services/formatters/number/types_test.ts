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
    expect(getFormatterType(null as any)).toEqual(UNDEFINED_FORMATTER_TYPE);
    expect(getFormatterType({} as any)).toEqual(UNDEFINED_FORMATTER_TYPE);
    expect(getFormatterType(() => '42')).toEqual(UNDEFINED_FORMATTER_TYPE);
  });

  it('must mark functions', () => {
    const type = PERCENTAGE_FORMATTER_TYPE;
    const formatter = () => '42';
    expect(markAsFormatterType(formatter, type)).toEqual(formatter);
    expect(getFormatterType(formatter)).toEqual(type);
  });

  it('must mark objects and the fixed/compact fields', () => {
    const type = PERCENTAGE_FORMATTER_TYPE;
    const formatter = {
      compact: () => '42',
      detailed: () => '42.0'
    };
    expect(markAsFormatterType(formatter, type)).toEqual(formatter);
    expect(getFormatterType(formatter)).toEqual(type);
    expect(getFormatterType(formatter.compact)).toEqual(type);
    expect(getFormatterType(formatter.detailed)).toEqual(type);
  });

  it('must support partially annotated formatter objects', () => {
    const type = PERCENTAGE_FORMATTER_TYPE;
    const formatter = {
      compact: () => '42',
      detailed: markAsFormatterType(() => '42', type)
    };
    expect(getFormatterType(formatter)).toEqual(type);
    expect(getFormatterType(formatter.compact)).toEqual(UNDEFINED_FORMATTER_TYPE);
    expect(getFormatterType(formatter.detailed)).toEqual(type);
  });
});
