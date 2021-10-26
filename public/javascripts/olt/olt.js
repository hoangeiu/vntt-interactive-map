var oltTable;
$(document).ready(async function () {
  // DEFINE TABLE AND IT ATTRIBUTE
  oltTable = $("#olt_table").DataTable({
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
        targets: -1,
        inforStore: null,
        className: "edit",
        defaultContent:
          "<button class='btn btn-success detailBtn'><i class='fas fa-info-circle'></i></button>",
        orderable: false,
      },
    ],
  });
  // ĐÁNH STT TỰ ĐỘNG
  oltTable
    .on("order.dt search.dt", function () {
      oltTable
        .column(0, { search: "applied" })
        .nodes()
        .each(function (cell, i) {
          cell.innerHTML = i + 1;
        });
    })
    .draw();

  // KHỞI TẠO BẢNG
  showLoading();
  var ticketOLT;
  ticketOLT = await ajaxGET(`${APICollection.TicketOLT}`).then((res) => {
    loadDataTable(oltTable, res);
    hideLoading();
    return res;
  });

  // BUTTON EVENT
  $("#olt_table tbody").on("click", "button.detailBtn", function (event) {
    event.preventDefault();
    var id = $(this).parent().parent().children().first().next().text();
    var x = ticketOLT.find((t) => t.id == id);
    $("#oltId").val(x.id);
    $("#oltName").val(x.deviceId);
    $("#oltCRMName").val(x.crmname);
    $("#oltType").val(x.deviceType);
    $("#oltIP").val(x.ip);
    $("#oltPOP").val(x.area);
    $("#oltRack").val(x.rack);
    $("#oltU").val(x.u);
    $("#oltSnmp").val(x.snmp);
    $("#oltVisa").val(x.series == "xxxxxxxx" ? "" : x.series);

    $("#oltModal").modal("show");
  });
  //#endregion

  // TOPBAR EVENT
  //#region
  $("#provinceTB").on("select2:select", async function (e) {
    showLoading();
    const data = e.params.data;
    oltTable.clear().draw();
    if (data.id == 0) {
      loadDataTable(oltTable, ticketOLT);
    } else {
      var pops = await ajaxGET(`${APICollection.POP}`);
      pops = pops.filter((p) => p.idTbArea == data.id);
      var x = ticketOLT.filter((t) => {
        for (let i = 0; i < pops.length; i++) {
          const element = pops[i];
          if (t.area == element.code) {
            return t;
          }
        }
      });
      loadDataTable(oltTable, x);
    }
    hideLoading();
  });
  $("#popTB").on("select2:select", async function (e) {
    showLoading();
    const data = e.params.data;
    oltTable.clear().draw();
    if (data.id == 0) {
      var id = $("#provinceTB").val();
      var pops = await ajaxGET(`${APICollection.POP}`);
      pops = pops.filter((p) => p.idTbArea == id);
      var x = ticketOLT.filter((t) => {
        for (let i = 0; i < pops.length; i++) {
          const element = pops[i];
          if (t.area == element.code) {
            return t;
          }
        }
      });
      loadDataTable(oltTable, x);
    } else {
      var pop = await ajaxGET(`${APICollection.POP}/${data.id}`);
      var x = ticketOLT.filter((t) => t.area == pop.code);
      loadDataTable(oltTable, x);
    }
    hideLoading();
  });
  //#endregion
});

//#region

// LOAD DATA TO TABLE
function loadDataTable(table, data) {
  console.log(data);
  table.clear().draw();
  // const popData = ajaxGET(APICollection.POP);
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (e.series == "xxxxxxxx") {
      e.series = "";
    }
    table.row
      .add([
        "",
        e.id,
        e.deviceId,
        e.deviceType,
        e.ip,
        e.area,
        e.rack,
        e.u,
        e.series,
        "",
      ])
      .draw();
  }
}
