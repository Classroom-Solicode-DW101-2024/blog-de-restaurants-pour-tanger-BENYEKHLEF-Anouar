// To make navbar sticky on scroll up
let lastScrollY = window.scrollY;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < lastScrollY) {
        // Scrolling up
        header.classList.add('sticky');
    } else {
        // Scrolling down
        header.classList.remove('sticky');
    }

    lastScrollY = currentScrollY;
});

// Scroll to top button functionality
const scrollToTopBtn = document.querySelector(".upButton");

scrollToTopBtn.addEventListener("click", (e) => {
    e.preventDefault(); 
    window.scrollTo({
        top: 0, 
        behavior: "smooth" 
    });
});

let restaurants = []; 

async function fetchRestaurants() {
    try {
        const response = await fetch("http://localhost:3000/restaurants");
        const data = await response.json();
        restaurants = data; 
        displayRestaurants(restaurants); 
    } catch (error) {
        console.error("Error retrieving restaurants:", error);
        const restaurantsList = document.getElementById("restaurantsList");
        restaurantsList.innerHTML = '<div class="progress-3"></div>';
    }
}

// 
function displayRestaurants(restaurants) {
    const restaurantsList = document.getElementById("restaurantsList");
    restaurantsList.innerHTML = ""; 

    restaurants.forEach(restaurant => {
        const card = document.createElement("div");
        card.className = "restaurant-card";

        card.innerHTML = `
        <a href="restaurant.html?name=${encodeURIComponent(restaurant.name)}" class="card-link">
            <img src="${restaurant.cover}" alt="${restaurant.name}">
            <h3>${restaurant.name}</h3>
            <p>${restaurant.specialty}</p>
            <p>${restaurant.rating} <i class="fa-solid fa-star" style="color: #F25923;"></i></p> 
        </a>
    `;
        restaurantsList.appendChild(card);
    });
}

// 
function searchRestaurants() {
    let searchCriteria = document.getElementById("searchCriteria").value;
    let searchInput = document.getElementById("searchInput").value.toLowerCase();  

    if (!searchInput) {
        displayRestaurants(restaurants);
        return;
    }

    let filteredRestaurants = restaurants.filter(restaurant => {
        if (searchCriteria === "all") {
            return (
                restaurant.name.toLowerCase().includes(searchInput) ||
                restaurant.specialty.toLowerCase().includes(searchInput)
            );
        } else if (searchCriteria === "name") {
            return restaurant.name.toLowerCase().includes(searchInput);
        } else if (searchCriteria === "specialty") {
            return restaurant.specialty.toLowerCase().includes(searchInput);
        }
    });

    if (filteredRestaurants.length === 0) {
        const restaurantsList = document.getElementById("restaurantsList");
        restaurantsList.innerHTML = "<p>No restaurants found matching the criteria.</p>";
    } else {
        displayRestaurants(filteredRestaurants);
    }
}

// 
function clearSearch() {
    document.getElementById("searchInput").value = "";  
    document.getElementById("searchCriteria").value = "all";  
    displayRestaurants(restaurants);  
}

//
document.getElementById("searchBtn").addEventListener("click", searchRestaurants);
document.getElementById("clearBtn").addEventListener("click", clearSearch);

// 
fetchRestaurants();
