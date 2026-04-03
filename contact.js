function validateField(field) {
    var errorEl = document.getElementById(field.id + '-error');
    if (!errorEl) return true;

    var valid = field.checkValidity();

    if (valid) {
        errorEl.classList.remove('visible');
    } else {
        errorEl.classList.add('visible');
    }

    return valid;
}

function handleSubmit(event) {
    event.preventDefault();

    var form = document.getElementById('contact-form');
    var fields = form.querySelectorAll('input, select, textarea');
    var allValid = true;

    fields.forEach(function (field) {
        if (!validateField(field)) {
            allValid = false;
        }
    });

    if (allValid) {
        form.submit();
    }
}

function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', handleSubmit);

    var fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(function (field) {
        field.addEventListener('input', function () {
            validateField(this);
        });
        field.addEventListener('blur', function () {
            validateField(this);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initContactForm();
});
