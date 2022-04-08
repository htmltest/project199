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
            curValue == 1;
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
            curValue == curMax;
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

});

function initForm(curForm) {
    curForm.find('input.phoneRU').mask('+7 000 000-00-00');

    curForm.find('.form-input textarea').each(function() {
        $(this).css({'height': this.scrollHeight, 'overflow-y': 'hidden'});
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

    $('.bonus-history-list-row').removeClass('visible inverse');
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
    $('.bonus-history-list-row.visible:odd').addClass('inverse');
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