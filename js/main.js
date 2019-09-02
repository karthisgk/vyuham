(function ($) {
  "use strict";

  // Preloader (if the #preloader div exists)
  $(window).on('load', function () {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
      });
    }
  });

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;
  });

  // Initiate the wowjs animation library
  new WOW().init();

  // Header scroll class
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Smooth scroll for the navigation and links with .scrollto classes
  $('.main-nav a, .mobile-nav a, .scrollto').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if (! $('#header').hasClass('header-scrolled')) {
            top_space = top_space - 40;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.main-nav, .mobile-nav').length) {
          $('.main-nav .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.main-nav, .mobile-nav');
  var main_nav_height = $('#header').outerHeight();

  $(window).on('scroll', function () {
    var cur_pos = $(this).scrollTop();
  
    nav_sections.each(function() {
      var top = $(this).offset().top - main_nav_height,
          bottom = top + $(this).outerHeight();
  
      if (cur_pos >= top && cur_pos <= bottom) {
        main_nav.find('li').removeClass('active');
        main_nav.find('a[href="#'+$(this).attr('id')+'"]').parent('li').addClass('active');
      }
    });
  });

  // jQuery counterUp (used in Whu Us section)
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Porfolio isotope and filter
  $(window).on('load', function () {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item'
    });
    $('#portfolio-flters li').on( 'click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');
  
      portfolioIsotope.isotope({ filter: $(this).data('filter') });
    });
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

  // Clients carousel (uses the Owl Carousel library)
  /*$(".clients-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: { 0: { items: 2 }, 768: { items: 4 }, 900: { items: 6 }
    }
  });*/
  const getSponsorsCallback = function( sponsors ) {
    if(sponsors.length){
      sponsors.forEach((sp, ind) => {
        const ele = $('<img src="'+sp.logo+'" alt="" />');
        $('.clients-carousel').append(ele);
      });
      $(".clients-carousel").owlCarousel({
        autoplay: true,
        dots: true,
        loop: true,
        responsive: { 0: { items: 2 }, 768: { items: 4 }, 900: { items: 6 }
        }
      });
    }
  };
  $.ajax({
    type: 'post',
    url: 'http://me.karthisgk.be/vyuham/sponsors.json',
    dataType: 'json',
    success: getSponsorsCallback
  });
  
  const fileUploader = (e) => {
    var file = e.target.files[0];
    var mobNo = $('#mob-no').val().replace(/^\+/, '');
    var $button = $('div.ds-notes .btn-get-started');
    var error = $('div.ds-notes .error');
    var success = $('div.ds-notes .success');
    var progress = $('#uploader');
    var message = '';

    if(mobNo.length < 10)
      message = 'Enter valid mobile number.';

    if(!/^video/.test(file.type)){
      message = 'not accepted '+file.type+'. \
        you must upload a video';
    }
    if(file.size > 30000000){
      message = 'file size too large. video must be below 30mb';
    }
    if(message != ''){
      if(error.length == 0)
        $button.after('<p class="error">'+message+'</p>');
      else
        error.html(message);
      return;
    }
    error.html('');    
    const afterSuccess = () => {
      message = 'uploaded sucessfull';
      if(success.length == 0)
        $button.after('<p class="success">'+message+'</p>');
      else
        success.html(message);
      $button.remove();
      progress.hide();
    };
    progress.show();
    $button.prop('disabled', true);
    var task = firebase.storage().ref('/directorshow/vyuham_' + mobNo +'_'+ file.name).put(file);
    task.on('state_changed', (snapshot) => {
      var p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progress.val(p);
    }, (error) => {
      error.html('something wrong!');
      $button.prop('disabled', false);
    }, afterSuccess);
  };
  $('#file-upload').change(fileUploader);
})(jQuery);

