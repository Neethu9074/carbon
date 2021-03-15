/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import genericLogSpanDefinition from 'in-forge/tracing/log/genericLogSpanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition(genericLogSpanDefinition);
