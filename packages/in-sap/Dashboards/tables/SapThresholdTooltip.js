/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SvgIconSizes } from '@instana/components';
import { themes } from '@instana/design-tokens';

import { HealthDot } from 'in-sap/Dashboards/tables/HealthDot.js';

import locals from 'in-sap/Dashboard.mless';

export default function SapThresholdTooltip({ type, yellowToGreen, greenToYellow, redToYellow, yellowToRed, unit }) {
  if (!unit) {
    unit = 'c';
  }

  if (type === 'availability') {
    return (
      <div>
        <div className={locals.availcontainer}>
          <div className={locals.leftcontent}>
            <table>
              <tr>
                <td>
                  <HealthDot color={themes.default.ids.color.option.green['500']} iconSize={SvgIconSizes.xxs} />
                </td>
                <td>{'Green'}</td>
              </tr>
              <tr>
                <td>
                  <HealthDot color={themes.default.ids.color.option.yellow['500']} iconSize={SvgIconSizes.xxs} />
                </td>
                <td>{'Yellow'}</td>
              </tr>
              <tr>
                <td>
                  <HealthDot color={themes.default.ids.color.option.red['500']} iconSize={SvgIconSizes.xxs} />
                </td>
                <td>{'Red'}</td>
              </tr>
            </table>
          </div>
          <div className={locals.rightcontent}>
            <table>
              <tr>
                <td>{getValue(yellowToGreen)}</td>
              </tr>
              <tr>
                <td>{getValue(yellowToRed)}</td>
              </tr>
              <tr>
                <td>{getValue(yellowToRed)}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className={locals.container}>
          <table className={locals.table}>
            <tr>
              <td>{'Yellow - Green'}</td>
              <td>
                <HealthDot color={themes.default.ids.color.option.yellow['500']} iconSize={SvgIconSizes.xxs} />
              </td>
              <td>{'-'}</td>
              <td>
                <HealthDot color={themes.default.ids.color.option.green['500']} iconSize={SvgIconSizes.xxs} />
              </td>
              <td>{getValue(yellowToGreen)}</td>
              <td>{unit}</td>
            </tr>
            <tr>
              <td>{'Green - Yellow'}</td>
              <td>
                <HealthDot color={themes.default.ids.color.option.green['500']} iconSize={SvgIconSizes.xxs} />
              </td>
              <td>{'-'}</td>
              <td>
                <HealthDot color={themes.default.ids.color.option.yellow['500']} iconSize={SvgIconSizes.xxs} />
              </td>
              <td>{getValue(greenToYellow)}</td>
              <td>{unit}</td>
            </tr>
            <tr>
              <td>{'Red - Yellow'}</td>
              <td>
                <HealthDot color={themes.default.ids.color.option.red['500']} iconSize={SvgIconSizes.xxs} />
              </td>
              <td>{'-'}</td>
              <td>
                <HealthDot color={themes.default.ids.color.option.yellow['500']} iconSize={SvgIconSizes.xxs} />
              </td>
              <td>{getValue(redToYellow)}</td>
              <td>{unit}</td>
            </tr>
            <tr>
              <td>{'Yellow - Red'}</td>
              <td>
                <HealthDot color={themes.default.ids.color.option.yellow['500']} iconSize={SvgIconSizes.xxs} />
              </td>
              <td>{'-'}</td>
              <td>
                <HealthDot color={themes.default.ids.color.option.red['500']} iconSize={SvgIconSizes.xxs} />
              </td>
              <td>{getValue(yellowToRed)}</td>
              <td>{unit}</td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}

function getValue(value) {
  if (isNaN(value)) {
    return '-';
  }
  return value.toString();
}
