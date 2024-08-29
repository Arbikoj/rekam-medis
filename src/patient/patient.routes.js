const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async(req, res) => {
    const patients = await prisma.patient.findMany();
    res.json(patients);
});

router.get('/:id', async(req, res) => {
    const { id } = req.params;
    const patient = await prisma.patient.findUnique({
        where: { id: parseInt(id) },
    });
    res.json(patient);
});

router.post('/', async(req, res) => {
    const { firstName, lastName, birthDate, gender } = req.body;
    const patient = await prisma.patient.create({
        data: { firstName, lastName, birthDate: new Date(birthDate), gender },
    });
    res.json(patient);
});

router.put('/:id', async(req, res) => {
    const { id } = req.params;
    const { firstName, lastName, birthDate, gender } = req.body;
    const patient = await prisma.patient.update({
        where: { id: parseInt(id) },
        data: { firstName, lastName, birthDate: new Date(birthDate), gender },
    });
    res.json(patient);
});

router.delete('/:id', async(req, res) => {
    const { id } = req.params;
    await prisma.patient.delete({
        where: { id: parseInt(id) },
    });
    res.json({ message: 'Patient deleted successfully' });
});

module.exports = router;