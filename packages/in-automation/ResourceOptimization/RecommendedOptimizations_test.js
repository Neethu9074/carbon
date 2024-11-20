/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, fireEvent } from '@testing-library/react';
import React from 'react';

import RecommendedOptimizations from 'in-automation/ResourceOptimization/RecommendedOptimizations';
import { recommendedList, testData } from 'in-automation/ResourceOptimization/testData';
import { t } from 'in-i18n';

const mockActionClick = jest.fn();

// Test cases
describe('Recommended Optimizations table', () => {
  test('renders correctly with initial props', () => {
    const { getByText, getAllByText } = render(
      <RecommendedOptimizations
        recommendedActions={recommendedList}
        totalRecommendedActions={testData?.totalRecommendedActionsCount}
      />
    );
    expect(
      getByText(t('in-automation:recommendedOptimizationsWithCount', { count: testData?.totalRecommendedActionsCount }))
    ).toBeInTheDocument();
    expect(getAllByText(t('in-automation:turboActionCategories.prevention'))[0]).toBeInTheDocument();
  });

  test('click on action history link triggers the history tracker', () => {
    const { getAllByRole } = render(
      <RecommendedOptimizations
        recommendedActions={recommendedList}
        totalRecommendedActions={testData?.totalRecommendedActionsCount}
        onActionClick={mockActionClick}
      />
    );
    const actionButton = getAllByRole('button')[5];
    fireEvent.click(actionButton);
    expect(mockActionClick).toHaveBeenCalled();
  });
});
