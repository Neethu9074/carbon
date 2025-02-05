/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { AvailablePlugins, GetAvailablePluginsQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { hiddenPlugins } from 'in-forge/constants';
import { mapData } from 'in-services/util/result';

export default createResultSubscriptionFactory<GetAvailablePluginsQuery, Result<AvailablePlugins>>({
  eventId: 'infrastructure.getAvailablePlugins',
  mapResult: filterOutHiddenPlugins
});

function filterOutHiddenPlugins(result: Result<AvailablePlugins>): Result<AvailablePlugins> {
  return mapData(result, data => ({
    plugins: data.plugins?.filter(item => !hiddenPlugins.includes(item))
  }));
}
