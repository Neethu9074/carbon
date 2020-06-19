import theme from 'in-themes';

import { serializeLine } from 'in-new-components/StackTrace/serializer';
import { hexToRGB, rgbToHex } from 'in-services/formatters/color';
import { containsIgnoreCase } from 'in-services/util/string';

const fromRgb = hexToRGB(theme.lib.colors.yellow800);
const toRgb = hexToRGB(theme.lib.colors.red800);
const deltaColors = {
  r: toRgb.r - fromRgb.r,
  g: toRgb.g - fromRgb.g,
  b: toRgb.b - fromRgb.b
};

export default function mapData(profile, width, query, selfTimeHighlighted) {
  const nodeHeight = 16;
  const layers = new Map();
  let maxSelfValue = 0;

  addNodesToMap(null, profile.profileGraph, 0, 0);
  const layerIterator = layers.values();
  for (const layer of layerIterator) {
    colorize(layer);
  }

  return {
    layers,
    totalWidth: width,
    strechFactor: 1,
    totalHeight: nodeHeight * layers.size,
    maxSelfValue
  };

  function addNodesToMap(parentNode, nodes, parentXPosition, depth) {
    if (!nodes) {
      return;
    }

    addDepthIfAbsent(depth);

    let cursor = parentXPosition;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const nodeValue = node.percent / 100;
      const enrichedNode = {
        ...node,
        parentNode,
        depth,
        name: getName(node),
        value: nodeValue,
        percent: node.percent,
        selfValue: getNodeSelfValue(node, nodeValue),
        x: cursor,
        y: depth * nodeHeight,
        width: nodeValue * width,
        height: nodeHeight
      };
      maxSelfValue = Math.max(maxSelfValue, enrichedNode.selfValue);
      layers.get(depth).push(enrichedNode);

      addNodesToMap(enrichedNode, enrichedNode.children, cursor, depth + 1);
      cursor += enrichedNode.width;
    }
  }

  function addDepthIfAbsent(depth) {
    if (!layers.has(depth)) {
      layers.set(depth, []);
    }
  }

  function colorize(layerNodes) {
    for (let i = 0; i < layerNodes.length; i++) {
      const layerNode = layerNodes[i];
      layerNode.color = getColor(layerNode);
    }
  }

  function getColor(node) {
    const v = selfTimeHighlighted ? node.selfValue / maxSelfValue : node.value;
    let hex = rgbToHex(fromRgb.r + deltaColors.r * v, fromRgb.g + deltaColors.g * v, fromRgb.b + deltaColors.b * v);
    if (query) {
      if (containsIgnoreCase(node.name, query)) {
        node.highlighted = true;
        return theme.lib.colors.primary1;
      } else {
        hex += '40';
      }
    }
    return hex;
  }
}

function getNodeSelfValue(node, nodeValue) {
  if (!node.children) {
    return nodeValue;
  }
  return nodeValue - node.children.map(c => c.percent / 100).reduce((a, b) => a + b, 0);
}

function getName(node) {
  return serializeLine(node.fileName, node.methodName, node.fileLine);
}
