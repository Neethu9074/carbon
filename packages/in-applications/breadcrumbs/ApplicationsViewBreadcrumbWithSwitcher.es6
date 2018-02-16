import React, { Fragment } from 'react';

import { getMatchingDashboard, getApplicationDashboard } from 'in-applications/navigation/paths';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import getApplications from 'in-subscription/application/getApplications';
import getApplication from 'in-subscription/application/getApplication';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './Breadcrumps.mless';

export default connectTo(
  props => ({
    application: getApplication({
      id: props.applicationId,
      filter: {
        application: props.applicationId,
        service: props.serviceId,
        endpoint: props.endpointId,
        timeframe: props.timeframe
      }
    }),
    applications: getApplications({
      pagination: {
        page: 1,
        pageSize: 5
      },
      order: {
        by: 'label',
        direction: 'ASC'
      },
      metrics: {},
      filter: {
        timeframe: props.timeframe
      }
    })
  }),
  class ApplicationListViewBreadcrumb extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        renderSubMenu: false
      };
    }

    toggleSubMenu = e => {
      e.preventDefault();
      this.setState({
        renderSubMenu: !this.state.renderSubMenu
      });
    };

    render() {
      const { application, applications, applicationId } = this.props;
      if (
        application.progress.loading ||
        application.errors.length > 0 ||
        (applications.progress.loading || applications.errors.length > 0)
      ) {
        return <Breadcrumb href$={getApplicationDashboard(applicationId)}>Applications</Breadcrumb>;
      } else {
        return (
          <Fragment>
            <Breadcrumb href$={getApplicationDashboard(applicationId)}>
              <div className={locals.breadcrumb}>
                <div className={locals.label}>{`Applications (${applications.data.items.length})`} </div>
                <div className={locals.entityLabel}>
                  {application.data.label}
                  <span onClick={this.toggleSubMenu}>
                    <SvgIcon type="triangle_down" width={10} height={10} color={'#fff'} />
                  </span>
                </div>
              </div>
            </Breadcrumb>

            {this.state.renderSubMenu && (
              <SubMenu
                applications={applications}
                location={this.props.location}
                applicationId={this.props.applicationId}
                serviceId={this.props.serviceId}
                endpointId={this.props.endpointId}
              />
            )}
          </Fragment>
        );
      }
    }
  }
);

function SubMenu({ applications, location, serviceId, endpointId }) {
  return (
    <ul className={locals.submenu}>
      {applications.data.items.map(item => {
        return (
          <li className={locals.submenuItem} key={item.application.id}>
            <Link href$={getMatchingDashboard(location, { applicationId: item.application.id, serviceId, endpointId })}>
              {item.application.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
