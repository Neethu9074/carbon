/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { success } from 'in-services/util/result';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';
import ApdexList from '.';

describe('in-custom-dashboards/widgets/Apdex/components/ApdexList/ApdexList_test', () => {
  it('renders the ServerTablePresenter with the correct paginated result', () => {
    // Given
    const apdexResult = resultToFetchedStateResponse(
      success([
        {
          id: 'firstApdexId',
          createdAt: Date.now(),
          apdexName: 'FTL Efficiency',
          apdexEntity: {}
        },
        {
          id: 'secondApdexId',
          createdAt: Date.now(),
          apdexName: 'Warp Efficiency',
          apdexEntity: {}
        }
      ])
    );

    // When
    const wrapper = shallow(
      <ApdexList fetchedConfigState={apdexResult} onChange={noop} onSelect={noop} onEdit={noop} onDelete={noop} />
    );
    const ApdexTable = wrapper.find('[data-testid="ApdexList"]');

    // Then
    expect(ApdexTable.prop('result')).toMatchObject({
      errors: [],
      progress: {
        loading: false
      },
      data: {
        items: [...apdexResult[0]],
        page: 1,
        pageSize: 2,
        totalHits: 2
      }
    });
    expect(ApdexTable.prop('page')).toEqual(1);
    expect(ApdexTable.prop('pageSize')).toEqual(2);
  });

  it('renders the ServerTablePresenter with the correct column definitions', () => {
    // Given
    const apdexResult = resultToFetchedStateResponse(success([]));

    // When
    const wrapper = shallow(
      <ApdexList fetchedConfigState={apdexResult} onChange={noop} onSelect={noop} onEdit={noop} onDelete={noop} />
    );
    const ApdexTable = wrapper.find('[data-testid="ApdexList"]');

    // Then
    expect(ApdexTable.prop('columnDefinitions')).toMatchObject([
      { id: 'name', sortable: true, label: t('in-custom-dashboards:widgets.apdex.apdexList.nameColumn') },
      { id: 'threshold', sortable: false, label: t('in-custom-dashboards:widgets.apdex.apdexList.thresholdColumn') },
      { id: 'edit', label: '', sortable: false, width: '1' },
      { id: 'delete', label: '', sortable: false, width: '1' }
    ]);
  });
});
