let databaseMng = {
  base_url: "https://coevents-cmyg.firebaseio.com/",
  users: [],
  events: [],
  onSuccessCallback: "",

  init: function (data, path, callback) {
    databaseMng.onSuccessCallback = callback;
    databaseMng.fetchDatabase(data, path);
  },

  fetchDatabase: function (data, path) {
    let url = this.base_url + data + ".json";

    switch (path) {
      case "login":
        $.ajax({
          url: url,
          method: "GET",
          contentType: "application/json"
        }).done(databaseMng.onLoginSuccess).fail(databaseMng.onError);
        break;

      case "rememberPwd":
        $.ajax({
          url: url,
          method: "GET",
          contentType: "application/json"
        }).done(databaseMng.onPwdSuccess).fail(databaseMng.onError);
        break;

      case "index":
        $.ajax({
          url: url,
          method: "GET",
          contentType: "application/json"
        }).done(databaseMng.onDashboardSuccess).fail(databaseMng.onError);
        break;

      default:
        $.ajax({
          url: url,
          method: "GET",
          contentType: "application/json"
        }).done(databaseMng.onLoadSuccess).fail(databaseMng.onError);
        break;
    }
  },

  onLoginSuccess: function (dbData) {
    databaseMng.users = dbData;
    console.log(databaseMng.users);
    databaseMng.onSuccessCallback();
  },

  onPwdSuccess: function (dbData) {
    databaseMng.users = dbData;
    databaseMng.onSuccessCallback();
  },

  onDashboardSuccess: function (dbData) {
    databaseMng.events = dbData;
    databaseMng.onSuccessCallback();
  },

  onLoadSuccess: function (dbData) {
    console.log(dbData);
  },

  onError: function (e) {
    console.log(e.status);
  }
};