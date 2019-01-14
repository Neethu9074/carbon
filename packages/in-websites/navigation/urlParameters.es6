import { websiteId, pageId, tagFilters } from 'in-websites/navigation/matrix';
import { websitePath } from 'in-websites/navigation/paths';

export const websiteIdUrlParameter = {
  path: websitePath,
  name: websiteId
};

export const pageIdUrlParameter = {
  path: websitePath,
  name: pageId
};

export const tagFiltersInDashboardUrlParameter = {
  path: websitePath,
  name: tagFilters
};
