/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { cleanUpText } from 'in-events/components/AIChat/utils';

describe('cleanUpText', () => {
  it('general handling', () => {
    expect(
      cleanUpText('something.something  9fdasjkcdsa 00 --f a9fda word.word TETS!!! asdf. asdf. asdf asdf')
    ).toEqual('`something.something`  9fdasjkcdsa 00 --f a9fda `word.word` TETS!!! asdf. asdf. asdf asdf');
    expect(cleanUpText('something.something')).toEqual('`something.something`');
  });
});
