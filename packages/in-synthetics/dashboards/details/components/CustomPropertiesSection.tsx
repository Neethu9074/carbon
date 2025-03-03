/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';
import React from 'react';

import { CarbonColumn as Column, CarbonGrid as Grid, Card, CarbonStack as Stack } from '@instana/components';
import { PaginatedResult, Result, TestResultListItem } from '@instana/types';
import { generateUniqueShortId } from '@instana/utils';

import { getSyntheticTagLabels, getSyntheticCustomMetricLabels } from 'in-synthetics/dashboards/details/utils';
import { t } from 'in-i18n';

interface Props {
  resultList: Result<PaginatedResult<TestResultListItem>>;
  testType: string;
}

export const CustomPropertiesSection = ({ resultList, testType }: Props) => {
  let customPropertiesCombined: Record<string, any> = {};
  const syntheticTagLabels = getSyntheticTagLabels(resultList);
  const customMetricLabels = getSyntheticCustomMetricLabels(resultList, testType);

  /**
   * Groups synthetic tags and custom metrics from the resultList into groups of a specified size.
   * @param size - The size of each group of key-value pairs to be returned.
   * @returns An array of groups, where each group is an array of key-value pairs, with each group containing up to `size` elements.
   */
  const groupCustomProperties = (size: number) => {
    syntheticTagLabels.map(tag => {
      customPropertiesCombined[tag] = resultList.data?.items[0]?.testResultCommonProperties.customTags?.[tag];
    });
    customMetricLabels.map(metric => {
      customPropertiesCombined[metric.replace(/^synthetic\.customMetrics\./, '')] = get(
        resultList.data?.items[0],
        ['metrics', metric, 0, 1],
        ''
      );
    });
    const combinedEntries = Object.entries(customPropertiesCombined);

    return combinedEntries.reduce((groups: [string, any][][], _, i) => {
      if (i % size === 0) groups.push(combinedEntries.slice(i, i + size));
      return groups;
    }, []);
  };

  return (
    <Card title={t('in-synthetics:dashboard.detailsPage.customProperties.title')}>
      <Stack gap={6}>
        {groupCustomProperties(3).map(property => (
          <Grid key={generateUniqueShortId()}>
            {property.map(([label, value]) => (
              <Column lg={5} key={label}>
                <Grid>
                  <Column lg={2}>{`${label} :`}</Column>
                  <Column lg={3}>{value}</Column>
                </Grid>
              </Column>
            ))}
          </Grid>
        ))}
      </Stack>
    </Card>
  );
};
