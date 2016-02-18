$(function ($) {


    console.log(1500);

    /*    selectReadyTicker = setInterval(function () {

     var $selectpicker = $('.filterSelect');


     $selectpicker.each(function (ind) {
     var slct = $(this).data('selectpicker').$newElement;

     if (slct != void 0) {
     clearInterval(selectReadyTicker);

     console.log($(this), slct);
     }

     //slct.on('hide.bs.dropdown', function (e) {
     //    console.log('hide');
     //});
     //
     //slct.on('hidden.bs.dropdown', function (e) {
     //    console.log('hide');
     //});
     });

     }, 500);*/


    $('body')
        .delegate('.bootstrap-select.filterSelect', 'hide.bs.dropdown', function () {
            $(this).closest('.hover-select-box').removeClass('opened');
        })
        .delegate('.bootstrap-select.filterSelect', 'click', function () {
            console.log('open', this);
            $(this).closest('.hover-select-box').addClass('opened');
        });

 
});