/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { CopyButton } from 'in-synthetics/components/CopyButton';

describe('CopyButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined)
      }
    });
  });

  it('clipboard should contain message when clicked', async () => {
    const message = 'message';

    render(<CopyButton message={message} />);

    const copyButtonElement = screen.getByTestId('copy-button');

    copyButtonElement.click();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(message);
  });
});
