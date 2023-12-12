/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import oldTheme from 'in-themes';
import { t } from 'in-i18n';

interface Color {
  id: string;
  legacy?: boolean;
  label: string;
  color: string;
}

export const colors: Color[] = [
  {
    id: 'cLightBlue',
    label: t('in-custom-dashboards:widgets.formCompChart.color.lightBlue'),
    color: oldTheme.lib.colors.chart.strokeColors100[0]
  },
  {
    id: 'cTeal',
    label: t('in-custom-dashboards:widgets.formCompChart.color.teal'),
    color: oldTheme.lib.colors.chart.strokeColors100[1]
  },
  {
    id: 'cPurple',
    label: t('in-custom-dashboards:widgets.formCompChart.color.purple'),
    color: oldTheme.lib.colors.chart.strokeColors100[2]
  },
  {
    id: 'cMagenta',
    label: t('in-custom-dashboards:widgets.formCompChart.color.magenta'),
    color: oldTheme.lib.colors.chart.strokeColors100[3]
  },
  {
    id: 'cRed',
    label: t('in-custom-dashboards:widgets.formCompChart.color.red'),
    color: oldTheme.lib.colors.chart.strokeColors100[4]
  },
  {
    id: 'cDarkRed',
    label: t('in-custom-dashboards:widgets.formCompChart.color.darkRed'),
    color: oldTheme.lib.colors.chart.strokeColors100[5]
  },
  {
    id: 'cGreen',
    label: t('in-custom-dashboards:widgets.formCompChart.color.green'),
    color: oldTheme.lib.colors.chart.strokeColors100[6]
  },
  {
    id: 'cBlue',
    label: t('in-custom-dashboards:widgets.formCompChart.color.blue'),
    color: oldTheme.lib.colors.chart.strokeColors100[7]
  },
  {
    id: 'cPink',
    label: t('in-custom-dashboards:widgets.formCompChart.color.pink'),
    color: oldTheme.lib.colors.chart.strokeColors100[8]
  },
  {
    id: 'cYellow',
    label: t('in-custom-dashboards:widgets.formCompChart.color.yellow'),
    color: oldTheme.lib.colors.chart.strokeColors100[9]
  },
  {
    id: 'cCyan',
    label: t('in-custom-dashboards:widgets.formCompChart.color.cyan'),
    color: oldTheme.lib.colors.chart.strokeColors100[10]
  },
  {
    id: 'lightBlue',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.lightBlue'),
    color: oldTheme.lib.colors.lightBlue800
  },
  {
    id: 'green',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.green'),
    color: oldTheme.lib.colors.green800
  },
  {
    id: 'orange',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.orange'),
    color: oldTheme.lib.colors.orange800
  },
  {
    id: 'deepPurple',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.deepPurple'),
    color: oldTheme.lib.colors.deepPurple800
  },
  {
    id: 'cyan',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.cyan'),
    color: oldTheme.lib.colors.cyan800
  },
  {
    id: 'lime',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.lime'),
    color: oldTheme.lib.colors.lime800
  },
  {
    id: 'pink',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.pink'),
    color: oldTheme.lib.colors.pink800
  },
  {
    id: 'teal',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.teal'),
    color: oldTheme.lib.colors.teal800
  },
  {
    id: 'purple',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.purple'),
    color: oldTheme.lib.colors.purple800
  },
  {
    id: 'indigo',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.indigo'),
    color: oldTheme.lib.colors.indigo800
  },
  {
    id: 'red',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.red'),
    color: oldTheme.lib.colors.red800
  }
];
