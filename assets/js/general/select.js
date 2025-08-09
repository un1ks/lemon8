document.querySelectorAll('.custom__select').forEach(wrapper => {
    const select = wrapper.querySelector('.default');
    const trigger = wrapper.querySelector('.trigger');
    const optionsContainer = wrapper.querySelector('.options');
    const options = wrapper.querySelectorAll('.option');

    trigger.addEventListener('click', () => {
        document.querySelectorAll('.options.open').forEach(openOptions => {
            if (openOptions !== optionsContainer) {
                openOptions.classList.remove('open');
            }
        });

        optionsContainer.classList.toggle('open');
    });


    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.getAttribute('data-value');
            select.value = value;
            trigger.textContent = option.textContent;

            optionsContainer.classList.remove('open');

            select.dispatchEvent(new Event('change'));
        });
    });

    select.addEventListener('change', () => {
        const selectedOption = wrapper.querySelector(`.option[data-value="${select.value}"]`);
        if (selectedOption) {
            trigger.textContent = selectedOption.textContent;
        }
    });

    const initialOption = wrapper.querySelector(`.option[data-value="${select.value}"]`);
    if (initialOption) {
        trigger.textContent = initialOption.textContent;
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom')) {
        document.querySelectorAll('.options.open').forEach(el => el.classList.remove('open'));
    }
});