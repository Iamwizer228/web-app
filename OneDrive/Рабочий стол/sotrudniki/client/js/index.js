document.addEventListener('DOMContentLoaded', () => {
    const citySelect = document.getElementById('city');
    const customCityInput = document.getElementById('custom-city');
    const citizenshipSelect = document.getElementById('citizenship');
    const customCitizenshipInput = document.getElementById('custom-citizenship');

    citySelect.addEventListener('change', function() {
        if (this.value === 'other') {
            customCityInput.style.display = 'block';
            customCityInput.required = true;
        } else {
            customCityInput.style.display = 'none';
            customCityInput.required = false;
        }
    });

    citizenshipSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            customCitizenshipInput.style.display = 'block';
            customCitizenshipInput.required = true;
        } else {
            customCitizenshipInput.style.display = 'none';
            customCitizenshipInput.required = false;
        }
    });
});
