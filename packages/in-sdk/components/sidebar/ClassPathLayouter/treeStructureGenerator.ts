/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export type ClassPathTree = {
  [path: string]: string[]
}

export type Result = {
  tree: ClassPathTree,
  numberOfEntries: number
}

export function toClassPathTree(classpath: string): Result {
  const classPathEntries = classpath.split(/:(?!\\)|;/);
  const tree: ClassPathTree = {};
  let currentPath = '';

  for (const path of classPathEntries) {
    const pathTillJar = getPathTillJar(path);

    if (pathTillJar !== currentPath || !tree[pathTillJar]) {
      tree[pathTillJar] = [];
    }

    currentPath = pathTillJar;
    tree[pathTillJar].push(path);
  }

  return {tree, numberOfEntries: classPathEntries.length};
}



function getPathTillJar(path: string): string {
  let indexOfLastSlash = path.length;
  for (let i = path.length - 1; i > 0; i--) {
    const char = path[i];
    if (char === '/' || char === '\\') {
      indexOfLastSlash = i;
      break;
    }
  }
  return path.slice(0, indexOfLastSlash + 1);
}
