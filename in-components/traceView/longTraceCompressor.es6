export function compress(current) {
  let result = current;

  if (result.type === 'stackTrace') {
    while (result.children.length === 1 && result.children[0].type === 'stackTrace') {
      const child = result.children[0];
      result = {
        id: `${result.id};${child.id}`,
        type: 'stackTrace',
        children: child.children,
        stackTrace: result.stackTrace.concat(child.stackTrace)
      };
    }
  }

  // recurse down
  result.children = result.children.map(compress);

  return result;
}
