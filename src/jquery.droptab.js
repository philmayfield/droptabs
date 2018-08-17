(function($) {
  $.fn.droptab = function(options) {
    var settings = $.extend(
      {
        // Defaults
        breakWidth: "auto",
        selectBoxClass: "droptab-selector",
        selectCurrent: "droptab-select-current",
        selectButton: "droptab-select-button",
        smallMenuClass: "droptab-small-menu",
        menuClass: "droptab-menu",
        menuOpenClass: "open",
        activeClass: "active",
        targetWidth: "auto",
        hiddenMsgClass: "drop-tab-hidden",
        openMsg: "Choose",
        msgTransitionTime: 250,
        autoClose: false,
        droptabCallback: function() {},
        droptabSwitch: function() {}
      },
      options
    );

    var droptab = this,
      breakWidth = settings.breakWidth,
      selectBoxClass = settings.selectBoxClass,
      selectCurrent = settings.selectCurrent,
      selectButton = settings.selectButton,
      smallMenuClass = settings.smallMenuClass,
      menuClass = settings.menuClass,
      menuOpenClass = settings.menuOpenClass,
      activeClass = settings.activeClass,
      targetWidth = settings.targetWidth,
      hiddenMsgClass = settings.hiddenMsgClass,
      openMsg = settings.openMsg,
      msgTransitionTime = settings.msgTransitionTime,
      autoClose = settings.autoClose,
      droptabCallback = settings.droptabCallback,
      droptabSwitch = settings.droptabSwitch;

    // Set up selector structure
    this.addClass(menuClass).before(
      '<div class="' +
        selectBoxClass +
        '"><span class="' +
        selectCurrent +
        '"></span><span class="' +
        selectButton +
        '">Open Button</span></div>'
    );

    // Set up selector as a var
    var droptabSelector = this.siblings("." + selectBoxClass);

    // Set the content of the selector to whichever li has the activeClass
    var activeText = getActiveTxt(droptab, activeClass, openMsg);
    droptabSelector.find("." + selectCurrent).text(activeText);

    // Get the width of the list items if breakWidth is set to auto
    if (breakWidth == "auto") {
      breakWidth = 0;
      droptab.find("li").each(function() {
        breakWidth = breakWidth + $(this).outerWidth(true) + 1;
      });
    }

    // Get loc var
    var loc = getLoc(breakWidth, "", droptab);

    // Behavior of the drop-tab at small size
    droptabSelector.find("." + selectButton).on("click", function() {
      var button = $(this),
        selectCurrentElement = $(this).siblings("." + selectCurrent),
        h = 0;
      if (
        $(this)
          .parent()
          .hasClass(menuOpenClass)
      ) {
        // closing
        button.parent().toggleClass(menuOpenClass);
        droptab.toggleClass(menuOpenClass).css("height", 0);
        activeText = getActiveTxt(droptab, activeClass, openMsg);
        if (activeText) {
          setMsg(
            selectCurrentElement,
            msgTransitionTime,
            hiddenMsgClass,
            activeText
          );
        }
      } else {
        // opening
        droptab
          .find("li")
          .each(function() {
            h = h + $(this).outerHeight(true);
          })
          .promise()
          .done(function() {
            button.parent().toggleClass(menuOpenClass);
            droptab.css("height", h).toggleClass(menuOpenClass);
          });
        if (selectCurrentElement.text() != openMsg) {
          setMsg(
            selectCurrentElement,
            msgTransitionTime,
            hiddenMsgClass,
            openMsg
          );
        }
      }
    });

    // Auto close behavior
    droptab.find("a").on("click", function(e) {
      if (
        $(this)
          .closest("." + menuClass)
          .hasClass(smallMenuClass) &&
        autoClose == true
      ) {
        setTimeout(function() {
          droptabSelector.find("." + selectButton).trigger("click");
        }, 250);
      }
    });

    // Get the size on screen resize
    $(window).on("resize", function() {
      loc = getLoc(breakWidth, loc, droptab);
    });

    /* FUNCTIONS */

    // Function to set loc
    function getLoc(breakWidth, loc, droptab) {
      if (targetWidth == "auto") {
        var w = droptab.parent().width();
      } else {
        var w = $(targetWidth).width();
      }

      if (w < breakWidth) {
        // Small size
        if (loc == "L" || loc == "") {
          if (loc == "L") {
            // Fire switch callback only when switching, not on initial load
            droptabSwitch.call(this);
          }
          loc = "S";
          droptab
            .css("height", 0)
            .addClass(smallMenuClass)
            .prev()
            .css("display", "block");
        }
      } else {
        // Large size
        if (loc == "S" || loc == "") {
          if (loc == "S") {
            // Fire switch callback only when switching, not on initial load
            droptabSwitch.call(this);
          }
          loc = "L";
          droptab
            .css("height", "auto")
            .removeClass(smallMenuClass + " " + menuOpenClass)
            .prev()
            .removeClass(menuOpenClass)
            .css("display", "none");
        }
      }
      return loc;
    }

    function setMsg(
      selectCurrentElement,
      msgTransitionTime,
      hiddenMsgClass,
      newMsg
    ) {
      selectCurrentElement.addClass(function() {
        setTimeout(function() {
          selectCurrentElement
            .empty()
            .text(newMsg)
            .removeClass(hiddenMsgClass);
        }, msgTransitionTime);
        return hiddenMsgClass;
      });
    }

    function getActiveTxt(droptab, activeClass, openMsg) {
      if (droptab.find("." + activeClass).length > 0) {
        var activeText = droptab
          .find("." + activeClass)
          .find("a")
          .text();
        return activeText;
      } else {
        return openMsg;
      }
    }

    // Main Callback
    droptabCallback.call(this);
  };
})(jQuery);
