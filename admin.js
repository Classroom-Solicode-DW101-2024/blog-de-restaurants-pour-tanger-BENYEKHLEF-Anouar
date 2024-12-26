// 
let lastScrollY = window.scrollY;
const header = document.querySelector('.second-header');

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

let restaurants = []; 

//
window.onload = function() {
    if (restaurants.length === 0) {
        fetchRestaurants();
    } else {
        updateRestaurantList();
    }
};

//
function fetchRestaurants() {
    fetch('http://localhost:3000/restaurants')
        .then(response => response.json())
        .then(data => {
            restaurants = data; // Cache restaurants
            updateRestaurantList();  
        })
        .catch(error => console.log('Error fetching restaurants:', error));
}

function updateRestaurantList(filteredRestaurants = null) {
    const restaurantList = document.getElementById("restaurantList");  
    restaurantList.innerHTML = "";  

    const listToDisplay = filteredRestaurants || restaurants;

    listToDisplay.forEach((restaurant, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><img src="${restaurant.cover}" alt="${restaurant.name}" id="admin-cover"></td>
            <td>${restaurant.name}</td>
            <td>${restaurant.specialty}</td>
            <td>${restaurant.rating} <i class="fa-solid fa-star" style="color: #F25923;"></i></td>
            <td id="buttons">
                <button id="modifyBtn" onclick="editRestaurant(${index})"><i class="fa-solid fa-pen-to-square" style="color: white;"></i></button>
                <button id="deleteBtn" onclick="deleteRestaurant(${index})"><i class="fa-solid fa-delete-left" style="color: white;"></i></button>
            </td>
        `;
        restaurantList.appendChild(row);
    });
}


// 
document.getElementById('addRestaurantForm').addEventListener('submit', function(event) {
    event.preventDefault();


    const reviews = Array.from(document.querySelectorAll('#restaurantReview'))
    .map(textarea => ({ avis: textarea.value.trim() }))
    .filter(review => review.avis !== ""); // Filter out empty reviews

    const newRestaurant = {
        name: document.getElementById('restaurantName').value,
        address: document.getElementById('restaurantAddress').value,
        cover: document.getElementById('restaurantCover').value,
        specialty: document.getElementById('restaurantSpecialty').value,
        rating: parseFloat(document.getElementById('restaurantRating').value),
        reviews: reviews,
        site: document.getElementById('restaurantSite').value,
        tel: document.getElementById('restaurantTel').value,
        email: document.getElementById('restaurantEmail').value || null,
    };

    fetch('http://localhost:3000/restaurants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRestaurant),
    })
    .then(response => response.json())
    .then(addedRestaurant => {
        restaurants.push(addedRestaurant); 
        updateRestaurantList();
        document.getElementById('addRestaurantForm').reset();
        closeModal();
    })
    .catch(error => {
        console.log('Error adding:', error);
    });
});

// 
function deleteRestaurant(index) {
    const restaurantToDelete = restaurants[index];

    if (confirm(`Are you sure you want to delete "${restaurantToDelete.name}"?`)) {
        fetch(`http://localhost:3000/restaurants/${restaurantToDelete.name}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete restaurant');
            }
            restaurants.splice(index, 1); 
            updateRestaurantList();
        })
        .catch(error => {
            console.log('Error deleting restaurant:', error);
        });
    }
}

// 
function openModal() {
    document.getElementById('addRestaurantModal').style.display = 'block';
}

// 
function closeModal() {
    document.getElementById('addRestaurantModal').style.display = 'none';
}

// 
function searchRestaurants() {
    const searchCriteria3 = document.getElementById("searchCriteria3").value;
    const searchInput3 = document.getElementById("searchInput3").value.toLowerCase();

    if (!searchInput3) {
        updateRestaurantList();
        return;
    }

    // 
    const filteredRestaurants = restaurants.filter((restaurant) => {
        if (searchCriteria3 === "all") {
            return (
                restaurant.name.toLowerCase().includes(searchInput3) ||
                restaurant.specialty.toLowerCase().includes(searchInput3)
            );
        } else if (searchCriteria3 === "name") {
            return restaurant.name.toLowerCase().includes(searchInput3);
        } else if (searchCriteria3 === "specialty") {
            return restaurant.specialty.toLowerCase().includes(searchInput3);
        }
    });

    // 
    updateRestaurantList(filteredRestaurants);

    //
    if (filteredRestaurants.length === 0) {
        const restaurantList = document.getElementById("restaurantList");
        restaurantList.innerHTML = "<tr><td colspan='4'>No restaurants found matching the criteria.</td></tr>";
    }
}

//
function clearSearch() {
    document.getElementById("searchInput3").value = "";
    document.getElementById("searchCriteria3").value = "all";
    updateRestaurantList();
}

// 
document.getElementById("searchBtn3").addEventListener("click", searchRestaurants);
document.getElementById("clearBtn3").addEventListener("click", clearSearch);

//
function editRestaurant(index) {
    const restaurant = restaurants[index];

    document.getElementById('editRestaurantName').value = restaurant.name;
    document.getElementById('editRestaurantAddress').value = restaurant.address;
    document.getElementById('editRestaurantCover').value = restaurant.cover;
    document.getElementById('editRestaurantSpecialty').value = restaurant.specialty;
    document.getElementById('editRestaurantRating').value = restaurant.rating;
    document.getElementById('editRestaurantReview').value = restaurant.reviews.map(review => review.avis).join('\n');
    document.getElementById('editRestaurantSite').value = restaurant.site;
    document.getElementById('editRestaurantTel').value = restaurant.tel;
    document.getElementById('editRestaurantEmail').value = restaurant.email || '';

    document.getElementById('editRestaurantModal').style.display = 'block';

    document.getElementById('editRestaurantForm').onsubmit = function(event) {
        event.preventDefault();

        const updatedRestaurant = {
            name: document.getElementById('editRestaurantName').value,
            address: document.getElementById('editRestaurantAddress').value,
            cover: document.getElementById('editRestaurantCover').value,
            specialty: document.getElementById('editRestaurantSpecialty').value,
            rating: parseFloat(document.getElementById('editRestaurantRating').value),
            reviews: document.getElementById('editRestaurantReview').value.split('\n').map(avis => ({ avis: avis.trim() })),
            site: document.getElementById('editRestaurantSite').value,
            tel: document.getElementById('editRestaurantTel').value,
            email: document.getElementById('editRestaurantEmail').value || null
        };

        fetch(`http://localhost:3000/restaurants/${restaurant.name}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRestaurant)
        })
        .then(response => response.json())
        .then(data => {
            restaurants[index] = data;  
            updateRestaurantList();  
            closeEditModal();  
        })
        .catch(error => console.log('Error editing restaurant:', error));
    };
}

function closeEditModal() {
    document.getElementById('editRestaurantModal').style.display = 'none';
}
