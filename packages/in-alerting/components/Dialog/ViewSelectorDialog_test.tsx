/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { t } from 'in-i18n';

describe('ViewSelectorDialog', () => {
  const SelectorComponent = (
    <ViewSelectorDialog trackCta={jest.fn()} openOldDialog={jest.fn()} getLinkToCreateSmartAlert={'test'} />
  );
  it('renders the dialog title', () => {
    render(SelectorComponent);
    const title = screen.getByText(t('in-alerting:components.chooseLayoutDialog.chooseLayout'));
    expect(title).toBeInTheDocument();
  });

  it('renders the old layout description', () => {
    render(SelectorComponent);
    const description = screen.getByText(t('in-alerting:components.chooseLayoutDialog.layoutContent'));
    expect(description).toBeInTheDocument();
  });

  it('renders the new layout description', () => {
    render(SelectorComponent);
    const description = screen.getByText(t('in-alerting:components.chooseLayoutDialog.oldLayoutDescription'));
    expect(description).toBeInTheDocument();
  });

  it('renders the layout recommendation', () => {
    render(SelectorComponent);
    const recommendation = screen.getByText(t('in-alerting:components.chooseLayoutDialog.newLayoutDescription'));
    expect(recommendation).toBeInTheDocument();
  });

  it('renders the cancel button', () => {
    render(SelectorComponent);
    const cancelButton = screen.getByText(t('in-alerting:components.chooseLayoutDialog.cancelTitle'));
    expect(cancelButton).toBeInTheDocument();
  });

  it('renders the use old layout button', () => {
    render(SelectorComponent);
    const oldLayoutButton = screen.getByText(t('in-alerting:components.chooseLayoutDialog.useOldLayout'));
    expect(oldLayoutButton).toBeInTheDocument();
  });

  it('renders the use new layout button', () => {
    render(SelectorComponent);
    const newLayoutButton = screen.getByText(t('in-alerting:components.chooseLayoutDialog.useNewLayout'));
    expect(newLayoutButton).toBeInTheDocument();
  });
});
