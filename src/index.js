const express = require('express');

const app = express();
const patientsRouter = require('./patient/patient.routes');
const recordsRouter = require('./records/records.routes');
const rfidRouter = require('./rfid/rfid.routes');

app.use(express.json());

app.use('/api/patients', patientsRouter);
app.use('/api/records', recordsRouter);
app.use('/api/rfid', rfidRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});