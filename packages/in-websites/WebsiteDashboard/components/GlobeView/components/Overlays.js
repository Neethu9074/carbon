/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { withState, compose } from 'recompose';
import { create } from '@instana/observables';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import countryMap from 'in-websites/WebsiteDashboard/components/GlobeView/components/countryConfig.json';
import CountryList from 'in-websites/WebsiteDashboard/components/GlobeView/components/CountryList';
import { websitePathFullyQualified } from 'in-websites/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import Button from 'in-new-components/MapControls/Button';
import { applyTransform } from 'in-services/util/dom';
import { Vector3 } from 'in-map/3DLibProvider';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Overlays.mless';

const minDot = -0.5;
const maxDot = -0.7;

const countries = Object.keys(countryMap).map(key => countryMap[key]);

export default class OverlaysReactComponentMounter {
  constructor(globeView, nodesReactComponentWrapper, getData$, getValue) {
    this.update$ = create();
    this.properties$ = create();

    ReactDOM.render(
      <OverlaysReactComponent
        globeView={globeView}
        update$={this.update$}
        data$={this.properties$.flatMap(getData$)}
        getValue={getValue}
      />,
      nodesReactComponentWrapper
    );
  }

  update(globeScene) {
    this.update$.emit(globeScene);
  }

  updateData(props) {
    this.properties$.emit(props);
  }

  dispose() {
    this.countries.clear();
  }
}

const OverlaysReactComponent = compose(
  withState('showLabels', 'setShowLabels', false),
  withState('showHeatMap', 'setShowHeatMap', true),
  withState('autoRotate', 'setAutoRotate', true)
)(OverlaysReactComponentFn);

function OverlaysReactComponentFn({
  update$,
  showLabels,
  setShowLabels,
  showHeatMap,
  setShowHeatMap,
  globeView,
  data$,
  autoRotate,
  setAutoRotate,
  getValue
}) {
  return (
    <Fragment>
      {showHeatMap && <CountryList data$={data$} getValue={getValue} />}

      <div className={locals.buttons}>
        <div className={locals.buttonRow}>
          <div className={locals.buttonColumn}>
            <Tooltip
              content={t('in-websites:websiteDashboard.components.overlaysTooltipToogleHeatMap')}
              align="leftMiddle"
            >
              <Button
                dark={!showHeatMap}
                icon="lib_flame"
                onClick={() => {
                  setShowHeatMap(!showHeatMap);
                  globeView.toggleHeatMap(!showHeatMap);
                }}
              />
            </Tooltip>
            <Tooltip content={t('in-websites:websiteDashboard.components.overlaysTooltipPanLeft')} align="leftMiddle">
              <Button dark icon="lib_arrow_drop_left" onClick={() => globeView.rotateLeft()} />
            </Tooltip>
            <div className={locals.placeholder} />
          </div>
          <div className={locals.buttonColumn}>
            <Tooltip content={t('in-websites:websiteDashboard.components.overlaysTooltipPanUp')} align="leftMiddle">
              <Button dark icon="lib_arrow_drop_up" onClick={() => globeView.pinchUp()} />
            </Tooltip>
            <Tooltip
              content={t('in-websites:websiteDashboard.components.overlaysTooltipToogleAutomaticSpinning')}
              align="leftMiddle"
            >
              <Button
                dark={!autoRotate}
                icon="lib_actions_revert"
                onClick={() => {
                  setAutoRotate(!autoRotate);
                  globeView.toggleAutoRotate();
                }}
              />
            </Tooltip>
            <Tooltip content={t('in-websites:websiteDashboard.components.overlaysTooltipPanDown')} align="leftMiddle">
              <Button dark icon="lib_arrow_drop_down" onClick={() => globeView.pinchDown()} />
            </Tooltip>
          </div>
          <div className={locals.buttonColumn}>
            <Tooltip
              content={t('in-websites:websiteDashboard.components.overlaysTooltipToggleCountryRegionNames')}
              align="leftMiddle"
            >
              <Button dark={!showLabels} icon="lib_views_tag" onClick={() => setShowLabels(!showLabels)} />
            </Tooltip>
            <Tooltip content={t('in-websites:websiteDashboard.components.overlaysTooltipPanRight')} align="leftMiddle">
              <Button dark icon="lib_arrow_drop_right" onClick={() => globeView.rotateRight()} />
            </Tooltip>
            <Tooltip
              content={t('in-websites:websiteDashboard.components.overlaysTooltipSwitchTo2DMap')}
              align="leftMiddle"
            >
              <Button
                dark
                href$={getModifiedUrlStream(params => (params.pathname = `${websitePathFullyQualified}/geography`))}
                className={locals.to2D}
                renderContent={() => <span>{t('in-websites:websiteDashboard.components.overlaysButton2D')}</span>}
              />
            </Tooltip>
          </div>
        </div>
      </div>

      {showLabels && countries.map((country, i) => <Country key={i} country={country} update$={update$} />)}
    </Fragment>
  );
}

class Country extends React.Component {
  static displayName = t('in-websites:websiteDashboard.components.overlaysCountryDisplayName');

  updateSubscription = null;

  componentDidMount() {
    this.updateSubscription = this.props.update$.subscribe(globeScene => {
      const country = this.props.country;
      const dot = globeScene.camera.lookAt.dot(country.direction);
      if (dot > minDot) {
        this.domNode.style.display = 'none';
        return;
      }
      this.domNode.style.opacity = Math.min(1, 1 + (dot - maxDot) / (maxDot - minDot));
      this.domNode.style.display = '';

      const screenPosition = new Vector3(country.position.x, country.position.y, country.position.z);
      screenPosition.applyMatrix4(globeScene.camera.projection);
      screenPosition.x = (screenPosition.x + 1) / 2;
      screenPosition.y = -(screenPosition.y - 1) / 2;
      applyTransform(
        this.domNode,
        `translate3d(${screenPosition.x * globeScene.width}px,${screenPosition.y * globeScene.height}px,0)`
      );
    });
  }

  componentWillUnmount() {
    if (this.updateSubscription) {
      this.updateSubscription.dispose();
      this.updateSubscription = null;
    }
  }

  render() {
    return (
      <span className={locals.countryLabel} ref={domNode => (this.domNode = domNode)}>
        {this.props.country.label}
      </span>
    );
  }
}
