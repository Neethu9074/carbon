import * as websitesAndMobileTopList from 'in-custom-dashboards/widgets/WebsitesAndMobileTopList';
import * as infrastructureTopList from 'in-custom-dashboards/widgets/InfrastructureTopList';
import * as applicationsToplist from 'in-custom-dashboards/widgets/ApplicationsTopList';
import * as platformsTopList from 'in-custom-dashboards/widgets/PlatformsTopList';
import * as slo from 'in-custom-dashboards/widgets/Slo';
import * as eventChartCard from 'in-custom-dashboards/widgets/EventChartCard';
import * as timeZones from 'in-custom-dashboards/widgets/TimeZones';
import * as bigNumber from 'in-custom-dashboards/widgets/BigNumber';
import * as list from 'in-custom-dashboards/widgets/CustomTopList';
import * as markdown from 'in-custom-dashboards/widgets/Markdown';
import * as chart from 'in-custom-dashboards/widgets/Chart';

const all = {
  [slo.type]: slo,
  [markdown.type]: markdown,
  [timeZones.type]: timeZones,
  [platformsTopList.type]: platformsTopList,
  [applicationsToplist.type]: applicationsToplist,
  [infrastructureTopList.type]: infrastructureTopList,
  [websitesAndMobileTopList.type]: websitesAndMobileTopList,
  [bigNumber.type]: bigNumber,
  [chart.type]: chart,
  [eventChartCard.type]: eventChartCard,
  [list.type]: list
};
export default all;

export const enabledWidgets = Object.fromEntries(Object.entries(all).filter(entry => entry[1].enabled));
