(function ($, undefined) {

    // Extends the dialog widget with a new option.
    $.widget("app.dialog", $.ui.dialog, {

        options: {
            iconButtons: []
        },

        _create: function () {

            // Call the default widget constructor.
            this._super();

            // The dialog titlebar is the button container.
            var $titlebar = this.uiDialog.find(".ui-dialog-titlebar");

            // Iterate over the "iconButtons" array, which defaults to
            // and empty array, in which case, nothing happens.
            $.each(this.options.iconButtons, function (i, v) {

                // Finds the last button added. This is actually the
                // left-most button.
                var $button = $("<button/>").text(this.text),
                    right = $titlebar.find("[role='button']:last")
                                     .css("right");

                // Creates the button widget, adding it to the titlebar.
                $button.button({ icons: { primary: this.icon }, text: false })
                       //.addClass("ui-dialog-titlebar-close")
                       .css("right", (parseInt(right) + 22) + "px")
                       .click(this.click)
                       .appendTo($titlebar);

            });

        }

    });

    $(function () {

        // Pass some custom icon buttons to the dialog.
        $("#dialog").dialog({
            iconButtons: [
                {
                    text: "Search",
                    icon: "ui-icon-search",
                    click: function (e) {
                        $("#dialog").html("<p>Searching...</p>");
                    }
                },
                {
                    text: "Add",
                    icon: "ui-icon-plusthick",
                    click: function (e) {
                        $("#dialog").html("<p>Adding...</p>");
                    }
                }
            ]
        });

    });

})(jQuery);