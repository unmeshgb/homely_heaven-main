const router = require("express").Router()

const Booking = require("../models/Booking")

function convertToISO(dateString) {
  // Parse the date string
  let date = new Date(dateString);

  // Extract components
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  let day = String(date.getDate()).padStart(2, '0');
  let hours = String(date.getHours()).padStart(2, '0');
  let minutes = String(date.getMinutes()).padStart(2, '0');
  let seconds = String(date.getSeconds()).padStart(2, '0');

  // Construct ISO 8601 string
  let isoString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

  return isoString;
}

/* CREATE BOOKING */
router.post("/create", async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body
    const bookings = await Booking.find({listingId : listingId})
    for (let booking of bookings) {
      if (
          (convertToISO(startDate)  < convertToISO(booking.endDate) && convertToISO(startDate) >= convertToISO(booking.startDate)) ||
          (convertToISO(endDate) > convertToISO(booking.startDate) && convertToISO(endDate) <= convertToISO(booking.endDate)) ||
          (convertToISO(startDate) <= convertToISO(booking.startDate) && convertToISO(endDate) >= convertToISO(booking.endDate))
      ) {
          console.log('Booking already exists');
          return res.status(203).json({ message: "Booking already exists"})
      }
   }
    const newBooking = new Booking({ customerId, hostId, listingId, startDate, endDate, totalPrice })
    await newBooking.save()
    res.status(200).json(newBooking)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Fail to create a new Booking!", error: err.message })
  }
})

module.exports = router