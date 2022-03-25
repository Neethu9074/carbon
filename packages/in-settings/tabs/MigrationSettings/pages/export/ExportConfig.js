/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { getConfigData } from 'in-settings/tabs/MigrationSettings/api/exportConfig';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import AccordionConfigs from '../../components/AccordionConfigs';
import SectionLine from 'in-settings/components/SectionLine';
import ApiItemView from 'in-settings/components/ApiItemView';
import Section from 'in-settings/components/Section';
import Title from 'in-components/Title';
import { t, Trans } from 'in-i18n';

export default function ExportConfig() {
  // const [selectedConfigs, setSelectedConfigs] = useState([]);

  return <ApiItemView saveLabel={t('in-settings:tabs.migrationExport')} Content={Content} onSubmit={onSubmit} />;
}

function download(content, fileName, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function onSubmit(e, props) {
  e.preventDefault();
  saveItem(props);
}

function saveItem({ setMessage }) {
  setMessage({
    message: t('in-settings:tabs.exportingConfig'),
    type: 'neutral',
    isSaving: true
  });
  const configResult$ = getConfigData();
  configResult$.once(
    resp => {
      setMessage({
        text: t('in-settings:tabs.configSuccessfullyExported'),
        type: 'success'
      });
      download(JSON.stringify(resp), 'config-export.json', 'text/plain');
    },
    error =>
      setMessage({
        text: t('in-settings:tabs.failedToExportConfig', { err: error.message }),
        type: 'error'
      })
  );
  // }
}

function Content({ file, form, setCanSaveItem, enableImport, appConfigs }) {
  useEffect(
    // allow only saving when idP metadata has been uploaded
    () => setCanSaveItem(true),
    [file, form, setCanSaveItem, enableImport]
  );

  return (
    <>
      <Title title={t('in-settings:tabs.configExport')} />
      <SubViewHeader>{t('in-settings:tabs.configExport')}</SubViewHeader>
      <SectionLine />
      <h2>{t('in-settings:tabs.downloadTheConfigurationData')}</h2>
      <p>
        <Trans i18nKey="in-settings:tabs.configExportHelp" />
      </p>
      <Section>
        <AccordionConfigs appConfigs={appConfigs} label="Applications" id="appconfigs" icon="lib_application" checked />
        <AccordionConfigs appConfigs={appConfigs} label="Websites" id="websiteconfigs" icon="lib_website" />
        <AccordionConfigs appConfigs={appConfigs} label="Mobile Apps" id="mobileappconfigs" icon="lib_mobile_app" />
        <AccordionConfigs
          appConfigs={appConfigs}
          label="Alert Channels"
          id="alertchannelconfigs"
          icon="lib_alerts_alert"
        />
        <AccordionConfigs
          appConfigs={appConfigs}
          label="Custom Events"
          id="customeventconfigs"
          icon="lib_help_error_warning"
        />
        <AccordionConfigs
          appConfigs={appConfigs}
          label="Smart Alerts"
          id="smartalertconfigs"
          icon="lib_events_critical"
        />
        <AccordionConfigs appConfigs={appConfigs} label="Alerts" id="alertconfigs" icon="lib_alerts_alert" />
        <AccordionConfigs appConfigs={appConfigs} label="Groups" id="groupconfigs" icon="lib_group_by" />
      </Section>
    </>
  );
}
