const express = require('express');
const path = require('path');
const authRoutes = require('./server/auth/auth.route');
const customerRoutes = require('./server/customer/customer.route');
const artistRoutes = require('./server/artist/artist.route');
const appointmentRoutes = require('./server/appointment/appointment.route');
const tattooRoutes = require('./server/tattoo/tattoo.route');
const scheduleRoutes = require('./server/schedule/schedule.route');

const router = express.Router(); // eslint-disable-line new-cap

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/artists', artistRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/tattoos', tattooRoutes);
router.use('/schedules', scheduleRoutes);

router.use('/images', express.static(path.join(__dirname, '/images')));

module.exports = router;
