// Script that is executed only when DOM is loaded with jQuery

let checkedAmenities = {};
let checkedLocations = {};

$(document).ready(function () {
    // Event handler for Amenity checkbox changes
    $('input.amenity-checkbox').change(function () {
        updateCheckedAmenities($(this));
    });

    // Event handler for Location (State/City) checkbox changes
    $('input.location-checkbox').change(function () {
        updateCheckedLocations($(this));
    });

    // API status check
    const apiStatus = $('DIV#api_status');
    checkApiStatus(apiStatus);

    // Places search request on page load
    fetchPlaces();

    // Event listener for button click
    $('#searchButton').click(function () {
        // Make a new places_search request with the list of checked amenities, cities, and states
        const checkedAmenitiesList = Object.values(checkedAmenities);
        const checkedLocationsList = Object.values(checkedLocations);
        const requestData = {
            amenities: checkedAmenitiesList,
            locations: checkedLocationsList,
        };

        $.ajax({
            type: 'POST',
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (data) {
                // Display the new places data
                displayPlaces(data);
            },
            error: function () {
                console.error('Failed to fetch places.');
            }
        });
    });
});

function updateCheckedAmenities(checkbox) {
    const amenityId = checkbox.data('id');
    const amenityName = checkbox.data('name');

    if (checkbox.prop('checked')) {
        checkedAmenities[amenityId] = amenityName;
    } else {
        delete checkedAmenities[amenityId];
    }

    updateAmenitiesDisplay();
}

function updateCheckedLocations(checkbox) {
    const locationId = checkbox.data('id');
    const locationName = checkbox.data('name');

    if (checkbox.prop('checked')) {
        checkedLocations[locationId] = locationName;
    } else {
        delete checkedLocations[locationId];
    }

    updateLocationsDisplay();
}

function updateAmenitiesDisplay() {
    let amenities = Object.values(checkedAmenities);
    let amenitiesText = amenities.length > 0 ? amenities.join(', ') : '&nbsp;';
    $('div.amenities h4').html(amenitiesText);
}

function updateLocationsDisplay() {
    let locations = Object.values(checkedLocations);
    let locationsText = locations.length > 0 ? locations.join(', ') : '&nbsp;';
    $('div.locations h4').html(locationsText);
}

function checkApiStatus(apiStatusElement) {
    $.ajax('http://0.0.0.0:5001/api/v1/status/')
        .done(function (data) {
            apiStatusElement.toggleClass('available', data.status === 'OK');
        })
        .fail(function () {
            apiStatusElement.removeClass('available');
        });
}

function fetchPlaces() {
    $.ajax({
        type: 'POST',
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        contentType: 'application/json',
        data: '{}',
        success: function (data) {
            displayPlaces(data);
        },
        error: function () {
            console.error('Failed to fetch places.');
        }
    });
}

function displayPlaces(placesData) {
    const placesContainer = $('.places');
    placesContainer.empty(); // Clear existing places before appending new ones

    for (let currentPlace of placesData) {
        placesContainer.append(
            `<article>
                <div class="title">
                    <h2>${currentPlace.name}</h2>
                    <div class="price_by_night">$${currentPlace.price_by_night}</div>
                </div>
                <div class="information">
                    <div class="max_guest"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br />${currentPlace.max_guest} Guests</div>
                    <div class="number_rooms"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br />${currentPlace.number_rooms} Bedrooms</div>
                    <div class="number_bathrooms"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br />${currentPlace.number_bathrooms} Bathroom</div>
                </div>
                <div class="user"></div>
                <div class="description">$${currentPlace.description}</div>
            </article>`
        );
    }
}
