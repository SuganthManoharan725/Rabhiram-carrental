document.addEventListener("DOMContentLoaded", function() {
    // Add submit event listener to the form
    document.getElementById('requestForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get form data
        const name = document.getElementById('custom-name').value;
        const aadhar = document.getElementById('custom-aadhar').value;
        const phone = document.getElementById('custom-phone').value;
        const email = document.getElementById('custom-email').value;
        const pickDate = document.getElementById('custom-pickDate').value;
        const dropDate = document.getElementById('custom-dropDate').value;
        const pickTime = document.getElementById('custom-pickTime').value;
        const carName = document.getElementById('custom-carName').value;

        // Prepare the email content
        const emailContent = `
            <h2>New Car Rental Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Aadhar Number:</strong> ${aadhar}</p>
            <p><strong>Phone Number:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Pick-up Date:</strong> ${pickDate}</p>
            <p><strong>Drop-off Date:</strong> ${dropDate}</p>
            <p><strong>Pick-up Time:</strong> ${pickTime}</p>
            <p><strong>Car Selected:</strong> ${carName}</p>
        `;

        // Send email using Sendinblue API
        axios.post('https://api.sendinblue.com/v3/smtp/email', {
            sender: { email: 'romansuganth1762001@gmail.com' }, // Replace with your sender email
            to: [{ email: 'romansuganth1762001@gmail.com', name: 'Suganth M' }], // Replace with recipient email
            subject: 'New Car Rental Request',
            htmlContent: emailContent
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': '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' // Replace with your Sendinblue API key
            }
        })
        .then(response => {
            // Hide error message and show success message
            document.getElementById('AppointmenterrorMessage').style.display = 'none';
            document.getElementById('AppointmentsuccessMessage').style.display = 'block';
            document.getElementById('requestForm').reset(); // Clear the form
        })
        .catch(error => {
            // Hide success message and show error message
            document.getElementById('AppointmentsuccessMessage').style.display = 'none';
            document.getElementById('AppointmenterrorMessage').style.display = 'block';
            console.error('Error sending email:', error);
        });
    });
});
