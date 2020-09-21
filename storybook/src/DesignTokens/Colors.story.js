import theme from 'in-themes';
import React from 'react';

import { colorTranslation, getColor } from 'in-applications/endpointTypes';

export default {
  title: 'DesignTokens|Colors',
  component: Colors
};

export const Colors = () => {
  return (
    <>
      <Palette title="Primary">
        {[
          ['primary1', theme.lib.colors.primary1],
          ['primary2', theme.lib.colors.primary2]
        ].map(mapToRect)}
      </Palette>

      <Palette title="Black & White">
        {[
          ['white', theme.lib.colors.white],
          ['black', theme.lib.colors.black]
        ].map(mapToRect)}
      </Palette>

      <Palette title="Success & Failure">
        {[
          ['success', theme.lib.colors.success],
          ['failure', theme.lib.colors.failure]
        ].map(mapToRect)}
      </Palette>

      <Palette title="Neutral">
        {[
          ['N050', theme.lib.colors.N050],
          ['N100', theme.lib.colors.N100],
          ['N200', theme.lib.colors.N200],
          ['N300', theme.lib.colors.N300],
          ['N400', theme.lib.colors.N400],
          ['N500', theme.lib.colors.N500],
          ['N600Light', theme.lib.colors.N600Light],
          ['N700Medium', theme.lib.colors.N700Medium],
          ['N800Dark', theme.lib.colors.N800Dark],
          ['N900Primary', theme.lib.colors.N900Primary]
        ].map(mapToRect)}
      </Palette>

      <Palette title="Health">
        {[
          ['yellow800', theme.lib.colors.yellow800],
          ['orange800', theme.lib.colors.orange800],
          ['red800', theme.lib.colors.red800]
        ].map(mapToRect)}
      </Palette>

      <Palette title="Extended">
        {[
          ['lightBlue800', theme.lib.colors.lightBlue800],
          ['cyan800', theme.lib.colors.cyan800],
          ['teal800', theme.lib.colors.teal800],
          ['green800', theme.lib.colors.green800],
          ['lime800', theme.lib.colors.lime800],
          ['pink800', theme.lib.colors.pink800],
          ['purple800', theme.lib.colors.purple800],
          ['deepPurple800', theme.lib.colors.deepPurple800],
          ['indigo800', theme.lib.colors.indigo800],
          ['blue800', theme.lib.colors.blue800]
        ].map(mapToRect)}
      </Palette>

      <Palette title="Chart 100">
        {theme.lib.colors.chart.strokeColors100.map(color => ['', color]).map(mapToRect)}
      </Palette>
      <Palette title="Chart 25">
        {theme.lib.colors.chart.strokeColors25.map(color => ['', color]).map(mapToRect)}
      </Palette>

      <Palette title="Navy">
        {[
          ['navy800', theme.lib.colors.navy800],
          ['navy900', theme.lib.colors.navy900]
        ].map(mapToRect)}
      </Palette>

      <Palette title="Endpoint Type">
        {Object.keys(colorTranslation)
          .map(type => [type, getColor(type)])
          .map(mapToRect)}
      </Palette>
    </>
  );
};

function mapToRect(config) {
  return <Rect key={`${config[0]}_${config[1]}`} config={config} />;
}

function Palette({ title, children }) {
  return (
    <>
      <h2>{title}</h2>
      <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
    </>
  );
}

function Rect({ config }) {
  return (
    <div
      style={{
        color: '#fff',
        minWidth: 80,
        height: 80,
        paddingTop: 54,
        marginRight: 1,
        background: config[1]
      }}
    >
      <div
        style={{
          background: '#222'
        }}
      >
        {config[0]}
        <br />
        {config[1]}
      </div>
    </div>
  );
}
