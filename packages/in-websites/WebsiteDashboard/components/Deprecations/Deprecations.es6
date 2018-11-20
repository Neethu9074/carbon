import getWebsiteDeprecations from 'in-subscription/websiteMonitoring/getWebsiteDeprecations';
import connect from 'in-hoc/connectTo';

export default connect(({ tagFilters, timeConfig }) => ({
  deprecations: getWebsiteDeprecations({
    timeConfig,
    tagFilters
  })
}))();
