import * as markdown from 'in-custom-dashboards/widgets/Markdown';
import * as timeZones from 'in-custom-dashboards/widgets/TimeZones';
import * as bigNumber from 'in-custom-dashboards/widgets/BigNumber';

export default {
  [markdown.type]: markdown,
  [timeZones.type]: timeZones,
  [bigNumber.type]: bigNumber
};
