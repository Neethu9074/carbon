/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { cpuColorMapper } from 'in-profiling/analyze/AnalyzeView/colors';
import { serializeLine } from 'in-new-components/StackTrace/serializer';
import { containsIgnoreCase } from 'in-services/util/string';
import { percentage } from 'in-services/formatters/number';
import theme from 'in-themes';

export default function mapData(profile, width, query, selfTimeHighlighted) {
  const nodeHeight = 16;
  const layers = new Map();
  let maxSelfTime = 0;

  addNodesToMap(profile.profileGraph, 0, 0);
  const layerIterator = layers.values();
  for (const layer of layerIterator) {
    colorize(layer);
  }

  return {
    layers,
    totalWidth: width,
    strechFactor: 1,
    totalHeight: nodeHeight * layers.size,
    maxSelfTime
  };

  function addNodesToMap(nodes, parentXPosition, depth) {
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
        depth,
        name: getName(node),
        value: nodeValue,
        x: cursor,
        y: depth * nodeHeight,
        width: nodeValue * width,
        height: nodeHeight
      };
      maxSelfTime = Math.max(maxSelfTime, enrichedNode.selfTime);
      layers.get(depth).push(enrichedNode);

      addNodesToMap(enrichedNode.children, cursor, depth + 1);
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
    const v = selfTimeHighlighted ? node.selfTime / maxSelfTime : node.value;
    let hex = cpuColorMapper(v);
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

function getName(node) {
  return `${serializeLine(node.fileName, node.methodName, node.fileLine)} (${percentage.detailed(node.percent / 100)})`;
}
