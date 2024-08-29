const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.get('/:tag', async(req, res) => {
    const { tag } = req.params;

    try {
        let rfid = await prisma.rFID.findUnique({
            where: { tag },
            include: {
                patient: {
                    include: {
                        medicalRecords: true,
                    },
                },
            },
        });

        if (!rfid) {
            rfid = await prisma.rFID.create({
                data: {
                    tag,
                },
            });

            return res.json({
                message: 'RFID tag not found. New RFID tag created.',
                rfid,
                patient: null,
                medicalRecords: [],
            });
        }

        const response = {
            message: 'RFID tag information retrieved successfully',
            rfid: {
                id: rfid.id,
                tag: rfid.tag,
                patient: rfid.patient ? {
                    id: rfid.patient.id,
                    firstName: rfid.patient.firstName,
                    lastName: rfid.patient.lastName,
                    birthDate: rfid.patient.birthDate,
                    gender: rfid.patient.gender,
                    medicalRecords: rfid.patient.medicalRecords,
                } : null,
            },
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while retrieving RFID information' });
    }
});

router.put('/:tag/:patientId', async(req, res) => {
    const { tag, patientId } = req.params;

    try {
        const rfid = await prisma.rFID.findUnique({
            where: { tag },
        });

        if (!rfid) {
            return res.status(404).json({ message: 'RFID tag not found' });
        }

        const patient = await prisma.patient.findUnique({
            where: { id: parseInt(patientId) },
        });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const updatedRFID = await prisma.rFID.update({
            where: { tag },
            data: { patient: { connect: { id: parseInt(patientId) } } },
        });

        res.json({
            message: 'RFID tag successfully linked to patient',
            rfid: updatedRFID,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while linking RFID to patient' });
    }
});


router.delete('/:tag/:patientId', async(req, res) => {
    const { tag, patientId } = req.params;

    try {
        const rfid = await prisma.rFID.findUnique({
            where: { tag },
            include: { patient: true },
        });

        if (!rfid) {
            return res.status(404).json({ message: 'RFID tag not found' });
        }

        if (!rfid.patient || rfid.patient.id !== parseInt(patientId)) {
            return res.status(400).json({ message: 'RFID tag is not linked to the specified patient' });
        }

        const updatedRFID = await prisma.rFID.update({
            where: { tag },
            data: { patient: { disconnect: true } },
        });

        res.json({
            message: 'RFID tag successfully unlinked from patient',
            rfid: updatedRFID,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while unlinking RFID from patient' });
    }
});

router.delete('/:tag', async(req, res) => {
    const { tag } = req.params;

    try {
        const rfid = await prisma.rFID.findUnique({
            where: { tag },
            include: { patient: true },
        });

        if (!rfid) {
            return res.status(404).json({ message: 'RFID tag not found' });
        }

        await prisma.rFID.delete({
            where: { tag },
        });

        res.json({
            message: 'RFID tag successfully deleted',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting RFID tag' });
    }
});

module.exports = router;