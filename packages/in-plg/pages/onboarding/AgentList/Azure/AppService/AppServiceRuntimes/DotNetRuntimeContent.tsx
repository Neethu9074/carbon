/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Stack, Typography, KeyValue } from '@instana/components';

import { FormInputPlg, DropDown } from 'in-plg/pages/onboarding/content/ContentComponents';
import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import { Wrapper } from 'in-plg/pages/onboarding/Layout/Layout';
import Code from 'in-plg/components/Code/Code';
import { Trans, t } from 'in-i18n';

export default function DotNetRuntimeContent({ agentKey, serverlessEndpoint }: Readonly<OnboardingProps>): JSX.Element {
  const [appName, setAppName] = useState('my-azure-app');
  const [resourceGroup, setResourceGroup] = useState('my-resource-group');
  const [enableTracing, setEnableTracing] = useState('1');
  const [enable64Bit, setEnable64Bit] = useState('0');
  const [logLevel, setLogLevel] = useState('DEBUG');

  const tracingOptions = [
    { key: '1', label: 'True' },
    { key: '0', label: 'False' }
  ];
  const bitnessOptions = [
    { key: '1', label: 'True' },
    { key: '0', label: 'False' }
  ];
  const logLevelOptions = [
    { key: 'NONE', label: 'NONE' },
    { key: 'DEBUG', label: 'DEBUG' },
    { key: 'WARN', label: 'WARN' },
    { key: 'INFO', label: 'INFO' },
    { key: 'ERROR', label: 'ERROR' }
  ];

  // Generate XML content dynamically
  const generateXmlConfig = () =>
    `
    <?xml version="1.0" encoding="utf-8"?>
    <configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
      <system.webServer>
        <runtime xdt:Transform="InsertIfMissing">
          <environmentVariables xdt:Transform="InsertIfMissing">
            <add name="COR_PROFILER" value="{FA8F1DFF-0B62-4F84-887F-ECAC69A65DD3}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
            <add name="COR_ENABLE_PROFILING" value="${enableTracing}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
            <add name="COR_PROFILER_PATH" value="C:\\home\\SiteExtensions\\Instana.Tracing.AppService\\Instana.Profiler_x86.dll" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />

            <add name="CORECLR_PROFILER" value="{FA8F1DFF-0B62-4F84-887F-ECAC69A65DD3}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
            <add name="CORECLR_ENABLE_PROFILING" value="${enableTracing}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
            <add name="CORECLR_PROFILER_PATH" value="C:\\home\\SiteExtensions\\Instana.Tracing.AppService\\CoreRewriter_x86.dll" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
            <add name="DOTNET_STARTUP_HOOKS" value="C:\\home\\SiteExtensions\\Instana.Tracing.AppService\\Instana.Tracing.Core.dll" xdt:Locator="Match(name)" xdt:Transform="Replace" />

            <add name="COR_PROFILER_IS_64" value="${enable64Bit}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
            <add name="CORECLR_PROFILER_IS_64" value="${enable64Bit}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />

            <add name="INSTANA_ENDPOINT_URL" value="${serverlessEndpoint}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
            <add name="INSTANA_AGENT_KEY" value="${agentKey}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />

            <add name="INSTANA_DOTNET_FF_CONFIG" value="C:\\home\\SiteExtensions\\Instana.Tracing.AppService\\instrumentation.json" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
            <add name="INSTANA_DOTNET_CORE_CONFIG" value="C:\\home\\SiteExtensions\\Instana.Tracing.AppService\\instrumentation.jsoncore" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />

            <add name="INSTANA_DOTNET_LOGLEVEL" value="${logLevel}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
          </environmentVariables>
        </runtime>
      </system.webServer>
    </configuration>
      `.trim();

  const handleDownload = () => {
    const xmlContent = generateXmlConfig();
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ApplicationHost.xdt';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Wrapper>
      <LayoutSection
        title={t('in-plg:agentDetails.common.step2') + t('in-plg:agentDetails.azure.dotnet.activatingAppService')}
      >
        <Stack>
          <Stack direction="horizontal">
            <KeyValue
              label={t('in-plg:agentDetails.azure.dotnet.appName')}
              value={<FormInputPlg value={appName} onChange={setAppName} />}
              withGap
            />
            <KeyValue
              label={t('in-plg:agentDetails.azure.dotnet.resourceGroupName')}
              value={<FormInputPlg value={resourceGroup} onChange={setResourceGroup} />}
              withGap
            />
          </Stack>

          <Code
            lang="bash"
            code={[
              `az resource create \\`,
              `  --name ${appName} \\`,
              `  --resource-group ${resourceGroup} \\`,
              `  --resource-type "Microsoft.Web/sites/siteextensions" \\`,
              `  --properties "{}"`
            ]}
          />
        </Stack>
      </LayoutSection>
      <LayoutSection
        title={t('in-plg:agentDetails.common.step3') + t('in-plg:agentDetails.azure.dotnet.configureOptionsForTracing')}
      >
        <Stack>
          <Stack direction="horizontal">
            <KeyValue
              label="Enable Tracing"
              value={<DropDown value={enableTracing} options={tracingOptions} onChange={setEnableTracing} />}
              withGap
            />
            <KeyValue
              label="Enable 64 Bit"
              value={<DropDown value={enable64Bit} options={bitnessOptions} onChange={setEnable64Bit} />}
              withGap
            />
            <KeyValue
              label="Log Level"
              value={<DropDown value={logLevel} options={logLevelOptions} onChange={setLogLevel} />}
              withGap
            />
          </Stack>

          <Stack direction="horizontal">
            <InputWithButton type="download" displayContent="ApplicationHost.xdt" callBack={handleDownload} />
          </Stack>

          <Typography variant="body-regular">
            <Trans i18nKey={'in-plg:agentDetails.azure.dotnet.activatingAppServiceNote'} />
          </Typography>

          <Code
            lang="bash"
            code={[
              `<?xml version="1.0" encoding="utf-8"?>
<configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
  <system.webServer>
    <runtime xdt:Transform="InsertIfMissing">
      <environmentVariables xdt:Transform="InsertIfMissing">
        <add name="COR_PROFILER" value="{FA8F1DFF-0B62-4F84-887F-ECAC69A65DD3}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
        <add name="COR_ENABLE_PROFILING" value="${enableTracing}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
        <add name="COR_PROFILER_PATH" value="C:\\home\\SiteExtensions\\Instana.Tracing.AppService\\Instana.Profiler_x86.dll" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />

        <add name="CORECLR_PROFILER" value="{FA8F1DFF-0B62-4F84-887F-ECAC69A65DD3}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
        <add name="CORECLR_ENABLE_PROFILING" value="${enableTracing}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
        <add name="CORECLR_PROFILER_PATH" value="C:\\home\\SiteExtensions\\Instana.Tracing.AppService\\CoreRewriter_x86.dll" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
        <add name="DOTNET_STARTUP_HOOKS" value="C:\\home\\SiteExtensions\\Instana.Tracing.AppService\\Instana.Tracing.Core.dll" xdt:Locator="Match(name)" xdt:Transform="Replace" />

        <add name="COR_PROFILER_IS_64" value="${enable64Bit}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
        <add name="CORECLR_PROFILER_IS_64" value="${enable64Bit}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />

        <add name="INSTANA_ENDPOINT_URL" value="${serverlessEndpoint}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
        <add name="INSTANA_AGENT_KEY" value="${agentKey}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />

        <add name="INSTANA_DOTNET_FF_CONFIG" value="C:\\home\\SiteExtensions\\Instana.Tracing.AppService\\instrumentation.json" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
        <add name="INSTANA_DOTNET_CORE_CONFIG" value="C:\\home\\SiteExtensions\\Instana.Tracing.AppService\\instrumentation.jsoncore" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />

        <add name="INSTANA_DOTNET_LOGLEVEL" value="${logLevel}" xdt:Locator="Match(name)" xdt:Transform="InsertIfMissing" />
      </environmentVariables>
    </runtime>
  </system.webServer>
</configuration>`
            ]}
          />
        </Stack>
      </LayoutSection>

      <LayoutSection
        title={t('in-plg:agentDetails.common.step4') + t('in-plg:agentDetails.azure.dotnet.uploadConfigFile')}
      >
        <Stack>
          <Typography variant="body-regular">
            <Trans i18nKey={'in-plg:agentDetails.azure.dotnet.ftpsAuthCredsNote'} />
          </Typography>

          <Code
            lang="bash"
            code={[
              `curl -v --ssl-reqd \\`,
              `  -u "{FTPS Username}:{password}" \\`,
              `  --resource-group ${resourceGroup} \\`,
              `  -T "path to file ApplicationHost.xdt" \\`,
              `  "{FTPS endpoint}"`
            ]}
          />
        </Stack>
      </LayoutSection>

      <LayoutSection
        title={t('in-plg:agentDetails.common.step5') + t('in-plg:agentDetails.azure.dotnet.restartAppServiceNote')}
      >
        <Stack>
          <Code
            lang="bash"
            code={[`az webapp restart \\`, `  --name ${appName} \\`, `  --resource-group ${resourceGroup} \\`]}
          />
        </Stack>
      </LayoutSection>
    </Wrapper>
  );
}
