const trigger = document.getElementById('menuTrigger');
const dropdown = document.getElementById('dropdown');

function setOpen(val) {
    trigger.classList.toggle('open', val);
    dropdown.classList.toggle('open', val);
    trigger.setAttribute('aria-expanded', val);
}

trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!dropdown.classList.contains('open'));
});

document.addEventListener('click', () => setOpen(false));
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
});