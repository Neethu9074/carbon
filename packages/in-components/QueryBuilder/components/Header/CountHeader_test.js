/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import CountHeader from 'in-components/QueryBuilder/components/Header/CountHeader';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

import locals from './CountHeader.mless';

jest.mock('@instana/hooks');

describe('in-components/QueryBuilder/components/Header/CountHeader', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders count header with placeholder text if data is loading', () => {
    const { getByText } = render(<CountHeader isLoading />);
    expect(getByText(t('in-components:analyzeView.resultHeaderLoading'))).toBeInTheDocument();
  });

  it('Renders empty count header as placeholder in case of errors', () => {
    const { container } = render(<CountHeader hasErrors />);
    const heading = container.querySelector(`.${locals.topText}`);
    expect(heading).toBeEmptyDOMElement();
  });

  it('Should display group count if grouping is true', () => {
    useObservable.mockReturnValue('');
    const totalHits = 125;
    const { getByText } = render(
      <CountHeader totalRepresentedItemCount={null} totalHits={totalHits} totalRetainedItemCount={null} withGrouping />
    );

    expect(
      getByText(
        t('in-components:analyzeView.groupedViewHeader', {
          count: totalHits,
          formattedCount: number.compact(totalHits)
        })
      )
    );
  });

  it('When is not grouped and has no historical data should display the total retained item count', () => {
    useObservable.mockReturnValue({ containsHistoricData: false });
    const totalRepresentedItemCount = 1000;
    const totalHits = 100;
    const totalRetainedItemCount = 100;
    const dataSource = 'calls';
    const { getByText, queryByText } = render(
      <CountHeader
        totalRepresentedItemCount={totalRepresentedItemCount}
        totalHits={totalHits}
        totalRetainedItemCount={totalRetainedItemCount}
        dataSource={dataSource}
      />
    );

    expect(
      getByText(
        t('in-components:analyzeView.result', {
          count: totalRetainedItemCount,
          formattedCount: number.compact(totalRetainedItemCount),
          dataSource: dataSource
        })
      )
    );

    expect(
      queryByText(
        t('in-components:analyzeView.resultRetained', {
          count: totalHits,
          formattedCount: number.compact(totalHits)
        })
      )
    ).not.toBeInTheDocument();
  });

  it('When is not grouped and it has historical data should display the total represented item count and retained items', () => {
    const totalRepresentedItemCount = 125;
    const totalHits = 100;
    const totalRetainedItemCount = 100;
    const dataSource = 'calls';
    const { getByText } = render(
      <CountHeader
        totalRepresentedItemCount={totalRepresentedItemCount}
        totalHits={totalHits}
        totalRetainedItemCount={totalRetainedItemCount}
        dataSource={dataSource}
        renderHistoricDataIndicator
      />
    );

    expect(
      getByText(
        t('in-components:analyzeView.result', {
          count: totalRetainedItemCount,
          formattedCount: number.compact(totalRetainedItemCount),
          dataSource: dataSource
        })
      )
    );

    expect(
      getByText(
        t('in-components:analyzeView.groupedViewHeaderRetained', {
          count: totalRepresentedItemCount,
          formattedCount: number.compact(totalRepresentedItemCount)
        })
      )
    );
  });

  it('When is not grouped and it has historical data but retained item count is the same as represented item count should not display the retained items', () => {
    useObservable.mockReturnValue({ containsHistoricData: true });
    const totalRepresentedItemCount = 1000;
    const totalHits = 100;
    const totalRetainedItemCount = 100;
    const { getByText, queryByText } = render(
      <CountHeader
        totalRepresentedItemCount={totalRepresentedItemCount}
        totalHits={totalHits}
        totalRetainedItemCount={totalRetainedItemCount}
      />
    );

    expect(
      getByText(
        t('in-components:analyzeView.result', {
          count: totalRetainedItemCount,
          formattedCount: number.compact(totalRetainedItemCount)
        })
      )
    );

    expect(
      queryByText(
        t('in-components:analyzeView.resultRetained', {
          count: totalRepresentedItemCount,
          formattedCount: number.compact(totalRepresentedItemCount)
        })
      )
    ).not.toBeInTheDocument();
  });
});
