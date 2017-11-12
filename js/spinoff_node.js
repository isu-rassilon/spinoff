(function ($) {

  Drupal.Spinoff = Drupal.Spinoff || {};

  if (Drupal.ajax) {

    Drupal.ajax.prototype.commands.spinoff_ajax_log_event_response = function (ajax, response, status) {

      var job_complete = response.data.job_complete;
      var job_error = response.data.job_error;

      if(job_complete || job_error) {

        $("#spinoff-status-wrapper").removeClass("warning");

        if(job_error) {
          $("#spinoff-status-wrapper").addClass("error");
          $("#spinoff-status").html("Status: <span>Error</span>");
        } else {
          $("#spinoff-status-wrapper").addClass("status");

          //$("#spinoff-status-wrapper .spinoff-collapsible-handle").trigger('click');
          // hide log box
          var toggle = $("#spinoff-status-wrapper .spinoff-toggle");
          toggle.toggleClass('spinoff-toggle-collapsed');
          toggle.children("img").attr("src", Drupal.settings.basePath + 'misc/menu-collapsed.png');
          $("#spinoff-status-wrapper div.spinoff-collapsible-content").hide();

          $("#spinoff-status").html("Status: <span>Complete</span>");
          $("#result-file-wrapper").slideDown();

        }

        clearInterval(ajax.timer);

      }

    };

  }

})(jQuery);