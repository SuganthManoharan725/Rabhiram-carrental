document.addEventListener("DOMContentLoaded", function() {
    // Event listeners for date and time inputs
    document.getElementById('pickupDate').addEventListener('change', calculateEstimate);
    document.getElementById('dropDate').addEventListener('change', calculateEstimate);
    document.getElementById('pickupTime').addEventListener('change', calculateEstimate);
    document.getElementById('dropTime').addEventListener('change', calculateEstimate);

    function calculateEstimate() {
        const pickDate = document.getElementById('pickupDate').value;
        const dropDate = document.getElementById('dropDate').value;
        const pickTime = document.getElementById('pickupTime').value;
        const dropTime = document.getElementById('dropTime').value;

        // Check if all fields are filled
        if (pickDate && dropDate && pickTime && dropTime) {
            const pickDateTime = `${pickDate}T${pickTime}`;
            const dropDateTime = `${dropDate}T${dropTime}`;
        
            const pickDateObj = new Date(pickDateTime);
            const dropDateObj = new Date(dropDateTime);
        
            // If both dates are valid and drop-off is after pick-up
            if (pickDateObj && dropDateObj && pickDateObj < dropDateObj) {
                const durationInMillis = dropDateObj - pickDateObj;
                const durationInHours = durationInMillis / (1000 * 60 * 60);
                
                let estimatedAmount;
        
                // Get selected car name
                const carType = document.getElementById('carName').value;
        
                // Pricing logic based on selected car type
                const calculatePricing = (carType, durationInHours) => {
                    let baseRate = 0;
                    let hourlyRate = 0;
                    let minDuration = 8;
                    let maxDuration = 24;
                    let twelvehrrate = 0;
                    let eighthrrate = 0;
        
                    // Pricing configuration
                    if (carType.includes('Kia Carens - MUV')) {
                        baseRate = 4000; // 24hr price
                        twelvehrrate = 3500;
                        eighthrrate = 3000;
                        hourlyRate = 300; // Extra hour charge
                    } else if (carType.includes('Mahindra Scorpio - SUV')) {
                        baseRate = 3500; // 24hr price
                        twelvehrrate = 3000;
                        eighthrrate = 2500;
                        hourlyRate = 300; // Extra hour charge
                    } else if (carType.includes('Maruti Brezza - SUV')) {
                        baseRate = 3200; // 24hr price
                        twelvehrrate = 2700;
                        eighthrrate = 2200;
                        hourlyRate = 250; // Extra hour charge
                    } else {
                        baseRate = 2500; // Default 24hr price
                        twelvehrrate = 2000;
                        eighthrrate = 1500;
                        hourlyRate = 200; // Default extra hour charge
                    }
        
                    // Full day duration in hours
                    const fullDayRate = baseRate;
        
                    // If the total duration is more than 24 hours, calculate full days and extra hours
                    if (durationInHours >= 24) {
                        const totalDays = Math.floor(durationInHours / 24); // Full days
                        const remainingHours = durationInHours % 24; // Remaining hours
        
                        estimatedAmount = totalDays * fullDayRate; // Total for full days
        
                        // Now handle remaining hours
                        if (remainingHours > 0 && remainingHours < 8) {
                            estimatedAmount += hourlyRate * remainingHours; // Charge for extra hours
                        } else if (remainingHours == 8) {
                            estimatedAmount += eighthrrate; // Charge for 8hr block
                        } else if (remainingHours > 8 && remainingHours <= 12) {
                            estimatedAmount += twelvehrrate; // Charge for 12hr block
                        } else if (remainingHours > 12 && remainingHours <= 23) {
                            estimatedAmount += baseRate; // Charge for 24hr block
                        }
                    } else {
                        // For durations less than a day (e.g., 8 hours, 12 hours)
                        if (durationInHours == 8) {
                            estimatedAmount = eighthrrate;
                        } else if (durationInHours <= 12) {
                            estimatedAmount = twelvehrrate;
                        } else if (durationInHours <= 24) {
                            estimatedAmount = baseRate;
                        }
                    }
        
                    return estimatedAmount;
                }
        
                // Calculate the estimated amount
                estimatedAmount = calculatePricing(carType, durationInHours);
        
                // Update the estimated amount field
                document.getElementById('estimate-amount').value = estimatedAmount + ' INR';
            } else {
                document.getElementById('estimate-amount').value = 'Please fill all fields';
            }
        }            
    }

    // Helper function to read files as base64
    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result.split(',')[1]);  // Base64 encoded file content (remove the "data:[mime-type];base64," part)
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsDataURL(file);  // Read the file as base64
        });
    }

    // Form submission logic
    document.getElementById('bookingForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get form data
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const alternative = document.getElementById('alternativephone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const pickDate = document.getElementById('pickupDate').value;
        const dropDate = document.getElementById('dropDate').value;
        const pickTime = document.getElementById('pickupTime').value;
        const dropTime = document.getElementById('dropTime').value;
        const carName = document.getElementById('carName').value;
        const estimatedAmount = document.getElementById('estimate-amount').value;

        // Get file uploads
        const aadharFile = document.getElementById('aadhar-file').files[0];
        const panFile = document.getElementById('pan-file').files[0];
        const drivingLicenseFile = document.getElementById('drivingLicense-file').files[0];

        // Change button to loading state
        const submitButton = document.getElementById('submitBtn2');
        submitButton.disabled = true; // Disable the submit button
        submitButton.innerHTML = 'Loading... <div class="spinner-border spinner-border-sm" role="status"></div>'; // Show spinner

        // Prepare email content
        const emailContent = `
            <h2>New Car Rental Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone Number:</strong> ${phone}</p>
            <p><strong>Alternative Phone Number:</strong> ${alternative}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Pick-up Date:</strong> ${pickDate}</p>
            <p><strong>Drop-off Date:</strong> ${dropDate}</p>
            <p><strong>Pick-up Time:</strong> ${pickTime}</p>
            <p><strong>Drop-off Time:</strong> ${dropTime}</p>
            <p><strong>Car Selected:</strong> ${carName}</p>
            <p><strong>Estimated Amount:</strong> ${estimatedAmount}</p>
        `;

        // Prepare attachments (convert to base64)
        const attachments = [];
        if (aadharFile) {
            const aadharBase64 = await readFileAsBase64(aadharFile);
            attachments.push({
                name: aadharFile.name,
                content: aadharBase64,
                contentType: aadharFile.type,
            });
        }

        if (panFile) {
            const panBase64 = await readFileAsBase64(panFile);
            attachments.push({
                name: panFile.name,
                content: panBase64,
                contentType: panFile.type,
            });
        }

        if (drivingLicenseFile) {
            const drivingLicenseBase64 = await readFileAsBase64(drivingLicenseFile);
            attachments.push({
                name: drivingLicenseFile.name,
                content: drivingLicenseBase64,
                contentType: drivingLicenseFile.type,
            });
        }

        // Send email via Sendinblue API
        try {
            const emailPayload = {
                sender: { email: 'romansuganth1762001@gmail.com' },
                to: [{ email: 'romansuganth1762001@gmail.com' }],
                subject: 'New Car Rental Request',
                htmlContent: emailContent,
                attachment: attachments,
            };

            const response = await axios.post('https://api.sendinblue.com/v3/smtp/email', emailPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': '', // Replace with your Sendinblue API key
                },
            });

            // Show success message
            document.getElementById('PopupAppointmenterrorMessage').style.display = 'none';
            document.getElementById('PopupAppointmentsuccessMessage').style.display = 'block';
            document.getElementById('bookingForm').reset(); // Reset form
        } catch (error) {
            // Show error message
            document.getElementById('PopupAppointmentsuccessMessage').style.display = 'none';
            document.getElementById('PopupAppointmenterrorMessage').style.display = 'block';
            console.error('Error sending email:', error);
        } finally {
            // Reset button after success or failure
            submitButton.disabled = false;
            submitButton.innerHTML = 'Submit'; // Restore original text
        }
    });
});
