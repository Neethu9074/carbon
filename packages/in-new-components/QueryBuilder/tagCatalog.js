// We frequently need to access the tag catalog in ways that would be unoptimized
// given its native structure. We therefore index it in a variety of different
// ways in order to allow faster execution within the components.
export function enrichTagCatalog(tagCatalog) {
  // Create a shallow copy to allow us to add additional properties.
  tagCatalog = {
    ...tagCatalog
  };

  tagCatalog.tagsByName = tagCatalog.tags.reduce((agg, tag) => {
    agg[tag.name] = tag;
    return agg;
  }, {});

  tagCatalog.allTagNames = Object.keys(tagCatalog.tagsByName);

  return tagCatalog;
}
