/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';

import { TeamTagEx } from 'in-synthetics/utils/constants';

const getDefaultTeams = (form: MapForm<any>): TeamTagEx[] => {
  const teams = (form.get('rbacTags') as Field<TeamTagEx[]>).value;
  return teams;
};

export default getDefaultTeams;
