$(document).ready(function () {
  // DEFINE TABLE AND IT ATTRIBUTE
  var incident_table = $("#incident_table").DataTable({
    scrollX: true,
    scrollY: true,
    responsive: true,
    columnDefs: [
      {
        searchable: false,
        orderable: false,
        targets: 0,
        width: "3%",
      },
      {
        targets: 1,
        className: "code",
      },
      {
        targets: -2,
        inforStore: null,
        className: "edit",
        defaultContent:
          "<button class='btn btn-primary editBtn'><i class='fas fa-pencil-alt'></button>",
        width: "10%",
        orderable: false,
      },
      {
        targets: -1,
        inforStore: null,
        className: "delete",
        defaultContent:
          "<button class='btn btn-danger deleteBtn'><i class='fas fa-trash-alt'></i></button>",
        width: "10%",
        orderable: false,
      },
    ],
  });
  // ĐÁNH STT TỰ ĐỘNG
  incident_table
    .on("order.dt search.dt", function () {
      incident_table
        .column(0, { search: "applied", order: "applied" })
        .nodes()
        .each(function (cell, i) {
          cell.innerHTML = i + 1;
        });
    })
    .draw();

  $('input[name="incidentStartDate"]').daterangepicker({
    locale: {
      format: "DD/MM/YYYY HH:mm",
    },
    singleDatePicker: true,
    showDropdowns: true,
    timePicker: true,
    timePicker24Hour: true,
  });

  $('input[name="incidentEndDate"]').daterangepicker({
    locale: {
      format: "DD/MM/YYYY HH:mm",
    },
    singleDatePicker: true,
    showDropdowns: true,
    timePicker: true,
    timePicker24Hour: true,
  });
  // KHỞI TẠO BẢNG
  // loadDataTable(cabinet_table, dataCB);
  for (let i = 0; i < 10; i++) {
    incident_table.row
      .add([
        "",
        1,
        "SC101",
        "Cable 1",
        "Unknow",
        "15/06/2020",
        "15/06/2020",
        "Reason 1",
        "",
      ])
      .draw();
  }

  // BUTTON EVENT
  //#region
  $("#addButton").click((event) => {
    event.preventDefault();
    // $("#cbModal .startPop").val("0").trigger("change");
    $("#incidentModal #incidentStartDate").val("");
    $("#incidentModal #incidentEndDate").val("");
    $("#incidentModal").modal("show");
  });

  $("#incident_table tbody").on("click", "button.editBtn", function (event) {
    event.preventDefault();
    // var id = $(this).parent().parent().children().first().next().text();
    // var e = dataCB.find((d) => d.id == id);
    // $("#cbId").val(e.id);
    // $("#cbCode").val(e.code);
    // $("#cbName").val(e.name);
    // $("#cbDesc").val(e.description);
    // $("#cbModal #cbStartPop").val(e.idTbPop).trigger("change");
    $("#incidentModal").modal("show");
  });

  $("#incident_table tbody").on("click", "button.deleteBtn", function (event) {
    event.preventDefault();
    // var id = $(this).parent().parent().children().first().next().text();
    // var e = dataCB.find((d) => d.id == id);
    // $(".check-script").html(`${e.code}`);
    $("#deleteModal").modal("show");
  });
  //#endregion

  // SUBMIT MODAL
  //#region
  $("#incidentModal").submit(async function (event) {
    event.preventDefault();
    alert("***Chức năng chưa hoàn thiện.");
    // const formData = $("form#incidentModal").serializeArray();
    // var id = formData.find((d) => d.name == "cbId").value;
    // var code = formData.find((d) => d.name == "cbCode").value;
    // var name = formData.find((d) => d.name == "cbName").value;
    // var desc = formData.find((d) => d.name == "cbDesc").value;
    // var startPop = formData.find((d) => d.name == "cbStartPop").value;
    // var index = 0;
    // if (id == "") {
    //   var data = [
    //     {
    //       idTbPop: parseInt(startPop),
    //       code: generateCode("CB"),
    //       name,
    //       description: desc,
    //       pos: "",
    //       index,
    //     },
    //   ];
    //   ajaxPOST(APICollection.CB, data).then(() => {
    //     $("#cbModal").modal("hide");
    //     cabinet_table.clear().draw();
    //     dataCB = ajaxGET(APICollection.CB);
    //     dataCB = dataCB.filter((x) => x.index == 0);
    //     loadDataTable(cabinet_table, dataCB);
    //     notification("success", "Tạo mới thành công");
    //   });
    // } else {
    //   var x = dataCB.find((d) => d.id == parseInt(id));
    //   var data = [
    //     {
    //       id: x.id,
    //       idTbPop: parseInt(startPop),
    //       code,
    //       name,
    //       description: desc,
    //       index,
    //       pos: x.pos,
    //     },
    //   ];
    //   await ajaxPUT(`${APICollection.CB}/${x.id}`, data).then(() => {
    //     $("#cbModal").modal("hide");
    //     cabinet_table.clear().draw();
    //     dataCB = ajaxGET(APICollection.CB);
    //     dataCB = dataCB.filter((x) => x.index == 0);
    //     loadDataTable(cabinet_table, dataCB);
    //     notification("success", "Cập nhật thành công");
    //   });
    // }
  });
  $("#deleteModal").submit(async function (event) {
    event.preventDefault();
    alert("***Chức năng chưa hoàn thiện.");
    // const formData = $("form#deleteModal").serializeArray();
    // var deleteCode = formData.find((d) => d.name == "deleteCode").value;
    // var text = $(".check-script").text();
    // if (deleteCode == text) {
    //   var x = dataCB.find((x) => x.code == deleteCode);
    //   await ajaxDELETE(`${APICollection.CB}/${x.id}`).then(() => {
    //     $("#deleteModal").modal("hide");
    //     cabinet_table.clear().draw();
    //     dataCB = ajaxGET(APICollection.CB);
    //     dataCB = dataCB.filter((x) => x.index == 0);
    //     loadDataTable(cabinet_table, dataCB);
    //   });
    // } else {
    //   $("#deleteModal .result").html("Type wrong!");
    // }
  });
  //#endregion
});

function loadDataTable(table, data) {
  const pops = ajaxGET(APICollection.POP);
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    var x = "";
    var tmp = pops.find((p) => p.id == e.idTbPop);
    if (tmp != undefined) {
      x = tmp.name;
    }
    table.row.add(["", e.id, e.name, e.description, x]).draw();
  }
}

// DELETE ALL DATA WHEN CLOSE MODAL
$("#incidentModal").on("hidden.bs.modal", function (e) {
  $("#incidentModal form :input").val("");
  $("#incidentPop").find("option").remove().end();
  $("#incidentConnect").find("option").remove().end();
});
$("#deleteModal").on("hidden.bs.modal", function (e) {
  $("#deleteModal form :input").val("");
  $("#deleteModal .result").html("");
});

// LOAD DỮ LIỆU
//#region
const popData = ajaxGET(APICollection.POP);
for (let i = 0; i < popData.length; i++) {
  const e = popData[i];
  var option = `<option value="${e.id}">${e.name}</option>`;
  $("#incidentModal .startPop").append(option);
}

$("#incidentPop").on("select2:select", function (e) {
  $("#incidentConnect").find("option").remove().end();

  var data = e.params.data;
  var getCable = ajaxGET(`${APICollection.GetObject}/${data.id}/cable`);
  for (let i = 0; i < getCable.length; i++) {
    const e = getCable[i];
    var option = `<option value="${e.id}">${e.name}</option>`;
    $("#incidentConnect").append(option);
  }
});
//#endregion
