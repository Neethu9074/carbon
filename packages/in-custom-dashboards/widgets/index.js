import * as websitesAndMobileTopList from 'in-custom-dashboards/widgets/WebsitesAndMobileTopList';
import * as infrastructureTopList from 'in-custom-dashboards/widgets/InfrastructureTopList';
import * as applicationsToplist from 'in-custom-dashboards/widgets/ApplicationsTopList';
import * as timeZones from 'in-custom-dashboards/widgets/TimeZones';
import * as bigNumber from 'in-custom-dashboards/widgets/BigNumber';
import * as markdown from 'in-custom-dashboards/widgets/Markdown';
import * as chart from 'in-custom-dashboards/widgets/Chart';

export default {
  [markdown.type]: markdown,
  [timeZones.type]: timeZones,
  [applicationsToplist.type]: applicationsToplist,
  [infrastructureTopList.type]: infrastructureTopList,
  [websitesAndMobileTopList.type]: websitesAndMobileTopList,
  [bigNumber.type]: bigNumber
  [chart.type]: chart
};
