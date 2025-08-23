document.addEventListener('DOMContentLoaded', () => {
  const slotSelect = document.getElementById('time');
  const dateInput = document.getElementById('date');
  const form = document.getElementById('bookingForm');
  const confirmationDiv = document.getElementById('confirmation');

  // Set min and max dates (tomorrow to one month from tomorrow)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split('T')[0];

  const maxDate = new Date(tomorrow);
  maxDate.setMonth(maxDate.getMonth() + 1);
  dateInput.max = maxDate.toISOString().split('T')[0];

  // Populate time slots from 7 AM to 7 PM in 1-hour blocks
  for (let hour = 7; hour < 19; hour++) {
    const startLabel = formatHourLabel(hour);
    const endLabel = formatHourLabel(hour + 1);
    const displayLabel = `${startLabel}-${endLabel}`;
    const value = `${String(hour).padStart(2, '0')}:00`; // e.g., "07:00"

    const option = document.createElement('option');
    option.value = value;
    option.textContent = displayLabel;
    slotSelect.appendChild(option);
  }

  function formatHourLabel(hour) {
    const isPM = hour >= 12;
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const period = isPM ? 'pm' : 'am';
    return `${displayHour}${period}`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const date = dateInput.value;
    const time = slotSelect.value;

    if (!name || !email || !date || !time) {
      alert('Please fill in all fields.');
      return;
    }

    const payload = { name, email, date, time };

    try {
      await fetch('https://script.google.com/macros/s/AKfycbz2WvPPXulTNzF52Pxybn0v-WEp-6eorDsEtnpAukY4RMlpo1kf7V_hS2tWTPzsAGG5fQ/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // For Hide form and show confirmation
      form.classList.add('hidden');
      confirmationDiv.classList.remove('hidden');
      confirmationDiv.innerHTML = `
        <h3>Booking Request Received</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time Slot:</strong> ${slotSelect.options[slotSelect.selectedIndex].text}</p>
        <p><strong>This is not the confirmed booking.</strong><br>
        You will receive a confirmation email within 30 minutes based on slot availability.</p>
        <p>If you receive an email stating the slot is already booked, kindly book another available slot for another day.</p>
        <p>Please take a screenshot of this message for your reference.</p>
      `;
    } catch (error) {
      alert('Booking failed. Please try again later.');
      console.error('Booking error:', error);
    }
  });
});
