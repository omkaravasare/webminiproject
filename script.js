// Core Data
const movies = [
    { 
        name: "Chhava", 
        poster: "url('https://e1.pxfuel.com/desktop-wallpaper/96/804/desktop-wallpaper-chhava-movie-poster-chhava.jpg')" 
    },
    { 
        name: "Interstellar", 
        poster: "url('https://e0.pxfuel.com/wallpapers/1018/408/desktop-wallpaper-interstellar-movie-poster-hollywood.jpg')" 
    },
    { 
        name: "The Social Network", 
        poster: "url('https://e0.pxfuel.com/wallpapers/270/298/desktop-wallpaper-the-social-network-2010-phone-social-network-movie.jpg')" 
    },
    { 
        name: "3 Idiots", 
        poster: "url('https://e0.pxfuel.com/wallpapers/782/298/desktop-wallpaper-3-idiots-3-idots.jpg')" 
    },
    { 
        name: "Sita Ramam", 
        poster: "url('https://e0.pxfuel.com/wallpapers/539/911/desktop-wallpaper-dulquer-salmaan-sita-ramam-movie-posters-sita-ramam.jpg')" 
    }
];

const ticketPrice = 200;
let username = "";
let selectedMovie = "";
let seatMap = {};
let bookedSeats = [];
let totalCost = 0;

// Initialize seat maps for all movies
movies.forEach(movie => {
    seatMap[movie.name] = Array(5).fill().map(() => Array(10).fill('O'));
});

// Generate a random ticket number
function generateTicketNumber() {
    return 'TX' + Math.floor(100000 + Math.random() * 900000);
}

// Get today's date in DD-MM-YYYY format
function getTodayDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
}

// Start booking process
function startBooking() {
    username = document.getElementById("username").value;
    if (!username) {
        alert("Please enter your name to continue!");
        return;
    }
    document.getElementById("username-section").classList.add("hidden");
    displayMovies();
}

// Display movie selection
function displayMovies() {
    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = "";
    
    movies.forEach((movie, index) => {
        const btn = document.createElement("button");
        btn.style.backgroundImage = movie.poster;
        btn.setAttribute("data-title", movie.name);
        btn.onclick = () => selectMovie(movie.name);
        movieList.appendChild(btn);
    });
    
    document.getElementById("movie-selection").classList.remove("hidden");
}

// Select a movie
function selectMovie(movie) {
    selectedMovie = movie;
    document.getElementById("selected-movie").textContent = movie;
    
    // Set movie poster
    const movieObj = movies.find(m => m.name === movie);
    if (movieObj) {
        document.getElementById("movie-poster").style.backgroundImage = movieObj.poster;
    }
    
    document.getElementById("movie-selection").classList.add("hidden");
    document.getElementById("seat-selection").classList.remove("hidden");
    displaySeatingPlan();
    // Add at the end of selectMovie function
    document.getElementById("total-needed").textContent = document.getElementById("num-tickets").value;
    updateSeatCounter();
}

// Display the seating plan
function displaySeatingPlan() {
    // Add near the beginning of displaySeatingPlan function
    document.getElementById("total-needed").textContent = document.getElementById("num-tickets").value;
    updateSeatCounter();
    const seatingPlan = document.getElementById("seating-plan");
    seatingPlan.innerHTML = "";

    // Column numbers
    for (let i = 0; i <= 10; i++) {
        const cell = document.createElement("div");
        cell.textContent = i === 0 ? "" : i;
        seatingPlan.appendChild(cell);
    }

    // Seat rows
    for (let i = 0; i < 5; i++) {
        const rowLabel = document.createElement("div");
        rowLabel.textContent = String.fromCharCode(65 + i);
        seatingPlan.appendChild(rowLabel);

        for (let j = 0; j < 10; j++) {
            const seat = document.createElement("div");
            seat.classList.add("seat");
            seat.textContent = `${String.fromCharCode(65 + i)}${j + 1}`;
            if (seatMap[selectedMovie][i][j] === "X") {
                seat.classList.add("booked");
            }
            seat.onclick = () => toggleSeat(seat, i, j);
            seatingPlan.appendChild(seat);
        }
    }
}

// Toggle seat selection
function toggleSeat(seat, row, col) {
    if (seat.classList.contains("booked")) return;
    
    const seatCode = `${String.fromCharCode(65 + row)}${col + 1}`;
    
    if (seat.classList.contains("selected")) {
        seat.classList.remove("selected");
        bookedSeats = bookedSeats.filter(s => s !== seatCode);
    } else {
        // Check if we've reached the ticket limit
        const numTickets = parseInt(document.getElementById("num-tickets").value);
        if (bookedSeats.length >= numTickets) {
            alert(`You can only select ${numTickets} seats. Deselect a seat to choose another.`);
            return;
        }
        
        seat.classList.add("selected");
        bookedSeats.push(seatCode);
    
    }
    updateSeatCounter();
}

// Increment ticket count
function incrementTickets() {
    const ticketInput = document.getElementById("num-tickets");
    let value = parseInt(ticketInput.value);
    ticketInput.value = value + 1;
    document.getElementById("total-needed").textContent = ticketInput.value;
    
    // Reset selected seats if changing ticket count
    if (bookedSeats.length > 0) {
        if (confirm("Changing ticket count will clear your current seat selection. Continue?")) {
            resetSeatSelection();
        } else {
            ticketInput.value = value; // Revert back
        }
    }
}

// Decrement ticket count
function decrementTickets() {
    const ticketInput = document.getElementById("num-tickets");
    let value = parseInt(ticketInput.value);
    if (value > 1) {
        ticketInput.value = value - 1;
        document.getElementById("total-needed").textContent = ticketInput.value;
        // Reset selected seats if changing ticket count
        if (bookedSeats.length > 0) {
            if (confirm("Changing ticket count will clear your current seat selection. Continue?")) {
                resetSeatSelection();
            } else {
                ticketInput.value = value; // Revert back
            }
        }
    }
}

// Reset seat selection
function resetSeatSelection() {
    bookedSeats = [];
    const selectedSeats = document.querySelectorAll(".seat.selected");
    selectedSeats.forEach(seat => {
        seat.classList.remove("selected");
    });
    updateSeatCounter();
}

// Proceed to payment
function proceedToPayment() {
    const numTickets1 = parseInt(document.getElementById("num-tickets").value);
    document.getElementById("total-needed").textContent = numTickets;
    if (bookedSeats.length === 0) {
        alert("Please select at least one seat!");
        return;
    }
    
    if (bookedSeats.length !== numTickets) {
        alert(`Please select exactly ${numTickets} seats!`);
        return;
    }
    
    totalCost = numTickets * ticketPrice;
    document.getElementById("seat-selection").classList.add("hidden");
    document.getElementById("payment-section").classList.remove("hidden");
    document.getElementById("summary-movie").textContent = selectedMovie;
    document.getElementById("summary-seats").textContent = bookedSeats.join(", ");
    document.getElementById("summary-cost").textContent = totalCost;
}
function updateSeatCounter() {
    document.getElementById("selected-count").textContent = bookedSeats.length;
}
// Apply coupon code
function applyCoupon() {
    const coupon = document.getElementById("coupon").value.toUpperCase();
    const numTickets = bookedSeats.length;
    totalCost = numTickets * ticketPrice;

    if (coupon === "DISCOUNT50") {
        totalCost *= 0.5;
        alert("✅ 50% Discount Applied Successfully!");
    } else if (coupon === "FREETICKET") {
        if (numTickets > 0) {
            totalCost -= ticketPrice;
            alert("✅ Free Ticket Applied Successfully!");
        } else {
            alert("❌ Cannot apply coupon with no tickets selected.");
            return;
        }
    } else {
        alert("❌ Invalid coupon code. Please try again.");
        return;
    }
    document.getElementById("summary-cost").textContent = totalCost;
}

// Confirm booking
function confirmBooking() {
    // Mark seats as booked
    bookedSeats.forEach(seat => {
        const row = seat.charCodeAt(0) - 65;
        const col = parseInt(seat.slice(1)) - 1;
        seatMap[selectedMovie][row][col] = "X";
    });
    
    document.getElementById("payment-section").classList.add("hidden");
    document.getElementById("confirmation").classList.remove("hidden");
    document.getElementById("confirmed-username").textContent = username;
}

// Book more tickets
function bookMore() {
    bookedSeats = [];
    document.getElementById("confirmation").classList.add("hidden");
    document.getElementById("movie-selection").classList.remove("hidden");
    displayMovies();
}

// View booking details
function viewBookingDetails() {
    document.getElementById("booking-details").classList.remove("hidden");
    document.getElementById("details-username").textContent = username;
    document.getElementById("details-movie").textContent = selectedMovie;
    document.getElementById("details-seats").textContent = bookedSeats.join(", ");
    document.getElementById("details-cost").textContent = totalCost;
    document.getElementById("details-date").textContent = getTodayDate();
    document.getElementById("ticket-number").textContent = generateTicketNumber();
}

// Close booking details modal
function closeBookingDetails() {
    document.getElementById("booking-details").classList.add("hidden");
}

// Exit and restart application
function exit() {
    location.reload();
}

// Add some random booked seats for demonstration
function addRandomBookedSeats() {
    movies.forEach(movie => {
        // Book 5-15 random seats for each movie
        const numSeatsToBook = Math.floor(Math.random() * 10) + 5;
        for (let i = 0; i < numSeatsToBook; i++) {
            const row = Math.floor(Math.random() * 5);
            const col = Math.floor(Math.random() * 10);
            seatMap[movie.name][row][col] = "X";
        }
    });
}

// Initialize the application
window.onload = function() {
    addRandomBookedSeats();
};