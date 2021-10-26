$(document).ready(async function () {
  // DEFINE TABLE AND IT ATTRIBUTE
  const table = $("#main_table").DataTable({
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
        targets: -1,
        inforStore: null,
        className: "detail",
        defaultContent:
          "<button class='btn btn-success detailBtn'><i class='fas fa-info-circle'></i></button>",
        orderable: false,
        width: "5%",
      },
    ],
  });
  // ĐÁNH STT TỰ ĐỘNG
  table
    .on("order.dt search.dt", function () {
      table
        .column(0, { search: "applied", order: "applied" })
        .nodes()
        .each(function (cell, i) {
          cell.innerHTML = i + 1;
        });
    })
    .draw();

  // KHỞI TẠO BẢNG

  var listPops;
  loadDataTable();

  // TOPBAR EVENT
  $("#provinceTB").on("select2:select", async function (e) {
    const data = e.params.data;
    // if (data.id == 0) {
    //   loadDataTable();
    // } else {
    //   listPops = ajaxGET(
    //     `${APICollection.GetObjectByArea}/${data.id}/pop`
    //   ).then((res) => {
    //     showLoading();
    //     loadDataTable(table, res);
    //     hideLoading();
    //     return res;
    //   });
    // }
  });
  $("#popTB").on("select2:select", async function (e) {});

  $("#main_table tbody").on("click", "button.detailBtn", async function (
    event
  ) {
    event.preventDefault();
    const id = $(this).parent().parent().children().first().next().text();
    window.open(`${MAINURL}/device-management/managed-pops/?popId=${id}`);
  });

  // LOAD DATA TO TABLE
  async function loadDataTable() {
    listPops = await ajaxGET(APICollection.POP);

    table.clear().draw();

    for (let i = 0; i < listPops.length; i++) {
      const e = listPops[i];
      // console.log(e);
      await ajaxGET(APICollection.Areas).then((res) => {
        console.log(res);
        var x = res.find((p) => p.id == e.idTbArea).name;
        // console.log(x);
        table.row.add(["", e.id, e.name, x, e.description]).draw();
      });
    }
  }
});
