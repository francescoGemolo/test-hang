document.querySelectorAll('.menu-wrapper').forEach(wrapper => {
    const trigger = wrapper.querySelector('.menu-trigger');
    const dropdown = wrapper.querySelector('.dropdown');

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        closeAllMenus();
        trigger.classList.toggle('open', !isOpen);
        dropdown.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen);
    });
});

function closeAllMenus() {
    document.querySelectorAll('.menu-trigger').forEach(trig => {
        trig.classList.remove('open');
        trig.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.dropdown').forEach(drop => drop.classList.remove('open'));
}

document.addEventListener('click', closeAllMenus);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllMenus();
});

const fab = document.querySelector('.btn-fab');
let lastScrollY = window.scrollY;
let scrollTimeout;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;

    fab.classList.add('scrolling');
    fab.classList.toggle('hide-on-scroll', scrollingDown && currentScrollY > 80);

    lastScrollY = currentScrollY;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        fab.classList.remove('scrolling');
        fab.classList.remove('hide-on-scroll');
    }, 600);
});