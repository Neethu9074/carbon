import React from 'react';

import {
  httpServiceExtrationConfigurationViewLink$,
  isHttpServiceExtrationConfigurationView$
} from 'in-stores/navigation/configuration';
import NavItems from 'in-views/configurationView/components/NavItems';
import NavItem from 'in-views/configurationView/components/NavItem';

export default function Navigation() {
  return (
    <nav>
      <NavItems>
        <NavItem title='Service Extraction'>
          <NavItem title='HTTP'
                   href$={httpServiceExtrationConfigurationViewLink$}
                   isActive$={isHttpServiceExtrationConfigurationView$}/>
        </NavItem>
      </NavItems>
    </nav>
  );
}
