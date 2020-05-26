import DeprecationsPresenter, {
  presenterMapping
} from 'in-websites/WebsiteDashboard/components/Deprecations/DeprecationsPresenter';
import getWebsiteDeprecations from 'in-websites/subscriptions/getWebsiteDeprecations';
import connect from 'in-hoc/connectTo';

const doAnyDeprecationsCurrentlyExist = Object.keys(presenterMapping).length > 0;

export default connect(({ tagFilters }) => ({
  result:
    doAnyDeprecationsCurrentlyExist &&
    getWebsiteDeprecations({
      timeConfig: {
        windowSize: 1000 * 60 * 60 * 12,
        to: null,
        focusedMoment: null,
        autoRefresh: false
      },
      tagFilters
    })
}))(DeprecationsPresenter);
