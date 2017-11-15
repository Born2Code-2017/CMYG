let checkPath = {
  path: window.location.pathname,
  savedUser: false,
  firstTime: false,

  init: function () {
    loggedUser.init();
  },

  checkPath: function () {
    const LOGIN_PATH = "login.html";
    const INDEX_PATH = "index.html";

    switch (checkPath.path) {
      case "/login.html":
        if (checkPath.savedUser === false && sessionStorage.getItem("firstTime") !== "true") {
          databaseMng.init("users", "login", login.init);
          console.log('please for login use: guich@guich.it, guich666');
        } else {
          window.location.href = INDEX_PATH;
        }
        break;

      case "/remember-password.html":
        if (checkPath.savedUser === false && sessionStorage.getItem("firstTime") !== "true") {
          databaseMng.init("users", "rememberPwd", rememberPassword.init);
        } else {
          window.location.href = INDEX_PATH;
        }
        break;

      default:
        if (checkPath.savedUser === true || sessionStorage.getItem("firstTime") === "true") {
          databaseMng.init("events", "index", dashboard.init);
        } else {
          window.location.href = LOGIN_PATH;
        }
        break;
    }
  },
};

let loggedUser = {
  init: function () {
    let firstTimeSession = sessionStorage.getItem("firstTime"),
        firstTimeLocal   = localStorage.getItem("firstTime");

    if (firstTimeSession === null && firstTimeLocal === "false") {
      checkPath.savedUser = true;
    }

    checkPath.checkPath();
  }
};

let login = {
  users: [],
  userOk: false,
  passOk: false,
  saveUser: "",

  init: function () {
    login.users = databaseMng.users;
    login.eventHandler();
  },

  eventHandler: function () {
    let inputU   = $("#username"),
        inputP   = $("#password"),
        labelU   = $("#luser"),
        labelP   = $("#lpass"),
        loginBtn = $("#loginbtn");

    inputU.on({
      "focus": () => {
        labelU.addClass("is-active");
      },
      "focusout": () => {
        if (inputU.val().length < 1) {
          labelU.removeClass("is-active");
        }
      }
    });

    inputP.on({
      "focus": () => {
        labelP.addClass("is-active");
      },
      "focusout": () => {
        if (inputU.val().length < 1) {
          labelP.removeClass("is-active");
        }
      }
    });

    loginBtn.on("click", e => {
      e.preventDefault();
      login.checkFields();
    });
  },

  checkFields: function () {
    let user   = $("#username"),
        pass   = $("#password"),
        errorL = $("#login-error");

    login.checkUsername(user.val());
    login.checkPassword(pass.val());

    if (login.userOk === false && login.passOk === false) {
      user.addClass("error");
      pass.addClass("error");
      errorL.text("Wrong Credentials");
    } else if (login.userOk === false && login.passOk === true) {
      user.addClass("error");
      pass.removeClass("error");
      errorL.text("Username is wrong");
    } else if (login.userOk === true && login.passOk === false) {
      user.removeClass("error");
      pass.addClass("error");
      errorL.text("Password is wrong");
    } else if (login.userOk === true && login.passOk === true) {
      user.removeClass("error");
      pass.removeClass("error");
      errorL.text("");
      login.doLogin();
    }
  },

  checkUsername: function (user) {
    let contAt   = user.includes("@"),
        partUser = user.split("@", 2),
        secondP  = partUser[1];

    for (let u in login.users) {
      if (typeof user === "string" && contAt === true && secondP !== "") {
        if (user === login.users[u].username) {
          login.userOk = true;
          login.saveUser = user;
          break;
        } else {
          login.userOk = false;
        }
      } else {
        login.userOk = false;
        break;
      }
    }
  },

  checkPassword: function (pass) {
    for (let u in login.users) {
      if (typeof pass === "string") {
        if (pass === login.users[u].password) {
          login.passOk = true;
          break;
        } else {
          login.passOk = false;
        }
      } else {
        login.passOk = false;
        break;
      }
    }
  },

  doLogin: function () {
    let rememberMe = $("#remember");

    if (rememberMe.is(":checked")) {
      localStorage.setItem("loggedUser", login.saveUser);
      localStorage.setItem("firstTime", checkPath.firstTime);
    } else {
      sessionStorage.setItem("loggedUser", login.saveUser);
      sessionStorage.setItem("firstTime", true);
    }

    window.location.href = "index.html";
  }
};

let rememberPassword = {
  users: [],

  init: function () {
    rememberPassword.users = databaseMng.users;
    rememberPassword.eventHandler();
  },

  eventHandler: function () {
    let rememberBtn = $("#rememberBtn"),
        inputE      = $("#email"),
        labelE      = $("#lemail");

    inputE.on({
      "focus": () => {
        labelE.addClass("is-active");
      },
      "focusout": () => {
        if (inputE.val().length < 1) {
          labelE.removeClass("is-active");
        }
      }
    });

    rememberBtn.on("click", e => {
      e.preventDefault();
      rememberPassword.checkUser();
    });
  },

  checkUser: function () {
    let user     = $("#email"),
        contAt   = user.val().includes("@"),
        partUser = user.val().split("@", 2),
        secondP  = partUser[1];

    for (let u in rememberPassword.users) {
      if (typeof user.val() === "string" && contAt === true && secondP !== "") {
        if (user.val() === rememberPassword.users[u].username) {
          user.removeClass("error");
          alert("Ti invieremo una mail con la nuova password");
          window.location.href = "login.html";
          break;
        } else {
          user.addClass("error");
        }
      } else {
        user.addClass("error");
        break;
      }
    }
  }
};

let dashboard = {
  events: [],

  init: function () {
    dashboard.ui.displayLoggedUser();
    dashboard.ui.displayWeek();
    dashboard.ui.displayEvents();
    dashboard.ui.displayCategories();
    dashboard.eventHandler();
  },

  eventHandler: function () {
    let sign_out      = $(".fa-sign-out"),
        category      = $("#category"),
        categoryList  = $(".category"),
        categoryName  = $(".category-name"),
        eventMenu     = $(".events"),
        eventMenuList = $(".nav-sm");

    sign_out.on("click", () => {
      localStorage.removeItem("loggedUser");
      sessionStorage.removeItem("loggedUser");
      localStorage.removeItem("firstTime");
      sessionStorage.removeItem("firstTime");
      window.location.href = "login.html";
    });

    category.on("click", () => {
      if (!categoryList.hasClass("opened")) {
        categoryList.addClass("opened");
      } else {
        categoryList.removeClass("opened");
      }
    });

    eventMenu.on("click", () => {
      if (!eventMenuList.hasClass("active")) {
        eventMenuList.addClass("active");
      } else {
        eventMenuList.removeClass("active");
      }
    });

    categoryName.each(function () {
      let cat = $(this).data("category");
      $(this).on("click", () => {
        dashboard.ui.filterByCategory(cat);
      });
    });
  },

  ui: {
    displayLoggedUser: function () {
      let sessionUser      = sessionStorage.getItem("loggedUser"),
          localStorageUser = localStorage.getItem("loggedUser"),
          loggedUser       = "",
          label            = $("#loggedUser").find("p");

      (sessionUser !== null) ? loggedUser = sessionUser : loggedUser = localStorageUser;

      const WELCOME = "Welcome " + loggedUser;

      label.text(WELCOME);
    },

    displayWeek: function () {
      const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;
      let day             = new Date(),
          week            = ["sun", "mon", "tue", "wen", "thu", "fry", "sat"],
          todayD          = day.getUTCDay(),
          todayN          = day.getTime(),
          getCalendarHTML = $(".calendar-days");

      for (let i = 0; i < 7; i++) {
        let this_week      = ((todayD + i) % 7),
            dayMore        = new Date(todayN + MILLIS_IN_DAY * i).getUTCDate(),
            spanNumberDate = $(document.createElement("span")),
            spanDayDate    = $(document.createElement("span"));

        spanNumberDate.addClass("calendar-days__number");
        spanDayDate.addClass("calendar-days__dayname");

        spanNumberDate.text(dayMore);
        spanDayDate.text(week[this_week]);

        spanNumberDate.appendTo(getCalendarHTML[i]);
        spanDayDate.appendTo(getCalendarHTML[i]);
      }
    },

    displayCategories: function () {
      let tags    = [],
          newTags = [];

      for (let t in dashboard.events) {
        let tmpT = dashboard.events[t].tags;
        tags.push(tmpT);
      }

      tags.forEach(t => {
        if (newTags.indexOf(t) === -1) {
          newTags.push(t);
        }
      });

      newTags.forEach(t => {
        let li = $(document.createElement("li")),
            ul = $("#category").find(".category");

        li.addClass("category-name");
        li.attr("data-category", t);
        li.text(t);
        li.appendTo(ul);
      });
    },

    displayEvents: function () {
      dashboard.events = databaseMng.events;
      const CALENDAR_ICON = "<i class=\"fa fa-fw fa-lg fa-calendar-o\" aria-hidden=\"true\"></i> ",
            CLOCK_ICON    = "<i class=\"fa fa-fw fa-lg fa-clock-o\" aria-hidden=\"true\"></i> ",
            MAP_ICON      = "<i class=\"fa fa-fw fa-lg fa-map-marker\" aria-hidden=\"true\"></i> ";

      let container = $("#container");

      for (let event in dashboard.events) {
        let card           = $(document.createElement("div")),
            c_header       = $(document.createElement("div")),
            c_header_img   = $(document.createElement("img")),
            c_btn          = $(document.createElement("div")),
            c_btn_a        = $(document.createElement("a")),
            c_content      = $(document.createElement("div")),
            c_content_p_n  = $(document.createElement("p")),
            c_content_p_dh = $(document.createElement("p")),
            c_content_p_st = $(document.createElement("p")),
            c_content_p_c  = $(document.createElement("p"));

        card.addClass("card is-3");
        card.attr("data-tags", dashboard.events[event].tags);

        c_header.addClass("card-header fill-img");
        c_header_img.attr("src", dashboard.events[event].image);
        c_header_img.appendTo(c_header);

        c_btn.addClass("card-btn");
        c_btn_a.addClass("btn");
        c_btn_a.attr("href", dashboard.events[event].url);
        c_btn_a.text("Discover");
        c_btn_a.appendTo(c_btn);

        c_content.addClass("card-content");
        c_content_p_n.addClass("bold");
        c_content_p_n.html(CALENDAR_ICON + dashboard.events[event].name);
        c_content_p_dh.html(CLOCK_ICON + dashboard.events[event].date + ' | ' + dashboard.events[event].timeStart + ' - ' + dashboard.events[event].timeEnd);
        c_content_p_st.html(MAP_ICON + dashboard.events[event].location);
        c_content_p_c.addClass('category');
        c_content_p_c.text(dashboard.events[event].tags);

        c_content_p_n.appendTo(c_content);
        c_content_p_dh.appendTo(c_content);
        c_content_p_st.appendTo(c_content);
        c_content_p_c.appendTo(c_content);

        c_header.appendTo(card);
        c_btn.appendTo(card);
        c_content.appendTo(card);
        card.appendTo(container);
      }

      $(".fill-img").imagefill();
    },

    filterByCategory: function (c) {
      let card = $(".card"),
          h2Filter = $("#events").find(".row.brb").find("h2");

      card.fadeOut(500).promise().done(loadCard);

      function loadCard() {
        card.each(function () {
          let cat = $(this).data("tags");

          if (cat.indexOf(c) >= 0) {
            $(this).fadeIn(500);
            h2Filter.text(c + " Events");
          } else if (c === "all") {
            card.fadeIn(500);
            h2Filter.text("Today's Events");
          }
        });
      }
    }
  }
};

$(document).ready(checkPath.init());