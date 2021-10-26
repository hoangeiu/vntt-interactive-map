$(document).on("click", ".browse", function () {
  var file = $(this).parents().find(".file");
  file.trigger("click");
});
$('input[type="file"]').change(function (e) {
  var fileName = e.target.files[0].name;
  $("#file").val(fileName);

  var reader = new FileReader();
  reader.onload = function (e) {
    // get loaded data and render thumbnail.
    document.getElementById("preview").src = e.target.result;
  };
  // read the image file as a data URL.
  reader.readAsDataURL(this.files[0]);
});

$(document).on("click", "#calCable", function () {
  const id = $(this).parents().find("#cableMD .id").val();
  const code = $(this).parents().find("#cableMD .code").val();
  var cable;
  var tmp = 0;
  if (id == "") {
    cable = cableLC.find((c) => c.code == code);
    for (let i = 0; i < cable.breakPoints.length - 1; i++) {
      tmp += L.latLng(cable.breakPoints[i]).distanceTo(
        L.latLng(cable.breakPoints[i + 1])
      );
    }
  } else {
    cable = cableDB.find((c) => c.id == id);
    var breakPoints = JSON.parse(cable.posArray);
    for (let i = 0; i < breakPoints.length - 1; i++) {
      tmp += L.latLng(breakPoints[i]).distanceTo(L.latLng(breakPoints[i + 1]));
    }
  }

  $("#cableMD .length").val(tmp.toFixed("0"));
});

$("#cableMD .all-slings").click((event) => {
  $("#mutiple-attribute .attribute").val(2);
});
$("#cableMD .all-underground").click((event) => {
  $("#mutiple-attribute .attribute").val(1);
});
