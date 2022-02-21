/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import StickySidebarNavigationAndContent from 'in-components/layout/SideNavigationAndContent/StickySidebarNavigationAndContent';
import { migSettings, migExportSettings, migImportSettings } from 'in-settings/navigation/paths';
import ExportConfig from 'in-settings/tabs/MigrationSettings/pages/export/ExportConfig';
import ImportConfig from 'in-settings/tabs/MigrationSettings/pages/import/ImportConfig';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import { t } from 'in-i18n';

export default function View(props) {
  return (
    <StickySidebarNavigationAndContent
      navigationTree={[
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
      ]}
      redirectToDefaultPage={migExportSettings}
      redirectFrom={migSettings}
      NotFoundPage={NotFoundPage}
      {...props}
    />
  );
}
