import React from 'react';

import {
  httpServiceExtractionConfigurationViewLink$,
  isHttpServiceExtractionConfigurationView$,
  ejbServiceExtractionConfigurationViewLink$,
  isEjbServiceExtractionConfigurationView$,
  elasticsearchServiceExtractionConfigurationViewLink$,
  isElasticsearchServiceExtractionConfigurationView$,
  userInterfaceConfigViewLink$,
  isUserInterfaceConfigView$,
  eumKeysViewLink$,
  isEumKeysView$
} from 'in-stores/navigation/configuration';
import NavItems from 'in-views/configurationView/components/NavItems';
import NavItem from 'in-views/configurationView/components/NavItem';
import {role} from 'in-stores/user';

import './Navigation.less';

const block = 'in-config-view-nav';

export default function Navigation() {
  return (
    <nav className={block}>
      <h2 className={`${block}__heading`}>Settings</h2>
      <NavItems>
        {role.canConfigureServiceMapping ?
          <NavItem title='Service Mapper'>
            <NavItem title='HTTP Rules'
                     href$={httpServiceExtractionConfigurationViewLink$}
                     isActive$={isHttpServiceExtractionConfigurationView$}
                     borderless />

            <NavItem title='EJB Rules'
                     href$={ejbServiceExtractionConfigurationViewLink$}
                     isActive$={isEjbServiceExtractionConfigurationView$}
                     borderless />
            <NavItem title='Elasticsearch Rules'
                     href$={elasticsearchServiceExtractionConfigurationViewLink$}
                     isActive$={isElasticsearchServiceExtractionConfigurationView$}
                     borderless />
          </NavItem>
        : null}

        {role.canConfigureEumApplications ?
          <NavItem title='End-User Monitoring'
                   href$={eumKeysViewLink$}
                   isActive$={isEumKeysView$} />
        : null}

        <NavItem title='User Interface'
                 href$={userInterfaceConfigViewLink$}
                 isActive$={isUserInterfaceConfigView$} />
      </NavItems>
    </nav>
  );
}
