/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { PureComponent, createElement } from 'react';
import classNames from 'classnames';

import { SvgIconSizes } from '@instana/components';

import { IndeterminateLoadingIndicatorLineCoordinates as SVG_LINES } from 'in-components/LoadingIndicators/SvgLineCoordinates.json';
import { IndeterminateLoadingIndicatorPaths as SVG_PATHS } from 'in-components/LoadingIndicators/SvgPaths.json';
import theme from 'in-themes';

// @ts-expect-error
import locals from './IndeterminateLoadingIndicator.mless';
import { stripTrailingSlash } from 'history/PathUtils';

const {
  lib: { colors: COLORS }
} = theme;

const DEFAULT_STYLES = {
  fillColor: 'transparent',
  strokeColor: COLORS.N600Light,
  strokeWidth: 1.5
};

export interface IndeterminateLoadingIndicatorProps {
  /** Size of the loading indicator as a valid CSS value` */
  size?: string | number;
  /** Object of style overrides */
  customStyle?: {
    connectorStrokeColor?: string;
    /** Overall fill color, can be overriden by specific fill colors */
    fillColor?: string;
    /** Fill color of hexagons, overrides fillColor */
    hexagonFillColor?: string;
    /** Stroke color of hexagons, overrides strokeColor */
    hexagonStrokeColor?: string;
    /** Fill color of pill body, overrides fillColor */
    pillBodyFillColor?: string;
    /** Stroke color of pill body, overrides strokeColor */
    pillBodyStrokeColor?: string;
    /** Fill color of pill top, overrides fillColor */
    pillTopFillColor?: string;
    /** Stroke color of pill top, overrides strokeColor */
    pillTopStrokeColor?: string;
    /** Overall stroke color, can be overriden by specific stroke colors */
    strokeColor?: string;
    /** Overall stroke width */
    strokeWidth?: string | number;
  };
}

interface SvgElementProps extends IndeterminateLoadingIndicatorProps {
  type: string;
  key: string;
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
  strokeDasharray?: number;
  strokeDashoffset?: number;
  style: {
    animationDelay: string;
    stroke: string;
    fill?: string;
  };
  className: string;
  d?: string;
}

interface ServiceIconProps {
  serviceBody: {
    fill: string;
    stroke: string;
  };
  serviceTop: {
    fill: string;
    stroke: string;
  };
}

export default class IndeterminateLoadingIndicator extends PureComponent {
  static displayName = 'IndeterminateLoadingIndicator';

  static defaultProps: IndeterminateLoadingIndicatorProps = {
    size: SvgIconSizes.xxl,
    customStyle: {}
  };

  state: Record<string, any> = {}; // contains svg path lengths for animation
  props: IndeterminateLoadingIndicatorProps = this.props;
  render() {
    const { size } = this.props;

    return (
      <svg
        className={locals.indeterminateLoadingIndicator}
        height={size}
        width={size}
        viewBox="0 0 64 64"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        {this.renderServiceIcon()}
        {this.renderHexagons()}
      </svg>
    );
  }

  getPathLengthCalculatingRef = (id: string) => (r: any) => {
    try {
      const currentLength = r && r.getTotalLength ? r.getTotalLength() : 0;
      this.setState({ [id]: currentLength });
    } catch (e) {
      // Ignore: The SVG element could be hidden in which case getTotalLength would throw an error:
      // > Failed to execute 'getTotalLength' on 'SVGGeometryElement': This element is non-rendered element.
      // We have no way to know within this component whether a surrounding element is causing the
      // SVG element to be invisible. We therefore just swallow the error and rely on the fact that the
      // re-render call will cause the ref to update.
    }
  };

  renderSvgElement = ({ type, key, ...props }: SvgElementProps) =>
    createElement(type, {
      key,
      ref: this.getPathLengthCalculatingRef(key),
      fillRule: 'nonzero',
      strokeWidth: this.props.customStyle?.strokeWidth || DEFAULT_STYLES.strokeWidth,
      ...props
    });

  renderServiceIcon = () => {
    const {
      fillColor: fill,
      strokeColor: stroke,
      pillBodyFillColor,
      pillBodyStrokeColor,
      pillTopFillColor,
      pillTopStrokeColor
    } = Object.assign({}, DEFAULT_STYLES, this.props.customStyle);

    const props: ServiceIconProps = {
      serviceBody: {
        fill: pillBodyFillColor || fill,
        stroke: pillBodyStrokeColor || stroke
      },
      serviceTop: {
        fill: pillTopFillColor || fill,
        stroke: pillTopStrokeColor || stroke
      }
    };

    const SvgPaths: Record<string, any> = SVG_PATHS;

    return (
      <g>
        {['serviceBody', 'serviceTop'].map((key: string) =>
          this.renderSvgElement({
            type: 'path',
            key,
            d: SvgPaths[key],
            strokeDasharray: this.state[key] || 0,
            strokeDashoffset: this.state[key] || 0,
            // TODO: Fix this type
            // @ts-expect-error
            ...props[key],
            className: classNames({
              [locals.animatedSvgElement]: true,
              [locals.animationSequenceIn]: true,
              [locals.animationStartOnce]: this.state[key],
              [locals.animationAfterSlightDelay]: this.state[key]
            })
          })
        )}
      </g>
    );
  };

  renderHexagons = () => {
    const {
      fillColor: fill,
      strokeColor: stroke,
      hexagonFillColor,
      hexagonStrokeColor,
      connectorStrokeColor
    } = Object.assign({}, DEFAULT_STYLES, this.props.customStyle);

    const SvgLines: Record<string, any> = SVG_LINES;

    return SVG_PATHS.hexagons.map((d, key) => (
      <g key={`hexagonGroup${key}`}>
        {this.renderSvgElement({
          type: 'line',
          key: `line${key}`,
          x1: SvgLines[key][0][0],
          x2: SvgLines[key][1][0],
          y1: SvgLines[key][0][1],
          y2: SvgLines[key][1][1],
          strokeDasharray: this.state[`line${key}`] || 0,
          strokeDashoffset: this.state[`line${key}`] || 0,
          style: {
            animationDelay: `${Number(key + 1.2) * 1000}ms`,
            stroke: connectorStrokeColor || stroke
          },
          className: classNames({
            [locals.animatedSvgElement]: true,
            [locals.animationSequenceInOut]: true,
            [locals.animationStart]: this.state[`line${key}`]
          })
        })}

        {this.renderSvgElement({
          type: 'path',
          key: `hexagon${key}`,
          d,
          style: {
            animationDelay: `${Number(key + 1.2) * 1000}ms`,
            fill: hexagonFillColor || fill,
            stroke: hexagonStrokeColor || stroke
          },
          className: classNames({
            [locals.animationSequenceFadeInOut]: true,
            [locals.animatedSvgElement]: true,
            [locals.animationStart]: this.state[`hexagon${key}`]
          })
        })}
      </g>
    ));
  };
}
