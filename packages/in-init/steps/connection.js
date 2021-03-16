/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { init as initClientErrorMessages } from 'in-connection/clientErrorMessages';
import { init as initConnection } from 'in-connection';

initConnection();
initClientErrorMessages();
