import React from 'react';

import {
  httpServiceExtractionConfigurationViewLink$,
  isHttpServiceExtractionConfigurationView$,
  userInterfaceConfigViewLink$,
  isUserInterfaceConfigView$
} from 'in-stores/navigation/configuration';
import NavItems from 'in-views/configurationView/components/NavItems';
import NavItem from 'in-views/configurationView/components/NavItem';
import {newSettingsDialogEnabled} from 'in-services/featureFlags';

import './Navigation.less';

const block = 'in-config-view-nav';

export default function Navigation() {
  return (
    <nav className={block}>
      <h2 className={`${block}__heading`}>Configuration</h2>
      <NavItems>
        <NavItem title='Service Extraction'>
          <NavItem title='HTTP'
                   href$={httpServiceExtractionConfigurationViewLink$}
                   isActive$={isHttpServiceExtractionConfigurationView$}/>
        </NavItem>

        {newSettingsDialogEnabled ?
          <NavItem title='User Interface'
                   href$={userInterfaceConfigViewLink$}
                   isActive$={isUserInterfaceConfigView$}/>
         : null}
      </NavItems>
    </nav>
  );
}
