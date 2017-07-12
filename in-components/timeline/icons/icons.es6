import issueCriticalOpenData from 'in-components/timeline/icons/issueCriticalOpen';
import issueWarningOpenData from 'in-components/timeline/icons/issueWarningOpen';
import incidentCriticalOpenData from 'in-components/timeline/icons/incident';
import incidenWarningOpentData from 'in-components/timeline/icons/incident';
import issueCriticalData from 'in-components/timeline/icons/issueCritical';
import issueWarningData from 'in-components/timeline/icons/issueWarning';
import incidentData from 'in-components/timeline/icons/incident';

export const incident = document.createElement('img');
incident.src = incidentData;

export const incidentWarningOpen = document.createElement('img');
incidentWarningOpen.src = incidenWarningOpentData;

export const incidentCriticalOpen = document.createElement('img');
incidentCriticalOpen.src = incidentCriticalOpenData;

export const issueWarning = document.createElement('img');
issueWarning.src = issueWarningData;

export const issueCritical = document.createElement('img');
issueCritical.src = issueCriticalData;

export const issueWarningOpen = document.createElement('img');
issueWarningOpen.src = issueWarningOpenData;

export const issueCriticalOpen = document.createElement('img');
issueCriticalOpen.src = issueCriticalOpenData;
