/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ShowCaseComponent from 'in-custom-dashboards/widgets/Markdown/ShowCase';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/Markdown/ShowCase', () => {
  it('must render simple widget', async () => {
    render(<ShowCaseComponent />);

    await screen.findByText(t('in-custom-dashboards:widgets.markdown.demo.title'));

    const ps = document.getElementsByTagName('p');
    expect(ps).toBeDefined();
    expect(ps).toHaveLength(4);

    const ols = document.getElementsByTagName('ol');
    expect(ols).toBeDefined();
    expect(ols).toHaveLength(1);
  });
});
