$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \d{3} \d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $('body').on('input', '.form-input textarea', function() {
        this.style.height = (this.scrollHeight) + 'px';
    });

    $('body').on('change', '.form-file input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.form-file');
        var curName = curInput.val().replace(/.*(\/|\\)/, '');
        if (curName != '') {
            curField.find('.form-file-title').html(curName);
            curField.find('input').removeClass('error');
            curField.find('label.error').remove();
        } else {
            curField.find('.form-file-title').html('');
        }
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('.cart').each(function() {
        recalcCart();
    });

    $('body').on('click', '.cart-row-remove a', function(e) {
        $(this).parents().filter('.cart-row').remove();
        recalcCart();
        e.preventDefault();
    });

    $('body').on('click', '.cart-row-count-dec', function(e) {
        var curRow = $(this).parents().filter('.cart-row');
        var curInput = curRow.find('.cart-row-count input');
        var curValue = Number(curInput.val());
        curValue--;
        if (curValue <= 1) {
            curValue = 1;
        }
        curInput.val(curValue);
        recalcCart();
        e.preventDefault();
    });

    $('body').on('click', '.cart-row-count-inc', function(e) {
        var curRow = $(this).parents().filter('.cart-row');
        var curInput = curRow.find('.cart-row-count input');
        var curValue = Number(curInput.val());
        var curMax = Number(curInput.attr('data-max'));
        curValue++;
        if (curValue >= curMax) {
            curValue = curMax;
        }
        curInput.val(curValue);
        recalcCart();
        e.preventDefault();
    });

    $('.faq-item-title').click(function(e) {
        $(this).parent().toggleClass('open');
        $(this).parent().find('.faq-item-content').slideToggle();
        e.preventDefault();
    });

    $('.bonus-history').each(function() {
        $(this).attr('data-count', 3);
        updateBonusHistory();
    });

    $('.bonus-history-radios input').change(function() {
        updateBonusHistory();
    });

    $('.bonus-history-more a').click(function(e) {
        var curBlock = $('.bonus-history');
        var count = Number(curBlock.attr('data-count'));
        if ($('.bonus-history-more').hasClass('view-all')) {
            count = 3;
        } else {
            count += 3;
        }
        curBlock.attr('data-count', count);
        updateBonusHistory();
        e.preventDefault();
    });

    $('.up-link').click(function(e) {
        $('html, body').animate({'scrollTop': 0});
        e.preventDefault();
    });

    $('.main-catalogue-all a').click(function(e) {
        $('.main-catalogue').toggleClass('open');
        e.preventDefault();
    });

    $('body').on('click', '.window-link', function(e) {
        windowOpen($(this).attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $('body').on('click', '.window-close, .window-close-btn', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('.rules-item-title').click(function(e) {
        $(this).parent().toggleClass('open');
        $(this).parent().find('.rules-item-content').slideToggle();
        e.preventDefault();
    });

    $('body').on('click', '.main-catalogue-item-btn .btn', function(e) {
        $('.to-cart').remove();
        var curLink = $(this);
        var curItem = curLink.parents().filter('.main-catalogue-item');
        $.ajax({
            type: 'POST',
            url: curLink.attr('href'),
            dataType: 'html',
            cache: false
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert('Сервис временно недоступен, попробуйте позже.' + textStatus);
        }).done(function(html) {
            $('body').append(html);
            curLink.remove();
            curItem.find('.main-catalogue-item-btn').append('<div class="main-catalogue-item-count"><svg class="catalogue-in-cart"><use xlink:href="' + pathTemplate + 'images/sprite.svg#catalogue-in-cart"></use></svg><div class="main-catalogue-item-count-value">1</div><div class="main-catalogue-item-count-ctrl"><a href="#" class="main-catalogue-item-count-inc"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#cart-row-inc"></use></svg></a><a href="#" class="main-catalogue-item-count-dec"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#cart-row-dec"></use></svg></a></div></div>');
            var curCart = 0;
            if ($('.header-cart').parent().hasClass('active')) {
                curCart = Number($('.header-cart').parent().find('span').html());
            }
            curCart++;
            $('.header-cart').parent().addClass('active');
            $('.header-cart').parent().find('span').remove();
            $('.header-cart').parent().append('<span>' + curCart + '</span>');
        });
        e.preventDefault();
    });

    $('body').on('click', '.main-catalogue-item-count-dec', function(e) {
        var curRow = $(this).parents().filter('.main-catalogue-item-count');
        var curInput = curRow.find('.main-catalogue-item-count-value');
        var curValue = Number(curInput.html());
        curValue--;
        if (curValue <= 1) {
            curValue = 1;
        }
        curInput.html(curValue);
        e.preventDefault();
    });

    $('body').on('click', '.main-catalogue-item-count-inc', function(e) {
        var curRow = $(this).parents().filter('.main-catalogue-item-count');
        var curInput = curRow.find('.main-catalogue-item-count-value');
        var curValue = Number(curInput.html());
        curValue++;
        curInput.html(curValue);
        e.preventDefault();
    });

    $('body').on('click', '.to-cart-close', function(e) {
        $('.to-cart').remove();
        e.preventDefault();
    });

    $('.orders').each(function() {
        if ($('.orders-item').length > 3) {
            $('.orders-more').addClass('visible');
        }
    });

    $('.orders-more a').click(function(e) {
        var curBlock = $('.orders');
        if ($('.orders-more').hasClass('view-all')) {
            count = 3;
            curBlock.find('.orders-item.visible').removeClass('visible');
            $('.orders-more').removeClass('view-all');
        } else {
            var count = curBlock.find('.orders-item:visible').length;
            count += 3;
            curBlock.find('.orders-item:lt(' + count + ')').addClass('visible');
            if (count >= curBlock.find('.orders-item').length) {
                $('.orders-more').addClass('view-all');
            }
        }
        e.preventDefault();
    });

});

function initForm(curForm) {
    curForm.find('input.phoneRU').mask('+7 000 000-00-00');

    curForm.find('.form-input textarea').each(function() {
        $(this).css({'height': this.scrollHeight, 'overflow-y': 'hidden'});
    });

    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        var options = {
            minimumResultsForSearch: 20
        }

        if ($(window).width() > 1119) {
            options['dropdownAutoWidth'] = true;
        }

        if (curSelect.parents().filter('.window').length == 1) {
            options['dropdownParent'] = $('.window-content');
        }

        curSelect.select2(options);

        curSelect.on('select2:select', function(e) {
            curSelect.parent().find('select.error').removeClass('error');
            curSelect.parent().find('label.error').remove();
        });
    });

    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            var curForm = $(form);
            if (curForm.hasClass('ajax-form')) {
                if (curForm.hasClass('recaptcha-form')) {
                    grecaptcha.ready(function() {
                        grecaptcha.execute('6LdHSvgcAAAAAHfkqTliNRLNbN8n4oSa0UJfMCU3', {action: 'submit'}).then(function(token) {
                            $.ajax({
                                type: 'POST',
                                url: curForm.attr('data-captchaurl'),
                                dataType: 'json',
                                data: 'recaptcha_response=' + token,
                                cache: false
                            }).fail(function(jqXHR, textStatus, errorThrown) {
                                alert('Сервис временно недоступен, попробуйте позже.' + textStatus);
                                curForm.removeClass('loading');
                            }).done(function(data) {
                                if (data.status) {
                                    curForm.addClass('loading');
                                    var formData = new FormData(form);

                                    $.ajax({
                                        type: 'POST',
                                        url: curForm.attr('action'),
                                        processData: false,
                                        contentType: false,
                                        dataType: 'json',
                                        data: formData,
                                        cache: false
                                    }).done(function(data) {
                                        if (data.status) {
                                            curForm.append('<div class="message message-success"><div class="message-title">' + data.title + '</div><div class="message-text">' + data.message + '</div></div>');
                                        } else {
                                            curForm.append('<div class="message message-error"><div class="message-title">' + data.title + '</div><div class="message-text">' + data.message + '</div></div>');
                                        }
                                        curForm.removeClass('loading');
                                    });
                                } else {
                                    alert('Не пройдена проверка Google reCAPTCHA v3.');
                                    curForm.removeClass('loading');
                                }
                            });
                        });
                    });
                } else {
                    curForm.addClass('loading');
                    var formData = new FormData(form);

                    $.ajax({
                        type: 'POST',
                        url: curForm.attr('action'),
                        processData: false,
                        contentType: false,
                        dataType: 'json',
                        data: formData,
                        cache: false
                    }).done(function(data) {
                        curForm.find('.message').remove();
                        if (data.status) {
                            curForm.append('<div class="message message-success"><div class="message-title">' + data.title + '</div><div class="message-text">' + data.message + '</div></div>');

                        } else {
                            curForm.append('<div class="message message-error"><div class="message-title">' + data.title + '</div><div class="message-text">' + data.message + '</div></div>');
                        }
                        curForm.removeClass('loading');
                    });
                }
            } else if (curForm.hasClass('recaptcha-form')) {
                grecaptcha.ready(function() {
                    grecaptcha.execute('6LdHSvgcAAAAAHfkqTliNRLNbN8n4oSa0UJfMCU3', {action: 'submit'}).then(function(token) {
                        $.ajax({
                            type: 'POST',
                            url: curForm.attr('data-captchaurl'),
                            dataType: 'json',
                            data: 'recaptcha_response=' + token,
                            cache: false
                        }).fail(function(jqXHR, textStatus, errorThrown) {
                            alert('Сервис временно недоступен, попробуйте позже.' + textStatus);
                        }).done(function(data) {
                            if (data.status) {
                                form.submit();
                            } else {
                                alert('Не пройдена проверка Google reCAPTCHA v3.');
                            }
                        });
                    });
                });
            } else {
                form.submit();
            }
        }
    });
}

function recalcCart() {
    $('.cart').each(function() {
        var curCart = $(this);
        var maxBonus = Number(curCart.attr('data-bonus'));
        var curBonus = 0;
        curCart.find('.cart-row').each(function() {
            var curRow = $(this);
            var curInput = curRow.find('.cart-row-count input');
            var curValue = Number(curInput.val());
            var curMax = Number(curInput.attr('data-max'));
            if (curValue <= 1) {
                curRow.find('.cart-row-count-dec').addClass('disabled');
            } else {
                curRow.find('.cart-row-count-dec').removeClass('disabled');
            }
            if (curValue >= curMax) {
                curRow.find('.cart-row-count-inc').addClass('disabled');
            } else {
                curRow.find('.cart-row-count-inc').removeClass('disabled');
            }
            curRow.find('.cart-row-count-value').html(curValue);
            var curPrice = Number(curInput.attr('data-price'));
            curRow.find('.cart-row-bonus span').html(curValue * curPrice);
            curBonus += Number(curRow.find('.cart-row-bonus span').html());
        });
        $('.cart-summ-value span').html(curBonus);
        if (curBonus > maxBonus) {
            $('.cart-ctrl-notice').addClass('visible');
            $('.cart-ctrl-submit .btn').prop('disabled', true);
        } else {
            $('.cart-ctrl-notice').removeClass('visible');
            $('.cart-ctrl-submit .btn').prop('disabled', false);
        }
    });
}

function updateBonusHistory() {
    var curBlock = $('.bonus-history');
    var count = Number(curBlock.attr('data-count'));
    var type = $('.bonus-history-radios input:checked').val();

    $('.bonus-history-list-row').removeClass('visible');
    var curCount = 0;
    $('.bonus-history-list-row').each(function() {
        if (curCount < count) {
            var curRow = $(this);
            if (type == '') {
                curRow.addClass('visible');
                curCount++;
            } else if (type == 'up') {
                if (curRow.hasClass('bonus-history-row-up')) {
                    curRow.addClass('visible');
                    curCount++;
                }
            } else {
                if (curRow.hasClass('bonus-history-row-down')) {
                    curRow.addClass('visible');
                    curCount++;
                }
            }
        }
    });
    var allCount = 0;
    if (type == '') {
        allCount = $('.bonus-history-list-row').length;
    } else if (type == 'up') {
        allCount = $('.bonus-history-row-up').length;
    } else {
        allCount = $('.bonus-history-row-down').length;
    }
    if (allCount > curCount) {
        $('.bonus-history-more').addClass('visible').removeClass('view-all');
    } else if (allCount == curCount && allCount > 3) {
        $('.bonus-history-more').addClass('visible view-all');
    } else {
        $('.bonus-history-more').removeClass('visible').removeClass('view-all');
    }
}

$(window).on('load resize scroll', function() {

    var windowScroll = $(window).scrollTop();
    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    if ($('.up-link').length == 1) {
        if (windowScroll > windowHeight) {
            $('.up-link').addClass('visible');
        } else {
            $('.up-link').removeClass('visible');
        }

        if (windowScroll + windowHeight > $('footer').offset().top) {
            var bottomDiff = 60;
            if ($(window).width() > 1199) {
                bottomDiff = 60;
            }
            $('.up-link').css({'margin-bottom': (windowScroll + windowHeight) - $('footer').offset().top + bottomDiff});
        } else {
            $('.up-link').css({'margin-bottom': 0});
        }
    }

});

$(window).on('load resize', function() {

    $('.main-catalogue-list').each(function() {
        var curList = $(this);

        curList.find('.main-catalogue-item-title').css({'min-height': '0px'});

        curList.find('.main-catalogue-item-title').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.parents().filter('.main-catalogue-item').offset().top;

            curList.find('.main-catalogue-item-title').each(function() {
                var otherBlock = $(this);
                if (otherBlock.parents().filter('.main-catalogue-item').offset().top == curTop) {
                    var newHeight = otherBlock.outerHeight();
                    if (newHeight > curHeight) {
                        curBlock.css({'min-height': newHeight + 'px'});
                    } else {
                        otherBlock.css({'min-height': curHeight + 'px'});
                    }
                }
            });
        });
    });

});

function windowOpen(linkWindow, dataWindow) {
    if ($('.window').length == 0) {
        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
    } else {
        $('.window').append('<div class="window-loading"></div>')
        $('.window-container').addClass('window-container-preload');
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        processData: false,
        contentType: false,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window-container').length == 0) {
            $('.window').html('<div class="window-container window-container-preload">' + html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a></div>');
        } else {
            $('.window-container').html(html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a>');
            $('.window .window-loading').remove();
        }

        window.setTimeout(function() {
            $('.window-container-preload').removeClass('window-container-preload');
        }, 100);

        $('.window form').each(function() {
            initForm($(this));
        });

        $(window).trigger('resize');

    });
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
    }
}