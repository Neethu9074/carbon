import { storiesOf } from '@storybook/react';
import React from 'react';

import FlameGraph from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileFlameGraph';

storiesOf('Profiling', module)
  .addParameters({ component: FlameGraph })
  .add('Flame Graph', () => <FlameGraphStory />);

function FlameGraphStory() {
  return (
    <FlameGraph
      profile={{
        profileGraph: [
          {
            methodName: 'foo',
            fileName: 'bar',
            fileLine: 42,
            percent: 20
          },
          {
            children: [
              {
                children: [],
                methodName: 'foo',
                fileName: 'bar',
                fileLine: 42,
                percent: 60
              },
              {
                children: [
                  {
                    children: [
                      {
                        children: [],
                        methodName: 'foo',
                        fileName: 'bar',
                        fileLine: 42,
                        percent: 60
                      }
                    ],
                    methodName: 'foo',
                    fileName: 'bar',
                    fileLine: 42,
                    percent: 60
                  }
                ],
                methodName: 'foo',
                fileName: 'bar',
                fileLine: 42,
                percent: 20
              }
            ],
            methodName: 'foo',
            fileName: 'bar',
            fileLine: 42,
            percent: 80
          }
        ]
      }}
      query=""
    />
  );
}
