/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import AISlugIcon from 'in-automation/components/AISlugIcon';

// Mock the components used in AISlugIcon
jest.mock('@instana/components', () => ({
  SvgIcon: ({ type, size, viewBox, className, onClick }: any) => (
    <div
      data-testid="mock-svg-icon"
      className={className}
      onClick={onClick}
      data-type={type}
      data-size={size}
      data-viewbox={viewBox}
    >
      SVG Icon
    </div>
  ),
  CarbonPopover: ({ open, align, className, caret, children }: any) => (
    <div
      data-testid="mock-carbon-popover"
      data-open={open ? 'true' : 'false'}
      data-align={align}
      className={className}
      data-caret={caret ? 'true' : 'false'}
    >
      {children}
    </div>
  ),
  CarbonPopoverContent: ({ className, id, children }: any) => (
    <div data-testid="mock-carbon-popover-content" className={className} id={id}>
      {children}
    </div>
  ),
  IconButton: ({ type, size, onClick }: any) => (
    <button data-testid="mock-icon-button" onClick={onClick} data-type={type} data-size={size}>
      Icon Button
    </button>
  ),
  Link: ({ linkIconType, href, external, children }: any) => (
    <a data-testid="mock-link" href={href} data-external={external ? 'true' : 'false'} data-icon-type={linkIconType}>
      {children}
    </a>
  )
}));

// Mock the CSS module
jest.mock('./AISlugIcon.mless', () => ({
  blueArrow: 'mock-blue-arrow-class',
  aiIconSlug: 'mock-ai-icon-slug-class',
  popoverContent: 'mock-popover-content-class',
  popupClose: 'mock-popup-close-class',
  popOverWrapper: 'mock-pop-over-wrapper-class',
  popupDescription: 'mock-popup-description-class',
  popSumTitle: 'mock-pop-sum-title-class',
  dataTypesHeader: 'mock-data-types-header-class',
  bullet: 'mock-bullet-class',
  aimodelLink: 'mock-aimodel-link-class',
  popupScriptDescription: 'mock-popup-script-description-class'
}));

describe('AISlugIcon', () => {
  it('renders with default props', () => {
    render(<AISlugIcon actionType="manual" />);

    const svgIcon = screen.getByTestId('mock-svg-icon');
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveAttribute('data-type', 'lib_ai_slug');

    const popover = screen.getByTestId('mock-carbon-popover');
    expect(popover).toBeInTheDocument();
    expect(popover).toHaveAttribute('data-open', 'false');
    expect(popover).toHaveAttribute('data-align', 'right-start');
  });

  it('renders with custom align prop', () => {
    render(<AISlugIcon actionType="manual" align="left-start" />);

    const popover = screen.getByTestId('mock-carbon-popover');
    expect(popover).toHaveAttribute('data-align', 'left-start');
  });

  it('toggles popover when icon is clicked', () => {
    render(<AISlugIcon actionType="manual" />);

    const svgIcon = screen.getByTestId('mock-svg-icon');
    const popover = screen.getByTestId('mock-carbon-popover');

    // Initially closed
    expect(popover).toHaveAttribute('data-open', 'false');

    // Click to open
    fireEvent.click(svgIcon);
    expect(popover).toHaveAttribute('data-open', 'true');

    // Click to close
    fireEvent.click(svgIcon);
    expect(popover).toHaveAttribute('data-open', 'false');
  });

  it('closes popover when close button is clicked', () => {
    render(<AISlugIcon actionType="manual" />);

    const svgIcon = screen.getByTestId('mock-svg-icon');
    const popover = screen.getByTestId('mock-carbon-popover');

    // Open the popover
    fireEvent.click(svgIcon);
    expect(popover).toHaveAttribute('data-open', 'true');

    // Click close button
    const closeButton = screen.getByTestId('mock-icon-button');
    fireEvent.click(closeButton);

    // Popover should be closed
    expect(popover).toHaveAttribute('data-open', 'false');
  });

  it('renders manual action content when actionType is "manual"', () => {
    render(<AISlugIcon actionType="manual" />);

    // Open the popover
    const svgIcon = screen.getByTestId('mock-svg-icon');
    fireEvent.click(svgIcon);

    // Check for the link to the AI model
    const link = screen.getByTestId('mock-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://huggingface.co/ibm-granite/granite-3.3-8b-instruct');
    expect(link).toHaveTextContent('ibm-granite/granite-3.3-8b-instruct');
  });

  it('renders script action content when actionType is "script"', () => {
    render(<AISlugIcon actionType="script" />);

    // Open the popover
    const svgIcon = screen.getByTestId('mock-svg-icon');
    fireEvent.click(svgIcon);

    // Check for the link to the AI model
    const link = screen.getByTestId('mock-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://huggingface.co/ibm-granite/granite-3.3-8b-instruct');
  });

  it('renders pre-generated actions content when actionType is "aiGenerated"', () => {
    render(<AISlugIcon actionType="aiGenerated" />);

    // Open the popover
    const svgIcon = screen.getByTestId('mock-svg-icon');
    fireEvent.click(svgIcon);

    // Should not have the AI model link
    expect(screen.queryByTestId('mock-link')).not.toBeInTheDocument();
  });
});
