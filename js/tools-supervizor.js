$(document).ready(function() {

    $('body').on('click', '.supervizor-saloons-list-row', function(e) {
        windowOpen($(this).attr('data-href'));
        e.preventDefault();
    });

    $('body').on('click', '.report-item-header-content a', function(e) {
        var curItem = $(this).parents().filter('.report-item');
        curItem.toggleClass('open');
        curItem.find('.report-item-content').slideToggle();
        e.preventDefault();
    });

    $('.supervizor-saloons-filter-link a').click(function(e) {
        $('html').toggleClass('filter-open');
        e.preventDefault();
    });

    $('.supervizor-saloons-filter-q-current').click(function() {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.supervizor-saloons-filter-q').length == 0) {
            $('.supervizor-saloons-filter-q').removeClass('open');
        }
    });

    $('.supervizor-saloons-filter-q-list-row-q input').change(function() {
        updateSupervizorSaloonsFilterQ();
    });

    $('.supervizor-saloons-filter-q').each(function() {
        updateSupervizorSaloonsFilterQ();
    });

    $('.supervizor-saloons-filter-status-current').click(function() {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.supervizor-saloons-filter-status').length == 0) {
            $('.supervizor-saloons-filter-status').removeClass('open');
        }
    });

    $('.supervizor-saloons-filter-status-list-row input').change(function() {
        updateSupervizorSaloonsFilterStatus();
    });

    $('.supervizor-saloons-filter-status').each(function() {
        updateSupervizorSaloonsFilterStatus();
    });

});

$(window).on('load resize', function() {

    $('.catalogue').each(function() {
        var curList = $(this);

        curList.find('.catalogue-item-title').css({'min-height': '0px'});

        curList.find('.catalogue-item-title').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.parents().filter('.catalogue-item').offset().top;

            curList.find('.catalogue-item-title').each(function() {
                var otherBlock = $(this);
                if (otherBlock.parents().filter('.catalogue-item').offset().top == curTop) {
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

function updateSupervizorSaloonsFilterQ() {
    var newText = '';

    $('.supervizor-saloons-filter-q-list-row-q input:checked').each(function() {
        if (newText != '') {
            newText += '; ';
        }
        newText += $(this).parents().filter('.supervizor-saloons-filter-q-list-row').find('.supervizor-saloons-filter-q-list-row-y').html() + ', '+ $(this).parent().find('span').html();
    });

    $('.supervizor-saloons-filter-q-current span').html(newText);
}

function updateSupervizorSaloonsFilterStatus() {
    var newText = '';

    $('.supervizor-saloons-filter-status-list-row input:checked').each(function() {
        if (newText != '') {
            newText += ', ';
        }
        newText += $(this).parent().find('span em').html();
    });

    $('.supervizor-saloons-filter-status-current span').html(newText);
}