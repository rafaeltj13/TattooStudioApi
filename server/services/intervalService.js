const intervalService = {};

intervalService.getInitialAvailableHoursInterval = (morning, afternoon, night) => {
    try {
        const availableHours = [];

        for (i = morning[0]; i <= morning[1]; i++) {
            availableHours.push([i, (i + 1)]);
        }

        for (i = afternoon[0]; i <= afternoon[1]; i++) {
            availableHours.push([i, (i + 1)]);
        }

        for (i = night[0]; i <= night[1]; i++) {
            availableHours.push([i, (i + 1)]);
        }

        return availableHours;
    } catch (e) {
        return [];
    }
};

intervalService.getAvailableHours = (initialAvailableHours, appointments, date) => {
    let availableHours = initialAvailableHours;

    appointments.forEach(appointment => {
        appointment.dates.forEach(appointmentDate => {
            if (new Date(appointmentDate.date).setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0)) {
                availableHours = initialAvailableHours.filter(element => !(appointmentDate.start <= element[0] && appointmentDate.end >= element[1]))
            }
        })
    });

    return availableHours;
};

intervalService.getAvailableIntervals = (availableHours, interval) => {
    const availableIntervals = [];

    if (interval < 2) return availableHours

    availableHours.forEach((hourInterval, index) => {
        let initialInterval = hourInterval[0];

        for (i = index; i < availableHours.length - 1; i++) {
            if (!(availableHours[i][1] === availableHours[i + 1][0])) {
                initialInterval = availableHours[i + 1][0];
                break;
            }

            if (availableHours[i + 1][1] - initialInterval === interval) {
                availableIntervals.push([initialInterval, availableHours[i + 1][1]])
            }
        }
    });

    return availableIntervals;
};

module.exports = intervalService;