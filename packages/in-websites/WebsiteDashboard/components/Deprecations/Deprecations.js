import DeprecationsPresenter from 'in-websites/WebsiteDashboard/components/Deprecations/DeprecationsPresenter';
import getWebsiteDeprecations from 'in-subscription/websiteMonitoring/getWebsiteDeprecations';
import connect from 'in-hoc/connectTo';

export default connect(({ tagFilters }) => ({
  result: getWebsiteDeprecations({
    timeConfig: {
      windowSize: 1000 * 60 * 60 * 12,
      to: null,
      focusedMoment: null,
      autoRefresh: false
    },
    tagFilters
  })
}))(DeprecationsPresenter);
