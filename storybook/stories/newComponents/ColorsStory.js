import { storiesOf } from '@storybook/react';
import React from 'react';

import { colorTranslation, getColor } from 'in-applications/endpointTypes';
import Root from '../_helpers/Root';

storiesOf('newComponents/Colors', module).add('colors', () => <Colors />);

function Colors() {
  return (
    <Root>
      <div style={{ display: 'flex' }}>
        <Palette>
          {[
            ['B100', '#00babb'],
            ['B070', '#22cfd0'],
            ['B050', '#75dedd'],
            ['B200', '#00a1a3'],
            ['B300', '#008788']
          ].map(config => <Rect config={config} />)}
        </Palette>
        <Palette>
          {[
            ['N700', '#0a1515'],
            ['N600', '#032228'],
            ['N500', '#06373f'],
            ['N400', '#244d55'],
            ['N300', '#3f636b'],
            ['N200', '#577880'],
            ['N100', '#63828a'],
            ['N090', '#7a959e'],
            ['N080', '#8da6af'],
            ['N070', '#a1b7bf'],
            ['N060', '#b9cad1'],
            ['N050', '#d3dfe5'],
            ['N040', '#dde7ec'],
            ['N030', '#e7eef0'],
            ['N020', '#eff5f6'],
            ['N010', '#fafbfc'],
            ['N005', '#fafbfc']
          ].map(config => <Rect config={config} />)}
        </Palette>
        <Palette>
          {[['ChartBlue200', '#52d6ff'], ['Red100', '#ff5d3b'], ['Purple100', '#0066de'], ['Green100', '#00b699']].map(
            config => <Rect config={config} />
          )}
        </Palette>
        <Palette>
          {Object.keys(colorTranslation)
            .map(type => [type, getColor(type)])
            .map(config => <Rect config={config} />)}
        </Palette>
      </div>
    </Root>
  );
}

function Palette({ children }) {
  return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{children}</div>;
}

function Rect({ config }) {
  return (
    <div
      style={{
        color: '#fff',
        minWidth: 171,
        height: 93,
        paddingTop: 60,
        paddingLeft: 20,
        marginRight: 12,
        marginBottom: 10,
        background: config[1]
      }}
    >
      {`${config[0]} - ${config[1]}`}
    </div>
  );
}
