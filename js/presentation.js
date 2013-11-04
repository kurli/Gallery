/*
 * Copyright 2013, Intel Corp.
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint unparam: true */
/*global window, document, blueimp, $ */

(function(exports) {
  'use strict';
  var remoteWindow = null;
  if (!navigator.presentation) {
    console.log("navigator.presentation is not supported yet!");
    return;
  }

  function showImageOnSecondaryDisplay() {
    if (!navigator.presentation.displayAvailable || !window.imageGallery)
      return;

    navigator.presentation.requestShow("remoteView.html",  function(win) {
      remoteWindow = win;
      window.imageGallery.sendToRemoteView();
    }, function(error) {
      console.error("failed to show image: " + error.name);
    });
  }

  blueimp.Gallery.prototype.sendToRemoteView = function() {
    var index = this.getIndex();
    var url = this.getItemProperty(this.list[index], this.options.urlProperty);
    if (remoteWindow) {
      remoteWindow.postMessage(url, "*");
    } else {
      console.error("remote window is not created yet");
    }
  }

  if (navigator.presentation.displayAvailable && window.imageGallery)
    requestShow();

  navigator.presentation.addEventListener("displayavailablechange", function() {
    if (navigator.presentation.displayAvailable) {
      console.log("The secondary display is available now");
      if (!window.imageGallery) return;

      if (!remoteWindow) {
        showImageOnSecondaryDisplay();
      } else {
        window.imageGallery.sendToRemoteView();
      }
    } else {
      console.log("The secondary display is unavailable now.");
      if (remoteWindow) remoteWindow.close();
      remoteWindow = null;
    }
  });

  exports.showImageOnSecondaryDisplay = showImageOnSecondaryDisplay;
})(window);

