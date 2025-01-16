
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
import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const PORT = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.post('/search', (req, res) => {
    const searchData = req.body
    res.json(searchData)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
