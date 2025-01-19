(function ($) {
    "use strict";

    // Initialize jQuery UI Datepicker for date selection
    $('#go-trip-departureDate').datepicker({
        dateFormat: "yy-mm-dd",
        beforeShow: function (input, inst) {
            // Remove any previously added time options before showing the datepicker
            $('tr.time-options').remove();
            populateTimeOptions(); // Populate time options when datepicker is shown
        },
        onClose: function (dateText, inst) {
            // Handle date selection
            console.log("Selected Date: " + dateText);
            // Remove time options when datepicker is closed
            $('tr.time-options').remove();
        },
        onChangeMonthYear: function (year, month, inst) {
            // Repopulate time options when navigating to a different month
            $('tr.time-options').remove();
            populateTimeOptions();
        }
    });

    // Populate time options inside the calendar
    function populateTimeOptions() {
        const timeSelect = $('<select id="go-trip-departureTime"></select>');
        for (let hour = 0; hour < 24; hour++) {
            for (let minutes = 0; minutes < 60; minutes += 15) {
                let period = hour >= 12 ? 'PM' : 'AM';
                let hour12 = hour % 12 || 12; // Convert to 12-hour format
                const time = `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
                timeSelect.append(new Option(time, time));
            }
        }

        // Create a table row and add the select element to it
        const timeRow = $('<tr class="time-options"><td colspan="7"></td></tr>');
        timeRow.find('td').append(timeSelect);

        // Append the time row to the datepicker calendar
        setTimeout(function () {
            $('table.ui-datepicker-calendar tbody').append(timeRow);
        }, 0);

        // Update the hidden time input when the time is selected
        timeSelect.on('change', function () {
            $('#go-trip-departureTime-hidden').val($(this).val());
        });
    }

    $('.go-trip-tab-button').on('click', function () {
        event.preventDefault();
        if ($(this).attr('id') === 'go-trip-tour-tab') {
            // Redirect to the tour page
            window.location.href = 'tour.html'; // Replace 'tour.html' with the actual URL of the tour page
        } else {
            $('.go-trip-tab-button').removeClass('active');
            $(this).addClass('active');
            const tripType = $(this).data('trip-type');
            console.log(`Selected Trip Type: ${tripType}`);
            $('#trip-type').val(tripType); // Update hidden input with selected trip type
        }
    });

    function updateCounter(id, increment) {
        let countElement = $(`#${id}-count`);
        let hiddenInputElement = $(`#${id}-count-hidden`);
        let currentValue = parseInt(countElement.text());
        if (increment) {
            currentValue++;
        } else {
            if (currentValue > 0) {
                currentValue--;
            }
        }
        countElement.text(currentValue);
        hiddenInputElement.val(currentValue);
    }

    $('#adults-increment').on('click', function (event) {
        event.preventDefault();
        updateCounter('adults', true);
    });

    $('#adults-decrement').on('click', function (event) {
        event.preventDefault();
        updateCounter('adults', false);
    });

    $('#kids-increment').on('click', function (event) {
        event.preventDefault();
        updateCounter('kids', true);
    });

    $('#kids-decrement').on('click', function (event) {
        event.preventDefault();
        updateCounter('kids', false);
    });

    $('#bags-increment').on('click', function (event) {
        event.preventDefault();
        updateCounter('bags', true);
    });

    $('#bags-decrement').on('click', function (event) {
        event.preventDefault();
        updateCounter('bags', false);
    });

    /**
     * This code for address autocomaple
     */
    function initializeAutocomplete(id, latId, lngId, addressId) {
        var autocomplete = new google.maps.places.Autocomplete(document.getElementById(id), {
            types: ['geocode']
        });

        autocomplete.setFields(['address_component', 'geometry', 'name']);
        autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }
            $('#' + latId).val(place.geometry.location.lat());
            $('#' + lngId).val(place.geometry.location.lng());
            $('#' + addressId).val(place.name);
            $('#' + id).val(place.name);
        });
    }
    initializeAutocomplete('go-trip-from', 'from-lat', 'from-lng', 'from-address');
    initializeAutocomplete('go-trip-to', 'to-lat', 'to-lng', 'to-address');


})(jQuery);


