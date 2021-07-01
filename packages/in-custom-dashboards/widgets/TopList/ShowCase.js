/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { ListWidgetRenderer } from 'in-custom-dashboards/widgets/TopList/Widget';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from './ShowCase.mless';

export default function ShowCase() {
  const items = [];
  for (let i = 0; i < 5; i++) {
    items[i] = i;
  }
  return (
    <div className={locals.wrapper}>
      <ListWidgetRenderer
        title={t('in-custom-dashboards:widgets.topList.index.topListLb')}
        result={success(
          items.map(i => ({
            id: i,
            label: t('in-custom-dashboards:widgets.topList.index.topListItem', {
              itemNumber: i
            }),
            values: [[123, 70000 / (i + 1)]]
          }))
        )}
        config={{
          metricConfiguration: {
            tagFilters: [],
            grouping: [
              {
                by: {
                  groupbyTag: '',
                  groupbyTagEntity: '',
                  groupbyTagSecondLevelKey: ''
                },
                direction: 'DESC',
                maxResults: 5
              }
            ]
          }
        }}
      />
    </div>
  );
}
