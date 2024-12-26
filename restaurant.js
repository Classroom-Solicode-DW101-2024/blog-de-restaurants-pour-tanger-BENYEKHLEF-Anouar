// 
function getRestaurantName() {
    let params = new URLSearchParams(window.location.search);
    return params.get('name');
}

// 
async function fetchRestaurantDetails(name) {
    try {
        const response = await fetch(`http://localhost:3000/restaurants/${encodeURIComponent(name)}`);
        if (!response.ok) {
            throw new Error("Restaurant not found");
        }
        const restaurant = await response.json();
        displayRestaurantDetails(restaurant);
    } catch (error) {
        console.error("Error fetching restaurant details:", error);
        const detailsContainer = document.getElementById("restaurantDetails");
        detailsContainer.innerHTML = '<div class="progress-3"></div>';
    }
}

// 
function displayRestaurantDetails(restaurant) {
    const detailsContainer = document.getElementById("restaurantDetails");

    let reviews = '';
    if (restaurant.reviews && restaurant.reviews.length > 0) {
        reviews = `
            <div class="restaurant-reviews">
                <h2>Customer Reviews</h2>
                ${restaurant.reviews.map(review => `
                    <p>"<strong>${review.avis}</strong>"</p> 
                `).join('')}
            </div>
        `;
    } else {
        reviews = `<p>No reviews available yet.</p>`;
    }

    detailsContainer.innerHTML = `
    <div class="restaurant-details-container">
    
    <div class="restaurant-cover-container">
            <img src="${restaurant.cover}" alt="${restaurant.name}">
        </div>
    </div>

        <div class="restaurant-info-container">
            <div class="restaurant-header">
                <h1>${restaurant.name}</h1>
                <p class="specialty">${restaurant.specialty}</p>
                <p class="restaurant-rating">${restaurant.rating} <i class="fa-solid fa-star" style="color: #F25923;"></i></p>
                <p><strong><i class="fa-solid fa-location-pin" style="color: #F25923;"></i> &nbspAddress:</strong>&nbsp${restaurant.address}</p>
                <p><strong><i class="fa-solid fa-address-book" style="color: #F25923;"></i> &nbspPhone:</strong> <a href="tel:${restaurant.tel}">&nbsp${restaurant.tel}</a></p>
                <p><strong><i class="fa-solid fa-envelope" style="color: #F25923;"></i> &nbspEmail:</strong> <a href="mailto:${restaurant.email}">&nbsp${restaurant.email}</a></p>
                <p><strong><i class="fa-solid fa-globe" style="color: #F25923;">&nbsp</i> <a href="${restaurant.site}" target="_blank">Visit Website</a></strong></p>
            </div>
        </div>

        
    ${reviews} 
`;
}

// Initial load
let restaurantName = getRestaurantName();
if (restaurantName) {
    fetchRestaurantDetails(restaurantName);
} else {
    const detailsContainer = document.getElementById("restaurantDetails");
    detailsContainer.innerHTML = `<p class="error">Invalid restaurant name. Please go back and try again.</p>`;
}
