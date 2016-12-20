import incidentCriticalColoredIcon from 'in-components/timeline/icons/incident_critical_colored.svg';
import incidentWarningColoredIcon from 'in-components/timeline/icons/incident_warning_colored.svg';
import issueCriticalColoredIcon from 'in-components/timeline/icons/issue_critical_colored.svg';
import issueWarningColoredIcon from 'in-components/timeline/icons/issue_warning_colored.svg';
import issueCriticalIcon from 'in-components/timeline/icons/issue_critical.svg';
import issueWarningIcon from 'in-components/timeline/icons/issue_warning.svg';
import incidentIcon from 'in-components/timeline/icons/incident.svg';

const icons = {};

icons.incidentImage = loadImage(incidentIcon);
icons.incidentWarningImageColored = loadImage(incidentWarningColoredIcon);
icons.incidentCriticalImageColored = loadImage(incidentCriticalColoredIcon);
icons.issueWarningImage = loadImage(issueWarningIcon);
icons.issueWarningImageColored = loadImage(issueWarningColoredIcon);
icons.issueCriticalImageColored = loadImage(issueCriticalColoredIcon);
icons.issueCriticalImage = loadImage(issueCriticalIcon);

function loadImage(src) {
  const image = document.createElement('img');
  image.src = src;
  return image;
}

export default icons;
