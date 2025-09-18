function addClassOnScroll(selector, className, scrollPoint) {
    const element = document.querySelector(selector);
    if (!element) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY >= scrollPoint) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    });
}

addClassOnScroll("#menu", "scrolled", 10);