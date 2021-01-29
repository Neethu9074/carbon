/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createGroupingConfigurator } from 'in-new-components/GroupingConfigurator';
import { getTagCatalog } from 'in-websites/api/tagCatalog';
import { getSuggestions } from 'in-websites/queryBuilder';

export const pageLoad = create('pageLoad');
export const pageChange = create('pageChange');
export const resourceLoad = create('resourceLoad');
export const httpRequest = create('httpRequest');
export const error = create('error');
export const custom = create('custom');

function create(beaconType) {
  return createGroupingConfigurator({
    getTagCatalog: () => getTagCatalog({ beaconType, useCase: 'GROUPING' }),
    getSuggestions: args => getSuggestions({ ...args, beaconType })
  });
}
