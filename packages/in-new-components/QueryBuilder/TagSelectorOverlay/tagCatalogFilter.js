export default function filterCatalog(tagCatalog, query) {
  if (!query) {
    return tagCatalog;
  }

  query = query.toLowerCase();
  const filteredTreeNodes = tagCatalog.tagTree.map(group => searchGroup(group, query)).filter(Boolean);
  return { tags: tagCatalog.tags, tagTree: filteredTreeNodes };
}

function searchGroup(group, query) {
  if (hits(group.label, query)) {
    return group;
  }

  const filteredSubGroups = group.children.map(subGroup => searchSubGroup(subGroup, query)).filter(Boolean);
  if (filteredSubGroups.length > 0) {
    return {
      ...group,
      originalChildren: group.children,
      children: filteredSubGroups
    };
  }
}

function searchSubGroup(subGroup, query) {
  if (hits(subGroup.label, query)) {
    return subGroup;
  }

  const filteredTags = subGroup.children.filter(tag => searchTag(tag, query));
  if (filteredTags.length > 0) {
    return {
      ...subGroup,
      originalChildren: subGroup.children,
      children: filteredTags
    };
  }
}

function searchTag(tag, query) {
  return hits(tag.label, query);
}

function hits(label, query) {
  return label.toLowerCase().includes(query);
}
