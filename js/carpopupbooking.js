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
            
                // Get selected car name (e.g., from a dropdown or input)
                const carType = document.getElementById('carName').value;
            
                // Pricing logic based on selected car type
                if (carType.includes('Kia Carens')) {
                    // Kia Carens pricing
                    if (durationInHours === 8) {
                        estimatedAmount = 3000 + ' INR';
                    } else if (durationInHours === 12) {
                        estimatedAmount = 3500 + ' INR';
                    } else if (durationInHours === 24) {
                        estimatedAmount = 4000 + ' INR';
                    } else if (durationInHours > 24) {
                        const extraHours = durationInHours - 24;
                        estimatedAmount = 4000 + (extraHours * 300) + ' INR'; // 300 INR for extra hours after 24
                    } else {
                        estimatedAmount = 'Must be 8hr, 12hr, or 24hr';
                    }
                } else if (carType.includes('Mahindra Scorpio')) {
                    // Mahindra Scorpio pricing
                    if (durationInHours === 8) {
                        estimatedAmount = 2500 + ' INR';
                    } else if (durationInHours === 12) {
                        estimatedAmount = 3000 + ' INR';
                    } else if (durationInHours === 24) {
                        estimatedAmount = 3500 + ' INR';
                    } else if (durationInHours > 24) {
                        const extraHours = durationInHours - 24;
                        estimatedAmount = 3500 + (extraHours * 300) + ' INR'; // 250 INR for extra hours after 24
                    } else {
                        estimatedAmount = 'Must be 8hr, 12hr, or 24hr';
                    }
                }else if (carType.includes('Maruti Brezza')) {
                    // Maruti Brezza pricing
                    if (durationInHours === 8) {
                        estimatedAmount = 2200 + ' INR';
                    } else if (durationInHours === 12) {
                        estimatedAmount = 2700 + ' INR';
                    } else if (durationInHours === 24) {
                        estimatedAmount = 3200 + ' INR';
                    } else if (durationInHours > 24) {
                        const extraHours = durationInHours - 24;
                        estimatedAmount = 3200 + (extraHours * 250) + ' INR'; // 250 INR for extra hours after 24
                    } else {
                        estimatedAmount = 'Must be 8hr, 12hr, or 24hr';
                    }
                } else {
                    // Default pricing for other cars (e.g., non-SUV or non-Kia car)
                    if (durationInHours === 8) {
                        estimatedAmount = 1500 + ' INR';
                    } else if (durationInHours === 12) {
                        estimatedAmount = 2000 + ' INR';
                    } else if (durationInHours === 24) {
                        estimatedAmount = 2500 + ' INR';
                    } else if (durationInHours > 24) {
                        const extraHours = durationInHours - 24;
                        estimatedAmount = 2500 + (extraHours * 200) + ' INR'; // 200 INR for extra hours after 24
                    } else {
                        estimatedAmount = 'Must be 8hr, 12hr, or 24hr';
                    }
                }
            
                // Update the estimated amount field
                document.getElementById('estimate-amount').value = estimatedAmount;
            
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
        const aadhar = document.getElementById('aadhar').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
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

        // Prepare email content
        const emailContent = `
            <h2>New Car Rental Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Aadhar Number:</strong> ${aadhar}</p>
            <p><strong>Phone Number:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
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
                name: aadharFile.name,  // Corrected to 'name'
                content: aadharBase64,
                contentType: aadharFile.type,
            });
        }

        if (panFile) {
            const panBase64 = await readFileAsBase64(panFile);
            attachments.push({
                name: panFile.name,  // Corrected to 'name'
                content: panBase64,
                contentType: panFile.type,
            });
        }

        if (drivingLicenseFile) {
            const drivingLicenseBase64 = await readFileAsBase64(drivingLicenseFile);
            attachments.push({
                name: drivingLicenseFile.name,  // Corrected to 'name'
                content: drivingLicenseBase64,
                contentType: drivingLicenseFile.type,
            });
        }

        // Create JSON payload for Sendinblue API
        const emailPayload = {
            sender: { email: 'romansuganth1762001@gmail.com' },
            to: [{ email: 'romansuganth1762001@gmail.com' }],
            subject: 'New Car Rental Request',
            htmlContent: emailContent,
            attachment: attachments,  // Corrected attachment key
        };

        // Send email via Sendinblue API
        try {
            const response = await axios.post('https://api.sendinblue.com/v3/smtp/email', emailPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': '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' // Replace with your Sendinblue API key
                }
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

            // Log the error response
            if (error.response) {
                console.error('Error Response:', error.response.data);
            }
        }
    });
});
