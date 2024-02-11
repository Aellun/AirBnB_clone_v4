$(document).ready(function () {
  const amenities = {};

  function updateAmenitiesDisplay() {
    const amenityList = Object.values(amenities).join(', ');
    const truncatedList = amenityList.length > 30 ? amenityList.substring(0, 29) + '...' : amenityList;
    $('.amenities h4').text(truncatedList || '\u00A0');
  }

  function handleCheckboxChange() {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).prop('checked')) {
      amenities[amenityId] = amenityName;
    } else {
      delete amenities[amenityId];
    }

    updateAmenitiesDisplay();
  }

  // Checkbox change event listener
  $('input[type="checkbox"]').click(handleCheckboxChange);

  // API status check
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      $('div#api_status').toggleClass('available', response.status === 'OK');
    },
    error: function (error) {
      $('div#api_status').removeClass('available');
    }
  });
});
