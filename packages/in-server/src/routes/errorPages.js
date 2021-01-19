/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
const express = require('express');

const errorPages = require('../errorPages');

const router = (module.exports = express.Router());

router.get('/errorPages/403', errorPages.send403);
router.get('/errorPages/404', errorPages.send404);
router.get('/errorPages/500', errorPages.send500);
router.get('/errorPages/maintenance', errorPages.sendMaintenance);
