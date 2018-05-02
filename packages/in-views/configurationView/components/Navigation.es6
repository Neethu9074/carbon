import { combineLatest } from 'reactive-observables';
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
  rulePath,
  rolesConfigsPath,
  bindingPath,
  alertingConfigurationPath,
  rulesPath,
  integrationsPath,
  bindingsPath,
  integrationPath,
  auditlogPath
} from 'in-stores/navigation/paths/settingPaths';
import { forecastsEnabled, twoZeroModeEnabled } from 'in-services/featureFlags';
import NavItems from 'in-views/configurationView/components/NavItems';
import NavItem from 'in-views/configurationView/components/NavItem';
import { getView, isView } from 'in-stores/navigation/navigation';
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
            isActive$={combine(
              isView(generalServiceExtractionPath),
              isView(httpServiceExtractionPath),
              isView(ejbServiceExtractionPath),
              isView(elasticsearchServiceExtractionPath),
              isView(messageBrokerServiceExtractionPath)
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
            isActive$={combine(isView(usersPath), isView(rolesConfigPath), isView(apiTokensPath))}
          >
            {role.canConfigureUsers ? (
              <NavItem title="Users" href$={getView(usersPath)} isActive$={isView(usersPath)} borderless />
            ) : null}

            {role.canConfigureRoles ? (
              <NavItem title="Roles" href$={getView(rolesConfigsPath)} isActive$={isView(rolesConfigPath)} borderless />
            ) : null}

            {role.canConfigureApiTokens ? (
              <NavItem title="API Tokens" href$={getView(apiTokensPath)} isActive$={isView(apiTokensPath)} borderless />
            ) : null}
          </NavItem>
        ) : null}

        {role.canConfigureCustomAlerts && !twoZeroModeEnabled ? (
          <NavItem title="Knowledge Management" isActive$={combine(isView(rulePath), isView(bindingPath))}>
            <NavItem title="Custom Rules" href$={getView(rulesPath)} isActive$={isView(rulePath)} />
            <NavItem title="Custom Issues" href$={getView(bindingsPath)} isActive$={isView(bindingPath)} />
            {forecastsEnabled ? (
              <NavItem
                title="Custom Dynamic Rules"
                href$={getView(dynamicRulesPath)}
                isActive$={isView(dynamicRulePath)}
              />
            ) : null}
          </NavItem>
        ) : null}

        {!twoZeroModeEnabled ? (
          <NavItem title="Alerting" isActive$={combine(isView(alertingConfigurationPath), isView(integrationPath))}>
            <NavItem
              title="Configurations"
              href$={getView(alertingConfigurationsPath)}
              isActive$={isView(alertingConfigurationPath)}
            />
            <NavItem title="Integrations" href$={getView(integrationsPath)} isActive$={isView(integrationPath)} />
          </NavItem>
        ) : null}

        {role.canViewAuditLog ? (
          <NavItem title="Audit Log" href$={getView(auditlogPath)} isActive$={isView(auditlogPath)} />
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
