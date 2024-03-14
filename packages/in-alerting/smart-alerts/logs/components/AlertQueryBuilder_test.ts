/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TagCatalog } from '@instana/types';

import { getQueryBuilder, getGroupByQueryBuilder } from 'in-alerting/smart-alerts/logs/components/AlertQueryBuilder';
import { getGroupByTagCatalog } from 'in-alerting/smart-alerts/utils/groupingUtils';
import data from 'in-alerting/smart-alerts/logs/data/alertConfigData.json';

describe('in-alerting/smart-alerts/logs/components/AlertQueryBuilder', () => {
  describe('getQueryBuilder', () => {
    it('should return a valid query builder', () => {
      const tagCatalog = getGroupByTagCatalog(data.tagCatalog as unknown as TagCatalog);
      const queryBuilder = getQueryBuilder(tagCatalog);
      expect(queryBuilder).toBeDefined();
    });
  });

  describe('getGroupByQueryBuilder', () => {
    it('should return a valid query builder', () => {
      const tagCatalog = getGroupByTagCatalog(data.tagCatalog as unknown as TagCatalog);
      const groupByQueryBuilder = getGroupByQueryBuilder(tagCatalog);
      expect(groupByQueryBuilder).toBeDefined();
    });

    it('should return a valid query builder', () => {
      //@ts-expect-error type error
      const groupByQueryBuilder = getGroupByQueryBuilder(undefined);
      expect(groupByQueryBuilder).toBeDefined();
    });
  });
});
