import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { applicationsList, servicesList } from 'in-applications/navigation/paths';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ViewSwitcher.mless';

export default connectTo(
  {
    isServiceViewActive: isView(servicesList)
  },
  function AppViewSwitcher({ isServiceViewActive }) {
    return (
      <div className={locals.viewSwitcher}>
        <MaxWidthFullscreenContainer>
          <div className={locals.tabList}>
            <Link className={locals.link} href$={getModifiedUrlStream(p => (p.pathname = applicationsList))}>
              <div
                className={evaluateClassNames({
                  [locals.tab]: true,
                  [locals.tabSelected]: !isServiceViewActive
                })}
              >
                <SvgIcon className={locals.icon} type="lib_application" width={24} height={24} />
                Applications
              </div>
            </Link>
            <Link className={locals.link} href$={getModifiedUrlStream(p => (p.pathname = servicesList))}>
              <div
                className={evaluateClassNames({
                  [locals.tab]: true,
                  [locals.tabSelected]: isServiceViewActive
                })}
              >
                <SvgIcon className={locals.icon} type="lib_application_service" width={24} height={24} />
                Services
              </div>
            </Link>
          </div>
        </MaxWidthFullscreenContainer>
      </div>
    );
  }
);
