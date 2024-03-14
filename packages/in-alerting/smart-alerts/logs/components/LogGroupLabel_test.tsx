/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import renderer from 'react-test-renderer';
import React from 'react';

import { Group } from '@instana/types';

import { LogGroupLabel } from 'in-alerting/smart-alerts/logs/components/LogGroupLabel';
import data from 'in-alerting/smart-alerts/logs/data/alertConfigData.json';
import { CatalogResponse } from 'in-logging/api/catalog';

describe('in-alerting/smart-alerts/logs/components/LogGroupLabel', () => {
  it('renders correctly when given log groups and tag catalog data', async () => {
    const groups: Group[] = [
      {
        groupbyTag: 'log.streamName',
        groupbyTagEntity: 'NOT_APPLICABLE',
        groupbyTagSecondLevelKey: undefined
      }
    ];
    const tagCatalog: CatalogResponse = data.tagCatalog;

    const tree = await renderer.create(<LogGroupLabel groups={groups} tagCatalog={tagCatalog} />).toJSON();

    expect(tree).toMatchInlineSnapshot(`
      <div
        className="local-css-container"
      >
        <div
          className=""
        >
          Logs
          <svg
            aria-hidden={true}
            className="svg-icon local-css-icon"
            fill="currentColor"
            focusable="false"
            height={24}
            preserveAspectRatio="xMidYMid meet"
            style={
              Object {
                "fill": undefined,
                "maxHeight": "24px",
                "maxWidth": "24px",
                "minHeight": "24px",
                "minWidth": "24px",
              }
            }
            viewBox="0 0 32 32"
            width={24}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8L22 16 12 24z"
            />
          </svg>
          Stream Name
        </div>
      </div>
    `);
  });

  it('renders correctly when given no log groups or tag catalog data', async () => {
    const tree = await renderer.create(<LogGroupLabel groups={[]} tagCatalog={undefined} />).toJSON();
    expect(tree).toMatchInlineSnapshot(`null`);
  });
});
