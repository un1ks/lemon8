

document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
        const input = button.closest('.password-wrapper').querySelector('.password-input');
        const isPassword = input.type === 'password';

        input.type = isPassword ? 'text' : 'password';
        button.classList.toggle('show', !isPassword);
        button.classList.toggle('hide', isPassword);

    });
});



function setupFormValidation(form) {
    const inputs = form.querySelectorAll("input");
    const button = form.querySelector("button[type='submit']");

    function checkInputs() {
        const allFilled = Array.from(inputs).every(input => input.value.trim() !== "");
        button.disabled = !allFilled;
    }

    inputs.forEach(input => input.addEventListener("input", checkInputs));

    checkInputs();
}

document.querySelectorAll(".validateForm").forEach(setupFormValidation);