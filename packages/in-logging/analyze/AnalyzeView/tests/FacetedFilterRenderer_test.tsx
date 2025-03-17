/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render } from '@testing-library/react';
import React from 'react';

//@ts-expect-error needs TS migration
import FacetedFilterMultiSelect from 'in-components/AnalyzeView/FacetedFilters/FacetedFilterMultiSelect';
import FacetedFilterRenderer from 'in-logging/analyze/AnalyzeView/FacetedFilterRenderer';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';

jest.mock('in-analyze/hooks/useAnalyzeTracker');
jest.mock('in-components/AnalyzeView/FacetedFilters/FacetedFilterMultiSelect', () => jest.fn(() => null));

describe('FacetedFilterRenderer', () => {
  it('should render and use the track functions from useAnalyzeTracker', () => {
    const trackUa2FacetedSearchFilterAdded = jest.fn();
    const trackUa2FacetedSearchGroupChanged = jest.fn();

    (useAnalyzeTracker as any).mockReturnValue({
      trackUa2FacetedSearchFilterAdded,
      trackUa2FacetedSearchGroupChanged
    });

    const mockProps = {
      renderer: jest.fn(() => <div>Mocked Renderer</div>),
      title: 'Mock Title',
      tag: 'Mock Tag',
      getSuggestionName: jest.fn().mockReturnValue('Mocked Suggestion Name'),
      getMetric: jest.fn().mockReturnValue('Mocked Metric'),
      customLabelMapper: jest.fn().mockReturnValue('Mocked Label'),
      ranges: [{ start: 0, string: 10 }],
      key: 'mock-key',
      getItems: jest.fn().mockReturnValue([]),
      getSuggestions: jest.fn().mockReturnValue([]),
      enableUseAsGroup: true,
      extraProps: { extraKey: 'extraValue' }
    };

    render(<FacetedFilterRenderer {...mockProps} />);

    expect(useAnalyzeTracker).toHaveBeenCalled();
    expect(FacetedFilterMultiSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        tracker: {
          suggestionClicked: trackUa2FacetedSearchFilterAdded,
          groupClicked: trackUa2FacetedSearchGroupChanged
        }
      }),
      expect.anything()
    );
  });
});
