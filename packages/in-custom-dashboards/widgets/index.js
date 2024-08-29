/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import * as applicationHealth from 'in-custom-dashboards/widgets/ApplicationHealth';
import * as timeZones from 'in-custom-dashboards/widgets/TimeZones';
import * as bigNumber from 'in-custom-dashboards/widgets/BigNumber';
import * as histogram from 'in-custom-dashboards/widgets/Histogram';
import * as sloLegacy from 'in-custom-dashboards/widgets/SloLegacy';
import * as markdown from 'in-custom-dashboards/widgets/Markdown';
import * as list from 'in-custom-dashboards/widgets/TopList';
import * as table from 'in-custom-dashboards/widgets/Table';
import * as chart from 'in-custom-dashboards/widgets/Chart';
import * as apdex from 'in-custom-dashboards/widgets/Apdex';
import { compareIgnoreCase } from 'in-services/util/string';
import * as slo from 'in-custom-dashboards/widgets/Slo';
import * as pie from 'in-custom-dashboards/widgets/Pie';

const all = {
  [apdex.type]: apdex,
  [sloLegacy.type]: sloLegacy,
  [slo.type]: slo,
  [markdown.type]: markdown,
  [timeZones.type]: timeZones,
  [bigNumber.type]: bigNumber,
  [chart.type]: chart,
  [list.type]: list,
  [pie.type]: pie,
  [applicationHealth.type]: applicationHealth,
  [histogram.type]: histogram,
  [table.type]: table
};
export default all;

export const enabledWidgets = Object.values(all)
  .filter(entry => entry.enabled)
  .sort((a, b) => compareIgnoreCase(a.label, b.label));
