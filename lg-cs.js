// ==UserScript==
// @name            WME Lane Guidance Click Saver
// @author          HBiede
// @namespace       hbiede.com
// @description     Set the straight options by default on new lane guidance changes
// @include         /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version         2020.04.29.002
// @grant           none
// @license         MIT
// @copyright       2020 HBiede
// ==/UserScript==

/* global W */

setTimeout(initLaneGuidanceClickSaver, 1000);

function setStraightTurns() {
    let turnSections = document.getElementsByClassName("turn-lane-edit");
    for (let i = 0; i < turnSections.length; i++) {
        if (turnSections[i].getElementsByClassName("angle-0").length > 0) {
            // Set all lanes for straight turns
            let laneCheckboxes = turnSections[i].getElementsByTagName("input");

            // Check if the lanes are already set. If already set, don't change anything
            let alreadySet = 0;
            for (let j = 0; j < laneCheckboxes.length && !alreadySet; j++) {
                if (laneCheckboxes[j].checked !== undefined) {
                    if (laneCheckboxes[j].checked === true) {
                        alreadySet++;
                    }
                }
            }

            if (alreadySet === 0) {
                for (let j = 0; j < laneCheckboxes.length; j++) {
                    if (laneCheckboxes[j].checked !== undefined && laneCheckboxes[j].checked === false) {
                        laneCheckboxes[j].click();
                        console.log(j);
                    }
                }
            }
        }
    }
}

function initLaneGuidanceClickSaver() {
    if (typeof W === 'undefined' || typeof W.map === 'undefined' || typeof W.loginManager === 'undefined') {
        setTimeout(initLaneGuidanceClickSaver, 800);
        return;
    }
    if (!W.loginManager.user) {
        // init on login for non-logged in users
        W.loginManager.events.register("login", null, initLaneGuidanceClickSaver);
        W.loginManager.events.register("loginStatus", null, initLaneGuidanceClickSaver);
        if (!W.loginManager.user) {
            return;
        }
    }

    let laneObserver = new MutationObserver(function (mutations) {
        if (W.selectionManager.getSelectedFeatures()[0] && W.selectionManager.getSelectedFeatures()[0].model.type === "segment") {
            let laneCountInput = document.getElementsByName("laneCount");
            if (laneCountInput.length > 0) {
                laneCountInput[0].addEventListener(
                    'change',
                    function() {
                        // wait for the input to appear
                        setTimeout(setStraightTurns(), 50);
                    },
                    false
                );
            }

            let laneToolsButtons = document.getElementsByClassName("lt-add-lanes");
            for (let i = 0; i < laneToolsButtons.length; i++) {
                laneToolsButtons[i].addEventListener(
                    'click',
                    function() {
                        // wait for the input to appear
                        setTimeout(setStraightTurns(), 50);
                    },
                    false
                );
            }
        }
    });

    laneObserver.observe(document.getElementById("edit-panel"), {
        childList: true,
        subtree: true
    });
}
