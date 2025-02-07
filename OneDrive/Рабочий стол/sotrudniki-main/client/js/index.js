import axios from "axios";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.application-form');
    const citySelect = document.querySelector('.city');
    const customCityInput = document.querySelector('.custom-city');
    const citizenshipSelect = document.querySelector('.citizenship');
    const customCitizenshipInput = document.querySelector('.custom-citizenship');

    citySelect.addEventListener('change', () => toggleInput(customCityInput, citySelect));
    citizenshipSelect.addEventListener('change', () => toggleInput(customCitizenshipInput, citizenshipSelect));

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = {
            age: +form.querySelector('.age').value,
            experience: +form.querySelector('.experience').value,
            criminal: form.querySelector('.criminal').value,
            position: form.querySelector('.position').value,
            city: citySelect.value === 'other' ? customCityInput.value : citySelect.value,
            citizenship: citizenshipSelect.value === 'other' ? customCitizenshipInput.value : citizenshipSelect.value,
            query: form.querySelector('.query').value
        };
        await submitForm(formData);
    });
});

const toggleInput = (input, select) => {
    input.style.display = select.value === 'other' ? 'block' : 'none';
    input.required = select.value === 'other';
};

const submitForm = async (data) => {
    const progressContainer = document.querySelector('.progress-container');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const responseMessage = document.querySelector('.response-message');

    try {
        progressContainer.style.display = 'block';
        const response = await axios.post('http://localhost:5000/submit', data);
        const totalPages = response.data.totalPages;

        for (let index = 0; index < totalPages; index++) {
            const progress = ((index + 1) / totalPages) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `Обработано страниц: ${index + 1} из ${totalPages}`;
        }

        displayMessage(response.data.message, 'success');
    } catch (error) {
        console.error('Ошибка:', error);
        displayMessage(error.response?.data?.error || 'Ошибка при отправке данных.', 'error');
    }
};

const displayMessage = (message, type) => {
    const responseMessage = document.querySelector('.response-message');
    responseMessage.textContent = message;
    responseMessage.style.color = type === 'success' ? 'green' : 'red';
    responseMessage.style.display = 'block';
};

