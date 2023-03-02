/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error js to tsx migration
import SloList from 'promise-loader?global!in-service-levels/SloList';
import { Route } from 'react-router';
import React from 'react';

// @ts-expect-error js to tsx migration
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { sloList } from 'in-service-levels/navigation/path';

export default [<Route key="slo" path={sloList} children={renderAsyncRouteChildren(SloList)} />];
