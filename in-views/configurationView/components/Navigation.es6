import React from 'react';

import {
  httpServiceExtractionConfigurationViewLink$,
  isHttpServiceExtractionConfigurationView$,
  ejbServiceExtractionConfigurationViewLink$,
  isEjbServiceExtractionConfigurationView$,
  userInterfaceConfigViewLink$,
  isUserInterfaceConfigView$,
  eumKeysViewLink$,
  isEumKeysView$
} from 'in-stores/navigation/configuration';
import NavItems from 'in-views/configurationView/components/NavItems';
import NavItem from 'in-views/configurationView/components/NavItem';

import './Navigation.less';

const block = 'in-config-view-nav';

export default function Navigation() {
  return (
    <nav className={block}>
      <h2 className={`${block}__heading`}>Settings</h2>
      <NavItems>
        <NavItem title='Service Mapper'>
          <NavItem title='HTTP Rules'
                   href$={httpServiceExtractionConfigurationViewLink$}
                   isActive$={isHttpServiceExtractionConfigurationView$}
                   borderless />

          <NavItem title='EJB Rules'
                   href$={ejbServiceExtractionConfigurationViewLink$}
                   isActive$={isEjbServiceExtractionConfigurationView$}
                   borderless />
        </NavItem>

        <NavItem title='End-User Monitoring'
                 href$={eumKeysViewLink$}
                 isActive$={isEumKeysView$} />

        <NavItem title='User Interface'
                 href$={userInterfaceConfigViewLink$}
                 isActive$={isUserInterfaceConfigView$} />
      </NavItems>
    </nav>
  );
}
