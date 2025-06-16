/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

/* eslint-disable import/prefer-default-export */

import { notBlankValidator } from "formalistic";

import { composeAndShortCircuitOnError } from "in-services/validators/compose";
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';

export const nameValidator = composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
