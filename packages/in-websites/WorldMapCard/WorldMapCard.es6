import getWebsiteCountryBreakdown from 'in-subscription/websiteMonitoring/getWebsiteCountryBreakdown';
import WorldMapCardPresenter from 'in-websites/WorldMapCard/WorldMapCardPresenter';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ timeConfig, tagFilters }) => ({
  countryBreakdownResult: getWebsiteCountryBreakdown({
    timeConfig,
    tagFilters,
    pagination: {
      page: 1,
      pageSize: 200
    },
    order: {
      by: 'pageLoads',
      direction: 'DESC'
    }
  })
}))(WorldMapCardPresenter);
