/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

interface Node {
  id: string;
  children: Node[];
}

interface QueueEntry {
  path: string[];
  node: Node;
}

type NodeSelector = (node: Node) => boolean;

export default function searchForPathToSelectedNode(root: Node | undefined, nodeSelector: NodeSelector): string[] {
  const queue = [];

  if (root) {
    queue.push({
      path: [],
      node: root
    });
  }

  let selectedPath;

  while (queue.length > 0) {
    selectedPath = searchInternals(queue, nodeSelector);
    if (selectedPath) {
      return selectedPath;
    }
  }

  return [];
}

function searchInternals(queue: QueueEntry[], nodeSelector: NodeSelector): string[] | undefined {
  // This is covered by the While check in the function getPathToSelectedNode
  const { path, node } = queue.shift()!;
  const newPath = path.concat(node.id);

  if (nodeSelector(node)) {
    return newPath;
  }

  node.children.forEach((child: Node) => {
    queue.push({
      path: newPath,
      node: child
    });
  });

  return undefined;
}
