const express = require("express");
const router = express.Router();
const recordController = require( '../controllers/recordController' );
const autMiddleware = require( '../middlewares/authMidleware' );

router.post( '/records', autMiddleware.isLoggedIn, recordController.createRecord );

router.get('/records', autMiddleware.isLoggedIn, recordController.readAllRecordsOfSpecificUser);

router.get('/records/:id', autMiddleware.isLoggedIn, recordController.readRecord)
router.get('/Allrecords', autMiddleware.isLoggedIn, recordController.readRecords);

router.put( "/records/:id", autMiddleware.isLoggedIn, recordController.updateRecord);
router.delete( "/records/:id", autMiddleware.isLoggedIn, recordController.deleteRecord)



module.exports = router