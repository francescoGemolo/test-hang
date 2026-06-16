const submitBtn = document.getElementById('submitBtn');

function validateField(inputId) {
    const input = document.getElementById(inputId);
    const group = input.closest('.form-group');
    const isValid = input.value.trim().length > 0;
    group.classList.toggle('has-error', !isValid);
    input.classList.toggle('input-error', !isValid);
    return isValid;
}

submitBtn.addEventListener('click', () => {
    const requiredFields = [
        'event-title',
        'event-date',
        'event-time',
        'event-location',
        'event-max-participants'
    ];

    const allValid = requiredFields
        .map(validateField)
        .every(Boolean);

    if (allValid) {
        window.location.href = 'events.html';
    }
});