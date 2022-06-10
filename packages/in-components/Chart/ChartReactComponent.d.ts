/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Config } from 'in-components/Chart/types';

export type ChartReactComponentProps = Omit<Config, 'width' | 'height'>;
declare function ChartReactComponent(props: ChartReactComponentProps): JSX.Element;

export default ChartReactComponent;
