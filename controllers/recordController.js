const RecordModel = require("../models/recordModel");
const UserModel = require("../models/userModel");

exports.createRecord = async( req, res ) => {
    try {
        const { mathScore, englishScore } = req.body;
    // create a new record
    const record = new RecordModel({
        mathScore,
        englishScore,
        createdBy: req.session.user._id,
    });

    // save the record to the database
    await record.save();

    res.status(201).json({
        message: "record created successfully",
        data: record
    });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// Show all database records
exports.readRecords = async( req, res ) => {
    try {
        const records = await RecordModel.find();

        res.status(200).json({
            message: `All records; ${records.length}: are available`,
            data: records
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// Find all records of a specific user
exports.readAllRecordsOfSpecificUser = async( req, res ) => {
    try {
        const records = await RecordModel.find( { created: req.session.user._id } ).populate();

        if(!records){
            return res.status(404).json({
                message: "This user has no record"
            })
        } else {

        res.status(200).json({
            message: "All the user records.",
            data: records
        })
     }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// Find one record
exports.readRecord = async(req, res) => {
    try {
        const { id } = req.params;
        const record = await RecordModel.findById(id);

        if(!record) {
            return res.status(404).json({
                message: "Record not found"
            })
        }

        // check if the logged-in user owns the record
        if (record.createdBy.toString() !== req.session.user._id.toString()) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        res.status(200).json(record)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal error.",
            error
        })
    }
}


// Update one record
exports.updateRecord = async (req, res) => {
    try {
      const { id } = req.params;
      const record = await RecordModel.findById(id);
  
      if (!record) {
        return res.status(404).json({ message: 'Record not found' });
      }
  
      // Check if the logged-in user owns the record
      if (record.createdBy.toString() !== req.session.user._id.toString()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      record.mathScore = req.body.mathScore || record.mathScore;
      record.englishScore = req.body.englishScore || record.englishScore;
  
      // save the updated record
      await record.save();
  
      res.status(200).json({ message: 'Record updated successfully', data: record });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Delete one record
  exports.deleteRecord = async (req, res) => {
    try {
      const { id } = req.params;
      const record = await RecordModel.findById(id);
  
      if (!record) {
        return res.status(404).json({ message: 'Record not found' });
      }
  
      // Check if the logged-in user owns the record
      if (record.createdBy.toString() !== req.session.user._id.toString()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      // Remove the record from the user's records array
      const user = await UserModel.findById( req.session.user._id );
      console.log(user)
      user.records = user.records.filter((recordId) => recordId.toString() !== record._id.toString());
      await user.save();
  
      // Delete the record from the database
      await RecordModel.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };