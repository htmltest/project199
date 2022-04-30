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

    $('.supervizor-saloons-filter').each(function() {
        var curForm = $(this).find('form');
        var isActive = false;
        if (curForm.find('input[type="checkbox"]:checked').length > 0) {
            isActive = true;
        }
        if (curForm.find('input[type="radio"]:checked').length > 0) {
            isActive = true;
        }
        curForm.find('.form-input input').each(function() {
            if ($(this).val() != '') {
                isActive = true;
            }
        });
        if (isActive) {
            $('html').addClass('filter-open');
        }
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

    $('.analytics-data-wrapper').each(function() {
        $('.analytics-data-wrapper').append('<div class="analytics-data-wrapper-fixed"><div class="analytics-data">' + $('.analytics-data-wrapper > .analytics-data').html() + '</div></div>');
        $('.analytics-data-wrapper-fixed').find('thead tr').each(function() {
            $(this).find('.analytics-data-header:gt(1)').remove();
            $(this).find('.analytics-data-header-top:gt(0)').remove();
        });
        $('.analytics-data-wrapper-fixed').find('.analytics-data-header-top').attr('colspan', '2');
        $('.analytics-data-wrapper-fixed').find('.analytics-data-header-top').html('&nbsp;');
        $('.analytics-data-wrapper-fixed').find('tbody tr').each(function() {
            $(this).find('td:gt(1)').remove();
        });
    });

    $('.analytics-data-wrapper > .analytics-data').mCustomScrollbar({
        axis: 'x',
        callbacks:{
            whileScrolling: function() {
                if (this.mcs.left == 0) {
                    $('.analytics-data-wrapper').removeClass('isFixed');
                } else {
                    $('.analytics-data-wrapper').addClass('isFixed');
                }
            }
        }
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

    $('.analytics-data-wrapper-fixed').each(function() {
        var curData = $(this).parents().filter('.analytics-data-wrapper');
        curData.find('.analytics-data-wrapper-fixed tr').each(function() {
            var curTR = $(this);
            var curIndex = curData.find('.analytics-data-wrapper-fixed tr').index(curTR);
            var curHeight = curData.find('> .analytics-data tr').eq(curIndex).find('> *:first').outerHeight();
            curTR.find('> *').css({'height': curHeight});
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

$(window).on('load resize scroll', function() {
    var windowScroll = $(window).scrollTop();
    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    $('.analytics-data .mCSB_scrollTools').each(function() {
        var curTools = $(this);
        var curBlock = curTools.parent();
        if (windowScroll + windowHeight > curBlock.offset().top) {
            var curBottom = (windowScroll + windowHeight) - (curBlock.offset().top + curBlock.height() - 5);
            if (curBottom < 5) {
                curBottom = 5;
            }
            curTools.css({'position': 'fixed', 'z-index': 2, 'left': curBlock.offset().left, 'bottom': curBottom, 'right': 'auto', 'width': curBlock.width()});
        } else {
            curTools.css({'position': 'absolute', 'left': 0, 'bottom': 0, 'right': '0', 'width': 'auto'});
        }
    });
});