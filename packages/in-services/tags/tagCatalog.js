import memoize from 'in-services/util/memoizingObservableGenerator';
import { generateStableHash } from 'in-services/util/id';
import { roundDownToWeek } from 'in-services/util/date';
import { success } from 'in-services/util/result';

// We frequently need to access the tag catalog in ways that would be unoptimized
// given its native structure. We therefore index it in a variety of different
// ways in order to allow faster execution within the components.
export function enrichTagCatalog(tagCatalog) {
  if (tagCatalog.__enriched) {
    // To allow methods to either work with enriched or un-enriched tag catalogs
    // without a runtime performance impact for optimized code paths.
    return tagCatalog;
  }

  // Create a shallow copy to allow us to add additional properties.
  tagCatalog = {
    __enriched: true,
    ...tagCatalog
  };

  const tagsWithPath = resolveTagsFromTree(tagCatalog.tagTree);
  tagCatalog.tagsByName = tagCatalog.tags.reduce((agg, tag) => {
    agg[tag.name] = { ...tag, path: tagsWithPath[tag.name] };
    return agg;
  }, {});

  tagCatalog.allTagNames = Object.keys(tagCatalog.tagsByName);

  return tagCatalog;
}

export function getTagCatalogOnce(originalGetTagCatalog) {
  return memoize(
    args =>
      originalGetTagCatalog(args).map(result => {
        if (result.data) {
          return success(enrichTagCatalog(result.data));
        }
        return result;
      }),
    generateGetTagCatalogRequestId,
    Number.MAX_VALUE
  );
}

function generateGetTagCatalogRequestId({ timeConfig }) {
  const from = (timeConfig.to || Date.now()) - timeConfig.windowSize;
  const week = roundDownToWeek(from);
  return generateStableHash(week);
}

function resolveTagsFromTree(tree) {
  const lut = {};
  if (tree) {
    for (let i = 0; i < tree.length; i++) {
      const group = tree[i];
      resolveNode(group, lut, []);
    }
  }
  return lut;
}

function resolveNode(node, lut, parents) {
  const localParents = parents.slice();
  localParents.push(node);
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      resolveNode(node.children[i], lut, localParents);
    }
  } else {
    lut[node.tagName] = localParents;
  }
}
