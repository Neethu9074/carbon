import { combineLatest } from 'reactive-observables';
import React from 'react';

import {
  generalServiceExtractionConfigurationViewLink$,
  isGeneralServiceExtractionConfigurationView$,
  httpServiceExtractionConfigurationViewLink$,
  isHttpServiceExtractionConfigurationView$,
  batchServiceExtractionConfigurationViewLink$,
  isBatchServiceExtractionConfigurationView$,
  ejbServiceExtractionConfigurationViewLink$,
  isEjbServiceExtractionConfigurationView$,
  elasticsearchServiceExtractionConfigurationViewLink$,
  isElasticsearchServiceExtractionConfigurationView$,
  messageBrokerServiceExtractionConfigurationViewLink$,
  isMessageBrokerServiceExtractionConfigurationView$,
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
  rulesViewLink$,
  isRulesViewLink$,
  ruleBindingsViewLink$,
  isRuleBindingsViewLink$
} from 'in-stores/navigation/configuration';
import NavItems from 'in-views/configurationView/components/NavItems';
import NavItem from 'in-views/configurationView/components/NavItem';
import { objectivesEnabled } from 'in-services/featureFlags';
import { config } from 'in-services/config';
import { role } from 'in-stores/user';

import './Navigation.less';

const block = 'in-config-view-nav';

export default function Navigation() {
  return (
    <nav className={block}>
      <h2 className={`${block}__heading`}>User Settings</h2>
      <NavItems>
        <NavItem title="User Interface" href$={userInterfaceConfigViewLink$} isActive$={isUserInterfaceConfigView$} />
      </NavItems>

      <h2 className={`${block}__heading`}>Team Settings</h2>
      <NavItems>
        {role.canConfigureServiceMapping ? (
          <NavItem
            title="Service Mapper"
            isActive$={combine(
              isGeneralServiceExtractionConfigurationView$,
              isHttpServiceExtractionConfigurationView$,
              isEjbServiceExtractionConfigurationView$,
              isElasticsearchServiceExtractionConfigurationView$,
              isMessageBrokerServiceExtractionConfigurationView$
            )}
          >
            <NavItem
              title="General Rules"
              href$={generalServiceExtractionConfigurationViewLink$}
              isActive$={isGeneralServiceExtractionConfigurationView$}
              borderless
            />
            <NavItem
              title="HTTP Rules"
              href$={httpServiceExtractionConfigurationViewLink$}
              isActive$={isHttpServiceExtractionConfigurationView$}
              borderless
            />
            <NavItem
              title="Batch Rules"
              href$={batchServiceExtractionConfigurationViewLink$}
              isActive$={isBatchServiceExtractionConfigurationView$}
              borderless
            />
            <NavItem
              title="EJB Rules"
              href$={ejbServiceExtractionConfigurationViewLink$}
              isActive$={isEjbServiceExtractionConfigurationView$}
              borderless
            />
            <NavItem
              title="Elasticsearch Rules"
              href$={elasticsearchServiceExtractionConfigurationViewLink$}
              isActive$={isElasticsearchServiceExtractionConfigurationView$}
              borderless
            />
            <NavItem
              title="Message Broker Rules"
              href$={messageBrokerServiceExtractionConfigurationViewLink$}
              isActive$={isMessageBrokerServiceExtractionConfigurationView$}
              borderless
            />
          </NavItem>
        ) : null}

        {role.canConfigureEumApplications && config.tenant === 'edmunds' ? (
          <NavItem title="Website Monitoring" href$={eumKeysViewLink$} isActive$={isEumKeysView$} />
        ) : null}

        {role.canConfigureUsers || role.canConfigureRoles || role.canConfigureApiTokens ? (
          <NavItem
            title="Access Control"
            isActive$={combine(isUserManagementView$, isRolesConfigView$, isApiTokensView$)}
          >
            {role.canConfigureUsers ? (
              <NavItem title="Users" href$={userManagementViewLink$} isActive$={isUserManagementView$} borderless />
            ) : null}

            {role.canConfigureRoles ? (
              <NavItem title="Roles" href$={rolesConfigViewLink$} isActive$={isRolesConfigView$} borderless />
            ) : null}

            {role.canConfigureApiTokens ? (
              <NavItem title="API Tokens" href$={apiTokensViewLink$} isActive$={isApiTokensView$} borderless />
            ) : null}
          </NavItem>
        ) : null}

        {role.canConfigureCustomAlerts ? (
          <NavItem title="Knowledge Management" isActive$={combine(isRulesViewLink$, isRuleBindingsViewLink$)}>
            <NavItem title="Custom Rules" href$={rulesViewLink$} isActive$={isRulesViewLink$} />
            <NavItem title="Custom Issues" href$={ruleBindingsViewLink$} isActive$={isRuleBindingsViewLink$} />
          </NavItem>
        ) : null}

        {role.canViewAuditLog ? (
          <NavItem title="Audit Log" href$={auditLogViewLink$} isActive$={isAuditLogView$} />
        ) : null}

        {objectivesEnabled ? (
          <NavItem title="Objectives" href$={objectiveViewLink$} isActive$={isObjectivesView$} />
        ) : null}
      </NavItems>
    </nav>
  );
}

function combine() {
  var args = Array.from(arguments);
  // the observable should return true, if any of the given streams returns true
  return combineLatest(args).map(values => Boolean(values.reduce((a, b) => a | b, false)));
}
