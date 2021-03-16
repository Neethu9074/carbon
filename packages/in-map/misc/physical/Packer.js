/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default function Packer() {
  let root;
  function fit(blocks) {
    let n,
      node,
      block,
      len = blocks.length;
    const w = len > 0 ? blocks[0].w : 0;
    const h = len > 0 ? blocks[0].h : 0;
    root = { x: 0, y: 0, w, h };
    for (n = 0; n < len; n++) {
      block = blocks[n];
      node = findNode(root, block.w, block.h);
      if (node) block.fit = splitNode(node, block.w, block.h);
      else block.fit = growNode(block.w, block.h);
    }
  }

  function findNode(root, w, h) {
    if (root.used) return findNode(root.right, w, h) || findNode(root.down, w, h);
    else if (w <= root.w && h <= root.h) return root;
    else return null;
  }

  function splitNode(node, w, h) {
    node.used = true;
    node.down = { x: node.x, y: node.y + h, w: node.w, h: node.h - h };
    node.right = { x: node.x + w, y: node.y, w: node.w - w, h: h };
    return node;
  }

  function growNode(w, h) {
    let canGrowDown = w <= root.w;
    let canGrowRight = h <= root.h;

    let shouldGrowRight = canGrowRight && root.h >= root.w + w; // attempt to keep square-ish by growing right when height is much greater than width
    let shouldGrowDown = canGrowDown && root.w >= root.h + h; // attempt to keep square-ish by growing down  when width  is much greater than height

    if (shouldGrowRight) return growRight(w, h);
    else if (shouldGrowDown) return growDown(w, h);
    else if (canGrowRight) return growRight(w, h);
    else if (canGrowDown) return growDown(w, h);
    else return growDown(w, h);
  }

  function growRight(w, h) {
    let node;

    root = {
      used: true,
      x: 0,
      y: 0,
      w: root.w + w,
      h: root.h,
      down: root,
      right: { x: root.w, y: 0, w: w, h: root.h }
    };
    node = findNode(root, w, h);
    if (node) return splitNode(node, w, h);
    else return null;
  }

  function growDown(w, h) {
    let node;

    root = {
      used: true,
      x: 0,
      y: 0,
      w: root.w,
      h: root.h + h,
      down: { x: 0, y: root.h, w: root.w, h: h },
      right: root
    };
    node = findNode(root, w, h);
    if (node) return splitNode(node, w, h);
    else return null;
  }

  return {
    fit
  };
}
