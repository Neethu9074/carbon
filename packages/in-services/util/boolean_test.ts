/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { compare } from 'in-services/util/boolean';

test('boolean comparison', () => {
  expect(compare(false, false)).toBe(0);
  expect(compare(true, false)).toBe(-1);
  expect(compare(false, true)).toBe(1);
  expect(compare(true, true)).toBe(0);
});
