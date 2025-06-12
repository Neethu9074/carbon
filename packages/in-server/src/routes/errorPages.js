/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const express = require('express');
const i18next = require('../i18n');
const middleware = require('i18next-http-middleware');

const errorPages = require('../errorPages');

const router = (module.exports = express.Router());

/* Uncomment these lines to test direct invocation of the 403 page,
   but only for testing purposes, these lines should remain commented in the code.
   Because the function signatures do not match express will not
   invoke the 403 page directly via the url. The 403 page is
   redirected directly to the render of the page from detection of authorization issues upstream.
   router.get('/errorPages/403', middleware.handle(i18next), (req, res) =>
     errorPages.send403(req, res, { email: 'a@b' }, `/auth/signOut`, '/auth/test', null)
  );
*/
router.get('/errorPages/403', middleware.handle(i18next), errorPages.send403);
router.get('/errorPages/404', middleware.handle(i18next), errorPages.send404);
router.get('/errorPages/500', middleware.handle(i18next), errorPages.send500);
router.get('/errorPages/maintenance', middleware.handle(i18next), errorPages.sendMaintenance);
