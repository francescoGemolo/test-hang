const requiredFields = [
    { id: 'event-title', errorId: 'event-title-error' },
    { id: 'event-date', errorId: 'event-date-error' },
    { id: 'event-time', errorId: 'event-time-error' },
    { id: 'event-location', errorId: 'event-location-error' },
    { id: 'event-max-participants', errorId: 'event-max-participants-error' },
];

function validateField(inputId) {
    const input = document.getElementById(inputId);
    const group = input.closest('.form-group');

    let isEmpty;
    if (inputId === 'event-max-participants') {
        const val = parseInt(input.value, 10);
        isEmpty = input.value.trim() === '' || isNaN(val) || val < 2;
    } else {
        isEmpty = input.value.trim() === '';
    }

    if (isEmpty) {
        input.classList.add('input-error');
        group.classList.add('has-error');
    } else {
        input.classList.remove('input-error');
        group.classList.remove('has-error');
    }

    return !isEmpty;
}

requiredFields.forEach(({ id }) => {
    document.getElementById(id).addEventListener('input', () => validateField(id));
    document.getElementById(id).addEventListener('change', () => validateField(id));
});

document.getElementById('submitBtn').addEventListener('click', () => {
    const allValid = requiredFields
        .map(({ id }) => validateField(id))
        .every(Boolean);

    if (allValid) {
        window.location.href = 'events.html';
    }
});