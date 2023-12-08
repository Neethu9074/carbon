/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import oldGeneratedTheme from 'in-themes/active';
import oldTheme from 'in-themes/theme';

describe('in-theme/theme', () => {
  it('must match old default theme', () => {
    expect(oldTheme).toStrictEqual(oldGeneratedTheme);
  });
});
