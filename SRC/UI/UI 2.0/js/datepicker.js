/*!
 * IWCMS Datepicker
 * https://integrawatch.com/
 *
 * Date: 2017-05-05
 */
jQuery(document).ready(function() {

  //set jquery datepicker
  jQuery('.datepicker').datepicker({
    showOn: 'both',
    changeMonth: true,
    changeYear: true
  }); 

  //customize jquery datepicker ui
  jQuery('.datepicker').attr('placeholder', 'Select Date').after('<i class="fa fa-calendar-o" aria-hidden="true"></i>');

});