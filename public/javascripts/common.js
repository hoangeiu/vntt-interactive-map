const MAINURL = "http://180.148.1.178:7700";
const APIURL = "http://180.148.1.178:7703";
const APICollection = {
  Areas: `${APIURL}/api/Area`,
  POP: `${APIURL}/api/POP`,
  MX: `${APIURL}/api/MX`,
  MXBYCABLE: `${APIURL}/api/MX/cable`,
  CB: `${APIURL}/api/Cabinet`,
  CABINETPORTS: `${APIURL}/api/CabinetPorts/BlockTray`,
  CABINETPORTS2: `${APIURL}/api/CabinetPorts/cabinet`,
  Cable: `${APIURL}/api/Cable`,
  CableAttribute: `${APIURL}/api/CableAttribute`,
  CableType: `${APIURL}/api/CableType`,
  CABLECORE: `${APIURL}/api/cores`,
  CABLECORES: `${APIURL}/api/cores/cable`,
  CORES: `${APIURL}/api/Cores/Object`,
  CORESTT: `${APIURL}/api/Cores/Object/1`,
  CORESTN: `${APIURL}/api/Cores/Object/2`,
  CONNECTION: `${APIURL}/api/connects`,
  CONNECTIONTT: `${APIURL}/api/Connects/ConectCategory/1`,
  CONNECTIONTN: `${APIURL}/api/Connects/ConectCategory/2`,
  CONNECTIONTNBYPOP: `${APIURL}/api/Connects/pop`,
  GetObject: `${APIURL}/api/GetObject`,
  GetObjectByArea: `${APIURL}/api/GetObject/Area`,
  TicketOLT: `${APIURL}/api/olt`,
  OLT: `${APIURL}/api/OLT`,
  OLTBYPOP: `${APIURL}/api/OLT/pop`,
  OLTPORTS: `${APIURL}/api/Oltports/OLT`,
  TicketCustomer: `${APIURL}/api/TicketCustomer`,
  ODF: `${APIURL}/api/ODF`,
  ODFBYPOP: `${APIURL}/api/ODF/POP`,
  ODFPORTS: `${APIURL}/api/OdfPorts/blocktray`,
  ODFPORTS2: `${APIURL}/api/OdfPorts/Odf`,
  coreOdfDetails: `${APIURL}/api/OdfDetails/ODFDetailByOdfID`,
  Splitters: `${APIURL}/api/Splitters`,
  splittersCB: `${APIURL}/api/splitters/cabinet`,
  STPORTOUT: `${APIURL}/api/SplitterDetails/Splitter`,
  users: `${APIURL}/api/Users/authenticate`,
  CUSTOMER: `${APIURL}/api/Customers`,
  CUSTOMERBYCB: `${APIURL}/api/Customers/cabinet`,
  SEARCHCUSTOMER: `${APIURL}/api/Customers/search`,
};
const LISTATTRIBUTES = [
  { id: 1, name: "Ngầm" },
  { id: 2, name: "Treo" },
];
const LISTTYPES = [
  { id: 1, name: "Cáp trục" },
  { id: 2, name: "Cáp nhánh" },
  { id: 3, name: "Cáp lastmile" },
];

localStorage.setItem("error", false);
localStorage.setItem("loading", false);

if (!localStorage.getItem("center")) {
  localStorage.setItem(
    "center",
    JSON.stringify({ lat: 11.056367, lng: 106.676087 })
  );
}

$("select").select2({
  theme: "bootstrap4",
});

$('input[name="date"]').daterangepicker({
  locale: {
    format: "DD/MM/YYYY",
  },
  singleDatePicker: true,
  showDropdowns: true,
});

// HIGHLIGHT SELECT PAGE
$(".nav-item").each(function () {
  var navItem = $(this);
  if (navItem.find("a").attr("href") == location.pathname) {
    navItem.addClass("border-left-success active");
  }
});
// Username
var _username = localStorage.getItem("_username");
$("#username").empty().append(_username);

$("#logoutBtn").click(function (event) {
  event.preventDefault();
  window.location.replace(`${MAINURL}/login`);
  localStorage.setItem("_token", "");
  localStorage.setItem("_exp", "");
  localStorage.setItem("_username", "");
  localStorage.setItem("center", "");
  console.log("logout");
});

$(".toast").addClass("hide");
function toastSuccess(message) {
  $(".toast-header").addClass("bg-success");
  $(".toast-body").html(message);
  $(".toast").toast("show");
  $(".toast").on("hidden.bs.toast", function () {
    $(".toast-header").removeClass("bg-success");
    $(".toast-body").empty();
  });
}
function toastError(message) {
  $(".toast-header").addClass("bg-danger");
  $(".toast-body").html(message);
  $(".toast").toast("show");
  $(".toast").on("hidden.bs.toast", function () {
    $(".toast-header").removeClass("bg-danger");
    $(".toast-body").empty();
  });
}

function generateCode(string) {
  return string + (Math.floor(Math.random() * (9999999 - 1000000)) + 1000000);
}
function getValue(data, value) {
  var element = data.find((d) => d.name == value);
  if (element != undefined) {
    return element.value;
  }
}

$("#globalLoading").hide();
function showLoading() {
  $("#globalLoading").show();
  localStorage.setItem("loading", true);
}
function hideLoading() {
  setTimeout(() => {
    $("#globalLoading").hide();
  }, 1000);
  localStorage.setItem("loading", false);
}

async function ajaxPOST(url, data) {
  checkExpiration();
  var token = localStorage.getItem("_token");
  await $.ajax({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    type: "POST",
    url: url,
    data: JSON.stringify(data),
    dataType: "json",
    success: function (response) {
      console.log("POST thành công");
      console.log(response);
    },
    error: function (request, status, err) {
      errorHandle(request.status, "POST", url);
    },
  });
}

async function ajaxPATCH(url, data) {
  checkExpiration();
  var token = localStorage.getItem("_token");
  await $.ajax({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    type: "PATCH",
    url: url,
    data: JSON.stringify(data),
    dataType: "json",
    success: function (response) {
      console.log("PATCH thành công");
      console.log(response);
    },
    error: function (request, status, err) {
      errorHandle(request.status, "PATCH", url);
    },
  });
}

async function ajaxGET(url) {
  checkExpiration();
  var token = localStorage.getItem("_token");
  var res = await $.ajax({
    type: "GET",
    url: url,
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (response) {
      // console.log("GET thành công");
      // console.log(response);
    },
    error: function (request, status, err) {
      errorHandle(request.status, "GET", url);
    },
  });
  return res;
}

async function ajaxPUT(url, data) {
  checkExpiration();
  var token = localStorage.getItem("_token");
  await $.ajax({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    type: "PUT",
    url: url,
    data: JSON.stringify(data),
    dataType: "json",
    success: function (response) {
      console.log("PUT thành công");
    },
    error: function (request, status, error) {
      errorHandle(request.status, "PUT", url);
    },
  });
}

async function ajaxDELETE(url) {
  checkExpiration();
  var token = localStorage.getItem("_token");
  await $.ajax({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    type: "DELETE",
    url: url,
    success: function (response) {
      console.log("DELETE thành công");
    },
    error: function (request, status, error) {
      errorHandle(request.status, "DELETE", url);
    },
  });
}

function checkExpiration() {
  var exp = localStorage.getItem("_exp");
  const _12HOURSTOMIL = 43200000;
  var now = new Date().getTime();
  if (!exp || now > exp - _12HOURSTOMIL) {
    window.location.href = `${MAINURL}/login`;
  }
}

function errorHandle(status, method, url) {
  var msg = "";
  if (status === 0) {
    msg = "Not connect.\n Verify Network.";
  } else if (status == 404) {
    msg = "Requested page not found. [404]";
  } else if (status == 500) {
    msg = "Internal Server Error [500].";
  }
  hideLoading();
  $("#inforBody")
    .empty()
    .append(msg + "\n" + `[${method}]` + url);
  $("#inforModal").modal("show");
}
