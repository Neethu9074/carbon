/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import * as pie from 'in-custom-dashboards/widgets/Pie';
import * as timeZones from 'in-custom-dashboards/widgets/TimeZones';
import * as bigNumber from 'in-custom-dashboards/widgets/BigNumber';
import * as list from 'in-custom-dashboards/widgets/TopList';
import * as markdown from 'in-custom-dashboards/widgets/Markdown';
import * as chart from 'in-custom-dashboards/widgets/Chart';
import * as slo from 'in-custom-dashboards/widgets/Slo';

const all = {
  [slo.type]: slo,
  [markdown.type]: markdown,
  [timeZones.type]: timeZones,
  [bigNumber.type]: bigNumber,
  [chart.type]: chart,
  [list.type]: list,
  [pie.type]: pie
};
export default all;

export const enabledWidgets = Object.fromEntries(Object.entries(all).filter(entry => entry[1].enabled));
