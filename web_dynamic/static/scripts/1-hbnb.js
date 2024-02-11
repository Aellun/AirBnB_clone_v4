$(document).ready(function () {
  $('input[type=checkbox]').click(function () {
    const myListName = [];
    const myId = [];

    $('input[type=checkbox]:checked').each(function () {
      myListName.push($(this).data('name'));
      myId.push($(this).data('id'));
    });

    // Update the h4 tag inside the element with the class 'amenities'
    const amenitiesH4 = $('.amenities h4');
    if (myListName.length === 0) {
      amenitiesH4.text('');
    } else {
      amenitiesH4.text(myListName.join(', '));
    }
  });
});

