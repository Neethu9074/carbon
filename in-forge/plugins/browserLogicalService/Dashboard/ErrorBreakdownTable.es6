import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';
import { getErrorBreakdownForWebsite } from 'in-services/api/eumErrors';
import { combineDataAndError } from 'in-services/util/ro';
import connectTo from 'in-hoc/connectTo';
import { createLogger } from 'instalog';

const logger = createLogger('browserLogicalService/ErrorBreakdownTable');

export default connectTo(
  props => {
    return {
      result: combineDataAndError(
        getErrorBreakdownForWebsite({
          websiteSnapshotId: props.snapshotId,
          timeframe: props.timeframe,
          errorHash: props.errorHash
        })
      )
    };
  },
  function ErrorBreakdownTable({ result }) {
    if (!result) {
      return null;
    }

    if (result.error) {
      logger.warn('Failed to retrieve EUM error breakdown', result.error);
      return (
        <DashboardNotification type="danger">
          <strong>Failed to retrieve EUM error breakdown.</strong> Please refresh the page or contact customer{' '}
          support should this issue persist.
        </DashboardNotification>
      );
    }

    return (
      <div>
        ERROR!
      </div>
    );
  }
);
