/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';

describe('in-events/components/urlWithoutQueryParameter#urlWithoutQueryParameter', () => {
  it('only removes any q= args from the url query parameter', () => {
    // GIVEN
    const without_q_queryParam = '/someUrl?with=someParams';
    const locationWithQuery = without_q_queryParam + '&q=nonEmpty';

    // THEN
    expect(urlWithoutQueryParameter(locationWithQuery)).toBe(without_q_queryParam);
  });
});
