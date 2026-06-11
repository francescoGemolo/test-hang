const submitBtn = document.getElementById('submitBtn');

function validateField(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    const group = input.closest('.form-group');
    const isEmpty = input.value.trim() === '';

    if (isEmpty) {
        input.classList.add('input-error');
        group.classList.add('has-error');
    } else {
        input.classList.remove('input-error');
        group.classList.remove('has-error');
    }

    return !isEmpty;
}

['nickname', 'whatsapp'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        const errorId = `${id}-error`;
        validateField(id, errorId);
    });
});

submitBtn.addEventListener('click', () => {
    const nicknameValid = validateField('nickname', 'nickname-error');
    const whatsappValid = validateField('whatsapp', 'whatsapp-error');

    if (nicknameValid && whatsappValid) {
        window.location.href = 'events.html';
    }
});