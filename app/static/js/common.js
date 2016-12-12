'use strict'
/**
 * common.js
 * Contains all the functionality that is common between the views
 ******************************/

/* Common variables */

// Load JQuery library and make accessible via $
window.$ = window.jQuery = require('jquery')
// Cross-view dependencies
const {ipcRenderer, remote, shell} = require('electron')
const logger = require('winston')
const Handlebars = require('handlebars')
const {CRYPTO} = require('../config')
// MasterPass regular expression
const MP_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/g
const APP_EVENT_REGEX = /^app:[\w-]+$/i
const RESPONSES = {
  invalid: 'MUST CONTAIN 1 ALPHABET, 1 NUMBER, 1 SYMBOL AND BE AT LEAST 8 CHARACTERS',
  correct: 'CORRECT MASTERPASS',
  incorrect: 'INCORRECT MASTERPASS',
  setSuccess: 'MASTERPASS SUCCESSFULLY SET',
  empty: 'PLEASE ENTER A MASTERPASS',
  resetSuccess: 'You have successfully reset your MasterPass. You\'ll be redirected to verify it shortly.',
  exportSuccess: 'Successfully exported the credentials',
  importSuccess: 'Successfully imported the credentials. You will need to verify the MasterPass for the credentials imported so Crypter will relaunch shortly.'
}
const COLORS = {
  bad: '#9F3A38',
  good: '#2ECC71',
  highlight: '#333333'
}

/* Shared functions */
function navigate (panel) {
  let oldSel = $('.panel-container > div.current') // get current panel
  let sel = $(`#panel-${panel}`) // get panel to navigate to
  oldSel.removeClass('current') // apply hide styling
  sel.addClass('current') // apply show styling
}

function validateMasterPass (field, errLabel) {
  var MPel = $(`input#${field + 'Input'}`)
  const masterpass = MPel.val()
  if (!masterpass) {
    // MP is empty
    // set errLabel text to response for empty and show errLabel
    errLabel.text(RESPONSES.empty).show()
    // Clear MP input field
    MPel.val('')
  } else if (MP_REGEX.test(masterpass)) {
    // MP is valid
    // Hide errLabel
    errLabel.hide()
    // Send valid MasterPass to controller function to be checked
    ipcRenderer.send(field, masterpass)
  } else {
    // set errLabel text to response for invalid and show errLabel
    errLabel.text(RESPONSES.invalid).show()
    // Clear MP input field
    MPel.val('')
  }
}

/* Onload */
$(window).on('load', function() {
  $(".navigationLink").each(function(index) {
    let $this = $(this)
    $this.on('click', function(event) {
      let target = $this.data("target")
      let panel = $this.data("panel")
      let tab = $this.data("tab")
      let action = $this.data("action")

      if (action) {
        // Is an action to perform
        // TODO: Action (i.e. check for updates/open updater)
        const appEvent = APP_EVENT_REGEX.test(action)
        if (appEvent) {
          console.log(`Got main app event ${action}`)
          // Emit event in main proc
          ipcRenderer.send(action)
        } else {
          console.log(`Got render event ${action}`)
          // Emit event in render proc
          ipcRenderer.emit(action)
        }
      } else if (tab) {
        console.log(`Got tab ${tab}`)
        // is a tab to navigate to
        $(".item.active").first().removeClass("active")
        $(`a[data-tab='${tab}']`).addClass("active")
        navigate(tab)
      } else if (target) {
        console.log(`Got URL ${target}`)
        // is a URL so open it
        shell.openExternal(target)
      } else if (panel) {
        console.log(`Got panel ${panel}`)
        // target is just a panel to navigate to
        navigate(panel)
      }
      return false
    })
  })
})
