(function(){
  "use strict";

  /**
   * Analyse an URL search part, look for 'varToExtract=somevalue' in the string
   * @param  {[type]} varToExtract variable we want to extract from the URL
   * @return {[type]} the value associated to the varToExtract, or null if nothing was found
   */
  function extractFromUrl(varToExtract){
    return new Promise((resolve, reject) => {
      try{
        let parser  = document.createElement('a');
        parser.href = location.href;
        let value   = parser.search.substring(1).split("&").filter(function(cell){ return (cell.indexOf(varToExtract + "=") !== -1);});
        value       = (value.length > 0 ? value[0].split("=") : null);

        resolve(value && value.length > 0 ? value[1] || null : null);
      }
      catch(err){
        reject(err);
      }
    })
  };

  //Adapt UI depending if we are loading a model or have an empty scene
  extractFromUrl("url").then((url) => {
    if(!url){
      document.getElementById("butGallery").classList.add("show");
      document.getElementById("loaderDiv").classList.remove('make-container--visible');
      document.getElementById("butGallery").title = "";
      document.getElementById("butFav").classList.add("hide");
    }
    else{
      document.getElementById("butGalleryTip").classList.add("hide");
    }
  }).catch((err) => {
    console.log("[UI-Script] Error in checking URL", err);
  });

  /**
   * ===============================
   * ======== LOAD MODEL UI ========
   */

  document.getElementById('butLoad').addEventListener('click', function() {
    // Open/show the load new model dialog
    toggleDialog("loadModel");
    toggleDialog("gallery", true);
    event.stopPropagation();
  });

  document.getElementById('butLoadURL').addEventListener('click', function() {
    // Load the new model
    var url = document.getElementById('loadURL').value;
    location.href = (location.host.indexOf("localhost") !== -1 ? "http://" : "https://") + location.host + location.pathname + "?url=" + url;
    toggleDialog("loadModel");
    event.stopPropagation();
  });

  document.getElementById('butLoadCancel').addEventListener('click', function() {
    // Close the load new model dialog
    toggleDialog("loadModel");
    event.stopPropagation();
  });


  /**
   * ============================
   * ======== GALLERY UI ========
   */

  /**
   * Open/show the gallery container
   */
  document.getElementById('butGallery').addEventListener('click', function(event) {
    toggleDialog("gallery");
    toggleDialog("loadModel", true);
    //Resize icons to be squared
    [].forEach.call(document.getElementsByClassName("imgModelLink"), function(domElt){
      domElt.height = domElt.width;
    })
    event.stopPropagation();
  });

  /**
   * Hide the tooltip under the gallery button
   */
  document.getElementById("butGallery").addEventListener('mouseover', function(){
    document.getElementById("butGallery").classList.remove("show");
    document.getElementById("butGallery").classList.remove("ttFirst");
    document.getElementById("butGallery").classList.add("tt");
  });

  /**
   * Close the gallery container
   */
  document.getElementById('closeModel').addEventListener('click', function() {
    toggleDialog("gallery");
    event.stopPropagation();
  });


  /**
   * ========================
   * ======== FAV UI ========
   */

  /**
   * Add current model to favorites
   */
  document.getElementById('butFav').addEventListener('click', function() {
    if(modelManager){
      modelManager.saveThumb(2);//2 = ModelManager.TYPES.STARRED
    }
  });


  /**
   * ============================
   * ======== QR Code UI ========
   */
  
  /**
   * Generate the QR Code image and display it
   */
  document.getElementById("butQRCode").addEventListener("click", function(event){
    let typeNumber           = 12;//We need a model a bit high for long URLs. 12 should do it
    let errorCorrectionLevel = 'L';
    let qr                   = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(location.href);
    qr.make();
    document.getElementById('qrcode').innerHTML = qr.createImgTag(4);

    toggleDialog("qrCodeDiv");


    document.getElementById("closeQRCode").addEventListener("click", function(event){
      toggleDialog("qrCodeDiv");
    });

    event.stopPropagation();
  });


  /**
   * Toggles the visibility of the appropriate dialog screen. 
   * @param  {string} eltID ID of the screen to show/hide
   * @param  {boolean} forceClose force close even if not open (remove check)
   */
  function toggleDialog(eltID, forceClose) {
    let domElt = document.getElementById(eltID);
    if(!domElt){
      return;
    }

    if (domElt.classList.contains('make-container--visible') || forceClose) {
      domElt.classList.remove('make-container--visible');
    } else {
      domElt.classList.add('make-container--visible');
    }
  };
})();