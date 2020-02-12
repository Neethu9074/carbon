import * as markdown from 'in-custom-dashboards/widgets/Markdown';
import * as timeZones from 'in-custom-dashboards/widgets/TimeZones';
import * as bigNumber from 'in-custom-dashboards/widgets/BigNumber';
import * as chart from 'in-custom-dashboards/widgets/Chart';

export default {
  [markdown.type]: markdown,
  [timeZones.type]: timeZones,
  [bigNumber.type]: bigNumber,
  [chart.type]: chart
};
