import React, { Fragment } from 'react';

import { applicationId as matrixApplicationId } from 'in-applications/navigation/matrix';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import getApplications from 'in-subscription/application/getApplications';
import getApplication from 'in-subscription/application/getApplication';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ApplicationViewBreadcrumbWithSwitcher.mless';

export default connectTo(
  props => ({
    application: getApplication({
      id: props.applicationId,
      filter: {
        application: props.applicationId,
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

    closeMenu = () => this.setState({ renderSubMenu: false });

    render() {
      const { application, applications, applicationId } = this.props;
      if (
        application.progress.loading ||
        application.errors.length > 0 ||
        (applications.progress.loading || applications.errors.length > 0)
      ) {
        return <Breadcrumb href$={getApplicationDashboard(applicationId)} label="Application" />;
      } else {
        return (
          <Fragment>
            <Breadcrumb
              href$={getApplicationDashboard(applicationId)}
              label={`Application (${applications.data.items.length})`}
            >
              {application.data.label}
              <span onClick={this.toggleSubMenu} className={locals.chevron}>
                <SvgIcon type="triangle_down" width={10} height={10} color={'#fff'} />
              </span>
            </Breadcrumb>

            {this.state.renderSubMenu && (
              <SubMenu
                applications={applications}
                applicationId={this.props.applicationId}
                serviceId={this.props.serviceId}
                endpointId={this.props.endpointId}
                viewPath={this.props.viewPath}
                closeMenu={this.closeMenu}
              />
            )}
          </Fragment>
        );
      }
    }
  }
);

function SubMenu({ applications, viewPath, closeMenu }) {
  return (
    <ul className={locals.submenu}>
      {applications.data.items.map(item => (
        <li className={locals.submenuItem} key={item.application.id}>
          <Link
            onClick={closeMenu}
            href$={getModifiedUrlStream(params =>
              setOrDeleteMatrixKey(params, viewPath, matrixApplicationId, item.application.id)
            )}
          >
            {item.application.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
