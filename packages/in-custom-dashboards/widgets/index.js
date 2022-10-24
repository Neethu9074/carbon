/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import * as applicationHealth from 'in-custom-dashboards/widgets/ApplicationHealth';
import * as timeZones from 'in-custom-dashboards/widgets/TimeZones';
import * as bigNumber from 'in-custom-dashboards/widgets/BigNumber';
import * as markdown from 'in-custom-dashboards/widgets/Markdown';
import * as list from 'in-custom-dashboards/widgets/TopList';
import * as chart from 'in-custom-dashboards/widgets/Chart';
import * as apdex from 'in-custom-dashboards/widgets/Apdex';
import { compareIgnoreCase } from 'in-services/util/string';
import * as pie from 'in-custom-dashboards/widgets/Pie';
import * as slo from 'in-custom-dashboards/widgets/Slo';

const all = {
  [apdex.type]: apdex,
  [slo.type]: slo,
  [markdown.type]: markdown,
  [timeZones.type]: timeZones,
  [bigNumber.type]: bigNumber,
  [chart.type]: chart,
  [list.type]: list,
  [pie.type]: pie,
  [applicationHealth.type]: applicationHealth
};
export default all;

export const enabledWidgets = Object.values(all)
  .filter(entry => entry.enabled)
  .sort((a, b) => compareIgnoreCase(a.label, b.label));
