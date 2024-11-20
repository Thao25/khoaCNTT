const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    documentPath:  { type: String, required: true },
    uploadedDate: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
