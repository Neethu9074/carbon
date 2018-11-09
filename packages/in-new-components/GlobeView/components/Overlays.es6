import { withState, compose } from 'recompose';
import { create } from 'reactive-observables';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import countryMap from 'in-new-components/GlobeView/components/countryConfig';
import CountryList from 'in-new-components/GlobeView/components/CountryList';
import Button from 'in-new-components/MapControls/Button';
import { applyTransform } from 'in-services/util/dom';
import { Vector3 } from 'in-map/3DLibProvider';
import connect from 'in-hoc/connectTo';

import locals from './Overlays.mless';

const minDot = -0.5;
const maxDot = -0.7;

const countries = Object.keys(countryMap).map(key => countryMap[key]);

export default class OverlaysReactComponentMounter {
  constructor(globeView, nodesReactComponentWrapper, getData$) {
    this.update$ = create();
    this.getData$ = getData$;

    ReactDOM.render(
      <OverlaysReactComponent globeView={globeView} update$={this.update$} getData$={getData$} />,
      nodesReactComponentWrapper
    );
  }

  update(globeScene) {
    this.update$.emit(globeScene);
  }

  dispose() {
    this.countries.clear();
  }
}

const OverlaysReactComponent = compose(
  withState('showLabels', 'setShowLabels', false),
  withState('showHeatMap', 'setShowHeatMap', false),
  connect(props => ({
    showLabels: props.showLabels$,
    showHeatMap: props.showHeatMap$
  }))
)(OverlaysReactComponentFn);

function OverlaysReactComponentFn({
  update$,
  showLabels,
  setShowLabels,
  showHeatMap,
  setShowHeatMap,
  globeView,
  getData$
}) {
  return (
    <Fragment>
      {showHeatMap && <CountryList getData$={getData$} />}

      <div className={locals.buttons}>
        <div className={locals.buttonRow}>
          <Button dark icon="lib_arrow_drop_left" onClick={() => globeView.rotateLeft()} />
          <div className={locals.buttonColumn}>
            <Button dark icon="lib_arrow_drop_up" onClick={() => globeView.pinchUp()} />
            <Button dark icon="lib_actions_revert" onClick={() => globeView.toggleAutoRotate()} />
            <Button dark icon="lib_arrow_drop_down" onClick={() => globeView.pinchDown()} />
          </div>
          <div className={locals.buttonColumn}>
            <Button dark={!showLabels} icon="lib_views_tag" onClick={() => setShowLabels(!showLabels)} />
            <Button dark icon="lib_arrow_drop_right" onClick={() => globeView.rotateRight()} />
            <Button
              dark={!showHeatMap}
              icon="lib_website"
              onClick={() => {
                setShowHeatMap(!showHeatMap);
                globeView.toggleHeatMap(!showHeatMap);
              }}
            />
          </div>
        </div>
      </div>

      {showLabels && countries.map((country, i) => <Country key={i} country={country} update$={update$} />)}
    </Fragment>
  );
}

class Country extends React.Component {
  static displayName = 'Country';

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
