/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { themes } from '@instana/design-tokens';

import { chartColors } from 'in-themes/chartColors';
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
    color: chartColors.strokeColors100[0]
  },
  {
    id: 'cTeal',
    label: t('in-custom-dashboards:widgets.formCompChart.color.teal'),
    color: chartColors.strokeColors100[1]
  },
  {
    id: 'cPurple',
    label: t('in-custom-dashboards:widgets.formCompChart.color.purple'),
    color: chartColors.strokeColors100[2]
  },
  {
    id: 'cMagenta',
    label: t('in-custom-dashboards:widgets.formCompChart.color.magenta'),
    color: chartColors.strokeColors100[3]
  },
  {
    id: 'cRed',
    label: t('in-custom-dashboards:widgets.formCompChart.color.red'),
    color: chartColors.strokeColors100[4]
  },
  {
    id: 'cDarkRed',
    label: t('in-custom-dashboards:widgets.formCompChart.color.darkRed'),
    color: chartColors.strokeColors100[5]
  },
  {
    id: 'cGreen',
    label: t('in-custom-dashboards:widgets.formCompChart.color.green'),
    color: chartColors.strokeColors100[6]
  },
  {
    id: 'cBlue',
    label: t('in-custom-dashboards:widgets.formCompChart.color.blue'),
    color: chartColors.strokeColors100[7]
  },
  {
    id: 'cPink',
    label: t('in-custom-dashboards:widgets.formCompChart.color.pink'),
    color: chartColors.strokeColors100[8]
  },
  {
    id: 'cYellow',
    label: t('in-custom-dashboards:widgets.formCompChart.color.yellow'),
    color: chartColors.strokeColors100[9]
  },
  {
    id: 'cCyan',
    label: t('in-custom-dashboards:widgets.formCompChart.color.cyan'),
    color: chartColors.strokeColors100[10]
  },
  {
    id: 'lightBlue',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.lightBlue'),
    color: themes.default.ids.color.option.blue[400]
  },
  {
    id: 'green',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.green'),
    color: themes.default.ids.color.option.green[500]
  },
  {
    id: 'orange',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.orange'),
    color: themes.default.ids.color.option.orange[500]
  },
  {
    id: 'deepPurple',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.deepPurple'),
    color: themes.default.ids.color.option['deep-purple'][500]
  },
  {
    id: 'cyan',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.cyan'),
    color: themes.default.ids.color.option.teal[400]
  },
  {
    id: 'lime',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.lime'),
    color: themes.default.ids.color.option.lime[500]
  },
  {
    id: 'pink',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.pink'),
    color: themes.default.ids.color.option.pink[500]
  },
  {
    id: 'teal',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.teal'),
    color: themes.default.ids.color.option.teal[500]
  },
  {
    id: 'purple',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.purple'),
    color: themes.default.ids.color.option.purple[500]
  },
  {
    id: 'indigo',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.indigo'),
    color: themes.default.ids.color.option.indigo[500]
  },
  {
    id: 'red',
    legacy: true,
    label: t('in-custom-dashboards:widgets.formCompChart.color.red'),
    color: themes.default.ids.color.option.red[500]
  }
];
