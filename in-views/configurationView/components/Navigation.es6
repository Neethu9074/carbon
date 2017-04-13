import React from 'react';

import {
  httpServiceExtractionConfigurationViewLink$,
  isHttpServiceExtractionConfigurationView$,
  ejbServiceExtractionConfigurationViewLink$,
  isEjbServiceExtractionConfigurationView$,
  elasticsearchServiceExtractionConfigurationViewLink$,
  isElasticsearchServiceExtractionConfigurationView$,
  jmsServiceExtractionConfigurationViewLink$,
  isJmsServiceExtractionConfigurationView$,
  userInterfaceConfigViewLink$,
  isUserInterfaceConfigView$,
  eumKeysViewLink$,
  isEumKeysView$,
  rolesConfigViewLink$,
  isRolesConfigView$,
  userManagementViewLink$,
  isUserManagementView$,
  apiTokensViewLink$,
  isApiTokensView$,
  auditLogViewLink$,
  isAuditLogView$,
  objectiveViewLink$,
  isObjectivesView$,
  ruleViewLink$,
  isRuleViewLink$,
  ruleBindingViewLink$,
  isRuleBindingViewLink$
} from 'in-stores/navigation/configuration';
import NavItems from 'in-views/configurationView/components/NavItems';
import NavItem from 'in-views/configurationView/components/NavItem';
import {objectivesEnabled} from 'in-services/featureFlags';
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
            <NavItem title='JMS Rules'
                     href$={jmsServiceExtractionConfigurationViewLink$}
                     isActive$={isJmsServiceExtractionConfigurationView$}
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

        {role.canConfigureUsers || role.canConfigureRoles ?
          <NavItem title='Access Control'>
            {role.canConfigureUsers ?
              <NavItem title='Users'
                       href$={userManagementViewLink$}
                       isActive$={isUserManagementView$}
                       borderless />
            : null}

            {role.canConfigureRoles ?
              <NavItem title='Roles'
                       href$={rolesConfigViewLink$}
                       isActive$={isRolesConfigView$}
                       borderless />
            : null}

            {role.canConfigureApiTokens ?
              <NavItem title='API Tokens'
                       href$={apiTokensViewLink$}
                       isActive$={isApiTokensView$}
                       borderless />
            : null}
          </NavItem>
        : null}

        {role.canConfigureCustomAlerts ?
          <NavItem title='Knowledge Management'>
            <NavItem title='Custom Rules'
                     href$={ruleViewLink$}
                     isActive$={isRuleViewLink$} />
            <NavItem title='Custom Issues'
                     href$={ruleBindingViewLink$}
                     isActive$={isRuleBindingViewLink$} />
          </NavItem>
        : null}

        {role.canViewAuditLog ?
          <NavItem title='Audit Log'
                   href$={auditLogViewLink$}
                   isActive$={isAuditLogView$} />
        : null}

        {objectivesEnabled ?
          <NavItem title='Objectives'
                   href$={objectiveViewLink$}
                   isActive$={isObjectivesView$} />
        : null}
      </NavItems>
    </nav>
  );
}
