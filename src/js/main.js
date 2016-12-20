"use strict";

$(document).ready(function(){

    if ($('#archiveCalendar')) {
        $.ajax({
            type: "post",
            url: "http://resonance.in.ua/archive/?dates=1",
            success: function(data){
                //console.log(data);
                initArchiveCalendar(data);

            }

        })

    } else {
        $.ajax({
            type: "post",
            url: "http://resonance.in.ua/archive/?dates=1",
            success: function(data){
                //console.log(data);
                window.activeDatesReady = data;

            }

        })
    }



    function initArchiveCalendar(activeDates){
        console.log('****');
        console.log(activeDates);
        window.activeDatesReady = activeDates;
        console.log('window');
        console.log(window.activeDatesReady);

        $.datepicker.setDefaults($.datepicker.regional['ru']);
        //var firstDateSrc = activeDates[activeDates.length - 1];
        //var tm1 = new Date(firstDateSrc)
        //console.log(firstDateSrc);
        //firstDateSrc = firstDateSrc.split('.');
        //console.log(firstDateSrc);
        //
        ////var firstDate = new Date('07/05/2014');
        //var firstDate = new Date(firstDateSrc[1] + '/' + firstDateSrc[0] + '/' + firstDateSrc[2]);
        //console.log(firstDate);


        // maxDate for the plugin
        // todo: parse maxDate from var activeDates
        var firstDate = new Date('06/30/2016');

        var firstMonth = firstDate.getMonth();
        var firstYear = firstDate.getFullYear();

        var curDate = new Date();
        var curMonth = curDate.getMonth();
        var curYear = curDate.getFullYear();

        var mIndex = curMonth;
        var yIndex = curYear;

        var $calendar = $('#archiveCalendar');

        // get number of months' days
        Date.prototype.monthDays= function(){
            var d= new Date(this.getFullYear(), this.getMonth()+1, 0);
            return d.getDate();
        };

        for (;yIndex >= firstYear;yIndex--) {
            var $year = $('<div class="year"></div>').appendTo($calendar);
            $year.attr('id', 'year'+yIndex);
            //$year.text(yIndex);
            var $yWrap = $('<div class="year-title"></div>').appendTo($year);
            $('<div class="label block-label"></div>').text(yIndex).appendTo($yWrap);

            // reset month index to the highest month number
            if (yIndex != curYear) {
                mIndex = 11;
            }

            var monthLimit;

            if (yIndex == firstYear) {
                monthLimit = firstMonth;
            } else {
                monthLimit = 0;
            }

            while (mIndex >= monthLimit) {
                var $month = $('<div class="month"></div>').appendTo($year);
                var monthStr = 1 + mIndex;
                if (monthStr<10) {
                    monthStr = '0' + monthStr;
                }
                var dateStr = monthStr + '/' + '01/' + yIndex;
                var minDate = new Date(dateStr);
                var maxDate = new Date(monthStr + '/' + (minDate.getDate() + (minDate.monthDays() - 1)) + '/' + yIndex);

                // set max date to the today date if the loop is on the cur month and cur year
                if (mIndex == curMonth && yIndex == curYear) {
                    maxDate = new Date();
                }

                if (yIndex == firstYear && mIndex == firstMonth) {
                    maxDate = new Date(firstDate);
                }

                var $curCal = $month.datepicker({
                    hideIfNoPrevNext: true,
                    minDate: minDate,
                    maxDate: maxDate,
                    beforeShowDay: function(date) {
                      console.log(date);

                        var tmpDate = new Date(date),
                            day = tmpDate.getDate(),
                            month = 1 + Number(tmpDate.getMonth()),
                            year = tmpDate.getFullYear();

                        day = day<10 ? '0' + day : day;
                        month = month<10 ? '0' + month : month;
                        var newDate = day + '.' + month + '.' + year;
                        console.log(newDate);


                        //if (!activeDates.contains(newDate)) {
                        if (activeDates.indexOf(newDate) == -1) {
                            return [false, "empty-day", "Новостей за эту дату нет"];
                        } else {
                            return [true, "", ""];
                        }



                    },
                    onSelect: function(dateS, thisCal){
                        console.log(dateS);
                        console.log(window.location.origin + '/?s&archive=1&date=' + dateS);
                        window.location.href = window.location.origin + '/?s&archive=1&date=' + dateS;
                        console.log(thisCal);
                        $('.ui-state-active').removeClass('ui-state-active');
                        $(thisCal.input[0]).find($('.ui-datepicker-current-day')).addClass('ui-state-active');
                    },
                    //disabledDates: ['23.11.2016'],
                    //formatDate:'d.m.Y',
                    //showCurrentAtPos: curMonth - mIndex,
                    //beforeShowDay: function(){
                    //    //alert('12');
                    //},
                });

                $curCal.datepicker('setDate', minDate);

                // remove active state from each calendar (to show active only today date)
                $curCal.find($('.ui-state-active')).removeClass('ui-state-active');

                mIndex--;
            }
        }

        // add active state for the today date
        $('.ui-datepicker-today a').addClass('ui-state-active');
    };

    function getActiveDates() {

    };

    $('#chooseSpecDate').on('click', function(ev){
        //ev.preventDefault();
        console.log(ev.clientX);
        var dateFormatted = $('#currentDate').text();
        var tmpAr = dateFormatted.split('.');
        dateFormatted = [tmpAr[1], tmpAr[0], tmpAr[2]].join('.');
        console.log(dateFormatted);
        $('#chooseDate1').datepicker('dialog', new Date(dateFormatted), function(dateStr){
            //dateStr = new Date(dateStr);
            //var day = dateStr.getDate();
            //day = day<10 ? '0'+day : day;
            //var month = 1 + Number(dateStr.getMonth());
            //month = month<10 ? '0'+month : month;
            //
            //var newDate = day + '.' + month + '.' + dateStr.getFullYear();
            $('#currentDate').text(dateStr);
        }, {
            hideIfNoPrevNext: true,
            maxDate: new Date(),
            beforeShowDay: function(date) {
                console.log(date);


                //var tmpDate = new Date(date),
                //    day = tmpDate.getDate(),
                //    month = 1 + Number(tmpDate.getMonth()),
                //    year = tmpDate.getFullYear();
                //
                //day = day<10 ? '0' + day : day;
                //month = month<10 ? '0' + month : month;
                //var newDate = day + '.' + month + '.' + year;
                //console.log(newDate);
                //
                //
                ////if (!activeDates.contains(newDate)) {
                //if (activeDates.indexOf(newDate) == -1) {
                //    return [false, "empty-day", "Новостей за эту дату нет"];
                //} else {
                    return [true, "", ""];
                //}



            }
        }, [ev.clientX, ev.clientY]);
       //ev.preventDefault();
       // $(this).prev('input').attr('checked', 'checked');
    });

    $('#chooseSpecDate2').on('click', function(ev){
        ev.preventDefault();
        console.log(ev);
        var dateFormatted = $('#currentDate').text();
        var tmpAr = dateFormatted.split('.');

        dateFormatted = [tmpAr[1], tmpAr[0], tmpAr[2]].join('.');
        console.log(dateFormatted);
        $('#chooseDate2').datepicker('dialog', new Date(dateFormatted), function(dateStr){
            console.log(dateStr);
            //dateStr = new Date(dateStr);
            //var day = dateStr.getDate();
            //day = day<10 ? '0'+day : day;
            //console.log(day);
            //var month = 1 + Number(dateStr.getMonth());
            //month = month<10 ? '0'+month : month;
            //console.log(month);
            //var newDate = day + '.' + month + '.' + dateStr.getFullYear();
            $('#currentDate').text(dateStr);
        }, {
            hideIfNoPrevNext: true,
            maxDate: new Date()
        }, [ev.pageX, ev.pageY]);
       //ev.preventDefault();
        //$(this).prev('input').attr('checked', 'checked');
    });

    $(window).on('load scroll resize',function(e){
        if ($('#leftAnnounceBody')[0] && $('#midAnnounceBody')[0]) {
            var h = $('#leftAnnounceBody')[0].clientHeight;
            $('#midAnnounceBody').height(h);
        }




    });

    $(window).on('resize', function(){
        if ($('#bigNews-sm')) {
            $('#bigNews-sm').find($('section')).show();
        }
    });

    $('#bigNews').slick({
        lazyLoad: 'progressive',
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: '<i class="fa fa-chevron-right slick-next"></i>',
        prevArrow: '<i class="fa fa-chevron-left slick-prev"></i>'
    });

    $('#bigNews-mid').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: '<i class="fa fa-chevron-right slick-next"></i>',
        prevArrow: '<i class="fa fa-chevron-left slick-prev"></i>'
    });

    $('#bigNews-sm').on('init', function(ev, slick) {

        $(this).find($('section')).show();

    });

    $('#bigNews-sm').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        //adaptiveHeight: true,
        arrows: true,
        nextArrow: '<i class="fa fa-chevron-right slick-next"></i>',
        prevArrow: '<i class="fa fa-chevron-left slick-prev"></i>'
    });

    $('#photoNews').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        adaptiveHeight: true,
        nextArrow: '<i class="fa fa-chevron-right slick-next"></i>',
        prevArrow: '<i class="fa fa-chevron-left slick-prev"></i>'
    });

    $('#sliderOnPhoto').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: '<i class="fa fa-chevron-right slick-next"></i>',
        prevArrow: '<i class="fa fa-chevron-left slick-prev"></i>'
    });

    $('#btnMenu').on('click', function(e){
        // e.preventDefault();
        toggleMenu();
        return false;
    });

    $('#btnMenu1').on('click', function(e){
         e.preventDefault();
        toggleMenu1();
        //return false;
    });

    jsSocials.shares.vkontakte = {
        label: "Поделиться",
        logo: "fa fa-vk",
        shareUrl: "http://vkontakte.ru/share.php?url={url}&title={title}&description={text}&image={image}",
        countUrl: ""
    };

    jsSocials.shares.print = {
        label: "Распечатать",
        logo: "fa fa-print",
        shareUrl: "",
        countUrl: "",
        shareIn: 'self'
    };



    
    $("#socShare").jsSocials({
        //url: "http://www.google.com",
        //text: "Google Search Page",
        showCount: true,
        showLabel: false,
        shareIn: "popup",
        shares: [
            //{ share: "twitter", via: "artem_tabalin", hashtags: "search,google" },
            "twitter",
            "facebook",
            "vkontakte",
            "googleplus",
            "print"
            // {
            //     share: "googleplus",
            //     logo: 'fa fa-google-plus'
            // }
        ],
        on: {
            click: function(ev){
                if(this.share === "print") {
                    console.log("Print");
                    window.print();
                }
            }
        }
    });

    $(window).on('load resize', function(){
        if ($('#btnMenu').hasClass('is-opened')) {
            toggleMenu();
        }

        if (window.innerWidth > 992) {
            $('#blockMenu').show();
        } else {
            $('#blockMenu').hide();
        }

        $('#searchMob').hide();
    });

    $(window).on('scroll', function(e){

        var scrollPos = 0;
        var bodyClass = '';
        if (window.innerWidth > 767) {
            scrollPos = 75;
            bodyClass = '-nav-fixed';
        } else {
            scrollPos = 0;
            bodyClass = '';
        }

        if ($(window).scrollTop() > scrollPos) {
            $('.main-nav').addClass('-fixed');
            $('body').addClass(bodyClass);
        } else {
            $('.main-nav').removeClass('-fixed');
            $('body').removeClass(bodyClass).removeClass('-nav-fixed');
        }

    });

    $(document).on('click', function(e){
        if ($('#btnMenu1 > .btn-menu-visible').hasClass('is-opened')) {
            if (e.target != $('#blockMenu1')[0]
                    && !$('#blockMenu1')[0].contains(e.target)
                    && e.target != $('#btnMenu1')[0]
                    && !$('#btnMenu1')[0].contains(e.target)) {
                toggleMenu1();
            }
        }

        if ($('#searchMob').hasClass('is-opened')){
            if (e.target != $('#searchMob')[0]
                    && !$('#searchMob')[0].contains(e.target)
                    && e.target != $('#searchBtn')[0]
                    && !$('#searchBtn')[0].contains(e.target)) {
                $('#searchMob').slideToggle();
                $('#searchMob').toggleClass('is-opened');
            }
        }

        console.log($('#searchTooltip'));
        console.log($('#searchTooltip').length);
        if ($('#searchTooltip').length) {
            if (e.target != $('#searchTooltip')[0]
                && !$('#searchTooltip')[0].contains(e.target)) {
                $('#searchTooltip').hide();
            }
        }
    });

    $('#searchBtn').on('click', function(e){
        $('#searchMob').slideToggle();
        $('#searchMob').toggleClass('is-opened');
    });

    function toggleMenu() {
        $('#btnMenu').toggleClass('is-opened');
        $('#blockMenu').slideToggle();
    }

    function toggleMenu1() {
        $('#btnMenu1 > .btn-menu-visible').toggleClass('is-opened');
        $('#blockMenu1').slideToggle();
    }

    $('#articleSlider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: '<i class="fa fa-chevron-right slick-next"></i>',
        prevArrow: '<i class="fa fa-chevron-left slick-prev"></i>',
        variableWidth: false,
        centerMode: false,
        focusOnSelect: true,
        asNavFor: '#articleNavSlider'
    });

    var smSlides = Math.floor($('.article').width() / 150);
    console.log($('.article').width());
    console.log(smSlides);

    $('#searchInputDosje').on('keyup', function(ev){
        if (ev.keyCode === 27){
            return false;
        }
        var searchInputVal = $(this).val();
        var $searchTooltip = $(this).closest('search-dosje').find('#searchTooltip');
        console.log($searchTooltip);
        if (searchInputVal.length >= 2) {
            $('#searchTooltip').show();
            //$.ajax({
            //    type: "post",
            //    url: "search.php",
            //    data: searchInputVal,
            //    // dataType: "text",
            //    success: function(data){
            //        var output = '';
            //        if (data.length > 0) {
            //            data.forEach(function(el,i){
            //                output += '<div class="tooltip-item"><a href="' + el.link + '">' + el.name + '</a></div>';
            //
            //            });
            //
            //        } else {
            //            outputp = '<div class="tooltip-item"><a href="/search.html">По вашему запросу ничего не найдено</a></div>';
            //        }
            //
            //        $searchTooltip.html(output);
            //    },
            //    error: function(xhr, str){
            //        outputp = '<div class="tooltip-item"><a href="/search.html">По вашему запросу ничего не найдено</a></div>';
            //        $searchTooltip.html(output);
            //    }
            //});
        } else {
            $('#searchTooltip').hide();
        }
    });

    $('#searchInputDosje').on('keydown', function(ev){
        ev.stopPropagation();
        if (ev.keyCode === 27){
            $('#searchTooltip').hide();
        }
    });




    $('#articleNavSlider').slick({
        //slidesToShow: smSlides,
        slidesToScroll: 1,
        asNavFor: '#articleSlider',
        dots: false,
        centerMode: false,
        focusOnSelect: true,
        variableWidth: true,
        arrows: false,
        infinite: false

    });

    $('#articleNavSlider1').slick({
        //slidesToShow: smSlides,
        slidesToScroll: 1,
        dots: false,
        centerMode: false,
        focusOnSelect: false,
        variableWidth: true,
        arrows: false,
        infinite: false
    });



    $('#articleNavSlider1').on('click', '.slick-slide', function(ev){
        //var $img = $(this).children().eq(0);
        //var imgSrc = $($img)[0].currentSrc;
        //if (imgSrc && imgSrc.length) {
        //    $('#imgModal').html('<img src="' + imgSrc + '">');
        //}
        setTimeout(function(){
            $('#articleSliderModal').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                nextArrow: '<i class="fa fa-chevron-right slick-next"></i>',
                prevArrow: '<i class="fa fa-chevron-left slick-prev"></i>',
                variableWidth: false,
                centerMode: false,
                focusOnSelect: false
            });


        }, 100);

        setTimeout(function(){
            $('#articleSliderModal').css('opacity', '1');
            $('#articleSliderModal').css('visibility', 'visible');
        }, 200);



        $('body').addClass('modal-opened');
        //$('#imgModal').fadeIn(200);
    });

    $('#whitePage').on('click', function(ev){
        //console.log($('#articleSliderModal').slick('unslick'));
        $('#articleSliderModal').slick('unslick');
        $('body').removeClass('modal-opened');
        ////$('#imgModal').html('').fadeOut();
        $('#articleSliderModal').css('opacity', '0');
        $('#articleSliderModal').css('visibility', 'hidden');
        //$('#imgModal').hide();
    });

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

});

