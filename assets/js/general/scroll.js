const scrollbar = document.querySelector('.le__scrollbar');
const thumb = document.querySelector('.le__sthumb');

function updateThumbSize() {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const trackHeight = scrollbar.clientHeight;

    const ratio = clientHeight / scrollHeight;
    const thumbHeight = Math.max(ratio * trackHeight, 30);

    thumb.style.height = `${thumbHeight}px`;
}

function updateThumbPosition() {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const maxScroll = scrollHeight - clientHeight;

    const trackHeight = scrollbar.clientHeight;
    const thumbHeight = thumb.offsetHeight;
    const maxThumbTop = trackHeight - thumbHeight;

    const scrollRatio = scrollTop / maxScroll;
    thumb.style.top = `${scrollRatio * maxThumbTop}px`;
}

// 👇 THIS is the core fix
let isDragging = false;
let initialMouseY = 0;
let initialScrollY = 0;

thumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    thumb.style.cursor = 'grabbing';
    initialMouseY = e.clientY;
    initialScrollY = window.scrollY;
    document.body.style.userSelect = 'none';

    const onMouseMove = (eMove) => {
        if (!isDragging) return;

        const deltaY = eMove.clientY - initialMouseY;

        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const trackHeight = scrollbar.clientHeight;
        const thumbHeight = thumb.offsetHeight;
        const maxScroll = scrollHeight - clientHeight;
        const maxThumbTop = trackHeight - thumbHeight;

        const scrollPerPixel = maxScroll / maxThumbTop;

        const newScrollY = initialScrollY + deltaY * scrollPerPixel;

        window.scrollTo({
            top: newScrollY,
            behavior: 'auto'
        });
    };

    const onMouseUp = () => {
        isDragging = false;
        thumb.style.cursor = 'grab';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

// Click track to jump
scrollbar.addEventListener('click', (e) => {
    if (e.target === thumb) return;

    const rect = scrollbar.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const trackHeight = scrollbar.clientHeight;
    const thumbHeight = thumb.offsetHeight;
    const maxThumbTop = trackHeight - thumbHeight;

    const ratio = Math.min(clickY / maxThumbTop, 1);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    window.scrollTo({
        top: ratio * maxScroll,
        behavior: 'smooth'
    });
});

// Sync on scroll/resize
window.addEventListener('scroll', updateThumbPosition);
window.addEventListener('resize', () => {
    updateThumbSize();
    updateThumbPosition();
});

// Init
updateThumbSize();
updateThumbPosition();
