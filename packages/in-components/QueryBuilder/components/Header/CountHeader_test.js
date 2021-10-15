/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import { useObservable } from '@instana/hooks';

import CountHeader from 'in-components/QueryBuilder/components/Header/CountHeader';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

jest.mock('@instana/hooks');

describe('in-components/QueryBuilder/components/Header/CountHeader', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders count header with placeholder text if there is no data', () => {
    const { getByText } = render(<CountHeader totalRepresentedItemCount={null} totalHits={null} />);
    expect(getByText(t('in-components:analyzeView.resultHeaderLoading'))).toBeInTheDocument();
  });

  it('Render count header with placeholder text if the observable didnt emit', () => {
    useObservable.mockReturnValue(undefined);

    const { getByText } = render(<CountHeader totalRepresentedItemCount={null} totalHits={123} />);
    expect(getByText(t('in-components:analyzeView.resultHeaderLoading'))).toBeInTheDocument();
  });

  it('Should display group count if grouping is true', () => {
    useObservable.mockReturnValue('');
    const totalHits = 125;
    const { getByText } = render(<CountHeader totalRepresentedItemCount={null} totalHits={totalHits} withGrouping />);

    expect(
      getByText(
        t('in-components:analyzeView.groupedViewHeader', {
          count: totalHits,
          formattedCount: number.compact(totalHits)
        })
      )
    );
  });

  it('Should display count of visible items if grouping and withResultsInGroups is true', () => {
    useObservable.mockReturnValue('');
    const totalRepresentedItemCount = 125;
    const { getByText } = render(
      <CountHeader totalRepresentedItemCount={totalRepresentedItemCount} withGrouping withResultsInGroups />
    );

    expect(
      getByText(
        t('in-components:analyzeView.result', {
          count: totalRepresentedItemCount,
          formattedCount: number.compact(totalRepresentedItemCount)
        })
      )
    );
  });

  it('When is not grouped and has no historical data should display the total represented item count', () => {
    useObservable.mockReturnValue({ containsHistoricData: false });
    const totalRepresentedItemCount = 125;
    const totalHits = 0;
    const { getByText, queryByText } = render(
      <CountHeader totalRepresentedItemCount={totalRepresentedItemCount} totalHits={totalHits} />
    );

    expect(
      getByText(
        t('in-components:analyzeView.result', {
          count: totalRepresentedItemCount,
          formattedCount: number.compact(totalRepresentedItemCount)
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
    useObservable.mockReturnValue({ containsHistoricData: true });
    const totalRepresentedItemCount = 125;
    const totalHits = 0;
    const { getByText } = render(
      <CountHeader totalRepresentedItemCount={totalRepresentedItemCount} totalHits={totalHits} />
    );

    expect(
      getByText(
        t('in-components:analyzeView.result', {
          count: totalRepresentedItemCount,
          formattedCount: number.compact(totalRepresentedItemCount)
        })
      )
    );

    expect(
      getByText(
        t('in-components:analyzeView.resultRetained', {
          count: totalHits,
          formattedCount: number.compact(totalHits)
        })
      )
    );
  });

  it('When is not grouped and it has historical data but represented item count is the same as total hits should not display the retained items', () => {
    useObservable.mockReturnValue({ containsHistoricData: true });
    const totalRepresentedItemCount = 125;
    const totalHits = 125;
    const { getByText, queryByText } = render(
      <CountHeader totalRepresentedItemCount={totalRepresentedItemCount} totalHits={totalHits} />
    );

    expect(
      getByText(
        t('in-components:analyzeView.result', {
          count: totalRepresentedItemCount,
          formattedCount: number.compact(totalRepresentedItemCount)
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
});
