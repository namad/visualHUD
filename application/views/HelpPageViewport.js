visualHUD.Views.HelpPageViewport = Backbone.View.extend({


    events: {
        'click #navigation a': 'resetScroll'
    },

    initialize: function(options) {
        $(window).on('scroll', visualHUD.Function.bind(this.scrollSpy, this));
    },

    getDOMRefs: function() {
        var refs = this.refs;

        if(!refs) {
            refs = this.refs = {
                header: $('div.site-header')
            }
        }

        return refs;
    },

    render: function(viewport) {
    },

    scrollSpy: function() {
        var scrollTop = $(window).scrollTop(),
            fix = scrollTop >= 10;

        if(fix == true && !this.fixed) {
            this.fixed = true;
            this.getDOMRefs().header.addClass('site-header-fixed');
        }

        if(fix == false && this.fixed) {
            this.fixed = false;
            this.getDOMRefs().header.removeClass('site-header-fixed');
        }
    },

    setPage: function(page, section, html) {
        var content = $('#content'),
            currentPageSelector = 'div.content-' + page,
            allPages = content.children().not(currentPageSelector),
            currentPage = content.find(currentPageSelector);

        allPages.hide();

        if(currentPage.length) {
            currentPage.show();
        }
        else {
            currentPage = $('<div/>').addClass('content-' + page).appendTo(content);
            currentPage.html(html);
        }

        if(section != null) {
            $.scrollTo('[name=' + section + ']', {
                offset: {
                    top: -1 * (this.getDOMRefs().header.height() + parseInt(this.getDOMRefs().header.css('top')))
                }
            });
        }

        $('#navigation').find('li.active').removeClass('active');
        $('#navigation').find('li.page-' + page).addClass('active');
    },

    resetScroll: function() {
        $.scrollTo('0px');
    }
});



