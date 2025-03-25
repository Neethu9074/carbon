/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import FlameGraph from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileFlameGraph';

export default {
  component: FlameGraph
};

export function Default() {
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
                        percent: 20
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
