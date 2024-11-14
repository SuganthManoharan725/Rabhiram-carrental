// Function to load YAML file and render car data
function loadYAML() {
    fetch('car-rental.yaml')  // Path to your YAML file
        .then(response => response.text())
        .then(yamlText => {
            // Parse YAML content into JavaScript object
            const carData = jsyaml.load(yamlText);

            // Render the car cards
            renderCarCards(carData);
        })
        .catch(error => {
            console.error("Error loading the YAML file:", error);
        });
}

// Function to render car cards
function renderCarCards(carData) {
    const carCardsContainer = document.getElementById('carCards');
    carCardsContainer.innerHTML = ''; // Clear the container

    // Loop through each car and create a card for each one
    carData.cars.forEach((car, index) => {
        const cardHTML = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="rating">
                        <span>${car.rating}</span>
                        <i class="fas fa-star"></i>
                    </div>
                    <img src="${car.image_url}" alt="Car Image" class="card-img-top">
                    <div class="card-body">
                        <h3>${car.name} - ₹${car.price}/-</h3>
                        <div class="details">
                            ${car.hoursrate.map(detail => `
                                <div>
                                    <p>${detail.label}</p>
                                    <div class="circular">${detail.value}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="details">
                            ${car.details.map(detail => `
                                <div>
                                    <p>${detail.label}</p>
                                    <div class="rectangular">${detail.value}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="details">
                            ${car.carfacility.map(facility => `
                                <div>
                                    <p>${facility.label}</p>
                                    <i class="${facility.icon} icon-type"></i>
                                    <p>${facility.value}</p>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="booking-opt">
                            <a href="${car.booking_options.message_phone}" class="btn btn-primary"><i class="fas fa-phone" style="font-size: 23px;"></i></a>
                            <a href="javascript:void(0);" class="btn btn-success message" >
                                <i class="fas fa-paper-plane" data-index="${index}"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // Add the card HTML to the container
        carCardsContainer.innerHTML += cardHTML;
    });

    // Attach event listeners for the message buttons after the cards are rendered
    const messageButtons = document.querySelectorAll('.message');
    messageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const carIndex = e.target.getAttribute('data-index');
            const car = carData.cars[carIndex];

            // Set Popup Title dynamically based on the car name
            const popupTitle = document.getElementById('popupTitle');
            popupTitle.querySelector('h3').textContent = car.name;

            // Populate Static Form Fields with Car Data
            populateFormWithCarData(car);

            // Show the popup
            document.getElementById('popupForm').style.display = 'block';
        });
    });
}

// Function to populate the static form with car-specific data
function populateFormWithCarData(car) {
    // Populate the fields with data from the selected car
    document.getElementById('name').value = '';  // User will fill this
    document.getElementById('phone').value = '';  // User will fill this
    document.getElementById('alternativephone').value = ''; // User will fill this
    document.getElementById('email').value = '';  // User will fill this
    document.getElementById('address').value = '';
    document.getElementById('drivingLicense-file').value = '';  // User will upload this
    document.getElementById('aadhar-file').value = '';  // User will upload this
    document.getElementById('pan-file').value = '';  // User will upload this
    
    // Optionally, set default values for dates and times
    document.getElementById('pickupDate').value = '';  // Leave it empty or set default value if necessary
    document.getElementById('dropDate').value = '';    // Leave it empty or set default value if necessary
    document.getElementById('pickupTime').value = '';  // Leave it empty or set default value if necessary
    document.getElementById('dropTime').value = '';    // Leave it empty or set default value if necessary
}

// Close the popup when the close button is clicked
document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('popupForm').style.display = 'none';
});

// Submit the popup when the close button is clicked
document.getElementById('submitBtn2').addEventListener('click', () => {
    const bookingForm = document.getElementById('bookingForm');
  
  // Simulate the form submit event
  if (bookingForm) {
    bookingForm.requestSubmit(); // This will trigger the submit event listener from the second script
  } else {
    console.error('Booking form not found');
  }
});

// Load the YAML data and initialize everything on page load
window.onload = loadYAML;
