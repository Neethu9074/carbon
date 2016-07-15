export function compress(current) {
  let result = current;

  if (current.type === 'stackTrace') {
    while (result.children.length === 1 && current.children[0].type === 'stackTrace') {
      const child = result.children[0];
      result = {
        id: `${result.id};${child.id}`,
        type: 'stackTrace',
        children: child.children
      };
    }
  }

  // recurse down
  result.children = result.children.map(compress);

  return result;
}
