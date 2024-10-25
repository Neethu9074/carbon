/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from 'in-i18n';

const config = {
  name: 'download',
  icon: 'lib_actions_download',
  label: t('in-components:chart.chartDownloadPDFLabel'),
  onClick: download
};

interface Props {
  widgetId: string;
  setExportWidgetId: (id: string) => void;
}

export default config;

async function download({ widgetId, setExportWidgetId }: Props) {
  setExportWidgetId(widgetId);
}
