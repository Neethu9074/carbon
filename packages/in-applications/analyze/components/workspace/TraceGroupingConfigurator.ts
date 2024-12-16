/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error needs TS migration
import { createGroupingConfigurator } from 'in-components/GroupingConfigurator';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { TRACES } from 'in-applications/analyze/metrics';
import { TimeConfig } from 'in-types';

const { GroupingConfigurator } = createGroupingConfigurator({
  getTagCatalog: ({ timeConfig }: { timeConfig: TimeConfig }) =>
    getApplicationTagCatalog({ dataSource: TRACES, useCase: 'GROUPING' })({ timeConfig }),
  getSuggestions: () => {}
});

export default GroupingConfigurator;
