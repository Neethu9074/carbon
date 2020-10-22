export default function filteredTree(tree, tags, filter) {
  return tree
    .map(element => {
      if (element.type === 'LEVEL') {
        const children = filteredTree(element.children, tags, filter).filter(Boolean);
        return children.length > 0 && { ...element, children: children };
      }
      return (filter ? element.allowFiltering : element.allowGrouping) && element;
    })
    .filter(Boolean);
}
