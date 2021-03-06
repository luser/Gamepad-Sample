function Init() {
  if (navigator.getGamepads === undefined) {
    document.getElementById("gamepadSupportedDiv").style.display = "block";
    document.getElementById("gamepadDisplayDiv").style.display = "none";
  } else {
    window.requestAnimationFrame(runAnimation);
  }
}

// --------------------------------------
// Animation loop
// --------------------------------------
var g_fButtonPressedOnAnyGamepadEver = false;
var g_gamepadVisualizers = new Array();
function runAnimation() {
  var gamepads = navigator.getGamepads();
  for (var i = 0; i < gamepads.length; i++) {
    var pad = gamepads[i];
    if (pad != undefined) {

      if (g_fButtonPressedOnAnyGamepadEver === false) {
        document.getElementById("buttonNeverPressedDiv").style.display = "none";
        document.getElementById("buttonPressedDiv").style.display = "block";
        g_fButtonPressedOnAnyGamepadEver = true;
      }

      var fStandarMapping = (pad.mapping != undefined && pad.mapping === "standard");
      var gpVisualizer = fStandarMapping ? new StandardGamepadVisualizer(pad) : new GenericGamepadVisualizer(pad);
      g_gamepadVisualizers[i] = gpVisualizer;
    } else {
      if (g_gamepadVisualizers[i] != undefined) {
        g_gamepadVisualizers[i].fRetired = true;
      }
    }
  }

  for (var i = 0; i < g_gamepadVisualizers.length; i++) {
    var gpVisualizer = g_gamepadVisualizers[i];
    if (g_gamepadVisualizers[i] != undefined) {
      gpVisualizer.UpdateView();
    }
  }
  

  window.requestAnimationFrame(runAnimation);
}

// --------------------------------------
// Misc.
// --------------------------------------
function FloatValueAsString(flValue) {
  var strVal = flValue.toString();
  strVal = strVal.substring(0, 4);
  return strVal;
}

function BoolToYesNo(boolean) {
  return boolean ? "yes" : "no";
}
function BoolToString(boolean) {
  return boolean ? "true" : "false";
}

g_stateTableRowTemplate = '\
  <td><div>gpIndex</div></td>\
  <td><div>gpTimestamp</div></td>\
  <td><div>gpMapping</div></td>\
  <td><div>gpId</div></td>\
';

function UpdateGamepadStateTable(gamepad, index) {
  var fConnected = false;
  var indexStr = "N/A";
  var timestampStr = "N/A";
  var mappingStr = "N/A";
  var idStr = "N/A";
  if (gamepad != undefined) {
    idStr = (gamepad.id != undefined) ? gamepad.id : "undefined";
    mappingStr = (gamepad.mapping != undefined) ? gamepad.mapping : "undefined";
    indexStr = (gamepad.index != undefined) ? gamepad.index : "undefined";
    timestampStr = (gamepad.timestamp != undefined) ? (gamepad.timestamp / 1000) + "s" : "undefined";
  }

  var newRow = g_stateTableRowTemplate;
  newRow = newRow.replace(/gpIndex/g, indexStr);
  newRow = newRow.replace(/gpTimestamp/g, timestampStr);
  newRow = newRow.replace(/gpMapping/g, mappingStr);
  newRow = newRow.replace(/gpId/g, idStr);
  var containerElem = document.getElementById("gpStateTableRow" + index);
  containerElem.innerHTML = newRow.replace(/\[#\]/g, index);
}

function ClearGamepadStateTableRow(index) {
  var containerElem = document.getElementById("gpStateTableRow" + index);
  containerElem.innerHTML = "";
}