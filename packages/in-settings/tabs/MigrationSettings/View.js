/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import StickySidebarNavigationAndContent from 'in-components/layout/SideNavigationAndContent/StickySidebarNavigationAndContent';
import { migSettings, migExportSettings, migImportSettings } from 'in-settings/navigation/paths';
import ExportConfig from 'in-settings/tabs/MigrationSettings/pages/export/ExportConfig';
import ImportConfig from 'in-settings/tabs/MigrationSettings/pages/import/ImportConfig';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import SetBodyColor from 'in-components/SetBodyColor';
import { t } from 'in-i18n';

const navigationTree = [
  {
    title: t('in-settings:tabs.migrationExport'),
    pages: [
      {
        path: migExportSettings,
        label: t('in-settings:tabs.configExport'),
        component: ExportConfig
      }
    ]
  },
  {
    title: t('in-settings:tabs.migrationImport'),
    pages: [
      {
        path: migImportSettings,
        label: t('in-settings:tabs.configImport'),
        component: ImportConfig
      }
    ]
  }
];

export default function View(props) {
  return (
    <Fragment>
      <ViewTrackingMeta
        data={{
          productArea: 'Settings',
          pageRootName: 'Migration'
        }}
      />

      <StickySidebarNavigationAndContent
        navigationTree={navigationTree}
        redirectToDefaultPage={migExportSettings}
        redirectFrom={migSettings}
        NotFoundPage={NotFoundPage}
        {...props}
      />
      <SetBodyColor color="#fff" />
    </Fragment>
  );
}
