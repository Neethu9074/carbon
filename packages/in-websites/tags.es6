import { getTagTree } from 'in-applications/tags';

export const getGroupingTags = () =>
  getTagTree()
    .getChildren({ blacklist: isBlacklistedTag })
    .map(node => node.name);

export const getFilterTags = getGroupingTags;

function isBlacklistedTag(tag) {
  return tag.indexOf('beacon.') !== 0;
}
