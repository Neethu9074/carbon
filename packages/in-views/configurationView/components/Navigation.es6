import React from 'react';

import {
  generalServiceExtractionPath,
  httpServiceExtractionPath,
  batchServiceExtractionPath,
  ejbServiceExtractionPath,
  elasticsearchServiceExtractionPath,
  messageBrokerServiceExtractionPath,
  userInterfacePath,
  alertingConfigurationsPath,
  dynamicRulesPath,
  rolesConfigPath,
  usersPath,
  apiTokensPath,
  dynamicRulePath,
  builtInRulesPath,
  builtInRulePath,
  rulePath,
  rolesConfigsPath,
  bindingPath,
  alertingConfigurationPath,
  rulesPath,
  integrationsPath,
  bindingsPath,
  integrationPath,
  maintenanceConfigurationsPath,
  maintenanceConfigurationPath,
  auditlogPath
} from 'in-stores/navigation/paths/settingPaths';
import { forecastsEnabled, twoZeroModeEnabled } from 'in-services/featureFlags';
import NavItems from 'in-views/configurationView/components/NavItems';
import NavItem from 'in-views/configurationView/components/NavItem';
import { getView, isView } from 'in-stores/navigation/navigation';
import { builtInRulesEnabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';

import './Navigation.less';

const block = 'in-config-view-nav';

export default function Navigation() {
  return (
    <nav className={block}>
      <h2 className={`${block}__heading`}>User Settings</h2>
      <NavItems>
        <NavItem title="User Interface" href$={getView(userInterfacePath)} isActive$={isView(userInterfacePath)} />
      </NavItems>

      <h2 className={`${block}__heading`}>Team Settings</h2>
      <NavItems>
        {role.canConfigureServiceMapping && !twoZeroModeEnabled ? (
          <NavItem
            title="Service Mapper"
            isActive$={isView(
              generalServiceExtractionPath,
              httpServiceExtractionPath,
              batchServiceExtractionPath,
              ejbServiceExtractionPath,
              elasticsearchServiceExtractionPath,
              messageBrokerServiceExtractionPath
            )}
          >
            <NavItem
              title="General Rules"
              href$={getView(generalServiceExtractionPath)}
              isActive$={isView(generalServiceExtractionPath)}
              borderless
            />
            <NavItem
              title="HTTP Rules"
              href$={getView(httpServiceExtractionPath)}
              isActive$={isView(httpServiceExtractionPath)}
              borderless
            />
            <NavItem
              title="Batch Rules"
              href$={getView(batchServiceExtractionPath)}
              isActive$={isView(batchServiceExtractionPath)}
              borderless
            />
            <NavItem
              title="EJB Rules"
              href$={getView(ejbServiceExtractionPath)}
              isActive$={isView(ejbServiceExtractionPath)}
              borderless
            />
            <NavItem
              title="Elasticsearch Rules"
              href$={getView(elasticsearchServiceExtractionPath)}
              isActive$={isView(elasticsearchServiceExtractionPath)}
              borderless
            />
            <NavItem
              title="Message Broker Rules"
              href$={getView(messageBrokerServiceExtractionPath)}
              isActive$={isView(messageBrokerServiceExtractionPath)}
              borderless
            />
          </NavItem>
        ) : null}

        {role.canConfigureUsers || role.canConfigureRoles || role.canConfigureApiTokens ? (
          <NavItem
            title="Access Control"
            isActive$={isView(usersPath, rolesConfigsPath, rolesConfigPath, apiTokensPath)}
          >
            {role.canConfigureUsers ? (
              <NavItem title="Users" href$={getView(usersPath)} isActive$={isView(usersPath)} borderless />
            ) : null}

            {role.canConfigureRoles ? (
              <NavItem
                title="Roles"
                href$={getView(rolesConfigsPath)}
                isActive$={isView(rolesConfigsPath, rolesConfigPath)}
                borderless
              />
            ) : null}

            {role.canConfigureApiTokens ? (
              <NavItem title="API Tokens" href$={getView(apiTokensPath)} isActive$={isView(apiTokensPath)} borderless />
            ) : null}
          </NavItem>
        ) : null}

        {role.canConfigureCustomAlerts ? (
          <NavItem
            title="Knowledge Management"
            isActive$={isView(
              rulesPath,
              rulePath,
              bindingsPath,
              bindingPath,
              builtInRulesPath,
              builtInRulePath,
              dynamicRulesPath,
              dynamicRulePath
            )}
          >
            {builtInRulesEnabled ? (
              <NavItem
                title="Built-in Rules"
                href$={getView(builtInRulesPath)}
                isActive$={isView(builtInRulesPath, builtInRulePath)}
              />
            ) : null}
            <NavItem title="Custom Rules" href$={getView(rulesPath)} isActive$={isView(rulesPath, rulePath)} />
            <NavItem
              title="Custom Issues"
              href$={getView(bindingsPath)}
              isActive$={isView(bindingsPath, bindingPath)}
            />
            {forecastsEnabled && (
              <NavItem
                title="Custom Dynamic Rules"
                href$={getView(dynamicRulesPath)}
                isActive$={isView(dynamicRulesPath, dynamicRulePath)}
              />
            )}
          </NavItem>
        ) : null}

        {role.canConfigureIntegrations || role.canConfigureCustomAlerts ? (
          <NavItem
            title="Alerting"
            isActive$={isView(
              alertingConfigurationsPath,
              alertingConfigurationPath,
              integrationsPath,
              integrationPath,
              maintenanceConfigurationsPath,
              maintenanceConfigurationPath
            )}
          >
            {role.canConfigureCustomAlerts && (
              <NavItem
                title="Configurations"
                href$={getView(alertingConfigurationsPath)}
                isActive$={isView(alertingConfigurationsPath, alertingConfigurationPath)}
              />
            )}
            {role.canConfigureIntegrations && (
              <NavItem
                title="Integrations"
                href$={getView(integrationsPath)}
                isActive$={isView(integrationsPath, integrationPath)}
              />
            )}
            {role.canConfigureCustomAlerts && (
              <NavItem
                title="Maintenance Windows"
                href$={getView(maintenanceConfigurationsPath)}
                isActive$={isView(maintenanceConfigurationsPath, maintenanceConfigurationPath)}
              />
            )}
          </NavItem>
        ) : null}

        {role.canViewAuditLog ? (
          <NavItem title="Audit Log" href$={getView(auditlogPath)} isActive$={isView(auditlogPath)} />
        ) : null}
      </NavItems>
    </nav>
  );
}
