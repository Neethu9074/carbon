import React from 'react';

import {
  httpServiceExtractionConfigurationViewLink$,
  isHttpServiceExtractionConfigurationView$,
  userInterfaceConfigViewLink$,
  isUserInterfaceConfigView$,
  eumKeysViewLink$,
  isEumKeysView$
} from 'in-stores/navigation/configuration';
import {newSettingsDialogEnabled, isEumEnabled} from 'in-services/featureFlags';
import NavItems from 'in-views/configurationView/components/NavItems';
import NavItem from 'in-views/configurationView/components/NavItem';

import './Navigation.less';

const block = 'in-config-view-nav';

export default function Navigation() {
  return (
    <nav className={block}>
      <h2 className={`${block}__heading`}>Configuration</h2>
      <NavItems>
        <NavItem title='Service Designer'>
          <NavItem title='HTTP Rules'
                   href$={httpServiceExtractionConfigurationViewLink$}
                   isActive$={isHttpServiceExtractionConfigurationView$}/>
        </NavItem>

        {isEumEnabled ?
          <NavItem title='End-User Monitoring'
                   href$={eumKeysViewLink$}
                   isActive$={isEumKeysView$}/>
        : null}

        {newSettingsDialogEnabled ?
          <NavItem title='User Interface'
                   href$={userInterfaceConfigViewLink$}
                   isActive$={isUserInterfaceConfigView$}/>
         : null}
      </NavItems>
    </nav>
  );
}
