const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.get('/patient/:patientId', async(req, res) => {
    const { patientId } = req.params;
    const records = await prisma.medicalRecord.findMany({
        where: { patientId: parseInt(patientId) },
    });
    res.json(records);
});

router.get('/:id', async(req, res) => {
    const { id } = req.params;
    const record = await prisma.medicalRecord.findUnique({
        where: { id: parseInt(id) },
    });
    res.json(record);
});

router.post('/', async(req, res) => {
    const { patientId, recordDate, description } = req.body;
    const record = await prisma.medicalRecord.create({
        data: {
            patientId: parseInt(patientId),
            recordDate: new Date(recordDate),
            description,
        },
    });
    res.json(record);
});

router.put('/:id', async(req, res) => {
    const { id } = req.params;
    const { recordDate, description } = req.body;
    const record = await prisma.medicalRecord.update({
        where: { id: parseInt(id) },
        data: { recordDate: new Date(recordDate), description },
    });
    res.json(record);
});

router.delete('/:id', async(req, res) => {
    const { id } = req.params;
    await prisma.medicalRecord.delete({
        where: { id: parseInt(id) },
    });
    res.json({ message: 'Medical record deleted successfully' });
});

module.exports = router;