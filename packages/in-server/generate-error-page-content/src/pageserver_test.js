// Assisted by watsonx Code Assistant
// pageserver.test.jsx
/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SSRRender } from './pageserver';

describe('Test SSRRender', () => {
  it('renders the correct components for 404 error', () => {
    const html = SSRRender('404');

    expect(html).toMatch(/404/);
    expect(html).toMatch(/{{title}}/);
    expect(html).toMatch(/{{homeLink}}/);
  });

  it('renders the correct components for 403 error', () => {
    const html = SSRRender('403');

    expect(html).toMatch(/403/);
    expect(html).toMatch(/{{label}}/);
    expect(html).toMatch(/{{adminLink}}/);
    expect(html).toMatch(/{{signoutButtonLabel}}/);
  });

  it('renders the correct components for 500 error', () => {
    const html = SSRRender('500');

    expect(html).toMatch(/custom/);
    expect(html).toMatch(/{{description}}/);
    expect(html).toMatch(/{{supportLink}}/);
  });

  it('renders the correct components for maintenance error', () => {
    const html = SSRRender('maintenance');

    expect(html).toMatch(/custom/);
    expect(html).toMatch(/{{label}}/);
    expect(html).toMatch(/{{statusLink/);
  });
});
