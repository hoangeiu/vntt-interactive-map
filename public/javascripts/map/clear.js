// Điều chỉnh table khi mở modal
$('a[data-toggle="tab"]').on("shown.bs.tab", function () {
  $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
});
$("#detailCBModal").on("shown.bs.modal", function () {
  $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
});
$("#detailODF").on("shown.bs.modal", function () {
  $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
});

// Clear modal
// $("#cabinetMD").on("hidden.bs.modal", function (e) {
//   $("#cabinetMD form :input").val("");
//   $("#cabinetMD #blockCheckbox0").prop("checked", true);
// });

$("#oltTmpModal").on("hidden.bs.modal", function (e) {
  $("#oltTmpModal form :input").val("");
  $("#oltTmpModal .type, .owner").val("").trigger("change");
});

$("#odfModal").on("hidden.bs.modal", function (e) {
  $("#odfModal form :input").val("");
});

$("#odfDetailMD").on("hidden.bs.modal", function (e) {
  $("#odfDetailMD .odf").find("option").remove().end();
  $("#odfDetailMD form :input").val("");
});

$("#coreMD").on("hidden.bs.modal", function (e) {
  $("#coreMD form :input").val("");
  $("#errorCheckbox").prop("checked", false);
});

$("#addCBDetailModal").on("hidden.bs.modal", function (e) {
  $("#addCBDetailModal form :input").val("");
});

$("#splitterModal").on("hidden.bs.modal", function (e) {
  $("#splitterModal form :input").val("");
  $("#splitterModal #splitterIn").val("1").trigger("change");
  $("#splitterModal #splitterOut").val("").trigger("change");
});

$("#cableMD").on("hidden.bs.modal", function (e) {
  $("#cableMD form :input").val("");
  $("#cableMD .type").val(0);
  $("#cableMD #mutiple-attribute").empty();
  $("#cableMD .copy").find("option").remove().end();
  $("#cableMD .start").find("option").remove().end();
  $("#cableMD .end").find("option").remove().end();
  $("#cableMD .copy").find("option").remove().end();
});

$("#coreTTMD").on("hidden.bs.modal", function (e) {
  $("#coreTTMD form :input").val("");
  $("#coreTTMD .beginPort, .endPort").find("option").remove().end();
  $("#errorCheckbox").prop("checked", false);
});

$("#coreTNMD").on("hidden.bs.modal", function (e) {
  $("#coreTNMD form :input").val("");
  $("#coreTNMD .ODF").val("").trigger("change");
  $(
    "#coreTNMD .beginPort, .endPort, .beginDevicePort, .endDevicePort, .beginDevice, .endDevice"
  )
    .find("option")
    .remove()
    .end();
  $("#coreTNMD .status").val("0").trigger("change");
});

$("#coresTNMD").on("hidden.bs.modal", function (e) {
  $("#coresTNMD form :input").val("");
  $("#coresTNMD .beginPort, .endPort, .beginDevicePort, .endDevicePort")
    .find("option")
    .remove()
    .end();
});

$("#coresTTMD").on("hidden.bs.modal", function (e) {
  $("#coresTTMD form :input").val("");
  $("#coresTTMD .beginPort, .endPort, .beginODF, .endODF")
    .find("option")
    .remove()
    .end();
});

$("#mxModal").on("hidden.bs.modal", function (e) {
  $("#mxModal form :input:not(.status)").val("");
  $("#mxModal .core").val("0").trigger("change");
  $("#mxModal #preview").attr("src", "https://placehold.it/80x80");
});

$("#cbDescMD").on("hidden.bs.modal", function (e) {
  $("#cbDescMD form :input:not(#jump, #over)").val("");
  $("#cbDescMD .portIn, .portOut, .splitter, .portOutSplitter")
    .find("option")
    .remove()
    .end();
});

$("#connectTTMD").on("hidden.bs.modal", function (e) {
  $("#connectTTMD form :input").val("");
  $("#connectTTMD #mutiple-connect, .beginODF, .beginOLT, .endOLT")
    .empty()
    .end();
});
$("#connectTTDetailMD").on("hidden.bs.modal", function (e) {
  $("#connectTTDetailMD form :input").val("");
  $("#connectTTDetailMD #mutiple-connect-detail").empty().end();
});

$("#connectTNMD").on("hidden.bs.modal", function (e) {
  $("#connectTNMD form :input").val("");
  $(
    "#connectTNMD #mutiple-connect, .beginODFPort, .beginOLT, .beginOLTPort, .endCabinet, .endCBPort, .endST, .endSTPort"
  )
    .empty()
    .end();

  $("#connectTNMD .beginODF").prop("disabled", false);
});

$("#connectTNDetailMD").on("hidden.bs.modal", function (e) {
  $("#connectTNDetailMD form :input").val("");
  $("#connectTNDetailMD #mutiple-connect-detail").empty().end();
});

$("#connectCabinetMD").on("hidden.bs.modal", function (e) {
  $("#connectCabinetMD .connect, .core1, .core2, .splitter, .splitterOut")
    .find("option")
    .remove()
    .end();
});

$("#customerModal").on("hidden.bs.modal", function (e) {
  $("#customerModal form :input").val("");
  $(
    "#customerModal .core, .cabinetPortIn, .cabinetPort, .splitter, .splitterOut, .cabinetPort, .customer"
  )
    .find("option")
    .remove()
    .end();
});
