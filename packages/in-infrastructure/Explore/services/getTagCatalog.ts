/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import getTagCatalogSubscription from 'in-infrastructure/subscriptions/getTagCatalog';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';

export default getTagCatalogOnce(getTagCatalogSubscription, true, 'infrastructure');
