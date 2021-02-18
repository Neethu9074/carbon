/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createGroupingConfigurator } from 'in-new-components/GroupingConfigurator';
import { getTagCatalog } from 'in-mobile-apps/api/tagCatalog';
import { getSuggestions } from 'in-mobile-apps/queryBuilder';

export const sessionStart = create('sessionStart');
export const viewChange = create('viewChange');
export const httpRequest = create('httpRequest');
export const custom = create('custom');

function create(beaconType) {
  return createGroupingConfigurator({
    getTagCatalog: () => getTagCatalog({ beaconType, useCase: 'GROUPING' }),
    getSuggestions: args => getSuggestions({ ...args, beaconType })
  });
}
