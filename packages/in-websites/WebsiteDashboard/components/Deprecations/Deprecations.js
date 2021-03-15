/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import DeprecationsPresenter, {
  presenterMapping
} from 'in-websites/WebsiteDashboard/components/Deprecations/DeprecationsPresenter';
import getWebsiteDeprecations from 'in-websites/subscriptions/getWebsiteDeprecations';
import { hours } from 'in-services/time';
import connect from 'in-hoc/connectTo';

const doAnyDeprecationsCurrentlyExist = Object.keys(presenterMapping).length > 0;

export default connect(({ tagFilters }) => ({
  result:
    doAnyDeprecationsCurrentlyExist &&
    getWebsiteDeprecations({
      timeConfig: {
        windowSize: hours.toMillis(12),
        to: null,
        focusedMoment: null,
        autoRefresh: false
      },
      tagFilters
    })
}))(DeprecationsPresenter);
