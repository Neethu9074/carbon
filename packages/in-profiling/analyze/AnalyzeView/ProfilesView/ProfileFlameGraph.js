import React, { useState, useEffect } from 'react';
import { create } from 'reactive-observables';
import { flamegraph } from 'd3-flame-graph';
import { select } from 'd3-selection';
import theme from 'in-themes';
import tip from 'd3-tip';

import 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileFlameGraph.css';
import { hexToRGB, rgbToHex } from 'in-services/formatters/color';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { containsIgnoreCase } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';

const fromRgb = hexToRGB(theme.lib.colors.yellow800);
const toRgb = hexToRGB(theme.lib.colors.red800);
const deltaColors = {
  r: toRgb.r - fromRgb.r,
  g: toRgb.g - fromRgb.g,
  b: toRgb.b - fromRgb.b
};

export default getElementDimensions(function WidthWrapper(props) {
  return <QueryToQueryStreamWrapper {...props} />;
});

function QueryToQueryStreamWrapper({ profile, query, width = 0 }) {
  const [query$] = useState(create());
  useEffect(
    () => {
      query$.emit(query);
    },
    [query]
  );

  return <ProfileFlameGraph query$={query$} width={width} profile={profile} />;
}

const ProfileFlameGraph = connectTo(({ query$ }) => ({ query: query$.throttle(300) }), function ProfileFlameGraph(
  props
) {
  return <ProfileFlameGraphWithReducedUpdates profile={props.profile} width={props.width} query={props.query} />;
});

class ProfileFlameGraphWithReducedUpdates extends React.Component {
  flamegraphObject = null;

  shouldComponentUpdate(nextProps) {
    return (
      this.props.query !== nextProps.query ||
      this.props.width !== nextProps.width ||
      this.props.profile !== nextProps.profile
    );
  }

  componentDidMount() {
    this.setupFlameGraph();
  }

  componentDidUpdate(prevProps) {
    const { width, query, profile } = this.props;
    const { width: prevWidth, query: prevQuery, profile: prevProfile } = prevProps;

    if (profile.__uid !== prevProfile.__uid || width !== prevWidth) {
      this.setupFlameGraph();
    }
    if (query !== prevQuery && this.flamegraphObject) {
      this.flamegraphObject.search(query);
    }
  }

  componentWillUnmount() {
    this.destroyFlameGraphIfPresent();
  }

  destroyFlameGraphIfPresent = () => {
    if (this.flamegraphObject) {
      this.flamegraphObject.destroy();
      this.tooltip.destroy();
    }
  };

  setupFlameGraph = () => {
    const { width, profile } = this.props;
    const data = mapData(profile);

    this.destroyFlameGraphIfPresent();

    this.tooltip = tip()
      .attr('class', 'd3-flame-graph-tip')
      .html(function(node) {
        return `${node.data.name} (${((node.data.value * 100) | 0) / 100}%)`;
      });

    this.flamegraphObject = flamegraph()
      .width(width)
      .tooltip(this.tooltip)
      .setSearchMatch(function(d, term) {
        return term && containsIgnoreCase(d.data.name, term);
      })
      .differential(false)
      .selfValue(false)
      .setColorMapper(colorMapper);

    select('#chart')
      .datum(data)
      .call(this.flamegraphObject);

    window.scrollTo(0, document.body.scrollHeight);
  };

  render() {
    return <div id="chart" />;
  }
}

function mapData(profile) {
  const data = {
    name: 'root',
    value: 100,
    children: profile.profileGraph.map(childNode => ({
      name: getName(childNode),
      value: childNode.percent,
      children: getChildren(childNode)
    }))
  };

  return data;
}

function getChildren(profileNode) {
  if (!profileNode.children) {
    return null;
  }

  return profileNode.children.map(childNode => ({
    name: getName(childNode),
    value: childNode.percent,
    children: getChildren(childNode)
  }));
}

function getName(node) {
  return `<${node.methodName}> at ${node.fileName}:${node.fileLine}`;
}

function colorMapper(node) {
  let hex;
  if (node.data.name === 'root') {
    hex = theme.lib.colors.N300;
  } else if (node.highlight) {
    hex = theme.lib.colors.cyan800;
  } else {
    const normalizedPercent = node.data.value / 100;
    hex = rgbToHex(
      fromRgb.r + deltaColors.r * normalizedPercent,
      fromRgb.g + deltaColors.g * normalizedPercent,
      fromRgb.b + deltaColors.b * normalizedPercent
    );
  }

  if (node.data.fade) {
    return hex + '40';
  }

  return hex;
}
