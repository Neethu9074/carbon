/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { withProps } from 'recompose';

import getMobileAppBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppBeaconGroups';
import EditGroupDialog from 'in-analyze/components/EditGroupDialog/EditGroupDialog';
import { t } from 'in-i18n';

export default withProps({
  help: t('in-mobile-apps:analyzeView.editGroupDialog.help'),
  getKeySuggestions: ({ timeConfig, tagFilters, tag, key }) => {
    return getMobileAppBeaconGroups({
      timeConfig: timeConfig,
      tagFilters: tagFilters,
      metrics: {
        beaconCount: {
          metric: 'beaconCount',
          aggregation: 'SUM'
        }
      },
      order: {
        by: 'beaconCount',
        direction: 'DESC'
      },
      pagination: {
        retrievalSize: 200
      },
      group: {
        groupbyTag: tag,
        groupbyTagSecondLevelKey: key
      }
    }).map(mapData);
  }
})(EditGroupDialog);

function mapData(result) {
  if (!result.data) {
    return result;
  }

  return {
    progress: result.progress,
    errors: result.errors,
    time: result.time,
    data: result.data.items.map(item => JSON.parse(item.name))
  };
}
