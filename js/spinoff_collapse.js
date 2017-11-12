(function ($) {

  Drupal.Spinoff = Drupal.Spinoff || {};

  // Most of this is from toggle, but it doesn't allow much customization of handles

  /**
   * Object to store state.
   *
   * This object will remember the state of collapsible containers. The first
   * time a state is requested, it will check the cookie and set up the variable.
   * If a state has been changed, when the window is unloaded the state will be
   * saved.
   */
  Drupal.Spinoff.Collapsible = {
    state: {},
    stateLoaded: false,
    stateChanged: false,
    cookieString: 'spinoff-collapsible-state=',

    /**
     * Get the current collapsed state of a container.
     *
     * If set to 1, the container is open. If set to -1, the container is
     * collapsed. If unset the state is unknown, and the default state should
     * be used.
     */
    getState: function (id) {
      if (!this.stateLoaded) {
        this.loadCookie();
      }

      return this.state[id];
    },

    /**
     * Set the collapsed state of a container for subsequent page loads.
     *
     * Set the state to 1 for open, -1 for collapsed.
     */
    setState: function (id, state) {
      if (!this.stateLoaded) {
        this.loadCookie();
      }

      this.state[id] = state;

      if (!this.stateChanged) {
        this.stateChanged = true;
        $(window).unload(this.unload);
      }
    },

    /**
     * Check the cookie and load the state variable.
     */
    loadCookie: function () {
      // If there is a previous instance of this cookie
      if (document.cookie.length > 0) {
        // Get the number of characters that have the list of values
        // from our string index.
        offset = document.cookie.indexOf(this.cookieString);

        // If its positive, there is a list!
        if (offset != -1) {
          offset += this.cookieString.length;
          var end = document.cookie.indexOf(';', offset);
          if (end == -1) {
            end = document.cookie.length;
          }

          // Get a list of all values that are saved on our string
          var cookie = unescape(document.cookie.substring(offset, end));

          if (cookie != '') {
            var cookieList = cookie.split(',');
            for (var i = 0; i < cookieList.length; i++) {
              var info = cookieList[i].split(':');
              this.state[info[0]] = info[1];
            }
          }
        }
      }

      this.stateLoaded = true;
    },

    /**
     * Turn the state variable into a string and store it in the cookie.
     */
    storeCookie: function () {
      var cookie = '';

      // Get a list of IDs, saparated by comma
      for (i in this.state) {
        if (cookie != '') {
          cookie += ',';
        }
        cookie += i + ':' + this.state[i];
      }

      // Save this values on the cookie
      document.cookie = this.cookieString + escape(cookie) + ';path=/';
    },

    /**
     * Respond to the unload event by storing the current state.
     */
    unload: function() {
      Drupal.Spinoff.Collapsible.storeCookie();
    }
  };

  // Set up an array for callbacks.
  Drupal.Spinoff.CollapsibleCallbacks = [];
  Drupal.Spinoff.CollapsibleCallbacksAfterToggle = [];

  /**
   * Bind collapsible behavior to a given container.
   */
  Drupal.Spinoff.bindCollapsible = function () {
    var $container = $(this);

    // Allow the specification of the 'no container' class, which means the
    // handle and the container can be completely independent.
    if ($container.hasClass('spinoff-no-container') && $container.attr('id')) {
      // In this case, the container *is* the handle and the content is found
      // by adding '-content' to the id. Obviously, an id is required.
      var handle = $container;
      var content = $('#' + $container.attr('id') + '-content');
    }
    else {
      var handle = $container.children('.spinoff-collapsible-handle');
      var content = $container.children('div.spinoff-collapsible-content');
    }

    if (content.length) {
      // Create the toggle item and place it in front of the toggle.
      var toggle = $('<span class="spinoff-toggle"></span>');
      var toggleImg = document.createElement('img');
      toggleImg.src = Drupal.settings.basePath + 'misc/menu-expanded.png';

      // If the remember class is set, check to see if we have a remembered
      // state stored.
      if ($container.hasClass('spinoff-collapsible-remember') && $container.attr('id')) {
        var state = Drupal.Spinoff.Collapsible.getState($container.attr('id'));
        if (state == 1) {
          $container.removeClass('spinoff-collapsed');
        }
        else if (state == -1) {
          $container.addClass('spinoff-collapsed');
        }
      }

      // If we should start collapsed, do so:
      if ($container.hasClass('spinoff-collapsed')) {
        toggle.toggleClass('spinoff-toggle-collapsed');
        toggleImg.src = Drupal.settings.basePath + 'misc/menu-collapsed.png';
        content.hide();
      }

      toggle.append(toggleImg);
      handle.append(toggle);

      var afterToggle = function () {
        if (Drupal.Spinoff.CollapsibleCallbacksAfterToggle) {
          for (i in Drupal.Spinoff.CollapsibleCallbacksAfterToggle) {
            Drupal.Spinoff.CollapsibleCallbacksAfterToggle[i]($container, handle, content, toggle);
          }
        }
      }

      var clickMe = function () {
        if (Drupal.Spinoff.CollapsibleCallbacks) {
          for (i in Drupal.Spinoff.CollapsibleCallbacks) {
            Drupal.Spinoff.CollapsibleCallbacks[i]($container, handle, content, toggle);
          }
        }

        // If the container is a table element slideToggle does not do what
        // we want, so use toggle() instead.
        if ($container.is('table')) {
          content.toggle(0, afterToggle);
        }
        else {
          content.slideToggle(100, afterToggle);
        }

        toggle.toggleClass('spinoff-toggle-collapsed');

        // If we should start collapsed, do so:
        if (toggle.hasClass('spinoff-toggle-collapsed')) {
          toggleImg.src = Drupal.settings.basePath + 'misc/menu-collapsed.png';
        } else {
          toggleImg.src = Drupal.settings.basePath + 'misc/menu-expanded.png';
        }

        // If we're supposed to remember the state of this class, do so.
        if ($container.hasClass('spinoff-collapsible-remember') && $container.attr('id')) {
          var state = toggle.hasClass('spinoff-toggle-collapsed') ? -1 : 1;
          Drupal.Spinoff.Collapsible.setState($container.attr('id'), state);
        }
      }

      // Let both the toggle and the handle be clickable.
      handle.click(clickMe);
    }
  };

  Drupal.behaviors.SpinoffCollapsible = {
    attach: function(context) {
      $('.spinoff-collapsible-container:not(.spinoff-collapsible-processed)', context)
        .each(Drupal.Spinoff.bindCollapsible)
        .addClass('spinoff-collapsible-processed');
    }
  }


})(jQuery);