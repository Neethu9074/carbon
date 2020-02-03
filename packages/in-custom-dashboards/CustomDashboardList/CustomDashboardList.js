import CustomDashboardListPresenter from 'in-custom-dashboards/CustomDashboardList/CustomDashboardListPresenter';
import { getCustomDashboards } from 'in-custom-dashboards/api';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  () => ({
    customDashboards: getCustomDashboards()
  }),
  CustomDashboardListPresenter
);
