const submitBtn = document.getElementById('submitBtn');

function validateField(inputId, errorId, isValid) {
    const group = document.getElementById(inputId).closest('.form-group');
    group.classList.toggle('has-error', !isValid);
    document.getElementById(inputId).classList.toggle('input-error', !isValid);
    return isValid;
}

submitBtn.addEventListener('click', () => {
    const nickname = document.getElementById('nickname').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();

    const nicknameValid = validateField('nickname', 'nickname-error', nickname.length > 0);
    const whatsappValid = validateField('whatsapp', 'whatsapp-error', whatsapp.length > 0);

    if (nicknameValid && whatsappValid) {
        window.location.href = 'events.html';
    }
});