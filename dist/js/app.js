
/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: app.coffee
 */

(function() {
  var configure, i18nInit, init, module, modules, taiga;

  this.taiga = taiga = {};

  this.taigaContribPlugins = this.taigaContribPlugins || [];

  taiga.generateHash = function(components) {
    if (components == null) {
      components = [];
    }
    components = _.map(components, function(x) {
      return JSON.stringify(x);
    });
    return hex_sha1(components.join(":"));
  };

  taiga.generateUniqueSessionIdentifier = function() {
    var date, randomNumber;
    date = (new Date()).getTime();
    randomNumber = Math.floor(Math.random() * 0x9000000);
    return taiga.generateHash([date, randomNumber]);
  };

  taiga.sessionId = taiga.generateUniqueSessionIdentifier();

  configure = function($routeProvider, $locationProvider, $httpProvider, $provide, $tgEventsProvider, $compileProvider, $translateProvider) {
    var authHttpIntercept, defaultHeaders, loaderIntercept, originalWhen, preferedLangCode, userInfo, versionCheckHttpIntercept;
    originalWhen = $routeProvider.when;
    $routeProvider.when = function(path, route) {
      route.resolve || (route.resolve = {});
      angular.extend(route.resolve, {
        languageLoad: [
          "$q", "$translate", function($q, $translate) {
            var deferred;
            deferred = $q.defer();
            $translate().then(function() {
              return deferred.resolve();
            });
            return deferred.promise;
          }
        ]
      });
      return originalWhen.call($routeProvider, path, route);
    };
    $routeProvider.when("/", {
      templateUrl: "home/home.html",
      access: {
        requiresLogin: true
      },
      title: "HOME.PAGE_TITLE",
      description: "HOME.PAGE_DESCRIPTION",
      loader: true
    });
    $routeProvider.when("/projects/", {
      templateUrl: "projects/listing/projects-listing.html",
      access: {
        requiresLogin: true
      },
      title: "PROJECTS.PAGE_TITLE",
      description: "PROJECTS.PAGE_DESCRIPTION",
      loader: true,
      controller: "ProjectsListing",
      controllerAs: "vm"
    });
    $routeProvider.when("/project/:pslug/", {
      templateUrl: "projects/project/project.html",
      loader: true,
      controller: "Project",
      controllerAs: "vm",
      section: "project-timeline"
    });
    $routeProvider.when("/project/:pslug/search", {
      templateUrl: "search/search.html",
      reloadOnSearch: false,
      section: "search",
      loader: true
    });
    $routeProvider.when("/project/:pslug/backlog", {
      templateUrl: "backlog/backlog.html",
      loader: true,
      section: "backlog"
    });
    $routeProvider.when("/project/:pslug/kanban", {
      templateUrl: "kanban/kanban.html",
      loader: true,
      section: "kanban"
    });
    $routeProvider.when("/project/:pslug/taskboard/:sslug", {
      templateUrl: "taskboard/taskboard.html",
      loader: true,
      section: "backlog"
    });
    $routeProvider.when("/project/:pslug/us/:usref", {
      templateUrl: "us/us-detail.html",
      loader: true,
      section: "backlog-kanban"
    });
    $routeProvider.when("/project/:pslug/task/:taskref", {
      templateUrl: "task/task-detail.html",
      loader: true,
      section: "backlog-kanban"
    });
    $routeProvider.when("/project/:pslug/wiki", {
      redirectTo: function(params) {
        return "/project/" + params.pslug + "/wiki/home";
      }
    });
    $routeProvider.when("/project/:pslug/wiki/:slug", {
      templateUrl: "wiki/wiki.html",
      loader: true,
      section: "wiki"
    });
    $routeProvider.when("/project/:pslug/team", {
      templateUrl: "team/team.html",
      loader: true,
      section: "team"
    });
    $routeProvider.when("/project/:pslug/issues", {
      templateUrl: "issue/issues.html",
      loader: true,
      section: "issues"
    });
    $routeProvider.when("/project/:pslug/issue/:issueref", {
      templateUrl: "issue/issues-detail.html",
      loader: true,
      section: "issues"
    });
    $routeProvider.when("/project/:pslug/admin/project-profile/details", {
      templateUrl: "admin/admin-project-profile.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/project-profile/default-values", {
      templateUrl: "admin/admin-project-default-values.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/project-profile/modules", {
      templateUrl: "admin/admin-project-modules.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/project-profile/export", {
      templateUrl: "admin/admin-project-export.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/project-profile/reports", {
      templateUrl: "admin/admin-project-reports.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/project-values/status", {
      templateUrl: "admin/admin-project-values-status.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/project-values/points", {
      templateUrl: "admin/admin-project-values-points.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/project-values/priorities", {
      templateUrl: "admin/admin-project-values-priorities.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/project-values/severities", {
      templateUrl: "admin/admin-project-values-severities.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/project-values/types", {
      templateUrl: "admin/admin-project-values-types.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/project-values/custom-fields", {
      templateUrl: "admin/admin-project-values-custom-fields.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/memberships", {
      templateUrl: "admin/admin-memberships.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/roles", {
      templateUrl: "admin/admin-roles.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/third-parties/webhooks", {
      templateUrl: "admin/admin-third-parties-webhooks.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/third-parties/github", {
      templateUrl: "admin/admin-third-parties-github.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/third-parties/gitlab", {
      templateUrl: "admin/admin-third-parties-gitlab.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/third-parties/bitbucket", {
      templateUrl: "admin/admin-third-parties-bitbucket.html",
      section: "admin"
    });
    $routeProvider.when("/project/:pslug/admin/contrib/:plugin", {
      templateUrl: "contrib/main.html"
    });
    $routeProvider.when("/user-settings/user-profile", {
      templateUrl: "user/user-profile.html"
    });
    $routeProvider.when("/user-settings/user-change-password", {
      templateUrl: "user/user-change-password.html"
    });
    $routeProvider.when("/user-settings/mail-notifications", {
      templateUrl: "user/mail-notifications.html"
    });
    $routeProvider.when("/change-email/:email_token", {
      templateUrl: "user/change-email.html"
    });
    $routeProvider.when("/cancel-account/:cancel_token", {
      templateUrl: "user/cancel-account.html"
    });
    $routeProvider.when("/profile", {
      templateUrl: "profile/profile.html",
      loader: true,
      access: {
        requiresLogin: true
      },
      controller: "Profile",
      controllerAs: "vm"
    });
    $routeProvider.when("/profile/:slug", {
      templateUrl: "profile/profile.html",
      loader: true,
      controller: "Profile",
      controllerAs: "vm"
    });
    $routeProvider.when("/login", {
      templateUrl: "auth/login.html",
      title: "LOGIN.PAGE_TITLE",
      description: "LOGIN.PAGE_DESCRIPTION"
    });
    $routeProvider.when("/register", {
      templateUrl: "auth/register.html",
      title: "REGISTER.PAGE_TITLE",
      description: "REGISTER.PAGE_DESCRIPTION"
    });
    $routeProvider.when("/forgot-password", {
      templateUrl: "auth/forgot-password.html",
      title: "FORGOT_PASSWORD.PAGE_TITLE",
      description: "FORGOT_PASSWORD.PAGE_DESCRIPTION"
    });
    $routeProvider.when("/change-password", {
      templateUrl: "auth/change-password-from-recovery.html",
      title: "CHANGE_PASSWORD.PAGE_TITLE",
      description: "CHANGE_PASSWORD.PAGE_TITLE"
    });
    $routeProvider.when("/change-password/:token", {
      templateUrl: "auth/change-password-from-recovery.html",
      title: "CHANGE_PASSWORD.PAGE_TITLE",
      description: "CHANGE_PASSWORD.PAGE_TITLE"
    });
    $routeProvider.when("/invitation/:token", {
      templateUrl: "auth/invitation.html",
      title: "INVITATION.PAGE_TITLE",
      description: "INVITATION.PAGE_DESCRIPTION"
    });
    $routeProvider.when("/error", {
      templateUrl: "error/error.html"
    });
    $routeProvider.when("/not-found", {
      templateUrl: "error/not-found.html"
    });
    $routeProvider.when("/permission-denied", {
      templateUrl: "error/permission-denied.html"
    });
    $routeProvider.otherwise({
      redirectTo: "/not-found"
    });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    defaultHeaders = {
      "Content-Type": "application/json",
      "Accept-Language": window.taigaConfig.defaultLanguage || "en",
      "X-Session-Id": taiga.sessionId
    };
    $httpProvider.defaults.headers["delete"] = defaultHeaders;
    $httpProvider.defaults.headers.patch = defaultHeaders;
    $httpProvider.defaults.headers.post = defaultHeaders;
    $httpProvider.defaults.headers.put = defaultHeaders;
    $httpProvider.defaults.headers.get = {
      "X-Session-Id": taiga.sessionId
    };
    $httpProvider.useApplyAsync(true);
    $tgEventsProvider.setSessionId(taiga.sessionId);
    authHttpIntercept = function($q, $location, $navUrls, $lightboxService) {
      var httpResponseError;
      httpResponseError = function(response) {
        var nextPath;
        if (response.status === 0) {
          $lightboxService.closeAll();
          $location.path($navUrls.resolve("error"));
          $location.replace();
        } else if (response.status === 401) {
          nextPath = $location.path();
          $location.url($navUrls.resolve("login")).search("next=" + nextPath);
        }
        return $q.reject(response);
      };
      return {
        responseError: httpResponseError
      };
    };
    $provide.factory("authHttpIntercept", ["$q", "$location", "$tgNavUrls", "lightboxService", authHttpIntercept]);
    $httpProvider.interceptors.push("authHttpIntercept");
    loaderIntercept = function($q, loaderService) {
      return {
        request: function(config) {
          loaderService.logRequest();
          return config;
        },
        requestError: function(rejection) {
          loaderService.logResponse();
          return $q.reject(rejection);
        },
        responseError: function(rejection) {
          loaderService.logResponse();
          return $q.reject(rejection);
        },
        response: function(response) {
          loaderService.logResponse();
          return response;
        }
      };
    };
    $provide.factory("loaderIntercept", ["$q", "tgLoader", loaderIntercept]);
    $httpProvider.interceptors.push("loaderIntercept");
    versionCheckHttpIntercept = function($q) {
      var httpResponseError;
      httpResponseError = function(response) {
        var $injector;
        if (response.status === 400 && response.data.version) {
          $injector = angular.element("body").injector();
          $injector.invoke([
            "$tgConfirm", "$translate", (function(_this) {
              return function($confirm, $translate) {
                var versionErrorMsg;
                versionErrorMsg = $translate.instant("ERROR.VERSION_ERROR");
                return $confirm.notify("error", versionErrorMsg, null, 10000);
              };
            })(this)
          ]);
        }
        return $q.reject(response);
      };
      return {
        responseError: httpResponseError
      };
    };
    $provide.factory("versionCheckHttpIntercept", ["$q", versionCheckHttpIntercept]);
    $httpProvider.interceptors.push("versionCheckHttpIntercept");
    window.checksley.updateValidators({
      linewidth: function(val, width) {
        var lines, valid;
        lines = taiga.nl2br(val).split("<br />");
        valid = _.every(lines, function(line) {
          return line.length < width;
        });
        return valid;
      }
    });
    $compileProvider.debugInfoEnabled(window.taigaConfig.debugInfo || false);
    if (localStorage.userInfo) {
      userInfo = JSON.parse(localStorage.userInfo);
    }
    preferedLangCode = (userInfo != null ? userInfo.lang : void 0) || window.taigaConfig.defaultLanguage || "en";
    $translateProvider.useStaticFilesLoader({
      prefix: "/locales/locale-",
      suffix: ".json"
    }).addInterpolation('$translateMessageFormatInterpolation').preferredLanguage(preferedLangCode);
    if (!window.taigaConfig.debugInfo) {
      return $translateProvider.fallbackLanguage(preferedLangCode);
    }
  };

  i18nInit = function(lang, $translate) {
    var messages;
    moment.locale(lang);
    messages = {
      defaultMessage: $translate.instant("COMMON.FORM_ERRORS.DEFAULT_MESSAGE"),
      type: {
        email: $translate.instant("COMMON.FORM_ERRORS.TYPE_EMAIL"),
        url: $translate.instant("COMMON.FORM_ERRORS.TYPE_URL"),
        urlstrict: $translate.instant("COMMON.FORM_ERRORS.TYPE_URLSTRICT"),
        number: $translate.instant("COMMON.FORM_ERRORS.TYPE_NUMBER"),
        digits: $translate.instant("COMMON.FORM_ERRORS.TYPE_DIGITS"),
        dateIso: $translate.instant("COMMON.FORM_ERRORS.TYPE_DATEISO"),
        alphanum: $translate.instant("COMMON.FORM_ERRORS.TYPE_ALPHANUM"),
        phone: $translate.instant("COMMON.FORM_ERRORS.TYPE_PHONE")
      },
      notnull: $translate.instant("COMMON.FORM_ERRORS.NOTNULL"),
      notblank: $translate.instant("COMMON.FORM_ERRORS.NOT_BLANK"),
      required: $translate.instant("COMMON.FORM_ERRORS.REQUIRED"),
      regexp: $translate.instant("COMMON.FORM_ERRORS.REGEXP"),
      min: $translate.instant("COMMON.FORM_ERRORS.MIN"),
      max: $translate.instant("COMMON.FORM_ERRORS.MAX"),
      range: $translate.instant("COMMON.FORM_ERRORS.RANGE"),
      minlength: $translate.instant("COMMON.FORM_ERRORS.MIN_LENGTH"),
      maxlength: $translate.instant("COMMON.FORM_ERRORS.MAX_LENGTH"),
      rangelength: $translate.instant("COMMON.FORM_ERRORS.RANGE_LENGTH"),
      mincheck: $translate.instant("COMMON.FORM_ERRORS.MIN_CHECK"),
      maxcheck: $translate.instant("COMMON.FORM_ERRORS.MAX_CHECK"),
      rangecheck: $translate.instant("COMMON.FORM_ERRORS.RANGE_CHECK"),
      equalto: $translate.instant("COMMON.FORM_ERRORS.EQUAL_TO")
    };
    return checksley.updateMessages('default', messages);
  };

  init = function($log, $rootscope, $auth, $events, $analytics, $translate, $location, $navUrls, appMetaService, projectService, loaderService) {
    var un, user;
    $log.debug("Initialize application");
    $rootscope.contribPlugins = this.taigaContribPlugins;
    $rootscope.adminPlugins = _.where(this.taigaContribPlugins, {
      "type": "admin"
    });
    $rootscope.$on("$translateChangeEnd", function(e, ctx) {
      var lang;
      lang = ctx.language;
      return i18nInit(lang, $translate);
    });
    Promise.setScheduler(function(cb) {
      return $rootscope.$evalAsync(cb);
    });
    if ($auth.isAuthenticated()) {
      $events.setupConnection();
      user = $auth.getUser();
    }
    $analytics.initialize();
    un = $rootscope.$on('$routeChangeStart', function(event, next) {
      if (next.loader) {
        loaderService.start(true);
      }
      return un();
    });
    return $rootscope.$on('$routeChangeSuccess', function(event, next) {
      var description, title;
      if (next.loader) {
        loaderService.start(true);
      }
      if (next.access && next.access.requiresLogin) {
        if (!$auth.isAuthenticated()) {
          $location.path($navUrls.resolve("login"));
        }
      }
      projectService.setSection(next.section);
      if (next.params.pslug) {
        projectService.setProject(next.params.pslug);
      } else {
        projectService.cleanProject();
      }
      if (next.title || next.description) {
        title = $translate.instant(next.title || "");
        description = $translate.instant(next.description || "");
        return appMetaService.setAll(title, description);
      }
    });
  };

  modules = ["taigaBase", "taigaCommon", "taigaResources", "taigaResources2", "taigaAuth", "taigaEvents", "taigaHome", "taigaNavigationBar", "taigaProjects", "taigaRelatedTasks", "taigaBacklog", "taigaTaskboard", "taigaKanban", "taigaIssues", "taigaUserStories", "taigaTasks", "taigaTeam", "taigaWiki", "taigaSearch", "taigaAdmin", "taigaProject", "taigaUserSettings", "taigaFeedback", "taigaPlugins", "taigaIntegrations", "taigaComponents", "taigaProfile", "taigaHome", "taigaUserTimeline", "templates", "ngRoute", "ngAnimate", "pascalprecht.translate", "infinite-scroll", "tgRepeat"].concat(_.map(this.taigaContribPlugins, function(plugin) {
    return plugin.module;
  }));

  module = angular.module("taiga", modules);

  module.config(["$routeProvider", "$locationProvider", "$httpProvider", "$provide", "$tgEventsProvider", "$compileProvider", "$translateProvider", configure]);

  module.run(["$log", "$rootScope", "$tgAuth", "$tgEvents", "$tgAnalytics", "$translate", "$tgLocation", "$tgNavUrls", "tgAppMetaService", "tgProjectService", "tgLoader", init]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: classes.coffee
 */

(function() {
  var TaigaBase, TaigaController, TaigaService,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TaigaBase = (function() {
    function TaigaBase() {}

    return TaigaBase;

  })();

  TaigaService = (function(superClass) {
    extend(TaigaService, superClass);

    function TaigaService() {
      return TaigaService.__super__.constructor.apply(this, arguments);
    }

    return TaigaService;

  })(TaigaBase);

  TaigaController = (function(superClass) {
    extend(TaigaController, superClass);

    function TaigaController() {
      this.onInitialDataError = bind(this.onInitialDataError, this);
      return TaigaController.__super__.constructor.apply(this, arguments);
    }

    TaigaController.prototype.onInitialDataError = function(xhr) {
      if (xhr) {
        if (xhr.status === 404) {
          this.location.path(this.navUrls.resolve("not-found"));
          this.location.replace();
        } else if (xhr.status === 403) {
          this.location.path(this.navUrls.resolve("permission-denied"));
          this.location.replace();
        }
      }
      return this.q.reject(xhr);
    };

    return TaigaController;

  })(TaigaBase);

  this.taiga.Base = TaigaBase;

  this.taiga.Service = TaigaService;

  this.taiga.Controller = TaigaController;

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: utils.coffee
 */

(function() {
  var bindMethods, bindOnce, cancelTimeout, debounce, debounceLeading, defineImmutableProperty, groupBy, joinStr, mixOf, nl2br, replaceTags, scopeDefer, sizeFormat, slugify, startswith, stripTags, taiga, timeout, toString, toggleText, trim, truncate, unslugify,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    slice = [].slice,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  nl2br = (function(_this) {
    return function(str) {
      var breakTag;
      breakTag = '<br />';
      return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    };
  })(this);

  bindMethods = (function(_this) {
    return function(object) {
      var dependencies, methods;
      dependencies = _.keys(object);
      methods = [];
      _.forIn(object, function(value, key) {
        if (indexOf.call(dependencies, key) < 0) {
          return methods.push(key);
        }
      });
      return _.bindAll(object, methods);
    };
  })(this);

  bindOnce = (function(_this) {
    return function(scope, attr, continuation) {
      var delBind, val;
      val = scope.$eval(attr);
      if (val !== void 0) {
        return continuation(val);
      }
      delBind = null;
      return delBind = scope.$watch(attr, function(val) {
        if (val === void 0) {
          return;
        }
        continuation(val);
        if (delBind) {
          return delBind();
        }
      });
    };
  })(this);

  mixOf = function() {
    var Mixed, base, i, method, mixin, mixins, name, ref;
    base = arguments[0], mixins = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    Mixed = (function(superClass) {
      extend(Mixed, superClass);

      function Mixed() {
        return Mixed.__super__.constructor.apply(this, arguments);
      }

      return Mixed;

    })(base);
    for (i = mixins.length - 1; i >= 0; i += -1) {
      mixin = mixins[i];
      ref = mixin.prototype;
      for (name in ref) {
        method = ref[name];
        Mixed.prototype[name] = method;
      }
    }
    return Mixed;
  };

  trim = function(data, char) {
    return _.str.trim(data, char);
  };

  slugify = function(data) {
    return _.str.slugify(data);
  };

  unslugify = function(data) {
    if (data) {
      return _.str.capitalize(data.replace(/-/g, ' '));
    }
    return data;
  };

  toggleText = function(element, texts) {
    var nextTextPosition, text;
    nextTextPosition = element.data('nextTextPosition');
    if ((nextTextPosition == null) || nextTextPosition >= texts.length) {
      nextTextPosition = 0;
    }
    text = texts[nextTextPosition];
    element.data('nextTextPosition', nextTextPosition + 1);
    return element.text(text);
  };

  groupBy = function(coll, pred) {
    var i, item, len, result;
    result = {};
    for (i = 0, len = coll.length; i < len; i++) {
      item = coll[i];
      result[pred(item)] = item;
    }
    return result;
  };

  timeout = function(wait, continuation) {
    return window.setTimeout(continuation, wait);
  };

  cancelTimeout = function(timeoutVar) {
    return window.clearTimeout(timeoutVar);
  };

  scopeDefer = function(scope, func) {
    return _.defer((function(_this) {
      return function() {
        return scope.$apply(func);
      };
    })(this));
  };

  toString = function(value) {
    if (_.isNumber(value)) {
      return value + "";
    } else if (_.isString(value)) {
      return value;
    } else if (_.isPlainObject(value)) {
      return JSON.stringify(value);
    } else if (_.isUndefined(value)) {
      return "";
    }
    return value.toString();
  };

  joinStr = function(str, coll) {
    return _.str.join(str, coll);
  };

  debounce = function(wait, func) {
    return _.debounce(func, wait, {
      leading: true,
      trailing: false
    });
  };

  debounceLeading = function(wait, func) {
    return _.debounce(func, wait, {
      leading: false,
      trailing: true
    });
  };

  startswith = function(str1, str2) {
    return _.str.startsWith(str1, str2);
  };

  truncate = function(str, maxLength, suffix) {
    var out;
    if (suffix == null) {
      suffix = "...";
    }
    if ((typeof str !== "string") && !(str instanceof String)) {
      return str;
    }
    out = str.slice(0);
    if (out.length > maxLength) {
      out = out.substring(0, maxLength + 1);
      out = out.substring(0, Math.min(out.length, out.lastIndexOf(" ")));
      out = out + suffix;
    }
    return out;
  };

  sizeFormat = function(input, precision) {
    var number, size, units;
    if (precision == null) {
      precision = 1;
    }
    if (isNaN(parseFloat(input)) || !isFinite(input)) {
      return "-";
    }
    if (input === 0) {
      return "0 bytes";
    }
    units = ["bytes", "KB", "MB", "GB", "TB", "PB"];
    number = Math.floor(Math.log(input) / Math.log(1024));
    if (number > 5) {
      number = 5;
    }
    size = (input / Math.pow(1024, number)).toFixed(precision);
    return size + " " + units[number];
  };

  stripTags = function(str, exception) {
    var pattern;
    if (exception) {
      pattern = new RegExp('<(?!' + exception + '\s*\/?)[^>]+>', 'gi');
      return String(str).replace(pattern, '');
    } else {
      return String(str).replace(/<\/?[^>]+>/g, '');
    }
  };

  replaceTags = function(str, tags, replace) {
    var pattern;
    pattern = new RegExp('<(' + tags + ')>', 'gi');
    str = str.replace(pattern, '<' + replace + '>');
    pattern = new RegExp('<\/(' + tags + ')>', 'gi');
    str = str.replace(pattern, '</' + replace + '>');
    return str;
  };

  defineImmutableProperty = (function(_this) {
    return function(obj, name, fn) {
      return Object.defineProperty(obj, name, {
        get: function() {
          var fn_result;
          if (!_.isFunction(fn)) {
            throw "defineImmutableProperty third param must be a function";
          }
          fn_result = fn();
          if (fn_result && _.isObject(fn_result)) {
            if (fn_result.size === void 0) {
              throw "defineImmutableProperty must return immutable data";
            }
          }
          return fn_result;
        }
      });
    };
  })(this);

  taiga = this.taiga;

  taiga.nl2br = nl2br;

  taiga.bindMethods = bindMethods;

  taiga.bindOnce = bindOnce;

  taiga.mixOf = mixOf;

  taiga.trim = trim;

  taiga.slugify = slugify;

  taiga.unslugify = unslugify;

  taiga.toggleText = toggleText;

  taiga.groupBy = groupBy;

  taiga.timeout = timeout;

  taiga.cancelTimeout = cancelTimeout;

  taiga.scopeDefer = scopeDefer;

  taiga.toString = toString;

  taiga.joinStr = joinStr;

  taiga.truncate = truncate;

  taiga.debounce = debounce;

  taiga.debounceLeading = debounceLeading;

  taiga.startswith = startswith;

  taiga.sizeFormat = sizeFormat;

  taiga.stripTags = stripTags;

  taiga.replaceTags = replaceTags;

  taiga.defineImmutableProperty = defineImmutableProperty;

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/controllerMixins.coffee
 */

(function() {
  var FiltersMixin, PageMixin, groupBy, joinStr, taiga, toString, trim;

  taiga = this.taiga;

  groupBy = this.taiga.groupBy;

  joinStr = this.taiga.joinStr;

  trim = this.taiga.trim;

  toString = this.taiga.toString;

  PageMixin = (function() {
    function PageMixin() {}

    PageMixin.prototype.fillUsersAndRoles = function(users, roles) {
      var activeUsers, computableRoles;
      activeUsers = _.filter(users, (function(_this) {
        return function(user) {
          return user.is_active;
        };
      })(this));
      this.scope.activeUsers = _.sortBy(activeUsers, "full_name_display");
      this.scope.activeUsersById = groupBy(this.scope.activeUsers, function(e) {
        return e.id;
      });
      this.scope.users = _.sortBy(users, "full_name_display");
      this.scope.usersById = groupBy(this.scope.users, function(e) {
        return e.id;
      });
      this.scope.roles = _.sortBy(roles, "order");
      computableRoles = _(this.scope.project.members).map("role").uniq().value();
      return this.scope.computableRoles = _(roles).filter("computable").filter(function(x) {
        return _.contains(computableRoles, x.id);
      }).value();
    };

    PageMixin.prototype.loadUsersAndRoles = function() {
      var promise;
      promise = this.q.all([this.rs.projects.usersList(this.scope.projectId), this.rs.projects.rolesList(this.scope.projectId)]);
      return promise.then((function(_this) {
        return function(results) {
          var roles, users;
          users = results[0], roles = results[1];
          _this.fillUsersAndRoles(users, roles);
          return results;
        };
      })(this));
    };

    return PageMixin;

  })();

  taiga.PageMixin = PageMixin;

  FiltersMixin = (function() {
    function FiltersMixin() {}

    FiltersMixin.prototype.selectFilter = function(name, value, load) {
      var existing, location, params;
      if (load == null) {
        load = false;
      }
      params = this.location.search();
      if (params[name] !== void 0 && name !== "page") {
        existing = _.map(taiga.toString(params[name]).split(","), function(x) {
          return trim(x);
        });
        existing.push(taiga.toString(value));
        existing = _.compact(existing);
        value = joinStr(",", _.uniq(existing));
      }
      if (!this.location.isInCurrentRouteParams(name, value)) {
        location = load ? this.location : this.location.noreload(this.scope);
        return location.search(name, value);
      }
    };

    FiltersMixin.prototype.replaceFilter = function(name, value, load) {
      var location;
      if (load == null) {
        load = false;
      }
      if (!this.location.isInCurrentRouteParams(name, value)) {
        location = load ? this.location : this.location.noreload(this.scope);
        return location.search(name, value);
      }
    };

    FiltersMixin.prototype.replaceAllFilters = function(filters, load) {
      var location;
      if (load == null) {
        load = false;
      }
      location = load ? this.location : this.location.noreload(this.scope);
      return location.search(filters);
    };

    FiltersMixin.prototype.unselectFilter = function(name, value, load) {
      var location, newValues, params, parsedValues;
      if (load == null) {
        load = false;
      }
      params = this.location.search();
      if (params[name] === void 0) {
        return;
      }
      if (value === void 0 || value === null) {
        delete params[name];
      }
      parsedValues = _.map(taiga.toString(params[name]).split(","), function(x) {
        return trim(x);
      });
      newValues = _.reject(parsedValues, function(x) {
        return x === taiga.toString(value);
      });
      newValues = _.compact(newValues);
      if (_.isEmpty(newValues)) {
        value = null;
      } else {
        value = joinStr(",", _.uniq(newValues));
      }
      location = load ? this.location : this.location.noreload(this.scope);
      return location.search(name, value);
    };

    return FiltersMixin;

  })();

  taiga.FiltersMixin = FiltersMixin;

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/admin.coffee
 */

(function() {
  var module;

  module = angular.module("taigaAdmin", []);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/auth.coffee
 */

(function() {
  var AuthService, CancelAccountDirective, ChangeEmailDirective, ChangePasswordFromRecoveryDirective, ForgotPasswordDirective, InvitationDirective, LoginDirective, PublicRegisterMessageDirective, RegisterDirective, debounce, module, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  debounce = this.taiga.debounce;

  module = angular.module("taigaAuth", ["taigaResources"]);

  AuthService = (function(superClass) {
    extend(AuthService, superClass);

    AuthService.$inject = ["$rootScope", "$tgStorage", "$tgModel", "$tgResources", "$tgHttp", "$tgUrls", "$tgConfig", "$translate", "tgCurrentUserService", "tgThemeService"];

    function AuthService(rootscope, storage, model, rs, http, urls, config, translate, currentUserService, themeService) {
      var userModel;
      this.rootscope = rootscope;
      this.storage = storage;
      this.model = model;
      this.rs = rs;
      this.http = http;
      this.urls = urls;
      this.config = config;
      this.translate = translate;
      this.currentUserService = currentUserService;
      this.themeService = themeService;
      AuthService.__super__.constructor.call(this);
      userModel = this.getUser();
      this.setUserdata(userModel);
    }

    AuthService.prototype.setUserdata = function(userModel) {
      if (userModel) {
        this.userData = Immutable.fromJS(userModel.getAttrs());
        return this.currentUserService.setUser(this.userData);
      } else {
        return this.userData = null;
      }
    };

    AuthService.prototype._setTheme = function() {
      var ref, theme;
      theme = ((ref = this.rootscope.user) != null ? ref.theme : void 0) || this.config.get("defaultTheme") || "taiga";
      return this.themeService.use(theme);
    };

    AuthService.prototype._setLocales = function() {
      var lang, ref;
      lang = ((ref = this.rootscope.user) != null ? ref.lang : void 0) || this.config.get("defaultLanguage") || "en";
      this.translate.preferredLanguage(lang);
      return this.translate.use(lang);
    };

    AuthService.prototype.getUser = function() {
      var user, userData;
      if (this.rootscope.user) {
        return this.rootscope.user;
      }
      userData = this.storage.get("userInfo");
      if (userData) {
        user = this.model.make_model("users", userData);
        this.rootscope.user = user;
        this._setLocales();
        this._setTheme();
        return user;
      }
      return null;
    };

    AuthService.prototype.setUser = function(user) {
      this.rootscope.auth = user;
      this.storage.set("userInfo", user.getAttrs());
      this.rootscope.user = user;
      this.setUserdata(user);
      this._setLocales();
      return this._setTheme();
    };

    AuthService.prototype.clear = function() {
      this.rootscope.auth = null;
      this.rootscope.user = null;
      return this.storage.remove("userInfo");
    };

    AuthService.prototype.setToken = function(token) {
      return this.storage.set("token", token);
    };

    AuthService.prototype.getToken = function() {
      return this.storage.get("token");
    };

    AuthService.prototype.removeToken = function() {
      return this.storage.remove("token");
    };

    AuthService.prototype.isAuthenticated = function() {
      if (this.getUser() !== null) {
        return true;
      }
      return false;
    };

    AuthService.prototype.login = function(data, type) {
      var url;
      url = this.urls.resolve("auth");
      data = _.clone(data, false);
      data.type = type ? type : "normal";
      this.removeToken();
      return this.http.post(url, data).then((function(_this) {
        return function(data, status) {
          var user;
          user = _this.model.make_model("users", data.data);
          _this.setToken(user.auth_token);
          _this.setUser(user);
          return user;
        };
      })(this));
    };

    AuthService.prototype.logout = function() {
      this.removeToken();
      this.clear();
      this.currentUserService.removeUser();
      this._setTheme();
      return this._setLocales();
    };

    AuthService.prototype.register = function(data, type, existing) {
      var url;
      url = this.urls.resolve("auth-register");
      data = _.clone(data, false);
      data.type = type ? type : "public";
      if (type === "private") {
        data.existing = existing ? existing : false;
      }
      this.removeToken();
      return this.http.post(url, data).then((function(_this) {
        return function(response) {
          var user;
          user = _this.model.make_model("users", response.data);
          _this.setToken(user.auth_token);
          _this.setUser(user);
          return user;
        };
      })(this));
    };

    AuthService.prototype.getInvitation = function(token) {
      return this.rs.invitations.get(token);
    };

    AuthService.prototype.acceptInvitiationWithNewUser = function(data) {
      return this.register(data, "private", false);
    };

    AuthService.prototype.acceptInvitiationWithExistingUser = function(data) {
      return this.register(data, "private", true);
    };

    AuthService.prototype.forgotPassword = function(data) {
      var url;
      url = this.urls.resolve("users-password-recovery");
      data = _.clone(data, false);
      this.removeToken();
      return this.http.post(url, data);
    };

    AuthService.prototype.changePasswordFromRecovery = function(data) {
      var url;
      url = this.urls.resolve("users-change-password-from-recovery");
      data = _.clone(data, false);
      this.removeToken();
      return this.http.post(url, data);
    };

    AuthService.prototype.changeEmail = function(data) {
      var url;
      url = this.urls.resolve("users-change-email");
      data = _.clone(data, false);
      return this.http.post(url, data);
    };

    AuthService.prototype.cancelAccount = function(data) {
      var url;
      url = this.urls.resolve("users-cancel-account");
      data = _.clone(data, false);
      return this.http.post(url, data);
    };

    return AuthService;

  })(taiga.Service);

  module.service("$tgAuth", AuthService);

  PublicRegisterMessageDirective = function($config, $navUrls, templates) {
    var template, templateFn;
    template = templates.get("auth/login-text.html", true);
    templateFn = function() {
      var publicRegisterEnabled;
      publicRegisterEnabled = $config.get("publicRegisterEnabled");
      if (!publicRegisterEnabled) {
        return "";
      }
      return template({
        url: $navUrls.resolve("register")
      });
    };
    return {
      restrict: "AE",
      scope: {},
      template: templateFn
    };
  };

  module.directive("tgPublicRegisterMessage", ["$tgConfig", "$tgNavUrls", "$tgTemplate", PublicRegisterMessageDirective]);

  LoginDirective = function($auth, $confirm, $location, $config, $routeParams, $navUrls, $events, $translate) {
    var link;
    link = function($scope, $el, $attrs) {
      var onError, onSuccess, submit;
      onSuccess = function(response) {
        var nextUrl;
        if ($routeParams['next'] && $routeParams['next'] !== $navUrls.resolve("login")) {
          nextUrl = $routeParams['next'];
        } else {
          nextUrl = $navUrls.resolve("home");
        }
        $events.setupConnection();
        return $location.path(nextUrl);
      };
      onError = function(response) {
        return $confirm.notify("light-error", $translate.instant("LOGIN_FORM.ERROR_AUTH_INCORRECT"));
      };
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var data, form, loginFormType, promise;
          event.preventDefault();
          form = new checksley.Form($el.find("form.login-form"));
          if (!form.validate()) {
            return;
          }
          data = {
            "username": $el.find("form.login-form input[name=username]").val(),
            "password": $el.find("form.login-form input[name=password]").val()
          };
          loginFormType = $config.get("loginFormType", "normal");
          promise = $auth.login(data, loginFormType);
          return promise.then(onSuccess, onError);
        };
      })(this));
      $el.on("submit", "form", submit);
      window.prerenderReady = true;
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgLogin", ["$tgAuth", "$tgConfirm", "$tgLocation", "$tgConfig", "$routeParams", "$tgNavUrls", "$tgEvents", "$translate", LoginDirective]);

  RegisterDirective = function($auth, $confirm, $location, $navUrls, $config, $analytics, $translate) {
    var link;
    link = function($scope, $el, $attrs) {
      var form, onErrorSubmit, onSuccessSubmit, submit;
      if (!$config.get("publicRegisterEnabled")) {
        $location.path($navUrls.resolve("not-found"));
        $location.replace();
      }
      $scope.data = {};
      form = $el.find("form").checksley({
        onlyOneErrorElement: true
      });
      onSuccessSubmit = function(response) {
        $analytics.trackEvent("auth", "register", "user registration", 1);
        $confirm.notify("success", $translate.instant("LOGIN_FORM.SUCCESS"));
        return $location.path($navUrls.resolve("home"));
      };
      onErrorSubmit = function(response) {
        var text;
        if (response.data._error_message) {
          text = $translate.instant("COMMON.GENERIC_ERROR", {
            error: response.data._error_message
          });
          $confirm.notify("light-error", text);
        }
        return form.setErrors(response.data);
      };
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var promise;
          event.preventDefault();
          if (!form.validate()) {
            return;
          }
          promise = $auth.register($scope.data);
          return promise.then(onSuccessSubmit, onErrorSubmit);
        };
      })(this));
      $el.on("submit", "form", submit);
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      return window.prerenderReady = true;
    };
    return {
      link: link
    };
  };

  module.directive("tgRegister", ["$tgAuth", "$tgConfirm", "$tgLocation", "$tgNavUrls", "$tgConfig", "$tgAnalytics", "$translate", RegisterDirective]);

  ForgotPasswordDirective = function($auth, $confirm, $location, $navUrls, $translate) {
    var link;
    link = function($scope, $el, $attrs) {
      var form, onErrorSubmit, onSuccessSubmit, submit;
      $scope.data = {};
      form = $el.find("form").checksley();
      onSuccessSubmit = function(response) {
        var text;
        $location.path($navUrls.resolve("login"));
        text = $translate.instant("FORGOT_PASSWORD_FORM.SUCCESS");
        return $confirm.success(text);
      };
      onErrorSubmit = function(response) {
        var text;
        text = $translate.instant("FORGOT_PASSWORD_FORM.ERROR");
        return $confirm.notify("light-error", text);
      };
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var promise;
          event.preventDefault();
          if (!form.validate()) {
            return;
          }
          promise = $auth.forgotPassword($scope.data);
          return promise.then(onSuccessSubmit, onErrorSubmit);
        };
      })(this));
      $el.on("submit", "form", submit);
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      return window.prerenderReady = true;
    };
    return {
      link: link
    };
  };

  module.directive("tgForgotPassword", ["$tgAuth", "$tgConfirm", "$tgLocation", "$tgNavUrls", "$translate", ForgotPasswordDirective]);

  ChangePasswordFromRecoveryDirective = function($auth, $confirm, $location, $params, $navUrls, $translate) {
    var link;
    link = function($scope, $el, $attrs) {
      var form, onErrorSubmit, onSuccessSubmit, submit;
      $scope.data = {};
      if ($params.token != null) {
        $scope.tokenInParams = true;
        $scope.data.token = $params.token;
      } else {
        $scope.tokenInParams = false;
      }
      form = $el.find("form").checksley();
      onSuccessSubmit = function(response) {
        var text;
        $location.path($navUrls.resolve("login"));
        text = $translate.instant("CHANGE_PASSWORD_RECOVERY_FORM.SUCCESS");
        return $confirm.success(text);
      };
      onErrorSubmit = function(response) {
        var text;
        text = $translate.instant("COMMON.GENERIC_ERROR", {
          error: response.data._error_message
        });
        return $confirm.notify("light-error", text);
      };
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var promise;
          event.preventDefault();
          if (!form.validate()) {
            return;
          }
          promise = $auth.changePasswordFromRecovery($scope.data);
          return promise.then(onSuccessSubmit, onErrorSubmit);
        };
      })(this));
      $el.on("submit", "form", submit);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgChangePasswordFromRecovery", ["$tgAuth", "$tgConfirm", "$tgLocation", "$routeParams", "$tgNavUrls", "$translate", ChangePasswordFromRecoveryDirective]);

  InvitationDirective = function($auth, $confirm, $location, $params, $navUrls, $analytics, $translate) {
    var link;
    link = function($scope, $el, $attrs) {
      var loginForm, onErrorSubmitLogin, onErrorSubmitRegister, onSuccessSubmitLogin, onSuccessSubmitRegister, promise, registerForm, submitLogin, submitRegister, token;
      token = $params.token;
      promise = $auth.getInvitation(token);
      promise.then(function(invitation) {
        return $scope.invitation = invitation;
      });
      promise.then(null, function(response) {
        var text;
        $location.path($navUrls.resolve("login"));
        text = $translate.instant("INVITATION_LOGIN_FORM.NOT_FOUND");
        return $confirm.success(text);
      });
      $scope.dataLogin = {
        token: token
      };
      loginForm = $el.find("form.login-form").checksley({
        onlyOneErrorElement: true
      });
      onSuccessSubmitLogin = function(response) {
        var text;
        $analytics.trackEvent("auth", "invitationAccept", "invitation accept with existing user", 1);
        $location.path($navUrls.resolve("project", {
          project: $scope.invitation.project_slug
        }));
        text = $translate.instant("INVITATION_LOGIN_FORM.SUCCESS", {
          "project_name": $scope.invitation.project_name
        });
        return $confirm.notify("success", text);
      };
      onErrorSubmitLogin = function(response) {
        var text;
        text = $translate.instant("INVITATION_LOGIN_FORM.ERROR");
        return $confirm.notify("light-error", text);
      };
      submitLogin = debounce(2000, (function(_this) {
        return function(event) {
          event.preventDefault();
          if (!loginForm.validate()) {
            return;
          }
          promise = $auth.acceptInvitiationWithExistingUser($scope.dataLogin);
          return promise.then(onSuccessSubmitLogin, onErrorSubmitLogin);
        };
      })(this));
      $el.on("submit", "form.login-form", submitLogin);
      $el.on("click", ".button-login", submitLogin);
      $scope.dataRegister = {
        token: token
      };
      registerForm = $el.find("form.register-form").checksley({
        onlyOneErrorElement: true
      });
      onSuccessSubmitRegister = function(response) {
        $analytics.trackEvent("auth", "invitationAccept", "invitation accept with new user", 1);
        $location.path($navUrls.resolve("project", {
          project: $scope.invitation.project_slug
        }));
        return $confirm.notify("success", "You've successfully joined this project", "Welcome to " + (_.escape($scope.invitation.project_name)));
      };
      onErrorSubmitRegister = function(response) {
        var text;
        if (response.data._error_message) {
          text = $translate.instant("COMMON.GENERIC_ERROR", {
            error: response.data._error_message
          });
          $confirm.notify("light-error", text);
        }
        return registerForm.setErrors(response.data);
      };
      submitRegister = debounce(2000, (function(_this) {
        return function(event) {
          event.preventDefault();
          if (!registerForm.validate()) {
            return;
          }
          promise = $auth.acceptInvitiationWithNewUser($scope.dataRegister);
          return promise.then(onSuccessSubmitRegister, onErrorSubmitRegister);
        };
      })(this));
      $el.on("submit", "form.register-form", submitRegister);
      $el.on("click", ".button-register", submitRegister);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgInvitation", ["$tgAuth", "$tgConfirm", "$tgLocation", "$routeParams", "$tgNavUrls", "$tgAnalytics", "$translate", InvitationDirective]);

  ChangeEmailDirective = function($repo, $model, $auth, $confirm, $location, $params, $navUrls, $translate) {
    var link;
    link = function($scope, $el, $attrs) {
      var form, onErrorSubmit, onSuccessSubmit, submit;
      $scope.data = {};
      $scope.data.email_token = $params.email_token;
      form = $el.find("form").checksley();
      onSuccessSubmit = function(response) {
        var text;
        if ($auth.isAuthenticated()) {
          $repo.queryOne("users", $auth.getUser().id).then((function(_this) {
            return function(data) {
              $auth.setUser(data);
              return $location.path($navUrls.resolve("home"));
            };
          })(this));
        } else {
          $location.path($navUrls.resolve("login"));
        }
        text = $translate.instant("CHANGE_EMAIL_FORM.SUCCESS");
        return $confirm.success(text);
      };
      onErrorSubmit = function(response) {
        var text;
        text = $translate.instant("COMMON.GENERIC_ERROR", {
          error: response.data._error_message
        });
        return $confirm.notify("light-error", text);
      };
      submit = function() {
        var promise;
        if (!form.validate()) {
          return;
        }
        promise = $auth.changeEmail($scope.data);
        return promise.then(onSuccessSubmit, onErrorSubmit);
      };
      $el.on("submit", function(event) {
        event.preventDefault();
        return submit();
      });
      $el.on("click", "a.button-change-email", function(event) {
        event.preventDefault();
        return submit();
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgChangeEmail", ["$tgRepo", "$tgModel", "$tgAuth", "$tgConfirm", "$tgLocation", "$routeParams", "$tgNavUrls", "$translate", ChangeEmailDirective]);

  CancelAccountDirective = function($repo, $model, $auth, $confirm, $location, $params, $navUrls) {
    var link;
    link = function($scope, $el, $attrs) {
      var form, onErrorSubmit, onSuccessSubmit, submit;
      $scope.data = {};
      $scope.data.cancel_token = $params.cancel_token;
      form = $el.find("form").checksley();
      onSuccessSubmit = function(response) {
        var text;
        $auth.logout();
        $location.path($navUrls.resolve("home"));
        text = $translate.instant("CANCEL_ACCOUNT.SUCCESS");
        return $confirm.success(text);
      };
      onErrorSubmit = function(response) {
        var text;
        text = $translate.instant("COMMON.GENERIC_ERROR", {
          error: response.data._error_message
        });
        return $confirm.notify("error", text);
      };
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var promise;
          event.preventDefault();
          if (!form.validate()) {
            return;
          }
          promise = $auth.cancelAccount($scope.data);
          return promise.then(onSuccessSubmit, onErrorSubmit);
        };
      })(this));
      $el.on("submit", "form", submit);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgCancelAccount", ["$tgRepo", "$tgModel", "$tgAuth", "$tgConfirm", "$tgLocation", "$routeParams", "$tgNavUrls", CancelAccountDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/backlog.coffee
 */

(function() {
  var module;

  module = angular.module("taigaBacklog", []);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/base.coffee
 */

(function() {
  var TaigaMainDirective, bindOnce, groupBy, init, module, taiga, urls;

  taiga = this.taiga;

  groupBy = this.taiga.groupBy;

  bindOnce = this.taiga.bindOnce;

  module = angular.module("taigaBase", []);

  TaigaMainDirective = function($rootscope, $window) {
    var link;
    link = function($scope, $el, $attrs) {
      return $window.onresize = function() {
        return $rootscope.$broadcast("resize");
      };
    };
    return {
      link: link
    };
  };

  module.directive("tgMain", ["$rootScope", "$window", TaigaMainDirective]);

  urls = {
    "home": "/",
    "projects": "/projects",
    "error": "/error",
    "not-found": "/not-found",
    "permission-denied": "/permission-denied",
    "login": "/login",
    "forgot-password": "/forgot-password",
    "change-password": "/change-password/:token",
    "change-email": "/change-email/:token",
    "cancel-account": "/cancel-account/:token",
    "register": "/register",
    "invitation": "/invitation/:token",
    "create-project": "/create-project",
    "profile": "/profile",
    "user-profile": "/profile/:username",
    "project": "/project/:project",
    "project-backlog": "/project/:project/backlog",
    "project-taskboard": "/project/:project/taskboard/:sprint",
    "project-kanban": "/project/:project/kanban",
    "project-issues": "/project/:project/issues",
    "project-search": "/project/:project/search",
    "project-userstories-detail": "/project/:project/us/:ref",
    "project-tasks-detail": "/project/:project/task/:ref",
    "project-issues-detail": "/project/:project/issue/:ref",
    "project-wiki": "/project/:project/wiki",
    "project-wiki-page": "/project/:project/wiki/:slug",
    "project-team": "/project/:project/team",
    "project-admin-home": "/project/:project/admin/project-profile/details",
    "project-admin-project-profile-details": "/project/:project/admin/project-profile/details",
    "project-admin-project-profile-default-values": "/project/:project/admin/project-profile/default-values",
    "project-admin-project-profile-modules": "/project/:project/admin/project-profile/modules",
    "project-admin-project-profile-export": "/project/:project/admin/project-profile/export",
    "project-admin-project-profile-reports": "/project/:project/admin/project-profile/reports",
    "project-admin-project-values-status": "/project/:project/admin/project-values/status",
    "project-admin-project-values-points": "/project/:project/admin/project-values/points",
    "project-admin-project-values-priorities": "/project/:project/admin/project-values/priorities",
    "project-admin-project-values-severities": "/project/:project/admin/project-values/severities",
    "project-admin-project-values-types": "/project/:project/admin/project-values/types",
    "project-admin-project-values-custom-fields": "/project/:project/admin/project-values/custom-fields",
    "project-admin-memberships": "/project/:project/admin/memberships",
    "project-admin-roles": "/project/:project/admin/roles",
    "project-admin-third-parties-webhooks": "/project/:project/admin/third-parties/webhooks",
    "project-admin-third-parties-github": "/project/:project/admin/third-parties/github",
    "project-admin-third-parties-gitlab": "/project/:project/admin/third-parties/gitlab",
    "project-admin-third-parties-bitbucket": "/project/:project/admin/third-parties/bitbucket",
    "project-admin-contrib": "/project/:project/admin/contrib/:plugin",
    "user-settings-user-profile": "/user-settings/user-profile",
    "user-settings-user-change-password": "/user-settings/user-change-password",
    "user-settings-user-avatar": "/user-settings/user-avatar",
    "user-settings-mail-notifications": "/user-settings/mail-notifications"
  };

  init = function($log, $navurls) {
    $log.debug("Initialize navigation urls");
    return $navurls.update(urls);
  };

  module.run(["$log", "$tgNavUrls", init]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common.coffee
 */

(function() {
  var AnimationFrame, CheckPermissionDirective, ClassPermissionDirective, LimitLineLengthDirective, ProjectUrl, Qqueue, SelectedText, Template, ToggleCommentDirective, module, taiga,
    slice = [].slice;

  taiga = this.taiga;

  module = angular.module("taigaCommon", []);

  SelectedText = function($window, $document) {
    var get;
    get = function() {
      if ($window.getSelection) {
        return $window.getSelection().toString();
      } else if ($document.selection) {
        return $document.selection.createRange().text;
      }
      return "";
    };
    return {
      get: get
    };
  };

  module.factory("$selectedText", ["$window", "$document", SelectedText]);

  CheckPermissionDirective = function() {
    var link, render;
    render = function($el, project, permission) {
      if (project.my_permissions.indexOf(permission) > -1) {
        return $el.removeClass('hidden');
      }
    };
    link = function($scope, $el, $attrs) {
      var permission;
      $el.addClass('hidden');
      permission = $attrs.tgCheckPermission;
      $scope.$watch("project", function(project) {
        if (project != null) {
          return render($el, project, permission);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgCheckPermission", CheckPermissionDirective);

  ClassPermissionDirective = function() {
    var link, name;
    name = "tgClassPermission";
    link = function($scope, $el, $attrs) {
      var checkPermissions, tgClassPermissionWatchAction, unbindWatcher;
      checkPermissions = function(project, className, permission) {
        var negation;
        negation = permission[0] === "!";
        if (negation) {
          permission = permission.slice(1);
        }
        if (negation && project.my_permissions.indexOf(permission) === -1) {
          return $el.addClass(className);
        } else if (!negation && project.my_permissions.indexOf(permission) !== -1) {
          return $el.addClass(className);
        } else {
          return $el.removeClass(className);
        }
      };
      tgClassPermissionWatchAction = function(project) {
        var className, classes, permission, results;
        if (project) {
          unbindWatcher();
          classes = $scope.$eval($attrs[name]);
          results = [];
          for (className in classes) {
            permission = classes[className];
            results.push(checkPermissions(project, className, permission));
          }
          return results;
        }
      };
      return unbindWatcher = $scope.$watch("project", tgClassPermissionWatchAction);
    };
    return {
      link: link
    };
  };

  module.directive("tgClassPermission", ClassPermissionDirective);

  AnimationFrame = function() {
    var add, animationFrame, performAnimation, tail;
    animationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
    performAnimation = (function(_this) {
      return function(time) {
        var fn;
        fn = tail.shift();
        fn();
        if (tail.length) {
          return animationFrame(performAnimation);
        }
      };
    })(this);
    tail = [];
    add = function() {
      var fn, i, len, results;
      results = [];
      for (i = 0, len = arguments.length; i < len; i++) {
        fn = arguments[i];
        tail.push(fn);
        if (tail.length === 1) {
          results.push(animationFrame(performAnimation));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    return {
      add: add
    };
  };

  module.factory("animationFrame", AnimationFrame);

  ToggleCommentDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      return $el.find("textarea").on("focus", function() {
        return $el.addClass("active");
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgToggleComment", ToggleCommentDirective);

  ProjectUrl = function($navurls) {
    var get;
    get = function(project) {
      var ctx;
      ctx = {
        project: project.slug
      };
      if (project.is_backlog_activated && project.my_permissions.indexOf("view_us") > -1) {
        return $navurls.resolve("project-backlog", ctx);
      }
      if (project.is_kanban_activated && project.my_permissions.indexOf("view_us") > -1) {
        return $navurls.resolve("project-kanban", ctx);
      }
      if (project.is_wiki_activated && project.my_permissions.indexOf("view_wiki_pages") > -1) {
        return $navurls.resolve("project-wiki", ctx);
      }
      if (project.is_issues_activated && project.my_permissions.indexOf("view_issues") > -1) {
        return $navurls.resolve("project-issues", ctx);
      }
      return $navurls.resolve("project", ctx);
    };
    return {
      get: get
    };
  };

  module.factory("$projectUrl", ["$tgNavUrls", ProjectUrl]);

  LimitLineLengthDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      var maxColsPerLine;
      maxColsPerLine = parseInt($el.attr("cols"));
      return $el.on("keyup", function(event) {
        var code, lines;
        code = event.keyCode;
        lines = $el.val().split("\n");
        _.each(lines, function(line, index) {
          return lines[index] = line.substring(0, maxColsPerLine - 2);
        });
        return $el.val(lines.join("\n"));
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgLimitLineLength", LimitLineLengthDirective);

  Qqueue = function($q) {
    var deferred, lastPromise, qqueue;
    deferred = $q.defer();
    deferred.resolve();
    lastPromise = deferred.promise;
    qqueue = {
      bindAdd: (function(_this) {
        return function(fn) {
          return function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return lastPromise = lastPromise.then(function() {
              return fn.apply(_this, args);
            });
          };
          return qqueue;
        };
      })(this),
      add: (function(_this) {
        return function(fn) {
          if (!lastPromise) {
            lastPromise = fn();
          } else {
            lastPromise = lastPromise.then(fn);
          }
          return qqueue;
        };
      })(this)
    };
    return qqueue;
  };

  module.factory("$tgQqueue", ["$q", Qqueue]);

  Template = function($templateCache) {
    return {
      get: (function(_this) {
        return function(name, lodash) {
          var tmp;
          if (lodash == null) {
            lodash = false;
          }
          tmp = $templateCache.get(name);
          if (lodash) {
            tmp = _.template(tmp);
          }
          return tmp;
        };
      })(this)
    };
  };

  module.factory("$tgTemplate", ["$templateCache", Template]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/events.coffee
 */

(function() {
  var EventsProvider, EventsService, bindMethods, module, startswith, taiga;

  taiga = this.taiga;

  startswith = this.taiga.startswith;

  bindMethods = this.taiga.bindMethods;

  module = angular.module("taigaEvents", []);

  EventsService = (function() {
    function EventsService(win, log, config, auth) {
      this.win = win;
      this.log = log;
      this.config = config;
      this.auth = auth;
      bindMethods(this);
    }

    EventsService.prototype.initialize = function(sessionId) {
      this.sessionId = sessionId;
      this.subscriptions = {};
      this.connected = false;
      this.error = false;
      this.pendingMessages = [];
      if (this.win.WebSocket === void 0) {
        return this.log.info("WebSockets not supported on your browser");
      }
    };

    EventsService.prototype.setupConnection = function() {
      var loc, path, scheme, url;
      this.stopExistingConnection();
      url = this.config.get("eventsUrl");
      if (!url) {
        return;
      }
      if (!startswith(url, "ws:") && !startswith(url, "wss:")) {
        loc = this.win.location;
        scheme = loc.protocol === "https:" ? "wss:" : "ws:";
        path = _.str.ltrim(url, "/");
        url = scheme + "//" + loc.host + "/" + path;
      }
      this.ws = new this.win.WebSocket(url);
      this.ws.addEventListener("open", this.onOpen);
      this.ws.addEventListener("message", this.onMessage);
      this.ws.addEventListener("error", this.onError);
      return this.ws.addEventListener("close", this.onClose);
    };

    EventsService.prototype.stopExistingConnection = function() {
      if (this.ws === void 0) {
        return;
      }
      this.ws.removeEventListener("open", this.onOpen);
      this.ws.removeEventListener("close", this.onClose);
      this.ws.removeEventListener("error", this.onError);
      this.ws.removeEventListener("message", this.onMessage);
      this.ws.close();
      return delete this.ws;
    };

    EventsService.prototype.serialize = function(message) {
      if (_.isObject(message)) {
        return JSON.stringify(message);
      }
      return message;
    };

    EventsService.prototype.sendMessage = function(message) {
      var i, len, messages, msg, results;
      this.pendingMessages.push(message);
      if (!this.connected) {
        return;
      }
      messages = _.map(this.pendingMessages, this.serialize);
      this.pendingMessages = [];
      results = [];
      for (i = 0, len = messages.length; i < len; i++) {
        msg = messages[i];
        results.push(this.ws.send(msg));
      }
      return results;
    };

    EventsService.prototype.subscribe = function(scope, routingKey, callback) {
      var message, subscription;
      if (this.error) {
        return;
      }
      this.log.debug("Subscribe to: " + routingKey);
      subscription = {
        scope: scope,
        routingKey: routingKey,
        callback: _.debounce(callback, 500, {
          "leading": true,
          "trailing": false
        })
      };
      message = {
        "cmd": "subscribe",
        "routing_key": routingKey
      };
      this.subscriptions[routingKey] = subscription;
      this.sendMessage(message);
      return scope.$on("$destroy", (function(_this) {
        return function() {
          return _this.unsubscribe(routingKey);
        };
      })(this));
    };

    EventsService.prototype.unsubscribe = function(routingKey) {
      var message;
      if (this.error) {
        return;
      }
      this.log.debug("Unsubscribe from: " + routingKey);
      message = {
        "cmd": "unsubscribe",
        "routing_key": routingKey
      };
      return this.sendMessage(message);
    };

    EventsService.prototype.onOpen = function() {
      var message, token;
      this.connected = true;
      this.log.debug("WebSocket connection opened");
      token = this.auth.getToken();
      message = {
        cmd: "auth",
        data: {
          token: token,
          sessionId: this.sessionId
        }
      };
      return this.sendMessage(message);
    };

    EventsService.prototype.onMessage = function(event) {
      var data, routingKey, subscription;
      this.log.debug("WebSocket message received: " + event.data);
      data = JSON.parse(event.data);
      routingKey = data.routing_key;
      if (this.subscriptions[routingKey] == null) {
        return;
      }
      subscription = this.subscriptions[routingKey];
      return subscription.scope.$apply(function() {
        return subscription.callback(data.data);
      });
    };

    EventsService.prototype.onError = function(error) {
      this.log.error("WebSocket error: " + error);
      return this.error = true;
    };

    EventsService.prototype.onClose = function() {
      this.log.debug("WebSocket closed.");
      return this.connected = false;
    };

    return EventsService;

  })();

  EventsProvider = (function() {
    function EventsProvider() {}

    EventsProvider.prototype.setSessionId = function(sessionId) {
      return this.sessionId = sessionId;
    };

    EventsProvider.prototype.$get = function($win, $log, $conf, $auth) {
      var service;
      service = new EventsService($win, $log, $conf, $auth);
      service.initialize(this.sessionId);
      return service;
    };

    EventsProvider.prototype.$get.$inject = ["$window", "$log", "$tgConfig", "$tgAuth"];

    return EventsProvider;

  })();

  module.provider("$tgEvents", EventsProvider);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/feedback.coffee
 */

(function() {
  var FeedbackDirective, bindOnce, debounce, groupBy, mixOf, module, taiga, trim;

  taiga = this.taiga;

  groupBy = this.taiga.groupBy;

  bindOnce = this.taiga.bindOnce;

  mixOf = this.taiga.mixOf;

  debounce = this.taiga.debounce;

  trim = this.taiga.trim;

  module = angular.module("taigaFeedback", []);

  FeedbackDirective = function($lightboxService, $repo, $confirm, $loading, feedbackService) {
    var directive, link;
    link = function($scope, $el, $attrs) {
      var form, openLightbox, submit, submitButton;
      form = $el.find("form").checksley();
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var promise;
          event.preventDefault();
          if (!form.validate()) {
            return;
          }
          $loading.start(submitButton);
          promise = $repo.create("feedback", $scope.feedback);
          promise.then(function(data) {
            $loading.finish(submitButton);
            $lightboxService.close($el);
            return $confirm.notify("success", "\\o/ we'll be happy to read your");
          });
          return promise.then(null, function() {
            $loading.finish(submitButton);
            return $confirm.notify("error");
          });
        };
      })(this));
      submitButton = $el.find(".submit-button");
      $el.on("submit", "form", submit);
      openLightbox = function() {
        $scope.feedback = {};
        $lightboxService.open($el);
        return $el.find("textarea").focus();
      };
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      return openLightbox();
    };
    directive = {
      link: link,
      templateUrl: "common/lightbox-feedback.html",
      scope: {}
    };
    return directive;
  };

  module.directive("tgLbFeedback", ["lightboxService", "$tgRepo", "$tgConfirm", "$tgLoading", "tgFeedbackService", FeedbackDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/integrations.coffee
 */

(function() {
  var module;

  module = angular.module("taigaIntegrations", []);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/issues.coffee
 */

(function() {
  var module;

  module = angular.module("taigaIssues", []);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/kanban.coffee
 */

(function() {
  var module;

  module = angular.module("taigaKanban", []);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/projects.coffee
 */

(function() {
  var module;

  module = angular.module("taigaProject", []);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/related-tasks.coffee
 */

(function() {
  var RelatedTaskAssignedToInlineEditionDirective, RelatedTaskCreateButtonDirective, RelatedTaskCreateFormDirective, RelatedTaskRowDirective, RelatedTasksDirective, debounce, module, taiga, trim;

  taiga = this.taiga;

  trim = this.taiga.trim;

  debounce = this.taiga.debounce;

  module = angular.module("taigaRelatedTasks", []);

  RelatedTaskRowDirective = function($repo, $compile, $confirm, $rootscope, $loading, $template, $translate) {
    var link, templateEdit, templateView;
    templateView = $template.get("task/related-task-row.html", true);
    templateEdit = $template.get("task/related-task-row-edit.html", true);
    link = function($scope, $el, $attrs, $model) {
      var renderEdit, renderView, saveTask;
      saveTask = debounce(2000, function(task) {
        var promise;
        task.subject = $el.find('input').val();
        $loading.start($el.find('.task-name'));
        promise = $repo.save(task);
        promise.then((function(_this) {
          return function() {
            $loading.finish($el.find('.task-name'));
            $confirm.notify("success");
            return $rootscope.$broadcast("related-tasks:update");
          };
        })(this));
        promise.then(null, (function(_this) {
          return function() {
            $loading.finish($el.find('.task-name'));
            $el.find('input').val(task.subject);
            return $confirm.notify("error");
          };
        })(this));
        return promise;
      });
      renderEdit = function(task) {
        $el.html($compile(templateEdit({
          task: task
        }))($scope));
        $el.on("keyup", "input", function(event) {
          if (event.keyCode === 13) {
            return saveTask($model.$modelValue).then(function() {
              return renderView($model.$modelValue);
            });
          } else if (event.keyCode === 27) {
            return renderView($model.$modelValue);
          }
        });
        $el.on("click", ".icon-floppy", function(event) {
          return saveTask($model.$modelValue).then(function() {
            return renderView($model.$modelValue);
          });
        });
        return $el.on("click", ".cancel-edit", function(event) {
          return renderView($model.$modelValue);
        });
      };
      renderView = function(task) {
        var perms;
        $el.off();
        perms = {
          modify_task: $scope.project.my_permissions.indexOf("modify_task") !== -1,
          delete_task: $scope.project.my_permissions.indexOf("delete_task") !== -1
        };
        $el.html($compile(templateView({
          task: task,
          perms: perms
        }))($scope));
        $el.on("click", ".icon-edit", function() {
          renderEdit($model.$modelValue);
          return $el.find('input').focus().select();
        });
        return $el.on("click", ".delete-task", function(event) {
          var message, title;
          title = $translate.instant("TASK.TITLE_DELETE_ACTION");
          task = $model.$modelValue;
          message = task.subject;
          return $confirm.askOnDelete(title, message).then(function(finish) {
            var promise;
            promise = $repo.remove(task);
            promise.then(function() {
              finish();
              $confirm.notify("success");
              return $scope.$emit("related-tasks:delete");
            });
            return promise.then(null, function() {
              return $confirm.notify("error");
            });
          });
        });
      };
      $scope.$watch($attrs.ngModel, function(val) {
        if (!val) {
          return;
        }
        return renderView(val);
      });
      $scope.$on("related-tasks:assigned-to-changed", function() {
        return $rootscope.$broadcast("related-tasks:update");
      });
      $scope.$on("related-tasks:status-changed", function() {
        return $rootscope.$broadcast("related-tasks:update");
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      require: "ngModel"
    };
  };

  module.directive("tgRelatedTaskRow", ["$tgRepo", "$compile", "$tgConfirm", "$rootScope", "$tgLoading", "$tgTemplate", "$translate", RelatedTaskRowDirective]);

  RelatedTaskCreateFormDirective = function($repo, $compile, $confirm, $tgmodel, $loading, $analytics, $template) {
    var link, newTask, template;
    template = $template.get("task/related-task-create-form.html", true);
    newTask = {
      subject: "",
      assigned_to: null
    };
    link = function($scope, $el, $attrs) {
      var createTask, render;
      createTask = debounce(2000, function(task) {
        var promise;
        task.subject = $el.find('input').val();
        task.assigned_to = $scope.newTask.assigned_to;
        task.status = $scope.newTask.status;
        $scope.newTask.status = $scope.project.default_task_status;
        $scope.newTask.assigned_to = null;
        $loading.start($el.find('.task-name'));
        promise = $repo.create("tasks", task);
        promise.then(function() {
          $analytics.trackEvent("task", "create", "create task on userstory", 1);
          $loading.finish($el.find('.task-name'));
          $scope.$emit("related-tasks:add");
          return $confirm.notify("success");
        });
        promise.then(null, function() {
          $el.find('input').val(task.subject);
          $loading.finish($el.find('.task-name'));
          return $confirm.notify("error");
        });
        return promise;
      });
      render = function() {
        $el.off();
        $el.html($compile(template())($scope));
        $el.find('input').focus().select();
        $el.addClass('active');
        $el.on("keyup", "input", function(event) {
          if (event.keyCode === 13) {
            return createTask(newTask).then(function() {
              return render();
            });
          } else if (event.keyCode === 27) {
            return $el.html("");
          }
        });
        $el.on("click", ".icon-delete", function(event) {
          return $el.html("");
        });
        return $el.on("click", ".icon-floppy", function(event) {
          return createTask(newTask).then(function() {
            return $el.html("");
          });
        });
      };
      taiga.bindOnce($scope, "us", function(val) {
        newTask["status"] = $scope.project.default_task_status;
        newTask["project"] = $scope.project.id;
        newTask["user_story"] = $scope.us.id;
        $scope.newTask = $tgmodel.make_model("tasks", newTask);
        return $el.html("");
      });
      $scope.$on("related-tasks:show-form", function() {
        return render();
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgRelatedTaskCreateForm", ["$tgRepo", "$compile", "$tgConfirm", "$tgModel", "$tgLoading", "$tgAnalytics", "$tgTemplate", RelatedTaskCreateFormDirective]);

  RelatedTaskCreateButtonDirective = function($repo, $compile, $confirm, $tgmodel) {
    var link, template;
    template = _.template("<a class=\"icon icon-plus related-tasks-buttons\"></a>");
    link = function($scope, $el, $attrs) {
      $scope.$watch("project", function(val) {
        if (!val) {
          return;
        }
        $el.off();
        if ($scope.project.my_permissions.indexOf("add_task") !== -1) {
          $el.html(template());
        } else {
          $el.html("");
        }
        return $el.on("click", ".icon", function(event) {
          return $scope.$emit("related-tasks:add-new-clicked");
        });
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgRelatedTaskCreateButton", ["$tgRepo", "$compile", "$tgConfirm", "$tgModel", RelatedTaskCreateButtonDirective]);

  RelatedTasksDirective = function($repo, $rs, $rootscope) {
    var link;
    link = function($scope, $el, $attrs) {
      var loadTasks;
      loadTasks = function() {
        return $rs.tasks.list($scope.projectId, null, $scope.usId).then((function(_this) {
          return function(tasks) {
            $scope.tasks = _.sortBy(tasks, 'ref');
            return tasks;
          };
        })(this));
      };
      $scope.$on("related-tasks:add", function() {
        return loadTasks().then(function() {
          return $rootscope.$broadcast("related-tasks:update");
        });
      });
      $scope.$on("related-tasks:delete", function() {
        return loadTasks().then(function() {
          return $rootscope.$broadcast("related-tasks:update");
        });
      });
      $scope.$on("related-tasks:add-new-clicked", function() {
        return $scope.$broadcast("related-tasks:show-form");
      });
      taiga.bindOnce($scope, "us", function(val) {
        return loadTasks();
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgRelatedTasks", ["$tgRepo", "$tgResources", "$rootScope", RelatedTasksDirective]);

  RelatedTaskAssignedToInlineEditionDirective = function($repo, $rootscope, popoverService) {
    var link, template;
    template = _.template("<img src=\"<%- imgurl %>\" alt=\"<%- name %>\"/>\n<figcaption><%- name %></figcaption>");
    link = function($scope, $el, $attrs) {
      var $ctrl, autoSave, notAutoSave, task, updateRelatedTask;
      updateRelatedTask = function(task) {
        var ctx, member;
        ctx = {
          name: "Unassigned",
          imgurl: "/images/unnamed.png"
        };
        member = $scope.usersById[task.assigned_to];
        if (member) {
          ctx.imgurl = member.photo;
          ctx.name = member.full_name_display;
        }
        $el.find(".avatar").html(template(ctx));
        return $el.find(".task-assignedto").attr('title', ctx.name);
      };
      $ctrl = $el.controller();
      task = $scope.$eval($attrs.tgRelatedTaskAssignedToInlineEdition);
      notAutoSave = $scope.$eval($attrs.notAutoSave);
      autoSave = !notAutoSave;
      updateRelatedTask(task);
      $el.on("click", ".task-assignedto", function(event) {
        return $rootscope.$broadcast("assigned-to:add", task);
      });
      taiga.bindOnce($scope, "project", function(project) {
        if (project.my_permissions.indexOf("modify_task") === -1) {
          $el.unbind("click");
          return $el.find("a").addClass("not-clickable");
        }
      });
      $scope.$on("assigned-to:added", debounce(2000, (function(_this) {
        return function(ctx, userId, updatedRelatedTask) {
          if (updatedRelatedTask.id === task.id) {
            updatedRelatedTask.assigned_to = userId;
            if (autoSave) {
              $repo.save(updatedRelatedTask).then(function() {
                return $scope.$emit("related-tasks:assigned-to-changed");
              });
            }
            return updateRelatedTask(updatedRelatedTask);
          }
        };
      })(this)));
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgRelatedTaskAssignedToInlineEdition", ["$tgRepo", "$rootScope", RelatedTaskAssignedToInlineEditionDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources.coffee
 */

(function() {
  var ResourcesService, initResources, initUrls, module, taiga, urls,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  ResourcesService = (function(superClass) {
    extend(ResourcesService, superClass);

    function ResourcesService() {
      return ResourcesService.__super__.constructor.apply(this, arguments);
    }

    return ResourcesService;

  })(taiga.Service);

  urls = {
    "auth": "/auth",
    "auth-register": "/auth/register",
    "invitations": "/invitations",
    "users": "/users",
    "by_username": "/users/by_username",
    "users-password-recovery": "/users/password_recovery",
    "users-change-password-from-recovery": "/users/change_password_from_recovery",
    "users-change-password": "/users/change_password",
    "users-change-email": "/users/change_email",
    "users-cancel-account": "/users/cancel",
    "contacts": "/users/%s/contacts",
    "stats": "/users/%s/stats",
    "permissions": "/permissions",
    "notify-policies": "/notify-policies",
    "user-storage": "/user-storage",
    "memberships": "/memberships",
    "bulk-create-memberships": "/memberships/bulk_create",
    "roles": "/roles",
    "permissions": "/permissions",
    "resolver": "/resolver",
    "projects": "/projects",
    "project-templates": "/project-templates",
    "project-modules": "/projects/%s/modules",
    "bulk-update-projects-order": "/projects/bulk_update_order",
    "userstory-statuses": "/userstory-statuses",
    "points": "/points",
    "task-statuses": "/task-statuses",
    "issue-statuses": "/issue-statuses",
    "issue-types": "/issue-types",
    "priorities": "/priorities",
    "severities": "/severities",
    "milestones": "/milestones",
    "userstories": "/userstories",
    "bulk-create-us": "/userstories/bulk_create",
    "bulk-update-us-backlog-order": "/userstories/bulk_update_backlog_order",
    "bulk-update-us-sprint-order": "/userstories/bulk_update_sprint_order",
    "bulk-update-us-kanban-order": "/userstories/bulk_update_kanban_order",
    "tasks": "/tasks",
    "bulk-create-tasks": "/tasks/bulk_create",
    "bulk-update-task-taskboard-order": "/tasks/bulk_update_taskboard_order",
    "issues": "/issues",
    "bulk-create-issues": "/issues/bulk_create",
    "wiki": "/wiki",
    "wiki-restore": "/wiki/%s/restore",
    "wiki-links": "/wiki-links",
    "history/us": "/history/userstory",
    "history/issue": "/history/issue",
    "history/task": "/history/task",
    "history/wiki": "/history/wiki",
    "attachments/us": "/userstories/attachments",
    "attachments/issue": "/issues/attachments",
    "attachments/task": "/tasks/attachments",
    "attachments/wiki_page": "/wiki/attachments",
    "custom-attributes/userstory": "/userstory-custom-attributes",
    "custom-attributes/issue": "/issue-custom-attributes",
    "custom-attributes/task": "/task-custom-attributes",
    "custom-attributes-values/userstory": "/userstories/custom-attributes-values",
    "custom-attributes-values/issue": "/issues/custom-attributes-values",
    "custom-attributes-values/task": "/tasks/custom-attributes-values",
    "webhooks": "/webhooks",
    "webhooks-test": "/webhooks/%s/test",
    "webhooklogs": "/webhooklogs",
    "webhooklogs-resend": "/webhooklogs/%s/resend",
    "userstories-csv": "/userstories/csv?uuid=%s",
    "tasks-csv": "/tasks/csv?uuid=%s",
    "issues-csv": "/issues/csv?uuid=%s",
    "timeline-profile": "/timeline/profile",
    "timeline-user": "/timeline/user",
    "timeline-project": "/timeline/project",
    "search": "/search",
    "exporter": "/exporter",
    "importer": "/importer/load_dump",
    "feedback": "/feedback",
    "locales": "/locales"
  };

  initUrls = function($log, $urls) {
    $log.debug("Initialize api urls");
    return $urls.update(urls);
  };

  initResources = function($log, $rs) {
    var i, len, provider, providers, results;
    $log.debug("Initialize resources");
    providers = _.toArray(arguments).slice(2);
    results = [];
    for (i = 0, len = providers.length; i < len; i++) {
      provider = providers[i];
      results.push(provider($rs));
    }
    return results;
  };

  module = angular.module("taigaResources", ["taigaBase"]);

  module.service("$tgResources", ResourcesService);

  module.run(["$log", "$tgUrls", initUrls]);

  module.run(["$log", "$tgResources", "$tgProjectsResourcesProvider", "$tgCustomAttributesResourcesProvider", "$tgCustomAttributesValuesResourcesProvider", "$tgMembershipsResourcesProvider", "$tgNotifyPoliciesResourcesProvider", "$tgInvitationsResourcesProvider", "$tgRolesResourcesProvider", "$tgUserSettingsResourcesProvider", "$tgSprintsResourcesProvider", "$tgUserstoriesResourcesProvider", "$tgTasksResourcesProvider", "$tgIssuesResourcesProvider", "$tgWikiResourcesProvider", "$tgSearchResourcesProvider", "$tgAttachmentsResourcesProvider", "$tgMdRenderResourcesProvider", "$tgHistoryResourcesProvider", "$tgKanbanResourcesProvider", "$tgModulesResourcesProvider", "$tgWebhooksResourcesProvider", "$tgWebhookLogsResourcesProvider", "$tgLocalesResourcesProvider", "$tgUsersResourcesProvider", initResources]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/search.coffee
 */

(function() {
  var SearchBoxDirective, SearchController, SearchDirective, bindOnce, debounce, debounceLeading, groupBy, mixOf, module, taiga, trim,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  groupBy = this.taiga.groupBy;

  bindOnce = this.taiga.bindOnce;

  mixOf = this.taiga.mixOf;

  debounceLeading = this.taiga.debounceLeading;

  trim = this.taiga.trim;

  debounce = this.taiga.debounce;

  module = angular.module("taigaSearch", []);

  SearchController = (function(superClass) {
    extend(SearchController, superClass);

    SearchController.$inject = ["$scope", "$tgRepo", "$tgResources", "$routeParams", "$q", "$tgLocation", "tgAppMetaService", "$tgNavUrls", "$translate"];

    function SearchController(scope1, repo, rs, params, q, location, appMetaService, navUrls, translate) {
      var loadSearchData, promise;
      this.scope = scope1;
      this.repo = repo;
      this.rs = rs;
      this.params = params;
      this.q = q;
      this.location = location;
      this.appMetaService = appMetaService;
      this.navUrls = navUrls;
      this.translate = translate;
      this.scope.sectionName = "Search";
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          var description, title;
          title = _this.translate.instant("SEARCH.PAGE_TITLE", {
            projectName: _this.scope.project.name
          });
          description = _this.translate.instant("SEARCH.PAGE_DESCRIPTION", {
            projectName: _this.scope.project.name,
            projectDescription: _this.scope.project.description
          });
          return _this.appMetaService.setAll(title, description);
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
      this.scope.searchTerm = "";
      loadSearchData = debounceLeading(100, (function(_this) {
        return function(t) {
          return _this.loadSearchData(t);
        };
      })(this));
      this.scope.$watch("searchTerm", (function(_this) {
        return function(term) {
          if (term) {
            _this.scope.loading = true;
            return _this.loadSearchData(term).then(function() {
              return _this.scope.loading = false;
            });
          }
        };
      })(this));
    }

    SearchController.prototype.loadFilters = function() {
      var defered;
      defered = this.q.defer();
      defered.resolve();
      return defered.promise;
    };

    SearchController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          _this.scope.project = project;
          _this.scope.$emit('project:loaded', project);
          _this.scope.issueStatusById = groupBy(project.issue_statuses, function(x) {
            return x.id;
          });
          _this.scope.taskStatusById = groupBy(project.task_statuses, function(x) {
            return x.id;
          });
          _this.scope.severityById = groupBy(project.severities, function(x) {
            return x.id;
          });
          _this.scope.priorityById = groupBy(project.priorities, function(x) {
            return x.id;
          });
          _this.scope.usStatusById = groupBy(project.us_statuses, function(x) {
            return x.id;
          });
          return project;
        };
      })(this));
    };

    SearchController.prototype.loadSearchData = function(term) {
      var promise;
      promise = this.rs.search["do"](this.scope.projectId, term).then((function(_this) {
        return function(data) {
          _this.scope.searchResults = data;
          return data;
        };
      })(this));
      return promise;
    };

    SearchController.prototype.loadInitialData = function() {
      return this.loadProject().then((function(_this) {
        return function(project) {
          _this.scope.projectId = project.id;
          return _this.fillUsersAndRoles(project.members, project.roles);
        };
      })(this));
    };

    return SearchController;

  })(mixOf(taiga.Controller, taiga.PageMixin));

  module.controller("SearchController", SearchController);

  SearchBoxDirective = function(projectService, $lightboxService, $navurls, $location, $route) {
    var link;
    link = function($scope, $el, $attrs) {
      var openLightbox, project, submit;
      project = null;
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var form, text, url;
          event.preventDefault();
          form = $el.find("form").checksley();
          if (!form.validate()) {
            return;
          }
          text = $el.find("#search-text").val();
          url = $navurls.resolve("project-search", {
            project: project.get("slug")
          });
          return $scope.$apply(function() {
            $lightboxService.close($el);
            $location.path(url);
            $location.search("text", text).path(url);
            return $route.reload();
          });
        };
      })(this));
      openLightbox = function() {
        project = projectService.project;
        return $lightboxService.open($el).then(function() {
          return $el.find("#search-text").focus();
        });
      };
      $el.on("submit", "form", submit);
      return openLightbox();
    };
    return {
      templateUrl: "search/lightbox-search.html",
      link: link
    };
  };

  SearchBoxDirective.$inject = ["tgProjectService", "lightboxService", "$tgNavUrls", "$tgLocation", "$route"];

  module.directive("tgSearchBox", SearchBoxDirective);

  SearchDirective = function($log, $compile, $templatecache, $routeparams, $location) {
    var link, linkTable;
    linkTable = function($scope, $el, $attrs, $ctrl) {
      var getActiveSection, lastSeatchResults, markSectionTabActive, renderFilterTabs, renderTableContent, tabsDom, templates;
      tabsDom = $el.find("section.search-filter");
      lastSeatchResults = null;
      getActiveSection = function(data) {
        var i, len, maxVal, name, ref, selectedSectionData, selectedSectionName, value;
        maxVal = 0;
        selectedSectionName = null;
        selectedSectionData = null;
        if (data) {
          ref = ["userstories", "issues", "tasks", "wikipages"];
          for (i = 0, len = ref.length; i < len; i++) {
            name = ref[i];
            value = data[name];
            if (value.length > maxVal) {
              maxVal = value.length;
              selectedSectionName = name;
              selectedSectionData = value;
              break;
            }
          }
        }
        if (maxVal === 0) {
          return {
            name: "userstories",
            value: []
          };
        }
        return {
          name: selectedSectionName,
          value: selectedSectionData
        };
      };
      renderFilterTabs = function(data) {
        var name, results, value;
        results = [];
        for (name in data) {
          value = data[name];
          if (name === "count") {
            continue;
          }
          results.push(tabsDom.find("li." + name + " .num").html(value.length));
        }
        return results;
      };
      markSectionTabActive = function(section) {
        tabsDom.find("a.active").removeClass("active");
        return tabsDom.find("li." + section.name + " a").addClass("active");
      };
      templates = {
        issues: $templatecache.get("search-issues"),
        tasks: $templatecache.get("search-tasks"),
        userstories: $templatecache.get("search-userstories"),
        wikipages: $templatecache.get("search-wikipages")
      };
      renderTableContent = function(section) {
        var element, oldElements, oldScope, scope, template;
        oldElements = $el.find(".search-result-table").children();
        oldScope = oldElements.scope();
        if (oldScope) {
          oldScope.$destroy();
          oldElements.remove();
        }
        scope = $scope.$new();
        scope[section.name] = section.value;
        template = angular.element.parseHTML(trim(templates[section.name]));
        element = $compile(template)(scope);
        return $el.find(".search-result-table").html(element);
      };
      $scope.$watch("searchResults", function(data) {
        var activeSection;
        lastSeatchResults = data;
        activeSection = getActiveSection(data);
        renderFilterTabs(data);
        renderTableContent(activeSection);
        return markSectionTabActive(activeSection);
      });
      $scope.$watch("searchTerm", function(searchTerm) {
        if (searchTerm) {
          return $location.search("text", searchTerm);
        }
      });
      return $el.on("click", ".search-filter li > a", function(event) {
        var section, sectionData, sectionName, target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        sectionName = target.parent().data("name");
        sectionData = lastSeatchResults[sectionName];
        section = {
          name: sectionName,
          value: sectionData
        };
        return $scope.$apply(function() {
          renderTableContent(section);
          return markSectionTabActive(section);
        });
      });
    };
    link = function($scope, $el, $attrs) {
      var $ctrl, searchText;
      $ctrl = $el.controller();
      linkTable($scope, $el, $attrs, $ctrl);
      searchText = $routeparams.text;
      return $scope.$watch("projectId", function(projectId) {
        if (projectId != null) {
          return $scope.searchTerm = searchText;
        }
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgSearch", ["$log", "$compile", "$templateCache", "$routeParams", "$tgLocation", SearchDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/taskboard.coffee
 */

(function() {
  var module;

  module = angular.module("taigaTaskboard", []);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/tasks.coffee
 */

(function() {
  var module;

  module = angular.module("taigaTasks", []);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/team.coffee
 */

(function() {
  var module;

  module = angular.module("taigaTeam", []);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/user-settings.coffee
 */

(function() {
  var module;

  module = angular.module("taigaUserSettings", []);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/userstories.coffee
 */

(function() {
  var module;

  module = angular.module("taigaUserStories", []);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/wiki.coffee
 */

(function() {
  var module;

  module = angular.module("taigaWiki", []);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common/analytics.coffee
 */

(function() {
  var AnalyticsService, module, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  module = angular.module("taigaCommon");

  AnalyticsService = (function(superClass) {
    extend(AnalyticsService, superClass);

    AnalyticsService.$inject = ["$rootScope", "$log", "$tgConfig", "$window", "$document", "$location"];

    function AnalyticsService(rootscope, log, config, win, doc, location) {
      var conf;
      this.rootscope = rootscope;
      this.log = log;
      this.config = config;
      this.win = win;
      this.doc = doc;
      this.location = location;
      this.initialized = false;
      conf = this.config.get("analytics", {});
      this.accountId = conf.accountId;
      this.pageEvent = conf.pageEvent || "$routeChangeSuccess";
      this.trackRoutes = conf.trackRoutes || true;
      this.ignoreFirstPageLoad = conf.ignoreFirstPageLoad || false;
    }

    AnalyticsService.prototype.initialize = function() {
      if (!this.accountId) {
        this.log.debug("Analytics: no acount id provided. Disabling.");
        return;
      }
      this.injectAnalytics();
      this.win.ga("create", this.accountId, "auto");
      this.win.ga("require", "displayfeatures");
      if (this.trackRoutes && (!this.ignoreFirstPageLoad)) {
        this.win.ga("send", "pageview", this.getUrl());
      }
      if (this.trackRoutes) {
        this.rootscope.$on(this.pageEvent, (function(_this) {
          return function() {
            return _this.trackPage(_this.getUrl(), "Taiga");
          };
        })(this));
      }
      return this.initialized = true;
    };

    AnalyticsService.prototype.getUrl = function() {
      return this.location.path();
    };

    AnalyticsService.prototype.injectAnalytics = function() {
      var fn;
      fn = (function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);});
      return fn(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");
    };

    AnalyticsService.prototype.trackPage = function(url, title) {
      if (!this.initialized) {
        return;
      }
      if (!this.win.ga) {
        return;
      }
      title = title || this.doc[0].title;
      return this.win.ga("send", "pageview", {
        "page": url,
        "title": title
      });
    };

    AnalyticsService.prototype.trackEvent = function(category, action, label, value) {
      if (!this.initialized) {
        return;
      }
      if (!this.win.ga) {
        return;
      }
      return this.win.ga("send", "event", category, action, label, value);
    };

    return AnalyticsService;

  })(taiga.Service);

  module.service("$tgAnalytics", AnalyticsService);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common/attachments.coffee
 */

(function() {
  var AttachmentDirective, AttachmentsController, AttachmentsDirective, bindMethods, bindOnce, module, sizeFormat, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  sizeFormat = this.taiga.sizeFormat;

  bindOnce = this.taiga.bindOnce;

  bindMethods = this.taiga.bindMethods;

  module = angular.module("taigaCommon");

  AttachmentsController = (function(superClass) {
    extend(AttachmentsController, superClass);

    AttachmentsController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgResources", "$tgConfirm", "$q", "$translate"];

    function AttachmentsController(scope, rootscope, repo, rs, confirm, q, translate) {
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.rs = rs;
      this.confirm = confirm;
      this.q = q;
      this.translate = translate;
      bindMethods(this);
      this.type = null;
      this.objectId = null;
      this.projectId = null;
      this.uploadingAttachments = [];
      this.attachments = [];
      this.attachmentsCount = 0;
      this.deprecatedAttachmentsCount = 0;
      this.showDeprecated = false;
    }

    AttachmentsController.prototype.initialize = function(type, objectId) {
      this.type = type;
      this.objectId = objectId;
      return this.projectId = this.scope.projectId;
    };

    AttachmentsController.prototype.loadAttachments = function() {
      var urlname;
      if (!this.objectId) {
        return this.attachments;
      }
      urlname = "attachments/" + this.type;
      return this.rs.attachments.list(urlname, this.objectId, this.projectId).then((function(_this) {
        return function(attachments) {
          _this.attachments = _.sortBy(attachments, "order");
          _this.updateCounters();
          return attachments;
        };
      })(this));
    };

    AttachmentsController.prototype.updateCounters = function() {
      this.attachmentsCount = this.attachments.length;
      return this.deprecatedAttachmentsCount = _.filter(this.attachments, {
        is_deprecated: true
      }).length;
    };

    AttachmentsController.prototype._createAttachment = function(attachment) {
      var promise, urlName;
      urlName = "attachments/" + this.type;
      promise = this.rs.attachments.create(urlName, this.projectId, this.objectId, attachment);
      promise = promise.then((function(_this) {
        return function(data) {
          var index;
          data.isCreatedRightNow = true;
          index = _this.uploadingAttachments.indexOf(attachment);
          _this.uploadingAttachments.splice(index, 1);
          _this.attachments.push(data);
          return _this.rootscope.$broadcast("attachment:create");
        };
      })(this));
      promise = promise.then(null, (function(_this) {
        return function(data) {
          var index, message;
          if (data.status === 413) {
            _this.scope.$emit("attachments:size-error");
          }
          index = _this.uploadingAttachments.indexOf(attachment);
          _this.uploadingAttachments.splice(index, 1);
          message = _this.translate.instant("ATTACHMENT.ERROR_UPLOAD_ATTACHMENT", {
            fileName: attachment.name,
            errorMessage: data.data._error_message
          });
          _this.confirm.notify("error", message);
          return _this.q.reject(data);
        };
      })(this));
      return promise;
    };

    AttachmentsController.prototype.createAttachments = function(attachments) {
      var promises;
      promises = _.map(attachments, (function(_this) {
        return function(x) {
          return _this._createAttachment(x);
        };
      })(this));
      return this.q.all(promises).then((function(_this) {
        return function() {
          return _this.updateCounters();
        };
      })(this));
    };

    AttachmentsController.prototype.addUploadingAttachments = function(attachments) {
      return this.uploadingAttachments = _.union(this.uploadingAttachments, attachments);
    };

    AttachmentsController.prototype.reorderAttachment = function(attachment, newIndex) {
      var oldIndex;
      oldIndex = this.attachments.indexOf(attachment);
      if (oldIndex === newIndex) {
        return;
      }
      this.attachments.splice(oldIndex, 1);
      this.attachments.splice(newIndex, 0, attachment);
      return _.each(this.attachments, function(x, i) {
        return x.order = i + 1;
      });
    };

    AttachmentsController.prototype.updateAttachment = function(attachment) {
      var onError, onSuccess;
      onSuccess = (function(_this) {
        return function() {
          _this.updateCounters();
          return _this.rootscope.$broadcast("attachment:edit");
        };
      })(this);
      onError = (function(_this) {
        return function(response) {
          if (response.status === 413) {
            $scope.$emit("attachments:size-error");
          }
          _this.confirm.notify("error");
          return _this.q.reject();
        };
      })(this);
      return this.repo.save(attachment).then(onSuccess, onError);
    };

    AttachmentsController.prototype.saveAttachments = function() {
      return this.repo.saveAll(this.attachments).then(null, (function(_this) {
        return function() {
          var item, j, len, ref;
          ref = _this.attachments;
          for (j = 0, len = ref.length; j < len; j++) {
            item = ref[j];
            item.revert();
          }
          return _this.attachments = _.sortBy(_this.attachments, "order");
        };
      })(this));
    };

    AttachmentsController.prototype.removeAttachment = function(attachment) {
      var message, title;
      title = this.translate.instant("ATTACHMENT.TITLE_LIGHTBOX_DELETE_ATTACHMENT");
      message = this.translate.instant("ATTACHMENT.MSG_LIGHTBOX_DELETE_ATTACHMENT", {
        fileName: attachment.name
      });
      return this.confirm.askOnDelete(title, message).then((function(_this) {
        return function(finish) {
          var onError, onSuccess;
          onSuccess = function() {
            var index;
            finish();
            index = _this.attachments.indexOf(attachment);
            _this.attachments.splice(index, 1);
            _this.updateCounters();
            return _this.rootscope.$broadcast("attachment:delete");
          };
          onError = function() {
            finish(false);
            message = _this.translate.instant("ATTACHMENT.ERROR_DELETE_ATTACHMENT", {
              errorMessage: message
            });
            _this.confirm.notify("error", null, message);
            return _this.q.reject();
          };
          return _this.repo.remove(attachment).then(onSuccess, onError);
        };
      })(this));
    };

    AttachmentsController.prototype.filterAttachments = function(item) {
      if (this.showDeprecated) {
        return true;
      }
      return !item.is_deprecated;
    };

    return AttachmentsController;

  })(taiga.Controller);

  AttachmentsDirective = function($config, $confirm, $templates, $translate) {
    var link, template, templateFn;
    template = $templates.get("attachment/attachments.html", true);
    link = function($scope, $el, $attrs, $ctrls) {
      var $ctrl, $model, showSizeInfo, tdom;
      $ctrl = $ctrls[0];
      $model = $ctrls[1];
      bindOnce($scope, $attrs.ngModel, function(value) {
        $ctrl.initialize($attrs.type, value.id);
        return $ctrl.loadAttachments();
      });
      tdom = $el.find("div.attachment-body.sortable");
      tdom.sortable({
        items: "div.single-attachment",
        handle: "a.settings.icon.icon-drag-v",
        containment: ".attachments",
        dropOnEmpty: true,
        scroll: false,
        tolerance: "pointer",
        placeholder: "sortable-placeholder single-attachment"
      });
      tdom.on("sortstop", function(event, ui) {
        var attachment, newIndex;
        attachment = ui.item.scope().attach;
        newIndex = ui.item.index();
        $ctrl.reorderAttachment(attachment, newIndex);
        return $ctrl.saveAttachments().then(function() {
          return $scope.$emit("attachment:edit");
        });
      });
      showSizeInfo = function() {
        return $el.find(".size-info").removeClass("hidden");
      };
      $scope.$on("attachments:size-error", function() {
        return showSizeInfo();
      });
      $el.on("change", ".attachments-header input", function(event) {
        var files;
        files = _.toArray(event.target.files);
        if (files.length < 1) {
          return;
        }
        return $scope.$apply(function() {
          $ctrl.addUploadingAttachments(files);
          return $ctrl.createAttachments(files);
        });
      });
      $el.on("click", ".more-attachments", function(event) {
        var target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        $scope.$apply(function() {
          return $ctrl.showDeprecated = !$ctrl.showDeprecated;
        });
        target.find("span.text").addClass("hidden");
        if ($ctrl.showDeprecated) {
          target.find("span[data-type=hide]").removeClass("hidden");
          return target.find("more-attachments-num").addClass("hidden");
        } else {
          target.find("span[data-type=show]").removeClass("hidden");
          return target.find("more-attachments-num").removeClass("hidden");
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    templateFn = function($el, $attrs) {
      var ctx, maxFileSize, maxFileSizeMsg;
      maxFileSize = $config.get("maxUploadFileSize", null);
      if (maxFileSize) {
        maxFileSize = sizeFormat(maxFileSize);
      }
      maxFileSizeMsg = maxFileSize ? $translate.instant("ATTACHMENT.MAX_UPLOAD_SIZE", {
        maxFileSize: maxFileSize
      }) : "";
      ctx = {
        type: $attrs.type,
        maxFileSize: maxFileSize,
        maxFileSizeMsg: maxFileSizeMsg
      };
      return template(ctx);
    };
    return {
      require: ["tgAttachments", "ngModel"],
      controller: AttachmentsController,
      controllerAs: "ctrl",
      restrict: "AE",
      scope: true,
      link: link,
      template: templateFn
    };
  };

  module.directive("tgAttachments", ["$tgConfig", "$tgConfirm", "$tgTemplate", "$translate", AttachmentsDirective]);

  AttachmentDirective = function($template, $compile, $translate) {
    var link, template, templateEdit;
    template = $template.get("attachment/attachment.html", true);
    templateEdit = $template.get("attachment/attachment-edit.html", true);
    link = function($scope, $el, $attrs, $ctrl) {
      var attachment, render, saveAttachment;
      render = function(attachment, edit) {
        var ctx, html, modifyPermission, permissions;
        if (edit == null) {
          edit = false;
        }
        permissions = $scope.project.my_permissions;
        modifyPermission = permissions.indexOf("modify_" + $ctrl.type) > -1;
        ctx = {
          id: attachment.id,
          name: attachment.name,
          title: $translate.instant("ATTACHMENT.TITLE", {
            fileName: attachment.name,
            date: moment(attachment.created_date).format($translate.instant("ATTACHMENT.DATE"))
          }),
          url: attachment.url,
          size: sizeFormat(attachment.size),
          description: attachment.description,
          isDeprecated: attachment.is_deprecated,
          modifyPermission: modifyPermission
        };
        if (edit) {
          html = $compile(templateEdit(ctx))($scope);
        } else {
          html = $compile(template(ctx))($scope);
        }
        $el.html(html);
        if (attachment.is_deprecated) {
          $el.addClass("deprecated");
          return $el.find("input:checkbox").prop('checked', true);
        } else {
          return $el.removeClass("deprecated");
        }
      };
      saveAttachment = function() {
        attachment.description = $el.find("input[name='description']").val();
        attachment.is_deprecated = $el.find("input[name='is-deprecated']").prop("checked");
        return $scope.$apply(function() {
          return $ctrl.updateAttachment(attachment).then(function() {
            return render(attachment, false);
          });
        });
      };
      $el.on("click", "a.editable-settings.icon-floppy", function(event) {
        event.preventDefault();
        return saveAttachment();
      });
      $el.on("keyup", "input[name=description]", function(event) {
        if (event.keyCode === 13) {
          return saveAttachment();
        } else if (event.keyCode === 27) {
          return render(attachment, false);
        }
      });
      $el.on("click", "a.editable-settings.icon-delete", function(event) {
        event.preventDefault();
        return render(attachment, false);
      });
      $el.on("click", "a.settings.icon-edit", function(event) {
        event.preventDefault();
        render(attachment, true);
        return $el.find("input[name='description']").focus().select();
      });
      $el.on("click", "a.settings.icon-delete", function(event) {
        event.preventDefault();
        return $scope.$apply(function() {
          return $ctrl.removeAttachment(attachment);
        });
      });
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      attachment = $scope.$eval($attrs.tgAttachment);
      render(attachment, attachment.isCreatedRightNow);
      if (attachment.isCreatedRightNow) {
        return $el.find("input[name='description']").focus().select();
      }
    };
    return {
      link: link,
      require: "^tgAttachments",
      restrict: "AE"
    };
  };

  module.directive("tgAttachment", ["$tgTemplate", "$compile", "$translate", AttachmentDirective]);

}).call(this);

(function() {
  var BindScope, module;

  module = angular.module("taigaCommon");

  BindScope = function(config) {
    var link;
    if (!config.debugInfo) {
      jQuery.fn.scope = function() {
        return this.data('scope');
      };
    }
    link = function($scope, $el) {
      if (!config.debugInfo) {
        return $el.data('scope', $scope).addClass('tg-scope');
      }
    };
    return {
      link: link
    };
  };

  module.directive("tgBindScope", ["$tgConfig", BindScope]);

}).call(this);

(function() {
  var CompileHtmlDirective;

  CompileHtmlDirective = function($compile) {
    var link;
    link = function(scope, element, attrs) {
      return scope.$watch(attrs.tgCompileHtml, function(newValue, oldValue) {
        element.html(newValue);
        return $compile(element.contents())(scope);
      });
    };
    return {
      link: link
    };
  };

  CompileHtmlDirective.$inject = ["$compile"];

  angular.module("taigaCommon").directive("tgCompileHtml", CompileHtmlDirective);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common/components.coffee
 */

(function() {
  var AssignedToDirective, BlockButtonDirective, CreatedByDisplayDirective, DateRangeDirective, DateSelectorDirective, DeleteButtonDirective, EditableDescriptionDirective, EditableSubjectDirective, ListItemAssignedtoDirective, ListItemIssueStatusDirective, ListItemPriorityDirective, ListItemSeverityDirective, ListItemTaskStatusDirective, ListItemTypeDirective, ListItemUsStatusDirective, SprintProgressBarDirective, TgMainTitleDirective, TgProgressBarDirective, WatchersDirective, bindOnce, module, taiga;

  taiga = this.taiga;

  bindOnce = this.taiga.bindOnce;

  module = angular.module("taigaCommon");

  DateRangeDirective = function($translate) {
    var link, renderRange;
    renderRange = function($el, first, second) {
      var endDate, initDate, prettyDate;
      prettyDate = $translate.instant("BACKLOG.SPRINTS.DATE");
      initDate = moment(first).format(prettyDate);
      endDate = moment(second).format(prettyDate);
      return $el.html(initDate + "-" + endDate);
    };
    link = function($scope, $el, $attrs) {
      var first, ref, second;
      ref = $attrs.tgDateRange.split(","), first = ref[0], second = ref[1];
      return bindOnce($scope, first, function(valFirst) {
        return bindOnce($scope, second, function(valSecond) {
          return renderRange($el, valFirst, valSecond);
        });
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgDateRange", ["$translate", DateRangeDirective]);

  DateSelectorDirective = function($rootscope, $translate) {
    var link;
    link = function($scope, $el, $attrs, $model) {
      var initialize, selectedDate, unbind;
      selectedDate = null;
      initialize = function() {
        return $el.picker = new Pikaday({
          field: $el[0],
          onSelect: (function(_this) {
            return function(date) {
              return selectedDate = date;
            };
          })(this),
          onOpen: (function(_this) {
            return function() {
              if (selectedDate != null) {
                return $el.picker.setDate(selectedDate);
              }
            };
          })(this),
          i18n: {
            previousMonth: $translate.instant("COMMON.PICKERDATE.PREV_MONTH"),
            nextMonth: $translate.instant("COMMON.PICKERDATE.NEXT_MONTH"),
            months: [$translate.instant("COMMON.PICKERDATE.MONTHS.JAN"), $translate.instant("COMMON.PICKERDATE.MONTHS.FEB"), $translate.instant("COMMON.PICKERDATE.MONTHS.MAR"), $translate.instant("COMMON.PICKERDATE.MONTHS.APR"), $translate.instant("COMMON.PICKERDATE.MONTHS.MAY"), $translate.instant("COMMON.PICKERDATE.MONTHS.JUN"), $translate.instant("COMMON.PICKERDATE.MONTHS.JUL"), $translate.instant("COMMON.PICKERDATE.MONTHS.AUG"), $translate.instant("COMMON.PICKERDATE.MONTHS.SEP"), $translate.instant("COMMON.PICKERDATE.MONTHS.OCT"), $translate.instant("COMMON.PICKERDATE.MONTHS.NOV"), $translate.instant("COMMON.PICKERDATE.MONTHS.DEC")],
            weekdays: [$translate.instant("COMMON.PICKERDATE.WEEK_DAYS.SUN"), $translate.instant("COMMON.PICKERDATE.WEEK_DAYS.MON"), $translate.instant("COMMON.PICKERDATE.WEEK_DAYS.TUE"), $translate.instant("COMMON.PICKERDATE.WEEK_DAYS.WED"), $translate.instant("COMMON.PICKERDATE.WEEK_DAYS.THU"), $translate.instant("COMMON.PICKERDATE.WEEK_DAYS.FRI"), $translate.instant("COMMON.PICKERDATE.WEEK_DAYS.SAT")],
            weekdaysShort: [$translate.instant("COMMON.PICKERDATE.WEEK_DAYS_SHORT.SUN"), $translate.instant("COMMON.PICKERDATE.WEEK_DAYS_SHORT.MON"), $translate.instant("COMMON.PICKERDATE.WEEK_DAYS_SHORT.TUE"), $translate.instant("COMMON.PICKERDATE.WEEK_DAYS_SHORT.WED"), $translate.instant("COMMON.PICKERDATE.WEEK_DAYS_SHORT.THU"), $translate.instant("COMMON.PICKERDATE.WEEK_DAYS_SHORT.FRI"), $translate.instant("COMMON.PICKERDATE.WEEK_DAYS_SHORT.SAT")]
          },
          isRTL: $translate.instant("COMMON.PICKERDATE.IS_RTL") === "true",
          firstDay: parseInt($translate.instant("COMMON.PICKERDATE.FIRST_DAY_OF_WEEK"), 10),
          format: $translate.instant("COMMON.PICKERDATE.FORMAT")
        });
      };
      unbind = $rootscope.$on("$translateChangeEnd", (function(_this) {
        return function(ctx) {
          return initialize();
        };
      })(this));
      $scope.$watch($attrs.ngModel, function(val) {
        if ((val != null) && !$el.picker) {
          initialize();
        }
        if (val != null) {
          return $el.picker.setDate(val);
        }
      });
      return $scope.$on("$destroy", function() {
        $el.off();
        return unbind();
      });
    };
    return {
      link: link,
      require: "ngModel"
    };
  };

  module.directive("tgDateSelector", ["$rootScope", "$translate", DateSelectorDirective]);

  SprintProgressBarDirective = function() {
    var link, renderProgress;
    renderProgress = function($el, percentage, visual_percentage) {
      if ($el.hasClass(".current-progress")) {
        return $el.css("width", percentage + "%");
      } else {
        $el.find(".current-progress").css("width", visual_percentage + "%");
        return $el.find(".number").html(percentage + " %");
      }
    };
    link = function($scope, $el, $attrs) {
      bindOnce($scope, $attrs.tgSprintProgressbar, function(sprint) {
        var closedPoints, percentage, totalPoints, visual_percentage;
        closedPoints = sprint.closed_points;
        totalPoints = sprint.total_points;
        percentage = 0;
        if (totalPoints !== 0) {
          percentage = Math.round(100 * (closedPoints / totalPoints));
        }
        visual_percentage = 0;
        if (totalPoints !== 0) {
          visual_percentage = Math.round(98 * (closedPoints / totalPoints));
        }
        return renderProgress($el, percentage, visual_percentage);
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgSprintProgressbar", SprintProgressBarDirective);

  CreatedByDisplayDirective = function($template, $compile, $translate, $navUrls) {
    var link, template;
    template = $template.get("common/components/created-by.html", true);
    link = function($scope, $el, $attrs) {
      var render;
      render = function(model) {
        var html, owner;
        owner = model.owner_extra_info || {
          full_name_display: $translate.instant("COMMON.EXTERNAL_USER"),
          photo: "/images/user-noimage.png"
        };
        html = template({
          owner: owner,
          url: (owner != null ? owner.is_active : void 0) ? $navUrls.resolve("user-profile", {
            username: owner.username
          }) : "",
          date: moment(model.created_date).format($translate.instant("COMMON.DATETIME"))
        });
        html = $compile(html)($scope);
        return $el.html(html);
      };
      bindOnce($scope, $attrs.ngModel, function(model) {
        if (model != null) {
          return render(model);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgCreatedByDisplay", ["$tgTemplate", "$compile", "$translate", "$tgNavUrls", CreatedByDisplayDirective]);

  WatchersDirective = function($rootscope, $confirm, $repo, $qqueue, $template, $compile, $translate) {
    var link, template;
    template = $template.get("common/components/watchers.html", true);
    link = function($scope, $el, $attrs, $model) {
      var deleteWatcher, isEditable, renderWatchers, save;
      isEditable = function() {
        var ref, ref1;
        return ((ref = $scope.project) != null ? (ref1 = ref.my_permissions) != null ? ref1.indexOf($attrs.requiredPerm) : void 0 : void 0) !== -1;
      };
      save = $qqueue.bindAdd((function(_this) {
        return function(watchers) {
          var item, promise;
          item = $model.$modelValue.clone();
          item.watchers = watchers;
          $model.$setViewValue(item);
          promise = $repo.save($model.$modelValue);
          promise.then(function() {
            $confirm.notify("success");
            watchers = _.map(watchers, function(watcherId) {
              return $scope.usersById[watcherId];
            });
            renderWatchers(watchers);
            return $rootscope.$broadcast("object:updated");
          });
          return promise.then(null, function() {
            return $model.$modelValue.revert();
          });
        };
      })(this));
      deleteWatcher = $qqueue.bindAdd((function(_this) {
        return function(watcherIds) {
          var item, promise;
          item = $model.$modelValue.clone();
          item.watchers = watcherIds;
          $model.$setViewValue(item);
          promise = $repo.save($model.$modelValue);
          promise.then(function() {
            var watchers;
            $confirm.notify("success");
            watchers = _.map(item.watchers, function(watcherId) {
              return $scope.usersById[watcherId];
            });
            renderWatchers(watchers);
            return $rootscope.$broadcast("object:updated");
          });
          return promise.then(null, function() {
            item.revert();
            return $confirm.notify("error");
          });
        };
      })(this));
      renderWatchers = function(watchers) {
        var ctx, html;
        ctx = {
          watchers: watchers,
          isEditable: isEditable()
        };
        html = $compile(template(ctx))($scope);
        $el.html(html);
        if (isEditable() && watchers.length === 0) {
          $el.find(".title").text("Add watchers");
          return $el.find(".watchers-header").addClass("no-watchers");
        }
      };
      $el.on("click", ".icon-delete", function(event) {
        var message, target, title, watcherId;
        event.preventDefault();
        if (!isEditable()) {
          return;
        }
        target = angular.element(event.currentTarget);
        watcherId = target.data("watcher-id");
        title = $translate.instant("COMMON.WATCHERS.TITLE_LIGHTBOX_DELETE_WARTCHER");
        message = $scope.usersById[watcherId].full_name_display;
        return $confirm.askOnDelete(title, message).then((function(_this) {
          return function(finish) {
            var watcherIds;
            finish();
            watcherIds = _.clone($model.$modelValue.watchers, false);
            watcherIds = _.pull(watcherIds, watcherId);
            return deleteWatcher(watcherIds);
          };
        })(this));
      });
      $el.on("click", ".add-watcher", function(event) {
        event.preventDefault();
        if (!isEditable()) {
          return;
        }
        return $scope.$apply(function() {
          return $rootscope.$broadcast("watcher:add", $model.$modelValue);
        });
      });
      $scope.$on("watcher:added", function(ctx, watcherId) {
        var watchers;
        watchers = _.clone($model.$modelValue.watchers, false);
        watchers.push(watcherId);
        watchers = _.uniq(watchers);
        return save(watchers);
      });
      $scope.$watch($attrs.ngModel, function(item) {
        var watchers;
        if (item == null) {
          return;
        }
        watchers = _.map(item.watchers, function(watcherId) {
          return $scope.usersById[watcherId];
        });
        return renderWatchers(watchers);
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      require: "ngModel"
    };
  };

  module.directive("tgWatchers", ["$rootScope", "$tgConfirm", "$tgRepo", "$tgQqueue", "$tgTemplate", "$compile", "$translate", WatchersDirective]);

  AssignedToDirective = function($rootscope, $confirm, $repo, $loading, $qqueue, $template, $translate, $compile) {
    var link, template;
    template = $template.get("common/components/assigned-to.html", true);
    link = function($scope, $el, $attrs, $model) {
      var isEditable, renderAssignedTo, save;
      isEditable = function() {
        var ref, ref1;
        return ((ref = $scope.project) != null ? (ref1 = ref.my_permissions) != null ? ref1.indexOf($attrs.requiredPerm) : void 0 : void 0) !== -1;
      };
      save = $qqueue.bindAdd((function(_this) {
        return function(userId) {
          var promise;
          $model.$modelValue.assigned_to = userId;
          $loading.start($el);
          promise = $repo.save($model.$modelValue);
          promise.then(function() {
            $loading.finish($el);
            $confirm.notify("success");
            renderAssignedTo($model.$modelValue);
            return $rootscope.$broadcast("object:updated");
          });
          promise.then(null, function() {
            $model.$modelValue.revert();
            $confirm.notify("error");
            return $loading.finish($el);
          });
          return promise;
        };
      })(this));
      renderAssignedTo = function(issue) {
        var assignedTo, assignedToId, ctx, html;
        assignedToId = issue != null ? issue.assigned_to : void 0;
        assignedTo = assignedToId != null ? $scope.usersById[assignedToId] : null;
        ctx = {
          assignedTo: assignedTo,
          isEditable: isEditable()
        };
        html = $compile(template(ctx))($scope);
        return $el.html(html);
      };
      $el.on("click", ".user-assigned", function(event) {
        event.preventDefault();
        if (!isEditable()) {
          return;
        }
        return $scope.$apply(function() {
          return $rootscope.$broadcast("assigned-to:add", $model.$modelValue);
        });
      });
      $el.on("click", ".icon-delete", function(event) {
        var title;
        event.preventDefault();
        if (!isEditable()) {
          return;
        }
        title = $translate.instant("COMMON.ASSIGNED_TO.CONFIRM_UNASSIGNED");
        return $confirm.ask(title).then((function(_this) {
          return function(finish) {
            finish();
            $model.$modelValue.assigned_to = null;
            return save(null);
          };
        })(this));
      });
      $scope.$on("assigned-to:added", function(ctx, userId, item) {
        if (item.id !== $model.$modelValue.id) {
          return;
        }
        return save(userId);
      });
      $scope.$watch($attrs.ngModel, function(instance) {
        return renderAssignedTo(instance);
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      require: "ngModel"
    };
  };

  module.directive("tgAssignedTo", ["$rootScope", "$tgConfirm", "$tgRepo", "$tgLoading", "$tgQqueue", "$tgTemplate", "$translate", "$compile", AssignedToDirective]);

  BlockButtonDirective = function($rootscope, $loading, $template) {
    var link, template;
    template = $template.get("common/components/block-button.html");
    link = function($scope, $el, $attrs, $model) {
      var isEditable;
      isEditable = function() {
        return $scope.project.my_permissions.indexOf("modify_us") !== -1;
      };
      $scope.$watch($attrs.ngModel, function(item) {
        if (!item) {
          return;
        }
        if (isEditable()) {
          $el.find('.item-block').addClass('editable');
        }
        if (item.is_blocked) {
          $el.find('.item-block').hide();
          return $el.find('.item-unblock').show();
        } else {
          $el.find('.item-block').show();
          return $el.find('.item-unblock').hide();
        }
      });
      $el.on("click", ".item-block", function(event) {
        event.preventDefault();
        return $rootscope.$broadcast("block", $model.$modelValue);
      });
      $el.on("click", ".item-unblock", function(event) {
        var finish;
        event.preventDefault();
        $loading.start($el.find(".item-unblock"));
        finish = function() {
          return $loading.finish($el.find(".item-unblock"));
        };
        return $rootscope.$broadcast("unblock", $model.$modelValue, finish);
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel",
      template: template
    };
  };

  module.directive("tgBlockButton", ["$rootScope", "$tgLoading", "$tgTemplate", BlockButtonDirective]);

  DeleteButtonDirective = function($log, $repo, $confirm, $location, $template) {
    var link, template;
    template = $template.get("common/components/delete-button.html");
    link = function($scope, $el, $attrs, $model) {
      if (!$attrs.onDeleteGoToUrl) {
        return $log.error("DeleteButtonDirective requires on-delete-go-to-url set in scope.");
      }
      if (!$attrs.onDeleteTitle) {
        return $log.error("DeleteButtonDirective requires on-delete-title set in scope.");
      }
      $el.on("click", ".button", function(event) {
        var subtitle, title;
        title = $attrs.onDeleteTitle;
        subtitle = $model.$modelValue.subject;
        return $confirm.askOnDelete(title, subtitle).then((function(_this) {
          return function(finish) {
            var promise;
            promise = $repo.remove($model.$modelValue);
            promise.then(function() {
              var url;
              finish();
              url = $scope.$eval($attrs.onDeleteGoToUrl);
              return $location.path(url);
            });
            return promise.then(null, function() {
              finish(false);
              return $confirm.notify("error");
            });
          };
        })(this));
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel",
      template: template
    };
  };

  module.directive("tgDeleteButton", ["$log", "$tgRepo", "$tgConfirm", "$tgLocation", "$tgTemplate", DeleteButtonDirective]);

  EditableSubjectDirective = function($rootscope, $repo, $confirm, $loading, $qqueue, $template) {
    var link, template;
    template = $template.get("common/components/editable-subject.html");
    link = function($scope, $el, $attrs, $model) {
      var isEditable, save;
      $scope.$on("object:updated", function() {
        $el.find('.edit-subject').hide();
        return $el.find('.view-subject').show();
      });
      isEditable = function() {
        return $scope.project.my_permissions.indexOf($attrs.requiredPerm) !== -1;
      };
      save = $qqueue.bindAdd((function(_this) {
        return function(subject) {
          var promise;
          $model.$modelValue.subject = subject;
          $loading.start($el.find('.save-container'));
          promise = $repo.save($model.$modelValue);
          promise.then(function() {
            $confirm.notify("success");
            $rootscope.$broadcast("object:updated");
            $el.find('.edit-subject').hide();
            return $el.find('.view-subject').show();
          });
          promise.then(null, function() {
            return $confirm.notify("error");
          });
          promise["finally"](function() {
            return $loading.finish($el.find('.save-container'));
          });
          return promise;
        };
      })(this));
      $el.click(function() {
        if (!isEditable()) {
          return;
        }
        $el.find('.edit-subject').show();
        $el.find('.view-subject').hide();
        return $el.find('input').focus();
      });
      $el.on("click", ".save", function(e) {
        var subject;
        e.preventDefault();
        subject = $scope.item.subject;
        return save(subject);
      });
      $el.on("keyup", "input", function(event) {
        var subject;
        if (event.keyCode === 13) {
          subject = $scope.item.subject;
          return save(subject);
        } else if (event.keyCode === 27) {
          $scope.$apply((function(_this) {
            return function() {
              return $model.$modelValue.revert();
            };
          })(this));
          $el.find('div.edit-subject').hide();
          return $el.find('div.view-subject').show();
        }
      });
      $el.find('div.edit-subject').hide();
      $el.find('div.view-subject span.edit').hide();
      $scope.$watch($attrs.ngModel, function(value) {
        if (!value) {
          return;
        }
        $scope.item = value;
        if (!isEditable()) {
          return $el.find('.view-subject .edit').remove();
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel",
      template: template
    };
  };

  module.directive("tgEditableSubject", ["$rootScope", "$tgRepo", "$tgConfirm", "$tgLoading", "$tgQqueue", "$tgTemplate", EditableSubjectDirective]);

  EditableDescriptionDirective = function($rootscope, $repo, $confirm, $compile, $loading, $selectedText, $qqueue, $template) {
    var link, noDescriptionMegEditMode, noDescriptionMegReadMode, template;
    template = $template.get("common/components/editable-description.html");
    noDescriptionMegEditMode = $template.get("common/components/editable-description-msg-edit-mode.html");
    noDescriptionMegReadMode = $template.get("common/components/editable-description-msg-read-mode.html");
    link = function($scope, $el, $attrs, $model) {
      var isEditable, save;
      $el.find('.edit-description').hide();
      $el.find('.view-description .edit').hide();
      $scope.$on("object:updated", function() {
        $el.find('.edit-description').hide();
        return $el.find('.view-description').show();
      });
      isEditable = function() {
        return $scope.project.my_permissions.indexOf($attrs.requiredPerm) !== -1;
      };
      save = $qqueue.bindAdd((function(_this) {
        return function(description) {
          var promise;
          $model.$modelValue.description = description;
          $loading.start($el.find('.save-container'));
          promise = $repo.save($model.$modelValue);
          promise.then(function() {
            $confirm.notify("success");
            $rootscope.$broadcast("object:updated");
            $el.find('.edit-description').hide();
            return $el.find('.view-description').show();
          });
          promise.then(null, function() {
            return $confirm.notify("error");
          });
          return promise["finally"](function() {
            return $loading.finish($el.find('.save-container'));
          });
        };
      })(this));
      $el.on("mouseup", ".view-description", function(event) {
        var target;
        target = angular.element(event.target);
        if (!isEditable()) {
          return;
        }
        if (target.is('a')) {
          return;
        }
        if ($selectedText.get().length) {
          return;
        }
        $el.find('.edit-description').show();
        $el.find('.view-description').hide();
        return $el.find('textarea').focus();
      });
      $el.on("click", "a", function(event) {
        var href, target;
        target = angular.element(event.target);
        href = target.attr('href');
        if (href.indexOf("#") === 0) {
          event.preventDefault();
          return $('body').scrollTop($(href).offset().top);
        }
      });
      $el.on("click", ".save", function(e) {
        var description;
        e.preventDefault();
        description = $scope.item.description;
        return save(description);
      });
      $el.on("keydown", "textarea", function(event) {
        if (event.keyCode === 27) {
          $scope.$apply((function(_this) {
            return function() {
              return $scope.item.revert();
            };
          })(this));
          $el.find('.edit-description').hide();
          return $el.find('.view-description').show();
        }
      });
      $scope.$watch($attrs.ngModel, function(value) {
        if (!value) {
          return;
        }
        $scope.item = value;
        if (isEditable()) {
          $el.find('.view-description .edit').show();
          $el.find('.view-description .us-content').addClass('editable');
          return $scope.noDescriptionMsg = $compile(noDescriptionMegEditMode)($scope);
        } else {
          return $scope.noDescriptionMsg = $compile(noDescriptionMegReadMode)($scope);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel",
      template: template
    };
  };

  module.directive("tgEditableDescription", ["$rootScope", "$tgRepo", "$tgConfirm", "$compile", "$tgLoading", "$selectedText", "$tgQqueue", "$tgTemplate", EditableDescriptionDirective]);

  ListItemUsStatusDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      var us;
      us = $scope.$eval($attrs.tgListitemUsStatus);
      return bindOnce($scope, "usStatusById", function(usStatusById) {
        return $el.html(usStatusById[us.status].name);
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgListitemUsStatus", ListItemUsStatusDirective);

  ListItemTaskStatusDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      var task;
      task = $scope.$eval($attrs.tgListitemTaskStatus);
      return bindOnce($scope, "taskStatusById", function(taskStatusById) {
        return $el.html(taskStatusById[task.status].name);
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgListitemTaskStatus", ListItemTaskStatusDirective);

  ListItemAssignedtoDirective = function($template) {
    var link, template;
    template = $template.get("common/components/list-item-assigned-to-avatar.html", true);
    link = function($scope, $el, $attrs) {
      return bindOnce($scope, "usersById", function(usersById) {
        var ctx, item, member;
        item = $scope.$eval($attrs.tgListitemAssignedto);
        ctx = {
          name: "Unassigned",
          imgurl: "/images/unnamed.png"
        };
        member = usersById[item.assigned_to];
        if (member) {
          ctx.imgurl = member.photo;
          ctx.name = member.full_name_display;
        }
        return $el.html(template(ctx));
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgListitemAssignedto", ["$tgTemplate", ListItemAssignedtoDirective]);

  ListItemIssueStatusDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      var issue;
      issue = $scope.$eval($attrs.tgListitemIssueStatus);
      return bindOnce($scope, "issueStatusById", function(issueStatusById) {
        return $el.html(issueStatusById[issue.status].name);
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgListitemIssueStatus", ListItemIssueStatusDirective);

  ListItemTypeDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      var render;
      render = function(issueTypeById, issue) {
        var domNode, type;
        type = issueTypeById[issue.type];
        domNode = $el.find(".level");
        domNode.css("background-color", type.color);
        return domNode.attr("title", type.name);
      };
      bindOnce($scope, "issueTypeById", function(issueTypeById) {
        var issue;
        issue = $scope.$eval($attrs.tgListitemType);
        return render(issueTypeById, issue);
      });
      return $scope.$watch($attrs.tgListitemType, function(issue) {
        return render($scope.issueTypeById, issue);
      });
    };
    return {
      link: link,
      templateUrl: "common/components/level.html"
    };
  };

  module.directive("tgListitemType", ListItemTypeDirective);

  ListItemPriorityDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      var render;
      render = function(priorityById, issue) {
        var domNode, priority;
        priority = priorityById[issue.priority];
        domNode = $el.find(".level");
        domNode.css("background-color", priority.color);
        return domNode.attr("title", priority.name);
      };
      bindOnce($scope, "priorityById", function(priorityById) {
        var issue;
        issue = $scope.$eval($attrs.tgListitemPriority);
        return render(priorityById, issue);
      });
      return $scope.$watch($attrs.tgListitemPriority, function(issue) {
        return render($scope.priorityById, issue);
      });
    };
    return {
      link: link,
      templateUrl: "common/components/level.html"
    };
  };

  module.directive("tgListitemPriority", ListItemPriorityDirective);

  ListItemSeverityDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      var render;
      render = function(severityById, issue) {
        var domNode, severity;
        severity = severityById[issue.severity];
        domNode = $el.find(".level");
        domNode.css("background-color", severity.color);
        return domNode.attr("title", severity.name);
      };
      bindOnce($scope, "severityById", function(severityById) {
        var issue;
        issue = $scope.$eval($attrs.tgListitemSeverity);
        return render(severityById, issue);
      });
      return $scope.$watch($attrs.tgListitemSeverity, function(issue) {
        return render($scope.severityById, issue);
      });
    };
    return {
      link: link,
      templateUrl: "common/components/level.html"
    };
  };

  module.directive("tgListitemSeverity", ListItemSeverityDirective);

  TgProgressBarDirective = function($template) {
    var link, render, template;
    template = $template.get("common/components/progress-bar.html", true);
    render = function(el, percentage) {
      return el.html(template({
        percentage: percentage
      }));
    };
    link = function($scope, $el, $attrs) {
      var element;
      element = angular.element($el);
      $scope.$watch($attrs.tgProgressBar, function(percentage) {
        percentage = _.max([0, percentage]);
        percentage = _.min([100, percentage]);
        return render($el, percentage);
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgProgressBar", ["$tgTemplate", TgProgressBarDirective]);

  TgMainTitleDirective = function($translate) {
    var link;
    link = function($scope, $el, $attrs) {
      $attrs.$observe("i18nSectionName", function(i18nSectionName) {
        return $scope.sectionName = $translate.instant(i18nSectionName);
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      templateUrl: "common/components/main-title.html",
      scope: {
        projectName: "=projectName"
      }
    };
  };

  module.directive("tgMainTitle", ["$translate", TgMainTitleDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/base/confirm.coffee
 */

(function() {
  var ConfirmService, NOTIFICATION_MSG, bindMethods, cancelTimeout, debounce, module, taiga, timeout,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  timeout = this.taiga.timeout;

  cancelTimeout = this.taiga.cancelTimeout;

  debounce = this.taiga.debounce;

  bindMethods = this.taiga.bindMethods;

  NOTIFICATION_MSG = {
    "success": {
      title: "NOTIFICATION.OK",
      message: "NOTIFICATION.SAVED"
    },
    "error": {
      title: "NOTIFICATION.WARNING",
      message: "NOTIFICATION.WARNING_TEXT"
    },
    "light-error": {
      title: "NOTIFICATION.WARNING",
      message: "NOTIFICATION.WARNING_TEXT"
    }
  };

  ConfirmService = (function(superClass) {
    extend(ConfirmService, superClass);

    ConfirmService.$inject = ["$q", "lightboxService", "$tgLoading", "$translate"];

    function ConfirmService(q, lightboxService, loading, translate) {
      this.q = q;
      this.lightboxService = lightboxService;
      this.loading = loading;
      this.translate = translate;
      bindMethods(this);
    }

    ConfirmService.prototype.hide = function(el) {
      if (el) {
        this.lightboxService.close(el);
        return el.off(".confirm-dialog");
      }
    };

    ConfirmService.prototype.ask = function(title, subtitle, message, lightboxSelector) {
      var defered, el;
      if (lightboxSelector == null) {
        lightboxSelector = ".lightbox-generic-ask";
      }
      defered = this.q.defer();
      el = angular.element(lightboxSelector);
      el.find("h2.title").html(title);
      el.find("span.subtitle").html(subtitle);
      el.find("span.message").html(message);
      el.on("click.confirm-dialog", "a.button-green", debounce(2000, (function(_this) {
        return function(event) {
          var target;
          event.preventDefault();
          target = angular.element(event.currentTarget);
          _this.loading.start(target);
          return defered.resolve(function(ok) {
            if (ok == null) {
              ok = true;
            }
            _this.loading.finish(target);
            if (ok) {
              return _this.hide(el);
            }
          });
        };
      })(this)));
      el.on("click.confirm-dialog", "a.button-red", (function(_this) {
        return function(event) {
          event.preventDefault();
          defered.reject();
          return _this.hide(el);
        };
      })(this));
      this.lightboxService.open(el);
      return defered.promise;
    };

    ConfirmService.prototype.askOnDelete = function(title, message) {
      return this.ask(title, this.translate.instant("NOTIFICATION.ASK_DELETE"), message);
    };

    ConfirmService.prototype.askChoice = function(title, subtitle, choices, replacement, warning, lightboxSelector) {
      var choicesField, defered, el;
      if (lightboxSelector == null) {
        lightboxSelector = ".lightbox-ask-choice";
      }
      defered = this.q.defer();
      el = angular.element(lightboxSelector);
      el.find(".title").html(title);
      el.find(".subtitle").html(subtitle);
      if (replacement) {
        el.find(".replacement").html(replacement);
      } else {
        el.find(".replacement").remove();
      }
      if (warning) {
        el.find(".warning").html(warning);
      } else {
        el.find(".warning").remove();
      }
      choicesField = el.find(".choices");
      choicesField.html('');
      _.each(choices, function(value, key) {
        return choicesField.append(angular.element("<option value='" + key + "'>" + value + "</option>"));
      });
      el.on("click.confirm-dialog", "a.button-green", debounce(2000, (function(_this) {
        return function(event) {
          var target;
          event.preventDefault();
          target = angular.element(event.currentTarget);
          _this.loading.start(target);
          return defered.resolve({
            selected: choicesField.val(),
            finish: function() {
              _this.loading.finish(target);
              return _this.hide(el);
            }
          });
        };
      })(this)));
      el.on("click.confirm-dialog", "a.button-red", (function(_this) {
        return function(event) {
          event.preventDefault();
          defered.reject();
          return _this.hide(el);
        };
      })(this));
      this.lightboxService.open(el);
      return defered.promise;
    };

    ConfirmService.prototype.error = function(message) {
      var defered, el;
      defered = this.q.defer();
      el = angular.element(".lightbox-generic-error");
      el.find("h2.title").html(message);
      el.on("click.confirm-dialog", "a.button-green", (function(_this) {
        return function(event) {
          event.preventDefault();
          defered.resolve();
          return _this.hide(el);
        };
      })(this));
      el.on("click.confirm-dialog", "a.close", (function(_this) {
        return function(event) {
          event.preventDefault();
          defered.resolve();
          return _this.hide(el);
        };
      })(this));
      this.lightboxService.open(el);
      return defered.promise;
    };

    ConfirmService.prototype.success = function(title, message) {
      var defered, el;
      defered = this.q.defer();
      el = angular.element(".lightbox-generic-success");
      if (title) {
        el.find("h2.title").html(title);
      }
      if (message) {
        el.find("p.message").html(message);
      }
      el.on("click.confirm-dialog", "a.button-green", (function(_this) {
        return function(event) {
          event.preventDefault();
          defered.resolve();
          return _this.hide(el);
        };
      })(this));
      el.on("click.confirm-dialog", "a.close", (function(_this) {
        return function(event) {
          event.preventDefault();
          defered.resolve();
          return _this.hide(el);
        };
      })(this));
      this.lightboxService.open(el);
      return defered.promise;
    };

    ConfirmService.prototype.loader = function(title, message) {
      var el;
      el = angular.element(".lightbox-generic-loading");
      if (title) {
        el.find("h2.title").html(title);
      }
      if (message) {
        el.find("p.message").html(message);
      }
      return {
        start: (function(_this) {
          return function() {
            return _this.lightboxService.open(el);
          };
        })(this),
        stop: (function(_this) {
          return function() {
            return _this.lightboxService.close(el);
          };
        })(this),
        update: (function(_this) {
          return function(status, title, message, percent) {
            if (title) {
              el.find("h2.title").html(title);
            }
            if (message) {
              el.find("p.message").html(message);
            }
            if (percent) {
              el.find(".spin").addClass("hidden");
              el.find(".progress-bar-wrapper").removeClass("hidden");
              el.find(".progress-bar-wrapper > .bar").width(percent + '%');
              return el.find(".progress-bar-wrapper > span").html(percent + '%').css('left', (percent - 9) + '%');
            } else {
              el.find(".spin").removeClass("hidden");
              return el.find(".progress-bar-wrapper").addClass("hidden");
            }
          };
        })(this)
      };
    };

    ConfirmService.prototype.notify = function(type, message, title, time) {
      var body, el, selector;
      selector = ".notification-message-" + type;
      el = angular.element(selector);
      if (el.hasClass("active")) {
        return;
      }
      if (title) {
        el.find("h4").html(title);
      } else {
        el.find("h4").html(this.translate.instant(NOTIFICATION_MSG[type].title));
      }
      if (message) {
        el.find("p").html(message);
      } else {
        el.find("p").html(this.translate.instant(NOTIFICATION_MSG[type].message));
      }
      body = angular.element("body");
      body.find(".notification-message .notification-light").removeClass('active').addClass('inactive');
      body.find(selector).removeClass('inactive').addClass('active');
      if (this.tsem) {
        cancelTimeout(this.tsem);
      }
      if (!time) {
        time = type === 'error' || type === 'light-error' ? 3500 : 1500;
      }
      this.tsem = timeout(time, (function(_this) {
        return function() {
          body.find(selector).removeClass('active').addClass('inactive');
          return delete _this.tsem;
        };
      })(this));
      return el.on("click", ".icon-delete", (function(_this) {
        return function(event) {
          return body.find(selector).removeClass('active').addClass('inactive');
        };
      })(this));
    };

    return ConfirmService;

  })(taiga.Service);

  module = angular.module("taigaCommon");

  module.service("$tgConfirm", ConfirmService);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common/custom-field-values.coffee
 */

(function() {
  var CustomAttributeValueDirective, CustomAttributesValuesController, CustomAttributesValuesDirective, bindMethods, bindOnce, debounce, generateHash, module, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  bindMethods = this.taiga.bindMethods;

  bindOnce = this.taiga.bindOnce;

  debounce = this.taiga.debounce;

  generateHash = taiga.generateHash;

  module = angular.module("taigaCommon");

  CustomAttributesValuesController = (function(superClass) {
    extend(CustomAttributesValuesController, superClass);

    CustomAttributesValuesController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgResources", "$tgConfirm", "$q"];

    function CustomAttributesValuesController(scope, rootscope, repo, rs, confirm, q) {
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.rs = rs;
      this.confirm = confirm;
      this.q = q;
      bindMethods(this);
      this.type = null;
      this.objectId = null;
      this.projectId = null;
      this.customAttributes = [];
      this.customAttributesValues = null;
    }

    CustomAttributesValuesController.prototype.initialize = function(type, objectId) {
      this.project = this.scope.project;
      this.type = type;
      this.objectId = objectId;
      return this.projectId = this.scope.projectId;
    };

    CustomAttributesValuesController.prototype.loadCustomAttributesValues = function() {
      if (!this.objectId) {
        return this.customAttributesValues;
      }
      return this.rs.customAttributesValues[this.type].get(this.objectId).then((function(_this) {
        return function(customAttributesValues) {
          _this.customAttributes = _this.project[_this.type + "_custom_attributes"];
          _this.customAttributesValues = customAttributesValues;
          return customAttributesValues;
        };
      })(this));
    };

    CustomAttributesValuesController.prototype.getAttributeValue = function(attribute) {
      var attributeValue;
      attributeValue = _.clone(attribute, false);
      attributeValue.value = this.customAttributesValues.attributes_values[attribute.id];
      return attributeValue;
    };

    CustomAttributesValuesController.prototype.updateAttributeValue = function(attributeValue) {
      var attributesValues, onError, onSuccess;
      onSuccess = (function(_this) {
        return function() {
          return _this.rootscope.$broadcast("custom-attributes-values:edit");
        };
      })(this);
      onError = (function(_this) {
        return function(response) {
          _this.confirm.notify("error");
          return _this.q.reject();
        };
      })(this);
      attributesValues = _.clone(this.customAttributesValues.attributes_values, true);
      attributesValues[attributeValue.id] = attributeValue.value;
      this.customAttributesValues.attributes_values = attributesValues;
      this.customAttributesValues.id = this.objectId;
      return this.repo.save(this.customAttributesValues).then(onSuccess, onError);
    };

    return CustomAttributesValuesController;

  })(taiga.Controller);

  CustomAttributesValuesDirective = function($templates, $storage) {
    var collapsedHash, link, template, templateFn;
    template = $templates.get("custom-attributes/custom-attributes-values.html", true);
    collapsedHash = function(type) {
      return generateHash(["custom-attributes-collapsed", type]);
    };
    link = function($scope, $el, $attrs, $ctrls) {
      var $ctrl, $model;
      $ctrl = $ctrls[0];
      $model = $ctrls[1];
      bindOnce($scope, $attrs.ngModel, function(value) {
        $ctrl.initialize($attrs.type, value.id);
        return $ctrl.loadCustomAttributesValues();
      });
      $el.on("click", ".custom-fields-header a", function() {
        var collapsed, hash;
        hash = collapsedHash($attrs.type);
        collapsed = !($storage.get(hash) || false);
        $storage.set(hash, collapsed);
        if (collapsed) {
          $el.find(".custom-fields-header a").removeClass("open");
          return $el.find(".custom-fields-body").removeClass("open");
        } else {
          $el.find(".custom-fields-header a").addClass("open");
          return $el.find(".custom-fields-body").addClass("open");
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    templateFn = function($el, $attrs) {
      var collapsed;
      collapsed = $storage.get(collapsedHash($attrs.type)) || false;
      return template({
        requiredEditionPerm: $attrs.requiredEditionPerm,
        collapsed: collapsed
      });
    };
    return {
      require: ["tgCustomAttributesValues", "ngModel"],
      controller: CustomAttributesValuesController,
      controllerAs: "ctrl",
      restrict: "AE",
      scope: true,
      link: link,
      template: templateFn
    };
  };

  module.directive("tgCustomAttributesValues", ["$tgTemplate", "$tgStorage", CustomAttributesValuesDirective]);

  CustomAttributeValueDirective = function($template, $selectedText, $compile) {
    var link, template, templateEdit;
    template = $template.get("custom-attributes/custom-attribute-value.html", true);
    templateEdit = $template.get("custom-attributes/custom-attribute-value-edit.html", true);
    link = function($scope, $el, $attrs, $ctrl) {
      var attributeValue, isEditable, render, saveAttributeValue, submit;
      render = function(attributeValue, edit) {
        var ctx, editable, html, innerText, value;
        if (edit == null) {
          edit = false;
        }
        value = attributeValue.value;
        innerText = attributeValue.value;
        editable = isEditable();
        ctx = {
          id: attributeValue.id,
          name: attributeValue.name,
          description: attributeValue.description,
          value: value,
          isEditable: editable,
          field_type: attributeValue.field_type
        };
        if (editable && (edit || !value)) {
          html = templateEdit(ctx);
          html = $compile(html)($scope);
        } else {
          html = template(ctx);
          html = $compile(html)($scope);
        }
        return $el.html(html);
      };
      isEditable = function() {
        var permissions, requiredEditionPerm;
        permissions = $scope.project.my_permissions;
        requiredEditionPerm = $attrs.requiredEditionPerm;
        return permissions.indexOf(requiredEditionPerm) > -1;
      };
      saveAttributeValue = function() {
        attributeValue.value = $el.find("input, textarea").val();
        return $scope.$apply(function() {
          return $ctrl.updateAttributeValue(attributeValue).then(function() {
            return render(attributeValue, false);
          });
        });
      };
      $el.on("keyup", "input[name=description], textarea[name='description']", function(event) {
        if (event.keyCode === 13 && event.currentTarget.type !== "textarea") {
          return submit(event);
        } else if (event.keyCode === 27) {
          return render(attributeValue, false);
        }
      });
      $el.on("click", ".custom-field-value.read-mode", function() {
        if (!isEditable()) {
          return;
        }
        if ($selectedText.get().length) {
          return;
        }
        render(attributeValue, true);
        return $el.find("input[name='description'], textarea[name='description']").focus().select();
      });
      $el.on("click", "a.icon-edit", function(event) {
        event.preventDefault();
        render(attributeValue, true);
        return $el.find("input[name='description'], textarea[name='description']").focus().select();
      });
      submit = debounce(2000, (function(_this) {
        return function(event) {
          event.preventDefault();
          return saveAttributeValue();
        };
      })(this));
      $el.on("submit", "form", submit);
      $el.on("click", "a.icon-floppy", submit);
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      attributeValue = $scope.$eval($attrs.tgCustomAttributeValue);
      return render(attributeValue);
    };
    return {
      link: link,
      require: "^tgCustomAttributesValues",
      restrict: "AE"
    };
  };

  module.directive("tgCustomAttributeValue", ["$tgTemplate", "$selectedText", "$compile", CustomAttributeValueDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common/estimation.coffee
 */

(function() {
  var EstimationsService, LbUsEstimationDirective, UsEstimationDirective, groupBy, module, taiga,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  taiga = this.taiga;

  groupBy = this.taiga.groupBy;

  module = angular.module("taigaCommon");

  LbUsEstimationDirective = function($tgEstimationsService, $rootScope, $repo, $confirm, $template, $compile) {
    var link;
    link = function($scope, $el, $attrs, $model) {
      $scope.$watch($attrs.ngModel, function(us) {
        var estimationProcess;
        if (us) {
          estimationProcess = $tgEstimationsService.create($el, us, $scope.project);
          estimationProcess.onSelectedPointForRole = function(roleId, pointId) {
            return $scope.$apply(function() {
              return $model.$setViewValue(us);
            });
          };
          estimationProcess.render = function() {
            var ctx, html, mainTemplate, template;
            ctx = {
              totalPoints: this.calculateTotalPoints(),
              roles: this.calculateRoles(),
              editable: this.isEditable
            };
            mainTemplate = "common/estimation/us-estimation-points-per-role.html";
            template = $template.get(mainTemplate, true);
            html = template(ctx);
            html = $compile(html)($scope);
            return this.$el.html(html);
          };
          return estimationProcess.render();
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgLbUsEstimation", ["$tgEstimationsService", "$rootScope", "$tgRepo", "$tgConfirm", "$tgTemplate", "$compile", LbUsEstimationDirective]);

  UsEstimationDirective = function($tgEstimationsService, $rootScope, $repo, $confirm, $qqueue, $template, $compile) {
    var link;
    link = function($scope, $el, $attrs, $model) {
      $scope.$watch($attrs.ngModel, function(us) {
        var estimationProcess;
        if (us) {
          estimationProcess = $tgEstimationsService.create($el, us, $scope.project);
          estimationProcess.onSelectedPointForRole = function(roleId, pointId) {
            return this.save(roleId, pointId).then(function() {
              return $rootScope.$broadcast("object:updated");
            });
          };
          estimationProcess.render = function() {
            var ctx, html, mainTemplate, template;
            ctx = {
              totalPoints: this.calculateTotalPoints(),
              roles: this.calculateRoles(),
              editable: this.isEditable
            };
            mainTemplate = "common/estimation/us-estimation-points-per-role.html";
            template = $template.get(mainTemplate, true);
            html = template(ctx);
            html = $compile(html)($scope);
            return this.$el.html(html);
          };
          return estimationProcess.render();
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgUsEstimation", ["$tgEstimationsService", "$rootScope", "$tgRepo", "$tgConfirm", "$tgQqueue", "$tgTemplate", "$compile", UsEstimationDirective]);

  EstimationsService = function($template, $qqueue, $repo, $confirm, $q) {
    var EstimationProcess, create, pointsTemplate;
    pointsTemplate = $template.get("common/estimation/us-estimation-points.html", true);
    EstimationProcess = (function() {
      function EstimationProcess($el1, us1, project1) {
        this.$el = $el1;
        this.us = us1;
        this.project = project1;
        this.bindClickEvents = bind(this.bindClickEvents, this);
        this.isEditable = this.project.my_permissions.indexOf("modify_us") !== -1;
        this.roles = this.project.roles;
        this.points = this.project.points;
        this.pointsById = groupBy(this.points, function(x) {
          return x.id;
        });
        this.onSelectedPointForRole = function(roleId, pointId) {};
        this.render = function() {};
      }

      EstimationProcess.prototype.save = function(roleId, pointId) {
        var deferred;
        deferred = $q.defer();
        $qqueue.add((function(_this) {
          return function() {
            var onError, onSuccess;
            onSuccess = function() {
              deferred.resolve();
              return $confirm.notify("success");
            };
            onError = function() {
              $confirm.notify("error");
              _this.us.revert();
              _this.render();
              return deferred.reject();
            };
            return $repo.save(_this.us).then(onSuccess, onError);
          };
        })(this));
        return deferred.promise;
      };

      EstimationProcess.prototype.calculateTotalPoints = function() {
        var notNullValues, values;
        values = _.map(this.us.points, (function(_this) {
          return function(v, k) {
            var ref;
            return (ref = _this.pointsById[v]) != null ? ref.value : void 0;
          };
        })(this));
        if (values.length === 0) {
          return "0";
        }
        notNullValues = _.filter(values, function(v) {
          return v != null;
        });
        if (notNullValues.length === 0) {
          return "?";
        }
        return _.reduce(notNullValues, function(acc, num) {
          return acc + num;
        });
      };

      EstimationProcess.prototype.calculateRoles = function() {
        var computableRoles, roles;
        computableRoles = _.filter(this.project.roles, "computable");
        roles = _.map(computableRoles, (function(_this) {
          return function(role) {
            var pointId, pointObj;
            pointId = _this.us.points[role.id];
            pointObj = _this.pointsById[pointId];
            role = _.clone(role, true);
            role.points = (pointObj != null) && (pointObj.name != null) ? pointObj.name : "?";
            return role;
          };
        })(this));
        return roles;
      };

      EstimationProcess.prototype.bindClickEvents = function() {
        this.$el.on("click", ".total.clickable", (function(_this) {
          return function(event) {
            var roleId, target;
            event.preventDefault();
            event.stopPropagation();
            target = angular.element(event.currentTarget);
            roleId = target.data("role-id");
            _this.renderPointsSelector(roleId, target);
            target.siblings().removeClass('active');
            return target.addClass('active');
          };
        })(this));
        return this.$el.on("click", ".point", (function(_this) {
          return function(event) {
            var pointId, points, roleId, target;
            event.preventDefault();
            event.stopPropagation();
            target = angular.element(event.currentTarget);
            roleId = target.data("role-id");
            pointId = target.data("point-id");
            _this.$el.find(".popover").popover().close();
            points = _.clone(_this.us.points, true);
            points[roleId] = pointId;
            _this.us.points = points;
            _this.render();
            return _this.onSelectedPointForRole(roleId, pointId);
          };
        })(this));
      };

      EstimationProcess.prototype.renderPointsSelector = function(roleId, target) {
        var horizontalList, html, maxPointLength, points, pop;
        points = _.map(this.points, (function(_this) {
          return function(point) {
            point = _.clone(point, true);
            point.selected = _this.us.points[roleId] === point.id ? false : true;
            return point;
          };
        })(this));
        maxPointLength = 5;
        horizontalList = _.some(points, (function(_this) {
          return function(point) {
            return point.name.length > maxPointLength;
          };
        })(this));
        html = pointsTemplate({
          "points": points,
          roleId: roleId,
          horizontal: horizontalList
        });
        this.$el.find(".popover").popover().close();
        this.$el.find(".pop-points-open").remove();
        if (target != null) {
          this.$el.find(target).append(html);
        } else {
          this.$el.append(html);
        }
        this.$el.find(".pop-points-open").popover().open(function() {
          return $(this).removeClass("active").closest("li").removeClass("active");
        });
        this.$el.find(".pop-points-open").show();
        pop = this.$el.find(".pop-points-open");
        if (pop.offset().top + pop.height() > document.body.clientHeight) {
          return pop.addClass('pop-bottom');
        }
      };

      return EstimationProcess;

    })();
    create = function($el, us, project) {
      var estimationProcess;
      $el.unbind("click");
      estimationProcess = new EstimationProcess($el, us, project);
      if (estimationProcess.isEditable) {
        estimationProcess.bindClickEvents();
      }
      return estimationProcess;
    };
    return {
      create: create
    };
  };

  module.factory("$tgEstimationsService", ["$tgTemplate", "$tgQqueue", "$tgRepo", "$tgConfirm", "$q", EstimationsService]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common/filters.coffee
 */

(function() {
  var defaultFilter, module, momentFormat, momentFromNow, taiga, unslugify, yesNoFilter;

  taiga = this.taiga;

  module = angular.module("taigaCommon");

  defaultFilter = function() {
    return function(value, defaultValue) {
      if (value === [null, void 0]) {
        return defaultValue;
      }
      return value;
    };
  };

  module.filter("default", defaultFilter);

  yesNoFilter = function($translate) {
    return function(value) {
      if (value) {
        return $translate.instant("COMMON.YES");
      }
      return $translate.instant("COMMON.NO");
    };
  };

  module.filter("yesNo", ["$translate", yesNoFilter]);

  unslugify = function() {
    return taiga.unslugify;
  };

  module.filter("unslugify", unslugify);

  momentFormat = function() {
    return function(input, format) {
      if (input) {
        return moment(input).format(format);
      }
      return "";
    };
  };

  module.filter("momentFormat", momentFormat);

  momentFromNow = function() {
    return function(input, without_suffix) {
      if (input) {
        return moment(input).fromNow(without_suffix || false);
      }
      return "";
    };
  };

  module.filter("momentFromNow", momentFromNow);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common/history.coffee
 */

(function() {
  var HistoryController, HistoryDirective, bindOnce, debounce, module, taiga, trim,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  trim = this.taiga.trim;

  bindOnce = this.taiga.bindOnce;

  debounce = this.taiga.debounce;

  module = angular.module("taigaCommon");

  HistoryController = (function(superClass) {
    extend(HistoryController, superClass);

    HistoryController.$inject = ["$scope", "$tgRepo", "$tgResources"];

    function HistoryController(scope, repo, rs) {
      this.scope = scope;
      this.repo = repo;
      this.rs = rs;
    }

    HistoryController.prototype.initialize = function(type, objectId) {
      this.type = type;
      return this.objectId = objectId;
    };

    HistoryController.prototype.loadHistory = function(type, objectId) {
      return this.rs.history.get(type, objectId).then((function(_this) {
        return function(history) {
          var historyResult, i, len;
          for (i = 0, len = history.length; i < len; i++) {
            historyResult = history[i];
            if (historyResult.values_diff.description_diff != null) {
              historyResult.values_diff.description = historyResult.values_diff.description_diff;
            }
            delete historyResult.values_diff.description_html;
            delete historyResult.values_diff.description_diff;
            if (historyResult.values_diff.blocked_note_diff != null) {
              historyResult.values_diff.blocked_note = historyResult.values_diff.blocked_note_diff;
            }
            delete historyResult.values_diff.blocked_note_html;
            delete historyResult.values_diff.blocked_note_diff;
          }
          _this.scope.history = history;
          return _this.scope.comments = _.filter(history, function(item) {
            return item.comment !== "";
          });
        };
      })(this));
    };

    HistoryController.prototype.deleteComment = function(type, objectId, activityId) {
      return this.rs.history.deleteComment(type, objectId, activityId).then((function(_this) {
        return function() {
          return _this.loadHistory(type, objectId);
        };
      })(this));
    };

    HistoryController.prototype.undeleteComment = function(type, objectId, activityId) {
      return this.rs.history.undeleteComment(type, objectId, activityId).then((function(_this) {
        return function() {
          return _this.loadHistory(type, objectId);
        };
      })(this));
    };

    return HistoryController;

  })(taiga.Controller);

  HistoryDirective = function($log, $loading, $qqueue, $template, $confirm, $translate, $compile, $navUrls, $rootScope) {
    var link, templateActivity, templateBase, templateBaseEntries, templateChangeAttachment, templateChangeDiff, templateChangeGeneric, templateChangeList, templateChangePoints, templateDeletedComment, templateFn;
    templateChangeDiff = $template.get("common/history/history-change-diff.html", true);
    templateChangePoints = $template.get("common/history/history-change-points.html", true);
    templateChangeGeneric = $template.get("common/history/history-change-generic.html", true);
    templateChangeAttachment = $template.get("common/history/history-change-attachment.html", true);
    templateChangeList = $template.get("common/history/history-change-list.html", true);
    templateDeletedComment = $template.get("common/history/history-deleted-comment.html", true);
    templateActivity = $template.get("common/history/history-activity.html", true);
    templateBaseEntries = $template.get("common/history/history-base-entries.html", true);
    templateBase = $template.get("common/history/history-base.html", true);
    link = function($scope, $el, $attrs, $ctrl) {
      var countChanges, formatChange, getHumanizedFieldName, getPrettyDateFormat, objectId, renderActivity, renderAttachmentEntry, renderChange, renderChangeEntries, renderChangeEntry, renderChangesHelperText, renderComment, renderComments, renderCustomAttributesEntry, renderHistory, save, showAllActivity, showAllComments, type;
      type = $attrs.type;
      objectId = null;
      showAllComments = false;
      showAllActivity = false;
      getPrettyDateFormat = function() {
        return $translate.instant("ACTIVITY.DATETIME");
      };
      bindOnce($scope, $attrs.ngModel, function(model) {
        type = $attrs.type;
        objectId = model.id;
        $ctrl.initialize(type, objectId);
        return $ctrl.loadHistory(type, objectId);
      });
      getHumanizedFieldName = function(field) {
        var humanizedFieldNames;
        humanizedFieldNames = {
          subject: $translate.instant("ACTIVITY.FIELDS.SUBJECT"),
          name: $translate.instant("ACTIVITY.FIELDS.NAME"),
          description: $translate.instant("ACTIVITY.FIELDS.DESCRIPTION"),
          content: $translate.instant("ACTIVITY.FIELDS.CONTENT"),
          status: $translate.instant("ACTIVITY.FIELDS.STATUS"),
          is_closed: $translate.instant("ACTIVITY.FIELDS.IS_CLOSED"),
          finish_date: $translate.instant("ACTIVITY.FIELDS.FINISH_DATE"),
          type: $translate.instant("ACTIVITY.FIELDS.TYPE"),
          priority: $translate.instant("ACTIVITY.FIELDS.PRIORITY"),
          severity: $translate.instant("ACTIVITY.FIELDS.SEVERITY"),
          assigned_to: $translate.instant("ACTIVITY.FIELDS.ASSIGNED_TO"),
          watchers: $translate.instant("ACTIVITY.FIELDS.WATCHERS"),
          milestone: $translate.instant("ACTIVITY.FIELDS.MILESTONE"),
          user_story: $translate.instant("ACTIVITY.FIELDS.USER_STORY"),
          project: $translate.instant("ACTIVITY.FIELDS.PROJECT"),
          is_blocked: $translate.instant("ACTIVITY.FIELDS.IS_BLOCKED"),
          blocked_note: $translate.instant("ACTIVITY.FIELDS.BLOCKED_NOTE"),
          points: $translate.instant("ACTIVITY.FIELDS.POINTS"),
          client_requirement: $translate.instant("ACTIVITY.FIELDS.CLIENT_REQUIREMENT"),
          team_requirement: $translate.instant("ACTIVITY.FIELDS.TEAM_REQUIREMENT"),
          is_iocaine: $translate.instant("ACTIVITY.FIELDS.IS_IOCAINE"),
          tags: $translate.instant("ACTIVITY.FIELDS.TAGS"),
          attachments: $translate.instant("ACTIVITY.FIELDS.ATTACHMENTS"),
          is_deprecated: $translate.instant("ACTIVITY.FIELDS.IS_DEPRECATED"),
          blocked_note: $translate.instant("ACTIVITY.FIELDS.BLOCKED_NOTE"),
          is_blocked: $translate.instant("ACTIVITY.FIELDS.IS_BLOCKED"),
          order: $translate.instant("ACTIVITY.FIELDS.ORDER"),
          backlog_order: $translate.instant("ACTIVITY.FIELDS.BACKLOG_ORDER"),
          sprint_order: $translate.instant("ACTIVITY.FIELDS.SPRINT_ORDER"),
          kanban_order: $translate.instant("ACTIVITY.FIELDS.KANBAN_ORDER"),
          taskboard_order: $translate.instant("ACTIVITY.FIELDS.TASKBOARD_ORDER"),
          us_order: $translate.instant("ACTIVITY.FIELDS.US_ORDER")
        };
        return humanizedFieldNames[field] || field;
      };
      countChanges = function(comment) {
        return _.keys(comment.values_diff).length;
      };
      formatChange = function(change) {
        if (_.isArray(change)) {
          if (change.length === 0) {
            return $translate.instant("ACTIVITY.VALUES.EMPTY");
          }
          return change.join(", ");
        }
        if (change === "") {
          return $translate.instant("ACTIVITY.VALUES.EMPTY");
        }
        if ((change == null) || change === false) {
          return $translate.instant("ACTIVITY.VALUES.NO");
        }
        if (change === true) {
          return $translate.instant("ACTIVITY.VALUES.YES");
        }
        return change;
      };
      renderAttachmentEntry = function(value) {
        var attachments;
        attachments = _.map(value, function(changes, type) {
          if (type === "new") {
            return _.map(changes, function(change) {
              return templateChangeDiff({
                name: $translate.instant("ACTIVITY.NEW_ATTACHMENT"),
                diff: change.filename
              });
            });
          } else if (type === "deleted") {
            return _.map(changes, function(change) {
              return templateChangeDiff({
                name: $translate.instant("ACTIVITY.DELETED_ATTACHMENT"),
                diff: change.filename
              });
            });
          } else {
            return _.map(changes, function(change) {
              var diff, name;
              name = $translate.instant("ACTIVITY.UPDATED_ATTACHMENT", {
                filename: change.filename
              });
              diff = _.map(change.changes, function(values, name) {
                return {
                  name: getHumanizedFieldName(name),
                  from: formatChange(values[0]),
                  to: formatChange(values[1])
                };
              });
              return templateChangeAttachment({
                name: name,
                diff: diff
              });
            });
          }
        });
        return _.flatten(attachments).join("\n");
      };
      renderCustomAttributesEntry = function(value) {
        var customAttributes;
        customAttributes = _.map(value, function(changes, type) {
          if (type === "new") {
            return _.map(changes, function(change) {
              var html;
              html = templateChangeGeneric({
                name: change.name,
                from: formatChange(""),
                to: formatChange(change.value)
              });
              html = $compile(html)($scope);
              return html[0].outerHTML;
            });
          } else if (type === "deleted") {
            return _.map(changes, function(change) {
              return templateChangeDiff({
                name: $translate.instant("ACTIVITY.DELETED_CUSTOM_ATTRIBUTE"),
                diff: change.name
              });
            });
          } else {
            return _.map(changes, function(change) {
              var customAttrsChanges;
              customAttrsChanges = _.map(change.changes, function(values) {
                return templateChangeGeneric({
                  name: change.name,
                  from: formatChange(values[0]),
                  to: formatChange(values[1])
                });
              });
              return _.flatten(customAttrsChanges).join("\n");
            });
          }
        });
        return _.flatten(customAttributes).join("\n");
      };
      renderChangeEntry = function(field, value) {
        var added, from, html, name, removed, to;
        if (field === "description") {
          return templateChangeDiff({
            name: getHumanizedFieldName("description"),
            diff: value[1]
          });
        } else if (field === "blocked_note") {
          return templateChangeDiff({
            name: getHumanizedFieldName("blocked_note"),
            diff: value[1]
          });
        } else if (field === "points") {
          html = templateChangePoints({
            points: value
          });
          html = $compile(html)($scope);
          return html[0].outerHTML;
        } else if (field === "attachments") {
          return renderAttachmentEntry(value);
        } else if (field === "custom_attributes") {
          return renderCustomAttributesEntry(value);
        } else if (field === "tags" || field === "watchers") {
          name = getHumanizedFieldName(field);
          removed = _.difference(value[0], value[1]);
          added = _.difference(value[1], value[0]);
          html = templateChangeList({
            name: name,
            removed: removed,
            added: added
          });
          html = $compile(html)($scope);
          return html[0].outerHTML;
        } else if (field === "assigned_to") {
          name = getHumanizedFieldName(field);
          from = formatChange(value[0] || $translate.instant("ACTIVITY.VALUES.UNASSIGNED"));
          to = formatChange(value[1] || $translate.instant("ACTIVITY.VALUES.UNASSIGNED"));
          return templateChangeGeneric({
            name: name,
            from: from,
            to: to
          });
        } else {
          name = getHumanizedFieldName(field);
          from = formatChange(value[0]);
          to = formatChange(value[1]);
          return templateChangeGeneric({
            name: name,
            from: from,
            to: to
          });
        }
      };
      renderChangeEntries = function(change) {
        return _.map(change.values_diff, function(value, field) {
          return renderChangeEntry(field, value);
        });
      };
      renderChangesHelperText = function(change) {
        var size;
        size = countChanges(change);
        return $translate.instant("ACTIVITY.SIZE_CHANGE", {
          size: size
        }, 'messageformat');
      };
      renderComment = function(comment) {
        var html, ref, ref1, ref2;
        if (comment.delete_comment_date || ((ref = comment.delete_comment_user) != null ? ref.name : void 0)) {
          html = templateDeletedComment({
            deleteCommentDate: comment.delete_comment_date ? moment(comment.delete_comment_date).format(getPrettyDateFormat()) : void 0,
            deleteCommentUser: comment.delete_comment_user.name,
            deleteComment: comment.comment_html,
            activityId: comment.id,
            canRestoreComment: $scope.user && (comment.delete_comment_user.pk === $scope.user.id || $scope.project.my_permissions.indexOf("modify_project") > -1)
          });
          html = $compile(html)($scope);
          return html[0].outerHTML;
        }
        html = templateActivity({
          avatar: comment.user.photo,
          userFullName: comment.user.name,
          userProfileUrl: comment.user.is_active ? $navUrls.resolve("user-profile", {
            username: comment.user.username
          }) : "",
          creationDate: moment(comment.created_at).format(getPrettyDateFormat()),
          comment: comment.comment_html,
          changesText: renderChangesHelperText(comment),
          changes: renderChangeEntries(comment),
          mode: "comment",
          deleteCommentDate: comment.delete_comment_date ? moment(comment.delete_comment_date).format(getPrettyDateFormat()) : void 0,
          deleteCommentUser: ((ref1 = comment.delete_comment_user) != null ? ref1.name : void 0) ? comment.delete_comment_user.name : void 0,
          activityId: comment.id,
          canDeleteComment: comment.user.pk === ((ref2 = $scope.user) != null ? ref2.id : void 0) || $scope.project.my_permissions.indexOf("modify_project") > -1
        });
        html = $compile(html)($scope);
        return html[0].outerHTML;
      };
      renderChange = function(change) {
        var ref;
        return templateActivity({
          avatar: change.user.photo,
          userFullName: change.user.name,
          userProfileUrl: change.user.is_active ? $navUrls.resolve("user-profile", {
            username: change.user.username
          }) : "",
          creationDate: moment(change.created_at).format(getPrettyDateFormat()),
          comment: change.comment_html,
          changes: renderChangeEntries(change),
          changesText: "",
          mode: "activity",
          deleteCommentDate: change.delete_comment_date ? moment(change.delete_comment_date).format(getPrettyDateFormat()) : void 0,
          deleteCommentUser: ((ref = change.delete_comment_user) != null ? ref.name : void 0) ? change.delete_comment_user.name : void 0,
          activityId: change.id
        });
      };
      renderHistory = function(entries, totalEntries) {
        var html, showMore;
        if (entries.length === totalEntries) {
          showMore = 0;
        } else {
          showMore = totalEntries - entries.length;
        }
        html = templateBaseEntries({
          entries: entries,
          showMore: showMore
        });
        html = $compile(html)($scope);
        return html;
      };
      renderComments = function() {
        var comments, html, totalComments;
        comments = $scope.comments || [];
        totalComments = comments.length;
        if (!showAllComments) {
          comments = _.last(comments, 4);
        }
        comments = _.map(comments, function(x) {
          return renderComment(x);
        });
        html = renderHistory(comments, totalComments);
        return $el.find(".comments-list").html(html);
      };
      renderActivity = function() {
        var changes, html, totalChanges;
        changes = $scope.history || [];
        totalChanges = changes.length;
        if (!showAllActivity) {
          changes = _.last(changes, 4);
        }
        changes = _.map(changes, function(x) {
          return renderChange(x);
        });
        html = renderHistory(changes, totalChanges);
        return $el.find(".changes-list").html(html);
      };
      save = $qqueue.bindAdd((function(_this) {
        return function(target) {
          var model, onError, onSuccess;
          $scope.$broadcast("markdown-editor:submit");
          $el.find(".comment-list").addClass("activeanimation");
          onSuccess = function() {
            $rootScope.$broadcast("comment:new");
            return $ctrl.loadHistory(type, objectId)["finally"](function() {
              return $loading.finish(target);
            });
          };
          onError = function() {
            $loading.finish(target);
            return $confirm.notify("error");
          };
          model = $scope.$eval($attrs.ngModel);
          $loading.start(target);
          return $ctrl.repo.save(model).then(onSuccess, onError);
        };
      })(this));
      $scope.$watch("comments", renderComments);
      $scope.$watch("history", renderActivity);
      $scope.$on("object:updated", function() {
        return $ctrl.loadHistory(type, objectId);
      });
      $el.on("click", ".add-comment input.button-green", debounce(2000, function(event) {
        var target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        return save(target);
      }));
      $el.on("click", "a", function(event) {
        var href, target;
        target = angular.element(event.target);
        href = target.attr('href');
        if (href && href.indexOf("#") === 0) {
          event.preventDefault();
          return $('body').scrollTop($(href).offset().top);
        }
      });
      $el.on("click", ".show-more", function(event) {
        var target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        if (target.parent().is(".changes-list")) {
          showAllActivity = !showAllActivity;
          return renderActivity();
        } else {
          showAllComments = !showAllComments;
          return renderComments();
        }
      });
      $el.on("click", ".show-deleted-comment", function(event) {
        var target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        target.parents('.activity-single').find('.hide-deleted-comment').show();
        target.parents('.activity-single').find('.show-deleted-comment').hide();
        return target.parents('.activity-single').find('.comment-body').show();
      });
      $el.on("click", ".hide-deleted-comment", function(event) {
        var target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        target.parents('.activity-single').find('.hide-deleted-comment').hide();
        target.parents('.activity-single').find('.show-deleted-comment').show();
        return target.parents('.activity-single').find('.comment-body').hide();
      });
      $el.on("click", ".changes-title", function(event) {
        var target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        return target.parent().find(".change-entry").toggleClass("active");
      });
      $el.on("focus", ".add-comment textarea", function(event) {
        return $(this).addClass('active');
      });
      $el.on("click", ".history-tabs li a", function(event) {
        var target;
        target = angular.element(event.currentTarget);
        $el.find(".history-tabs li a").removeClass("active");
        target.addClass("active");
        $el.find(".history section").addClass("hidden");
        return $el.find(".history section." + (target.data('section-class'))).removeClass("hidden");
      });
      $el.on("click", ".comment-delete", debounce(2000, function(event) {
        var activityId, target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        activityId = target.data('activity-id');
        return $ctrl.deleteComment(type, objectId, activityId);
      }));
      $el.on("click", ".comment-restore", debounce(2000, function(event) {
        var activityId, target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        activityId = target.data('activity-id');
        return $ctrl.undeleteComment(type, objectId, activityId);
      }));
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    templateFn = function($el, $attrs) {
      var html;
      html = templateBase({
        ngmodel: $attrs.ngModel,
        type: $attrs.type,
        mode: $attrs.mode
      });
      return html;
    };
    return {
      controller: HistoryController,
      template: templateFn,
      restrict: "AE",
      link: link
    };
  };

  module.directive("tgHistory", ["$log", "$tgLoading", "$tgQqueue", "$tgTemplate", "$tgConfirm", "$translate", "$compile", "$tgNavUrls", "$rootScope", HistoryDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common/importer.coffee
 */

(function() {
  var ImportProjectButtonDirective, module;

  module = angular.module("taigaCommon");

  ImportProjectButtonDirective = function($rs, $confirm, $location, $navUrls, $translate) {
    var link;
    link = function($scope, $el, $attrs) {
      $el.on("click", ".import-project-button", function(event) {
        event.preventDefault();
        $el.find("input.import-file").val("");
        return $el.find("input.import-file").trigger("click");
      });
      return $el.on("change", "input.import-file", function(event) {
        var file, loader, onError, onSuccess;
        event.preventDefault();
        file = event.target.files[0];
        if (!file) {
          return;
        }
        loader = $confirm.loader($translate.instant("PROJECT.IMPORT.UPLOADING_FILE"));
        onSuccess = function(result) {
          var ctx, message, msg, title;
          loader.stop();
          if (result.status === 202) {
            title = $translate.instant("PROJECT.IMPORT.ASYNC_IN_PROGRESS_TITLE");
            message = $translate.instant("PROJECT.IMPORT.ASYNC_IN_PROGRESS_MESSAGE");
            return $confirm.success(title, message);
          } else {
            ctx = {
              project: result.data.slug
            };
            $location.path($navUrls.resolve("project-admin-project-profile-details", ctx));
            msg = $translate.instant("PROJECT.IMPORT.SYNC_SUCCESS");
            return $confirm.notify("success", msg);
          }
        };
        onError = function(result) {
          var errorMsg, ref;
          loader.stop();
          errorMsg = $translate.instant("PROJECT.IMPORT.ERROR");
          if (result.status === 429) {
            errorMsg = $translate.instant("PROJECT.IMPORT.ERROR_TOO_MANY_REQUEST");
          } else if ((ref = result.data) != null ? ref._error_message : void 0) {
            errorMsg = $translate.instant("PROJECT.IMPORT.ERROR_MESSAGE", {
              error_message: result.data._error_message
            });
          }
          return $confirm.notify("error", errorMsg);
        };
        loader.start();
        return $rs.projects["import"](file, loader.update).then(onSuccess, onError);
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgImportProjectButton", ["$tgResources", "$tgConfirm", "$location", "$tgNavUrls", "$translate", ImportProjectButtonDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common/lightboxes.coffee
 */

(function() {
  var AssignedToLightboxDirective, BlockLightboxDirective, BlockingMessageInputDirective, CreateBulkUserstoriesDirective, CreateEditUserstoryDirective, LightboxDirective, LightboxKeyboardNavigationService, LightboxService, WatchersLightboxDirective, bindOnce, debounce, module, timeout,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module = angular.module("taigaCommon");

  bindOnce = this.taiga.bindOnce;

  timeout = this.taiga.timeout;

  debounce = this.taiga.debounce;

  LightboxService = (function(superClass) {
    extend(LightboxService, superClass);

    function LightboxService(animationFrame, q) {
      this.animationFrame = animationFrame;
      this.q = q;
    }

    LightboxService.prototype.open = function($el) {
      var defered, docEl, lightboxContent;
      defered = this.q.defer();
      lightboxContent = $el.children().not(".close");
      lightboxContent.hide();
      $el.css('display', 'flex');
      this.animationFrame.add((function(_this) {
        return function() {
          $el.addClass("open");
          return _this.animationFrame.add(function() {
            return $el.find('input,textarea').first().focus();
          });
        };
      })(this));
      this.animationFrame.add((function(_this) {
        return function() {
          lightboxContent.show();
          return defered.resolve();
        };
      })(this));
      docEl = angular.element(document);
      docEl.on("keydown.lightbox", (function(_this) {
        return function(e) {
          var code;
          code = e.keyCode ? e.keyCode : e.which;
          if (code === 27) {
            return _this.close($el);
          }
        };
      })(this));
      return defered.promise;
    };

    LightboxService.prototype.close = function($el) {
      var docEl, scope;
      docEl = angular.element(document);
      docEl.off(".lightbox");
      docEl.off(".keyboard-navigation");
      $el.one("transitionend", (function(_this) {
        return function() {
          $el.removeAttr('style');
          return $el.removeClass("open").removeClass('close');
        };
      })(this));
      $el.addClass('close');
      if ($el.hasClass("remove-on-close")) {
        scope = $el.data("scope");
        scope.$destroy();
        return $el.remove();
      }
    };

    LightboxService.prototype.closeAll = function() {
      var docEl, i, len, lightboxEl, ref, results;
      docEl = angular.element(document);
      ref = docEl.find(".lightbox.open");
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        lightboxEl = ref[i];
        results.push(this.close($(lightboxEl)));
      }
      return results;
    };

    return LightboxService;

  })(taiga.Service);

  module.service("lightboxService", ["animationFrame", "$q", LightboxService]);

  LightboxKeyboardNavigationService = (function(superClass) {
    extend(LightboxKeyboardNavigationService, superClass);

    function LightboxKeyboardNavigationService() {
      return LightboxKeyboardNavigationService.__super__.constructor.apply(this, arguments);
    }

    LightboxKeyboardNavigationService.prototype.stop = function() {
      var docEl;
      docEl = angular.element(document);
      return docEl.off(".keyboard-navigation");
    };

    LightboxKeyboardNavigationService.prototype.dispatch = function($el, code) {
      var activeElement, next, prev;
      activeElement = $el.find(".active");
      if (code === 13) {
        if ($el.find(".watcher-single").length === 1) {
          return $el.find('.watcher-single:first').trigger("click");
        } else {
          return activeElement.trigger("click");
        }
      } else if (code === 40) {
        if (!activeElement.length) {
          return $el.find('.watcher-single:first').addClass('active');
        } else {
          next = activeElement.next('.watcher-single');
          if (next.length) {
            activeElement.removeClass('active');
            return next.addClass('active');
          }
        }
      } else if (code === 38) {
        if (!activeElement.length) {
          return $el.find('.watcher-single:last').addClass('active');
        } else {
          prev = activeElement.prev('.watcher-single');
          if (prev.length) {
            activeElement.removeClass('active');
            return prev.addClass('active');
          }
        }
      }
    };

    LightboxKeyboardNavigationService.prototype.init = function($el) {
      var docEl;
      this.stop();
      docEl = angular.element(document);
      return docEl.on("keydown.keyboard-navigation", (function(_this) {
        return function(event) {
          var code;
          code = event.keyCode ? event.keyCode : event.which;
          if (code === 40 || code === 38 || code === 13) {
            event.preventDefault();
            return _this.dispatch($el, code);
          }
        };
      })(this));
    };

    return LightboxKeyboardNavigationService;

  })(taiga.Service);

  module.service("lightboxKeyboardNavigationService", LightboxKeyboardNavigationService);

  LightboxDirective = function(lightboxService) {
    var link;
    link = function($scope, $el, $attrs) {
      return $el.on("click", ".close", function(event) {
        event.preventDefault();
        return lightboxService.close($el);
      });
    };
    return {
      restrict: "C",
      link: link
    };
  };

  module.directive("lightbox", ["lightboxService", LightboxDirective]);

  BlockLightboxDirective = function($rootscope, $tgrepo, $confirm, lightboxService, $loading, $qqueue, $translate) {
    var link;
    link = function($scope, $el, $attrs, $model) {
      var block, title, unblock;
      title = $translate.instant($attrs.title);
      $el.find("h2.title").text(title);
      unblock = $qqueue.bindAdd((function(_this) {
        return function(item, finishCallback) {
          var promise;
          promise = $tgrepo.save(item);
          promise.then(function() {
            $confirm.notify("success");
            $rootscope.$broadcast("object:updated");
            $model.$setViewValue(item);
            return finishCallback();
          });
          promise.then(null, function() {
            $confirm.notify("error");
            item.revert();
            return $model.$setViewValue(item);
          });
          promise["finally"](function() {
            return finishCallback();
          });
          return promise;
        };
      })(this));
      block = $qqueue.bindAdd((function(_this) {
        return function(item) {
          var promise;
          $model.$setViewValue(item);
          $loading.start($el.find(".button-green"));
          promise = $tgrepo.save($model.$modelValue);
          promise.then(function() {
            $confirm.notify("success");
            return $rootscope.$broadcast("object:updated");
          });
          promise.then(null, function() {
            $confirm.notify("error");
            item.revert();
            return $model.$setViewValue(item);
          });
          return promise["finally"](function() {
            $loading.finish($el.find(".button-green"));
            return lightboxService.close($el);
          });
        };
      })(this));
      $scope.$on("block", function() {
        $el.find(".reason").val($model.$modelValue.blocked_note);
        return lightboxService.open($el);
      });
      $scope.$on("unblock", (function(_this) {
        return function(event, model, finishCallback) {
          var item;
          item = $model.$modelValue.clone();
          item.is_blocked = false;
          item.blocked_note = "";
          return unblock(item, finishCallback);
        };
      })(this));
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      return $el.on("click", ".button-green", function(event) {
        var item;
        event.preventDefault();
        item = $model.$modelValue.clone();
        item.is_blocked = true;
        item.blocked_note = $el.find(".reason").val();
        return block(item);
      });
    };
    return {
      templateUrl: "common/lightbox/lightbox-block.html",
      link: link,
      require: "ngModel"
    };
  };

  module.directive("tgLbBlock", ["$rootScope", "$tgRepo", "$tgConfirm", "lightboxService", "$tgLoading", "$tgQqueue", "$translate", BlockLightboxDirective]);

  BlockingMessageInputDirective = function($log, $template, $compile) {
    var link, template, templateFn;
    template = $template.get("common/lightbox/lightbox-blocking-message-input.html", true);
    link = function($scope, $el, $attrs, $model) {
      if (!$attrs.watch) {
        return $log.error("No watch attribute on tg-blocking-message-input directive");
      }
      return $scope.$watch($attrs.watch, function(value) {
        if (value === !void 0 && value === true) {
          return $el.find(".blocked-note").removeClass("hidden");
        } else {
          return $el.find(".blocked-note").addClass("hidden");
        }
      });
    };
    templateFn = function($el, $attrs) {
      return template({
        ngmodel: $attrs.ngModel
      });
    };
    return {
      template: templateFn,
      link: link,
      require: "ngModel",
      restrict: "EA"
    };
  };

  module.directive("tgBlockingMessageInput", ["$log", "$tgTemplate", "$compile", BlockingMessageInputDirective]);

  CreateEditUserstoryDirective = function($repo, $model, $rs, $rootScope, lightboxService, $loading, $translate) {
    var link;
    link = function($scope, $el, attrs) {
      var submit, submitButton;
      $scope.isNew = true;
      $scope.$on("usform:new", function(ctx, projectId, status, statusList) {
        $scope.isNew = true;
        $scope.usStatusList = statusList;
        $scope.us = $model.make_model("userstories", {
          project: projectId,
          points: {},
          status: status,
          is_archived: false,
          tags: []
        });
        $el.find(".button-green").html($translate.instant("COMMON.CREATE"));
        $el.find(".title").html($translate.instant("LIGHTBOX.CREATE_EDIT_US.NEW_US"));
        $el.find(".tag-input").val("");
        $el.find(".blocked-note").addClass("hidden");
        $el.find("label.blocked").removeClass("selected");
        $el.find("label.team-requirement").removeClass("selected");
        $el.find("label.client-requirement").removeClass("selected");
        return lightboxService.open($el);
      });
      $scope.$on("usform:edit", function(ctx, us) {
        $scope.us = us;
        $scope.isNew = false;
        $el.find(".button-green").html($translate.instant("COMMON.SAVE"));
        $el.find(".title").html($translate.instant("LIGHTBOX.CREATE_EDIT_US.EDIT_US"));
        $el.find(".tag-input").val("");
        if (us.is_blocked) {
          $el.find(".blocked-note").removeClass("hidden");
          $el.find("label.blocked").addClass("selected");
        } else {
          $el.find(".blocked-note").addClass("hidden");
          $el.find("label.blocked").removeClass("selected");
        }
        if (us.team_requirement) {
          $el.find("label.team-requirement").addClass("selected");
        } else {
          $el.find("label.team-requirement").removeClass("selected");
        }
        if (us.client_requirement) {
          $el.find("label.client-requirement").addClass("selected");
        } else {
          $el.find("label.client-requirement").removeClass("selected");
        }
        return lightboxService.open($el);
      });
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var broadcastEvent, form, promise;
          event.preventDefault();
          form = $el.find("form").checksley();
          if (!form.validate()) {
            return;
          }
          $loading.start(submitButton);
          if ($scope.isNew) {
            promise = $repo.create("userstories", $scope.us);
            broadcastEvent = "usform:new:success";
          } else {
            promise = $repo.save($scope.us);
            broadcastEvent = "usform:edit:success";
          }
          promise.then(function(data) {
            $loading.finish(submitButton);
            lightboxService.close($el);
            return $rootScope.$broadcast(broadcastEvent, data);
          });
          return promise.then(null, function(data) {
            $loading.finish(submitButton);
            form.setErrors(data);
            if (data._error_message) {
              return $confirm.notify("error", data._error_message);
            }
          });
        };
      })(this));
      submitButton = $el.find(".submit-button");
      $el.on("submit", "form", submit);
      $el.on("click", ".close", function(event) {
        event.preventDefault();
        $scope.$apply(function() {
          return $scope.us.revert();
        });
        return lightboxService.close($el);
      });
      $el.keydown(function(event) {
        var code;
        code = event.keyCode ? event.keyCode : event.which;
        if (code === 27) {
          lightboxService.close($el);
          return $scope.$apply(function() {
            return $scope.us.revert();
          });
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgLbCreateEditUserstory", ["$tgRepo", "$tgModel", "$tgResources", "$rootScope", "lightboxService", "$tgLoading", "$translate", CreateEditUserstoryDirective]);

  CreateBulkUserstoriesDirective = function($repo, $rs, $rootscope, lightboxService, $loading) {
    var link;
    link = function($scope, $el, attrs) {
      var submit, submitButton;
      $scope.$on("usform:bulk", function(ctx, projectId, status) {
        $scope["new"] = {
          projectId: projectId,
          statusId: status,
          bulk: ""
        };
        return lightboxService.open($el);
      });
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var form, promise;
          event.preventDefault();
          form = $el.find("form").checksley({
            onlyOneErrorElement: true
          });
          if (!form.validate()) {
            return;
          }
          $loading.start(submitButton);
          promise = $rs.userstories.bulkCreate($scope["new"].projectId, $scope["new"].statusId, $scope["new"].bulk);
          promise.then(function(result) {
            $loading.finish(submitButton);
            $rootscope.$broadcast("usform:bulk:success", result);
            return lightboxService.close($el);
          });
          return promise.then(null, function(data) {
            $loading.finish(submitButton);
            form.setErrors(data);
            if (data._error_message) {
              return $confirm.notify("error", data._error_message);
            }
          });
        };
      })(this));
      submitButton = $el.find(".submit-button");
      $el.on("submit", "form", submit);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgLbCreateBulkUserstories", ["$tgRepo", "$tgResources", "$rootScope", "lightboxService", "$tgLoading", CreateBulkUserstoriesDirective]);

  AssignedToLightboxDirective = function(lightboxService, lightboxKeyboardNavigationService, $template, $compile) {
    var link;
    link = function($scope, $el, $attrs) {
      var closeLightbox, filterUsers, normalizeString, render, selectedItem, selectedUser, usersTemplate;
      selectedUser = null;
      selectedItem = null;
      usersTemplate = $template.get("common/lightbox/lightbox-assigned-to-users.html", true);
      normalizeString = function(string) {
        var normalizedString;
        normalizedString = string;
        normalizedString = normalizedString.replace("Á", "A").replace("Ä", "A").replace("À", "A");
        normalizedString = normalizedString.replace("É", "E").replace("Ë", "E").replace("È", "E");
        normalizedString = normalizedString.replace("Í", "I").replace("Ï", "I").replace("Ì", "I");
        normalizedString = normalizedString.replace("Ó", "O").replace("Ö", "O").replace("Ò", "O");
        normalizedString = normalizedString.replace("Ú", "U").replace("Ü", "U").replace("Ù", "U");
        return normalizedString;
      };
      filterUsers = function(text, user) {
        var username;
        username = user.full_name_display.toUpperCase();
        username = normalizeString(username);
        text = text.toUpperCase();
        text = normalizeString(text);
        return _.contains(username, text);
      };
      render = function(selected, text) {
        var ctx, html, users;
        users = _.clone($scope.activeUsers, true);
        if (selected != null) {
          users = _.reject(users, {
            "id": selected.id
          });
        }
        if (text != null) {
          users = _.filter(users, _.partial(filterUsers, text));
        }
        ctx = {
          selected: selected,
          users: _.first(users, 5),
          showMore: users.length > 5
        };
        html = usersTemplate(ctx);
        html = $compile(html)($scope);
        return $el.find("div.watchers").html(html);
      };
      closeLightbox = function() {
        lightboxKeyboardNavigationService.stop();
        return lightboxService.close($el);
      };
      $scope.$on("assigned-to:add", function(ctx, item) {
        var assignedToId;
        selectedItem = item;
        assignedToId = item.assigned_to;
        selectedUser = $scope.usersById[assignedToId];
        render(selectedUser);
        return lightboxService.open($el).then(function() {
          $el.find('input').focus();
          return lightboxKeyboardNavigationService.init($el);
        });
      });
      $scope.$watch("usersSearch", function(searchingText) {
        if (searchingText != null) {
          render(selectedUser, searchingText);
          return $el.find('input').focus();
        }
      });
      $el.on("click", ".watcher-single", function(event) {
        var target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        closeLightbox();
        return $scope.$apply(function() {
          $scope.$broadcast("assigned-to:added", target.data("user-id"), selectedItem);
          return $scope.usersSearch = null;
        });
      });
      $el.on("click", ".remove-assigned-to", function(event) {
        event.preventDefault();
        event.stopPropagation();
        closeLightbox();
        return $scope.$apply(function() {
          $scope.usersSearch = null;
          return $scope.$broadcast("assigned-to:added", null, selectedItem);
        });
      });
      $el.on("click", ".close", function(event) {
        event.preventDefault();
        closeLightbox();
        return $scope.$apply(function() {
          return $scope.usersSearch = null;
        });
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      templateUrl: "common/lightbox/lightbox-assigned-to.html",
      link: link
    };
  };

  module.directive("tgLbAssignedto", ["lightboxService", "lightboxKeyboardNavigationService", "$tgTemplate", "$compile", AssignedToLightboxDirective]);

  WatchersLightboxDirective = function($repo, lightboxService, lightboxKeyboardNavigationService, $template, $compile) {
    var link;
    link = function($scope, $el, $attrs) {
      var closeLightbox, getFilteredUsers, render, selectedItem, usersTemplate;
      selectedItem = null;
      usersTemplate = $template.get("common/lightbox/lightbox-assigned-to-users.html", true);
      getFilteredUsers = function(text) {
        var _filterUsers, users;
        if (text == null) {
          text = "";
        }
        _filterUsers = function(text, user) {
          var username;
          if (selectedItem && _.find(selectedItem.watchers, function(x) {
            return x === user.id;
          })) {
            return false;
          }
          username = user.full_name_display.toUpperCase();
          text = text.toUpperCase();
          return _.contains(username, text);
        };
        users = _.clone($scope.activeUsers, true);
        users = _.filter(users, _.partial(_filterUsers, text));
        return users;
      };
      render = function(users) {
        var ctx, html;
        ctx = {
          selected: false,
          users: _.first(users, 5),
          showMore: users.length > 5
        };
        html = usersTemplate(ctx);
        html = $compile(html)($scope);
        return $el.find("div.watchers").html(html);
      };
      closeLightbox = function() {
        lightboxKeyboardNavigationService.stop();
        return lightboxService.close($el);
      };
      $scope.$on("watcher:add", function(ctx, item) {
        var users;
        selectedItem = item;
        users = getFilteredUsers();
        render(users);
        return lightboxService.open($el).then(function() {
          $el.find("input").focus();
          return lightboxKeyboardNavigationService.init($el);
        });
      });
      $scope.$watch("usersSearch", function(searchingText) {
        var users;
        if (searchingText == null) {
          return;
        }
        users = getFilteredUsers(searchingText);
        render(users);
        return $el.find("input").focus();
      });
      $el.on("click", ".watcher-single", debounce(2000, function(event) {
        var target;
        closeLightbox();
        event.preventDefault();
        target = angular.element(event.currentTarget);
        return $scope.$apply(function() {
          $scope.usersSearch = null;
          return $scope.$broadcast("watcher:added", target.data("user-id"));
        });
      }));
      $el.on("click", ".close", function(event) {
        event.preventDefault();
        closeLightbox();
        return $scope.$apply(function() {
          return $scope.usersSearch = null;
        });
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      templateUrl: "common/lightbox/lightbox-users.html",
      link: link
    };
  };

  module.directive("tgLbWatchers", ["$tgRepo", "lightboxService", "lightboxKeyboardNavigationService", "$tgTemplate", "$compile", WatchersLightboxDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
 * Copyright (C) 2014 Juan Francisco Alcántara <juanfran.alcantara@kaleidos.net>
 * Copyright (C) 2014 Alejandro Alonso <alejandro.alonso@kaleidos.net>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common/loader.coffee
 */

(function() {
  var Loader, LoaderDirective, module, sizeFormat, taiga, timeout;

  taiga = this.taiga;

  sizeFormat = this.taiga.sizeFormat;

  timeout = this.taiga.timeout;

  module = angular.module("taigaCommon");

  LoaderDirective = function(tgLoader, $rootscope) {
    var link;
    link = function($scope, $el, $attrs) {
      tgLoader.onStart(function() {
        $(document.body).addClass("loader-active");
        return $el.addClass("active");
      });
      return tgLoader.onEnd(function() {
        $(document.body).removeClass("loader-active");
        return $el.removeClass("active");
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgLoader", ["tgLoader", "$rootScope", LoaderDirective]);

  Loader = function($rootscope) {
    var autoClose, config, lastResponseDate, open, pageLoaded, requestCount, start, startLoadTime;
    config = {
      minTime: 300
    };
    open = false;
    startLoadTime = 0;
    requestCount = 0;
    lastResponseDate = 0;
    pageLoaded = function(force) {
      var diff, endTime, timeoutValue;
      if (force == null) {
        force = false;
      }
      if (startLoadTime) {
        timeoutValue = 0;
        if (!force) {
          endTime = new Date().getTime();
          diff = endTime - startLoadTime;
          if (diff < config.minTime) {
            timeoutValue = config.minTime - diff;
          }
        }
        timeout(timeoutValue, function() {
          $rootscope.$broadcast("loader:end");
          open = false;
          return window.prerenderReady = true;
        });
      }
      startLoadTime = 0;
      requestCount = 0;
      return lastResponseDate = 0;
    };
    autoClose = function() {
      var intervalAuto, maxAuto, timeoutAuto;
      maxAuto = 5000;
      timeoutAuto = setTimeout((function() {
        pageLoaded();
        return clearInterval(intervalAuto);
      }), maxAuto);
      return intervalAuto = setInterval((function() {
        if (lastResponseDate && requestCount === 0) {
          pageLoaded();
          clearInterval(intervalAuto);
          return clearTimeout(timeoutAuto);
        }
      }), 50);
    };
    start = function() {
      startLoadTime = new Date().getTime();
      $rootscope.$broadcast("loader:start");
      return open = true;
    };
    return {
      pageLoaded: pageLoaded,
      start: function(auto) {
        if (auto == null) {
          auto = false;
        }
        if (!open) {
          start();
          if (auto) {
            return autoClose();
          }
        }
      },
      onStart: function(fn) {
        return $rootscope.$on("loader:start", fn);
      },
      onEnd: function(fn) {
        return $rootscope.$on("loader:end", fn);
      },
      logRequest: function() {
        return requestCount++;
      },
      logResponse: function() {
        requestCount--;
        return lastResponseDate = new Date().getTime();
      }
    };
  };

  Loader.$inject = ["$rootScope"];

  module.factory("tgLoader", Loader);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/lightboxes.coffee
 */

(function() {
  var LoadingDirective, TgLoadingService, module,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module = angular.module("taigaCommon");

  TgLoadingService = (function(superClass) {
    extend(TgLoadingService, superClass);

    function TgLoadingService() {
      return TgLoadingService.__super__.constructor.apply(this, arguments);
    }

    TgLoadingService.prototype.start = function(target) {
      if (!target.hasClass('loading')) {
        target.data('loading-old-content', target.html());
        target.addClass('loading');
        return target.html("<img class='loading-spinner' src='/svg/spinner-circle.svg' alt='loading...' />");
      }
    };

    TgLoadingService.prototype.finish = function(target) {
      var oldContent;
      if (target.hasClass('loading')) {
        oldContent = target.data('loading-old-content');
        target.data('loading-old-content', null);
        target.html(oldContent);
        return target.removeClass('loading');
      }
    };

    return TgLoadingService;

  })(taiga.Service);

  module.service("$tgLoading", TgLoadingService);

  LoadingDirective = function($loading) {
    var link;
    link = function($scope, $el, attr) {
      return $scope.$watch(attr.tgLoading, (function(_this) {
        return function(showLoading) {
          if (showLoading) {
            return $loading.start($el);
          } else {
            return $loading.finish($el);
          }
        };
      })(this));
    };
    return {
      link: link
    };
  };

  module.directive("tgLoading", ["$tgLoading", LoadingDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common/popovers.coffee
 */

(function() {
  var RelatedTaskStatusDirective, UsStatusDirective, bindOnce, debounce, module, taiga;

  taiga = this.taiga;

  bindOnce = this.taiga.bindOnce;

  debounce = this.taiga.debounce;

  module = angular.module("taigaCommon");

  UsStatusDirective = function($repo, $template) {

    /*
    Print the status of a US and a popover to change it.
    - tg-us-status: The user story
    - on-update: Method call after US is updated
    
    Example:
    
      div.status(tg-us-status="us" on-update="ctrl.loadSprintState()")
        a.us-status(href="", title="Status Name")
    
    NOTE: This directive need 'usStatusById' and 'project'.
     */
    var link, template;
    template = $template.get("common/popover/popover-us-status.html", true);
    link = function($scope, $el, $attrs) {
      var $ctrl, render, us;
      $ctrl = $el.controller();
      render = function(us) {
        var usStatusById, usStatusDom, usStatusDomParent;
        usStatusDomParent = $el.find(".us-status");
        usStatusDom = $el.find(".us-status .us-status-bind");
        usStatusById = $scope.usStatusById;
        if (usStatusById[us.status]) {
          usStatusDom.text(usStatusById[us.status].name);
          return usStatusDomParent.css("color", usStatusById[us.status].color);
        }
      };
      $el.on("click", ".us-status", function(event) {
        event.preventDefault();
        event.stopPropagation();
        return $el.find(".pop-status").popover().open();
      });
      $el.on("click", ".status", debounce(2000, function(event) {
        var target, us;
        event.preventDefault();
        event.stopPropagation();
        target = angular.element(event.currentTarget);
        us = $scope.$eval($attrs.tgUsStatus);
        us.status = target.data("status-id");
        render(us);
        $el.find(".pop-status").popover().close();
        return $scope.$apply(function() {
          return $repo.save(us).then(function() {
            return $scope.$eval($attrs.onUpdate);
          });
        });
      }));
      $scope.$on("userstories:loaded", function() {
        return render($scope.$eval($attrs.tgUsStatus));
      });
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      us = $scope.$eval($attrs.tgUsStatus);
      render(us);
      return bindOnce($scope, "project", function(project) {
        var html;
        html = template({
          "statuses": project.us_statuses
        });
        $el.append(html);
        if ($scope.project.my_permissions.indexOf("modify_us") === -1) {
          $el.unbind("click");
          return $el.find("a").addClass("not-clickable");
        }
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgUsStatus", ["$tgRepo", "$tgTemplate", UsStatusDirective]);

  RelatedTaskStatusDirective = function($repo, $template) {

    /*
    Print the status of a related task and a popover to change it.
    - tg-related-task-status: The related task
    - on-update: Method call after US is updated
    
    Example:
    
      div.status(tg-related-task-status="task" on-update="ctrl.loadSprintState()")
        a.task-status(href="", title="Status Name")
    
    NOTE: This directive need 'taskStatusById' and 'project'.
     */
    var link, selectionTemplate, updateTaskStatus;
    selectionTemplate = $template.get("common/popover/popover-related-task-status.html", true);
    updateTaskStatus = function($el, task, taskStatusById) {
      var taskStatusDom, taskStatusDomParent;
      taskStatusDomParent = $el.find(".us-status");
      taskStatusDom = $el.find(".task-status .task-status-bind");
      if (taskStatusById[task.status]) {
        taskStatusDom.text(taskStatusById[task.status].name);
        return taskStatusDomParent.css('color', taskStatusById[task.status].color);
      }
    };
    link = function($scope, $el, $attrs) {
      var $ctrl, autoSave, notAutoSave, task;
      $ctrl = $el.controller();
      task = $scope.$eval($attrs.tgRelatedTaskStatus);
      notAutoSave = $scope.$eval($attrs.notAutoSave);
      autoSave = !notAutoSave;
      $el.on("click", ".task-status", function(event) {
        event.preventDefault();
        event.stopPropagation();
        return $el.find(".pop-status").popover().open();
      });
      $el.on("click", ".status", debounce(2000, function(event) {
        var target;
        event.preventDefault();
        event.stopPropagation();
        target = angular.element(event.currentTarget);
        task.status = target.data("status-id");
        $el.find(".pop-status").popover().close();
        updateTaskStatus($el, task, $scope.taskStatusById);
        if (autoSave) {
          return $scope.$apply(function() {
            return $repo.save(task).then(function() {
              $scope.$eval($attrs.onUpdate);
              return $scope.$emit("related-tasks:status-changed");
            });
          });
        }
      }));
      taiga.bindOnce($scope, "project", function(project) {
        $el.append(selectionTemplate({
          'statuses': project.task_statuses
        }));
        updateTaskStatus($el, task, $scope.taskStatusById);
        if (project.my_permissions.indexOf("modify_task") === -1) {
          $el.unbind("click");
          return $el.find("a").addClass("not-clickable");
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgRelatedTaskStatus", ["$tgRepo", "$tgTemplate", RelatedTaskStatusDirective]);

  $.fn.popover = function() {
    var $el, close, closeAll, closePopover, isVisible, open;
    $el = this;
    isVisible = (function(_this) {
      return function() {
        var docViewBottom, docViewLeft, docViewRight, docViewTop, docViewWidth, elemBottom, elemLeft, elemRight, elemTop, elemWidth;
        $el.css({
          "display": "block",
          "visibility": "hidden"
        });
        docViewTop = $(window).scrollTop();
        docViewBottom = docViewTop + $(window).height();
        docViewWidth = $(window).width();
        docViewRight = docViewWidth;
        docViewLeft = 0;
        elemTop = $el.offset().top;
        elemBottom = elemTop + $el.height();
        elemWidth = $el.width();
        elemLeft = $el.offset().left;
        elemRight = $el.offset().left + elemWidth;
        $el.css({
          "display": "none",
          "visibility": "visible"
        });
        return (elemBottom <= docViewBottom) && (elemTop >= docViewTop) && (elemLeft >= docViewLeft) && (elemRight <= docViewRight);
      };
    })(this);
    closePopover = (function(_this) {
      return function(onClose) {
        if (onClose) {
          onClose.call($el);
        }
        $el.fadeOut(function() {
          return $el.removeClass("active").removeClass("fix");
        });
        return $el.off("popup:close");
      };
    })(this);
    closeAll = (function(_this) {
      return function() {
        return $(".popover.active").each(function() {
          return $(this).trigger("popup:close");
        });
      };
    })(this);
    open = (function(_this) {
      return function(onClose) {
        if ($el.hasClass("active")) {
          return close();
        } else {
          closeAll();
          if (!isVisible()) {
            $el.addClass("fix");
          }
          $el.fadeIn(function() {
            $el.addClass("active");
            $(document.body).off("popover");
            return $(document.body).one("click.popover", function() {
              return closeAll();
            });
          });
          return $el.on("popup:close", function(e) {
            return closePopover(onClose);
          });
        }
      };
    })(this);
    close = (function(_this) {
      return function() {
        return $el.trigger("popup:close");
      };
    })(this);
    return {
      open: open,
      close: close,
      closeAll: closeAll
    };
  };

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common/raven-logger.coffee
 */

(function() {
  var ExceptionHandlerFactory, module, taiga;

  taiga = this.taiga;

  module = angular.module("taigaCommon");

  ExceptionHandlerFactory = function($log, config) {
    var ravenConfig;
    this.config = config;
    ravenConfig = this.config.get("ravenConfig", null);
    if (ravenConfig) {
      $log.debug("Using the RavenJS exception handler.");
      Raven.config(ravenConfig).install();
      return function(exception, cause) {
        $log.error.apply($log, arguments);
        return Raven.captureException(exception);
      };
    } else {
      $log.debug("Using the default logging exception handler.");
      return function(exception, cause) {
        return $log.error.apply($log, arguments);
      };
    }
  };

  module.factory("$exceptionHandler", ["$log", "$tgConfig", ExceptionHandlerFactory]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common/tags.coffee
 */

(function() {
  var ColorizeTagsDirective, LbTagLineDirective, TagLineDirective, TagsDirective, bindOnce, module, taiga, trim,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  taiga = this.taiga;

  trim = this.taiga.trim;

  bindOnce = this.taiga.bindOnce;

  module = angular.module("taigaCommon");

  TagsDirective = function() {
    var formatter, link, parser;
    formatter = function(v) {
      if (_.isArray(v)) {
        return v.join(", ");
      }
      return "";
    };
    parser = function(v) {
      var result;
      if (!v) {
        return [];
      }
      result = _(v.split(",")).map(function(x) {
        return _.str.trim(x);
      });
      return result.value();
    };
    link = function($scope, $el, $attrs, $ctrl) {
      $ctrl.$formatters.push(formatter);
      $ctrl.$parsers.push(parser);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      require: "ngModel",
      link: link
    };
  };

  module.directive("tgTags", TagsDirective);

  ColorizeTagsDirective = function() {
    var link, templates;
    templates = {
      backlog: _.template("<% _.each(tags, function(tag) { %>\n    <span class=\"tag\" style=\"border-left: 5px solid <%- tag.color %>\"><%- tag.name %></span>\n<% }) %>"),
      kanban: _.template("<% _.each(tags, function(tag) { %>\n    <a class=\"kanban-tag\" href=\"\" style=\"border-color: <%- tag.color %>\" title=\"<%- tag.name %>\" />\n<% }) %>"),
      taskboard: _.template("<% _.each(tags, function(tag) { %>\n    <a class=\"taskboard-tag\" href=\"\" style=\"border-color: <%- tag.color %>\" title=\"<%- tag.name %>\" />\n<% }) %>")
    };
    link = function($scope, $el, $attrs, $ctrl) {
      var render;
      render = function(srcTags) {
        var html, tags, template;
        template = templates[$attrs.tgColorizeTagsType];
        srcTags.sort();
        tags = _.map(srcTags, function(tag) {
          var color;
          color = $scope.project.tags_colors[tag];
          return {
            name: tag,
            color: color
          };
        });
        html = template({
          tags: tags
        });
        return $el.html(html);
      };
      $scope.$watch($attrs.tgColorizeTags, function(tags) {
        if (tags != null) {
          return render(tags);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgColorizeTags", ColorizeTagsDirective);

  LbTagLineDirective = function($rs, $template, $compile) {
    var COMMA_KEY, ENTER_KEY, link, templateTags;
    ENTER_KEY = 13;
    COMMA_KEY = 188;
    templateTags = $template.get("common/tag/lb-tag-line-tags.html", true);
    link = function($scope, $el, $attrs, $model) {
      var addValue, deleteValue, hideSaveButton, removeInputLastCharacter, renderTags, resetInput, saveInputTag, showSaveButton;
      renderTags = function(tags, tagsColors) {
        var ctx, html;
        ctx = {
          tags: _.map(tags, function(t) {
            return {
              name: t,
              color: tagsColors[t]
            };
          })
        };
        _.map(ctx.tags, (function(_this) {
          return function(tag) {
            if (tag.color) {
              return tag.style = "border-left: 5px solid " + tag.color;
            }
          };
        })(this));
        html = $compile(templateTags(ctx))($scope);
        return $el.find("div.tags-container").html(html);
      };
      showSaveButton = function() {
        return $el.find(".save").removeClass("hidden");
      };
      hideSaveButton = function() {
        return $el.find(".save").addClass("hidden");
      };
      resetInput = function() {
        $el.find("input").val("");
        return $el.find("input").autocomplete("close");
      };
      addValue = function(value) {
        var tags;
        value = trim(value.toLowerCase());
        if (value.length === 0) {
          return;
        }
        tags = _.clone($model.$modelValue, false);
        if (tags == null) {
          tags = [];
        }
        if (indexOf.call(tags, value) < 0) {
          tags.push(value);
        }
        $scope.$apply(function() {
          return $model.$setViewValue(tags);
        });
        return hideSaveButton();
      };
      deleteValue = function(value) {
        var tags;
        value = trim(value.toLowerCase());
        if (value.length === 0) {
          return;
        }
        tags = _.clone($model.$modelValue, false);
        tags = _.pull(tags, value);
        return $scope.$apply(function() {
          return $model.$setViewValue(tags);
        });
      };
      saveInputTag = function() {
        var value;
        value = $el.find("input").val();
        addValue(value);
        return resetInput();
      };
      removeInputLastCharacter = (function(_this) {
        return function(input) {
          var inputValue;
          inputValue = input.val();
          return input.val(inputValue.substring(0, inputValue.length - 1));
        };
      })(this);
      $el.on("keypress", "input", function(event) {
        if (event.keyCode !== ENTER_KEY) {
          return;
        }
        return event.preventDefault();
      });
      $el.on("keyup", "input", function(event) {
        var target;
        target = angular.element(event.currentTarget);
        if (event.keyCode === ENTER_KEY) {
          return saveInputTag();
        } else if (event.keyCode === COMMA_KEY) {
          removeInputLastCharacter(target);
          return saveInputTag();
        } else {
          if (target.val().length) {
            return showSaveButton();
          } else {
            return hideSaveButton();
          }
        }
      });
      $el.on("click", ".save", function(event) {
        event.preventDefault();
        return saveInputTag();
      });
      $el.on("click", ".icon-delete", function(event) {
        var target, value;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        value = target.siblings(".tag-name").text();
        return deleteValue(value);
      });
      bindOnce($scope, "project", function(project) {
        var positioningFunction;
        positioningFunction = function(position, elements) {
          var menu;
          menu = elements.element.element;
          menu.css("width", elements.target.width);
          menu.css("top", position.top);
          return menu.css("left", position.left);
        };
        return $el.find("input").autocomplete({
          source: _.keys(project.tags_colors),
          position: {
            my: "left top",
            using: positioningFunction
          },
          select: function(event, ui) {
            addValue(ui.item.value);
            return ui.item.value = "";
          }
        });
      });
      $scope.$watch($attrs.ngModel, function(tags) {
        var ref, tagsColors;
        tagsColors = ((ref = $scope.project) != null ? ref.tags_colors : void 0) || [];
        return renderTags(tags, tagsColors);
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      require: "ngModel",
      templateUrl: "common/tag/lb-tag-line.html"
    };
  };

  module.directive("tgLbTagLine", ["$tgResources", "$tgTemplate", "$compile", LbTagLineDirective]);

  TagLineDirective = function($rootScope, $repo, $rs, $confirm, $qqueue, $template, $compile) {
    var COMMA_KEY, ENTER_KEY, ESC_KEY, link, templateTags;
    ENTER_KEY = 13;
    ESC_KEY = 27;
    COMMA_KEY = 188;
    templateTags = $template.get("common/tag/tags-line-tags.html", true);
    link = function($scope, $el, $attrs, $model) {
      var addValue, deleteValue, hideAddTagButton, hideAddTagButtonText, hideInput, hideSaveButton, isEditable, removeInputLastCharacter, renderInReadModeOnly, renderTags, resetInput, saveInputTag, showAddTagButton, showAddTagButtonText, showInput, showSaveButton;
      isEditable = function() {
        if ($attrs.requiredPerm != null) {
          return $scope.project.my_permissions.indexOf($attrs.requiredPerm) !== -1;
        }
        return true;
      };
      renderTags = function(tags, tagsColors) {
        var ctx, html;
        ctx = {
          tags: _.map(tags, function(t) {
            return {
              name: t,
              color: tagsColors[t]
            };
          }),
          isEditable: isEditable()
        };
        html = $compile(templateTags(ctx))($scope);
        return $el.find("div.tags-container").html(html);
      };
      renderInReadModeOnly = function() {
        $el.find(".add-tag").remove();
        $el.find("input").remove();
        return $el.find(".save").remove();
      };
      showAddTagButton = function() {
        return $el.find(".add-tag").removeClass("hidden");
      };
      hideAddTagButton = function() {
        return $el.find(".add-tag").addClass("hidden");
      };
      showAddTagButtonText = function() {
        return $el.find(".add-tag-text").removeClass("hidden");
      };
      hideAddTagButtonText = function() {
        return $el.find(".add-tag-text").addClass("hidden");
      };
      showSaveButton = function() {
        return $el.find(".save").removeClass("hidden");
      };
      hideSaveButton = function() {
        return $el.find(".save").addClass("hidden");
      };
      showInput = function() {
        return $el.find("input").removeClass("hidden").focus();
      };
      hideInput = function() {
        return $el.find("input").addClass("hidden").blur();
      };
      resetInput = function() {
        $el.find("input").val("");
        return $el.find("input").autocomplete("close");
      };
      addValue = $qqueue.bindAdd(function(value) {
        var model, onError, onSuccess, tags;
        value = trim(value.toLowerCase());
        if (value.length === 0) {
          return;
        }
        tags = _.clone($model.$modelValue.tags, false);
        if (tags == null) {
          tags = [];
        }
        if (indexOf.call(tags, value) < 0) {
          tags.push(value);
        }
        model = $model.$modelValue.clone();
        model.tags = tags;
        $model.$setViewValue(model);
        onSuccess = function() {
          return $rootScope.$broadcast("object:updated");
        };
        onError = function() {
          $confirm.notify("error");
          model.revert();
          return $model.$setViewValue(model);
        };
        $repo.save(model).then(onSuccess, onError);
        return hideSaveButton();
      });
      deleteValue = $qqueue.bindAdd(function(value) {
        var model, onError, onSuccess, tags;
        value = trim(value.toLowerCase());
        if (value.length === 0) {
          return;
        }
        tags = _.clone($model.$modelValue.tags, false);
        tags = _.pull(tags, value);
        model = $model.$modelValue.clone();
        model.tags = tags;
        $model.$setViewValue(model);
        onSuccess = function() {
          return $rootScope.$broadcast("object:updated");
        };
        onError = function() {
          $confirm.notify("error");
          model.revert();
          return $model.$setViewValue(model);
        };
        return $repo.save(model).then(onSuccess, onError);
      });
      saveInputTag = function() {
        var value;
        value = $el.find("input").val();
        addValue(value);
        return resetInput();
      };
      removeInputLastCharacter = (function(_this) {
        return function(input) {
          var inputValue;
          inputValue = input.val();
          return input.val(inputValue.substring(0, inputValue.length - 1));
        };
      })(this);
      $el.on("keypress", "input", function(event) {
        var ref;
        if ((ref = event.keyCode) !== ENTER_KEY && ref !== ESC_KEY) {
          return;
        }
        return event.preventDefault();
      });
      $el.on("keyup", "input", function(event) {
        var target;
        target = angular.element(event.currentTarget);
        if (event.keyCode === ENTER_KEY) {
          return saveInputTag();
        } else if (event.keyCode === COMMA_KEY) {
          removeInputLastCharacter(target);
          return saveInputTag();
        } else if (event.keyCode === ESC_KEY) {
          resetInput();
          hideInput();
          hideSaveButton();
          return showAddTagButton();
        } else {
          if (target.val().length) {
            return showSaveButton();
          } else {
            return hideSaveButton();
          }
        }
      });
      $el.on("click", ".save", function(event) {
        event.preventDefault();
        return saveInputTag();
      });
      $el.on("click", ".add-tag", function(event) {
        event.preventDefault();
        hideAddTagButton();
        return showInput();
      });
      $el.on("click", ".icon-delete", function(event) {
        var target, value;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        value = target.siblings(".tag-name").text();
        return deleteValue(value);
      });
      bindOnce($scope, "project.tags_colors", function(tags_colors) {
        var positioningFunction;
        if (!isEditable()) {
          renderInReadModeOnly();
          return;
        }
        showAddTagButton();
        positioningFunction = function(position, elements) {
          var menu;
          menu = elements.element.element;
          menu.css("width", elements.target.width);
          menu.css("top", position.top);
          return menu.css("left", position.left);
        };
        return $el.find("input").autocomplete({
          source: _.keys(tags_colors),
          position: {
            my: "left top",
            using: positioningFunction
          },
          select: function(event, ui) {
            addValue(ui.item.value);
            return ui.item.value = "";
          }
        });
      });
      $scope.$watch($attrs.ngModel, function(model) {
        var ref, ref1, tagsColors;
        if (!model) {
          return;
        }
        if ((ref = model.tags) != null ? ref.length : void 0) {
          hideAddTagButtonText();
        } else {
          showAddTagButtonText();
        }
        tagsColors = ((ref1 = $scope.project) != null ? ref1.tags_colors : void 0) || [];
        return renderTags(model.tags, tagsColors);
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      require: "ngModel",
      templateUrl: "common/tag/tag-line.html"
    };
  };

  module.directive("tgTagLine", ["$rootScope", "$tgRepo", "$tgResources", "$tgConfirm", "$tgQqueue", "$tgTemplate", "$compile", TagLineDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common/wisiwyg.coffee
 */

(function() {
  var MarkitupDirective, bindOnce, module, taiga,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  taiga = this.taiga;

  bindOnce = this.taiga.bindOnce;

  module = angular.module("taigaCommon");

  MarkitupDirective = function($rootscope, $rs, $selectedText, $template, $compile, $translate) {
    var link, previewTemplate;
    previewTemplate = $template.get("common/wysiwyg/wysiwyg-markitup-preview.html", true);
    link = function($scope, $el, $attrs, $model) {
      var addLine, closePreviewMode, element, markdownTitle, prepareUrlFormatting, preview, previewDomNode, renderMarkItUp, setCaretPosition, unbind, urlFormatting;
      element = angular.element($el);
      previewDomNode = $("<div/>", {
        "class": "preview"
      });
      closePreviewMode = function() {
        element.parents(".markdown").find(".preview").remove();
        return element.parents(".markItUp").show();
      };
      $scope.$on("markdown-editor:submit", function() {
        return closePreviewMode();
      });
      preview = function() {
        var markItUpDomNode, markdownDomNode;
        markdownDomNode = element.parents(".markdown");
        markItUpDomNode = element.parents(".markItUp");
        return $rs.mdrender.render($scope.projectId, $model.$modelValue).then(function(data) {
          var html, markdown;
          html = previewTemplate({
            data: data.data
          });
          html = $compile(html)($scope);
          markdownDomNode.append(html);
          markItUpDomNode.hide();
          markdown = element.closest(".markdown");
          return markdown.on("mouseup.preview", ".preview", function(event) {
            var target;
            event.preventDefault();
            target = angular.element(event.target);
            if (!target.is('a') && $selectedText.get().length) {
              return;
            }
            markdown.off(".preview");
            return closePreviewMode();
          });
        });
      };
      setCaretPosition = function(textarea, caretPosition) {
        var line, range, scrollRelation, totalLines;
        if (textarea.createTextRange) {
          range = textarea.createTextRange();
          range.move("character", caretPosition);
          range.select();
        } else if (textarea.selectionStart) {
          textarea.focus();
          textarea.setSelectionRange(caretPosition, caretPosition);
        }
        totalLines = textarea.value.split("\n").length;
        line = textarea.value.slice(0, +(caretPosition - 1) + 1 || 9e9).split("\n").length;
        scrollRelation = line / totalLines;
        return $el.scrollTop((scrollRelation * $el[0].scrollHeight) - ($el.height() / 2));
      };
      addLine = function(textarea, nline, replace) {
        var cursorPosition, j, key, len, line, lines;
        lines = textarea.value.split("\n");
        if (replace) {
          lines[nline] = replace + lines[nline];
        } else {
          lines[nline] = "";
        }
        cursorPosition = 0;
        for (key = j = 0, len = lines.length; j < len; key = ++j) {
          line = lines[key];
          cursorPosition += line.length + 1 || 1;
          if (key === nline) {
            break;
          }
        }
        textarea.value = lines.join("\n");
        if (replace) {
          return cursorPosition - lines[nline].length + replace.length - 1;
        } else {
          return cursorPosition;
        }
      };
      prepareUrlFormatting = function(markItUp) {
        var indices, regex, result;
        regex = /(<<<|>>>)/gi;
        result = 0;
        indices = [];
        while ((result = regex.exec(markItUp.textarea.value))) {
          indices.push(result.index);
        }
        return markItUp.donotparse = indices;
      };
      urlFormatting = function(markItUp) {
        var endIndex, ref, ref1, regex, result, startIndex, url, value;
        regex = /<<</gi;
        result = 0;
        startIndex = 0;
        while (true) {
          result = regex.exec(markItUp.textarea.value);
          if (!result) {
            break;
          }
          if (ref = result.index, indexOf.call(markItUp.donotparse, ref) < 0) {
            startIndex = result.index;
            break;
          }
        }
        regex = />>>/gi;
        endIndex = 0;
        while (true) {
          result = regex.exec(markItUp.textarea.value);
          if (!result) {
            break;
          }
          if (ref1 = result.index, indexOf.call(markItUp.donotparse, ref1) < 0) {
            endIndex = result.index;
            break;
          }
        }
        value = markItUp.textarea.value;
        url = value.substring(startIndex, endIndex).replace('<<<', '').replace('>>>', '');
        url = url.replace('(', '%28').replace(')', '%29');
        url = url.replace('[', '%5B').replace(']', '%5D');
        value = value.substring(0, startIndex) + url + value.substring(endIndex + 3, value.length);
        markItUp.textarea.value = value;
        return markItUp.donotparse = void 0;
      };
      markdownTitle = function(markItUp, char) {
        var heading, i, j, n, ref;
        heading = "";
        n = $.trim(markItUp.selection || markItUp.placeHolder).length;
        for (i = j = 0, ref = n - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          heading += char;
        }
        return "\n" + heading + "\n";
      };
      renderMarkItUp = function() {
        var markdownSettings;
        markdownSettings = {
          nameSpace: "markdown",
          onShiftEnter: {
            keepDefault: false,
            openWith: "\n\n"
          },
          onEnter: {
            keepDefault: false,
            replaceWith: function() {
              return "\n";
            },
            afterInsert: function(data) {
              var cursorLine, emptyListItem, lastLine, lines, markdownCaretPositon, match, newLineContent, nline, replace;
              lines = data.textarea.value.split("\n");
              cursorLine = data.textarea.value.slice(0, +(data.caretPosition - 1) + 1 || 9e9).split("\n").length;
              newLineContent = data.textarea.value.slice(data.caretPosition).split("\n")[0];
              lastLine = lines[cursorLine - 1];
              match = lastLine.match(/^(\s*- ).*/);
              if (match) {
                emptyListItem = lastLine.match(/^(\s*)\-\s$/);
                if (emptyListItem) {
                  nline = cursorLine - 1;
                  replace = null;
                } else {
                  nline = cursorLine;
                  replace = "" + match[1];
                }
                markdownCaretPositon = addLine(data.textarea, nline, replace);
              }
              match = lastLine.match(/^(\s*\* ).*/);
              if (match) {
                emptyListItem = lastLine.match(/^(\s*\* )$/);
                if (emptyListItem) {
                  nline = cursorLine - 1;
                  replace = null;
                } else {
                  nline = cursorLine;
                  replace = "" + match[1];
                }
                markdownCaretPositon = addLine(data.textarea, nline, replace);
              }
              match = lastLine.match(/^(\s*)(\d+)\.\s/);
              if (match) {
                emptyListItem = lastLine.match(/^(\s*)(\d+)\.\s$/);
                if (emptyListItem) {
                  nline = cursorLine - 1;
                  replace = null;
                } else {
                  nline = cursorLine;
                  replace = (match[1] + (parseInt(match[2], 10) + 1)) + ". ";
                }
                markdownCaretPositon = addLine(data.textarea, nline, replace);
              }
              if (markdownCaretPositon) {
                return setCaretPosition(data.textarea, markdownCaretPositon);
              }
            }
          },
          markupSet: [
            {
              name: $translate.instant("COMMON.WYSIWYG.H1_BUTTON"),
              key: "1",
              placeHolder: $translate.instant("COMMON.WYSIWYG.H1_SAMPLE_TEXT"),
              closeWith: function(markItUp) {
                return markdownTitle(markItUp, "=");
              }
            }, {
              name: $translate.instant("COMMON.WYSIWYG.H2_BUTTON"),
              key: "2",
              placeHolder: $translate.instant("COMMON.WYSIWYG.H2_SAMPLE_TEXT"),
              closeWith: function(markItUp) {
                return markdownTitle(markItUp, "-");
              }
            }, {
              name: $translate.instant("COMMON.WYSIWYG.H3_BUTTON"),
              key: "3",
              openWith: "### ",
              placeHolder: $translate.instant("COMMON.WYSIWYG.H3_SAMPLE_TEXT")
            }, {
              separator: "---------------"
            }, {
              name: $translate.instant("COMMON.WYSIWYG.BOLD_BUTTON"),
              key: "B",
              openWith: "**",
              closeWith: "**",
              placeHolder: $translate.instant("COMMON.WYSIWYG.BOLD_BUTTON_SAMPLE_TEXT")
            }, {
              name: $translate.instant("COMMON.WYSIWYG.ITALIC_SAMPLE_TEXT"),
              key: "I",
              openWith: "_",
              closeWith: "_",
              placeHolder: $translate.instant("COMMON.WYSIWYG.ITALIC_SAMPLE_TEXT")
            }, {
              name: $translate.instant("COMMON.WYSIWYG.STRIKE_BUTTON"),
              key: "S",
              openWith: "~~",
              closeWith: "~~",
              placeHolder: $translate.instant("COMMON.WYSIWYG.STRIKE_SAMPLE_TEXT")
            }, {
              separator: "---------------"
            }, {
              name: $translate.instant("COMMON.WYSIWYG.BULLETED_LIST_BUTTON"),
              openWith: "- ",
              placeHolder: $translate.instant("COMMON.WYSIWYG.BULLETED_LIST_SAMPLE_TEXT")
            }, {
              name: $translate.instant("COMMON.WYSIWYG.NUMERIC_LIST_BUTTON"),
              openWith: function(markItUp) {
                return markItUp.line + ". ";
              },
              placeHolder: $translate.instant("COMMON.WYSIWYG.NUMERIC_LIST_SAMPLE_TEXT")
            }, {
              separator: "---------------"
            }, {
              name: $translate.instant("COMMON.WYSIWYG.PICTURE_BUTTON"),
              key: "P",
              openWith: "![",
              closeWith: '](<<<[![Url:!:http://]!]>>> "[![Title]!]")',
              placeHolder: $translate.instant("COMMON.WYSIWYG.PICTURE_SAMPLE_TEXT"),
              beforeInsert: function(markItUp) {
                return prepareUrlFormatting(markItUp);
              },
              afterInsert: function(markItUp) {
                return urlFormatting(markItUp);
              }
            }, {
              name: $translate.instant("COMMON.WYSIWYG.LINK_BUTTON"),
              key: "L",
              openWith: "[",
              closeWith: '](<<<[![Url:!:http://]!]>>> "[![Title]!]")',
              placeHolder: $translate.instant("COMMON.WYSIWYG.LINK_SAMPLE_TEXT"),
              beforeInsert: function(markItUp) {
                return prepareUrlFormatting(markItUp);
              },
              afterInsert: function(markItUp) {
                return urlFormatting(markItUp);
              }
            }, {
              separator: "---------------"
            }, {
              name: $translate.instant("COMMON.WYSIWYG.QUOTE_BLOCK_BUTTON"),
              openWith: "> ",
              placeHolder: $translate.instant("COMMON.WYSIWYG.QUOTE_BLOCK_SAMPLE_TEXT")
            }, {
              name: $translate.instant("COMMON.WYSIWYG.CODE_BLOCK_BUTTON"),
              openWith: "```\n",
              placeHolder: $translate.instant("COMMON.WYSIWYG.CODE_BLOCK_SAMPLE_TEXT"),
              closeWith: "\n```"
            }, {
              separator: "---------------"
            }, {
              name: $translate.instant("COMMON.WYSIWYG.PREVIEW_BUTTON"),
              call: preview,
              className: "preview-icon"
            }
          ],
          afterInsert: function(event) {
            var target;
            target = angular.element(event.textarea);
            return $model.$setViewValue(target.val());
          }
        };
        return element.markItUpRemove().markItUp(markdownSettings);
      };
      renderMarkItUp();
      unbind = $rootscope.$on("$translateChangeEnd", renderMarkItUp);
      element.on("keypress", function(event) {
        return $scope.$apply();
      });
      return $scope.$on("$destroy", function() {
        $el.off();
        return unbind();
      });
    };
    return {
      link: link,
      require: "ngModel"
    };
  };

  module.directive("tgMarkitup", ["$rootScope", "$tgResources", "$selectedText", "$tgTemplate", "$compile", "$translate", MarkitupDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/backlog/main.coffee
 */

(function() {
  var BacklogFiltersDirective, bindOnce, debounceLeading, groupBy, mixOf, module, scopeDefer, taiga, toggleText;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  toggleText = this.taiga.toggleText;

  scopeDefer = this.taiga.scopeDefer;

  bindOnce = this.taiga.bindOnce;

  groupBy = this.taiga.groupBy;

  debounceLeading = this.taiga.debounceLeading;

  module = angular.module("taigaBacklog");

  BacklogFiltersDirective = function($log, $location, $templates) {
    var link, template, templateSelected;
    template = $templates.get("backlog/filters.html", true);
    templateSelected = $templates.get("backlog/filter-selected.html", true);
    link = function($scope, $el, $attrs) {
      var $ctrl, initializeSelectedFilters, renderFilters, renderSelectedFilters, selectQFilter, selectedFilters, showCategories, showFilters, toggleFilterSelection;
      $ctrl = $el.closest(".wrapper").controller();
      selectedFilters = [];
      showFilters = function(title, type) {
        $el.find(".filters-cats").hide();
        $el.find(".filter-list").removeClass("hidden");
        $el.find("h2.breadcrumb").removeClass("hidden");
        $el.find("h2 a.subfilter span.title").html(title);
        return $el.find("h2 a.subfilter span.title").prop("data-type", type);
      };
      showCategories = function() {
        $el.find(".filters-cats").show();
        $el.find(".filter-list").addClass("hidden");
        return $el.find("h2.breadcrumb").addClass("hidden");
      };
      initializeSelectedFilters = function(filters) {
        var i, len, name, val, values;
        showCategories();
        selectedFilters = [];
        for (name in filters) {
          values = filters[name];
          for (i = 0, len = values.length; i < len; i++) {
            val = values[i];
            if (val.selected) {
              selectedFilters.push(val);
            }
          }
        }
        return renderSelectedFilters();
      };
      renderSelectedFilters = function() {
        var html;
        _.map(selectedFilters, (function(_this) {
          return function(f) {
            if (f.color) {
              return f.style = "border-left: 3px solid " + f.color;
            }
          };
        })(this));
        html = templateSelected({
          filters: selectedFilters
        });
        return $el.find(".filters-applied").html(html);
      };
      renderFilters = function(filters) {
        var html;
        _.map(filters, (function(_this) {
          return function(f) {
            if (f.color) {
              return f.style = "border-left: 3px solid " + f.color;
            }
          };
        })(this));
        html = template({
          filters: filters
        });
        return $el.find(".filter-list").html(html);
      };
      toggleFilterSelection = function(type, id) {
        var currentFiltersType, filter, filters;
        filters = $scope.filters[type];
        filter = _.find(filters, {
          id: taiga.toString(id)
        });
        filter.selected = !filter.selected;
        if (filter.selected) {
          selectedFilters.push(filter);
          $scope.$apply(function() {
            return $ctrl.selectFilter(type, id);
          });
        } else {
          selectedFilters = _.reject(selectedFilters, filter);
          $scope.$apply(function() {
            return $ctrl.unselectFilter(type, id);
          });
        }
        renderSelectedFilters(selectedFilters);
        currentFiltersType = $el.find("h2 a.subfilter span.title").prop('data-type');
        if (type === currentFiltersType) {
          renderFilters(_.reject(filters, "selected"));
        }
        return $ctrl.loadUserstories();
      };
      selectQFilter = debounceLeading(100, function(value) {
        if (value === void 0) {
          return;
        }
        if (value.length === 0) {
          $ctrl.replaceFilter("q", null);
        } else {
          $ctrl.replaceFilter("q", value);
        }
        return $ctrl.loadUserstories();
      });
      $scope.$watch("filtersQ", selectQFilter);
      $scope.$on("filters:loaded", function(ctx, filters) {
        return initializeSelectedFilters(filters);
      });
      $scope.$on("filters:update", function(ctx, filters) {
        return renderFilters(filters);
      });
      $el.on("click", ".filters-cats > ul > li > a", function(event) {
        var tags, target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        tags = $scope.filters[target.data("type")];
        renderFilters(_.reject(tags, "selected"));
        return showFilters(target.attr("title"), target.data("type"));
      });
      $el.on("click", ".filters-inner > .filters-step-cat > .breadcrumb > .back", function(event) {
        event.preventDefault();
        return showCategories();
      });
      $el.on("click", ".filters-applied a", function(event) {
        var id, target, type;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        id = target.data("id");
        type = target.data("type");
        return toggleFilterSelection(type, id);
      });
      return $el.on("click", ".filter-list .single-filter", function(event) {
        var id, target, type;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        if (target.hasClass("active")) {
          target.removeClass("active");
        } else {
          target.addClass("active");
        }
        id = target.data("id");
        type = target.data("type");
        return toggleFilterSelection(type, id);
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgBacklogFilters", ["$log", "$tgLocation", "$tgTemplate", BacklogFiltersDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/backlog/lightboxes.coffee
 */

(function() {
  var CreateEditSprint, bindOnce, debounce, module, taiga;

  taiga = this.taiga;

  bindOnce = this.taiga.bindOnce;

  debounce = this.taiga.debounce;

  module = angular.module("taigaBacklog");

  CreateEditSprint = function($repo, $confirm, $rs, $rootscope, lightboxService, $loading, $translate) {
    var link;
    link = function($scope, $el, attrs) {
      var createSprint, hasErrors, remove, submit;
      hasErrors = false;
      createSprint = true;
      $scope.sprint = {
        project: null,
        name: null,
        estimated_start: null,
        estimated_finish: null
      };
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var broadcastEvent, form, newSprint, prettyDate, promise, submitButton, target;
          event.preventDefault();
          target = angular.element(event.currentTarget);
          prettyDate = $translate.instant("COMMON.PICKERDATE.FORMAT");
          submitButton = $el.find(".submit-button");
          form = $el.find("form").checksley();
          if (!form.validate()) {
            hasErrors = true;
            $el.find(".last-sprint-name").addClass("disappear");
            return;
          }
          hasErrors = false;
          newSprint = angular.copy($scope.sprint);
          broadcastEvent = null;
          if (createSprint) {
            newSprint.estimated_start = moment(newSprint.estimated_start, prettyDate).format("YYYY-MM-DD");
            newSprint.estimated_finish = moment(newSprint.estimated_finish, prettyDate).format("YYYY-MM-DD");
            promise = $repo.create("milestones", newSprint);
            broadcastEvent = "sprintform:create:success";
          } else {
            newSprint.setAttr("estimated_start", moment(newSprint.estimated_start, prettyDate).format("YYYY-MM-DD"));
            newSprint.setAttr("estimated_finish", moment(newSprint.estimated_finish, prettyDate).format("YYYY-MM-DD"));
            promise = $repo.save(newSprint);
            broadcastEvent = "sprintform:edit:success";
          }
          $loading.start(submitButton);
          promise.then(function(data) {
            $loading.finish(submitButton);
            if (createSprint) {
              $scope.sprintsCounter += 1;
            }
            $rootscope.$broadcast(broadcastEvent, data);
            return lightboxService.close($el);
          });
          return promise.then(null, function(data) {
            $loading.finish(submitButton);
            form.setErrors(data);
            if (data._error_message) {
              return $confirm.notify("light-error", data._error_message);
            } else if (data.__all__) {
              return $confirm.notify("light-error", data.__all__[0]);
            }
          });
        };
      })(this));
      remove = function() {
        var message, title;
        title = $translate.instant("LIGHTBOX.DELETE_SPRINT.TITLE");
        message = $scope.sprint.name;
        return $confirm.askOnDelete(title, message).then((function(_this) {
          return function(finish) {
            var onError, onSuccess;
            onSuccess = function() {
              finish();
              $scope.milestonesCounter -= 1;
              lightboxService.close($el);
              return $rootscope.$broadcast("sprintform:remove:success");
            };
            onError = function() {
              finish(false);
              return $confirm.notify("error");
            };
            return $repo.remove($scope.sprint).then(onSuccess, onError);
          };
        })(this));
      };
      $scope.$on("sprintform:create", function(event, projectId) {
        var estimatedFinish, estimatedStart, form, lastSprint, lastSprintNameDom, prettyDate, text;
        form = $el.find("form").checksley();
        form.reset();
        createSprint = true;
        prettyDate = $translate.instant("COMMON.PICKERDATE.FORMAT");
        $scope.sprint.project = projectId;
        $scope.sprint.name = null;
        $scope.sprint.slug = null;
        lastSprint = $scope.sprints[0];
        estimatedStart = moment();
        if ($scope.sprint.estimated_start) {
          estimatedStart = moment($scope.sprint.estimated_start);
        } else if (lastSprint != null) {
          estimatedStart = moment(lastSprint.estimated_finish);
        }
        $scope.sprint.estimated_start = estimatedStart.format(prettyDate);
        estimatedFinish = moment().add(2, "weeks");
        if ($scope.sprint.estimated_finish) {
          estimatedFinish = moment($scope.sprint.estimated_finish);
        } else if (lastSprint != null) {
          estimatedFinish = moment(lastSprint.estimated_finish).add(2, "weeks");
        }
        $scope.sprint.estimated_finish = estimatedFinish.format(prettyDate);
        lastSprintNameDom = $el.find(".last-sprint-name");
        if ((lastSprint != null ? lastSprint.name : void 0) != null) {
          text = $translate.instant("LIGHTBOX.ADD_EDIT_SPRINT.LAST_SPRINT_NAME", {
            lastSprint: lastSprint.name
          });
          lastSprintNameDom.html(text);
        }
        $el.find(".delete-sprint").addClass("hidden");
        text = $translate.instant("LIGHTBOX.ADD_EDIT_SPRINT.TITLE");
        $el.find(".title").text(text);
        text = $translate.instant("COMMON.CREATE");
        $el.find(".button-green").text(text);
        lightboxService.open($el);
        $el.find(".sprint-name").focus();
        return $el.find(".last-sprint-name").removeClass("disappear");
      });
      $scope.$on("sprintform:edit", function(ctx, sprint) {
        var editSprint, prettyDate, save;
        createSprint = false;
        prettyDate = $translate.instant("COMMON.PICKERDATE.FORMAT");
        $scope.$apply(function() {
          $scope.sprint = sprint;
          $scope.sprint.estimated_start = moment($scope.sprint.estimated_start).format(prettyDate);
          return $scope.sprint.estimated_finish = moment($scope.sprint.estimated_finish).format(prettyDate);
        });
        $el.find(".delete-sprint").removeClass("hidden");
        editSprint = $translate.instant("BACKLOG.EDIT_SPRINT");
        $el.find(".title").text(editSprint);
        save = $translate.instant("COMMON.SAVE");
        $el.find(".button-green").text(save);
        lightboxService.open($el);
        $el.find(".sprint-name").focus().select();
        return $el.find(".last-sprint-name").addClass("disappear");
      });
      $el.on("keyup", ".sprint-name", function(event) {
        if ($el.find(".sprint-name").val().length > 0 || hasErrors) {
          return $el.find(".last-sprint-name").addClass("disappear");
        } else {
          return $el.find(".last-sprint-name").removeClass("disappear");
        }
      });
      $el.on("submit", "form", submit);
      $el.on("click", ".delete-sprint .icon-delete", function(event) {
        event.preventDefault();
        return remove();
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgLbCreateEditSprint", ["$tgRepo", "$tgConfirm", "$tgResources", "$rootScope", "lightboxService", "$tgLoading", "$translate", CreateEditSprint]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/backlog/main.coffee
 */

(function() {
  var BacklogController, BacklogDirective, BurndownBacklogGraphDirective, TgBacklogProgressBarDirective, ToggleBurndownVisibility, UsPointsDirective, UsRolePointsSelectorDirective, bindMethods, bindOnce, generateHash, groupBy, mixOf, module, scopeDefer, taiga, timeout, toggleText,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  toggleText = this.taiga.toggleText;

  scopeDefer = this.taiga.scopeDefer;

  bindOnce = this.taiga.bindOnce;

  groupBy = this.taiga.groupBy;

  timeout = this.taiga.timeout;

  bindMethods = this.taiga.bindMethods;

  generateHash = this.taiga.generateHash;

  module = angular.module("taigaBacklog");

  BacklogController = (function(superClass) {
    extend(BacklogController, superClass);

    BacklogController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgConfirm", "$tgResources", "$routeParams", "$q", "$tgLocation", "tgAppMetaService", "$tgNavUrls", "$tgEvents", "$tgAnalytics", "$translate"];

    function BacklogController(scope, rootscope, repo, confirm, rs, params1, q, location, appMetaService, navUrls, events, analytics, translate) {
      var promise;
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs;
      this.params = params1;
      this.q = q;
      this.location = location;
      this.appMetaService = appMetaService;
      this.navUrls = navUrls;
      this.events = events;
      this.analytics = analytics;
      this.translate = translate;
      bindMethods(this);
      this.scope.sectionName = this.translate.instant("BACKLOG.SECTION_NAME");
      this.showTags = false;
      this.activeFilters = false;
      this.initializeEventHandlers();
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          var description, title;
          title = _this.translate.instant("BACKLOG.PAGE_TITLE", {
            projectName: _this.scope.project.name
          });
          description = _this.translate.instant("BACKLOG.PAGE_DESCRIPTION", {
            projectName: _this.scope.project.name,
            projectDescription: _this.scope.project.description
          });
          _this.appMetaService.setAll(title, description);
          if (_this.rs.userstories.getShowTags(_this.scope.projectId)) {
            _this.showTags = true;
            return _this.scope.$broadcast("showTags", _this.showTags);
          }
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
    }

    BacklogController.prototype.initializeEventHandlers = function() {
      this.scope.$on("usform:bulk:success", (function(_this) {
        return function() {
          _this.loadUserstories();
          _this.loadProjectStats();
          return _this.analytics.trackEvent("userstory", "create", "bulk create userstory on backlog", 1);
        };
      })(this));
      this.scope.$on("sprintform:create:success", (function(_this) {
        return function() {
          _this.loadSprints();
          _this.loadProjectStats();
          return _this.analytics.trackEvent("sprint", "create", "create sprint on backlog", 1);
        };
      })(this));
      this.scope.$on("usform:new:success", (function(_this) {
        return function() {
          _this.loadUserstories();
          _this.loadProjectStats();
          return _this.analytics.trackEvent("userstory", "create", "create userstory on backlog", 1);
        };
      })(this));
      this.scope.$on("sprintform:edit:success", (function(_this) {
        return function() {
          return _this.loadProjectStats();
        };
      })(this));
      this.scope.$on("sprintform:remove:success", (function(_this) {
        return function() {
          _this.loadSprints();
          _this.loadProjectStats();
          return _this.loadUserstories();
        };
      })(this));
      this.scope.$on("usform:edit:success", (function(_this) {
        return function() {
          return _this.loadUserstories();
        };
      })(this));
      this.scope.$on("sprint:us:move", this.moveUs);
      this.scope.$on("sprint:us:moved", this.loadSprints);
      this.scope.$on("sprint:us:moved", this.loadProjectStats);
      this.scope.$on("backlog:load-closed-sprints", this.loadClosedSprints);
      return this.scope.$on("backlog:unload-closed-sprints", this.unloadClosedSprints);
    };

    BacklogController.prototype.initializeSubscription = function() {
      var routingKey1, routingKey2;
      routingKey1 = "changes.project." + this.scope.projectId + ".userstories";
      this.events.subscribe(this.scope, routingKey1, (function(_this) {
        return function(message) {
          _this.loadUserstories();
          return _this.loadSprints();
        };
      })(this));
      routingKey2 = "changes.project." + this.scope.projectId + ".milestones";
      return this.events.subscribe(this.scope, routingKey2, (function(_this) {
        return function(message) {
          return _this.loadSprints();
        };
      })(this));
    };

    BacklogController.prototype.toggleShowTags = function() {
      return this.scope.$apply((function(_this) {
        return function() {
          _this.showTags = !_this.showTags;
          return _this.rs.userstories.storeShowTags(_this.scope.projectId, _this.showTags);
        };
      })(this));
    };

    BacklogController.prototype.toggleActiveFilters = function() {
      return this.activeFilters = !this.activeFilters;
    };

    BacklogController.prototype.loadProjectStats = function() {
      return this.rs.projects.stats(this.scope.projectId).then((function(_this) {
        return function(stats) {
          _this.scope.stats = stats;
          if (stats.total_points) {
            _this.scope.stats.completedPercentage = Math.round(100 * stats.closed_points / stats.total_points);
          } else {
            _this.scope.stats.completedPercentage = 0;
          }
          return stats;
        };
      })(this));
    };

    BacklogController.prototype.refreshTagsColors = function() {
      return this.rs.projects.tagsColors(this.scope.projectId).then((function(_this) {
        return function(tags_colors) {
          return _this.scope.project.tags_colors = tags_colors;
        };
      })(this));
    };

    BacklogController.prototype.unloadClosedSprints = function() {
      return this.scope.$apply((function(_this) {
        return function() {
          _this.scope.closedSprints = [];
          return _this.rootscope.$broadcast("closed-sprints:reloaded", []);
        };
      })(this));
    };

    BacklogController.prototype.loadClosedSprints = function() {
      var params;
      params = {
        closed: true
      };
      return this.rs.sprints.list(this.scope.projectId, params).then((function(_this) {
        return function(sprints) {
          var j, len, sprint;
          for (j = 0, len = sprints.length; j < len; j++) {
            sprint = sprints[j];
            sprint.user_stories = _.sortBy(sprint.user_stories, "sprint_order");
          }
          _this.scope.closedSprints = sprints;
          _this.rootscope.$broadcast("closed-sprints:reloaded", sprints);
          return sprints;
        };
      })(this));
    };

    BacklogController.prototype.loadSprints = function() {
      var params;
      params = {
        closed: false
      };
      return this.rs.sprints.list(this.scope.projectId, params).then((function(_this) {
        return function(sprints) {
          var j, len, sprint;
          for (j = 0, len = sprints.length; j < len; j++) {
            sprint = sprints[j];
            sprint.user_stories = _.sortBy(sprint.user_stories, "sprint_order");
          }
          _this.scope.sprints = sprints;
          _this.scope.openSprints = _.filter(sprints, function(sprint) {
            return !sprint.closed;
          }).reverse();
          if (!_this.scope.closedSprints) {
            _this.scope.closedSprints = [];
          }
          _this.scope.sprintsCounter = sprints.length;
          _this.scope.sprintsById = groupBy(sprints, function(x) {
            return x.id;
          });
          _this.rootscope.$broadcast("sprints:loaded", sprints);
          return sprints;
        };
      })(this));
    };

    BacklogController.prototype.resetFilters = function() {
      var selectedStatuses, selectedTags;
      selectedTags = _.filter(this.scope.filters.tags, "selected");
      selectedStatuses = _.filter(this.scope.filters.statuses, "selected");
      this.scope.filtersQ = "";
      _.each([selectedTags, selectedStatuses], (function(_this) {
        return function(filterGrp) {
          return _.each(filterGrp, function(item) {
            var filter, filters;
            filters = _this.scope.filters[item.type];
            filter = _.find(filters, {
              id: taiga.toString(item.id)
            });
            filter.selected = false;
            return _this.unselectFilter(item.type, item.id);
          });
        };
      })(this));
      return this.loadUserstories();
    };

    BacklogController.prototype.loadUserstories = function() {
      var promise;
      this.scope.httpParams = this.getUrlFilters();
      this.rs.userstories.storeQueryParams(this.scope.projectId, this.scope.httpParams);
      promise = this.q.all([this.refreshTagsColors(), this.rs.userstories.listUnassigned(this.scope.projectId, this.scope.httpParams)]);
      return promise.then((function(_this) {
        return function(data) {
          var userstories;
          userstories = data[1];
          _this.scope.userstories = _.sortBy(userstories, "backlog_order");
          _this.setSearchDataFilters();
          _this.filterVisibleUserstories();
          _this.generateFilters();
          _this.rootscope.$broadcast("filters:loaded", _this.scope.filters);
          scopeDefer(_this.scope, function() {
            return _this.scope.$broadcast("userstories:loaded");
          });
          return userstories;
        };
      })(this));
    };

    BacklogController.prototype.loadBacklog = function() {
      return this.q.all([this.loadProjectStats(), this.loadSprints(), this.loadUserstories()]);
    };

    BacklogController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          if (!project.is_backlog_activated) {
            _this.location.path(_this.navUrls.resolve("permission-denied"));
          }
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.totalClosedMilestones = project.total_closed_milestones;
          _this.scope.$emit('project:loaded', project);
          _this.scope.points = _.sortBy(project.points, "order");
          _this.scope.pointsById = groupBy(project.points, function(x) {
            return x.id;
          });
          _this.scope.usStatusById = groupBy(project.us_statuses, function(x) {
            return x.id;
          });
          _this.scope.usStatusList = _.sortBy(project.us_statuses, "id");
          return project;
        };
      })(this));
    };

    BacklogController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      promise.then((function(_this) {
        return function(project) {
          _this.fillUsersAndRoles(project.members, project.roles);
          return _this.initializeSubscription();
        };
      })(this));
      return promise.then((function(_this) {
        return function() {
          return _this.loadBacklog();
        };
      })(this));
    };

    BacklogController.prototype.filterVisibleUserstories = function() {
      this.scope.visibleUserstories = [];
      this.scope.visibleUserstories = _.reject(this.scope.userstories, (function(_this) {
        return function(us) {
          return _.some(us.tags, function(tag) {
            return _this.isFilterSelected("tag", tag);
          });
        };
      })(this));
      return this.scope.visibleUserstories = _.filter(this.scope.visibleUserstories, (function(_this) {
        return function(us) {
          if (_this.searchdata["statuses"] && Object.keys(_this.searchdata["statuses"]).length) {
            return _this.isFilterSelected("statuses", taiga.toString(us.status));
          }
          return true;
        };
      })(this));
    };

    BacklogController.prototype.prepareBulkUpdateData = function(uses, field) {
      if (field == null) {
        field = "backlog_order";
      }
      return _.map(uses, function(x) {
        return {
          "us_id": x.id,
          "order": x[field]
        };
      });
    };

    BacklogController.prototype.resortUserStories = function(uses, field) {
      var index, item, items, j, len;
      if (field == null) {
        field = "backlog_order";
      }
      items = [];
      for (index = j = 0, len = uses.length; j < len; index = ++j) {
        item = uses[index];
        item[field] = index;
        if (item.isModified()) {
          items.push(item);
        }
      }
      return items;
    };

    BacklogController.prototype.moveUs = function(ctx, usList, newUsIndex, newSprintId) {
      var data, items, j, l, len, len1, len2, m, newSprint, oldSprintId, project, promise, promises, us, userstories;
      oldSprintId = usList[0].milestone;
      project = usList[0].project;
      if (newSprintId === oldSprintId) {
        items = null;
        userstories = null;
        if (newSprintId === null) {
          userstories = this.scope.userstories;
        } else {
          userstories = this.scope.sprintsById[newSprintId].user_stories;
        }
        this.scope.$apply(function() {
          var args, j, key, len, r, us;
          for (key = j = 0, len = usList.length; j < len; key = ++j) {
            us = usList[key];
            r = userstories.indexOf(us);
            userstories.splice(r, 1);
          }
          args = [newUsIndex, 0].concat(usList);
          return Array.prototype.splice.apply(userstories, args);
        });
        if (newSprintId === null) {
          items = this.resortUserStories(userstories, "backlog_order");
          data = this.prepareBulkUpdateData(items, "backlog_order");
          this.rs.userstories.bulkUpdateBacklogOrder(project, data).then((function(_this) {
            return function() {
              var j, len, results, us;
              results = [];
              for (j = 0, len = usList.length; j < len; j++) {
                us = usList[j];
                results.push(_this.rootscope.$broadcast("sprint:us:moved", us, oldSprintId, newSprintId));
              }
              return results;
            };
          })(this));
        } else {
          items = this.resortUserStories(userstories, "sprint_order");
          data = this.prepareBulkUpdateData(items, "sprint_order");
          this.rs.userstories.bulkUpdateSprintOrder(project, data).then((function(_this) {
            return function() {
              var j, len, results, us;
              results = [];
              for (j = 0, len = usList.length; j < len; j++) {
                us = usList[j];
                results.push(_this.rootscope.$broadcast("sprint:us:moved", us, oldSprintId, newSprintId));
              }
              return results;
            };
          })(this));
        }
        return promise;
      }
      if (newSprintId === null) {
        for (j = 0, len = usList.length; j < len; j++) {
          us = usList[j];
          us.milestone = null;
        }
        this.scope.$apply((function(_this) {
          return function() {
            var args, key, l, len1, r, results, sprint;
            args = [newUsIndex, 0].concat(usList);
            Array.prototype.splice.apply(_this.scope.userstories, args);
            Array.prototype.splice.apply(_this.scope.visibleUserstories, args);
            _this.filterVisibleUserstories();
            sprint = _this.scope.sprintsById[oldSprintId];
            results = [];
            for (key = l = 0, len1 = usList.length; l < len1; key = ++l) {
              us = usList[key];
              r = sprint.user_stories.indexOf(us);
              results.push(sprint.user_stories.splice(r, 1));
            }
            return results;
          };
        })(this));
        promise = this.repo.save(us);
        promise = promise.then((function(_this) {
          return function() {
            items = _this.resortUserStories(_this.scope.userstories, "backlog_order");
            data = _this.prepareBulkUpdateData(items, "backlog_order");
            return _this.rs.userstories.bulkUpdateBacklogOrder(us.project, data).then(function() {
              return _this.rootscope.$broadcast("sprint:us:moved", us, oldSprintId, newSprintId);
            });
          };
        })(this));
        promise.then(null, function() {
          return console.log("FAIL");
        });
        return promise;
      }
      newSprint = this.scope.sprintsById[newSprintId];
      if (oldSprintId === null) {
        for (l = 0, len1 = usList.length; l < len1; l++) {
          us = usList[l];
          us.milestone = newSprintId;
        }
        this.scope.$apply((function(_this) {
          return function() {
            var args, key, len2, m, r, results;
            args = [newUsIndex, 0].concat(usList);
            Array.prototype.splice.apply(newSprint.user_stories, args);
            results = [];
            for (key = m = 0, len2 = usList.length; m < len2; key = ++m) {
              us = usList[key];
              r = _this.scope.visibleUserstories.indexOf(us);
              _this.scope.visibleUserstories.splice(r, 1);
              r = _this.scope.userstories.indexOf(us);
              results.push(_this.scope.userstories.splice(r, 1));
            }
            return results;
          };
        })(this));
      } else {
        for (m = 0, len2 = usList.length; m < len2; m++) {
          us = usList[m];
          us.milestone = newSprintId;
        }
        this.scope.$apply((function(_this) {
          return function() {
            var args, len3, n, oldSprint, r, results;
            args = [newUsIndex, 0].concat(usList);
            Array.prototype.splice.apply(newSprint.user_stories, args);
            results = [];
            for (n = 0, len3 = usList.length; n < len3; n++) {
              us = usList[n];
              oldSprint = _this.scope.sprintsById[oldSprintId];
              r = oldSprint.user_stories.indexOf(us);
              results.push(oldSprint.user_stories.splice(r, 1));
            }
            return results;
          };
        })(this));
      }
      promises = _.map(usList, (function(_this) {
        return function(us) {
          return _this.repo.save(us);
        };
      })(this));
      promise = this.q.all(promises).then((function(_this) {
        return function() {
          items = _this.resortUserStories(newSprint.user_stories, "sprint_order");
          data = _this.prepareBulkUpdateData(items, "sprint_order");
          _this.rs.userstories.bulkUpdateSprintOrder(project, data).then(function() {
            return _this.rootscope.$broadcast("sprint:us:moved", us, oldSprintId, newSprintId);
          });
          return _this.rs.userstories.bulkUpdateBacklogOrder(project, data).then(function() {
            var len3, n, results;
            results = [];
            for (n = 0, len3 = usList.length; n < len3; n++) {
              us = usList[n];
              results.push(_this.rootscope.$broadcast("sprint:us:moved", us, oldSprintId, newSprintId));
            }
            return results;
          });
        };
      })(this));
      promise.then(null, function() {
        return console.log("FAIL");
      });
      return promise;
    };

    BacklogController.prototype.isFilterSelected = function(type, id) {
      if ((this.searchdata[type] != null) && this.searchdata[type][id]) {
        return true;
      }
      return false;
    };

    BacklogController.prototype.setSearchDataFilters = function() {
      var name, results, urlfilters, val, value;
      urlfilters = this.getUrlFilters();
      if (urlfilters.q) {
        this.scope.filtersQ = this.scope.filtersQ || urlfilters.q;
      }
      this.searchdata = {};
      results = [];
      for (name in urlfilters) {
        value = urlfilters[name];
        if (this.searchdata[name] == null) {
          this.searchdata[name] = {};
        }
        results.push((function() {
          var j, len, ref, results1;
          ref = taiga.toString(value).split(",");
          results1 = [];
          for (j = 0, len = ref.length; j < len; j++) {
            val = ref[j];
            results1.push(this.searchdata[name][val] = true);
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    BacklogController.prototype.getUrlFilters = function() {
      return _.pick(this.location.search(), "statuses", "tags", "q");
    };

    BacklogController.prototype.generateFilters = function() {
      var plainStatuses, plainTags, selectedStatuses, selectedTags, urlfilters;
      urlfilters = this.getUrlFilters();
      this.scope.filters = {};
      plainTags = _.flatten(_.filter(_.map(this.scope.visibleUserstories, "tags")));
      plainTags.sort();
      if (plainTags.length === 0 && urlfilters["tags"]) {
        plainTags.push(urlfilters["tags"]);
      }
      this.scope.filters.tags = _.map(_.countBy(plainTags), (function(_this) {
        return function(v, k) {
          var obj;
          obj = {
            id: k,
            type: "tags",
            name: k,
            color: _this.scope.project.tags_colors[k],
            count: v
          };
          if (_this.isFilterSelected("tags", obj.id)) {
            obj.selected = true;
          }
          return obj;
        };
      })(this));
      selectedTags = _.filter(this.scope.filters.tags, "selected");
      selectedTags = _.map(selectedTags, "name");
      plainStatuses = _.map(this.scope.visibleUserstories, "status");
      plainStatuses = _.filter(plainStatuses, (function(_this) {
        return function(status) {
          if (status) {
            return status;
          }
        };
      })(this));
      if (plainStatuses.length === 0 && urlfilters["statuses"]) {
        plainStatuses.push(urlfilters["statuses"]);
      }
      this.scope.filters.statuses = _.map(_.countBy(plainStatuses), (function(_this) {
        return function(v, k) {
          var obj;
          obj = {
            id: k,
            type: "statuses",
            name: _this.scope.usStatusById[k].name,
            color: _this.scope.usStatusById[k].color,
            count: v
          };
          if (_this.isFilterSelected("statuses", obj.id)) {
            obj.selected = true;
          }
          return obj;
        };
      })(this));
      selectedStatuses = _.filter(this.scope.filters.statuses, "selected");
      selectedStatuses = _.map(selectedStatuses, "id");
      return this.rs.userstories.storeQueryParams(this.scope.projectId, {
        "status": selectedStatuses,
        "tags": selectedTags,
        "project": this.scope.projectId,
        "milestone": null
      });
    };

    BacklogController.prototype.updateUserStoryStatus = function() {
      this.setSearchDataFilters();
      this.filterVisibleUserstories();
      this.generateFilters();
      this.rootscope.$broadcast("filters:update", this.scope.filters['statuses']);
      return this.loadProjectStats();
    };

    BacklogController.prototype.editUserStory = function(us) {
      return this.rootscope.$broadcast("usform:edit", us);
    };

    BacklogController.prototype.deleteUserStory = function(us) {
      var message, title;
      title = this.translate.instant("US.TITLE_DELETE_ACTION");
      message = us.subject;
      return this.confirm.askOnDelete(title, message).then((function(_this) {
        return function(finish) {
          var promise;
          _this.scope.userstories = _.without(_this.scope.userstories, us);
          _this.filterVisibleUserstories();
          promise = _this.repo.remove(us);
          promise.then(function() {
            finish();
            return _this.loadBacklog();
          });
          return promise.then(null, function() {
            finish(false);
            return _this.confirm.notify("error");
          });
        };
      })(this));
    };

    BacklogController.prototype.addNewUs = function(type) {
      switch (type) {
        case "standard":
          return this.rootscope.$broadcast("usform:new", this.scope.projectId, this.scope.project.default_us_status, this.scope.usStatusList);
        case "bulk":
          return this.rootscope.$broadcast("usform:bulk", this.scope.projectId, this.scope.project.default_us_status);
      }
    };

    BacklogController.prototype.addNewSprint = function() {
      return this.rootscope.$broadcast("sprintform:create", this.scope.projectId);
    };

    return BacklogController;

  })(mixOf(taiga.Controller, taiga.PageMixin, taiga.FiltersMixin));

  module.controller("BacklogController", BacklogController);

  BacklogDirective = function($repo, $rootscope, $translate) {
    var doomLineTemplate, link, linkDoomLine, linkFilters, linkToolbar, showHideFilter, showHideTags;
    doomLineTemplate = _.template("<div class=\"doom-line\"><span><%- text %></span></div>");
    linkDoomLine = function($scope, $el, $attrs, $ctrl) {
      var addDoomLineDom, getUsItems, reloadDoomLine, removeDoomlineDom;
      reloadDoomLine = function() {
        var current_sum, domElement, i, j, len, ref, results, stats, total_points, us;
        if ($scope.stats != null) {
          removeDoomlineDom();
          stats = $scope.stats;
          total_points = stats.total_points;
          current_sum = stats.assigned_points;
          if (!$scope.visibleUserstories) {
            return;
          }
          ref = $scope.visibleUserstories;
          results = [];
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            us = ref[i];
            current_sum += us.total_points;
            if (current_sum > total_points) {
              domElement = $el.find('.backlog-table-body .us-item-row')[i];
              addDoomLineDom(domElement);
              break;
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      };
      removeDoomlineDom = function() {
        return $el.find(".doom-line").remove();
      };
      addDoomLineDom = function(element) {
        var text;
        text = $translate.instant("BACKLOG.DOOMLINE");
        return $(element).before(doomLineTemplate({
          "text": text
        }));
      };
      getUsItems = function() {
        var rowElements;
        rowElements = $el.find('.backlog-table-body .us-item-row');
        return _.map(rowElements, function(x) {
          return angular.element(x);
        });
      };
      $scope.$on("userstories:loaded", reloadDoomLine);
      return $scope.$watch("stats", reloadDoomLine);
    };
    linkToolbar = function($scope, $el, $attrs, $ctrl) {
      var checkSelected, lastChecked, moveToCurrentSprint, shiftPressed;
      moveToCurrentSprint = function(selectedUss) {
        var extraPoints, totalExtraPoints, ussCurrent;
        ussCurrent = _($scope.userstories);
        $scope.userstories = ussCurrent.without.apply(ussCurrent, selectedUss).value();
        extraPoints = _.map(selectedUss, function(v, k) {
          return v.total_points;
        });
        totalExtraPoints = _.reduce(extraPoints, function(acc, num) {
          return acc + num;
        });
        $scope.sprints[0].user_stories = _.union($scope.sprints[0].user_stories, selectedUss);
        $scope.sprints[0].total_points += totalExtraPoints;
        $ctrl.filterVisibleUserstories();
        return $repo.saveAll(selectedUss).then(function() {
          $ctrl.loadSprints();
          return $ctrl.loadProjectStats();
        });
      };
      shiftPressed = false;
      lastChecked = null;
      checkSelected = function(target) {
        var moveToCurrentSprintDom, selectedUsDom;
        lastChecked = target.closest(".us-item-row");
        moveToCurrentSprintDom = $el.find("#move-to-current-sprint");
        selectedUsDom = $el.find(".backlog-table-body .user-stories input:checkbox:checked");
        if (selectedUsDom.length > 0 && $scope.sprints.length > 0) {
          moveToCurrentSprintDom.show();
        } else {
          moveToCurrentSprintDom.hide();
        }
        return target.closest('.us-item-row').toggleClass('ui-multisortable-multiple');
      };
      $(window).on("keydown.shift-pressed keyup.shift-pressed", function(event) {
        shiftPressed = !!event.shiftKey;
        return true;
      });
      $el.on("change", ".backlog-table-body .user-stories input:checkbox", function(event) {
        var current, elements, nextAll, prevAll, target;
        if (lastChecked && shiftPressed) {
          elements = [];
          current = $(event.currentTarget).closest(".us-item-row");
          nextAll = lastChecked.nextAll();
          prevAll = lastChecked.prevAll();
          if (_.some(nextAll, function(next) {
            return next === current[0];
          })) {
            elements = lastChecked.nextUntil(current);
          } else if (_.some(prevAll, function(prev) {
            return prev === current[0];
          })) {
            elements = lastChecked.prevUntil(current);
          }
          _.map(elements, function(elm) {
            var input;
            input = $(elm).find("input:checkbox");
            input.prop('checked', true);
            return checkSelected(input);
          });
        }
        target = angular.element(event.currentTarget);
        return checkSelected(target);
      });
      $el.on("click", "#move-to-current-sprint", (function(_this) {
        return function(event) {
          var ussDom, ussToMove;
          ussDom = $el.find(".backlog-table-body .user-stories input:checkbox:checked");
          ussToMove = _.map(ussDom, function(item) {
            var itemScope;
            item = $(item).closest('.tg-scope');
            itemScope = item.scope();
            itemScope.us.milestone = $scope.sprints[0].id;
            return itemScope.us;
          });
          return $scope.$apply(_.partial(moveToCurrentSprint, ussToMove));
        };
      })(this));
      return $el.on("click", "#show-tags", function(event) {
        event.preventDefault();
        $ctrl.toggleShowTags();
        return showHideTags($ctrl);
      });
    };
    showHideTags = function($ctrl) {
      var elm, text;
      elm = angular.element("#show-tags");
      if ($ctrl.showTags) {
        elm.addClass("active");
        text = $translate.instant("BACKLOG.TAGS.HIDE");
        return elm.find(".text").text(text);
      } else {
        elm.removeClass("active");
        text = $translate.instant("BACKLOG.TAGS.SHOW");
        return elm.find(".text").text(text);
      }
    };
    showHideFilter = function($scope, $el, $ctrl) {
      var hideText, showText, sidebar, target;
      sidebar = $el.find("sidebar.filters-bar");
      sidebar.one("transitionend", function() {
        return timeout(150, function() {
          $rootscope.$broadcast("resize");
          return $('.burndown').css("visibility", "visible");
        });
      });
      target = angular.element("#show-filters-button");
      $('.burndown').css("visibility", "hidden");
      sidebar.toggleClass("active");
      target.toggleClass("active");
      hideText = $translate.instant("BACKLOG.FILTERS.HIDE");
      showText = $translate.instant("BACKLOG.FILTERS.SHOW");
      toggleText(target.find(".text"), [hideText, showText]);
      if (!sidebar.hasClass("active")) {
        $ctrl.resetFilters();
      }
      return $ctrl.toggleActiveFilters();
    };
    linkFilters = function($scope, $el, $attrs, $ctrl) {
      $scope.filtersSearch = {};
      return $el.on("click", "#show-filters-button", function(event) {
        event.preventDefault();
        return $scope.$apply(function() {
          return showHideFilter($scope, $el, $ctrl);
        });
      });
    };
    link = function($scope, $el, $attrs, $rootscope) {
      var $ctrl, filters;
      $ctrl = $el.controller();
      linkToolbar($scope, $el, $attrs, $ctrl);
      linkFilters($scope, $el, $attrs, $ctrl);
      linkDoomLine($scope, $el, $attrs, $ctrl);
      $el.find(".backlog-table-body").disableSelection();
      filters = $ctrl.getUrlFilters();
      if (filters.statuses || filters.tags || filters.q) {
        showHideFilter($scope, $el, $ctrl);
      }
      $scope.$on("showTags", function() {
        return showHideTags($ctrl);
      });
      return $scope.$on("$destroy", function() {
        $el.off();
        return $(window).off(".shift-pressed");
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgBacklog", ["$tgRepo", "$rootScope", "$translate", BacklogDirective]);

  UsRolePointsSelectorDirective = function($rootscope, $template, $compile, $translate) {
    var link, selectionTemplate;
    selectionTemplate = $template.get("backlog/us-role-points-popover.html", true);
    link = function($scope, $el, $attrs) {
      bindOnce($scope, "project", function(project) {
        var numberOfRoles, roles;
        roles = _.filter(project.roles, "computable");
        numberOfRoles = _.size(roles);
        if (numberOfRoles > 1) {
          return $el.append($compile(selectionTemplate({
            "roles": roles
          }))($scope));
        } else {
          $el.find(".icon-arrow-bottom").remove();
          return $el.find(".header-points").addClass("not-clickable");
        }
      });
      $scope.$on("uspoints:select", function(ctx, roleId, roleName) {
        $el.find(".popover").popover().close();
        return $el.find(".header-points").html(roleName + "/<span>Total</span>");
      });
      $scope.$on("uspoints:clear-selection", function(ctx, roleId) {
        var text;
        $el.find(".popover").popover().close();
        text = $translate.instant("COMMON.FIELDS.POINTS");
        return $el.find(".header-points").text(text);
      });
      $el.on("click", function(event) {
        var target;
        target = angular.element(event.target);
        if (target.is("span") || target.is("div")) {
          event.stopPropagation();
        }
        return $el.find(".popover").popover().open();
      });
      $el.on("click", ".clear-selection", function(event) {
        event.preventDefault();
        event.stopPropagation();
        return $rootscope.$broadcast("uspoints:clear-selection");
      });
      $el.on("click", ".role", function(event) {
        var rolScope, target;
        event.preventDefault();
        event.stopPropagation();
        target = angular.element(event.currentTarget);
        rolScope = target.scope();
        return $rootscope.$broadcast("uspoints:select", target.data("role-id"), target.text());
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgUsRolePointsSelector", ["$rootScope", "$tgTemplate", "$compile", UsRolePointsSelectorDirective]);

  UsPointsDirective = function($tgEstimationsService, $repo, $tgTemplate) {
    var link, rolesTemplate;
    rolesTemplate = $tgTemplate.get("common/estimation/us-points-roles-popover.html", true);
    link = function($scope, $el, $attrs) {
      var $ctrl, bindClickElements, estimationProcess, filteringRoleId, renderRolesSelector, selectedRoleId, updatingSelectedRoleId;
      $ctrl = $el.controller();
      updatingSelectedRoleId = null;
      selectedRoleId = null;
      filteringRoleId = null;
      estimationProcess = null;
      $scope.$on("uspoints:select", function(ctx, roleId, roleName) {
        var us;
        us = $scope.$eval($attrs.tgBacklogUsPoints);
        selectedRoleId = roleId;
        return estimationProcess.render();
      });
      $scope.$on("uspoints:clear-selection", function(ctx) {
        var us;
        us = $scope.$eval($attrs.tgBacklogUsPoints);
        selectedRoleId = null;
        return estimationProcess.render();
      });
      $scope.$watch($attrs.tgBacklogUsPoints, function(us) {
        var roles;
        if (us) {
          estimationProcess = $tgEstimationsService.create($el, us, $scope.project);
          roles = estimationProcess.calculateRoles();
          if (roles.length === 0) {
            $el.find(".icon-arrow-bottom").remove();
            $el.find("a.us-points").addClass("not-clickable");
          } else if (roles.length === 1) {
            selectedRoleId = _.keys(us.points)[0];
          }
          if (estimationProcess.isEditable) {
            bindClickElements();
          }
          estimationProcess.onSelectedPointForRole = function(roleId, pointId) {
            return this.save(roleId, pointId).then(function() {
              return $ctrl.loadProjectStats();
            });
          };
          estimationProcess.render = function() {
            var ctx, html, mainTemplate, pointId, pointObj, template, text, title, totalPoints;
            totalPoints = this.calculateTotalPoints();
            if ((selectedRoleId == null) || roles.length === 1) {
              text = totalPoints;
              title = totalPoints;
            } else {
              pointId = this.us.points[selectedRoleId];
              pointObj = this.pointsById[pointId];
              text = pointObj.name + " / <span>" + totalPoints + "</span>";
              title = pointObj.name + " / " + totalPoints;
            }
            ctx = {
              totalPoints: totalPoints,
              roles: this.calculateRoles(),
              editable: this.isEditable,
              text: text,
              title: title
            };
            mainTemplate = "common/estimation/us-estimation-total.html";
            template = $tgTemplate.get(mainTemplate, true);
            html = template(ctx);
            return this.$el.html(html);
          };
          return estimationProcess.render();
        }
      });
      renderRolesSelector = function() {
        var html, roles;
        roles = estimationProcess.calculateRoles();
        html = rolesTemplate({
          "roles": roles
        });
        $el.append(html);
        return $el.find(".pop-role").popover().open(function() {
          return $(this).remove();
        });
      };
      bindClickElements = function() {
        $el.on("click", "a.us-points span", function(event) {
          var us;
          event.preventDefault();
          event.stopPropagation();
          us = $scope.$eval($attrs.tgBacklogUsPoints);
          updatingSelectedRoleId = selectedRoleId;
          if (selectedRoleId != null) {
            return estimationProcess.renderPointsSelector(selectedRoleId);
          } else {
            return renderRolesSelector();
          }
        });
        return $el.on("click", ".role", function(event) {
          var popRolesDom, target, us;
          event.preventDefault();
          event.stopPropagation();
          target = angular.element(event.currentTarget);
          us = $scope.$eval($attrs.tgBacklogUsPoints);
          updatingSelectedRoleId = target.data("role-id");
          popRolesDom = $el.find(".pop-role");
          popRolesDom.find("a").removeClass("active");
          popRolesDom.find("a[data-role-id='" + updatingSelectedRoleId + "']").addClass("active");
          return estimationProcess.renderPointsSelector(updatingSelectedRoleId);
        });
      };
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgBacklogUsPoints", ["$tgEstimationsService", "$tgRepo", "$tgTemplate", UsPointsDirective]);

  ToggleBurndownVisibility = function($storage) {
    var link;
    link = function($scope, $el, $attrs) {
      var hash, toggleGraph;
      hash = generateHash(["is-burndown-grpahs-collapsed"]);
      toggleGraph = function() {
        if ($scope.isBurndownGraphCollapsed) {
          $(".js-toggle-burndown-visibility-button").removeClass("active");
          return $(".js-burndown-graph").removeClass("open");
        } else {
          $(".js-toggle-burndown-visibility-button").addClass("active");
          return $(".js-burndown-graph").addClass("open");
        }
      };
      $scope.isBurndownGraphCollapsed = $storage.get(hash) || false;
      toggleGraph();
      $el.on("click", ".js-toggle-burndown-visibility-button", function() {
        $scope.isBurndownGraphCollapsed = !$scope.isBurndownGraphCollapsed;
        $storage.set(hash, $scope.isBurndownGraphCollapsed);
        return toggleGraph();
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      scope: {},
      link: link
    };
  };

  module.directive("tgToggleBurndownVisibility", ["$tgStorage", ToggleBurndownVisibility]);

  BurndownBacklogGraphDirective = function($translate) {
    var link, redrawChart;
    redrawChart = function(element, dataToDraw) {
      var client_increment_line, colors, data, evolution_line, j, milestonesRange, optimal_line, options, ref, results, team_increment_line, width, zero_line;
      width = element.width();
      element.height(width / 6);
      milestonesRange = (function() {
        results = [];
        for (var j = 0, ref = dataToDraw.milestones.length - 1; 0 <= ref ? j <= ref : j >= ref; 0 <= ref ? j++ : j--){ results.push(j); }
        return results;
      }).apply(this);
      data = [];
      zero_line = _.map(dataToDraw.milestones, function(ml) {
        return 0;
      });
      data.push({
        data: _.zip(milestonesRange, zero_line),
        lines: {
          fillColor: "rgba(0,0,0,0)"
        },
        points: {
          show: false
        }
      });
      optimal_line = _.map(dataToDraw.milestones, function(ml) {
        return ml.optimal;
      });
      data.push({
        data: _.zip(milestonesRange, optimal_line),
        lines: {
          fillColor: "rgba(120,120,120,0.2)"
        }
      });
      evolution_line = _.filter(_.map(dataToDraw.milestones, function(ml) {
        return ml.evolution;
      }), function(evolution) {
        return evolution != null;
      });
      data.push({
        data: _.zip(milestonesRange, evolution_line),
        lines: {
          fillColor: "rgba(102,153,51,0.3)"
        }
      });
      team_increment_line = _.map(dataToDraw.milestones, function(ml) {
        return -ml["team-increment"];
      });
      data.push({
        data: _.zip(milestonesRange, team_increment_line),
        lines: {
          fillColor: "rgba(153,51,51,0.3)"
        }
      });
      client_increment_line = _.map(dataToDraw.milestones, function(ml) {
        return -ml["team-increment"] - ml["client-increment"];
      });
      data.push({
        data: _.zip(milestonesRange, client_increment_line),
        lines: {
          fillColor: "rgba(255,51,51,0.3)"
        }
      });
      colors = ["rgba(0,0,0,1)", "rgba(120,120,120,0.2)", "rgba(102,153,51,1)", "rgba(153,51,51,1)", "rgba(255,51,51,1)"];
      options = {
        grid: {
          borderWidth: {
            top: 0,
            right: 1,
            left: 0,
            bottom: 0
          },
          borderColor: "#ccc",
          hoverable: true
        },
        xaxis: {
          ticks: dataToDraw.milestones.length,
          axisLabel: $translate.instant("BACKLOG.CHART.XAXIS_LABEL"),
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 12,
          axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
          axisLabelPadding: 5,
          tickFormatter: function(val, axis) {
            return "";
          }
        },
        yaxis: {
          axisLabel: $translate.instant("BACKLOG.CHART.YAXIS_LABEL"),
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 12,
          axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
          axisLabelPadding: 5
        },
        series: {
          shadowSize: 0,
          lines: {
            show: true,
            fill: true
          },
          points: {
            show: true,
            fill: true,
            radius: 4,
            lineWidth: 2
          }
        },
        colors: colors,
        tooltip: true,
        tooltipOpts: {
          content: function(label, xval, yval, flotItem) {
            var ctx;
            if (flotItem.seriesIndex === 1) {
              ctx = {
                sprintName: dataToDraw.milestones[xval].name,
                value: Math.abs(yval)
              };
              return $translate.instant("BACKLOG.CHART.OPTIMAL", ctx);
            } else if (flotItem.seriesIndex === 2) {
              ctx = {
                sprintName: dataToDraw.milestones[xval].name,
                value: Math.abs(yval)
              };
              return $translate.instant("BACKLOG.CHART.REAL", ctx);
            } else if (flotItem.seriesIndex === 3) {
              ctx = {
                sprintName: dataToDraw.milestones[xval].name,
                value: Math.abs(yval)
              };
              return $translate.instant("BACKLOG.CHART.INCREMENT_TEAM", ctx);
            } else {
              ctx = {
                sprintName: dataToDraw.milestones[xval].name,
                value: Math.abs(yval)
              };
              return $translate.instant("BACKLOG.CHART.INCREMENT_CLIENT", ctx);
            }
          }
        }
      };
      element.empty();
      return element.plot(data, options).data("plot");
    };
    link = function($scope, $el, $attrs) {
      var element;
      element = angular.element($el);
      $scope.$watch("stats", function(value) {
        if ($scope.stats != null) {
          redrawChart(element, $scope.stats);
          return $scope.$on("resize", function() {
            return redrawChart(element, $scope.stats);
          });
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgBurndownBacklogGraph", ["$translate", BurndownBacklogGraphDirective]);

  TgBacklogProgressBarDirective = function($template) {
    var adjustPercentaje, link, render, template;
    template = $template.get("backlog/progress-bar.html", true);
    render = function(el, projectPointsPercentaje, closedPointsPercentaje) {
      return el.html(template({
        projectPointsPercentaje: projectPointsPercentaje,
        closedPointsPercentaje: closedPointsPercentaje
      }));
    };
    adjustPercentaje = function(percentage) {
      var adjusted;
      adjusted = _.max([0, percentage]);
      adjusted = _.min([100, adjusted]);
      return Math.round(adjusted);
    };
    link = function($scope, $el, $attrs) {
      var element;
      element = angular.element($el);
      $scope.$watch($attrs.tgBacklogProgressBar, function(stats) {
        var closedPoints, closedPointsPercentaje, definedPoints, projectPointsPercentaje, totalPoints;
        if (stats != null) {
          totalPoints = stats.total_points;
          definedPoints = stats.defined_points;
          closedPoints = stats.closed_points;
          if (definedPoints > totalPoints) {
            projectPointsPercentaje = totalPoints * 100 / definedPoints;
            closedPointsPercentaje = closedPoints * 100 / definedPoints;
          } else {
            projectPointsPercentaje = 100;
            closedPointsPercentaje = closedPoints * 100 / totalPoints;
          }
          projectPointsPercentaje = adjustPercentaje(projectPointsPercentaje - 3);
          closedPointsPercentaje = adjustPercentaje(closedPointsPercentaje - 3);
          return render($el, projectPointsPercentaje, closedPointsPercentaje);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgBacklogProgressBar", ["$tgTemplate", TgBacklogProgressBarDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/backlog/sortable.coffee
 */

(function() {
  var BacklogEmptySortableDirective, BacklogSortableDirective, SprintSortableDirective, bindOnce, deleteElement, groupBy, mixOf, module, scopeDefer, taiga, toggleText;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  toggleText = this.taiga.toggleText;

  scopeDefer = this.taiga.scopeDefer;

  bindOnce = this.taiga.bindOnce;

  groupBy = this.taiga.groupBy;

  module = angular.module("taigaBacklog");

  deleteElement = function(el) {
    el.scope().$destroy();
    el.off();
    return el.remove();
  };

  BacklogSortableDirective = function($repo, $rs, $rootscope, $tgConfirm, $translate) {
    var link;
    link = function($scope, $el, $attrs) {
      var getUsIndex;
      getUsIndex = (function(_this) {
        return function(us) {
          return $(us).index(".backlog-table-body .row");
        };
      })(this);
      bindOnce($scope, "project", function(project) {
        var filterError;
        if (!(project.my_permissions.indexOf("modify_us") > -1)) {
          return;
        }
        filterError = function() {
          var text;
          text = $translate.instant("BACKLOG.SORTABLE_FILTER_ERROR");
          return $tgConfirm.notify("error", text);
        };
        $el.sortable({
          items: ".us-item-row",
          cancel: ".popover",
          connectWith: ".sprint",
          dropOnEmpty: true,
          placeholder: "row us-item-row us-item-drag sortable-placeholder",
          scroll: true,
          disableHorizontalScroll: true,
          tolerance: "pointer",
          revert: false,
          start: function() {
            return $(document.body).addClass("drag-active");
          },
          stop: function() {
            $(document.body).removeClass("drag-active");
            if ($el.hasClass("active-filters")) {
              $el.sortable("cancel");
              return filterError();
            }
          }
        });
        $el.on("multiplesortreceive", function(event, ui) {
          var itemIndex, itemUs;
          if ($el.hasClass("active-filters")) {
            ui.source.sortable("cancel");
            filterError();
            return;
          }
          itemUs = ui.item.scope().us;
          itemIndex = getUsIndex(ui.item);
          deleteElement(ui.item);
          $scope.$emit("sprint:us:move", [itemUs], itemIndex, null);
          return ui.item.find('a').removeClass('noclick');
        });
        $el.on("multiplesortstop", function(event, ui) {
          var index, items, us;
          if ($(ui.items[0]).parent().length === 0) {
            return;
          }
          if ($el.hasClass("active-filters")) {
            return;
          }
          items = _.sortBy(ui.items, function(item) {
            return $(item).index();
          });
          index = _.min(_.map(items, function(item) {
            return getUsIndex(item);
          }));
          us = _.map(items, function(item) {
            var itemUs;
            item = $(item);
            itemUs = item.scope().us;
            setTimeout(((function(_this) {
              return function() {
                return item.find('a').removeClass('noclick');
              };
            })(this)), 300);
            return itemUs;
          });
          return $scope.$emit("sprint:us:move", us, index, null);
        });
        return $el.on("sortstart", function(event, ui) {
          return ui.item.find('a').addClass('noclick');
        });
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  BacklogEmptySortableDirective = function($repo, $rs, $rootscope) {
    var link;
    link = function($scope, $el, $attrs) {
      bindOnce($scope, "project", function(project) {
        if (project.my_permissions.indexOf("modify_us") > -1) {
          $el.sortable({
            dropOnEmpty: true
          });
          return $el.on("sortreceive", function(event, ui) {
            var itemIndex, itemUs;
            itemUs = ui.item.scope().us;
            itemIndex = ui.item.index();
            deleteElement(ui.item);
            $scope.$emit("sprint:us:move", [itemUs], itemIndex, null);
            return ui.item.find('a').removeClass('noclick');
          });
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  SprintSortableDirective = function($repo, $rs, $rootscope) {
    var link;
    link = function($scope, $el, $attrs) {
      return bindOnce($scope, "project", function(project) {
        if (project.my_permissions.indexOf("modify_us") > -1) {
          $el.sortable({
            scroll: true,
            dropOnEmpty: true,
            items: ".sprint-table .milestone-us-item-row",
            disableHorizontalScroll: true,
            connectWith: ".sprint,.backlog-table-body,.empty-backlog",
            placeholder: "row us-item-row sortable-placeholder",
            forcePlaceholderSize: true
          });
          $el.on("multiplesortreceive", function(event, ui) {
            var index, items, us;
            items = _.sortBy(ui.items, function(item) {
              return $(item).index();
            });
            index = _.min(_.map(items, function(item) {
              return $(item).index();
            }));
            us = _.map(items, function(item) {
              var itemUs;
              item = $(item);
              itemUs = item.scope().us;
              deleteElement(item);
              return itemUs;
            });
            return $scope.$emit("sprint:us:move", us, index, $scope.sprint.id);
          });
          $el.on("multiplesortstop", function(event, ui) {
            var itemIndex, itemUs;
            if (ui.item.parent().length === 0) {
              return;
            }
            itemUs = ui.item.scope().us;
            itemIndex = ui.item.index();
            setTimeout(((function(_this) {
              return function() {
                return ui.item.find('a').removeClass('noclick');
              };
            })(this)), 300);
            return $scope.$emit("sprint:us:move", [itemUs], itemIndex, $scope.sprint.id);
          });
          return $el.on("sortstart", function(event, ui) {
            return ui.item.find('a').addClass('noclick');
          });
        }
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgBacklogSortable", ["$tgRepo", "$tgResources", "$rootScope", "$tgConfirm", "$translate", BacklogSortableDirective]);

  module.directive("tgBacklogEmptySortable", ["$tgRepo", "$tgResources", "$rootScope", BacklogEmptySortableDirective]);

  module.directive("tgSprintSortable", ["$tgRepo", "$tgResources", "$rootScope", SprintSortableDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/backlog/sprints.coffee
 */

(function() {
  var BacklogSprintDirective, BacklogSprintHeaderDirective, ToggleExcludeClosedSprintsVisualization, module, taiga;

  taiga = this.taiga;

  module = angular.module("taigaBacklog");

  BacklogSprintDirective = function($repo, $rootscope) {
    var link, refreshSprintTableHeight, slideOptions, sprintTableMinHeight, toggleSprint;
    sprintTableMinHeight = 50;
    slideOptions = {
      duration: 500,
      easing: 'linear'
    };
    refreshSprintTableHeight = (function(_this) {
      return function(sprintTable) {
        if (!sprintTable.find(".row").length) {
          return sprintTable.css("height", sprintTableMinHeight);
        } else {
          return sprintTable.css("height", "auto");
        }
      };
    })(this);
    toggleSprint = (function(_this) {
      return function($el) {
        var sprintArrow, sprintTable;
        sprintTable = $el.find(".sprint-table");
        sprintArrow = $el.find(".icon-arrow-up");
        sprintArrow.toggleClass('active');
        sprintTable.toggleClass('open');
        return refreshSprintTableHeight(sprintTable);
      };
    })(this);
    link = function($scope, $el, $attrs) {
      $scope.$watch($attrs.tgBacklogSprint, function(sprint) {
        sprint = $scope.$eval($attrs.tgBacklogSprint);
        if (sprint.closed) {
          return $el.addClass("sprint-closed");
        } else {
          return toggleSprint($el);
        }
      });
      $el.on("click", ".sprint-name > .icon-arrow-up", function(event) {
        event.preventDefault();
        toggleSprint($el);
        return $el.find(".sprint-table").slideToggle(slideOptions);
      });
      $el.on("click", ".sprint-name > .icon-edit", function(event) {
        var sprint;
        event.preventDefault();
        sprint = $scope.$eval($attrs.tgBacklogSprint);
        return $rootscope.$broadcast("sprintform:edit", sprint);
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgBacklogSprint", ["$tgRepo", "$rootScope", BacklogSprintDirective]);

  BacklogSprintHeaderDirective = function($navUrls, $template, $compile, $translate) {
    var link, template;
    template = $template.get("backlog/sprint-header.html");
    link = function($scope, $el, $attrs, $model) {
      var isEditable, isVisible, prettyDate, render;
      prettyDate = $translate.instant("BACKLOG.SPRINTS.DATE");
      isEditable = function() {
        return $scope.project.my_permissions.indexOf("modify_milestone") !== -1;
      };
      isVisible = function() {
        return $scope.project.my_permissions.indexOf("view_milestones") !== -1;
      };
      render = function(sprint) {
        var compiledTemplate, ctx, estimatedDateRange, finish, start, taskboardUrl, templateScope;
        taskboardUrl = $navUrls.resolve("project-taskboard", {
          project: $scope.project.slug,
          sprint: sprint.slug
        });
        start = moment(sprint.estimated_start).format(prettyDate);
        finish = moment(sprint.estimated_finish).format(prettyDate);
        estimatedDateRange = start + "-" + finish;
        ctx = {
          name: sprint.name,
          taskboardUrl: taskboardUrl,
          estimatedDateRange: estimatedDateRange,
          closedPoints: sprint.closed_points || 0,
          totalPoints: sprint.total_points || 0,
          isVisible: isVisible(),
          isEditable: isEditable()
        };
        templateScope = $scope.$new();
        _.assign(templateScope, ctx);
        compiledTemplate = $compile(template)(templateScope);
        return $el.html(compiledTemplate);
      };
      $scope.$watch($attrs.ngModel, function(sprint) {
        return render(sprint);
      });
      $scope.$on("sprintform:edit:success", function() {
        return render($model.$modelValue);
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgBacklogSprintHeader", ["$tgNavUrls", "$tgTemplate", "$compile", "$translate", BacklogSprintHeaderDirective]);

  ToggleExcludeClosedSprintsVisualization = function($rootscope, $loading, $translate) {
    var excludeClosedSprints, link;
    excludeClosedSprints = true;
    link = function($scope, $el, $attrs) {
      var loadingElm;
      loadingElm = $("<div>");
      $el.after(loadingElm);
      $el.on("click", function(event) {
        event.preventDefault();
        excludeClosedSprints = !excludeClosedSprints;
        $loading.start(loadingElm);
        if (excludeClosedSprints) {
          return $rootscope.$broadcast("backlog:unload-closed-sprints");
        } else {
          return $rootscope.$broadcast("backlog:load-closed-sprints");
        }
      });
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      return $scope.$on("closed-sprints:reloaded", (function(_this) {
        return function(ctx, sprints) {
          var key, text;
          $loading.finish(loadingElm);
          if (sprints.length > 0) {
            key = "BACKLOG.SPRINTS.ACTION_HIDE_CLOSED_SPRINTS";
          } else {
            key = "BACKLOG.SPRINTS.ACTION_SHOW_CLOSED_SPRINTS";
          }
          text = $translate.instant(key);
          return $el.find(".text").text(text);
        };
      })(this));
    };
    return {
      link: link
    };
  };

  module.directive("tgBacklogToggleClosedSprintsVisualization", ["$rootScope", "$tgLoading", "$translate", ToggleExcludeClosedSprintsVisualization]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/taskboard/charts.coffee
 */

(function() {
  var SprintGraphDirective, bindOnce, groupBy, mixOf, module, scopeDefer, taiga, timeout, toggleText;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  toggleText = this.taiga.toggleText;

  scopeDefer = this.taiga.scopeDefer;

  bindOnce = this.taiga.bindOnce;

  groupBy = this.taiga.groupBy;

  timeout = this.taiga.timeout;

  module = angular.module("taigaTaskboard");

  SprintGraphDirective = function($translate) {
    var link, redrawChart;
    redrawChart = function(element, dataToDraw) {
      var data, days, options, width;
      width = element.width();
      element.height(240);
      days = _.map(dataToDraw, function(x) {
        return moment(x.day);
      });
      data = [];
      data.unshift({
        data: _.zip(days, _.map(dataToDraw, function(d) {
          return d.optimal_points;
        })),
        lines: {
          fillColor: "rgba(120,120,120,0.2)"
        }
      });
      data.unshift({
        data: _.zip(days, _.map(dataToDraw, function(d) {
          return d.open_points;
        })),
        lines: {
          fillColor: "rgba(102,153,51,0.3)"
        }
      });
      options = {
        grid: {
          borderWidth: {
            top: 0,
            right: 1,
            left: 0,
            bottom: 0
          },
          borderColor: '#ccc',
          hoverable: true
        },
        xaxis: {
          tickSize: [1, "day"],
          min: days[0],
          max: _.last(days),
          mode: "time",
          daysNames: days,
          axisLabel: $translate.instant("TASKBOARD.CHARTS.XAXIS_LABEL"),
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 12,
          axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
          axisLabelPadding: 5
        },
        yaxis: {
          min: 0,
          axisLabel: $translate.instant("TASKBOARD.CHARTS.YAXIS_LABEL"),
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 12,
          axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
          axisLabelPadding: 5
        },
        series: {
          shadowSize: 0,
          lines: {
            show: true,
            fill: true
          },
          points: {
            show: true,
            fill: true,
            radius: 4,
            lineWidth: 2
          }
        },
        colors: ["rgba(102,153,51,1)", "rgba(120,120,120,0.2)"],
        tooltip: true,
        tooltipOpts: {
          content: function(label, xval, yval, flotItem) {
            var formattedDate, roundedValue;
            formattedDate = moment(xval).format($translate.instant("TASKBOARD.CHARTS.DATE"));
            roundedValue = Math.round(yval);
            if (flotItem.seriesIndex === 1) {
              return $translate.instant("TASKBOARD.CHARTS.OPTIMAL", {
                formattedDate: formattedDate,
                roundedValue: roundedValue
              });
            } else {
              return $translate.instant("TASKBOARD.CHARTS.REAL", {
                formattedDate: formattedDate,
                roundedValue: roundedValue
              });
            }
          }
        }
      };
      element.empty();
      return element.plot(data, options).data("plot");
    };
    link = function($scope, $el, $attrs) {
      var element;
      element = angular.element($el);
      $scope.$on("resize", function() {
        if ($scope.stats) {
          return redrawChart(element, $scope.stats.days);
        }
      });
      $scope.$on("taskboard:graph:toggle-visibility", function() {
        $el.parent().toggleClass('open');
        return timeout(100, function() {
          if ($scope.stats) {
            return redrawChart(element, $scope.stats.days);
          }
        });
      });
      $scope.$watch('stats', function(value) {
        if ($scope.stats == null) {
          return;
        }
        return redrawChart(element, $scope.stats.days);
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgSprintGraph", ["$translate", SprintGraphDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/taskboard/lightboxes.coffee
 */

(function() {
  var CreateBulkTasksDirective, CreateEditTaskDirective, bindOnce, debounce, module, taiga;

  taiga = this.taiga;

  bindOnce = this.taiga.bindOnce;

  debounce = this.taiga.debounce;

  CreateEditTaskDirective = function($repo, $model, $rs, $rootscope, $loading, lightboxService, $translate) {
    var link;
    link = function($scope, $el, attrs) {
      var submit, submitButton;
      $scope.isNew = true;
      $scope.$on("taskform:new", function(ctx, sprintId, usId) {
        var create, newTask;
        $scope.task = {
          project: $scope.projectId,
          milestone: sprintId,
          user_story: usId,
          is_archived: false,
          status: $scope.project.default_task_status,
          assigned_to: null,
          tags: []
        };
        $scope.isNew = true;
        create = $translate.instant("COMMON.CREATE");
        $el.find(".button-green").html(create);
        newTask = $translate.instant("LIGHTBOX.CREATE_EDIT_TASK.TITLE");
        $el.find(".title").html(newTask + "  ");
        $el.find(".tag-input").val("");
        return lightboxService.open($el);
      });
      $scope.$on("taskform:edit", function(ctx, task) {
        var edit, save;
        $scope.task = task;
        $scope.isNew = false;
        save = $translate.instant("COMMON.SAVE");
        edit = $translate.instant("LIGHTBOX.CREATE_EDIT_TASK.ACTION_EDIT");
        $el.find(".button-green").html(save);
        $el.find(".title").html(edit + "  ");
        $el.find(".tag-input").val("");
        return lightboxService.open($el);
      });
      submitButton = $el.find(".submit-button");
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var broadcastEvent, form, promise;
          event.preventDefault();
          form = $el.find("form").checksley();
          if (!form.validate()) {
            return;
          }
          if ($scope.isNew) {
            promise = $repo.create("tasks", $scope.task);
            broadcastEvent = "taskform:new:success";
          } else {
            promise = $repo.save($scope.task);
            broadcastEvent = "taskform:edit:success";
          }
          $loading.start(submitButton);
          return promise.then(function(data) {
            $loading.finish(submitButton);
            lightboxService.close($el);
            return $rootscope.$broadcast(broadcastEvent, data);
          });
        };
      })(this));
      $el.on("submit", "form", submit);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  CreateBulkTasksDirective = function($repo, $rs, $rootscope, $loading, lightboxService) {
    var link;
    link = function($scope, $el, attrs) {
      var submit, submitButton;
      $scope.form = {
        data: "",
        usId: null
      };
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var data, form, projectId, promise, sprintId, usId;
          event.preventDefault();
          form = $el.find("form").checksley();
          if (!form.validate()) {
            return;
          }
          $loading.start(submitButton);
          data = $scope.form.data;
          projectId = $scope.projectId;
          sprintId = $scope.form.sprintId;
          usId = $scope.form.usId;
          promise = $rs.tasks.bulkCreate(projectId, sprintId, usId, data);
          promise.then(function(result) {
            $loading.finish(submitButton);
            $rootscope.$broadcast("taskform:bulk:success", result);
            return lightboxService.close($el);
          });
          return promise.then(null, function() {
            $loading.finish(submitButton);
            return console.log("FAIL");
          });
        };
      })(this));
      $scope.$on("taskform:bulk", function(ctx, sprintId, usId) {
        lightboxService.open($el);
        return $scope.form = {
          data: "",
          sprintId: sprintId,
          usId: usId
        };
      });
      submitButton = $el.find(".submit-button");
      $el.on("submit", "form", submit);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module = angular.module("taigaTaskboard");

  module.directive("tgLbCreateEditTask", ["$tgRepo", "$tgModel", "$tgResources", "$rootScope", "$tgLoading", "lightboxService", "$translate", CreateEditTaskDirective]);

  module.directive("tgLbCreateBulkTasks", ["$tgRepo", "$tgResources", "$rootScope", "$tgLoading", "lightboxService", CreateBulkTasksDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/taskboard.coffee
 */

(function() {
  var TaskboardController, TaskboardDirective, TaskboardSquishColumnDirective, TaskboardTaskDirective, TaskboardUserDirective, bindMethods, bindOnce, groupBy, mixOf, module, scopeDefer, taiga, timeout, toggleText,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  toggleText = this.taiga.toggleText;

  mixOf = this.taiga.mixOf;

  groupBy = this.taiga.groupBy;

  bindOnce = this.taiga.bindOnce;

  scopeDefer = this.taiga.scopeDefer;

  timeout = this.taiga.timeout;

  bindMethods = this.taiga.bindMethods;

  module = angular.module("taigaTaskboard");

  TaskboardController = (function(superClass) {
    extend(TaskboardController, superClass);

    TaskboardController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgConfirm", "$tgResources", "$routeParams", "$q", "tgAppMetaService", "$tgLocation", "$tgNavUrls", "$tgEvents", "$tgAnalytics", "$translate"];

    function TaskboardController(scope, rootscope, repo, confirm, rs1, params1, q, appMetaService, location, navUrls, events, analytics, translate) {
      var promise;
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs1;
      this.params = params1;
      this.q = q;
      this.appMetaService = appMetaService;
      this.location = location;
      this.navUrls = navUrls;
      this.events = events;
      this.analytics = analytics;
      this.translate = translate;
      bindMethods(this);
      this.scope.sectionName = this.translate.instant("TASKBOARD.SECTION_NAME");
      this.initializeEventHandlers();
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          return _this._setMeta();
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
    }

    TaskboardController.prototype._setMeta = function() {
      var description, prettyDate, title;
      prettyDate = this.translate.instant("BACKLOG.SPRINTS.DATE");
      title = this.translate.instant("TASKBOARD.PAGE_TITLE", {
        projectName: this.scope.project.name,
        sprintName: this.scope.sprint.name
      });
      description = this.translate.instant("TASKBOARD.PAGE_DESCRIPTION", {
        projectName: this.scope.project.name,
        sprintName: this.scope.sprint.name,
        startDate: moment(this.scope.sprint.estimated_start).format(prettyDate),
        endDate: moment(this.scope.sprint.estimated_finish).format(prettyDate),
        completedPercentage: this.scope.stats.completedPercentage || "0",
        completedPoints: this.scope.stats.completedPointsSum || "--",
        totalPoints: this.scope.stats.totalPointsSum || "--",
        openTasks: this.scope.stats.openTasks || "--",
        totalTasks: this.scope.stats.total_tasks || "--"
      });
      return this.appMetaService.setAll(title, description);
    };

    TaskboardController.prototype.initializeEventHandlers = function() {
      this.scope.$on("taskform:bulk:success", (function(_this) {
        return function() {
          _this.loadTaskboard();
          return _this.analytics.trackEvent("task", "create", "bulk create task on taskboard", 1);
        };
      })(this));
      this.scope.$on("taskform:new:success", (function(_this) {
        return function() {
          _this.loadTaskboard();
          return _this.analytics.trackEvent("task", "create", "create task on taskboard", 1);
        };
      })(this));
      this.scope.$on("taskform:edit:success", (function(_this) {
        return function() {
          return _this.loadTaskboard();
        };
      })(this));
      this.scope.$on("taskboard:task:move", this.taskMove);
      return this.scope.$on("assigned-to:added", (function(_this) {
        return function(ctx, userId, task) {
          var promise;
          task.assigned_to = userId;
          promise = _this.repo.save(task);
          return promise.then(null, function() {
            return console.log("FAIL");
          });
        };
      })(this));
    };

    TaskboardController.prototype.initializeSubscription = function() {
      var routingKey, routingKey1;
      routingKey = "changes.project." + this.scope.projectId + ".tasks";
      this.events.subscribe(this.scope, routingKey, (function(_this) {
        return function(message) {
          return _this.loadTaskboard();
        };
      })(this));
      routingKey1 = "changes.project." + this.scope.projectId + ".userstories";
      return this.events.subscribe(this.scope, routingKey1, (function(_this) {
        return function(message) {
          _this.refreshTagsColors();
          _this.loadSprintStats();
          return _this.loadSprint();
        };
      })(this));
    };

    TaskboardController.prototype.loadProject = function() {
      return this.rs.projects.get(this.scope.projectId).then((function(_this) {
        return function(project) {
          if (!project.is_backlog_activated) {
            _this.location.path(_this.navUrls.resolve("permission-denied"));
          }
          _this.scope.project = project;
          _this.scope.pointsList = _.sortBy(project.points, "order");
          _this.scope.pointsById = groupBy(project.points, function(e) {
            return e.id;
          });
          _this.scope.roleById = groupBy(project.roles, function(e) {
            return e.id;
          });
          _this.scope.taskStatusList = _.sortBy(project.task_statuses, "order");
          _this.scope.usStatusList = _.sortBy(project.us_statuses, "order");
          _this.scope.usStatusById = groupBy(project.us_statuses, function(e) {
            return e.id;
          });
          _this.scope.$emit('project:loaded', project);
          _this.fillUsersAndRoles(project.members, project.roles);
          return project;
        };
      })(this));
    };

    TaskboardController.prototype.loadSprintStats = function() {
      return this.rs.sprints.stats(this.scope.projectId, this.scope.sprintId).then((function(_this) {
        return function(stats) {
          var completedPointsSum, remainingPointsSum, remainingTasks, totalPointsSum;
          totalPointsSum = _.reduce(_.values(stats.total_points), (function(res, n) {
            return res + n;
          }), 0);
          completedPointsSum = _.reduce(_.values(stats.completed_points), (function(res, n) {
            return res + n;
          }), 0);
          remainingPointsSum = totalPointsSum - completedPointsSum;
          remainingTasks = stats.total_tasks - stats.completed_tasks;
          _this.scope.stats = stats;
          _this.scope.stats.totalPointsSum = totalPointsSum;
          _this.scope.stats.completedPointsSum = completedPointsSum;
          _this.scope.stats.remainingPointsSum = remainingPointsSum;
          _this.scope.stats.remainingTasks = remainingTasks;
          if (stats.totalPointsSum) {
            _this.scope.stats.completedPercentage = Math.round(100 * stats.completedPointsSum / stats.totalPointsSum);
          } else {
            _this.scope.stats.completedPercentage = 0;
          }
          _this.scope.stats.openTasks = stats.total_tasks - stats.completed_tasks;
          return stats;
        };
      })(this));
    };

    TaskboardController.prototype.refreshTagsColors = function() {
      return this.rs.projects.tagsColors(this.scope.projectId).then((function(_this) {
        return function(tags_colors) {
          return _this.scope.project.tags_colors = tags_colors;
        };
      })(this));
    };

    TaskboardController.prototype.loadSprint = function() {
      return this.rs.sprints.get(this.scope.projectId, this.scope.sprintId).then((function(_this) {
        return function(sprint) {
          _this.scope.sprint = sprint;
          _this.scope.userstories = _.sortBy(sprint.user_stories, "sprint_order");
          return sprint;
        };
      })(this));
    };

    TaskboardController.prototype.loadTasks = function() {
      return this.rs.tasks.list(this.scope.projectId, this.scope.sprintId).then((function(_this) {
        return function(tasks) {
          var i, j, k, len, len1, len2, ref, ref1, ref2, status, task, us;
          _this.scope.tasks = _.sortBy(tasks, 'taskboard_order');
          _this.scope.usTasks = {};
          ref = _.union(_this.scope.userstories, [
            {
              id: null
            }
          ]);
          for (i = 0, len = ref.length; i < len; i++) {
            us = ref[i];
            _this.scope.usTasks[us.id] = {};
            ref1 = _this.scope.taskStatusList;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              status = ref1[j];
              _this.scope.usTasks[us.id][status.id] = [];
            }
          }
          ref2 = _this.scope.tasks;
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            task = ref2[k];
            if ((_this.scope.usTasks[task.user_story] != null) && (_this.scope.usTasks[task.user_story][task.status] != null)) {
              _this.scope.usTasks[task.user_story][task.status].push(task);
            }
          }
          return tasks;
        };
      })(this));
    };

    TaskboardController.prototype.loadTaskboard = function() {
      return this.q.all([
        this.refreshTagsColors(), this.loadSprintStats(), this.loadSprint().then((function(_this) {
          return function() {
            return _this.loadTasks();
          };
        })(this))
      ]);
    };

    TaskboardController.prototype.loadInitialData = function() {
      var params, promise;
      params = {
        pslug: this.params.pslug,
        sslug: this.params.sslug
      };
      promise = this.repo.resolve(params).then((function(_this) {
        return function(data) {
          _this.scope.projectId = data.project;
          _this.scope.sprintId = data.milestone;
          _this.initializeSubscription();
          return data;
        };
      })(this));
      return promise.then((function(_this) {
        return function() {
          return _this.loadProject();
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.loadTaskboard();
        };
      })(this));
    };

    TaskboardController.prototype.refreshTasksOrder = function(tasks) {
      var data, items;
      items = this.resortTasks(tasks);
      data = this.prepareBulkUpdateData(items);
      return this.rs.tasks.bulkUpdateTaskTaskboardOrder(this.scope.project.id, data);
    };

    TaskboardController.prototype.resortTasks = function(tasks) {
      var i, index, item, items, len;
      items = [];
      for (index = i = 0, len = tasks.length; i < len; index = ++i) {
        item = tasks[index];
        item["taskboard_order"] = index;
        if (item.isModified()) {
          items.push(item);
        }
      }
      return items;
    };

    TaskboardController.prototype.prepareBulkUpdateData = function(uses) {
      return _.map(uses, function(x) {
        return {
          "task_id": x.id,
          "order": x["taskboard_order"]
        };
      });
    };

    TaskboardController.prototype.taskMove = function(ctx, task, usId, statusId, order) {
      var promise, r, tasks;
      r = this.scope.usTasks[task.user_story][task.status].indexOf(task);
      this.scope.usTasks[task.user_story][task.status].splice(r, 1);
      tasks = this.scope.usTasks[usId][statusId];
      tasks.splice(order, 0, task);
      task.user_story = usId;
      task.status = statusId;
      task.taskboard_order = order;
      promise = this.repo.save(task);
      this.rootscope.$broadcast("sprint:task:moved", task);
      promise.then((function(_this) {
        return function() {
          _this.refreshTasksOrder(tasks);
          return _this.loadSprintStats();
        };
      })(this));
      return promise.then(null, (function(_this) {
        return function() {
          return console.log("FAIL TASK SAVE");
        };
      })(this));
    };

    TaskboardController.prototype.addNewTask = function(type, us) {
      switch (type) {
        case "standard":
          return this.rootscope.$broadcast("taskform:new", this.scope.sprintId, us != null ? us.id : void 0);
        case "bulk":
          return this.rootscope.$broadcast("taskform:bulk", this.scope.sprintId, us != null ? us.id : void 0);
      }
    };

    TaskboardController.prototype.editTaskAssignedTo = function(task) {
      return this.rootscope.$broadcast("assigned-to:add", task);
    };

    return TaskboardController;

  })(mixOf(taiga.Controller, taiga.PageMixin));

  module.controller("TaskboardController", TaskboardController);

  TaskboardDirective = function($rootscope) {
    var link;
    link = function($scope, $el, $attrs) {
      var $ctrl, tableBodyDom;
      $ctrl = $el.controller();
      $el.on("click", ".toggle-analytics-visibility", function(event) {
        var target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        target.toggleClass('active');
        return $rootscope.$broadcast("taskboard:graph:toggle-visibility");
      });
      tableBodyDom = $el.find(".taskboard-table-body");
      tableBodyDom.on("scroll", function(event) {
        var tableHeaderDom, target;
        target = angular.element(event.currentTarget);
        tableHeaderDom = $el.find(".taskboard-table-header .taskboard-table-inner");
        return tableHeaderDom.css("left", -1 * target.scrollLeft());
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgTaskboard", ["$rootScope", TaskboardDirective]);

  TaskboardTaskDirective = function($rootscope) {
    var link;
    link = function($scope, $el, $attrs, $model) {
      $el.disableSelection();
      $scope.$watch("task", function(task) {
        if (task.is_blocked && !$el.hasClass("blocked")) {
          return $el.addClass("blocked");
        } else if (!task.is_blocked && $el.hasClass("blocked")) {
          return $el.removeClass("blocked");
        }
      });
      return $el.find(".icon-edit").on("click", function(event) {
        if ($el.find('.icon-edit').hasClass('noclick')) {
          return;
        }
        return $scope.$apply(function() {
          return $rootscope.$broadcast("taskform:edit", $scope.task);
        });
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgTaskboardTask", ["$rootScope", TaskboardTaskDirective]);

  TaskboardSquishColumnDirective = function(rs) {
    var avatarWidth, link, maxColumnWidth;
    avatarWidth = 40;
    maxColumnWidth = 300;
    link = function($scope, $el, $attrs) {
      var getCeilWidth, recalculateStatusColumnWidth, recalculateTaskboardWidth, refreshTaskboardTableWidth, setStatusColumnWidth;
      $scope.$on("sprint:task:moved", (function(_this) {
        return function() {
          return recalculateTaskboardWidth();
        };
      })(this));
      bindOnce($scope, "usTasks", function(project) {
        $scope.statusesFolded = rs.tasks.getStatusColumnModes($scope.project.id);
        $scope.usFolded = rs.tasks.getUsRowModes($scope.project.id, $scope.sprintId);
        return recalculateTaskboardWidth();
      });
      $scope.foldStatus = function(status) {
        $scope.statusesFolded[status.id] = !!!$scope.statusesFolded[status.id];
        rs.tasks.storeStatusColumnModes($scope.projectId, $scope.statusesFolded);
        return recalculateTaskboardWidth();
      };
      $scope.foldUs = function(us) {
        if (!us) {
          $scope.usFolded[null] = !!!$scope.usFolded[null];
        } else {
          $scope.usFolded[us.id] = !!!$scope.usFolded[us.id];
        }
        rs.tasks.storeUsRowModes($scope.projectId, $scope.sprintId, $scope.usFolded);
        return recalculateTaskboardWidth();
      };
      getCeilWidth = (function(_this) {
        return function(usId, statusId) {
          var tasks, tasksMatrixSize, width;
          tasks = $scope.usTasks[usId][statusId].length;
          if ($scope.statusesFolded[statusId]) {
            if (tasks && $scope.usFolded[usId]) {
              tasksMatrixSize = Math.round(Math.sqrt(tasks));
              width = avatarWidth * tasksMatrixSize;
            } else {
              width = avatarWidth;
            }
            return width;
          }
          return 0;
        };
      })(this);
      setStatusColumnWidth = (function(_this) {
        return function(statusId, width) {
          var column;
          column = $el.find(".squish-status-" + statusId);
          if (width) {
            return column.css('max-width', width);
          } else {
            return column.css("max-width", maxColumnWidth);
          }
        };
      })(this);
      refreshTaskboardTableWidth = (function(_this) {
        return function() {
          var columnWidths, columns, totalWidth;
          columnWidths = [];
          columns = $el.find(".task-colum-name");
          columnWidths = _.map(columns, function(column) {
            return $(column).outerWidth(true);
          });
          totalWidth = _.reduce(columnWidths, function(total, width) {
            return total + width;
          });
          return $el.find('.taskboard-table-inner').css("width", totalWidth);
        };
      })(this);
      recalculateStatusColumnWidth = (function(_this) {
        return function(statusId) {
          var statusFoldedWidth;
          statusFoldedWidth = getCeilWidth(null, statusId);
          _.forEach($scope.userstories, function(us) {
            var width;
            width = getCeilWidth(us.id, statusId);
            if (width > statusFoldedWidth) {
              return statusFoldedWidth = width;
            }
          });
          return setStatusColumnWidth(statusId, statusFoldedWidth);
        };
      })(this);
      return recalculateTaskboardWidth = (function(_this) {
        return function() {
          _.forEach($scope.taskStatusList, function(status) {
            return recalculateStatusColumnWidth(status.id);
          });
          refreshTaskboardTableWidth();
        };
      })(this);
    };
    return {
      link: link
    };
  };

  module.directive("tgTaskboardSquishColumn", ["$tgResources", TaskboardSquishColumnDirective]);

  TaskboardUserDirective = function($log) {
    var clickable, link;
    clickable = false;
    link = function($scope, $el, $attrs) {
      var username_label;
      username_label = $el.parent().find("a.task-assigned");
      username_label.addClass("not-clickable");
      $scope.$watch('task.assigned_to', function(assigned_to) {
        var user;
        user = $scope.usersById[assigned_to];
        if (user === void 0) {
          _.assign($scope, {
            name: "Unassigned",
            imgurl: "/images/unnamed.png",
            clickable: clickable
          });
        } else {
          _.assign($scope, {
            name: user.full_name_display,
            imgurl: user.photo,
            clickable: clickable
          });
        }
        return username_label.text($scope.name);
      });
      return bindOnce($scope, "project", function(project) {
        if (project.my_permissions.indexOf("modify_task") > -1) {
          clickable = true;
          $el.find(".avatar-assigned-to").on("click", (function(_this) {
            return function(event) {
              var $ctrl;
              if ($el.find('a').hasClass('noclick')) {
                return;
              }
              $ctrl = $el.controller();
              return $ctrl.editTaskAssignedTo($scope.task);
            };
          })(this));
          username_label.removeClass("not-clickable");
          return username_label.on("click", function(event) {
            var $ctrl;
            if ($el.find('a').hasClass('noclick')) {
              return;
            }
            $ctrl = $el.controller();
            return $ctrl.editTaskAssignedTo($scope.task);
          });
        }
      });
    };
    return {
      link: link,
      templateUrl: "taskboard/taskboard-user.html",
      scope: {
        "usersById": "=users",
        "project": "=",
        "task": "="
      }
    };
  };

  module.directive("tgTaskboardUserAvatar", ["$log", TaskboardUserDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/taskboard/sortable.coffee
 */

(function() {
  var TaskboardSortableDirective, bindOnce, groupBy, mixOf, module, scopeDefer, taiga, toggleText;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  toggleText = this.taiga.toggleText;

  scopeDefer = this.taiga.scopeDefer;

  bindOnce = this.taiga.bindOnce;

  groupBy = this.taiga.groupBy;

  module = angular.module("taigaBacklog");

  TaskboardSortableDirective = function($repo, $rs, $rootscope) {
    var link;
    link = function($scope, $el, $attrs) {
      bindOnce($scope, "project", function(project) {
        var deleteElement, itemEl, newParentScope, oldParentScope, tdom;
        if (!(project.my_permissions.indexOf("modify_us") > -1)) {
          return;
        }
        oldParentScope = null;
        newParentScope = null;
        itemEl = null;
        tdom = $el;
        deleteElement = function(itemEl) {
          itemEl.scope().$destroy();
          itemEl.off();
          return itemEl.remove();
        };
        tdom.sortable({
          handle: ".taskboard-task-inner",
          dropOnEmpty: true,
          connectWith: ".taskboard-tasks-box",
          revert: 400
        });
        tdom.on("sortstop", function(event, ui) {
          var itemIndex, itemTask, newStatusId, newUsId, oldStatusId, oldUsId, parentEl;
          parentEl = ui.item.parent();
          itemEl = ui.item;
          itemTask = itemEl.scope().task;
          itemIndex = itemEl.index();
          newParentScope = parentEl.scope();
          oldUsId = oldParentScope.us ? oldParentScope.us.id : null;
          oldStatusId = oldParentScope.st.id;
          newUsId = newParentScope.us ? newParentScope.us.id : null;
          newStatusId = newParentScope.st.id;
          if (newStatusId !== oldStatusId || newUsId !== oldUsId) {
            deleteElement(itemEl);
          }
          $scope.$apply(function() {
            return $rootscope.$broadcast("taskboard:task:move", itemTask, newUsId, newStatusId, itemIndex);
          });
          return ui.item.find('a').removeClass('noclick');
        });
        return tdom.on("sortstart", function(event, ui) {
          oldParentScope = ui.item.parent().scope();
          return ui.item.find('a').addClass('noclick');
        });
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgTaskboardSortable", ["$tgRepo", "$tgResources", "$rootScope", TaskboardSortableDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/kanban/main.coffee
 */

(function() {
  var KanbanArchivedStatusHeaderDirective, KanbanArchivedStatusIntroDirective, KanbanController, KanbanDirective, KanbanSquishColumnDirective, KanbanUserDirective, KanbanUserstoryDirective, KanbanWipLimitDirective, bindMethods, bindOnce, defaultViewMode, defaultViewModes, groupBy, mixOf, module, scopeDefer, taiga, timeout, toggleText,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  toggleText = this.taiga.toggleText;

  scopeDefer = this.taiga.scopeDefer;

  bindOnce = this.taiga.bindOnce;

  groupBy = this.taiga.groupBy;

  timeout = this.taiga.timeout;

  bindMethods = this.taiga.bindMethods;

  module = angular.module("taigaKanban");

  defaultViewMode = "maximized";

  defaultViewModes = {
    maximized: {
      cardClass: "kanban-task-maximized"
    },
    minimized: {
      cardClass: "kanban-task-minimized"
    }
  };

  KanbanController = (function(superClass) {
    extend(KanbanController, superClass);

    KanbanController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgConfirm", "$tgResources", "$routeParams", "$q", "$tgLocation", "tgAppMetaService", "$tgNavUrls", "$tgEvents", "$tgAnalytics", "$translate"];

    function KanbanController(scope, rootscope, repo, confirm, rs1, params1, q, location, appMetaService, navUrls, events, analytics, translate) {
      var promise;
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs1;
      this.params = params1;
      this.q = q;
      this.location = location;
      this.appMetaService = appMetaService;
      this.navUrls = navUrls;
      this.events = events;
      this.analytics = analytics;
      this.translate = translate;
      bindMethods(this);
      this.scope.sectionName = this.translate.instant("KANBAN.SECTION_NAME");
      this.scope.statusViewModes = {};
      this.initializeEventHandlers();
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          var description, title;
          title = _this.translate.instant("KANBAN.PAGE_TITLE", {
            projectName: _this.scope.project.name
          });
          description = _this.translate.instant("KANBAN.PAGE_DESCRIPTION", {
            projectName: _this.scope.project.name,
            projectDescription: _this.scope.project.description
          });
          return _this.appMetaService.setAll(title, description);
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
    }

    KanbanController.prototype.initializeEventHandlers = function() {
      this.scope.$on("usform:new:success", (function(_this) {
        return function() {
          _this.loadUserstories();
          _this.refreshTagsColors();
          return _this.analytics.trackEvent("userstory", "create", "create userstory on kanban", 1);
        };
      })(this));
      this.scope.$on("usform:bulk:success", (function(_this) {
        return function() {
          _this.loadUserstories();
          return _this.analytics.trackEvent("userstory", "create", "bulk create userstory on kanban", 1);
        };
      })(this));
      this.scope.$on("usform:edit:success", (function(_this) {
        return function() {
          _this.loadUserstories();
          return _this.refreshTagsColors();
        };
      })(this));
      this.scope.$on("assigned-to:added", this.onAssignedToChanged);
      this.scope.$on("kanban:us:move", this.moveUs);
      this.scope.$on("kanban:show-userstories-for-status", this.loadUserStoriesForStatus);
      return this.scope.$on("kanban:hide-userstories-for-status", this.hideUserStoriesForStatus);
    };

    KanbanController.prototype.addNewUs = function(type, statusId) {
      switch (type) {
        case "standard":
          return this.rootscope.$broadcast("usform:new", this.scope.projectId, statusId, this.scope.usStatusList);
        case "bulk":
          return this.rootscope.$broadcast("usform:bulk", this.scope.projectId, statusId);
      }
    };

    KanbanController.prototype.changeUsAssignedTo = function(us) {
      return this.rootscope.$broadcast("assigned-to:add", us);
    };

    KanbanController.prototype.onAssignedToChanged = function(ctx, userid, us) {
      var promise;
      us.assigned_to = userid;
      promise = this.repo.save(us);
      return promise.then(null, function() {
        return console.log("FAIL");
      });
    };

    KanbanController.prototype.refreshTagsColors = function() {
      return this.rs.projects.tagsColors(this.scope.projectId).then((function(_this) {
        return function(tags_colors) {
          return _this.scope.project.tags_colors = tags_colors;
        };
      })(this));
    };

    KanbanController.prototype.loadUserstories = function() {
      var params;
      params = {
        status__is_archived: false
      };
      return this.rs.userstories.listAll(this.scope.projectId, params).then((function(_this) {
        return function(userstories) {
          var i, j, k, len, len1, len2, ref, ref1, ref2, status, us, usByStatus, us_archived;
          _this.scope.userstories = userstories;
          usByStatus = _.groupBy(userstories, "status");
          us_archived = [];
          ref = _this.scope.usStatusList;
          for (i = 0, len = ref.length; i < len; i++) {
            status = ref[i];
            if (usByStatus[status.id] == null) {
              usByStatus[status.id] = [];
            }
            if (_this.scope.usByStatus != null) {
              ref1 = _this.scope.usByStatus[status.id];
              for (j = 0, len1 = ref1.length; j < len1; j++) {
                us = ref1[j];
                if (us.status !== status.id) {
                  us_archived.push(us);
                }
              }
            }
            if (status.is_archived && (_this.scope.usByStatus != null) && _this.scope.usByStatus[status.id].length !== 0) {
              ref2 = _this.scope.usByStatus[status.id].concat(us_archived);
              for (k = 0, len2 = ref2.length; k < len2; k++) {
                us = ref2[k];
                if (us.status === status.id) {
                  usByStatus[status.id].push(us);
                }
              }
            }
            usByStatus[status.id] = _.sortBy(usByStatus[status.id], "kanban_order");
          }
          _this.scope.usByStatus = usByStatus;
          scopeDefer(_this.scope, function() {
            return _this.scope.$broadcast("userstories:loaded", userstories);
          });
          return userstories;
        };
      })(this));
    };

    KanbanController.prototype.loadUserStoriesForStatus = function(ctx, statusId) {
      var params;
      params = {
        status: statusId
      };
      return this.rs.userstories.listAll(this.scope.projectId, params).then((function(_this) {
        return function(userstories) {
          _this.scope.usByStatus[statusId] = _.sortBy(userstories, "kanban_order");
          _this.scope.$broadcast("kanban:shown-userstories-for-status", statusId, userstories);
          return userstories;
        };
      })(this));
    };

    KanbanController.prototype.hideUserStoriesForStatus = function(ctx, statusId) {
      this.scope.usByStatus[statusId] = [];
      return this.scope.$broadcast("kanban:hidden-userstories-for-status", statusId);
    };

    KanbanController.prototype.loadKanban = function() {
      return this.q.all([this.refreshTagsColors(), this.loadUserstories()]);
    };

    KanbanController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          if (!project.is_kanban_activated) {
            _this.location.path(_this.navUrls.resolve("permission-denied"));
          }
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.projectId = project.id;
          _this.scope.points = _.sortBy(project.points, "order");
          _this.scope.pointsById = groupBy(project.points, function(x) {
            return x.id;
          });
          _this.scope.usStatusById = groupBy(project.us_statuses, function(x) {
            return x.id;
          });
          _this.scope.usStatusList = _.sortBy(project.us_statuses, "order");
          _this.generateStatusViewModes();
          _this.scope.$emit("project:loaded", project);
          return project;
        };
      })(this));
    };

    KanbanController.prototype.initializeSubscription = function() {
      var routingKey1;
      routingKey1 = "changes.project." + this.scope.projectId + ".userstories";
      return this.events.subscribe(this.scope, routingKey1, (function(_this) {
        return function(message) {
          return _this.loadUserstories();
        };
      })(this));
    };

    KanbanController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      return promise.then((function(_this) {
        return function(project) {
          _this.fillUsersAndRoles(project.members, project.roles);
          _this.initializeSubscription();
          return _this.loadKanban().then(function() {
            return _this.scope.$broadcast("redraw:wip");
          });
        };
      })(this));
    };

    KanbanController.prototype.generateStatusViewModes = function() {
      var i, len, mode, ref, status, storedStatusViewModes;
      storedStatusViewModes = this.rs.kanban.getStatusViewModes(this.scope.projectId);
      this.scope.statusViewModes = {};
      ref = this.scope.usStatusList;
      for (i = 0, len = ref.length; i < len; i++) {
        status = ref[i];
        mode = storedStatusViewModes[status.id];
        this.scope.statusViewModes[status.id] = _.has(defaultViewModes, mode) ? mode : defaultViewMode;
      }
      return this.storeStatusViewModes();
    };

    KanbanController.prototype.storeStatusViewModes = function() {
      return this.rs.kanban.storeStatusViewModes(this.scope.projectId, this.scope.statusViewModes);
    };

    KanbanController.prototype.updateStatusViewMode = function(statusId, newViewMode) {
      this.scope.statusViewModes[statusId] = newViewMode;
      return this.storeStatusViewModes();
    };

    KanbanController.prototype.getCardClass = function(statusId) {
      var mode;
      mode = this.scope.statusViewModes[statusId] || defaultViewMode;
      return defaultViewModes[mode].cardClass || defaultViewModes[defaultViewMode].cardClass;
    };

    KanbanController.prototype.prepareBulkUpdateData = function(uses, field) {
      if (field == null) {
        field = "kanban_order";
      }
      return _.map(uses, function(x) {
        return {
          "us_id": x.id,
          "order": x[field]
        };
      });
    };

    KanbanController.prototype.resortUserStories = function(uses) {
      var i, index, item, items, len;
      items = [];
      for (index = i = 0, len = uses.length; i < len; index = ++i) {
        item = uses[index];
        item.kanban_order = index;
        if (item.isModified()) {
          items.push(item);
        }
      }
      return items;
    };

    KanbanController.prototype.moveUs = function(ctx, us, oldStatusId, newStatusId, index) {
      var itemsToSave, promise, r;
      if (oldStatusId !== newStatusId) {
        r = this.scope.usByStatus[oldStatusId].indexOf(us);
        this.scope.usByStatus[oldStatusId].splice(r, 1);
        this.scope.usByStatus[newStatusId].splice(index, 0, us);
        us.status = newStatusId;
      } else {
        r = this.scope.usByStatus[newStatusId].indexOf(us);
        this.scope.usByStatus[newStatusId].splice(r, 1);
        this.scope.usByStatus[newStatusId].splice(index, 0, us);
      }
      itemsToSave = this.resortUserStories(this.scope.usByStatus[newStatusId]);
      this.scope.usByStatus[newStatusId] = _.sortBy(this.scope.usByStatus[newStatusId], "kanban_order");
      promise = this.repo.save(us);
      promise = promise.then((function(_this) {
        return function() {
          var data;
          itemsToSave = _.reject(itemsToSave, {
            "id": us.id
          });
          data = _this.prepareBulkUpdateData(itemsToSave);
          return _this.rs.userstories.bulkUpdateKanbanOrder(us.project, data).then(function() {
            return itemsToSave;
          });
        };
      })(this));
      return promise;
    };

    return KanbanController;

  })(mixOf(taiga.Controller, taiga.PageMixin, taiga.FiltersMixin));

  module.controller("KanbanController", KanbanController);

  KanbanDirective = function($repo, $rootscope) {
    var link;
    link = function($scope, $el, $attrs) {
      var tableBodyDom;
      tableBodyDom = $el.find(".kanban-table-body");
      tableBodyDom.on("scroll", function(event) {
        var tableHeaderDom, target;
        target = angular.element(event.currentTarget);
        tableHeaderDom = $el.find(".kanban-table-header .kanban-table-inner");
        return tableHeaderDom.css("left", -1 * target.scrollLeft());
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgKanban", ["$tgRepo", "$rootScope", KanbanDirective]);

  KanbanArchivedStatusHeaderDirective = function($rootscope, $translate) {
    var hideArchivedText, link, showArchivedText;
    showArchivedText = $translate.instant("KANBAN.ACTION_SHOW_ARCHIVED");
    hideArchivedText = $translate.instant("KANBAN.ACTION_HIDE_ARCHIVED");
    link = function($scope, $el, $attrs) {
      var hidden, status;
      status = $scope.$eval($attrs.tgKanbanArchivedStatusHeader);
      hidden = true;
      $scope["class"] = "icon icon-open-eye";
      $scope.title = showArchivedText;
      $el.on("click", function(event) {
        hidden = !hidden;
        return $scope.$apply(function() {
          if (hidden) {
            $scope["class"] = "icon icon-open-eye";
            $scope.title = showArchivedText;
            return $rootscope.$broadcast("kanban:hide-userstories-for-status", status.id);
          } else {
            $scope["class"] = "icon icon-closed-eye";
            $scope.title = hideArchivedText;
            return $rootscope.$broadcast("kanban:show-userstories-for-status", status.id);
          }
        });
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgKanbanArchivedStatusHeader", ["$rootScope", "$translate", KanbanArchivedStatusHeaderDirective]);

  KanbanArchivedStatusIntroDirective = function($translate) {
    var link, userStories;
    userStories = [];
    link = function($scope, $el, $attrs) {
      var hiddenUserStoriexText, status, updateIntroText;
      hiddenUserStoriexText = $translate.instant("KANBAN.HIDDEN_USER_STORIES");
      status = $scope.$eval($attrs.tgKanbanArchivedStatusIntro);
      $el.text(hiddenUserStoriexText);
      updateIntroText = function() {
        if (userStories.length > 0) {
          return $el.text("");
        } else {
          return $el.text(hiddenUserStoriexText);
        }
      };
      $scope.$on("kanban:us:move", function(ctx, itemUs, oldStatusId, newStatusId, itemIndex) {
        var r;
        if (status.id === newStatusId) {
          if (status.id === oldStatusId) {
            r = userStories.indexOf(itemUs);
            userStories.splice(r, 1);
            userStories.splice(itemIndex, 0, itemUs);
          } else {
            itemUs.isArchived = true;
            userStories.splice(itemIndex, 0, itemUs);
          }
        } else if (status.id === oldStatusId) {
          itemUs.isArchived = false;
          r = userStories.indexOf(itemUs);
          userStories.splice(r, 1);
        }
        return updateIntroText();
      });
      $scope.$on("kanban:shown-userstories-for-status", function(ctx, statusId, userStoriesLoaded) {
        if (statusId === status.id) {
          userStories = _.filter(userStoriesLoaded, function(us) {
            return us.status === status.id;
          });
          return updateIntroText();
        }
      });
      $scope.$on("kanban:hidden-userstories-for-status", function(ctx, statusId) {
        if (statusId === status.id) {
          userStories = [];
          return updateIntroText();
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgKanbanArchivedStatusIntro", ["$translate", KanbanArchivedStatusIntroDirective]);

  KanbanUserstoryDirective = function($rootscope) {
    var link;
    link = function($scope, $el, $attrs, $model) {
      $el.disableSelection();
      $scope.$watch("us", function(us) {
        if (us.is_blocked && !$el.hasClass("blocked")) {
          return $el.addClass("blocked");
        } else if (!us.is_blocked && $el.hasClass("blocked")) {
          return $el.removeClass("blocked");
        }
      });
      $el.find(".icon-edit").on("click", function(event) {
        if ($el.find(".icon-edit").hasClass("noclick")) {
          return;
        }
        return $scope.$apply(function() {
          return $rootscope.$broadcast("usform:edit", $model.$modelValue);
        });
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      templateUrl: "kanban/kanban-task.html",
      link: link,
      require: "ngModel"
    };
  };

  module.directive("tgKanbanUserstory", ["$rootScope", KanbanUserstoryDirective]);

  KanbanSquishColumnDirective = function(rs) {
    var link;
    link = function($scope, $el, $attrs) {
      var updateTableWidth;
      $scope.$on("project:loaded", function(event, project) {
        $scope.folds = rs.kanban.getStatusColumnModes(project.id);
        return updateTableWidth();
      });
      $scope.foldStatus = function(status) {
        $scope.folds[status.id] = !!!$scope.folds[status.id];
        rs.kanban.storeStatusColumnModes($scope.projectId, $scope.folds);
        updateTableWidth();
      };
      return updateTableWidth = function() {
        var columnWidths, totalWidth;
        columnWidths = _.map($scope.usStatusList, function(status) {
          if ($scope.folds[status.id]) {
            return 40;
          } else {
            return 310;
          }
        });
        totalWidth = _.reduce(columnWidths, function(total, width) {
          return total + width;
        });
        return $el.find('.kanban-table-inner').css("width", totalWidth);
      };
    };
    return {
      link: link
    };
  };

  module.directive("tgKanbanSquishColumn", ["$tgResources", KanbanSquishColumnDirective]);

  KanbanWipLimitDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      var redrawWipLimit, status;
      $el.disableSelection();
      status = $scope.$eval($attrs.tgKanbanWipLimit);
      redrawWipLimit = (function(_this) {
        return function() {
          $el.find(".kanban-wip-limit").remove();
          return timeout(200, function() {
            var element;
            element = $el.find(".kanban-task")[status.wip_limit];
            if (element) {
              return angular.element(element).before("<div class='kanban-wip-limit'></div>");
            }
          });
        };
      })(this);
      if (status && !status.is_archived) {
        $scope.$on("redraw:wip", redrawWipLimit);
        $scope.$on("kanban:us:move", redrawWipLimit);
        $scope.$on("usform:new:success", redrawWipLimit);
        $scope.$on("usform:bulk:success", redrawWipLimit);
      }
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgKanbanWipLimit", KanbanWipLimitDirective);

  KanbanUserDirective = function($log, $compile) {
    var clickable, link, template;
    template = _.template("<figure class=\"avatar\">\n    <a href=\"#\" title=\"{{'US.ASSIGN' | translate}}\" <% if (!clickable) {%>class=\"not-clickable\"<% } %>>\n        <img src=\"<%- imgurl %>\" alt=\"<%- name %>\" class=\"avatar\">\n    </a>\n</figure>");
    clickable = false;
    link = function($scope, $el, $attrs, $model) {
      var render, username_label, wtid;
      username_label = $el.parent().find("a.task-assigned");
      username_label.addClass("not-clickable");
      if (!$attrs.tgKanbanUserAvatar) {
        return $log.error("KanbanUserDirective: no attr is defined");
      }
      wtid = $scope.$watch($attrs.tgKanbanUserAvatar, function(v) {
        var user;
        if ($scope.usersById == null) {
          $log.error("KanbanUserDirective requires userById set in scope.");
          return wtid();
        } else {
          user = $scope.usersById[v];
          return render(user);
        }
      });
      render = function(user) {
        var ctx, html;
        if (user === void 0) {
          ctx = {
            name: "Unassigned",
            imgurl: "/images/unnamed.png",
            clickable: clickable
          };
        } else {
          ctx = {
            name: user.full_name_display,
            imgurl: user.photo,
            clickable: clickable
          };
        }
        html = $compile(template(ctx))($scope);
        $el.html(html);
        return username_label.text(ctx.name);
      };
      bindOnce($scope, "project", function(project) {
        if (project.my_permissions.indexOf("modify_us") > -1) {
          clickable = true;
          $el.on("click", (function(_this) {
            return function(event) {
              var $ctrl, us;
              if ($el.find("a").hasClass("noclick")) {
                return;
              }
              us = $model.$modelValue;
              $ctrl = $el.controller();
              return $ctrl.changeUsAssignedTo(us);
            };
          })(this));
          username_label.removeClass("not-clickable");
          return username_label.on("click", function(event) {
            var $ctrl, us;
            if ($el.find("a").hasClass("noclick")) {
              return;
            }
            us = $model.$modelValue;
            $ctrl = $el.controller();
            return $ctrl.changeUsAssignedTo(us);
          });
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      require: "ngModel"
    };
  };

  module.directive("tgKanbanUserAvatar", ["$log", "$compile", KanbanUserDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/kanban/sortable.coffee
 */

(function() {
  var KanbanSortableDirective, bindOnce, groupBy, mixOf, module, scopeDefer, taiga, timeout, toggleText;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  toggleText = this.taiga.toggleText;

  scopeDefer = this.taiga.scopeDefer;

  bindOnce = this.taiga.bindOnce;

  groupBy = this.taiga.groupBy;

  timeout = this.taiga.timeout;

  module = angular.module("taigaKanban");

  KanbanSortableDirective = function($repo, $rs, $rootscope) {
    var link;
    link = function($scope, $el, $attrs) {
      bindOnce($scope, "project", function(project) {
        var deleteElement, itemEl, newParentScope, oldParentScope, tdom;
        if (!(project.my_permissions.indexOf("modify_us") > -1)) {
          return;
        }
        oldParentScope = null;
        newParentScope = null;
        itemEl = null;
        tdom = $el;
        deleteElement = function(itemEl) {
          itemEl.scope().$destroy();
          itemEl.off();
          return itemEl.remove();
        };
        tdom.sortable({
          handle: ".kanban-task-inner",
          dropOnEmpty: true,
          connectWith: ".kanban-uses-box",
          revert: 400
        });
        tdom.on("sortstop", function(event, ui) {
          var itemIndex, itemUs, newStatusId, oldStatusId, parentEl;
          parentEl = ui.item.parent();
          itemEl = ui.item;
          itemUs = itemEl.scope().us;
          itemIndex = itemEl.index();
          newParentScope = parentEl.scope();
          newStatusId = newParentScope.s.id;
          oldStatusId = oldParentScope.s.id;
          if (newStatusId !== oldStatusId) {
            deleteElement(itemEl);
          }
          $scope.$apply(function() {
            return $rootscope.$broadcast("kanban:us:move", itemUs, itemUs.status, newStatusId, itemIndex);
          });
          return ui.item.find('a').removeClass('noclick');
        });
        return tdom.on("sortstart", function(event, ui) {
          oldParentScope = ui.item.parent().scope();
          return ui.item.find('a').addClass('noclick');
        });
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgKanbanSortable", ["$tgRepo", "$tgResources", "$rootScope", KanbanSortableDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/issues/detail.coffee
 */

(function() {
  var IssueDetailController, IssuePriorityButtonDirective, IssueSeverityButtonDirective, IssueStatusButtonDirective, IssueStatusDisplayDirective, IssueTypeButtonDirective, PromoteIssueToUsButtonDirective, bindOnce, groupBy, joinStr, mixOf, module, taiga, toString,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  toString = this.taiga.toString;

  joinStr = this.taiga.joinStr;

  groupBy = this.taiga.groupBy;

  bindOnce = this.taiga.bindOnce;

  module = angular.module("taigaIssues");

  IssueDetailController = (function(superClass) {
    extend(IssueDetailController, superClass);

    IssueDetailController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgConfirm", "$tgResources", "$routeParams", "$q", "$tgLocation", "$log", "tgAppMetaService", "$tgAnalytics", "$tgNavUrls", "$translate"];

    function IssueDetailController(scope, rootscope, repo, confirm, rs, params, q, location, log, appMetaService, analytics, navUrls, translate) {
      var promise;
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs;
      this.params = params;
      this.q = q;
      this.location = location;
      this.log = log;
      this.appMetaService = appMetaService;
      this.analytics = analytics;
      this.navUrls = navUrls;
      this.translate = translate;
      this.scope.issueRef = this.params.issueref;
      this.scope.sectionName = this.translate.instant("ISSUES.SECTION_NAME");
      this.initializeEventHandlers();
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          _this._setMeta();
          return _this.initializeOnDeleteGoToUrl();
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
    }

    IssueDetailController.prototype._setMeta = function() {
      var description, ref, ref1, ref2, ref3, title;
      title = this.translate.instant("ISSUE.PAGE_TITLE", {
        issueRef: "#" + this.scope.issue.ref,
        issueSubject: this.scope.issue.subject,
        projectName: this.scope.project.name
      });
      description = this.translate.instant("ISSUE.PAGE_DESCRIPTION", {
        issueStatus: ((ref = this.scope.statusById[this.scope.issue.status]) != null ? ref.name : void 0) || "--",
        issueType: ((ref1 = this.scope.typeById[this.scope.issue.type]) != null ? ref1.name : void 0) || "--",
        issueSeverity: ((ref2 = this.scope.severityById[this.scope.issue.severity]) != null ? ref2.name : void 0) || "--",
        issuePriority: ((ref3 = this.scope.priorityById[this.scope.issue.priority]) != null ? ref3.name : void 0) || "--",
        issueDescription: angular.element(this.scope.issue.description_html || "").text()
      });
      return this.appMetaService.setAll(title, description);
    };

    IssueDetailController.prototype.initializeEventHandlers = function() {
      this.scope.$on("attachment:create", (function(_this) {
        return function() {
          _this.rootscope.$broadcast("object:updated");
          return _this.analytics.trackEvent("attachment", "create", "create attachment on issue", 1);
        };
      })(this));
      this.scope.$on("attachment:edit", (function(_this) {
        return function() {
          return _this.rootscope.$broadcast("object:updated");
        };
      })(this));
      this.scope.$on("attachment:delete", (function(_this) {
        return function() {
          return _this.rootscope.$broadcast("object:updated");
        };
      })(this));
      this.scope.$on("promote-issue-to-us:success", (function(_this) {
        return function() {
          _this.analytics.trackEvent("issue", "promoteToUserstory", "promote issue to userstory", 1);
          _this.rootscope.$broadcast("object:updated");
          return _this.loadIssue();
        };
      })(this));
      this.scope.$on("comment:new", (function(_this) {
        return function() {
          return _this.loadIssue();
        };
      })(this));
      return this.scope.$on("custom-attributes-values:edit", (function(_this) {
        return function() {
          return _this.rootscope.$broadcast("object:updated");
        };
      })(this));
    };

    IssueDetailController.prototype.initializeOnDeleteGoToUrl = function() {
      var ctx;
      ctx = {
        project: this.scope.project.slug
      };
      if (this.scope.project.is_issues_activated) {
        return this.scope.onDeleteGoToUrl = this.navUrls.resolve("project-issues", ctx);
      } else {
        return this.scope.onDeleteGoToUrl = this.navUrls.resolve("project", ctx);
      }
    };

    IssueDetailController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.$emit('project:loaded', project);
          _this.scope.statusList = project.issue_statuses;
          _this.scope.statusById = groupBy(project.issue_statuses, function(x) {
            return x.id;
          });
          _this.scope.typeById = groupBy(project.issue_types, function(x) {
            return x.id;
          });
          _this.scope.typeList = _.sortBy(project.issue_types, "order");
          _this.scope.severityList = project.severities;
          _this.scope.severityById = groupBy(project.severities, function(x) {
            return x.id;
          });
          _this.scope.priorityList = project.priorities;
          _this.scope.priorityById = groupBy(project.priorities, function(x) {
            return x.id;
          });
          return project;
        };
      })(this));
    };

    IssueDetailController.prototype.loadIssue = function() {
      return this.rs.issues.getByRef(this.scope.projectId, this.params.issueref).then((function(_this) {
        return function(issue) {
          var ctx;
          _this.scope.issue = issue;
          _this.scope.issueId = issue.id;
          _this.scope.commentModel = issue;
          if (_this.scope.issue.neighbors.previous.ref != null) {
            ctx = {
              project: _this.scope.project.slug,
              ref: _this.scope.issue.neighbors.previous.ref
            };
            _this.scope.previousUrl = _this.navUrls.resolve("project-issues-detail", ctx);
          }
          if (_this.scope.issue.neighbors.next.ref != null) {
            ctx = {
              project: _this.scope.project.slug,
              ref: _this.scope.issue.neighbors.next.ref
            };
            return _this.scope.nextUrl = _this.navUrls.resolve("project-issues-detail", ctx);
          }
        };
      })(this));
    };

    IssueDetailController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      return promise.then((function(_this) {
        return function(project) {
          _this.fillUsersAndRoles(project.members, project.roles);
          return _this.loadIssue();
        };
      })(this));
    };

    return IssueDetailController;

  })(mixOf(taiga.Controller, taiga.PageMixin));

  module.controller("IssueDetailController", IssueDetailController);

  IssueStatusDisplayDirective = function($template, $compile) {
    var link, template;
    template = $template.get("common/components/status-display.html", true);
    link = function($scope, $el, $attrs) {
      var render;
      render = function(issue) {
        var html, status;
        status = $scope.statusById[issue.status];
        html = template({
          is_closed: status.is_closed,
          status: status
        });
        html = $compile(html)($scope);
        return $el.html(html);
      };
      $scope.$watch($attrs.ngModel, function(issue) {
        if (issue != null) {
          return render(issue);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgIssueStatusDisplay", ["$tgTemplate", "$compile", IssueStatusDisplayDirective]);

  IssueStatusButtonDirective = function($rootScope, $repo, $confirm, $loading, $qqueue, $template, $compile) {
    var link, template;
    template = $template.get("issue/issues-status-button.html", true);
    link = function($scope, $el, $attrs, $model) {
      var isEditable, render, save;
      isEditable = function() {
        return $scope.project.my_permissions.indexOf("modify_issue") !== -1;
      };
      render = (function(_this) {
        return function(issue) {
          var html, status;
          status = $scope.statusById[issue.status];
          html = template({
            status: status,
            statuses: $scope.statusList,
            editable: isEditable()
          });
          html = $compile(html)($scope);
          return $el.html(html);
        };
      })(this);
      save = $qqueue.bindAdd((function(_this) {
        return function(statusId) {
          var issue, onError, onSuccess;
          $.fn.popover().closeAll();
          issue = $model.$modelValue.clone();
          issue.status = statusId;
          onSuccess = function() {
            $confirm.notify("success");
            $model.$setViewValue(issue);
            $rootScope.$broadcast("object:updated");
            return $loading.finish($el.find(".level-name"));
          };
          onError = function() {
            $confirm.notify("error");
            issue.revert();
            $model.$setViewValue(issue);
            return $loading.finish($el.find(".level-name"));
          };
          $loading.start($el.find(".level-name"));
          return $repo.save(issue).then(onSuccess, onError);
        };
      })(this));
      $el.on("click", ".status-data", function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (!isEditable()) {
          return;
        }
        return $el.find(".pop-status").popover().open();
      });
      $el.on("click", ".status", function(event) {
        var target;
        event.preventDefault();
        event.stopPropagation();
        if (!isEditable()) {
          return;
        }
        target = angular.element(event.currentTarget);
        return save(target.data("status-id"));
      });
      $scope.$watch($attrs.ngModel, function(issue) {
        if (issue) {
          return render(issue);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgIssueStatusButton", ["$rootScope", "$tgRepo", "$tgConfirm", "$tgLoading", "$tgQqueue", "$tgTemplate", "$compile", IssueStatusButtonDirective]);

  IssueTypeButtonDirective = function($rootScope, $repo, $confirm, $loading, $qqueue, $template, $compile) {
    var link, template;
    template = $template.get("issue/issue-type-button.html", true);
    link = function($scope, $el, $attrs, $model) {
      var isEditable, render, save;
      isEditable = function() {
        return $scope.project.my_permissions.indexOf("modify_issue") !== -1;
      };
      render = (function(_this) {
        return function(issue) {
          var html, type;
          type = $scope.typeById[issue.type];
          html = template({
            type: type,
            typees: $scope.typeList,
            editable: isEditable()
          });
          html = $compile(html)($scope);
          return $el.html(html);
        };
      })(this);
      save = $qqueue.bindAdd((function(_this) {
        return function(type) {
          var issue, onError, onSuccess;
          $.fn.popover().closeAll();
          issue = $model.$modelValue.clone();
          issue.type = type;
          onSuccess = function() {
            $confirm.notify("success");
            $model.$setViewValue(issue);
            $rootScope.$broadcast("object:updated");
            return $loading.finish($el.find(".level-name"));
          };
          onError = function() {
            $confirm.notify("error");
            issue.revert();
            $model.$setViewValue(issue);
            return $loading.finish($el.find(".level-name"));
          };
          $loading.start($el.find(".level-name"));
          return $repo.save(issue).then(onSuccess, onError);
        };
      })(this));
      $el.on("click", ".type-data", function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (!isEditable()) {
          return;
        }
        return $el.find(".pop-type").popover().open();
      });
      $el.on("click", ".type", function(event) {
        var target, type;
        event.preventDefault();
        event.stopPropagation();
        if (!isEditable()) {
          return;
        }
        target = angular.element(event.currentTarget);
        type = target.data("type-id");
        return save(type);
      });
      $scope.$watch($attrs.ngModel, function(issue) {
        if (issue) {
          return render(issue);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgIssueTypeButton", ["$rootScope", "$tgRepo", "$tgConfirm", "$tgLoading", "$tgQqueue", "$tgTemplate", "$compile", IssueTypeButtonDirective]);

  IssueSeverityButtonDirective = function($rootScope, $repo, $confirm, $loading, $qqueue, $template, $compile) {
    var link, template;
    template = $template.get("issue/issue-severity-button.html", true);
    link = function($scope, $el, $attrs, $model) {
      var isEditable, render, save;
      isEditable = function() {
        return $scope.project.my_permissions.indexOf("modify_issue") !== -1;
      };
      render = (function(_this) {
        return function(issue) {
          var html, severity;
          severity = $scope.severityById[issue.severity];
          html = template({
            severity: severity,
            severityes: $scope.severityList,
            editable: isEditable()
          });
          html = $compile(html)($scope);
          return $el.html(html);
        };
      })(this);
      save = $qqueue.bindAdd((function(_this) {
        return function(severity) {
          var issue, onError, onSuccess;
          $.fn.popover().closeAll();
          issue = $model.$modelValue.clone();
          issue.severity = severity;
          onSuccess = function() {
            $confirm.notify("success");
            $model.$setViewValue(issue);
            $rootScope.$broadcast("object:updated");
            return $loading.finish($el.find(".level-name"));
          };
          onError = function() {
            $confirm.notify("error");
            issue.revert();
            $model.$setViewValue(issue);
            return $loading.finish($el.find(".level-name"));
          };
          $loading.start($el.find(".level-name"));
          return $repo.save(issue).then(onSuccess, onError);
        };
      })(this));
      $el.on("click", ".severity-data", function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (!isEditable()) {
          return;
        }
        return $el.find(".pop-severity").popover().open();
      });
      $el.on("click", ".severity", function(event) {
        var severity, target;
        event.preventDefault();
        event.stopPropagation();
        if (!isEditable()) {
          return;
        }
        target = angular.element(event.currentTarget);
        severity = target.data("severity-id");
        return save(severity);
      });
      $scope.$watch($attrs.ngModel, function(issue) {
        if (issue) {
          return render(issue);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgIssueSeverityButton", ["$rootScope", "$tgRepo", "$tgConfirm", "$tgLoading", "$tgQqueue", "$tgTemplate", "$compile", IssueSeverityButtonDirective]);

  IssuePriorityButtonDirective = function($rootScope, $repo, $confirm, $loading, $qqueue, $template, $compile) {
    var link, template;
    template = $template.get("issue/issue-priority-button.html", true);
    link = function($scope, $el, $attrs, $model) {
      var isEditable, render, save;
      isEditable = function() {
        return $scope.project.my_permissions.indexOf("modify_issue") !== -1;
      };
      render = (function(_this) {
        return function(issue) {
          var html, priority;
          priority = $scope.priorityById[issue.priority];
          html = template({
            priority: priority,
            priorityes: $scope.priorityList,
            editable: isEditable()
          });
          html = $compile(html)($scope);
          return $el.html(html);
        };
      })(this);
      save = $qqueue.bindAdd((function(_this) {
        return function(priority) {
          var issue, onError, onSuccess;
          $.fn.popover().closeAll();
          issue = $model.$modelValue.clone();
          issue.priority = priority;
          onSuccess = function() {
            $confirm.notify("success");
            $model.$setViewValue(issue);
            $rootScope.$broadcast("object:updated");
            return $loading.finish($el.find(".level-name"));
          };
          onError = function() {
            $confirm.notify("error");
            issue.revert();
            $model.$setViewValue(issue);
            return $loading.finish($el.find(".level-name"));
          };
          $loading.start($el.find(".level-name"));
          return $repo.save(issue).then(onSuccess, onError);
        };
      })(this));
      $el.on("click", ".priority-data", function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (!isEditable()) {
          return;
        }
        return $el.find(".pop-priority").popover().open();
      });
      $el.on("click", ".priority", function(event) {
        var priority, target;
        event.preventDefault();
        event.stopPropagation();
        if (!isEditable()) {
          return;
        }
        target = angular.element(event.currentTarget);
        priority = target.data("priority-id");
        return save(priority);
      });
      $scope.$watch($attrs.ngModel, function(issue) {
        if (issue) {
          return render(issue);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgIssuePriorityButton", ["$rootScope", "$tgRepo", "$tgConfirm", "$tgLoading", "$tgQqueue", "$tgTemplate", "$compile", IssuePriorityButtonDirective]);

  PromoteIssueToUsButtonDirective = function($rootScope, $repo, $confirm, $qqueue, $translate) {
    var link;
    link = function($scope, $el, $attrs, $model) {
      var save;
      save = $qqueue.bindAdd((function(_this) {
        return function(issue, finish) {
          var data, onError, onSuccess;
          data = {
            generated_from_issue: issue.id,
            project: issue.project,
            subject: issue.subject,
            description: issue.description,
            tags: issue.tags,
            is_blocked: issue.is_blocked,
            blocked_note: issue.blocked_note
          };
          onSuccess = function() {
            finish();
            $confirm.notify("success");
            return $rootScope.$broadcast("promote-issue-to-us:success");
          };
          onError = function() {
            finish(false);
            return $confirm.notify("error");
          };
          return $repo.create("userstories", data).then(onSuccess, onError);
        };
      })(this));
      $el.on("click", "a", function(event) {
        var issue, message, subtitle, title;
        event.preventDefault();
        issue = $model.$modelValue;
        title = $translate.instant("ISSUES.CONFIRM_PROMOTE.TITLE");
        message = $translate.instant("ISSUES.CONFIRM_PROMOTE.MESSAGE");
        subtitle = issue.subject;
        return $confirm.ask(title, subtitle, message).then((function(_this) {
          return function(finish) {
            return save(issue, finish);
          };
        })(this));
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      restrict: "AE",
      require: "ngModel",
      templateUrl: "issue/promote-issue-to-us-button.html",
      link: link
    };
  };

  module.directive("tgPromoteIssueToUsButton", ["$rootScope", "$tgRepo", "$tgConfirm", "$tgQqueue", "$translate", PromoteIssueToUsButtonDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/issues/lightboxes.coffee
 */

(function() {
  var CreateBulkIssuesDirective, CreateIssueDirective, bindOnce, debounce, module, taiga;

  taiga = this.taiga;

  bindOnce = this.taiga.bindOnce;

  debounce = this.taiga.debounce;

  module = angular.module("taigaIssues");

  CreateIssueDirective = function($repo, $confirm, $rootscope, lightboxService, $loading) {
    var link;
    link = function($scope, $el, $attrs) {
      var form, submit, submitButton;
      form = $el.find("form").checksley();
      $scope.issue = {};
      $scope.$on("issueform:new", function(ctx, project) {
        $el.find(".tag-input").val("");
        lightboxService.open($el);
        return $scope.issue = {
          project: project.id,
          subject: "",
          status: project.default_issue_status,
          type: project.default_issue_type,
          priority: project.default_priority,
          severity: project.default_severity,
          tags: []
        };
      });
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var promise;
          event.preventDefault();
          if (!form.validate()) {
            return;
          }
          $loading.start(submitButton);
          promise = $repo.create("issues", $scope.issue);
          promise.then(function(data) {
            $loading.finish(submitButton);
            $rootscope.$broadcast("issueform:new:success", data);
            lightboxService.close($el);
            return $confirm.notify("success");
          });
          return promise.then(null, function() {
            $loading.finish(submitButton);
            return $confirm.notify("error");
          });
        };
      })(this));
      submitButton = $el.find(".submit-button");
      return $el.on("submit", "form", submit);
    };
    return {
      link: link
    };
  };

  module.directive("tgLbCreateIssue", ["$tgRepo", "$tgConfirm", "$rootScope", "lightboxService", "$tgLoading", CreateIssueDirective]);

  CreateBulkIssuesDirective = function($repo, $rs, $confirm, $rootscope, $loading, lightboxService) {
    var link;
    link = function($scope, $el, attrs) {
      var submit, submitButton;
      $scope.$on("issueform:bulk", function(ctx, projectId, status) {
        lightboxService.open($el);
        return $scope["new"] = {
          projectId: projectId,
          bulk: ""
        };
      });
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var data, form, projectId, promise;
          event.preventDefault();
          form = $el.find("form").checksley();
          if (!form.validate()) {
            return;
          }
          $loading.start(submitButton);
          data = $scope["new"].bulk;
          projectId = $scope["new"].projectId;
          promise = $rs.issues.bulkCreate(projectId, data);
          promise.then(function(result) {
            $loading.finish(submitButton);
            $rootscope.$broadcast("issueform:new:success", result);
            lightboxService.close($el);
            return $confirm.notify("success");
          });
          return promise.then(null, function() {
            $loading.finish(submitButton);
            return $confirm.notify("error");
          });
        };
      })(this));
      submitButton = $el.find(".submit-button");
      $el.on("submit", "form", submit);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgLbCreateBulkIssues", ["$tgRepo", "$tgResources", "$tgConfirm", "$rootScope", "$tgLoading", "lightboxService", CreateBulkIssuesDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/issues/list.coffee
 */

(function() {
  var IssueAssignedToInlineEditionDirective, IssueStatusInlineEditionDirective, IssuesController, IssuesDirective, IssuesFiltersDirective, bindOnce, debounceLeading, groupBy, joinStr, mixOf, module, startswith, taiga, toString, trim,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  trim = this.taiga.trim;

  toString = this.taiga.toString;

  joinStr = this.taiga.joinStr;

  groupBy = this.taiga.groupBy;

  bindOnce = this.taiga.bindOnce;

  debounceLeading = this.taiga.debounceLeading;

  startswith = this.taiga.startswith;

  module = angular.module("taigaIssues");

  IssuesController = (function(superClass) {
    extend(IssuesController, superClass);

    IssuesController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgConfirm", "$tgResources", "$tgUrls", "$routeParams", "$q", "$tgLocation", "tgAppMetaService", "$tgNavUrls", "$tgEvents", "$tgAnalytics", "$translate"];

    function IssuesController(scope, rootscope, repo, confirm, rs, urls, params, q, location, appMetaService, navUrls, events, analytics, translate) {
      var filters, promise;
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs;
      this.urls = urls;
      this.params = params;
      this.q = q;
      this.location = location;
      this.appMetaService = appMetaService;
      this.navUrls = navUrls;
      this.events = events;
      this.analytics = analytics;
      this.translate = translate;
      this.loadIssues = bind(this.loadIssues, this);
      this.scope.sectionName = "Issues";
      this.scope.filters = {};
      if (_.isEmpty(this.location.search())) {
        filters = this.rs.issues.getFilters(this.params.pslug);
        filters.page = 1;
        this.location.search(filters);
        this.location.replace();
        return;
      }
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          var description, title;
          title = _this.translate.instant("ISSUES.PAGE_TITLE", {
            projectName: _this.scope.project.name
          });
          description = _this.translate.instant("ISSUES.PAGE_DESCRIPTION", {
            projectName: _this.scope.project.name,
            projectDescription: _this.scope.project.description
          });
          return _this.appMetaService.setAll(title, description);
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
      this.scope.$on("issueform:new:success", (function(_this) {
        return function() {
          _this.analytics.trackEvent("issue", "create", "create issue on issues list", 1);
          _this.loadIssues();
          return _this.loadFilters();
        };
      })(this));
    }

    IssuesController.prototype.initializeSubscription = function() {
      var routingKey;
      routingKey = "changes.project." + this.scope.projectId + ".issues";
      return this.events.subscribe(this.scope, routingKey, (function(_this) {
        return function(message) {
          return _this.loadIssues();
        };
      })(this));
    };

    IssuesController.prototype.storeFilters = function() {
      return this.rs.issues.storeFilters(this.params.pslug, this.location.search());
    };

    IssuesController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          if (!project.is_issues_activated) {
            _this.location.path(_this.navUrls.resolve("permission-denied"));
          }
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.$emit('project:loaded', project);
          _this.scope.issueStatusById = groupBy(project.issue_statuses, function(x) {
            return x.id;
          });
          _this.scope.issueStatusList = _.sortBy(project.issue_statuses, "order");
          _this.scope.severityById = groupBy(project.severities, function(x) {
            return x.id;
          });
          _this.scope.severityList = _.sortBy(project.severities, "order");
          _this.scope.priorityById = groupBy(project.priorities, function(x) {
            return x.id;
          });
          _this.scope.priorityList = _.sortBy(project.priorities, "order");
          _this.scope.issueTypes = _.sortBy(project.issue_types, "order");
          _this.scope.issueTypeById = groupBy(project.issue_types, function(x) {
            return x.id;
          });
          return project;
        };
      })(this));
    };

    IssuesController.prototype.getUrlFilters = function() {
      var filters;
      filters = _.pick(this.location.search(), "page", "tags", "statuses", "types", "q", "severities", "priorities", "assignedTo", "createdBy", "orderBy");
      if (!filters.page) {
        filters.page = 1;
      }
      return filters;
    };

    IssuesController.prototype.getUrlFilter = function(name) {
      var filters;
      filters = _.pick(this.location.search(), name);
      return filters[name];
    };

    IssuesController.prototype.loadMyFilters = function() {
      return this.rs.issues.getMyFilters(this.scope.projectId).then((function(_this) {
        return function(filters) {
          return _.map(filters, function(value, key) {
            return {
              id: key,
              name: key,
              type: "myFilters",
              selected: false
            };
          });
        };
      })(this));
    };

    IssuesController.prototype.removeNotExistingFiltersFromUrl = function() {
      var currentSearch, existingValues, filterName, filterValue, splittedValues, urlfilters;
      currentSearch = this.location.search();
      urlfilters = this.getUrlFilters();
      for (filterName in urlfilters) {
        filterValue = urlfilters[filterName];
        if (filterName === "page" || filterName === "orderBy" || filterName === "q") {
          continue;
        }
        if (filterName === "tags") {
          splittedValues = _.map(("" + filterValue).split(","));
        } else {
          splittedValues = _.map(("" + filterValue).split(","), function(x) {
            if (x === "null") {
              return null;
            } else {
              return parseInt(x);
            }
          });
        }
        existingValues = _.intersection(splittedValues, _.map(this.scope.filters[filterName], "id"));
        if (splittedValues.length !== existingValues.length) {
          this.location.search(filterName, existingValues.join());
        }
      }
      if (currentSearch !== this.location.search()) {
        return this.location.replace();
      }
    };

    IssuesController.prototype.markSelectedFilters = function(filters, urlfilters) {
      var isSelected, j, key, len, name, obj, ref, ref1, results, searchdata, val, value;
      searchdata = {};
      ref = _.omit(urlfilters, "page", "orderBy");
      for (name in ref) {
        value = ref[name];
        if (searchdata[name] == null) {
          searchdata[name] = {};
        }
        ref1 = ("" + value).split(",");
        for (j = 0, len = ref1.length; j < len; j++) {
          val = ref1[j];
          searchdata[name][val] = true;
        }
      }
      isSelected = function(type, id) {
        if ((searchdata[type] != null) && searchdata[type][id]) {
          return true;
        }
        return false;
      };
      results = [];
      for (key in filters) {
        value = filters[key];
        results.push((function() {
          var k, len1, results1;
          results1 = [];
          for (k = 0, len1 = value.length; k < len1; k++) {
            obj = value[k];
            results1.push(obj.selected = isSelected(obj.type, obj.id) ? true : void 0);
          }
          return results1;
        })());
      }
      return results;
    };

    IssuesController.prototype.loadFilters = function() {
      var promise, urlfilters;
      urlfilters = this.getUrlFilters();
      if (urlfilters.q) {
        this.scope.filtersQ = urlfilters.q;
      }
      promise = this.loadMyFilters().then((function(_this) {
        return function(myFilters) {
          _this.scope.filters.myFilters = myFilters;
          return myFilters;
        };
      })(this));
      promise = promise.then((function(_this) {
        return function() {
          return _this.rs.issues.filtersData(_this.scope.projectId);
        };
      })(this));
      return promise.then((function(_this) {
        return function(data) {
          var choicesFiltersFormat, tagsFilterFormat, usersFiltersFormat;
          usersFiltersFormat = function(users, type, unknownOption) {
            var reformatedUsers, unknownItem;
            reformatedUsers = _.map(users, function(t) {
              return {
                id: t[0],
                count: t[1],
                type: type,
                name: t[0] ? _this.scope.usersById[t[0]].full_name_display : unknownOption
              };
            });
            unknownItem = _.remove(reformatedUsers, function(u) {
              return !u.id;
            });
            reformatedUsers = _.sortBy(reformatedUsers, function(u) {
              return u.name.toUpperCase();
            });
            if (unknownItem.length > 0) {
              reformatedUsers.unshift(unknownItem[0]);
            }
            return reformatedUsers;
          };
          choicesFiltersFormat = function(choices, type, byIdObject) {
            return _.map(choices, function(t) {
              return {
                id: t[0],
                name: byIdObject[t[0]].name,
                color: byIdObject[t[0]].color,
                count: t[1],
                type: type
              };
            });
          };
          tagsFilterFormat = function(tags) {
            return _.map(tags, function(t) {
              return {
                id: t[0],
                name: t[0],
                color: _this.scope.project.tags_colors[t[0]],
                count: t[1],
                type: "tags"
              };
            });
          };
          _this.scope.filters.statuses = choicesFiltersFormat(data.statuses, "statuses", _this.scope.issueStatusById);
          _this.scope.filters.severities = choicesFiltersFormat(data.severities, "severities", _this.scope.severityById);
          _this.scope.filters.priorities = choicesFiltersFormat(data.priorities, "priorities", _this.scope.priorityById);
          _this.scope.filters.assignedTo = usersFiltersFormat(data.assigned_to, "assignedTo", "Unassigned");
          _this.scope.filters.createdBy = usersFiltersFormat(data.created_by, "createdBy", "Unknown");
          _this.scope.filters.types = choicesFiltersFormat(data.types, "types", _this.scope.issueTypeById);
          _this.scope.filters.tags = tagsFilterFormat(data.tags);
          _this.removeNotExistingFiltersFromUrl();
          _this.markSelectedFilters(_this.scope.filters, urlfilters);
          return _this.rootscope.$broadcast("filters:loaded", _this.scope.filters);
        };
      })(this));
    };

    IssuesController.prototype.loadIssuesRequests = 0;

    IssuesController.prototype.loadIssues = function() {
      var name, promise, ref, values;
      this.scope.urlFilters = this.getUrlFilters();
      this.scope.httpParams = {};
      ref = this.scope.urlFilters;
      for (name in ref) {
        values = ref[name];
        if (name === "severities") {
          name = "severity";
        } else if (name === "orderBy") {
          name = "order_by";
        } else if (name === "priorities") {
          name = "priority";
        } else if (name === "assignedTo") {
          name = "assigned_to";
        } else if (name === "createdBy") {
          name = "owner";
        } else if (name === "statuses") {
          name = "status";
        } else if (name === "types") {
          name = "type";
        }
        this.scope.httpParams[name] = values;
      }
      promise = this.rs.issues.list(this.scope.projectId, this.scope.httpParams);
      this.loadIssuesRequests += 1;
      promise.index = this.loadIssuesRequests;
      return promise.then((function(_this) {
        return function(data) {
          if (promise.index === _this.loadIssuesRequests) {
            _this.scope.issues = data.models;
            _this.scope.page = data.current;
            _this.scope.count = data.count;
            _this.scope.paginatedBy = data.paginatedBy;
          }
          return data;
        };
      })(this));
    };

    IssuesController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      return promise.then((function(_this) {
        return function(project) {
          _this.fillUsersAndRoles(project.members, project.roles);
          _this.initializeSubscription();
          return _this.q.all([_this.loadFilters(), _this.loadIssues()]);
        };
      })(this));
    };

    IssuesController.prototype.saveCurrentFiltersTo = function(newFilter) {
      var deferred;
      deferred = this.q.defer();
      this.rs.issues.getMyFilters(this.scope.projectId).then((function(_this) {
        return function(filters) {
          filters[newFilter] = _this.location.search();
          return _this.rs.issues.storeMyFilters(_this.scope.projectId, filters).then(function() {
            return deferred.resolve();
          });
        };
      })(this));
      return deferred.promise;
    };

    IssuesController.prototype.deleteMyFilter = function(filter) {
      var deferred;
      deferred = this.q.defer();
      this.rs.issues.getMyFilters(this.scope.projectId).then((function(_this) {
        return function(filters) {
          delete filters[filter];
          return _this.rs.issues.storeMyFilters(_this.scope.projectId, filters).then(function() {
            return deferred.resolve();
          });
        };
      })(this));
      return deferred.promise;
    };

    IssuesController.prototype.addNewIssue = function() {
      return this.rootscope.$broadcast("issueform:new", this.scope.project);
    };

    IssuesController.prototype.addIssuesInBulk = function() {
      return this.rootscope.$broadcast("issueform:bulk", this.scope.projectId);
    };

    return IssuesController;

  })(mixOf(taiga.Controller, taiga.PageMixin, taiga.FiltersMixin));

  module.controller("IssuesController", IssuesController);

  IssuesDirective = function($log, $location, $template, $compile) {
    var link, linkOrdering, linkPagination, template;
    template = $template.get("issue/issue-paginator.html", true);
    linkPagination = function($scope, $el, $attrs, $ctrl) {
      var $pagEl, afterCurrent, atBegin, atEnd, beforeCurrent, getNumPages, renderPagination;
      afterCurrent = 2;
      beforeCurrent = 4;
      atBegin = 2;
      atEnd = 2;
      $pagEl = $el.find(".issues-paginator");
      getNumPages = function() {
        var numPages;
        numPages = $scope.count / $scope.paginatedBy;
        if (parseInt(numPages, 10) < numPages) {
          numPages = parseInt(numPages, 10) + 1;
        } else {
          numPages = parseInt(numPages, 10);
        }
        return numPages;
      };
      renderPagination = function() {
        var cpage, html, i, j, numPages, options, pages, ref;
        numPages = getNumPages();
        if (numPages <= 1) {
          $pagEl.hide();
          return;
        }
        $pagEl.show();
        pages = [];
        options = {};
        options.pages = pages;
        options.showPrevious = $scope.page > 1;
        options.showNext = !($scope.page === numPages);
        cpage = $scope.page;
        for (i = j = 1, ref = numPages; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          if (i === (cpage + afterCurrent) && numPages > (cpage + afterCurrent + atEnd)) {
            pages.push({
              classes: "dots",
              type: "dots"
            });
          } else if (i === (cpage - beforeCurrent) && cpage > (atBegin + beforeCurrent)) {
            pages.push({
              classes: "dots",
              type: "dots"
            });
          } else if (i > (cpage + afterCurrent) && i <= (numPages - atEnd)) {

          } else if (i < (cpage - beforeCurrent) && i > atBegin) {

          } else if (i === cpage) {
            pages.push({
              classes: "active",
              num: i,
              type: "page-active"
            });
          } else {
            pages.push({
              classes: "page",
              num: i,
              type: "page"
            });
          }
        }
        html = template(options);
        html = $compile(html)($scope);
        return $pagEl.html(html);
      };
      $scope.$watch("issues", function(value) {
        if (!value) {
          return;
        }
        return renderPagination();
      });
      $el.on("click", ".issues-paginator a.next", function(event) {
        event.preventDefault();
        return $scope.$apply(function() {
          $ctrl.selectFilter("page", $scope.page + 1);
          return $ctrl.loadIssues();
        });
      });
      $el.on("click", ".issues-paginator a.previous", function(event) {
        event.preventDefault();
        return $scope.$apply(function() {
          $ctrl.selectFilter("page", $scope.page - 1);
          return $ctrl.loadIssues();
        });
      });
      return $el.on("click", ".issues-paginator li.page > a", function(event) {
        var pagenum, target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        pagenum = target.data("pagenum");
        return $scope.$apply(function() {
          $ctrl.selectFilter("page", pagenum);
          return $ctrl.loadIssues();
        });
      });
    };
    linkOrdering = function($scope, $el, $attrs, $ctrl) {
      var colHeadElement, currentOrder, icon;
      currentOrder = $ctrl.getUrlFilter("orderBy") || "created_date";
      if (currentOrder) {
        icon = startswith(currentOrder, "-") ? "icon-caret-up" : "icon-caret-down";
        colHeadElement = $el.find(".row.title > div[data-fieldname='" + (trim(currentOrder, "-")) + "']");
        colHeadElement.html((colHeadElement.html()) + "<span class='icon " + icon + "'></span>");
      }
      return $el.on("click", ".row.title > div", function(event) {
        var finalOrder, newOrder, target;
        target = angular.element(event.currentTarget);
        currentOrder = $ctrl.getUrlFilter("orderBy");
        newOrder = target.data("fieldname");
        finalOrder = currentOrder === newOrder ? "-" + newOrder : newOrder;
        return $scope.$apply(function() {
          $ctrl.replaceFilter("orderBy", finalOrder);
          $ctrl.storeFilters();
          return $ctrl.loadIssues().then(function() {
            $el.find(".row.title > div > span.icon").remove();
            icon = startswith(finalOrder, "-") ? "icon-caret-up" : "icon-caret-down";
            return target.html((target.html()) + "<span class='icon " + icon + "'></span>");
          });
        });
      });
    };
    link = function($scope, $el, $attrs) {
      var $ctrl;
      $ctrl = $el.controller();
      linkOrdering($scope, $el, $attrs, $ctrl);
      linkPagination($scope, $el, $attrs, $ctrl);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgIssues", ["$log", "$tgLocation", "$tgTemplate", "$compile", IssuesDirective]);

  IssuesFiltersDirective = function($log, $location, $rs, $confirm, $loading, $template, $translate, $compile, $auth) {
    var link, template, templateSelected;
    template = $template.get("issue/issues-filters.html", true);
    templateSelected = $template.get("issue/issues-filters-selected.html", true);
    link = function($scope, $el, $attrs) {
      var $ctrl, initializeSelectedFilters, renderFilters, renderSelectedFilters, selectQFilter, selectedFilters, showCategories, showFilters, toggleFilterSelection;
      $ctrl = $el.closest(".wrapper").controller();
      selectedFilters = [];
      showFilters = function(title, type) {
        $el.find(".filters-cats").hide();
        $el.find(".filter-list").removeClass("hidden");
        $el.find("h2.breadcrumb").removeClass("hidden");
        $el.find("h2 a.subfilter span.title").html(title);
        return $el.find("h2 a.subfilter span.title").prop("data-type", type);
      };
      showCategories = function() {
        $el.find(".filters-cats").show();
        $el.find(".filter-list").addClass("hidden");
        return $el.find("h2.breadcrumb").addClass("hidden");
      };
      initializeSelectedFilters = function(filters) {
        var j, len, name, val, values;
        selectedFilters = [];
        for (name in filters) {
          values = filters[name];
          for (j = 0, len = values.length; j < len; j++) {
            val = values[j];
            if (val.selected) {
              selectedFilters.push(val);
            }
          }
        }
        return renderSelectedFilters(selectedFilters);
      };
      renderSelectedFilters = function(selectedFilters) {
        var html;
        _.filter(selectedFilters, (function(_this) {
          return function(f) {
            if (f.color) {
              return f.style = "border-left: 3px solid " + f.color;
            }
          };
        })(this));
        html = templateSelected({
          filters: selectedFilters
        });
        html = $compile(html)($scope);
        $el.find(".filters-applied").html(html);
        if ($auth.isAuthenticated() && selectedFilters.length > 0) {
          return $el.find(".save-filters").show();
        } else {
          return $el.find(".save-filters").hide();
        }
      };
      renderFilters = function(filters) {
        var html;
        _.filter(filters, (function(_this) {
          return function(f) {
            if (f.color) {
              return f.style = "border-left: 3px solid " + f.color;
            }
          };
        })(this));
        html = template({
          filters: filters
        });
        html = $compile(html)($scope);
        return $el.find(".filter-list").html(html);
      };
      toggleFilterSelection = function(type, id) {
        var currentFiltersType, filter, filterId, filters;
        if (type === "myFilters") {
          $rs.issues.getMyFilters($scope.projectId).then(function(data) {
            var filters, myFilters;
            myFilters = data;
            filters = myFilters[id];
            filters.page = 1;
            $ctrl.replaceAllFilters(filters);
            $ctrl.storeFilters();
            $ctrl.loadIssues();
            $ctrl.markSelectedFilters($scope.filters, filters);
            return initializeSelectedFilters($scope.filters);
          });
          return null;
        }
        filters = $scope.filters[type];
        filterId = type === 'tags' ? taiga.toString(id) : id;
        filter = _.find(filters, {
          id: filterId
        });
        filter.selected = !filter.selected;
        if (id === null) {
          id = "null";
        }
        if (filter.selected) {
          selectedFilters.push(filter);
          $scope.$apply(function() {
            $ctrl.selectFilter(type, id);
            $ctrl.selectFilter("page", 1);
            $ctrl.storeFilters();
            return $ctrl.loadIssues();
          });
        } else {
          selectedFilters = _.reject(selectedFilters, filter);
          $scope.$apply(function() {
            $ctrl.unselectFilter(type, id);
            $ctrl.selectFilter("page", 1);
            $ctrl.storeFilters();
            return $ctrl.loadIssues();
          });
        }
        renderSelectedFilters(selectedFilters);
        currentFiltersType = $el.find("h2 a.subfilter span.title").prop('data-type');
        if (type === currentFiltersType) {
          return renderFilters(_.reject(filters, "selected"));
        }
      };
      $scope.$on("filters:loaded", function(ctx, filters) {
        return initializeSelectedFilters(filters);
      });
      $scope.$on("filters:issueupdate", function(ctx, filters) {
        var html;
        html = template({
          filters: filters.statuses
        });
        html = $compile(html)($scope);
        return $el.find(".filter-list").html(html);
      });
      selectQFilter = debounceLeading(100, function(value) {
        if (value === void 0) {
          return;
        }
        $ctrl.replaceFilter("page", null, true);
        if (value.length === 0) {
          $ctrl.replaceFilter("q", null);
          $ctrl.storeFilters();
        } else {
          $ctrl.replaceFilter("q", value);
          $ctrl.storeFilters();
        }
        return $ctrl.loadIssues();
      });
      $scope.$watch("filtersQ", selectQFilter);
      $el.on("click", ".filters-cats > ul > li > a", function(event) {
        var tags, target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        tags = $scope.filters[target.data("type")];
        renderFilters(_.reject(tags, "selected"));
        return showFilters(target.attr("title"), target.data("type"));
      });
      $el.on("click", ".filters-inner > .filters-step-cat > .breadcrumb > .back", function(event) {
        event.preventDefault();
        return showCategories($el);
      });
      $el.on("click", ".filters-applied a", function(event) {
        var id, target, type;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        id = target.data("id") || null;
        type = target.data("type");
        return toggleFilterSelection(type, id);
      });
      $el.on("click", ".filter-list .single-filter", function(event) {
        var id, target, type;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        target.toggleClass("active");
        id = target.data("id") || null;
        type = target.data("type");
        if (type === "myFilters") {
          target.removeClass("active");
        }
        return toggleFilterSelection(type, id);
      });
      $el.on("click", ".filter-list .single-filter .icon-delete", function(event) {
        var customFilterName, message, target, title;
        event.preventDefault();
        event.stopPropagation();
        target = angular.element(event.currentTarget);
        customFilterName = target.parent().data('id');
        title = $translate.instant("ISSUES.FILTERS.CONFIRM_DELETE.TITLE");
        message = $translate.instant("ISSUES.FILTERS.CONFIRM_DELETE.MESSAGE", {
          customFilterName: customFilterName
        });
        return $confirm.askOnDelete(title, message).then(function(finish) {
          var promise;
          promise = $ctrl.deleteMyFilter(customFilterName);
          promise.then(function() {
            promise = $ctrl.loadMyFilters();
            promise.then(function(filters) {
              finish();
              $scope.filters.myFilters = filters;
              return renderFilters($scope.filters.myFilters);
            });
            return promise.then(null, function() {
              return finish();
            });
          });
          return promise.then(null, function() {
            finish(false);
            return $confirm.notify("error");
          });
        });
      });
      $el.on("click", ".save-filters", function(event) {
        event.preventDefault();
        renderFilters($scope.filters["myFilters"]);
        showFilters("My filters", "myFilters");
        $el.find('.save-filters').hide();
        $el.find('.my-filter-name').removeClass("hidden");
        $el.find('.my-filter-name').focus();
        return $scope.$apply();
      });
      return $el.on("keyup", ".my-filter-name", function(event) {
        var newFilter, promise, target;
        event.preventDefault();
        if (event.keyCode === 13) {
          target = angular.element(event.currentTarget);
          newFilter = target.val();
          $loading.start($el.find(".new"));
          promise = $ctrl.saveCurrentFiltersTo(newFilter);
          promise.then(function() {
            var loadPromise;
            loadPromise = $ctrl.loadMyFilters();
            loadPromise.then(function(filters) {
              var currentfilterstype;
              $loading.finish($el.find(".new"));
              $scope.filters.myFilters = filters;
              currentfilterstype = $el.find("h2 a.subfilter span.title").prop('data-type');
              if (currentfilterstype === "myFilters") {
                renderFilters($scope.filters.myFilters);
              }
              $el.find('.my-filter-name').addClass("hidden");
              return $el.find('.save-filters').show();
            });
            return loadPromise.then(null, function() {
              $loading.finish($el.find(".new"));
              return $confirm.notify("error", "Error loading custom filters");
            });
          });
          return promise.then(null, function() {
            $loading.finish($el.find(".new"));
            $el.find(".my-filter-name").val(newFilter).focus().select();
            return $confirm.notify("error", "Filter not saved");
          });
        } else if (event.keyCode === 27) {
          $el.find('.my-filter-name').val('');
          $el.find('.my-filter-name').addClass("hidden");
          return $el.find('.save-filters').show();
        }
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgIssuesFilters", ["$log", "$tgLocation", "$tgResources", "$tgConfirm", "$tgLoading", "$tgTemplate", "$translate", "$compile", "$tgAuth", IssuesFiltersDirective]);

  IssueStatusInlineEditionDirective = function($repo, $template, $rootscope) {

    /*
    Print the status of an Issue and a popover to change it.
    - tg-issue-status-inline-edition: The issue
    
    Example:
    
      div.status(tg-issue-status-inline-edition="issue")
        a.issue-status(href="")
    
    NOTE: This directive need 'issueStatusById' and 'project'.
     */
    var link, selectionTemplate, updateIssueStatus;
    selectionTemplate = $template.get("issue/issue-status-inline-edition-selection.html", true);
    updateIssueStatus = function($el, issue, issueStatusById) {
      var issueStatusDom, issueStatusDomParent, status;
      issueStatusDomParent = $el.find(".issue-status");
      issueStatusDom = $el.find(".issue-status .issue-status-bind");
      status = issueStatusById[issue.status];
      if (status) {
        issueStatusDom.text(status.name);
        issueStatusDom.prop("title", status.name);
        return issueStatusDomParent.css('color', status.color);
      }
    };
    link = function($scope, $el, $attrs) {
      var $ctrl, issue;
      $ctrl = $el.controller();
      issue = $scope.$eval($attrs.tgIssueStatusInlineEdition);
      $el.on("click", ".issue-status", function(event) {
        event.preventDefault();
        event.stopPropagation();
        return $el.find(".pop-status").popover().open();
      });
      $el.on("click", ".status", function(event) {
        var filter, j, len, ref, target;
        event.preventDefault();
        event.stopPropagation();
        target = angular.element(event.currentTarget);
        ref = $scope.filters.statuses;
        for (j = 0, len = ref.length; j < len; j++) {
          filter = ref[j];
          if (filter.id === issue.status) {
            filter.count--;
          }
        }
        issue.status = target.data("status-id");
        $el.find(".pop-status").popover().close();
        updateIssueStatus($el, issue, $scope.issueStatusById);
        return $scope.$apply(function() {
          var k, len1, ref1;
          $repo.save(issue).then(function() {
            var k, len1, ref1;
            $ctrl.loadIssues();
            ref1 = $scope.filters.statuses;
            for (k = 0, len1 = ref1.length; k < len1; k++) {
              filter = ref1[k];
              if (filter.id === issue.status) {
                filter.count++;
              }
            }
            return $rootscope.$broadcast("filters:issueupdate", $scope.filters);
          });
          ref1 = $scope.filters.statuses;
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            filter = ref1[k];
            if (filter.id === issue.status) {
              filter.count++;
            }
          }
          return $rootscope.$broadcast("filters:issueupdate", $scope.filters);
        });
      });
      taiga.bindOnce($scope, "project", function(project) {
        $el.append(selectionTemplate({
          'statuses': project.issue_statuses
        }));
        updateIssueStatus($el, issue, $scope.issueStatusById);
        if (project.my_permissions.indexOf("modify_issue") === -1) {
          $el.unbind("click");
          return $el.find("a").addClass("not-clickable");
        }
      });
      $scope.$watch($attrs.tgIssueStatusInlineEdition, (function(_this) {
        return function(val) {
          return updateIssueStatus($el, val, $scope.issueStatusById);
        };
      })(this));
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgIssueStatusInlineEdition", ["$tgRepo", "$tgTemplate", "$rootScope", IssueStatusInlineEditionDirective]);

  IssueAssignedToInlineEditionDirective = function($repo, $rootscope, popoverService) {
    var link, template;
    template = _.template("<img src=\"<%- imgurl %>\" alt=\"<%- name %>\"/>\n<figcaption><%- name %></figcaption>");
    link = function($scope, $el, $attrs) {
      var $ctrl, issue, updateIssue;
      updateIssue = function(issue) {
        var ctx, member;
        ctx = {
          name: "Unassigned",
          imgurl: "/images/unnamed.png"
        };
        member = $scope.usersById[issue.assigned_to];
        if (member) {
          ctx.imgurl = member.photo;
          ctx.name = member.full_name_display;
        }
        $el.find(".avatar").html(template(ctx));
        return $el.find(".issue-assignedto").attr('title', ctx.name);
      };
      $ctrl = $el.controller();
      issue = $scope.$eval($attrs.tgIssueAssignedToInlineEdition);
      updateIssue(issue);
      $el.on("click", ".issue-assignedto", function(event) {
        return $rootscope.$broadcast("assigned-to:add", issue);
      });
      taiga.bindOnce($scope, "project", function(project) {
        if (project.my_permissions.indexOf("modify_issue") === -1) {
          $el.unbind("click");
          return $el.find("a").addClass("not-clickable");
        }
      });
      $scope.$on("assigned-to:added", (function(_this) {
        return function(ctx, userId, updatedIssue) {
          if (updatedIssue.id === issue.id) {
            updatedIssue.assigned_to = userId;
            $repo.save(updatedIssue);
            return updateIssue(updatedIssue);
          }
        };
      })(this));
      $scope.$watch($attrs.tgIssueAssignedToInlineEdition, (function(_this) {
        return function(val) {
          return updateIssue(val);
        };
      })(this));
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgIssueAssignedToInlineEdition", ["$tgRepo", "$rootScope", IssueAssignedToInlineEditionDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/userstories/detail.coffee
 */

(function() {
  var UsClientRequirementButtonDirective, UsStatusButtonDirective, UsStatusDisplayDirective, UsTasksProgressDisplayDirective, UsTeamRequirementButtonDirective, UserStoryDetailController, bindOnce, groupBy, mixOf, module, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  groupBy = this.taiga.groupBy;

  bindOnce = this.taiga.bindOnce;

  module = angular.module("taigaUserStories");

  UserStoryDetailController = (function(superClass) {
    extend(UserStoryDetailController, superClass);

    UserStoryDetailController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgConfirm", "$tgResources", "$routeParams", "$q", "$tgLocation", "$log", "tgAppMetaService", "$tgNavUrls", "$tgAnalytics", "$translate"];

    function UserStoryDetailController(scope, rootscope, repo, confirm, rs, params, q, location, log, appMetaService, navUrls, analytics, translate) {
      var promise;
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs;
      this.params = params;
      this.q = q;
      this.location = location;
      this.log = log;
      this.appMetaService = appMetaService;
      this.navUrls = navUrls;
      this.analytics = analytics;
      this.translate = translate;
      this.scope.usRef = this.params.usref;
      this.scope.sectionName = this.translate.instant("US.SECTION_NAME");
      this.initializeEventHandlers();
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          _this._setMeta();
          return _this.initializeOnDeleteGoToUrl();
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
    }

    UserStoryDetailController.prototype._setMeta = function() {
      var closedTasks, description, progressPercentage, ref, title, totalTasks;
      totalTasks = this.scope.tasks.length;
      closedTasks = _.filter(this.scope.tasks, (function(_this) {
        return function(t) {
          return _this.scope.taskStatusById[t.status].is_closed;
        };
      })(this)).length;
      progressPercentage = totalTasks > 0 ? Math.round(100 * closedTasks / totalTasks) : 0;
      title = this.translate.instant("US.PAGE_TITLE", {
        userStoryRef: "#" + this.scope.us.ref,
        userStorySubject: this.scope.us.subject,
        projectName: this.scope.project.name
      });
      description = this.translate.instant("US.PAGE_DESCRIPTION", {
        userStoryStatus: ((ref = this.scope.statusById[this.scope.us.status]) != null ? ref.name : void 0) || "--",
        userStoryPoints: this.scope.us.total_points,
        userStoryDescription: angular.element(this.scope.us.description_html || "").text(),
        userStoryClosedTasks: closedTasks,
        userStoryTotalTasks: totalTasks,
        userStoryProgressPercentage: progressPercentage
      });
      return this.appMetaService.setAll(title, description);
    };

    UserStoryDetailController.prototype.initializeEventHandlers = function() {
      this.scope.$on("related-tasks:update", (function(_this) {
        return function() {
          _this.loadUs();
          return _this.scope.tasks = _.clone(_this.scope.tasks, false);
        };
      })(this));
      this.scope.$on("attachment:create", (function(_this) {
        return function() {
          _this.analytics.trackEvent("attachment", "create", "create attachment on userstory", 1);
          return _this.rootscope.$broadcast("object:updated");
        };
      })(this));
      this.scope.$on("attachment:edit", (function(_this) {
        return function() {
          return _this.rootscope.$broadcast("object:updated");
        };
      })(this));
      this.scope.$on("attachment:delete", (function(_this) {
        return function() {
          return _this.rootscope.$broadcast("object:updated");
        };
      })(this));
      this.scope.$on("custom-attributes-values:edit", (function(_this) {
        return function() {
          return _this.rootscope.$broadcast("object:updated");
        };
      })(this));
      return this.scope.$on("comment:new", (function(_this) {
        return function() {
          return _this.loadUs();
        };
      })(this));
    };

    UserStoryDetailController.prototype.initializeOnDeleteGoToUrl = function() {
      var ctx;
      ctx = {
        project: this.scope.project.slug
      };
      this.scope.onDeleteGoToUrl = this.navUrls.resolve("project", ctx);
      if (this.scope.project.is_backlog_activated) {
        if (this.scope.us.milestone) {
          ctx.sprint = this.scope.sprint.slug;
          return this.scope.onDeleteGoToUrl = this.navUrls.resolve("project-taskboard", ctx);
        } else {
          return this.scope.onDeleteGoToUrl = this.navUrls.resolve("project-backlog", ctx);
        }
      } else if (this.scope.project.is_kanban_activated) {
        return this.scope.onDeleteGoToUrl = this.navUrls.resolve("project-kanban", ctx);
      }
    };

    UserStoryDetailController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.$emit('project:loaded', project);
          _this.scope.statusList = project.us_statuses;
          _this.scope.statusById = groupBy(project.us_statuses, function(x) {
            return x.id;
          });
          _this.scope.taskStatusById = groupBy(project.task_statuses, function(x) {
            return x.id;
          });
          _this.scope.pointsList = _.sortBy(project.points, "order");
          _this.scope.pointsById = groupBy(_this.scope.pointsList, function(e) {
            return e.id;
          });
          return project;
        };
      })(this));
    };

    UserStoryDetailController.prototype.loadUs = function() {
      var httpParams, kanbanStaus, milestone, noMilestone;
      httpParams = _.pick(this.location.search(), "milestone", "no-milestone", "kanban-status");
      milestone = httpParams.milestone;
      if (milestone) {
        this.rs.userstories.storeQueryParams(this.scope.projectId, {
          milestone: milestone,
          order_by: "sprint_order"
        });
      }
      noMilestone = httpParams["no-milestone"];
      if (noMilestone) {
        this.rs.userstories.storeQueryParams(this.scope.projectId, {
          milestone: "null",
          order_by: "backlog_order"
        });
      }
      kanbanStaus = httpParams["kanban-status"];
      if (kanbanStaus) {
        this.rs.userstories.storeQueryParams(this.scope.projectId, {
          status: kanbanStaus,
          order_by: "kanban_order"
        });
      }
      return this.rs.userstories.getByRef(this.scope.projectId, this.params.usref).then((function(_this) {
        return function(us) {
          var ctx;
          _this.scope.us = us;
          _this.scope.usId = us.id;
          _this.scope.commentModel = us;
          if (_this.scope.us.neighbors.previous.ref != null) {
            ctx = {
              project: _this.scope.project.slug,
              ref: _this.scope.us.neighbors.previous.ref
            };
            _this.scope.previousUrl = _this.navUrls.resolve("project-userstories-detail", ctx);
          }
          if (_this.scope.us.neighbors.next.ref != null) {
            ctx = {
              project: _this.scope.project.slug,
              ref: _this.scope.us.neighbors.next.ref
            };
            _this.scope.nextUrl = _this.navUrls.resolve("project-userstories-detail", ctx);
          }
          return us;
        };
      })(this));
    };

    UserStoryDetailController.prototype.loadSprint = function() {
      if (this.scope.us.milestone) {
        return this.rs.sprints.get(this.scope.us.project, this.scope.us.milestone).then((function(_this) {
          return function(sprint) {
            _this.scope.sprint = sprint;
            return sprint;
          };
        })(this));
      }
    };

    UserStoryDetailController.prototype.loadTasks = function() {
      return this.rs.tasks.list(this.scope.projectId, null, this.scope.usId).then((function(_this) {
        return function(tasks) {
          _this.scope.tasks = tasks;
          return tasks;
        };
      })(this));
    };

    UserStoryDetailController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      return promise.then((function(_this) {
        return function(project) {
          _this.fillUsersAndRoles(project.members, project.roles);
          return _this.loadUs().then(function() {
            return _this.q.all([_this.loadSprint(), _this.loadTasks()]);
          });
        };
      })(this));
    };

    return UserStoryDetailController;

  })(mixOf(taiga.Controller, taiga.PageMixin));

  module.controller("UserStoryDetailController", UserStoryDetailController);

  UsStatusDisplayDirective = function($template, $compile) {
    var link, template;
    template = $template.get("common/components/status-display.html", true);
    link = function($scope, $el, $attrs) {
      var render;
      render = function(us) {
        var html, status;
        status = $scope.statusById[us.status];
        html = template({
          is_closed: us.is_closed,
          status: status
        });
        html = $compile(html)($scope);
        return $el.html(html);
      };
      $scope.$watch($attrs.ngModel, function(us) {
        if (us != null) {
          return render(us);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgUsStatusDisplay", ["$tgTemplate", "$compile", UsStatusDisplayDirective]);

  UsTasksProgressDisplayDirective = function($template, $compile) {
    var link;
    link = function($scope, $el, $attrs) {
      var render;
      render = function(tasks) {
        var progress, totalClosedTasks, totalTasks;
        totalTasks = tasks.length;
        totalClosedTasks = _.filter(tasks, (function(_this) {
          return function(task) {
            return $scope.taskStatusById[task.status].is_closed;
          };
        })(this)).length;
        progress = totalTasks > 0 ? 100 * totalClosedTasks / totalTasks : 0;
        return _.assign($scope, {
          totalTasks: totalTasks,
          totalClosedTasks: totalClosedTasks,
          progress: progress,
          style: {
            width: progress + "%"
          }
        });
      };
      $scope.$watch($attrs.ngModel, function(tasks) {
        if (tasks != null) {
          return render(tasks);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      templateUrl: "us/us-task-progress.html",
      link: link,
      restrict: "EA",
      require: "ngModel",
      scope: true
    };
  };

  module.directive("tgUsTasksProgressDisplay", ["$tgTemplate", "$compile", UsTasksProgressDisplayDirective]);

  UsStatusButtonDirective = function($rootScope, $repo, $confirm, $loading, $qqueue, $template) {
    var link, template;
    template = $template.get("us/us-status-button.html", true);
    link = function($scope, $el, $attrs, $model) {
      var isEditable, render, save;
      isEditable = function() {
        return $scope.project.my_permissions.indexOf("modify_us") !== -1;
      };
      render = (function(_this) {
        return function(us) {
          var html, status;
          status = $scope.statusById[us.status];
          html = template({
            status: status,
            statuses: $scope.statusList,
            editable: isEditable()
          });
          return $el.html(html);
        };
      })(this);
      save = $qqueue.bindAdd((function(_this) {
        return function(status) {
          var onError, onSuccess, us;
          us = $model.$modelValue.clone();
          us.status = status;
          $.fn.popover().closeAll();
          $model.$setViewValue(us);
          onSuccess = function() {
            $confirm.notify("success");
            $rootScope.$broadcast("object:updated");
            return $loading.finish($el.find(".level-name"));
          };
          onError = function() {
            $confirm.notify("error");
            us.revert();
            $model.$setViewValue(us);
            return $loading.finish($el.find(".level-name"));
          };
          $loading.start($el.find(".level-name"));
          return $repo.save($model.$modelValue).then(onSuccess, onError);
        };
      })(this));
      $el.on("click", ".status-data", function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (!isEditable()) {
          return;
        }
        return $el.find(".pop-status").popover().open();
      });
      $el.on("click", ".status", function(event) {
        var status, target;
        event.preventDefault();
        event.stopPropagation();
        if (!isEditable()) {
          return;
        }
        target = angular.element(event.currentTarget);
        status = target.data("status-id");
        return save(status);
      });
      $scope.$watch($attrs.ngModel, function(us) {
        if (us) {
          return render(us);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgUsStatusButton", ["$rootScope", "$tgRepo", "$tgConfirm", "$tgLoading", "$tgQqueue", "$tgTemplate", UsStatusButtonDirective]);

  UsTeamRequirementButtonDirective = function($rootscope, $tgrepo, $confirm, $loading, $qqueue, $template, $compile) {
    var link, template;
    template = $template.get("us/us-team-requirement-button.html", true);
    link = function($scope, $el, $attrs, $model) {
      var canEdit, render, save;
      canEdit = function() {
        return $scope.project.my_permissions.indexOf("modify_us") !== -1;
      };
      render = function(us) {
        var ctx, html;
        if (!canEdit() && !us.team_requirement) {
          $el.html("");
          return;
        }
        ctx = {
          canEdit: canEdit(),
          isRequired: us.team_requirement
        };
        html = template(ctx);
        html = $compile(html)($scope);
        return $el.html(html);
      };
      save = $qqueue.bindAdd((function(_this) {
        return function(team_requirement) {
          var promise, us;
          us = $model.$modelValue.clone();
          us.team_requirement = team_requirement;
          $model.$setViewValue(us);
          $loading.start($el.find("label"));
          promise = $tgrepo.save($model.$modelValue);
          promise.then(function() {
            $loading.finish($el.find("label"));
            return $rootscope.$broadcast("object:updated");
          });
          return promise.then(null, function() {
            $loading.finish($el.find("label"));
            $confirm.notify("error");
            us.revert();
            return $model.$setViewValue(us);
          });
        };
      })(this));
      $el.on("click", ".team-requirement", function(event) {
        var team_requirement;
        if (!canEdit()) {
          return;
        }
        team_requirement = !$model.$modelValue.team_requirement;
        return save(team_requirement);
      });
      $scope.$watch($attrs.ngModel, function(us) {
        if (us) {
          return render(us);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgUsTeamRequirementButton", ["$rootScope", "$tgRepo", "$tgConfirm", "$tgLoading", "$tgQqueue", "$tgTemplate", "$compile", UsTeamRequirementButtonDirective]);

  UsClientRequirementButtonDirective = function($rootscope, $tgrepo, $confirm, $loading, $qqueue, $template, $compile) {
    var link, template;
    template = $template.get("us/us-client-requirement-button.html", true);
    link = function($scope, $el, $attrs, $model) {
      var canEdit, render, save;
      canEdit = function() {
        return $scope.project.my_permissions.indexOf("modify_us") !== -1;
      };
      render = function(us) {
        var ctx, html;
        if (!canEdit() && !us.client_requirement) {
          $el.html("");
          return;
        }
        ctx = {
          canEdit: canEdit(),
          isRequired: us.client_requirement
        };
        html = $compile(template(ctx))($scope);
        return $el.html(html);
      };
      save = $qqueue.bindAdd((function(_this) {
        return function(client_requirement) {
          var promise, us;
          us = $model.$modelValue.clone();
          us.client_requirement = client_requirement;
          $model.$setViewValue(us);
          $loading.start($el.find("label"));
          promise = $tgrepo.save($model.$modelValue);
          promise.then(function() {
            $loading.finish($el.find("label"));
            return $rootscope.$broadcast("object:updated");
          });
          return promise.then(null, function() {
            $loading.finish($el.find("label"));
            $confirm.notify("error");
            us.revert();
            return $model.$setViewValue(us);
          });
        };
      })(this));
      $el.on("click", ".client-requirement", function(event) {
        var client_requirement;
        if (!canEdit()) {
          return;
        }
        client_requirement = !$model.$modelValue.client_requirement;
        return save(client_requirement);
      });
      $scope.$watch($attrs.ngModel, function(us) {
        if (us) {
          return render(us);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgUsClientRequirementButton", ["$rootScope", "$tgRepo", "$tgConfirm", "$tgLoading", "$tgQqueue", "$tgTemplate", "$compile", UsClientRequirementButtonDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/tasks/detail.coffee
 */

(function() {
  var TaskDetailController, TaskIsIocaineButtonDirective, TaskStatusButtonDirective, TaskStatusDisplayDirective, groupBy, mixOf, module, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  groupBy = this.taiga.groupBy;

  module = angular.module("taigaTasks");

  TaskDetailController = (function(superClass) {
    extend(TaskDetailController, superClass);

    TaskDetailController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgConfirm", "$tgResources", "$routeParams", "$q", "$tgLocation", "$log", "tgAppMetaService", "$tgNavUrls", "$tgAnalytics", "$translate"];

    function TaskDetailController(scope, rootscope, repo, confirm, rs, params, q, location, log, appMetaService, navUrls, analytics, translate) {
      var promise;
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs;
      this.params = params;
      this.q = q;
      this.location = location;
      this.log = log;
      this.appMetaService = appMetaService;
      this.navUrls = navUrls;
      this.analytics = analytics;
      this.translate = translate;
      this.scope.taskRef = this.params.taskref;
      this.scope.sectionName = this.translate.instant("TASK.SECTION_NAME");
      this.initializeEventHandlers();
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          _this._setMeta();
          return _this.initializeOnDeleteGoToUrl();
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
    }

    TaskDetailController.prototype._setMeta = function() {
      var description, ref, title;
      title = this.translate.instant("TASK.PAGE_TITLE", {
        taskRef: "#" + this.scope.task.ref,
        taskSubject: this.scope.task.subject,
        projectName: this.scope.project.name
      });
      description = this.translate.instant("TASK.PAGE_DESCRIPTION", {
        taskStatus: ((ref = this.scope.statusById[this.scope.task.status]) != null ? ref.name : void 0) || "--",
        taskDescription: angular.element(this.scope.task.description_html || "").text()
      });
      return this.appMetaService.setAll(title, description);
    };

    TaskDetailController.prototype.initializeEventHandlers = function() {
      this.scope.$on("attachment:create", (function(_this) {
        return function() {
          _this.analytics.trackEvent("attachment", "create", "create attachment on task", 1);
          return _this.rootscope.$broadcast("object:updated");
        };
      })(this));
      this.scope.$on("attachment:edit", (function(_this) {
        return function() {
          return _this.rootscope.$broadcast("object:updated");
        };
      })(this));
      this.scope.$on("attachment:delete", (function(_this) {
        return function() {
          return _this.rootscope.$broadcast("object:updated");
        };
      })(this));
      this.scope.$on("custom-attributes-values:edit", (function(_this) {
        return function() {
          return _this.rootscope.$broadcast("object:updated");
        };
      })(this));
      return this.scope.$on("comment:new", (function(_this) {
        return function() {
          return _this.loadTask();
        };
      })(this));
    };

    TaskDetailController.prototype.initializeOnDeleteGoToUrl = function() {
      var ctx;
      ctx = {
        project: this.scope.project.slug
      };
      this.scope.onDeleteGoToUrl = this.navUrls.resolve("project", ctx);
      if (this.scope.project.is_backlog_activated) {
        if (this.scope.task.milestone) {
          ctx.sprint = this.scope.sprint.slug;
          return this.scope.onDeleteGoToUrl = this.navUrls.resolve("project-taskboard", ctx);
        } else if (this.scope.task.us) {
          ctx.ref = this.scope.us.ref;
          return this.scope.onDeleteGoToUrl = this.navUrls.resolve("project-userstories-detail", ctx);
        }
      } else if (this.scope.project.is_kanban_activated) {
        if (this.scope.us) {
          ctx.ref = this.scope.us.ref;
          return this.scope.onDeleteGoToUrl = this.navUrls.resolve("project-userstories-detail", ctx);
        }
      }
    };

    TaskDetailController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.$emit('project:loaded', project);
          _this.scope.statusList = project.task_statuses;
          _this.scope.statusById = groupBy(project.task_statuses, function(x) {
            return x.id;
          });
          return project;
        };
      })(this));
    };

    TaskDetailController.prototype.loadTask = function() {
      return this.rs.tasks.getByRef(this.scope.projectId, this.params.taskref).then((function(_this) {
        return function(task) {
          var ctx;
          _this.scope.task = task;
          _this.scope.taskId = task.id;
          _this.scope.commentModel = task;
          if (_this.scope.task.neighbors.previous.ref != null) {
            ctx = {
              project: _this.scope.project.slug,
              ref: _this.scope.task.neighbors.previous.ref
            };
            _this.scope.previousUrl = _this.navUrls.resolve("project-tasks-detail", ctx);
          }
          if (_this.scope.task.neighbors.next.ref != null) {
            ctx = {
              project: _this.scope.project.slug,
              ref: _this.scope.task.neighbors.next.ref
            };
            _this.scope.nextUrl = _this.navUrls.resolve("project-tasks-detail", ctx);
          }
          return task;
        };
      })(this));
    };

    TaskDetailController.prototype.loadSprint = function() {
      if (this.scope.task.milestone) {
        return this.rs.sprints.get(this.scope.task.project, this.scope.task.milestone).then((function(_this) {
          return function(sprint) {
            _this.scope.sprint = sprint;
            return sprint;
          };
        })(this));
      }
    };

    TaskDetailController.prototype.loadUserStory = function() {
      if (this.scope.task.user_story) {
        return this.rs.userstories.get(this.scope.task.project, this.scope.task.user_story).then((function(_this) {
          return function(us) {
            _this.scope.us = us;
            return us;
          };
        })(this));
      }
    };

    TaskDetailController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      return promise.then((function(_this) {
        return function(project) {
          _this.fillUsersAndRoles(project.members, project.roles);
          return _this.loadTask().then(function() {
            return _this.q.all([_this.loadSprint(), _this.loadUserStory()]);
          });
        };
      })(this));
    };

    return TaskDetailController;

  })(mixOf(taiga.Controller, taiga.PageMixin));

  module.controller("TaskDetailController", TaskDetailController);

  TaskStatusDisplayDirective = function($template, $compile) {
    var link, template;
    template = $template.get("common/components/status-display.html", true);
    link = function($scope, $el, $attrs) {
      var render;
      render = function(task) {
        var html, status;
        status = $scope.statusById[task.status];
        html = template({
          is_closed: status.is_closed,
          status: status
        });
        html = $compile(html)($scope);
        return $el.html(html);
      };
      $scope.$watch($attrs.ngModel, function(task) {
        if (task != null) {
          return render(task);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgTaskStatusDisplay", ["$tgTemplate", "$compile", TaskStatusDisplayDirective]);

  TaskStatusButtonDirective = function($rootScope, $repo, $confirm, $loading, $qqueue, $compile, $translate) {
    var link, template;
    template = _.template("<div class=\"status-data <% if(editable){ %>clickable<% }%>\">\n    <span class=\"level\" style=\"background-color:<%- status.color %>\"></span>\n    <span class=\"status-status\"><%- status.name %></span>\n    <% if(editable){ %><span class=\"icon icon-arrow-bottom\"></span><% }%>\n    <span class=\"level-name\" translate=\"COMMON.FIELDS.STATUS\"></span>\n\n    <ul class=\"popover pop-status\">\n        <% _.each(statuses, function(st) { %>\n        <li><a href=\"\" class=\"status\" title=\"<%- st.name %>\"\n               data-status-id=\"<%- st.id %>\"><%- st.name %></a></li>\n        <% }); %>\n    </ul>\n</div>");
    link = function($scope, $el, $attrs, $model) {
      var isEditable, render, save;
      isEditable = function() {
        return $scope.project.my_permissions.indexOf("modify_task") !== -1;
      };
      render = (function(_this) {
        return function(task) {
          var html, status;
          status = $scope.statusById[task.status];
          html = $compile(template({
            status: status,
            statuses: $scope.statusList,
            editable: isEditable()
          }))($scope);
          return $el.html(html);
        };
      })(this);
      save = $qqueue.bindAdd((function(_this) {
        return function(status) {
          var onError, onSuccess, task;
          task = $model.$modelValue.clone();
          task.status = status;
          $model.$setViewValue(task);
          onSuccess = function() {
            $confirm.notify("success");
            $rootScope.$broadcast("object:updated");
            return $loading.finish($el.find(".level-name"));
          };
          onError = function() {
            $confirm.notify("error");
            task.revert();
            $model.$setViewValue(task);
            return $loading.finish($el.find(".level-name"));
          };
          $loading.start($el.find(".level-name"));
          return $repo.save($model.$modelValue).then(onSuccess, onError);
        };
      })(this));
      $el.on("click", ".status-data", function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (!isEditable()) {
          return;
        }
        return $el.find(".pop-status").popover().open();
      });
      $el.on("click", ".status", function(event) {
        var target;
        event.preventDefault();
        event.stopPropagation();
        if (!isEditable()) {
          return;
        }
        target = angular.element(event.currentTarget);
        $.fn.popover().closeAll();
        return save(target.data("status-id"));
      });
      $scope.$watch($attrs.ngModel, function(task) {
        if (task) {
          return render(task);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgTaskStatusButton", ["$rootScope", "$tgRepo", "$tgConfirm", "$tgLoading", "$tgQqueue", "$compile", "$translate", TaskStatusButtonDirective]);

  TaskIsIocaineButtonDirective = function($rootscope, $tgrepo, $confirm, $loading, $qqueue, $compile) {
    var link, template;
    template = _.template("<fieldset title=\"{{ 'TASK.TITLE_ACTION_IOCAINE' | translate }}\">\n  <label for=\"is-iocaine\"\n         translate=\"TASK.ACTION_IOCAINE\"\n         class=\"button button-gray is-iocaine <% if(isEditable){ %>editable<% }; %> <% if(isIocaine){ %>active<% }; %>\">\n        Iocaine\n  </label>\n  <input type=\"checkbox\" id=\"is-iocaine\" name=\"is-iocaine\"/>\n</fieldset>");
    link = function($scope, $el, $attrs, $model) {
      var isEditable, render, save;
      isEditable = function() {
        return $scope.project.my_permissions.indexOf("modify_task") !== -1;
      };
      render = function(task) {
        var ctx, html;
        if (!isEditable() && !task.is_iocaine) {
          $el.html("");
          return;
        }
        ctx = {
          isIocaine: task.is_iocaine,
          isEditable: isEditable()
        };
        html = $compile(template(ctx))($scope);
        return $el.html(html);
      };
      save = $qqueue.bindAdd((function(_this) {
        return function(is_iocaine) {
          var promise, task;
          task = $model.$modelValue.clone();
          task.is_iocaine = is_iocaine;
          $model.$setViewValue(task);
          $loading.start($el.find('label'));
          promise = $tgrepo.save(task);
          promise.then(function() {
            $confirm.notify("success");
            return $rootscope.$broadcast("object:updated");
          });
          promise.then(null, function() {
            task.revert();
            $model.$setViewValue(task);
            return $confirm.notify("error");
          });
          return promise["finally"](function() {
            return $loading.finish($el.find('label'));
          });
        };
      })(this));
      $el.on("click", ".is-iocaine", function(event) {
        var is_iocaine;
        if (!isEditable()) {
          return;
        }
        is_iocaine = !$model.$modelValue.is_iocaine;
        return save(is_iocaine);
      });
      $scope.$watch($attrs.ngModel, function(task) {
        if (task) {
          return render(task);
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgTaskIsIocaineButton", ["$rootScope", "$tgRepo", "$tgConfirm", "$tgLoading", "$tgQqueue", "$compile", TaskIsIocaineButtonDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/team/main.coffee
 */

(function() {
  var LeaveProjectDirective, TeamController, TeamFiltersDirective, TeamMemberCurrentUserDirective, TeamMemberStatsDirective, TeamMembersDirective, membersFilter, mixOf, module, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  module = angular.module("taigaTeam");

  TeamController = (function(superClass) {
    extend(TeamController, superClass);

    TeamController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgResources", "$routeParams", "$q", "$location", "$tgNavUrls", "tgAppMetaService", "$tgAuth", "$translate", "tgProjectService"];

    function TeamController(scope, rootscope, repo, rs, params, q, location, navUrls, appMetaService, auth, translate, projectService) {
      var promise;
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.rs = rs;
      this.params = params;
      this.q = q;
      this.location = location;
      this.navUrls = navUrls;
      this.appMetaService = appMetaService;
      this.auth = auth;
      this.translate = translate;
      this.projectService = projectService;
      this.scope.sectionName = "TEAM.SECTION_NAME";
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          var description, title;
          title = _this.translate.instant("TEAM.PAGE_TITLE", {
            projectName: _this.scope.project.name
          });
          description = _this.translate.instant("TEAM.PAGE_DESCRIPTION", {
            projectName: _this.scope.project.name,
            projectDescription: _this.scope.project.description
          });
          return _this.appMetaService.setAll(title, description);
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
    }

    TeamController.prototype.setRole = function(role) {
      if (role) {
        return this.scope.filtersRole = role;
      } else {
        return this.scope.filtersRole = null;
      }
    };

    TeamController.prototype.loadMembers = function() {
      var i, len, member, ref, user;
      user = this.auth.getUser();
      this.scope.totals = {};
      ref = this.scope.activeUsers;
      for (i = 0, len = ref.length; i < len; i++) {
        member = ref[i];
        this.scope.totals[member.id] = 0;
      }
      this.scope.currentUser = _.find(this.scope.activeUsers, {
        id: user != null ? user.id : void 0
      });
      return this.scope.memberships = _.reject(this.scope.activeUsers, {
        id: user != null ? user.id : void 0
      });
    };

    TeamController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.$emit('project:loaded', project);
          _this.scope.issuesEnabled = project.is_issues_activated;
          _this.scope.tasksEnabled = project.is_kanban_activated || project.is_backlog_activated;
          _this.scope.wikiEnabled = project.is_wiki_activated;
          return project;
        };
      })(this));
    };

    TeamController.prototype.loadMemberStats = function() {
      return this.rs.projects.memberStats(this.scope.projectId).then((function(_this) {
        return function(stats) {
          var totals;
          totals = {};
          _.forEach(_this.scope.totals, function(total, userId) {
            var vals;
            vals = _.map(stats, function(memberStats, statsKey) {
              return memberStats[userId];
            });
            total = _.reduce(vals, function(sum, el) {
              return sum + el;
            });
            return _this.scope.totals[userId] = total;
          });
          _this.scope.stats = _this._processStats(stats);
          return _this.scope.stats.totals = _this.scope.totals;
        };
      })(this));
    };

    TeamController.prototype._processStat = function(stat) {
      var max, min, singleStat;
      max = _.max(stat);
      min = _.min(stat);
      singleStat = _.map(stat, function(value, key) {
        if (value === min) {
          return [key, 0.1];
        }
        if (value === max) {
          return [key, 1];
        }
        return [key, (value * 0.5) / max];
      });
      singleStat = _.object(singleStat);
      return singleStat;
    };

    TeamController.prototype._processStats = function(stats) {
      var key, value;
      for (key in stats) {
        value = stats[key];
        stats[key] = this._processStat(value);
      }
      return stats;
    };

    TeamController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      return promise.then((function(_this) {
        return function(project) {
          _this.fillUsersAndRoles(project.members, project.roles);
          _this.loadMembers();
          return _this.loadMemberStats();
        };
      })(this));
    };

    return TeamController;

  })(mixOf(taiga.Controller, taiga.PageMixin));

  module.controller("TeamController", TeamController);

  TeamFiltersDirective = function() {
    return {
      templateUrl: "team/team-filter.html"
    };
  };

  module.directive("tgTeamFilters", [TeamFiltersDirective]);

  TeamMemberStatsDirective = function() {
    return {
      templateUrl: "team/team-member-stats.html",
      scope: {
        stats: "=",
        userId: "=user",
        issuesEnabled: "=issuesenabled",
        tasksEnabled: "=tasksenabled",
        wikiEnabled: "=wikienabled"
      }
    };
  };

  module.directive("tgTeamMemberStats", TeamMemberStatsDirective);

  TeamMemberCurrentUserDirective = function() {
    return {
      templateUrl: "team/team-member-current-user.html",
      scope: {
        projectId: "=projectid",
        currentUser: "=currentuser",
        stats: "=",
        issuesEnabled: "=issuesenabled",
        tasksEnabled: "=tasksenabled",
        wikiEnabled: "=wikienabled"
      }
    };
  };

  module.directive("tgTeamCurrentUser", TeamMemberCurrentUserDirective);

  TeamMembersDirective = function() {
    var template;
    template = "team/team-members.html";
    return {
      templateUrl: template,
      scope: {
        memberships: "=",
        filtersQ: "=filtersq",
        filtersRole: "=filtersrole",
        stats: "=",
        issuesEnabled: "=issuesenabled",
        tasksEnabled: "=tasksenabled",
        wikiEnabled: "=wikienabled"
      }
    };
  };

  module.directive("tgTeamMembers", TeamMembersDirective);

  LeaveProjectDirective = function($repo, $confirm, $location, $rs, $navurls, $translate) {
    var link;
    link = function($scope, $el, $attrs) {
      return $scope.leave = function() {
        var confirm_leave_project_text, leave_project_text;
        leave_project_text = $translate.instant("TEAM.ACTION_LEAVE_PROJECT");
        confirm_leave_project_text = $translate.instant("TEAM.CONFIRM_LEAVE_PROJECT");
        return $confirm.ask(leave_project_text, confirm_leave_project_text).then((function(_this) {
          return function(finish) {
            var promise;
            promise = $rs.projects.leave($attrs.projectid);
            promise.then(function() {
              finish();
              $confirm.notify("success");
              return $location.path($navurls.resolve("home"));
            });
            return promise.then(null, function(response) {
              finish();
              return $confirm.notify('error', response.data._error_message);
            });
          };
        })(this));
      };
    };
    return {
      scope: {},
      templateUrl: "team/leave-project.html",
      link: link
    };
  };

  module.directive("tgLeaveProject", ["$tgRepo", "$tgConfirm", "$tgLocation", "$tgResources", "$tgNavUrls", "$translate", LeaveProjectDirective]);

  membersFilter = function() {
    return function(members, filtersQ, filtersRole) {
      return _.filter(members, function(m) {
        return (!filtersRole || m.role === filtersRole.id) && (!filtersQ || m.full_name.search(new RegExp(filtersQ, "i")) >= 0);
      });
    };
  };

  module.filter('membersFilter', membersFilter);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/wiki/detail.coffee
 */

(function() {
  var EditableWikiContentDirective, WikiDetailController, WikiSummaryDirective, bindOnce, debounce, groupBy, mixOf, module, taiga, unslugify,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  groupBy = this.taiga.groupBy;

  bindOnce = this.taiga.bindOnce;

  unslugify = this.taiga.unslugify;

  debounce = this.taiga.debounce;

  module = angular.module("taigaWiki");

  WikiDetailController = (function(superClass) {
    extend(WikiDetailController, superClass);

    WikiDetailController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgModel", "$tgConfirm", "$tgResources", "$routeParams", "$q", "$tgLocation", "$filter", "$log", "tgAppMetaService", "$tgNavUrls", "$tgAnalytics", "$translate"];

    function WikiDetailController(scope, rootscope, repo, model, confirm, rs, params, q, location, filter, log, appMetaService, navUrls, analytics, translate) {
      var promise;
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.model = model;
      this.confirm = confirm;
      this.rs = rs;
      this.params = params;
      this.q = q;
      this.location = location;
      this.filter = filter;
      this.log = log;
      this.appMetaService = appMetaService;
      this.navUrls = navUrls;
      this.analytics = analytics;
      this.translate = translate;
      this.scope.projectSlug = this.params.pslug;
      this.scope.wikiSlug = this.params.slug;
      this.scope.sectionName = "Wiki";
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          return _this._setMeta();
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
    }

    WikiDetailController.prototype._setMeta = function() {
      var description, title;
      title = this.translate.instant("WIKI.PAGE_TITLE", {
        wikiPageName: unslugify(this.scope.wiki.slug),
        projectName: this.scope.project.name
      });
      description = this.translate.instant("WIKI.PAGE_DESCRIPTION", {
        wikiPageContent: angular.element(this.scope.wiki.html || "").text(),
        totalEditions: this.scope.wiki.editions || 0,
        lastModifiedDate: moment(this.scope.wiki.modified_date).format(this.translate.instant("WIKI.DATETIME"))
      });
      return this.appMetaService.setAll(title, description);
    };

    WikiDetailController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          if (!project.is_wiki_activated) {
            _this.location.path(_this.navUrls.resolve("permission-denied"));
          }
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.$emit('project:loaded', project);
          return project;
        };
      })(this));
    };

    WikiDetailController.prototype.loadWiki = function() {
      var promise;
      promise = this.rs.wiki.getBySlug(this.scope.projectId, this.params.slug);
      promise.then((function(_this) {
        return function(wiki) {
          _this.scope.wiki = wiki;
          _this.scope.wikiId = wiki.id;
          return _this.scope.wiki;
        };
      })(this));
      return promise.then(null, (function(_this) {
        return function(xhr) {
          var data;
          _this.scope.wikiId = null;
          if (_this.scope.project.my_permissions.indexOf("add_wiki_page") === -1) {
            return null;
          }
          data = {
            project: _this.scope.projectId,
            slug: _this.scope.wikiSlug,
            content: ""
          };
          _this.scope.wiki = _this.model.make_model("wiki", data);
          return _this.scope.wiki;
        };
      })(this));
    };

    WikiDetailController.prototype.loadWikiLinks = function() {
      return this.rs.wiki.listLinks(this.scope.projectId).then((function(_this) {
        return function(wikiLinks) {
          return _this.scope.wikiLinks = wikiLinks;
        };
      })(this));
    };

    WikiDetailController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      return promise.then((function(_this) {
        return function(project) {
          _this.fillUsersAndRoles(project.members, project.roles);
          return _this.q.all([_this.loadWikiLinks(), _this.loadWiki()]).then(function() {});
        };
      })(this));
    };

    WikiDetailController.prototype["delete"] = function() {
      var message, title;
      title = this.translate.instant("WIKI.DELETE_LIGHTBOX_TITLE");
      message = unslugify(this.scope.wiki.slug);
      return this.confirm.askOnDelete(title, message).then((function(_this) {
        return function(finish) {
          var onError, onSuccess;
          onSuccess = function() {
            var ctx;
            finish();
            ctx = {
              project: _this.scope.projectSlug
            };
            _this.location.path(_this.navUrls.resolve("project-wiki", ctx));
            return _this.confirm.notify("success");
          };
          onError = function() {
            finish(false);
            return _this.confirm.notify("error");
          };
          return _this.repo.remove(_this.scope.wiki).then(onSuccess, onError);
        };
      })(this));
    };

    return WikiDetailController;

  })(mixOf(taiga.Controller, taiga.PageMixin));

  module.controller("WikiDetailController", WikiDetailController);

  WikiSummaryDirective = function($log, $template, $compile, $translate) {
    var link, template;
    template = $template.get("wiki/wiki-summary.html", true);
    link = function($scope, $el, $attrs, $model) {
      var render;
      render = function(wiki) {
        var ctx, html, user;
        if ($scope.usersById == null) {
          $log.error("WikiSummaryDirective requires userById set in scope.");
        } else {
          user = $scope.usersById[wiki.last_modifier];
        }
        if (user === void 0) {
          user = {
            name: "unknown",
            imgUrl: "/images/user-noimage.png"
          };
        } else {
          user = {
            name: user.full_name_display,
            imgUrl: user.photo
          };
        }
        ctx = {
          totalEditions: wiki.editions,
          lastModifiedDate: moment(wiki.modified_date).format($translate.instant("WIKI.DATETIME")),
          user: user
        };
        html = template(ctx);
        html = $compile(html)($scope);
        return $el.html(html);
      };
      $scope.$watch($attrs.ngModel, function(wikiPage) {
        if (!wikiPage) {
          return;
        }
        return render(wikiPage);
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgWikiSummary", ["$log", "$tgTemplate", "$compile", "$translate", WikiSummaryDirective]);

  EditableWikiContentDirective = function($window, $document, $repo, $confirm, $loading, $analytics, $qqueue) {
    var link;
    link = function($scope, $el, $attrs, $model) {
      var cancelEdition, disableEdition, getSelectedText, isEditable, save, switchToEditMode, switchToReadMode;
      isEditable = function() {
        return $scope.project.my_permissions.indexOf("modify_wiki_page") !== -1;
      };
      switchToEditMode = function() {
        $el.find('.edit-wiki-content').show();
        $el.find('.view-wiki-content').hide();
        return $el.find('textarea').focus();
      };
      switchToReadMode = function() {
        $el.find('.edit-wiki-content').hide();
        return $el.find('.view-wiki-content').show();
      };
      disableEdition = function() {
        $el.find(".view-wiki-content .edit").remove();
        return $el.find(".edit-wiki-content").remove();
      };
      cancelEdition = function() {
        if (!$model.$modelValue.id) {
          return;
        }
        $scope.$apply((function(_this) {
          return function() {
            return $model.$modelValue.revert();
          };
        })(this));
        return switchToReadMode();
      };
      getSelectedText = function() {
        if ($window.getSelection) {
          return $window.getSelection().toString();
        } else if ($document.selection) {
          return $document.selection.createRange().text;
        }
        return null;
      };
      save = $qqueue.bindAdd(function(wiki) {
        var onError, onSuccess, promise;
        onSuccess = function(wikiPage) {
          if (wiki.id == null) {
            $analytics.trackEvent("wikipage", "create", "create wiki page", 1);
          }
          $model.$setViewValue(wikiPage.clone());
          $confirm.notify("success");
          return switchToReadMode();
        };
        onError = function() {
          return $confirm.notify("error");
        };
        $loading.start($el.find('.save-container'));
        if (wiki.id != null) {
          promise = $repo.save(wiki).then(onSuccess, onError);
        } else {
          promise = $repo.create("wiki", wiki).then(onSuccess, onError);
        }
        return promise["finally"](function() {
          return $loading.finish($el.find('.save-container'));
        });
      });
      $el.on("click", "a", function(event) {
        var href, target;
        target = angular.element(event.target);
        href = target.attr('href');
        if (href.indexOf("#") === 0) {
          event.preventDefault();
          return $('body').scrollTop($(href).offset().top);
        }
      });
      $el.on("mousedown", ".view-wiki-content", function(event) {
        var target;
        target = angular.element(event.target);
        if (!isEditable()) {
          return;
        }
        if (event.button === 2) {

        }
      });
      $el.on("mouseup", ".view-wiki-content", function(event) {
        var target;
        target = angular.element(event.target);
        if (getSelectedText()) {
          return;
        }
        if (!isEditable()) {
          return;
        }
        if (target.is('a')) {
          return;
        }
        if (target.is('pre')) {
          return;
        }
        return switchToEditMode();
      });
      $el.on("click", ".save", debounce(2000, function() {
        return save($scope.wiki);
      }));
      $el.on("click", ".cancel", function() {
        return cancelEdition();
      });
      $el.on("keydown", "textarea", function(event) {
        if (event.keyCode === 27) {
          return cancelEdition();
        }
      });
      $scope.$watch($attrs.ngModel, function(wikiPage) {
        if (!wikiPage) {
          return;
        }
        if (isEditable()) {
          $el.addClass('editable');
          if ((wikiPage.id == null) || $.trim(wikiPage.content).length === 0) {
            return switchToEditMode();
          }
        } else {
          return disableEdition();
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel",
      templateUrl: "wiki/editable-wiki-content.html"
    };
  };

  module.directive("tgEditableWikiContent", ["$window", "$document", "$tgRepo", "$tgConfirm", "$tgLoading", "$tgAnalytics", "$tgQqueue", EditableWikiContentDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/wiki/detail.coffee
 */

(function() {
  var WikiNavDirective, bindOnce, groupBy, mixOf, module, slugify, taiga, unslugify;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  groupBy = this.taiga.groupBy;

  bindOnce = this.taiga.bindOnce;

  slugify = this.taiga.slugify;

  unslugify = this.taiga.slugify;

  module = angular.module("taigaWiki");

  WikiNavDirective = function($tgrepo, $log, $location, $confirm, $navUrls, $analytics, $loading, $template, $compile, $translate) {
    var link, template;
    template = $template.get("wiki/wiki-nav.html", true);
    link = function($scope, $el, $attrs) {
      var $ctrl, render;
      $ctrl = $el.controller();
      if ($attrs.ngModel == null) {
        return $log.error("WikiNavDirective: no ng-model attr is defined");
      }
      render = function(wikiLinks) {
        var addWikiLinkPermission, deleteWikiLinkPermission, html;
        addWikiLinkPermission = $scope.project.my_permissions.indexOf("add_wiki_link") > -1;
        deleteWikiLinkPermission = $scope.project.my_permissions.indexOf("delete_wiki_link") > -1;
        html = template({
          wikiLinks: wikiLinks,
          projectSlug: $scope.projectSlug,
          addWikiLinkPermission: addWikiLinkPermission,
          deleteWikiLinkPermission: deleteWikiLinkPermission
        });
        html = $compile(html)($scope);
        $el.off();
        $el.html(html);
        $el.on("click", ".wiki-link .link-title", function(event) {
          var linkId, linkSlug, target;
          event.preventDefault();
          target = angular.element(event.currentTarget);
          linkId = target.parents('.wiki-link').data('id');
          linkSlug = $scope.wikiLinks[linkId].href;
          return $scope.$apply(function() {
            var ctx;
            ctx = {
              project: $scope.projectSlug,
              slug: linkSlug
            };
            return $location.path($navUrls.resolve("project-wiki-page", ctx));
          });
        });
        $el.on("click", ".add-button", function(event) {
          event.preventDefault();
          $el.find(".new").removeClass("hidden");
          $el.find(".new input").focus();
          return $el.find(".add-button").hide();
        });
        $el.on("click", ".wiki-link .icon-delete", function(event) {
          var linkId, message, target, title;
          event.preventDefault();
          event.stopPropagation();
          target = angular.element(event.currentTarget);
          linkId = target.parents('.wiki-link').data('id');
          title = $translate.instant("WIKI.DELETE_LIGHTBOX_TITLE");
          message = $scope.wikiLinks[linkId].title;
          return $confirm.askOnDelete(title, message).then((function(_this) {
            return function(finish) {
              var promise;
              promise = $tgrepo.remove($scope.wikiLinks[linkId]);
              promise.then(function() {
                promise = $ctrl.loadWikiLinks();
                promise.then(function() {
                  finish();
                  return render($scope.wikiLinks);
                });
                return promise.then(null, function() {
                  return finish();
                });
              });
              return promise.then(null, function() {
                finish(false);
                return $confirm.notify("error");
              });
            };
          })(this));
        });
        return $el.on("keyup", ".new input", function(event) {
          var newLink, promise, target;
          event.preventDefault();
          if (event.keyCode === 13) {
            target = angular.element(event.currentTarget);
            newLink = target.val();
            $loading.start($el.find(".new"));
            promise = $tgrepo.create("wiki-links", {
              project: $scope.projectId,
              title: newLink,
              href: slugify(newLink)
            });
            promise.then(function() {
              var loadPromise;
              $analytics.trackEvent("wikilink", "create", "create wiki link", 1);
              loadPromise = $ctrl.loadWikiLinks();
              loadPromise.then(function() {
                $loading.finish($el.find(".new"));
                $el.find(".new").addClass("hidden");
                $el.find(".new input").val('');
                $el.find(".add-button").show();
                return render($scope.wikiLinks);
              });
              return loadPromise.then(null, function() {
                $loading.finish($el.find(".new"));
                $el.find(".new").addClass("hidden");
                $el.find(".new input").val('');
                $el.find(".add-button").show();
                return $confirm.notify("error", "Error loading wiki links");
              });
            });
            return promise.then(null, function(error) {
              var ref;
              $loading.finish($el.find(".new"));
              $el.find(".new input").val(newLink);
              $el.find(".new input").focus().select();
              if ((error != null ? (ref = error.__all__) != null ? ref[0] : void 0 : void 0) != null) {
                return $confirm.notify("error", "The link already exists");
              } else {
                return $confirm.notify("error");
              }
            });
          } else if (event.keyCode === 27) {
            target = angular.element(event.currentTarget);
            $el.find(".new").addClass("hidden");
            $el.find(".new input").val('');
            return $el.find(".add-button").show();
          }
        });
      };
      return bindOnce($scope, $attrs.ngModel, render);
    };
    return {
      link: link
    };
  };

  module.directive("tgWikiNav", ["$tgRepo", "$log", "$tgLocation", "$tgConfirm", "$tgNavUrls", "$tgAnalytics", "$tgLoading", "$tgTemplate", "$compile", "$translate", WikiNavDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/admin/lightboxes.coffee
 */

(function() {
  var CreateMembersDirective, MAX_MEMBERSHIP_FIELDSETS, debounce, module, taiga;

  taiga = this.taiga;

  debounce = this.taiga.debounce;

  module = angular.module("taigaKanban");

  MAX_MEMBERSHIP_FIELDSETS = 4;

  CreateMembersDirective = function($rs, $rootScope, $confirm, $loading, lightboxService, $compile) {
    var extraTextTemplate, link, template;
    extraTextTemplate = "<fieldset class=\"extra-text\">\n    <textarea ng-attr-placeholder=\"{{'LIGHTBOX.CREATE_MEMBER.PLACEHOLDER_INVITATION_TEXT' | translate}}\"\n              maxlength=\"255\"></textarea>\n</fieldset>";
    template = _.template("<div class=\"add-member-wrapper\">\n    <fieldset>\n        <input type=\"email\" placeholder=\"{{'LIGHTBOX.CREATE_MEMBER.PLACEHOLDER_TYPE_EMAIL' | translate}}\"\n               <% if(required) { %> data-required=\"true\" <% } %> data-type=\"email\" />\n    </fieldset>\n    <fieldset>\n        <select <% if(required) { %> data-required=\"true\" <% } %> data-required=\"true\">\n            <% _.each(roleList, function(role) { %>\n            <option value=\"<%- role.id %>\"><%- role.name %></option>\n            <% }); %>\n        </select>\n        <a class=\"icon icon-plus add-fieldset\" href=\"\"></a>\n    </fieldset>\n</div>");
    link = function($scope, $el, $attrs) {
      var createFieldSet, resetForm, submit, submitButton;
      createFieldSet = function(required) {
        var ctx;
        if (required == null) {
          required = true;
        }
        ctx = {
          roleList: $scope.project.roles,
          required: required
        };
        return $compile(template(ctx))($scope);
      };
      resetForm = function() {
        var fieldSet, invitations;
        $el.find("form textarea").remove();
        $el.find("form .add-member-wrapper").remove();
        invitations = $el.find(".add-member-forms");
        invitations.html($compile(extraTextTemplate)($scope));
        fieldSet = createFieldSet();
        return invitations.prepend(fieldSet);
      };
      $scope.$on("membersform:new", function() {
        resetForm();
        return lightboxService.open($el);
      });
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      $el.on("click", ".delete-fieldset", function(event) {
        var fieldSet, lastActionButton, target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        fieldSet = target.closest('.add-member-wrapper');
        fieldSet.remove();
        lastActionButton = $el.find(".add-member-wrapper fieldset:last > a");
        if (lastActionButton.hasClass("icon-delete delete-fieldset")) {
          return lastActionButton.removeClass("icon-delete delete-fieldset").addClass("icon-plus add-fieldset");
        }
      });
      $el.on("click", ".add-fieldset", function(event) {
        var fieldSet, newFieldSet, target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        fieldSet = target.closest('.add-member-wrapper');
        target.removeClass("icon-plus add-fieldset").addClass("icon-delete delete-fieldset");
        newFieldSet = createFieldSet(false);
        fieldSet.after(newFieldSet);
        $scope.$digest();
        if ($el.find(".add-member-wrapper").length === MAX_MEMBERSHIP_FIELDSETS) {
          return $el.find(".add-member-wrapper fieldset:last > a").removeClass("icon-plus add-fieldset").addClass("icon-delete delete-fieldset");
        }
      });
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var form, invitation_extra_text, invitations, memberWrappers, onError, onSuccess, promise;
          event.preventDefault();
          $loading.start(submitButton);
          onSuccess = function(data) {
            $loading.finish(submitButton);
            lightboxService.close($el);
            $confirm.notify("success");
            return $rootScope.$broadcast("membersform:new:success");
          };
          onError = function(data) {
            $loading.finish(submitButton);
            lightboxService.close($el);
            $confirm.notify("error");
            return $rootScope.$broadcast("membersform:new:error");
          };
          form = $el.find("form").checksley();
          form.destroy();
          form.initialize();
          if (!form.validate()) {
            return;
          }
          memberWrappers = $el.find("form .add-member-wrapper");
          memberWrappers = _.filter(memberWrappers, function(mw) {
            return angular.element(mw).find("input").hasClass('checksley-ok');
          });
          invitations = _.map(memberWrappers, function(mw) {
            var email, memberWrapper, role;
            memberWrapper = angular.element(mw);
            email = memberWrapper.find("input");
            role = memberWrapper.find("select");
            return {
              email: email.val(),
              role_id: role.val()
            };
          });
          if (invitations.length) {
            invitation_extra_text = $el.find("form textarea").val();
            promise = $rs.memberships.bulkCreateMemberships($scope.project.id, invitations, invitation_extra_text);
            return promise.then(onSuccess, onError);
          }
        };
      })(this));
      submitButton = $el.find(".submit-button");
      return $el.on("submit", "form", submit);
    };
    return {
      link: link
    };
  };

  module.directive("tgLbCreateMembers", ["$tgResources", "$rootScope", "$tgConfirm", "$tgLoading", "lightboxService", "$compile", CreateMembersDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/admin/memberships.coffee
 */

(function() {
  var MembershipsController, MembershipsDirective, MembershipsRowActionsDirective, MembershipsRowAdminCheckboxDirective, MembershipsRowAvatarDirective, MembershipsRowRoleSelectorDirective, bindMethods, mixOf, module, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  bindMethods = this.taiga.bindMethods;

  module = angular.module("taigaAdmin");

  MembershipsController = (function(superClass) {
    extend(MembershipsController, superClass);

    MembershipsController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgConfirm", "$tgResources", "$routeParams", "$q", "$tgLocation", "$tgNavUrls", "$tgAnalytics", "tgAppMetaService", "$translate"];

    function MembershipsController(scope, rootscope, repo, confirm, rs, params, q, location, navUrls, analytics, appMetaService, translate) {
      var promise;
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs;
      this.params = params;
      this.q = q;
      this.location = location;
      this.navUrls = navUrls;
      this.analytics = analytics;
      this.appMetaService = appMetaService;
      this.translate = translate;
      bindMethods(this);
      this.scope.project = {};
      this.scope.filters = {};
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          var description, title;
          title = _this.translate.instant("ADMIN.MEMBERSHIPS.PAGE_TITLE", {
            projectName: _this.scope.project.name
          });
          description = _this.scope.project.description;
          return _this.appMetaService.setAll(title, description);
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
      this.scope.$on("membersform:new:success", (function(_this) {
        return function() {
          _this.loadMembers();
          return _this.analytics.trackEvent("membership", "create", "create memberships on admin", 1);
        };
      })(this));
    }

    MembershipsController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          if (!project.i_am_owner) {
            _this.location.path(_this.navUrls.resolve("permission-denied"));
          }
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.$emit('project:loaded', project);
          return project;
        };
      })(this));
    };

    MembershipsController.prototype.loadMembers = function() {
      var httpFilters;
      httpFilters = this.getUrlFilters();
      return this.rs.memberships.list(this.scope.projectId, httpFilters).then((function(_this) {
        return function(data) {
          _this.scope.memberships = _.filter(data.models, function(membership) {
            return membership.user === null || membership.is_user_active;
          });
          _this.scope.page = data.current;
          _this.scope.count = data.count;
          _this.scope.paginatedBy = data.paginatedBy;
          return data;
        };
      })(this));
    };

    MembershipsController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      promise.then((function(_this) {
        return function() {
          return _this.loadMembers();
        };
      })(this));
      return promise;
    };

    MembershipsController.prototype.getUrlFilters = function() {
      var filters;
      filters = _.pick(this.location.search(), "page");
      if (!filters.page) {
        filters.page = 1;
      }
      return filters;
    };

    MembershipsController.prototype.addNewMembers = function() {
      return this.rootscope.$broadcast("membersform:new");
    };

    return MembershipsController;

  })(mixOf(taiga.Controller, taiga.PageMixin, taiga.FiltersMixin));

  module.controller("MembershipsController", MembershipsController);

  MembershipsDirective = function($template) {
    var link, linkPagination, template;
    template = $template.get("admin/admin-membership-paginator.html", true);
    linkPagination = function($scope, $el, $attrs, $ctrl) {
      var $pagEl, afterCurrent, atBegin, atEnd, beforeCurrent, getNumPages, renderPagination;
      afterCurrent = 2;
      beforeCurrent = 4;
      atBegin = 2;
      atEnd = 2;
      $pagEl = $el.find(".memberships-paginator");
      getNumPages = function() {
        var numPages;
        numPages = $scope.count / $scope.paginatedBy;
        if (parseInt(numPages, 10) < numPages) {
          numPages = parseInt(numPages, 10) + 1;
        } else {
          numPages = parseInt(numPages, 10);
        }
        return numPages;
      };
      renderPagination = function() {
        var cpage, i, j, numPages, options, pages, ref;
        numPages = getNumPages();
        if (numPages <= 1) {
          $pagEl.hide();
          return;
        }
        pages = [];
        options = {};
        options.pages = pages;
        options.showPrevious = $scope.page > 1;
        options.showNext = !($scope.page === numPages);
        cpage = $scope.page;
        for (i = j = 1, ref = numPages; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          if (i === (cpage + afterCurrent) && numPages > (cpage + afterCurrent + atEnd)) {
            pages.push({
              classes: "dots",
              type: "dots"
            });
          } else if (i === (cpage - beforeCurrent) && cpage > (atBegin + beforeCurrent)) {
            pages.push({
              classes: "dots",
              type: "dots"
            });
          } else if (i > (cpage + afterCurrent) && i <= (numPages - atEnd)) {

          } else if (i < (cpage - beforeCurrent) && i > atBegin) {

          } else if (i === cpage) {
            pages.push({
              classes: "active",
              num: i,
              type: "page-active"
            });
          } else {
            pages.push({
              classes: "page",
              num: i,
              type: "page"
            });
          }
        }
        return $pagEl.html(template(options));
      };
      $scope.$watch("memberships", function(value) {
        if (!value) {
          return;
        }
        return renderPagination();
      });
      $el.on("click", ".memberships-paginator a.next", function(event) {
        event.preventDefault();
        return $scope.$apply(function() {
          $ctrl.selectFilter("page", $scope.page + 1);
          return $ctrl.loadMembers();
        });
      });
      $el.on("click", ".memberships-paginator a.previous", function(event) {
        event.preventDefault();
        return $scope.$apply(function() {
          $ctrl.selectFilter("page", $scope.page - 1);
          return $ctrl.loadMembers();
        });
      });
      return $el.on("click", ".memberships-paginator li.page > a", function(event) {
        var pagenum, target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        pagenum = target.data("pagenum");
        return $scope.$apply(function() {
          $ctrl.selectFilter("page", pagenum);
          return $ctrl.loadMembers();
        });
      });
    };
    link = function($scope, $el, $attrs) {
      var $ctrl;
      $ctrl = $el.controller();
      linkPagination($scope, $el, $attrs, $ctrl);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgMemberships", ["$tgTemplate", MembershipsDirective]);

  MembershipsRowAvatarDirective = function($log, $template) {
    var link, template;
    template = $template.get("admin/memberships-row-avatar.html", true);
    link = function($scope, $el, $attrs) {
      var member, render;
      render = function(member) {
        var ctx, html;
        ctx = {
          full_name: member.full_name ? member.full_name : "",
          email: member.user_email ? member.user_email : member.email,
          imgurl: member.photo ? member.photo : "/images/unnamed.png"
        };
        html = template(ctx);
        return $el.html(html);
      };
      if ($attrs.tgMembershipsRowAvatar == null) {
        return $log.error("MembershipsRowAvatarDirective: the directive need a member");
      }
      member = $scope.$eval($attrs.tgMembershipsRowAvatar);
      render(member);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgMembershipsRowAvatar", ["$log", "$tgTemplate", MembershipsRowAvatarDirective]);

  MembershipsRowAdminCheckboxDirective = function($log, $repo, $confirm, $template, $compile) {
    var link, template;
    template = $template.get("admin/admin-memberships-row-checkbox.html", true);
    link = function($scope, $el, $attrs) {
      var html, member, render;
      render = function(member) {
        var ctx, html;
        ctx = {
          inputId: "is-admin-" + member.id
        };
        html = template(ctx);
        html = $compile(html)($scope);
        return $el.html(html);
      };
      if ($attrs.tgMembershipsRowAdminCheckbox == null) {
        return $log.error("MembershipsRowAdminCheckboxDirective: the directive need a member");
      }
      member = $scope.$eval($attrs.tgMembershipsRowAdminCheckbox);
      html = render(member);
      if (member.is_owner) {
        $el.find(":checkbox").prop("checked", true);
      }
      $el.on("click", ":checkbox", (function(_this) {
        return function(event) {
          var onError, onSuccess, target;
          onSuccess = function() {
            return $confirm.notify("success");
          };
          onError = function(data) {
            member.revert();
            $el.find(":checkbox").prop("checked", member.is_owner);
            return $confirm.notify("error", data.is_owner[0]);
          };
          target = angular.element(event.currentTarget);
          member.is_owner = target.prop("checked");
          return $repo.save(member).then(onSuccess, onError);
        };
      })(this));
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgMembershipsRowAdminCheckbox", ["$log", "$tgRepo", "$tgConfirm", "$tgTemplate", "$compile", MembershipsRowAdminCheckboxDirective]);

  MembershipsRowRoleSelectorDirective = function($log, $repo, $confirm) {
    var link, template;
    template = _.template("<select>\n    <% _.each(roleList, function(role) { %>\n    <option value=\"<%- role.id %>\" <% if(selectedRole === role.id){ %>selected=\"selected\"<% } %>>\n        <%- role.name %>\n    </option>\n    <% }); %>\n</select>");
    link = function($scope, $el, $attrs) {
      var $ctrl, html, member, render;
      render = function(member) {
        var ctx, html;
        ctx = {
          roleList: $scope.project.roles,
          selectedRole: member.role
        };
        html = template(ctx);
        return $el.html(html);
      };
      if ($attrs.tgMembershipsRowRoleSelector == null) {
        return $log.error("MembershipsRowRoleSelectorDirective: the directive need a member");
      }
      $ctrl = $el.controller();
      member = $scope.$eval($attrs.tgMembershipsRowRoleSelector);
      html = render(member);
      $el.on("change", "select", (function(_this) {
        return function(event) {
          var newRole, onError, onSuccess, target;
          onSuccess = function() {
            return $confirm.notify("success");
          };
          onError = function() {
            return $confirm.notify("error");
          };
          target = angular.element(event.currentTarget);
          newRole = parseInt(target.val(), 10);
          if (member.role !== newRole) {
            member.role = newRole;
            return $repo.save(member).then(onSuccess, onError);
          }
        };
      })(this));
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgMembershipsRowRoleSelector", ["$log", "$tgRepo", "$tgConfirm", MembershipsRowRoleSelectorDirective]);

  MembershipsRowActionsDirective = function($log, $repo, $rs, $confirm, $compile, $translate) {
    var activedTemplate, link, pendingTemplate;
    activedTemplate = "<div class=\"active\", translate=\"ADMIN.MEMBERSHIP.STATUS_ACTIVE\">\n</div>\n<a class=\"delete\" href=\"\">\n    <span class=\"icon icon-delete\"></span>\n</a>";
    pendingTemplate = "<a class=\"pending\" href=\"\">\n    {{'ADMIN.MEMBERSHIP.STATUS_PENDING' | translate}}\n    <span class=\"icon icon-reload\"></span>\n</a>\n<a class=\"delete\" href=\"\">\n    <span class=\"icon icon-delete\"></span>\n</a>";
    link = function($scope, $el, $attrs) {
      var $ctrl, member, render;
      render = function(member) {
        var html;
        if (member.user) {
          html = $compile(activedTemplate)($scope);
        } else {
          html = $compile(pendingTemplate)($scope);
        }
        return $el.html(html);
      };
      if ($attrs.tgMembershipsRowActions == null) {
        return $log.error("MembershipsRowActionsDirective: the directive need a member");
      }
      $ctrl = $el.controller();
      member = $scope.$eval($attrs.tgMembershipsRowActions);
      render(member);
      $el.on("click", ".pending", function(event) {
        var onError, onSuccess;
        event.preventDefault();
        onSuccess = function() {
          var text;
          text = $translate.instant("ADMIN.MEMBERSHIP.SUCCESS_SEND_INVITATION", {
            email: $scope.member.email
          });
          return $confirm.notify("success", text);
        };
        onError = function() {
          var text;
          text = $translate.instant("ADMIM.MEMBERSHIP.ERROR_SEND_INVITATION");
          return $confirm.notify("error", text);
        };
        return $rs.memberships.resendInvitation($scope.member.id).then(onSuccess, onError);
      });
      $el.on("click", ".delete", function(event) {
        var defaultMsg, message, title;
        event.preventDefault();
        title = $translate.instant("ADMIN.MEMBERSHIP.DELETE_MEMBER");
        defaultMsg = $translate.instant("ADMIN.MEMBERSHIP.DEFAULT_DELETE_MESSAGE");
        message = member.user ? member.full_name : defaultMsg;
        return $confirm.askOnDelete(title, message).then(function(finish) {
          var onError, onSuccess;
          onSuccess = function() {
            var text;
            finish();
            $ctrl.loadMembers();
            text = $translate.instant("ADMIN.MEMBERSHIP.SUCCESS_DELETE");
            return $confirm.notify("success", null, text);
          };
          onError = function() {
            var text;
            finish(false);
            text = $translate.instant("ADMIN.MEMBERSHIP.ERROR_DELETE", {
              message: message
            });
            return $confirm.notify("error", null, text);
          };
          return $repo.remove(member).then(onSuccess, onError);
        });
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgMembershipsRowActions", ["$log", "$tgRepo", "$tgResources", "$tgConfirm", "$compile", "$translate", MembershipsRowActionsDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/admin/nav.coffee
 */

(function() {
  var AdminNavigationDirective, module;

  AdminNavigationDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      var section;
      section = $attrs.tgAdminNavigation;
      $el.find(".active").removeClass("active");
      $el.find("#adminmenu-" + section + " a").addClass("active");
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module = angular.module("taigaAdmin");

  module.directive("tgAdminNavigation", AdminNavigationDirective);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/admin/project-profile.coffee
 */

(function() {
  var CsvExporterController, CsvExporterIssuesController, CsvExporterTasksController, CsvExporterUserstoriesController, CsvIssueDirective, CsvTaskDirective, CsvUsDirective, ProjectDefaultValuesDirective, ProjectExportDirective, ProjectModulesDirective, ProjectProfileController, ProjectProfileDirective, bindOnce, debounce, groupBy, joinStr, mixOf, module, taiga, toString, trim,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  trim = this.taiga.trim;

  toString = this.taiga.toString;

  joinStr = this.taiga.joinStr;

  groupBy = this.taiga.groupBy;

  bindOnce = this.taiga.bindOnce;

  debounce = this.taiga.debounce;

  module = angular.module("taigaAdmin");

  ProjectProfileController = (function(superClass) {
    extend(ProjectProfileController, superClass);

    ProjectProfileController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgConfirm", "$tgResources", "$routeParams", "$q", "$tgLocation", "$tgNavUrls", "tgAppMetaService", "$translate"];

    function ProjectProfileController(scope, rootscope, repo, confirm, rs, params, q, location, navUrls, appMetaService, translate) {
      var promise;
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs;
      this.params = params;
      this.q = q;
      this.location = location;
      this.navUrls = navUrls;
      this.appMetaService = appMetaService;
      this.translate = translate;
      this.scope.project = {};
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          var description, sectionName, title;
          sectionName = _this.translate.instant(_this.scope.sectionName);
          title = _this.translate.instant("ADMIN.PROJECT_PROFILE.PAGE_TITLE", {
            sectionName: sectionName,
            projectName: _this.scope.project.name
          });
          description = _this.scope.project.description;
          return _this.appMetaService.setAll(title, description);
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
      this.scope.$on("project:loaded", (function(_this) {
        return function() {
          var description, sectionName, title;
          sectionName = _this.translate.instant(_this.scope.sectionName);
          title = _this.translate.instant("ADMIN.PROJECT_PROFILE.PAGE_TITLE", {
            sectionName: sectionName,
            projectName: _this.scope.project.name
          });
          description = _this.scope.project.description;
          return _this.appMetaService.setAll(title, description);
        };
      })(this));
    }

    ProjectProfileController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          if (!project.i_am_owner) {
            _this.location.path(_this.navUrls.resolve("permission-denied"));
          }
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.pointsList = _.sortBy(project.points, "order");
          _this.scope.usStatusList = _.sortBy(project.us_statuses, "order");
          _this.scope.taskStatusList = _.sortBy(project.task_statuses, "order");
          _this.scope.prioritiesList = _.sortBy(project.priorities, "order");
          _this.scope.severitiesList = _.sortBy(project.severities, "order");
          _this.scope.issueTypesList = _.sortBy(project.issue_types, "order");
          _this.scope.issueStatusList = _.sortBy(project.issue_statuses, "order");
          _this.scope.$emit('project:loaded', project);
          return project;
        };
      })(this));
    };

    ProjectProfileController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      return promise;
    };

    ProjectProfileController.prototype.openDeleteLightbox = function() {
      return this.rootscope.$broadcast("deletelightbox:new", this.scope.project);
    };

    return ProjectProfileController;

  })(mixOf(taiga.Controller, taiga.PageMixin));

  module.controller("ProjectProfileController", ProjectProfileController);

  ProjectProfileDirective = function($repo, $confirm, $loading, $navurls, $location, projectService, currentUserService) {
    var link;
    link = function($scope, $el, $attrs) {
      var $ctrl, form, submit, submitButton;
      $ctrl = $el.controller();
      form = $el.find("form").checksley({
        "onlyOneErrorElement": true
      });
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var promise;
          event.preventDefault();
          if (!form.validate()) {
            return;
          }
          $loading.start(submitButton);
          promise = $repo.save($scope.project);
          promise.then(function() {
            var newUrl;
            $loading.finish(submitButton);
            $confirm.notify("success");
            newUrl = $navurls.resolve("project-admin-project-profile-details", {
              project: $scope.project.slug
            });
            $location.path(newUrl);
            $ctrl.loadInitialData();
            projectService.fetchProject();
            return currentUserService.loadProjects();
          });
          return promise.then(null, function(data) {
            $loading.finish(submitButton);
            form.setErrors(data);
            if (data._error_message) {
              return $confirm.notify("error", data._error_message);
            }
          });
        };
      })(this));
      submitButton = $el.find(".submit-button");
      return $el.on("submit", "form", submit);
    };
    return {
      link: link
    };
  };

  module.directive("tgProjectProfile", ["$tgRepo", "$tgConfirm", "$tgLoading", "$tgNavUrls", "$tgLocation", "tgProjectService", "tgCurrentUserService", ProjectProfileDirective]);

  ProjectDefaultValuesDirective = function($repo, $confirm, $loading) {
    var link;
    link = function($scope, $el, $attrs) {
      var form, submit, submitButton;
      form = $el.find("form").checksley({
        "onlyOneErrorElement": true
      });
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var promise;
          event.preventDefault();
          if (!form.validate()) {
            return;
          }
          $loading.start(submitButton);
          promise = $repo.save($scope.project);
          promise.then(function() {
            $loading.finish(submitButton);
            return $confirm.notify("success");
          });
          return promise.then(null, function(data) {
            $loading.finish(target);
            form.setErrors(data);
            if (data._error_message) {
              return $confirm.notify("error", data._error_message);
            }
          });
        };
      })(this));
      submitButton = $el.find(".submit-button");
      $el.on("submit", "form", submit);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgProjectDefaultValues", ["$tgRepo", "$tgConfirm", "$tgLoading", ProjectDefaultValuesDirective]);

  ProjectModulesDirective = function($repo, $confirm, $loading, projectService) {
    var link;
    link = function($scope, $el, $attrs) {
      var submit;
      submit = (function(_this) {
        return function() {
          var form, promise, target;
          form = $el.find("form").checksley();
          if (!form.validate()) {
            return;
          }
          target = angular.element(".admin-functionalities a.button-green");
          $loading.start(target);
          promise = $repo.save($scope.project);
          promise.then(function() {
            $loading.finish(target);
            $confirm.notify("success");
            $scope.$emit("project:loaded", $scope.project);
            return projectService.fetchProject();
          });
          return promise.then(null, function(data) {
            $loading.finish(target);
            return $confirm.notify("error", data._error_message);
          });
        };
      })(this);
      $el.on("submit", "form", function(event) {
        event.preventDefault();
        return submit();
      });
      $el.on("click", ".admin-functionalities a.button-green", function(event) {
        event.preventDefault();
        return submit();
      });
      $scope.$watch("isVideoconferenceActivated", function(isVideoconferenceActivated) {
        if (isVideoconferenceActivated) {
          return $el.find(".videoconference-attributes").removeClass("hidden");
        } else {
          $el.find(".videoconference-attributes").addClass("hidden");
          $scope.project.videoconferences = null;
          return $scope.project.videoconferences_extra_data = "";
        }
      });
      return $scope.$watch("project", function(project) {
        if (project.videoconferences != null) {
          return $scope.isVideoconferenceActivated = true;
        } else {
          return $scope.isVideoconferenceActivated = false;
        }
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgProjectModules", ["$tgRepo", "$tgConfirm", "$tgLoading", "tgProjectService", ProjectModulesDirective]);

  ProjectExportDirective = function($window, $rs, $confirm, $translate) {
    var link;
    link = function($scope, $el, $attrs) {
      var asyn_message, buttonsEl, dump_ready_text, hideButtons, hideResult, hideSpinner, loading_msg, loading_title, resultEl, resultMessageEl, resultTitleEl, setAsyncMessage, setAsyncTitle, setLoadingMessage, setLoadingTitle, setSyncMessage, setSyncTitle, showButtons, showErrorMode, showExportResultAsyncMode, showExportResultSyncMode, showLoadingMode, showResult, showSpinner, spinnerEl, syn_message;
      buttonsEl = $el.find(".admin-project-export-buttons");
      showButtons = function() {
        return buttonsEl.removeClass("hidden");
      };
      hideButtons = function() {
        return buttonsEl.addClass("hidden");
      };
      resultEl = $el.find(".admin-project-export-result");
      showResult = function() {
        return resultEl.removeClass("hidden");
      };
      hideResult = function() {
        return resultEl.addClass("hidden");
      };
      spinnerEl = $el.find(".spin");
      showSpinner = function() {
        return spinnerEl.removeClass("hidden");
      };
      hideSpinner = function() {
        return spinnerEl.addClass("hidden");
      };
      resultTitleEl = $el.find(".result-title");
      loading_title = $translate.instant("ADMIN.PROJECT_EXPORT.LOADING_TITLE");
      loading_msg = $translate.instant("ADMIN.PROJECT_EXPORT.LOADING_MESSAGE");
      dump_ready_text = function() {
        return resultTitleEl.html($translate.instant("ADMIN.PROJECT_EXPORT.DUMP_READY"));
      };
      asyn_message = function() {
        return resultTitleEl.html($translate.instant("ADMIN.PROJECT_EXPORT.ASYNC_MESSAGE"));
      };
      syn_message = function(url) {
        return resultTitleEl.html($translate.instant("ADMIN.PROJECT_EXPORT.SYNC_MESSAGE", {
          url: url
        }));
      };
      setLoadingTitle = function() {
        return resultTitleEl.html(loading_title);
      };
      setAsyncTitle = function() {
        return resultTitleEl.html(loading_msg);
      };
      setSyncTitle = function() {
        return resultTitleEl.html(dump_ready_text);
      };
      resultMessageEl = $el.find(".result-message ");
      setLoadingMessage = function() {
        return resultMessageEl.html(loading_msg);
      };
      setAsyncMessage = function() {
        return resultMessageEl.html(asyn_message);
      };
      setSyncMessage = function(url) {
        return resultMessageEl.html(syn_message(url));
      };
      showLoadingMode = function() {
        showSpinner();
        setLoadingTitle();
        setLoadingMessage();
        hideButtons();
        return showResult();
      };
      showExportResultAsyncMode = function() {
        hideSpinner();
        setAsyncTitle();
        return setAsyncMessage();
      };
      showExportResultSyncMode = function(url) {
        hideSpinner();
        setSyncTitle();
        return setSyncMessage(url);
      };
      showErrorMode = function() {
        hideSpinner();
        hideResult();
        return showButtons();
      };
      return $el.on("click", "a.button-export", debounce(2000, (function(_this) {
        return function(event) {
          var onError, onSuccess;
          event.preventDefault();
          onSuccess = function(result) {
            var dumpUrl;
            if (result.status === 202) {
              return showExportResultAsyncMode();
            } else {
              dumpUrl = result.data.url;
              showExportResultSyncMode(dumpUrl);
              return $window.open(dumpUrl, "_blank");
            }
          };
          onError = function(result) {
            var errorMsg, ref;
            showErrorMode();
            errorMsg = $translate.instant("ADMIN.PROJECT_EXPORT.ERROR");
            if (result.status === 429) {
              errorMsg = $translate.instant("ADMIN.PROJECT_EXPORT.ERROR_BUSY");
            } else if ((ref = result.data) != null ? ref._error_message : void 0) {
              errorMsg = $translate.instant("ADMIN.PROJECT_EXPORT.ERROR_BUSY", {
                message: result.data._error_message
              });
            }
            return $confirm.notify("error", errorMsg);
          };
          showLoadingMode();
          return $rs.projects["export"]($scope.projectId).then(onSuccess, onError);
        };
      })(this)));
    };
    return {
      link: link
    };
  };

  module.directive("tgProjectExport", ["$window", "$tgResources", "$tgConfirm", "$translate", ProjectExportDirective]);

  CsvExporterController = (function(superClass) {
    extend(CsvExporterController, superClass);

    CsvExporterController.$inject = ["$scope", "$rootScope", "$tgUrls", "$tgConfirm", "$tgResources", "$translate"];

    function CsvExporterController(scope, rootscope, urls, confirm, rs, translate) {
      this.scope = scope;
      this.rootscope = rootscope;
      this.urls = urls;
      this.confirm = confirm;
      this.rs = rs;
      this.translate = translate;
      this._generateUuid = bind(this._generateUuid, this);
      this.setCsvUuid = bind(this.setCsvUuid, this);
      this.rootscope.$on("project:loaded", this.setCsvUuid);
      this.scope.$watch("csvUuid", (function(_this) {
        return function(value) {
          if (value) {
            return _this.scope.csvUrl = _this.urls.resolveAbsolute(_this.type + "-csv", value);
          } else {
            return _this.scope.csvUrl = "";
          }
        };
      })(this));
    }

    CsvExporterController.prototype.setCsvUuid = function() {
      return this.scope.csvUuid = this.scope.project[this.type + "_csv_uuid"];
    };

    CsvExporterController.prototype._generateUuid = function(finish) {
      var promise;
      promise = this.rs.projects["regenerate_" + this.type + "_csv_uuid"](this.scope.projectId);
      promise.then((function(_this) {
        return function(data) {
          var ref;
          return _this.scope.csvUuid = (ref = data.data) != null ? ref.uuid : void 0;
        };
      })(this));
      promise.then(null, (function(_this) {
        return function() {
          return _this.confirm.notify("error");
        };
      })(this));
      promise["finally"](function() {
        return finish();
      });
      return promise;
    };

    CsvExporterController.prototype.regenerateUuid = function() {
      var subtitle, title;
      if (this.scope.csvUuid) {
        title = this.translate.instant("ADMIN.REPORTS.REGENERATE_TITLE");
        subtitle = this.translate.instant("ADMIN.REPORTS.REGENERATE_SUBTITLE");
        return this.confirm.ask(title, subtitle).then(this._generateUuid);
      } else {
        return this._generateUuid(_.identity);
      }
    };

    return CsvExporterController;

  })(taiga.Controller);

  CsvExporterUserstoriesController = (function(superClass) {
    extend(CsvExporterUserstoriesController, superClass);

    function CsvExporterUserstoriesController() {
      return CsvExporterUserstoriesController.__super__.constructor.apply(this, arguments);
    }

    CsvExporterUserstoriesController.prototype.type = "userstories";

    return CsvExporterUserstoriesController;

  })(CsvExporterController);

  CsvExporterTasksController = (function(superClass) {
    extend(CsvExporterTasksController, superClass);

    function CsvExporterTasksController() {
      return CsvExporterTasksController.__super__.constructor.apply(this, arguments);
    }

    CsvExporterTasksController.prototype.type = "tasks";

    return CsvExporterTasksController;

  })(CsvExporterController);

  CsvExporterIssuesController = (function(superClass) {
    extend(CsvExporterIssuesController, superClass);

    function CsvExporterIssuesController() {
      return CsvExporterIssuesController.__super__.constructor.apply(this, arguments);
    }

    CsvExporterIssuesController.prototype.type = "issues";

    return CsvExporterIssuesController;

  })(CsvExporterController);

  module.controller("CsvExporterUserstoriesController", CsvExporterUserstoriesController);

  module.controller("CsvExporterTasksController", CsvExporterTasksController);

  module.controller("CsvExporterIssuesController", CsvExporterIssuesController);

  CsvUsDirective = function($translate) {
    var link;
    link = function($scope) {
      return $scope.sectionTitle = "ADMIN.CSV.SECTION_TITLE_US";
    };
    return {
      controller: "CsvExporterUserstoriesController",
      controllerAs: "ctrl",
      templateUrl: "admin/project-csv.html",
      link: link,
      scope: true
    };
  };

  module.directive("tgCsvUs", ["$translate", CsvUsDirective]);

  CsvTaskDirective = function($translate) {
    var link;
    link = function($scope) {
      return $scope.sectionTitle = "ADMIN.CSV.SECTION_TITLE_TASK";
    };
    return {
      controller: "CsvExporterTasksController",
      controllerAs: "ctrl",
      templateUrl: "admin/project-csv.html",
      link: link,
      scope: true
    };
  };

  module.directive("tgCsvTask", ["$translate", CsvTaskDirective]);

  CsvIssueDirective = function($translate) {
    var link;
    link = function($scope) {
      return $scope.sectionTitle = "ADMIN.CSV.SECTION_TITLE_ISSUE";
    };
    return {
      controller: "CsvExporterIssuesController",
      controllerAs: "ctrl",
      templateUrl: "admin/project-csv.html",
      link: link,
      scope: true
    };
  };

  module.directive("tgCsvIssue", ["$translate", CsvIssueDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/admin/project-profile.coffee
 */

(function() {
  var ColorSelectionDirective, ProjectCustomAttributesController, ProjectCustomAttributesDirective, ProjectValuesController, ProjectValuesDirective, ProjectValuesSectionController, bindOnce, debounce, groupBy, joinStr, mixOf, module, taiga, toString, trim,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  trim = this.taiga.trim;

  toString = this.taiga.toString;

  joinStr = this.taiga.joinStr;

  groupBy = this.taiga.groupBy;

  bindOnce = this.taiga.bindOnce;

  debounce = this.taiga.debounce;

  module = angular.module("taigaAdmin");

  ProjectValuesSectionController = (function(superClass) {
    extend(ProjectValuesSectionController, superClass);

    ProjectValuesSectionController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgConfirm", "$tgResources", "$routeParams", "$q", "$tgLocation", "$tgNavUrls", "tgAppMetaService", "$translate"];

    function ProjectValuesSectionController(scope, rootscope, repo, confirm, rs, params, q, location, navUrls, appMetaService, translate) {
      var promise;
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs;
      this.params = params;
      this.q = q;
      this.location = location;
      this.navUrls = navUrls;
      this.appMetaService = appMetaService;
      this.translate = translate;
      this.scope.project = {};
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          var description, sectionName, title;
          sectionName = _this.translate.instant(_this.scope.sectionName);
          title = _this.translate.instant("ADMIN.PROJECT_VALUES.PAGE_TITLE", {
            "sectionName": sectionName,
            "projectName": _this.scope.project.name
          });
          description = _this.scope.project.description;
          return _this.appMetaService.setAll(title, description);
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
    }

    ProjectValuesSectionController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          if (!project.i_am_owner) {
            _this.location.path(_this.navUrls.resolve("permission-denied"));
          }
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.$emit('project:loaded', project);
          return project;
        };
      })(this));
    };

    ProjectValuesSectionController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      return promise;
    };

    return ProjectValuesSectionController;

  })(mixOf(taiga.Controller, taiga.PageMixin));

  module.controller("ProjectValuesSectionController", ProjectValuesSectionController);

  ProjectValuesController = (function(superClass) {
    extend(ProjectValuesController, superClass);

    ProjectValuesController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgConfirm", "$tgResources"];

    function ProjectValuesController(scope, rootscope, repo, confirm, rs) {
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs;
      this.moveValue = bind(this.moveValue, this);
      this.loadValues = bind(this.loadValues, this);
      this.scope.$on("admin:project-values:move", this.moveValue);
      this.rootscope.$on("project:loaded", this.loadValues);
    }

    ProjectValuesController.prototype.loadValues = function() {
      return this.rs[this.scope.resource].listValues(this.scope.projectId, this.scope.type).then((function(_this) {
        return function(values) {
          _this.scope.values = values;
          _this.scope.maxValueOrder = _.max(values, "order").order;
          return values;
        };
      })(this));
    };

    ProjectValuesController.prototype.moveValue = function(ctx, itemValue, itemIndex) {
      var r, values;
      values = this.scope.values;
      r = values.indexOf(itemValue);
      values.splice(r, 1);
      values.splice(itemIndex, 0, itemValue);
      _.each(values, function(value, index) {
        return value.order = index;
      });
      return this.repo.saveAll(values);
    };

    return ProjectValuesController;

  })(taiga.Controller);

  module.controller("ProjectValuesController", ProjectValuesController);

  ProjectValuesDirective = function($log, $repo, $confirm, $location, animationFrame, $translate, $rootscope) {
    var link, linkDragAndDrop, linkValue;
    linkDragAndDrop = function($scope, $el, $attrs) {
      var itemEl, newParentScope, oldParentScope, tdom;
      oldParentScope = null;
      newParentScope = null;
      itemEl = null;
      tdom = $el.find(".sortable");
      tdom.sortable({
        handle: ".row.table-main.visualization",
        dropOnEmpty: true,
        connectWith: ".project-values-body",
        revert: 400,
        axis: "y"
      });
      tdom.on("sortstop", function(event, ui) {
        var itemIndex, itemValue;
        itemEl = ui.item;
        itemValue = itemEl.scope().value;
        itemIndex = itemEl.index();
        return $scope.$broadcast("admin:project-values:move", itemValue, itemIndex);
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    linkValue = function($scope, $el, $attrs) {
      var $ctrl, cancel, goToBottomList, initializeNewValue, initializeTextTranslations, objName, saveNewValue, saveValue, valueType;
      $ctrl = $el.controller();
      valueType = $attrs.type;
      objName = $attrs.objname;
      initializeNewValue = function() {
        return $scope.newValue = {
          "name": "",
          "is_closed": false,
          "is_archived": false
        };
      };
      initializeTextTranslations = function() {
        return $scope.addNewElementText = $translate.instant("ADMIN.PROJECT_VALUES_" + (objName.toUpperCase()) + ".ACTION_ADD");
      };
      initializeNewValue();
      initializeTextTranslations();
      $rootscope.$on("$translateChangeEnd", function() {
        return $scope.$evalAsync(initializeTextTranslations);
      });
      goToBottomList = (function(_this) {
        return function(focus) {
          var table;
          if (focus == null) {
            focus = false;
          }
          table = $el.find(".table-main");
          $(document.body).scrollTop(table.offset().top + table.height());
          if (focus) {
            return $el.find(".new-value input:visible").first().focus();
          }
        };
      })(this);
      saveValue = function(target) {
        var form, formEl, promise, value;
        formEl = target.parents("form");
        form = formEl.checksley();
        if (!form.validate()) {
          return;
        }
        value = formEl.scope().value;
        promise = $repo.save(value);
        promise.then((function(_this) {
          return function() {
            var row;
            row = target.parents(".row.table-main");
            row.addClass("hidden");
            return row.siblings(".visualization").removeClass('hidden');
          };
        })(this));
        return promise.then(null, function(data) {
          return form.setErrors(data);
        });
      };
      saveNewValue = function(target) {
        var form, formEl, promise;
        formEl = target.parents("form");
        form = formEl.checksley();
        if (!form.validate()) {
          return;
        }
        $scope.newValue.project = $scope.project.id;
        $scope.newValue.order = $scope.maxValueOrder ? $scope.maxValueOrder + 1 : 1;
        promise = $repo.create(valueType, $scope.newValue);
        promise.then((function(_this) {
          return function(data) {
            target.addClass("hidden");
            $scope.values.push(data);
            $scope.maxValueOrder = data.order;
            return initializeNewValue();
          };
        })(this));
        return promise.then(null, function(data) {
          return form.setErrors(data);
        });
      };
      cancel = function(target) {
        var formEl, row, value;
        row = target.parents(".row.table-main");
        formEl = target.parents("form");
        value = formEl.scope().value;
        return $scope.$apply(function() {
          row.addClass("hidden");
          value.revert();
          return row.siblings(".visualization").removeClass('hidden');
        });
      };
      $el.on("click", ".show-add-new", function(event) {
        event.preventDefault();
        $el.find(".new-value").removeClass('hidden');
        return goToBottomList(true);
      });
      $el.on("click", ".add-new", debounce(2000, function(event) {
        var target;
        event.preventDefault();
        target = $el.find(".new-value");
        return saveNewValue(target);
      }));
      $el.on("click", ".delete-new", function(event) {
        event.preventDefault();
        $el.find(".new-value").addClass("hidden");
        return initializeNewValue();
      });
      $el.on("click", ".edit-value", function(event) {
        var editionRow, row, target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        row = target.parents(".row.table-main");
        row.addClass("hidden");
        editionRow = row.siblings(".edition");
        editionRow.removeClass('hidden');
        return editionRow.find('input:visible').first().focus().select();
      });
      $el.on("keyup", ".edition input", function(event) {
        var target;
        if (event.keyCode === 13) {
          target = angular.element(event.currentTarget);
          return saveValue(target);
        } else if (event.keyCode === 27) {
          target = angular.element(event.currentTarget);
          return cancel(target);
        }
      });
      $el.on("keyup", ".new-value input", function(event) {
        var target;
        if (event.keyCode === 13) {
          target = $el.find(".new-value");
          return saveNewValue(target);
        } else if (event.keyCode === 27) {
          $el.find(".new-value").addClass("hidden");
          return initializeNewValue();
        }
      });
      $el.on("click", ".save", function(event) {
        var target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        return saveValue(target);
      });
      $el.on("click", ".cancel", function(event) {
        var target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        return cancel(target);
      });
      return $el.on("click", ".delete-value", function(event) {
        var choices, formEl, subtitle, target, text, title, value;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        formEl = target.parents("form");
        value = formEl.scope().value;
        choices = {};
        _.each($scope.values, function(option) {
          if (value.id !== option.id) {
            return choices[option.id] = option.name;
          }
        });
        subtitle = value.name;
        if (_.keys(choices).length === 0) {
          return $confirm.error("ADMIN.PROJECT_VALUES.ERROR_DELETE_ALL");
        }
        title = $translate.instant("ADMIN.COMMON.TITLE_ACTION_DELETE_VALUE");
        text = $translate.instant("ADMIN.PROJECT_VALUES.REPLACEMENT");
        return $confirm.askChoice(title, subtitle, choices, text).then(function(response) {
          var onError, onSucces;
          onSucces = function() {
            return $ctrl.loadValues()["finally"](function() {
              return response.finish();
            });
          };
          onError = function() {
            return $confirm.notify("error");
          };
          return $repo.remove(value, {
            "moveTo": response.selected
          }).then(onSucces, onError);
        });
      });
    };
    link = function($scope, $el, $attrs) {
      linkDragAndDrop($scope, $el, $attrs);
      linkValue($scope, $el, $attrs);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgProjectValues", ["$log", "$tgRepo", "$tgConfirm", "$tgLocation", "animationFrame", "$translate", "$rootScope", ProjectValuesDirective]);

  ColorSelectionDirective = function() {
    var link;
    link = function($scope, $el, $attrs, $model) {
      var $ctrl;
      $ctrl = $el.controller();
      $scope.$watch($attrs.ngModel, function(element) {
        return $scope.color = element.color;
      });
      $el.on("click", ".current-color", function(event) {
        var body, target;
        event.preventDefault();
        event.stopPropagation();
        target = angular.element(event.currentTarget);
        $el.find(".select-color").hide();
        target.siblings(".select-color").show();
        body = angular.element("body");
        return body.on("click", (function(_this) {
          return function(event) {
            if (angular.element(event.target).parent(".select-color").length === 0) {
              $el.find(".select-color").hide();
              return body.unbind("click");
            }
          };
        })(this));
      });
      $el.on("click", ".select-color .color", function(event) {
        var target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        $scope.$apply(function() {
          return $model.$modelValue.color = target.data("color");
        });
        return $el.find(".select-color").hide();
      });
      $el.on("click", ".select-color .selected-color", function(event) {
        event.preventDefault();
        $scope.$apply(function() {
          return $model.$modelValue.color = $scope.color;
        });
        return $el.find(".select-color").hide();
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      require: "ngModel"
    };
  };

  module.directive("tgColorSelection", ColorSelectionDirective);

  ProjectCustomAttributesController = (function(superClass) {
    extend(ProjectCustomAttributesController, superClass);

    ProjectCustomAttributesController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgResources", "$routeParams", "$q", "$tgLocation", "$tgNavUrls", "tgAppMetaService", "$translate"];

    function ProjectCustomAttributesController(scope, rootscope, repo, rs, params, q, location, navUrls, appMetaService, translate) {
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.rs = rs;
      this.params = params;
      this.q = q;
      this.location = location;
      this.navUrls = navUrls;
      this.appMetaService = appMetaService;
      this.translate = translate;
      this.moveCustomAttributes = bind(this.moveCustomAttributes, this);
      this.deleteCustomAttribute = bind(this.deleteCustomAttribute, this);
      this.saveCustomAttribute = bind(this.saveCustomAttribute, this);
      this.createCustomAttribute = bind(this.createCustomAttribute, this);
      this.loadCustomAttributes = bind(this.loadCustomAttributes, this);
      this.scope.project = {};
      this.rootscope.$on("project:loaded", (function(_this) {
        return function() {
          var description, sectionName, title;
          _this.loadCustomAttributes();
          sectionName = _this.translate.instant(_this.scope.sectionName);
          title = _this.translate.instant("ADMIN.CUSTOM_ATTRIBUTES.PAGE_TITLE", {
            "sectionName": sectionName,
            "projectName": _this.scope.project.name
          });
          description = _this.scope.project.description;
          return _this.appMetaService.setAll(title, description);
        };
      })(this));
    }

    ProjectCustomAttributesController.prototype.loadCustomAttributes = function() {
      return this.rs.customAttributes[this.scope.type].list(this.scope.projectId).then((function(_this) {
        return function(customAttributes) {
          _this.scope.customAttributes = customAttributes;
          _this.scope.maxOrder = _.max(customAttributes, "order").order;
          return customAttributes;
        };
      })(this));
    };

    ProjectCustomAttributesController.prototype.createCustomAttribute = function(attrValues) {
      return this.repo.create("custom-attributes/" + this.scope.type, attrValues);
    };

    ProjectCustomAttributesController.prototype.saveCustomAttribute = function(attrModel) {
      return this.repo.save(attrModel);
    };

    ProjectCustomAttributesController.prototype.deleteCustomAttribute = function(attrModel) {
      return this.repo.remove(attrModel);
    };

    ProjectCustomAttributesController.prototype.moveCustomAttributes = function(attrModel, newIndex) {
      var customAttributes, r;
      customAttributes = this.scope.customAttributes;
      r = customAttributes.indexOf(attrModel);
      customAttributes.splice(r, 1);
      customAttributes.splice(newIndex, 0, attrModel);
      _.each(customAttributes, function(val, idx) {
        return val.order = idx;
      });
      return this.repo.saveAll(customAttributes);
    };

    return ProjectCustomAttributesController;

  })(mixOf(taiga.Controller, taiga.PageMixin));

  module.controller("ProjectCustomAttributesController", ProjectCustomAttributesController);

  ProjectCustomAttributesDirective = function($log, $confirm, animationFrame, $translate) {
    var link;
    link = function($scope, $el, $attrs) {
      var $ctrl, cancelCreate, cancelUpdate, create, deleteCustomAttribute, hideAddButton, hideCancelButton, hideCreateForm, hideEditForm, resetNewAttr, revertChangesInCustomAttribute, showAddButton, showCancelButton, showCreateForm, showEditForm, sortableEl, update;
      $ctrl = $el.controller();
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      sortableEl = $el.find(".js-sortable");
      sortableEl.sortable({
        handle: ".js-view-custom-field",
        dropOnEmpty: true,
        revert: 400,
        axis: "y"
      });
      sortableEl.on("sortstop", function(event, ui) {
        var itemAttr, itemEl, itemIndex;
        itemEl = ui.item;
        itemAttr = itemEl.scope().attr;
        itemIndex = itemEl.index();
        return $ctrl.moveCustomAttributes(itemAttr, itemIndex);
      });
      showCreateForm = function() {
        $el.find(".js-new-custom-field").removeClass("hidden");
        return $el.find(".js-new-custom-field input:visible").first().focus();
      };
      hideCreateForm = function() {
        return $el.find(".js-new-custom-field").addClass("hidden");
      };
      showAddButton = function() {
        return $el.find(".js-add-custom-field-button").removeClass("hidden");
      };
      hideAddButton = function() {
        return $el.find(".js-add-custom-field-button").addClass("hidden");
      };
      showCancelButton = function() {
        return $el.find(".js-cancel-new-custom-field-button").removeClass("hidden");
      };
      hideCancelButton = function() {
        return $el.find(".js-cancel-new-custom-field-button").addClass("hidden");
      };
      resetNewAttr = function() {
        return $scope.newAttr = {};
      };
      create = function(formEl) {
        var attr, form, onError, onSucces;
        form = formEl.checksley();
        if (!form.validate()) {
          return;
        }
        onSucces = (function(_this) {
          return function() {
            $ctrl.loadCustomAttributes();
            hideCreateForm();
            resetNewAttr();
            return $confirm.notify("success");
          };
        })(this);
        onError = (function(_this) {
          return function(data) {
            return form.setErrors(data);
          };
        })(this);
        attr = $scope.newAttr;
        attr.project = $scope.projectId;
        attr.order = $scope.maxOrder ? $scope.maxOrder + 1 : 1;
        return $ctrl.createCustomAttribute(attr).then(onSucces, onError);
      };
      cancelCreate = function() {
        hideCreateForm();
        return resetNewAttr();
      };
      $scope.$watch("customAttributes", function(customAttributes) {
        if (!customAttributes) {
          return;
        }
        if (customAttributes.length === 0) {
          hideCancelButton();
          hideAddButton();
          return showCreateForm();
        } else {
          hideCreateForm();
          showAddButton();
          return showCancelButton();
        }
      });
      $el.on("click", ".js-add-custom-field-button", function(event) {
        event.preventDefault();
        return showCreateForm();
      });
      $el.on("click", ".js-create-custom-field-button", debounce(2000, function(event) {
        var formEl, target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        formEl = target.closest("form");
        return create(formEl);
      }));
      $el.on("click", ".js-cancel-new-custom-field-button", function(event) {
        event.preventDefault();
        return cancelCreate();
      });
      $el.on("keyup", ".js-new-custom-field input", function(event) {
        var formEl, target;
        if (event.keyCode === 13) {
          target = angular.element(event.currentTarget);
          formEl = target.closest("form");
          return create(formEl);
        } else if (event.keyCode === 27) {
          return cancelCreate();
        }
      });
      showEditForm = function(formEl) {
        formEl.find(".js-view-custom-field").addClass("hidden");
        formEl.find(".js-edit-custom-field").removeClass("hidden");
        return formEl.find(".js-edit-custom-field input:visible").first().focus().select();
      };
      hideEditForm = function(formEl) {
        formEl.find(".js-edit-custom-field").addClass("hidden");
        return formEl.find(".js-view-custom-field").removeClass("hidden");
      };
      revertChangesInCustomAttribute = function(formEl) {
        return $scope.$apply(function() {
          return formEl.scope().attr.revert();
        });
      };
      update = function(formEl) {
        var attr, form, onError, onSucces;
        form = formEl.checksley();
        if (!form.validate()) {
          return;
        }
        onSucces = (function(_this) {
          return function() {
            $ctrl.loadCustomAttributes();
            hideEditForm(formEl);
            return $confirm.notify("success");
          };
        })(this);
        onError = (function(_this) {
          return function(data) {
            return form.setErrors(data);
          };
        })(this);
        attr = formEl.scope().attr;
        return $ctrl.saveCustomAttribute(attr).then(onSucces, onError);
      };
      cancelUpdate = function(formEl) {
        hideEditForm(formEl);
        return revertChangesInCustomAttribute(formEl);
      };
      $el.on("click", ".js-edit-custom-field-button", function(event) {
        var formEl, target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        formEl = target.closest("form");
        return showEditForm(formEl);
      });
      $el.on("click", ".js-update-custom-field-button", debounce(2000, function(event) {
        var formEl, target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        formEl = target.closest("form");
        return update(formEl);
      }));
      $el.on("click", ".js-cancel-edit-custom-field-button", function(event) {
        var formEl, target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        formEl = target.closest("form");
        return cancelUpdate(formEl);
      });
      $el.on("keyup", ".js-edit-custom-field input", function(event) {
        var formEl, target;
        if (event.keyCode === 13) {
          target = angular.element(event.currentTarget);
          formEl = target.closest("form");
          return update(formEl);
        } else if (event.keyCode === 27) {
          target = angular.element(event.currentTarget);
          formEl = target.closest("form");
          return cancelUpdate(formEl);
        }
      });
      deleteCustomAttribute = function(formEl) {
        var attr, message, text, title;
        attr = formEl.scope().attr;
        message = attr.name;
        title = $translate.instant("COMMON.CUSTOM_ATTRIBUTES.DELETE");
        text = $translate.instant("COMMON.CUSTOM_ATTRIBUTES.CONFIRM_DELETE");
        return $confirm.ask(title, text, message).then(function(finish) {
          var onError, onSucces;
          onSucces = function() {
            return $ctrl.loadCustomAttributes()["finally"](function() {
              return finish();
            });
          };
          onError = function() {
            finish(false);
            return $confirm.notify("error", null, "We have not been able to delete '" + message + "'.");
          };
          return $ctrl.deleteCustomAttribute(attr).then(onSucces, onError);
        });
      };
      return $el.on("click", ".js-delete-custom-field-button", debounce(2000, function(event) {
        var formEl, target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        formEl = target.closest("form");
        return deleteCustomAttribute(formEl);
      }));
    };
    return {
      link: link
    };
  };

  module.directive("tgProjectCustomAttributes", ["$log", "$tgConfirm", "animationFrame", "$translate", ProjectCustomAttributesDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/admin/memberships.coffee
 */

(function() {
  var EditRoleDirective, NewRoleDirective, RolePermissionsDirective, RolesController, RolesDirective, bindMethods, bindOnce, debounce, mixOf, module, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  bindOnce = this.taiga.bindOnce;

  debounce = this.taiga.debounce;

  bindMethods = this.taiga.bindMethods;

  module = angular.module("taigaAdmin");

  RolesController = (function(superClass) {
    extend(RolesController, superClass);

    RolesController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgConfirm", "$tgResources", "$routeParams", "$q", "$tgLocation", "$tgNavUrls", "tgAppMetaService", "$translate"];

    function RolesController(scope, rootscope, repo, confirm, rs, params, q, location, navUrls, appMetaService, translate) {
      var promise;
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs;
      this.params = params;
      this.q = q;
      this.location = location;
      this.navUrls = navUrls;
      this.appMetaService = appMetaService;
      this.translate = translate;
      bindMethods(this);
      this.scope.sectionName = "ADMIN.MENU.PERMISSIONS";
      this.scope.project = {};
      this.scope.anyComputableRole = true;
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          var description, title;
          title = _this.translate.instant("ADMIN.ROLES.PAGE_TITLE", {
            projectName: _this.scope.project.name
          });
          description = _this.scope.project.description;
          return _this.appMetaService.setAll(title, description);
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
    }

    RolesController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          if (!project.i_am_owner) {
            _this.location.path(_this.navUrls.resolve("permission-denied"));
          }
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.$emit('project:loaded', project);
          _this.scope.anyComputableRole = _.some(_.map(project.roles, function(point) {
            return point.computable;
          }));
          return project;
        };
      })(this));
    };

    RolesController.prototype.loadRoles = function() {
      return this.rs.roles.list(this.scope.projectId).then((function(_this) {
        return function(roles) {
          var public_permission;
          roles = roles.map(function(role) {
            role.external_user = false;
            return role;
          });
          public_permission = {
            "name": _this.translate.instant("ADMIN.ROLES.EXTERNAL_USER"),
            "permissions": _this.scope.project.public_permissions,
            "external_user": true
          };
          roles.push(public_permission);
          _this.scope.roles = roles;
          _this.scope.role = _this.scope.roles[0];
          return roles;
        };
      })(this));
    };

    RolesController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      promise.then((function(_this) {
        return function() {
          return _this.loadRoles();
        };
      })(this));
      return promise;
    };

    RolesController.prototype.setRole = function(role) {
      this.scope.role = role;
      return this.scope.$broadcast("role:changed", this.scope.role);
    };

    RolesController.prototype["delete"] = function() {
      var choices, i, len, ref, replacement, role, subtitle, title, warning;
      choices = {};
      ref = this.scope.roles;
      for (i = 0, len = ref.length; i < len; i++) {
        role = ref[i];
        if (role.id !== this.scope.role.id) {
          choices[role.id] = role.name;
        }
      }
      if (_.keys(choices).length === 0) {
        return this.confirm.error(this.translate.instant("ADMIN.ROLES.ERROR_DELETE_ALL"));
      }
      title = this.translate.instant("ADMIN.ROLES.TITLE_DELETE_ROLE");
      subtitle = this.scope.role.name;
      replacement = this.translate.instant("ADMIN.ROLES.REPLACEMENT_ROLE");
      warning = this.translate.instant("ADMIN.ROLES.WARNING_DELETE_ROLE");
      return this.confirm.askChoice(title, subtitle, choices, replacement, warning).then((function(_this) {
        return function(response) {
          var onError, onSuccess;
          onSuccess = function() {
            _this.loadProject();
            return _this.loadRoles()["finally"](function() {
              return response.finish();
            });
          };
          onError = function() {
            return _this.confirm.notify('error');
          };
          return _this.repo.remove(_this.scope.role, {
            moveTo: response.selected
          }).then(onSuccess, onError);
        };
      })(this));
    };

    RolesController.prototype.setComputable = debounce(2000, function() {
      var onError, onSuccess;
      onSuccess = (function(_this) {
        return function() {
          _this.confirm.notify("success");
          return _this.loadProject();
        };
      })(this);
      onError = (function(_this) {
        return function() {
          _this.confirm.notify("error");
          return _this.scope.role.revert();
        };
      })(this);
      return this.repo.save(this.scope.role).then(onSuccess, onError);
    });

    return RolesController;

  })(mixOf(taiga.Controller, taiga.PageMixin, taiga.FiltersMixin));

  module.controller("RolesController", RolesController);

  EditRoleDirective = function($repo, $confirm) {
    var link;
    link = function($scope, $el, $attrs) {
      var submit, toggleView;
      toggleView = function() {
        $el.find('.total').toggle();
        return $el.find('.edit-role').toggle();
      };
      submit = function() {
        var promise;
        $scope.role.name = $el.find("input").val();
        promise = $repo.save($scope.role);
        promise.then(function() {
          return $confirm.notify("success");
        });
        promise.then(null, function(data) {
          return $confirm.notify("error");
        });
        return toggleView();
      };
      $el.on("click", "a.icon-edit", function() {
        toggleView();
        $el.find("input").focus();
        return $el.find("input").val($scope.role.name);
      });
      $el.on("click", "a.save", submit);
      $el.on("keyup", "input", function(event) {
        if (event.keyCode === 13) {
          return submit();
        } else if (event.keyCode === 27) {
          return toggleView();
        }
      });
      $scope.$on("role:changed", function() {
        if ($el.find('.edit-role').is(":visible")) {
          return toggleView();
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgEditRole", ["$tgRepo", "$tgConfirm", EditRoleDirective]);

  RolesDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      var $ctrl;
      $ctrl = $el.controller();
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgRoles", RolesDirective);

  NewRoleDirective = function($tgrepo, $confirm) {
    var DEFAULT_PERMISSIONS, link;
    DEFAULT_PERMISSIONS = ["view_project", "view_milestones", "view_us", "view_tasks", "view_issues"];
    link = function($scope, $el, $attrs) {
      var $ctrl;
      $ctrl = $el.controller();
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      $el.on("click", "a.add-button", function(event) {
        event.preventDefault();
        $el.find(".new").removeClass("hidden");
        $el.find(".new").focus();
        return $el.find(".add-button").hide();
      });
      return $el.on("keyup", ".new", function(event) {
        var newRole, onError, onSuccess, target;
        event.preventDefault();
        if (event.keyCode === 13) {
          target = angular.element(event.currentTarget);
          newRole = {
            project: $scope.projectId,
            name: target.val(),
            permissions: DEFAULT_PERMISSIONS,
            order: _.max($scope.roles, function(r) {
              return r.order;
            }).order + 1,
            computable: false
          };
          $el.find(".new").addClass("hidden");
          $el.find(".new").val('');
          onSuccess = function(role) {
            var insertPosition;
            insertPosition = $scope.roles.length - 1;
            $scope.roles.splice(insertPosition, 0, role);
            $ctrl.setRole(role);
            $el.find(".add-button").show();
            return $ctrl.loadProject();
          };
          onError = function() {
            return $confirm.notify("error");
          };
          return $tgrepo.create("roles", newRole).then(onSuccess, onError);
        } else if (event.keyCode === 27) {
          target = angular.element(event.currentTarget);
          $el.find(".new").addClass("hidden");
          $el.find(".new").val('');
          return $el.find(".add-button").show();
        }
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgNewRole", ["$tgRepo", "$tgConfirm", NewRoleDirective]);

  RolePermissionsDirective = function($rootscope, $repo, $confirm, $compile) {
    var baseTemplate, categoryTemplate, link, resumeTemplate;
    resumeTemplate = _.template("<div class=\"resume-title\" translate=\"<%- category.name %>\"></div>\n<div class=\"summary-role\">\n    <div class=\"count\"><%- category.activePermissions %>/<%- category.permissions.length %></div>\n    <% _.each(category.permissions, function(permission) { %>\n        <div class=\"role-summary-single <% if(permission.active) { %>active<% } %>\"\n             title=\"{{ '<%- permission.name %>' | translate }}\"></div>\n    <% }) %>\n</div>\n<div class=\"icon icon-arrow-bottom\"></div>");
    categoryTemplate = _.template("<div class=\"category-config\" data-id=\"<%- index %>\">\n    <div class=\"resume\">\n    </div>\n    <div class=\"category-items\">\n        <div class=\"items-container\">\n        <% _.each(category.permissions, function(permission) { %>\n            <div class=\"category-item\" data-id=\"<%- permission.key %>\">\n                <span translate=\"<%- permission.name %>\"></span>\n                <div class=\"check\">\n                    <input type=\"checkbox\"\n                           <% if(!permission.editable) { %> disabled=\"disabled\" <% } %>\n                           <% if(permission.active) { %> checked=\"checked\" <% } %>/>\n                    <div></div>\n                    <span class=\"check-text check-yes\" translate=\"COMMON.YES\"></span>\n                    <span class=\"check-text check-no\" translate=\"COMMON.NO\"></span>\n                </div>\n            </div>\n        <% }) %>\n        </div>\n    </div>\n</div>");
    baseTemplate = _.template("<div class=\"category-config-list\"></div>");
    link = function($scope, $el, $attrs) {
      var $ctrl, generateCategoriesFromRole, renderCategory, renderPermissions, renderResume;
      $ctrl = $el.controller();
      generateCategoriesFromRole = function(role) {
        var categories, isPermissionEditable, issuePermissions, milestonePermissions, setActivePermissions, setActivePermissionsPerCategory, taskPermissions, userStoryPermissions, wikiPermissions;
        setActivePermissions = function(permissions) {
          return _.map(permissions, function(x) {
            var ref;
            return _.extend({}, x, {
              active: (ref = x["key"], indexOf.call(role.permissions, ref) >= 0)
            });
          });
        };
        isPermissionEditable = function(permission, role, project) {
          if (role.external_user && !project.is_private && permission.key.indexOf("view_") === 0) {
            return false;
          } else {
            return true;
          }
        };
        setActivePermissionsPerCategory = function(category) {
          return _.map(category, function(cat) {
            cat.permissions = cat.permissions.map(function(permission) {
              permission.editable = isPermissionEditable(permission, role, $scope.project);
              return permission;
            });
            return _.extend({}, cat, {
              activePermissions: _.filter(cat["permissions"], "active").length
            });
          });
        };
        categories = [];
        milestonePermissions = [
          {
            key: "view_milestones",
            name: "COMMON.PERMISIONS_CATEGORIES.SPRINTS.VIEW_SPRINTS"
          }, {
            key: "add_milestone",
            name: "COMMON.PERMISIONS_CATEGORIES.SPRINTS.ADD_SPRINTS"
          }, {
            key: "modify_milestone",
            name: "COMMON.PERMISIONS_CATEGORIES.SPRINTS.MODIFY_SPRINTS"
          }, {
            key: "delete_milestone",
            name: "COMMON.PERMISIONS_CATEGORIES.SPRINTS.DELETE_SPRINTS"
          }
        ];
        categories.push({
          name: "COMMON.PERMISIONS_CATEGORIES.SPRINTS.NAME",
          permissions: setActivePermissions(milestonePermissions)
        });
        userStoryPermissions = [
          {
            key: "view_us",
            name: "COMMON.PERMISIONS_CATEGORIES.USER_STORIES.VIEW_USER_STORIES"
          }, {
            key: "add_us",
            name: "COMMON.PERMISIONS_CATEGORIES.USER_STORIES.ADD_USER_STORIES"
          }, {
            key: "modify_us",
            name: "COMMON.PERMISIONS_CATEGORIES.USER_STORIES.MODIFY_USER_STORIES"
          }, {
            key: "delete_us",
            name: "COMMON.PERMISIONS_CATEGORIES.USER_STORIES.DELETE_USER_STORIES"
          }
        ];
        categories.push({
          name: "COMMON.PERMISIONS_CATEGORIES.USER_STORIES.NAME",
          permissions: setActivePermissions(userStoryPermissions)
        });
        taskPermissions = [
          {
            key: "view_tasks",
            name: "COMMON.PERMISIONS_CATEGORIES.TASKS.VIEW_TASKS"
          }, {
            key: "add_task",
            name: "COMMON.PERMISIONS_CATEGORIES.TASKS.ADD_TASKS"
          }, {
            key: "modify_task",
            name: "COMMON.PERMISIONS_CATEGORIES.TASKS.MODIFY_TASKS"
          }, {
            key: "delete_task",
            name: "COMMON.PERMISIONS_CATEGORIES.TASKS.DELETE_TASKS"
          }
        ];
        categories.push({
          name: "COMMON.PERMISIONS_CATEGORIES.TASKS.NAME",
          permissions: setActivePermissions(taskPermissions)
        });
        issuePermissions = [
          {
            key: "view_issues",
            name: "COMMON.PERMISIONS_CATEGORIES.ISSUES.VIEW_ISSUES"
          }, {
            key: "add_issue",
            name: "COMMON.PERMISIONS_CATEGORIES.ISSUES.ADD_ISSUES"
          }, {
            key: "modify_issue",
            name: "COMMON.PERMISIONS_CATEGORIES.ISSUES.MODIFY_ISSUES"
          }, {
            key: "delete_issue",
            name: "COMMON.PERMISIONS_CATEGORIES.ISSUES.DELETE_ISSUES"
          }
        ];
        categories.push({
          name: "COMMON.PERMISIONS_CATEGORIES.ISSUES.NAME",
          permissions: setActivePermissions(issuePermissions)
        });
        wikiPermissions = [
          {
            key: "view_wiki_pages",
            name: "COMMON.PERMISIONS_CATEGORIES.WIKI.VIEW_WIKI_PAGES"
          }, {
            key: "add_wiki_page",
            name: "COMMON.PERMISIONS_CATEGORIES.WIKI.ADD_WIKI_PAGES"
          }, {
            key: "modify_wiki_page",
            name: "COMMON.PERMISIONS_CATEGORIES.WIKI.MODIFY_WIKI_PAGES"
          }, {
            key: "delete_wiki_page",
            name: "COMMON.PERMISIONS_CATEGORIES.WIKI.DELETE_WIKI_PAGES"
          }, {
            key: "view_wiki_links",
            name: "COMMON.PERMISIONS_CATEGORIES.WIKI.VIEW_WIKI_LINKS"
          }, {
            key: "add_wiki_link",
            name: "COMMON.PERMISIONS_CATEGORIES.WIKI.ADD_WIKI_LINKS"
          }, {
            key: "delete_wiki_link",
            name: "COMMON.PERMISIONS_CATEGORIES.WIKI.DELETE_WIKI_LINKS"
          }
        ];
        categories.push({
          name: "COMMON.PERMISIONS_CATEGORIES.WIKI.NAME",
          permissions: setActivePermissions(wikiPermissions)
        });
        return setActivePermissionsPerCategory(categories);
      };
      renderResume = function(element, category) {
        return element.find(".resume").html($compile(resumeTemplate({
          category: category
        }))($scope));
      };
      renderCategory = function(category, index) {
        var html;
        html = categoryTemplate({
          category: category,
          index: index
        });
        html = angular.element(html);
        renderResume(html, category);
        return $compile(html)($scope);
      };
      renderPermissions = function() {
        var html;
        $el.off();
        html = baseTemplate();
        _.each(generateCategoriesFromRole($scope.role), function(category, index) {
          return html = angular.element(html).append(renderCategory(category, index));
        });
        $el.html(html);
        $el.on("click", ".resume", function(event) {
          var target;
          event.preventDefault();
          target = angular.element(event.currentTarget);
          return target.next().toggleClass("open");
        });
        return $el.on("change", ".category-item input", function(event) {
          var getActivePermissions, onError, onSuccess, target;
          getActivePermissions = function() {
            var activePermissions;
            activePermissions = _.filter($el.find(".category-item input"), function(t) {
              return angular.element(t).is(":checked");
            });
            activePermissions = _.sortBy(_.map(activePermissions, function(t) {
              var permission;
              return permission = angular.element(t).parents(".category-item").data("id");
            }));
            if (activePermissions.length) {
              activePermissions.push("view_project");
            }
            return activePermissions;
          };
          target = angular.element(event.currentTarget);
          $scope.role.permissions = getActivePermissions();
          onSuccess = function() {
            var categories, categoryId;
            categories = generateCategoriesFromRole($scope.role);
            categoryId = target.parents(".category-config").data("id");
            renderResume(target.parents(".category-config"), categories[categoryId]);
            $rootscope.$broadcast("projects:reload");
            $confirm.notify("success");
            return $ctrl.loadProject();
          };
          onError = function() {
            $confirm.notify("error");
            target.prop("checked", !target.prop("checked"));
            return $scope.role.permissions = getActivePermissions();
          };
          if ($scope.role.external_user) {
            $scope.project.public_permissions = $scope.role.permissions;
            $scope.project.anon_permissions = $scope.role.permissions.filter(function(permission) {
              return permission.indexOf("view_") === 0;
            });
            return $repo.save($scope.project).then(onSuccess, onError);
          } else {
            return $repo.save($scope.role).then(onSuccess, onError);
          }
        });
      };
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      $scope.$on("role:changed", function() {
        return renderPermissions();
      });
      return bindOnce($scope, $attrs.ngModel, renderPermissions);
    };
    return {
      link: link
    };
  };

  module.directive("tgRolePermissions", ["$rootScope", "$tgRepo", "$tgConfirm", "$compile", RolePermissionsDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/admin/third-parties.coffee
 */

(function() {
  var BitbucketController, BitbucketWebhooksDirective, GithubController, GithubWebhooksDirective, GitlabController, GitlabWebhooksDirective, NewWebhookDirective, SelectInputText, ValidOriginIpsDirective, WebhookDirective, WebhooksController, bindMethods, debounce, mixOf, module, taiga, timeout,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  bindMethods = this.taiga.bindMethods;

  debounce = this.taiga.debounce;

  timeout = this.taiga.timeout;

  module = angular.module("taigaAdmin");

  WebhooksController = (function(superClass) {
    extend(WebhooksController, superClass);

    WebhooksController.$inject = ["$scope", "$tgRepo", "$tgResources", "$routeParams", "$tgLocation", "$tgNavUrls", "tgAppMetaService", "$translate"];

    function WebhooksController(scope, repo, rs, params, location, navUrls, appMetaService, translate) {
      var promise;
      this.scope = scope;
      this.repo = repo;
      this.rs = rs;
      this.params = params;
      this.location = location;
      this.navUrls = navUrls;
      this.appMetaService = appMetaService;
      this.translate = translate;
      bindMethods(this);
      this.scope.sectionName = "ADMIN.WEBHOOKS.SECTION_NAME";
      this.scope.project = {};
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          var description, title;
          title = _this.translate.instant("ADMIN.WEBHOOKS.PAGE_TITLE", {
            projectName: _this.scope.project.name
          });
          description = _this.scope.project.description;
          return _this.appMetaService.setAll(title, description);
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
      this.scope.$on("webhooks:reload", this.loadWebhooks);
    }

    WebhooksController.prototype.loadWebhooks = function() {
      return this.rs.webhooks.list(this.scope.projectId).then((function(_this) {
        return function(webhooks) {
          return _this.scope.webhooks = webhooks;
        };
      })(this));
    };

    WebhooksController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          if (!project.i_am_owner) {
            _this.location.path(_this.navUrls.resolve("permission-denied"));
          }
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.$emit('project:loaded', project);
          return project;
        };
      })(this));
    };

    WebhooksController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      promise.then((function(_this) {
        return function() {
          return _this.loadWebhooks();
        };
      })(this));
      return promise;
    };

    return WebhooksController;

  })(mixOf(taiga.Controller, taiga.PageMixin, taiga.FiltersMixin));

  module.controller("WebhooksController", WebhooksController);

  WebhookDirective = function($rs, $repo, $confirm, $loading, $translate) {
    var link;
    link = function($scope, $el, $attrs) {
      var cancel, openHistory, save, showEditMode, showVisualizationMode, updateLogs, updateShowHideHistoryText, webhook;
      webhook = $scope.$eval($attrs.tgWebhook);
      updateLogs = function() {
        var prettyDate;
        prettyDate = $translate.instant("ADMIN.WEBHOOKS.DATE");
        return $rs.webhooklogs.list(webhook.id).then((function(_this) {
          return function(webhooklogs) {
            var i, len, log, ref;
            for (i = 0, len = webhooklogs.length; i < len; i++) {
              log = webhooklogs[i];
              log.validStatus = (200 <= (ref = log.status) && ref < 300);
              log.prettySentHeaders = _.map(_.pairs(log.request_headers), function(arg) {
                var header, value;
                header = arg[0], value = arg[1];
                return header + ": " + value;
              }).join("\n");
              log.prettySentData = JSON.stringify(log.request_data);
              log.prettyDate = moment(log.created).format(prettyDate);
            }
            webhook.logs_counter = webhooklogs.length;
            webhook.logs = webhooklogs;
            return updateShowHideHistoryText();
          };
        })(this));
      };
      updateShowHideHistoryText = function() {
        var historyElement, text, textElement, title;
        textElement = $el.find(".toggle-history");
        historyElement = textElement.parents(".single-webhook-wrapper").find(".webhooks-history");
        if (historyElement.hasClass("open")) {
          text = $translate.instant("ADMIN.WEBHOOKS.ACTION_HIDE_HISTORY");
          title = $translate.instant("ADMIN.WEBHOOKS.ACTION_HIDE_HISTORY_TITLE");
        } else {
          text = $translate.instant("ADMIN.WEBHOOKS.ACTION_SHOW_HISTORY");
          title = $translate.instant("ADMIN.WEBHOOKS.ACTION_SHOW_HISTORY_TITLE");
        }
        textElement.text(text);
        return textElement.prop("title", title);
      };
      showVisualizationMode = function() {
        $el.find(".edition-mode").addClass("hidden");
        return $el.find(".visualization-mode").removeClass("hidden");
      };
      showEditMode = function() {
        $el.find(".visualization-mode").addClass("hidden");
        return $el.find(".edition-mode").removeClass("hidden");
      };
      openHistory = function() {
        return $el.find(".webhooks-history").addClass("open");
      };
      cancel = function() {
        showVisualizationMode();
        return $scope.$apply(function() {
          return webhook.revert();
        });
      };
      save = debounce(2000, function(target) {
        var form, promise;
        form = target.parents("form").checksley();
        if (!form.validate()) {
          return;
        }
        promise = $repo.save(webhook);
        promise.then((function(_this) {
          return function() {
            return showVisualizationMode();
          };
        })(this));
        return promise.then(null, function(data) {
          $confirm.notify("error");
          return form.setErrors(data);
        });
      });
      $el.on("click", ".test-webhook", function() {
        openHistory();
        return $rs.webhooks.test(webhook.id).then((function(_this) {
          return function() {
            return updateLogs();
          };
        })(this));
      });
      $el.on("click", ".edit-webhook", function() {
        return showEditMode();
      });
      $el.on("click", ".cancel-existing", function() {
        return cancel();
      });
      $el.on("click", ".edit-existing", function(event) {
        var target;
        event.preventDefault();
        target = angular.element(event.currentTarget);
        return save(target);
      });
      $el.on("keyup", ".edition-mode input", function(event) {
        var target;
        if (event.keyCode === 13) {
          target = angular.element(event.currentTarget);
          return save(target);
        } else if (event.keyCode === 27) {
          target = angular.element(event.currentTarget);
          return cancel(target);
        }
      });
      $el.on("click", ".delete-webhook", function() {
        var message, title;
        title = $translate.instant("ADMIN.WEBHOOKS.DELETE");
        message = $translate.instant("ADMIN.WEBHOOKS.WEBHOOK_NAME", {
          name: webhook.name
        });
        return $confirm.askOnDelete(title, message).then((function(_this) {
          return function(finish) {
            var onError, onSucces;
            onSucces = function() {
              finish();
              return $scope.$emit("webhooks:reload");
            };
            onError = function() {
              finish(false);
              return $confirm.notify("error");
            };
            return $repo.remove(webhook).then(onSucces, onError);
          };
        })(this));
      });
      $el.on("click", ".toggle-history", function(event) {
        var target;
        target = angular.element(event.currentTarget);
        if ((webhook.logs == null) || webhook.logs.length === 0) {
          return updateLogs().then(function() {
            return timeout(0, function() {
              $el.find(".webhooks-history").toggleClass("open");
              return updateShowHideHistoryText();
            });
          });
        } else {
          $el.find(".webhooks-history").toggleClass("open");
          return $scope.$apply(function() {
            return updateShowHideHistoryText();
          });
        }
      });
      $el.on("click", ".history-single", function(event) {
        var target;
        target = angular.element(event.currentTarget);
        target.toggleClass("history-single-open");
        return target.siblings(".history-single-response").toggleClass("open");
      });
      return $el.on("click", ".resend-request", function(event) {
        var log, target;
        target = angular.element(event.currentTarget);
        log = target.data("log");
        return $rs.webhooklogs.resend(log).then((function(_this) {
          return function() {
            return updateLogs();
          };
        })(this));
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgWebhook", ["$tgResources", "$tgRepo", "$tgConfirm", "$tgLoading", "$translate", WebhookDirective]);

  NewWebhookDirective = function($rs, $repo, $confirm, $loading) {
    var link;
    link = function($scope, $el, $attrs) {
      var addWebhookDOMNode, formDOMNode, initializeNewValue, save, webhook;
      webhook = $scope.$eval($attrs.tgWebhook);
      formDOMNode = $el.find(".new-webhook-form");
      addWebhookDOMNode = $el.find(".add-webhook");
      initializeNewValue = function() {
        return $scope.newValue = {
          "name": "",
          "url": "",
          "key": ""
        };
      };
      initializeNewValue();
      $scope.$watch("webhooks", function(webhooks) {
        if (webhooks != null) {
          if (webhooks.length === 0) {
            formDOMNode.removeClass("hidden");
            addWebhookDOMNode.addClass("hidden");
            return formDOMNode.find("input")[0].focus();
          } else {
            formDOMNode.addClass("hidden");
            return addWebhookDOMNode.removeClass("hidden");
          }
        }
      });
      save = debounce(2000, function() {
        var form, promise;
        form = formDOMNode.checksley();
        if (!form.validate()) {
          return;
        }
        $scope.newValue.project = $scope.project.id;
        promise = $repo.create("webhooks", $scope.newValue);
        promise.then((function(_this) {
          return function() {
            $scope.$emit("webhooks:reload");
            return initializeNewValue();
          };
        })(this));
        return promise.then(null, function(data) {
          $confirm.notify("error");
          return form.setErrors(data);
        });
      });
      formDOMNode.on("click", ".add-new", function(event) {
        event.preventDefault();
        return save();
      });
      formDOMNode.on("keyup", "input", function(event) {
        if (event.keyCode === 13) {
          return save();
        }
      });
      formDOMNode.on("click", ".cancel-new", function(event) {
        return $scope.$apply(function() {
          return initializeNewValue();
        });
      });
      return addWebhookDOMNode.on("click", function(event) {
        formDOMNode.removeClass("hidden");
        return formDOMNode.find("input")[0].focus();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgNewWebhook", ["$tgResources", "$tgRepo", "$tgConfirm", "$tgLoading", NewWebhookDirective]);

  GithubController = (function(superClass) {
    extend(GithubController, superClass);

    GithubController.$inject = ["$scope", "$tgRepo", "$tgResources", "$routeParams", "tgAppMetaService", "$translate"];

    function GithubController(scope, repo, rs, params, appMetaService, translate) {
      var promise;
      this.scope = scope;
      this.repo = repo;
      this.rs = rs;
      this.params = params;
      this.appMetaService = appMetaService;
      this.translate = translate;
      bindMethods(this);
      this.scope.sectionName = this.translate.instant("ADMIN.GITHUB.SECTION_NAME");
      this.scope.project = {};
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          var description, title;
          title = _this.translate.instant("ADMIN.GITHUB.PAGE_TITLE", {
            projectName: _this.scope.project.name
          });
          description = _this.scope.project.description;
          return _this.appMetaService.setAll(title, description);
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
    }

    GithubController.prototype.loadModules = function() {
      return this.rs.modules.list(this.scope.projectId, "github").then((function(_this) {
        return function(github) {
          return _this.scope.github = github;
        };
      })(this));
    };

    GithubController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.$emit('project:loaded', project);
          return project;
        };
      })(this));
    };

    GithubController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      promise.then((function(_this) {
        return function() {
          return _this.loadModules();
        };
      })(this));
      return promise;
    };

    return GithubController;

  })(mixOf(taiga.Controller, taiga.PageMixin, taiga.FiltersMixin));

  module.controller("GithubController", GithubController);

  GitlabController = (function(superClass) {
    extend(GitlabController, superClass);

    GitlabController.$inject = ["$scope", "$tgRepo", "$tgResources", "$routeParams", "tgAppMetaService", "$translate"];

    function GitlabController(scope, repo, rs, params, appMetaService, translate) {
      var promise;
      this.scope = scope;
      this.repo = repo;
      this.rs = rs;
      this.params = params;
      this.appMetaService = appMetaService;
      this.translate = translate;
      bindMethods(this);
      this.scope.sectionName = this.translate.instant("ADMIN.GITLAB.SECTION_NAME");
      this.scope.project = {};
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          var description, title;
          title = _this.translate.instant("ADMIN.GITLAB.PAGE_TITLE", {
            projectName: _this.scope.project.name
          });
          description = _this.scope.project.description;
          return _this.appMetaService.setAll(title, description);
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
      this.scope.$on("project:modules:reload", (function(_this) {
        return function() {
          return _this.loadModules();
        };
      })(this));
    }

    GitlabController.prototype.loadModules = function() {
      return this.rs.modules.list(this.scope.projectId, "gitlab").then((function(_this) {
        return function(gitlab) {
          return _this.scope.gitlab = gitlab;
        };
      })(this));
    };

    GitlabController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.$emit('project:loaded', project);
          return project;
        };
      })(this));
    };

    GitlabController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      promise.then((function(_this) {
        return function() {
          return _this.loadModules();
        };
      })(this));
      return promise;
    };

    return GitlabController;

  })(mixOf(taiga.Controller, taiga.PageMixin, taiga.FiltersMixin));

  module.controller("GitlabController", GitlabController);

  BitbucketController = (function(superClass) {
    extend(BitbucketController, superClass);

    BitbucketController.$inject = ["$scope", "$tgRepo", "$tgResources", "$routeParams", "tgAppMetaService", "$translate"];

    function BitbucketController(scope, repo, rs, params, appMetaService, translate) {
      var promise;
      this.scope = scope;
      this.repo = repo;
      this.rs = rs;
      this.params = params;
      this.appMetaService = appMetaService;
      this.translate = translate;
      bindMethods(this);
      this.scope.sectionName = this.translate.instant("ADMIN.BITBUCKET.SECTION_NAME");
      this.scope.project = {};
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          var description, title;
          title = _this.translate.instant("ADMIN.BITBUCKET.PAGE_TITLE", {
            projectName: _this.scope.project.name
          });
          description = _this.scope.project.description;
          return _this.appMetaService.setAll(title, description);
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
      this.scope.$on("project:modules:reload", (function(_this) {
        return function() {
          return _this.loadModules();
        };
      })(this));
    }

    BitbucketController.prototype.loadModules = function() {
      return this.rs.modules.list(this.scope.projectId, "bitbucket").then((function(_this) {
        return function(bitbucket) {
          return _this.scope.bitbucket = bitbucket;
        };
      })(this));
    };

    BitbucketController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.$emit('project:loaded', project);
          return project;
        };
      })(this));
    };

    BitbucketController.prototype.loadInitialData = function() {
      var promise;
      promise = this.loadProject();
      promise.then((function(_this) {
        return function() {
          return _this.loadModules();
        };
      })(this));
      return promise;
    };

    return BitbucketController;

  })(mixOf(taiga.Controller, taiga.PageMixin, taiga.FiltersMixin));

  module.controller("BitbucketController", BitbucketController);

  SelectInputText = function() {
    var link;
    link = function($scope, $el, $attrs) {
      return $el.on("click", ".select-input-content", function() {
        $el.find("input").select();
        return $el.find(".help-copy").addClass("visible");
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgSelectInputText", SelectInputText);

  GithubWebhooksDirective = function($repo, $confirm, $loading) {
    var link;
    link = function($scope, $el, $attrs) {
      var form, submit, submitButton;
      form = $el.find("form").checksley({
        "onlyOneErrorElement": true
      });
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var promise;
          event.preventDefault();
          if (!form.validate()) {
            return;
          }
          $loading.start(submitButton);
          promise = $repo.saveAttribute($scope.github, "github");
          promise.then(function() {
            $loading.finish(submitButton);
            return $confirm.notify("success");
          });
          return promise.then(null, function(data) {
            $loading.finish(submitButton);
            form.setErrors(data);
            if (data._error_message) {
              return $confirm.notify("error", data._error_message);
            }
          });
        };
      })(this));
      submitButton = $el.find(".submit-button");
      return $el.on("submit", "form", submit);
    };
    return {
      link: link
    };
  };

  module.directive("tgGithubWebhooks", ["$tgRepo", "$tgConfirm", "$tgLoading", GithubWebhooksDirective]);

  GitlabWebhooksDirective = function($repo, $confirm, $loading) {
    var link;
    link = function($scope, $el, $attrs) {
      var form, submit, submitButton;
      form = $el.find("form").checksley({
        "onlyOneErrorElement": true
      });
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var promise;
          event.preventDefault();
          if (!form.validate()) {
            return;
          }
          $loading.start(submitButton);
          promise = $repo.saveAttribute($scope.gitlab, "gitlab");
          promise.then(function() {
            $loading.finish(submitButton);
            $confirm.notify("success");
            return $scope.$emit("project:modules:reload");
          });
          return promise.then(null, function(data) {
            $loading.finish(submitButton);
            form.setErrors(data);
            if (data._error_message) {
              return $confirm.notify("error", data._error_message);
            }
          });
        };
      })(this));
      submitButton = $el.find(".submit-button");
      return $el.on("submit", "form", submit);
    };
    return {
      link: link
    };
  };

  module.directive("tgGitlabWebhooks", ["$tgRepo", "$tgConfirm", "$tgLoading", GitlabWebhooksDirective]);

  BitbucketWebhooksDirective = function($repo, $confirm, $loading) {
    var link;
    link = function($scope, $el, $attrs) {
      var form, submit, submitButton;
      form = $el.find("form").checksley({
        "onlyOneErrorElement": true
      });
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var promise;
          event.preventDefault();
          if (!form.validate()) {
            return;
          }
          $loading.start(submitButton);
          promise = $repo.saveAttribute($scope.bitbucket, "bitbucket");
          promise.then(function() {
            $loading.finish(submitButton);
            $confirm.notify("success");
            return $scope.$emit("project:modules:reload");
          });
          return promise.then(null, function(data) {
            $loading.finish(submitButton);
            form.setErrors(data);
            if (data._error_message) {
              return $confirm.notify("error", data._error_message);
            }
          });
        };
      })(this));
      submitButton = $el.find(".submit-button");
      return $el.on("submit", "form", submit);
    };
    return {
      link: link
    };
  };

  module.directive("tgBitbucketWebhooks", ["$tgRepo", "$tgConfirm", "$tgLoading", BitbucketWebhooksDirective]);

  ValidOriginIpsDirective = function() {
    var link;
    link = function($scope, $el, $attrs, $ngModel) {
      return $ngModel.$parsers.push(function(value) {
        value = $.trim(value);
        if (value === "") {
          return [];
        }
        return value.split(",");
      });
    };
    return {
      link: link,
      restrict: "EA",
      require: "ngModel"
    };
  };

  module.directive("tgValidOriginIps", ValidOriginIpsDirective);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/common/attachments.coffee
 */

(function() {
  var CreateProject, DeleteProjectDirective, bindOnce, debounce, module, taiga, timeout;

  taiga = this.taiga;

  bindOnce = this.taiga.bindOnce;

  timeout = this.taiga.timeout;

  debounce = this.taiga.debounce;

  module = angular.module("taigaProject");

  CreateProject = function($rootscope, $repo, $confirm, $location, $navurls, $rs, $projectUrl, $loading, lightboxService, $cacheFactory, $translate, currentUserService) {
    var directive, link;
    link = function($scope, $el, attrs) {
      var form, onErrorSubmit, onSuccessSubmit, openLightbox, submit, submitButton;
      $scope.data = {};
      $scope.templates = [];
      form = $el.find("form").checksley({
        "onlyOneErrorElement": true
      });
      onSuccessSubmit = function(response) {
        $cacheFactory.get('$http').removeAll();
        $loading.finish(submitButton);
        $rootscope.$broadcast("projects:reload");
        $confirm.notify("success", $translate.instant("COMMON.SAVE"));
        $location.url($projectUrl.get(response));
        lightboxService.close($el);
        return currentUserService.loadProjects();
      };
      onErrorSubmit = function(response) {
        var error_field, error_step, i, len, ref, selectors;
        $loading.finish(submitButton);
        form.setErrors(response);
        selectors = [];
        ref = _.keys(response);
        for (i = 0, len = ref.length; i < len; i++) {
          error_field = ref[i];
          selectors.push("[name=" + error_field + "]");
        }
        $el.find(".active").removeClass("active");
        error_step = $el.find(selectors.join(",")).first().parents(".wizard-step");
        error_step.addClass("active");
        return $el.find('.progress-bar').removeClass().addClass('progress-bar').addClass(error_step.data("step"));
      };
      submit = (function(_this) {
        return function(event) {
          var promise;
          event.preventDefault();
          if (!form.validate()) {
            return;
          }
          $loading.start(submitButton);
          promise = $repo.create("projects", $scope.data);
          return promise.then(onSuccessSubmit, onErrorSubmit);
        };
      })(this);
      openLightbox = function() {
        $scope.data = {
          total_story_points: 100,
          total_milestones: 5
        };
        if (!$scope.templates.length) {
          $rs.projects.templates().then((function(_this) {
            return function(result) {
              $scope.templates = result;
              return $scope.data.creation_template = _.head(_.filter($scope.templates, function(x) {
                return x.slug === "scrum";
              })).id;
            };
          })(this));
        } else {
          $scope.data.creation_template = _.head(_.filter($scope.templates, function(x) {
            return x.slug === "scrum";
          })).id;
        }
        $el.find(".active").removeClass("active");
        $el.find(".create-step1").addClass("active");
        lightboxService.open($el);
        return timeout(600, function() {
          return $el.find(".progress-bar").addClass('step1');
        });
      };
      $el.on("click", ".button-next", function(event) {
        var current, field, i, len, next, ref, step, valid;
        event.preventDefault();
        current = $el.find(".active");
        valid = true;
        ref = form.fields;
        for (i = 0, len = ref.length; i < len; i++) {
          field = ref[i];
          if (current.find("[name=" + (field.element.attr('name')) + "]").length) {
            valid = field.validate() !== false && valid;
          }
        }
        if (!valid) {
          return;
        }
        next = current.next();
        current.toggleClass('active');
        next.toggleClass('active');
        step = next.data('step');
        return $el.find('.progress-bar').removeClass().addClass('progress-bar').addClass(step);
      });
      $el.on("click", ".button-prev", function(event) {
        var current, prev, step;
        event.preventDefault();
        current = $el.find(".active");
        prev = current.prev();
        current.toggleClass('active');
        prev.toggleClass('active');
        step = prev.data('step');
        return $el.find('.progress-bar').removeClass().addClass('progress-bar').addClass(step);
      });
      submitButton = $el.find(".submit-button");
      $el.on("submit", "form", submit);
      $el.on("click", ".close", function(event) {
        event.preventDefault();
        return lightboxService.close($el);
      });
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      return openLightbox();
    };
    directive = {
      link: link,
      templateUrl: "project/wizard-create-project.html",
      scope: {}
    };
    return directive;
  };

  module.directive("tgLbCreateProject", ["$rootScope", "$tgRepo", "$tgConfirm", "$location", "$tgNavUrls", "$tgResources", "$projectUrl", "$tgLoading", "lightboxService", "$cacheFactory", "$translate", "tgCurrentUserService", CreateProject]);

  DeleteProjectDirective = function($repo, $rootscope, $auth, $location, $navUrls, $confirm, lightboxService, tgLoader, currentUserService) {
    var link;
    link = function($scope, $el, $attrs) {
      var projectToDelete, submit;
      projectToDelete = null;
      $scope.$on("deletelightbox:new", function(ctx, project) {
        lightboxService.open($el);
        return projectToDelete = project;
      });
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      submit = function() {
        var promise;
        tgLoader.start();
        lightboxService.close($el);
        promise = $repo.remove(projectToDelete);
        promise.then(function(data) {
          tgLoader.pageLoaded();
          $rootscope.$broadcast("projects:reload");
          $location.path($navUrls.resolve("home"));
          $confirm.notify("success");
          return currentUserService.loadProjects();
        });
        return promise.then(null, function() {
          $confirm.notify("error");
          return lightboxService.close($el);
        });
      };
      $el.on("click", ".button-red", function(event) {
        event.preventDefault();
        return lightboxService.close($el);
      });
      return $el.on("click", ".button-green", function(event) {
        event.preventDefault();
        return submit();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgLbDeleteProject", ["$tgRepo", "$rootScope", "$tgAuth", "$tgLocation", "$tgNavUrls", "$tgConfirm", "lightboxService", "tgLoader", "tgCurrentUserService", DeleteProjectDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/base/bind.coffee
 */

(function() {
  var BindHtmlDirective, BindOnceAltDirective, BindOnceBindDirective, BindOnceHrefDirective, BindOnceHtmlDirective, BindOnceRefDirective, BindOnceSrcDirective, BindOnceTitleDirective, BindTitleDirective, bindOnce, module;

  bindOnce = this.taiga.bindOnce;

  BindOnceBindDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      return bindOnce($scope, $attrs.tgBoBind, function(val) {
        return $el.text(val);
      });
    };
    return {
      link: link
    };
  };

  BindOnceHtmlDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      return bindOnce($scope, $attrs.tgBoHtml, function(val) {
        return $el.html(val);
      });
    };
    return {
      link: link
    };
  };

  BindOnceRefDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      return bindOnce($scope, $attrs.tgBoRef, function(val) {
        return $el.html("#" + val + " ");
      });
    };
    return {
      link: link
    };
  };

  BindOnceSrcDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      return bindOnce($scope, $attrs.tgBoSrc, function(val) {
        return $el.attr("src", val);
      });
    };
    return {
      link: link
    };
  };

  BindOnceHrefDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      return bindOnce($scope, $attrs.tgBoHref, function(val) {
        return $el.attr("href", val);
      });
    };
    return {
      link: link
    };
  };

  BindOnceAltDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      return bindOnce($scope, $attrs.tgBoAlt, function(val) {
        return $el.attr("alt", val);
      });
    };
    return {
      link: link
    };
  };

  BindOnceTitleDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      return bindOnce($scope, $attrs.tgBoTitle, function(val) {
        return $el.attr("title", val);
      });
    };
    return {
      link: link
    };
  };

  BindTitleDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      return $scope.$watch($attrs.tgTitleHtml, function(val) {
        if (val != null) {
          return $el.attr("title", val);
        }
      });
    };
    return {
      link: link
    };
  };

  BindHtmlDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      return $scope.$watch($attrs.tgBindHtml, function(val) {
        if (val != null) {
          return $el.html(val);
        }
      });
    };
    return {
      link: link
    };
  };

  module = angular.module("taigaBase");

  module.directive("tgBoBind", BindOnceBindDirective);

  module.directive("tgBoHtml", BindOnceHtmlDirective);

  module.directive("tgBoRef", BindOnceRefDirective);

  module.directive("tgBoSrc", BindOnceSrcDirective);

  module.directive("tgBoHref", BindOnceHrefDirective);

  module.directive("tgBoAlt", BindOnceAltDirective);

  module.directive("tgBoTitle", BindOnceTitleDirective);

  module.directive("tgBindTitle", BindTitleDirective);

  module.directive("tgBindHtml", BindHtmlDirective);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/base/conf.coffee
 */

(function() {
  var ConfigurationService, module;

  ConfigurationService = (function() {
    function ConfigurationService() {
      this.config = window.taigaConfig;
    }

    ConfigurationService.prototype.get = function(key, defaultValue) {
      if (defaultValue == null) {
        defaultValue = null;
      }
      if (_.has(this.config, key)) {
        return this.config[key];
      }
      return defaultValue;
    };

    return ConfigurationService;

  })();

  module = angular.module("taigaBase");

  module.service("$tgConfig", ConfigurationService);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/base/contrib.coffee
 */

(function() {
  var ContribController, module, taigaContribPlugins,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taigaContribPlugins = this.taigaContribPlugins = this.taigaContribPlugins || [];

  ContribController = (function(superClass) {
    extend(ContribController, superClass);

    ContribController.$inject = ["$rootScope", "$scope", "$routeParams", "$tgRepo", "$tgResources", "$tgConfirm"];

    function ContribController(rootScope, scope, params, repo, rs, confirm) {
      var promise;
      this.rootScope = rootScope;
      this.scope = scope;
      this.params = params;
      this.repo = repo;
      this.rs = rs;
      this.confirm = confirm;
      this.scope.adminPlugins = _.where(this.rootScope.contribPlugins, {
        "type": "admin"
      });
      this.scope.currentPlugin = _.first(_.where(this.scope.adminPlugins, {
        "slug": this.params.plugin
      }));
      this.scope.pluginTemplate = "contrib/" + this.scope.currentPlugin.slug;
      this.scope.projectSlug = this.params.pslug;
      promise = this.loadInitialData();
      promise.then(null, (function(_this) {
        return function() {
          return _this.confirm.notify("error");
        };
      })(this));
    }

    ContribController.prototype.loadProject = function() {
      return this.rs.projects.getBySlug(this.params.pslug).then((function(_this) {
        return function(project) {
          _this.scope.projectId = project.id;
          _this.scope.project = project;
          _this.scope.$emit('project:loaded', project);
          _this.scope.$broadcast('project:loaded', project);
          return project;
        };
      })(this));
    };

    ContribController.prototype.loadInitialData = function() {
      return this.loadProject();
    };

    return ContribController;

  })(taiga.Controller);

  module = angular.module("taigaBase");

  module.controller("ContribController", ContribController);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/base/filters.coffee
 */

(function() {
  var FiltersStorageService, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  FiltersStorageService = (function(superClass) {
    extend(FiltersStorageService, superClass);

    FiltersStorageService.$inject = ["$tgStorage", "$routeParams"];

    function FiltersStorageService(storage, params) {
      this.storage = storage;
      this.params = params;
    }

    FiltersStorageService.prototype.generateHash = function(components) {
      if (components == null) {
        components = [];
      }
      components = _.map(components, function(x) {
        return JSON.stringify(x);
      });
      return hex_sha1(components.join(":"));
    };

    return FiltersStorageService;

  })(taiga.Service);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/base/http.coffee
 */

(function() {
  var HttpService, module, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  HttpService = (function(superClass) {
    extend(HttpService, superClass);

    HttpService.$inject = ["$http", "$q", "$tgStorage", "$rootScope", "$cacheFactory", "$translate"];

    function HttpService(http, q, storage, rootScope, cacheFactory, translate) {
      this.http = http;
      this.q = q;
      this.storage = storage;
      this.rootScope = rootScope;
      this.cacheFactory = cacheFactory;
      this.translate = translate;
      HttpService.__super__.constructor.call(this);
      this.cache = this.cacheFactory("httpget");
    }

    HttpService.prototype.headers = function() {
      var headers, lang, token;
      headers = {};
      token = this.storage.get('token');
      if (token) {
        headers["Authorization"] = "Bearer " + token;
      }
      lang = this.translate.preferredLanguage();
      if (lang) {
        headers["Accept-Language"] = lang;
      }
      return headers;
    };

    HttpService.prototype.request = function(options) {
      options.headers = _.merge({}, options.headers || {}, this.headers());
      if (_.isPlainObject(options.data)) {
        options.data = JSON.stringify(options.data);
      }
      return this.http(options);
    };

    HttpService.prototype.get = function(url, params, options) {
      options = _.merge({
        method: "GET",
        url: url
      }, options);
      if (params) {
        options.params = params;
      }
      options.cache = this.cache;
      return this.request(options)["finally"]((function(_this) {
        return function(data) {
          return _this.cache.removeAll();
        };
      })(this));
    };

    HttpService.prototype.post = function(url, data, params, options) {
      options = _.merge({
        method: "POST",
        url: url
      }, options);
      if (data) {
        options.data = data;
      }
      if (params) {
        options.params = params;
      }
      return this.request(options);
    };

    HttpService.prototype.put = function(url, data, params, options) {
      options = _.merge({
        method: "PUT",
        url: url
      }, options);
      if (data) {
        options.data = data;
      }
      if (params) {
        options.params = params;
      }
      return this.request(options);
    };

    HttpService.prototype.patch = function(url, data, params, options) {
      options = _.merge({
        method: "PATCH",
        url: url
      }, options);
      if (data) {
        options.data = data;
      }
      if (params) {
        options.params = params;
      }
      return this.request(options);
    };

    HttpService.prototype["delete"] = function(url, data, params, options) {
      options = _.merge({
        method: "DELETE",
        url: url
      }, options);
      if (data) {
        options.data = data;
      }
      if (params) {
        options.params = params;
      }
      return this.request(options);
    };

    return HttpService;

  })(taiga.Service);

  module = angular.module("taigaBase");

  module.service("$tgHttp", HttpService);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/base/location.coffee
 */

(function() {
  var locationFactory, module;

  locationFactory = function($location, $route, $rootscope) {
    $location.noreload = function(scope) {
      var lastRoute, un;
      lastRoute = $route.current;
      un = scope.$on("$locationChangeSuccess", function() {
        $route.current = lastRoute;
        return un();
      });
      return $location;
    };
    $location.isInCurrentRouteParams = function(name, value) {
      var params;
      params = $location.search() || {};
      return params[name] === value;
    };
    return $location;
  };

  module = angular.module("taigaBase");

  module.factory("$tgLocation", ["$location", "$route", "$rootScope", locationFactory]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/base/model.coffee
 */

(function() {
  var Model, ModelService, module, provider, taiga,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Model = (function() {
    function Model(name, data, dataTypes) {
      this._attrs = data;
      this._name = name;
      this._dataTypes = dataTypes;
      this.setAttrs(data);
      this.initialize();
    }

    Model.prototype.clone = function() {
      var instance;
      instance = new Model(this._name, this._attrs, this._dataTypes);
      instance._modifiedAttrs = this._modifiedAttrs;
      instance._isModified = this._isModified;
      return instance;
    };

    Model.prototype.applyCasts = function() {
      var attrName, castMethod, castName, ref, results;
      ref = this._dataTypes;
      results = [];
      for (attrName in ref) {
        castName = ref[attrName];
        castMethod = service.casts[castName];
        if (!castMethod) {
          continue;
        }
        results.push(this._attrs[attrName] = castMethod(this._attrs[attrName]));
      }
      return results;
    };

    Model.prototype.getIdAttrName = function() {
      return "id";
    };

    Model.prototype.getName = function() {
      return this._name;
    };

    Model.prototype.getAttrs = function(patch) {
      if (patch == null) {
        patch = false;
      }
      if (this._attrs.version != null) {
        this._modifiedAttrs.version = this._attrs.version;
      }
      if (patch) {
        return _.extend({}, this._modifiedAttrs);
      }
      return _.extend({}, this._attrs, this._modifiedAttrs);
    };

    Model.prototype.setAttrs = function(attrs) {
      this._attrs = attrs;
      this._modifiedAttrs = {};
      this.applyCasts();
      return this._isModified = false;
    };

    Model.prototype.setAttr = function(name, value) {
      this._modifiedAttrs[name] = value;
      return this._isModified = true;
    };

    Model.prototype.initialize = function() {
      var getter, self, setter;
      self = this;
      getter = function(name) {
        return function() {
          if (typeof name === 'string' && name.substr(0, 2) === "__") {
            return self[name];
          }
          if (indexOf.call(_.keys(self._modifiedAttrs), name) < 0) {
            return self._attrs[name];
          }
          return self._modifiedAttrs[name];
        };
      };
      setter = function(name) {
        return function(value) {
          if (typeof name === 'string' && name.substr(0, 2) === "__") {
            self[name] = value;
            return;
          }
          if (self._attrs[name] !== value) {
            self._modifiedAttrs[name] = value;
            self._isModified = true;
          } else {
            delete self._modifiedAttrs[name];
          }
        };
      };
      return _.each(this._attrs, function(value, name) {
        var options;
        options = {
          get: getter(name),
          set: setter(name),
          enumerable: true,
          configurable: true
        };
        return Object.defineProperty(self, name, options);
      });
    };

    Model.prototype.serialize = function() {
      var data;
      data = {
        "data": _.clone(this._attrs),
        "name": this._name
      };
      return JSON.stringify(data);
    };

    Model.prototype.isModified = function() {
      return this._isModified;
    };

    Model.prototype.isAttributeModified = function(attribute) {
      return this._modifiedAttrs[attribute] != null;
    };

    Model.prototype.markSaved = function() {
      this._isModified = false;
      this._attrs = this.getAttrs();
      return this._modifiedAttrs = {};
    };

    Model.prototype.revert = function() {
      this._modifiedAttrs = {};
      return this._isModified = false;
    };

    Model.desSerialize = function(sdata) {
      var ddata, model;
      ddata = JSON.parse(sdata);
      model = new Model(ddata.url, ddata.data);
      return model;
    };

    return Model;

  })();

  taiga = this.taiga;

  ModelService = (function(superClass) {
    extend(ModelService, superClass);

    ModelService.$inject = ["$q", "$tgUrls", "$tgStorage", "$tgHttp"];

    function ModelService(q, urls, storage, http) {
      this.q = q;
      this.urls = urls;
      this.storage = storage;
      this.http = http;
      ModelService.__super__.constructor.call(this);
    }

    return ModelService;

  })(taiga.Service);

  provider = function($q, $http, $gmUrls, $gmStorage) {
    var service;
    service = {};
    service.make_model = function(name, data, cls, dataTypes) {
      if (cls == null) {
        cls = Model;
      }
      if (dataTypes == null) {
        dataTypes = {};
      }
      return new cls(name, data, dataTypes);
    };
    service.cls = Model;
    service.casts = {
      int: function(value) {
        return parseInt(value, 10);
      },
      float: function(value) {
        return parseFloat(value, 10);
      }
    };
    return service;
  };

  module = angular.module("taigaBase");

  module.factory("$tgModel", ["$q", "$http", "$tgUrls", "$tgStorage", provider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/base/navurl.coffee
 */

(function() {
  var NavigationUrlsDirective, NavigationUrlsService, bindOnce, module, taiga, trim,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  trim = this.taiga.trim;

  bindOnce = this.taiga.bindOnce;

  module = angular.module("taigaBase");

  NavigationUrlsService = (function(superClass) {
    extend(NavigationUrlsService, superClass);

    function NavigationUrlsService() {
      this.urls = {};
    }

    NavigationUrlsService.prototype.update = function(urls) {
      return this.urls = _.merge({}, this.urls, urls || {});
    };

    NavigationUrlsService.prototype.formatUrl = function(url, ctx) {
      var replacer;
      if (ctx == null) {
        ctx = {};
      }
      replacer = function(match) {
        match = trim(match, ":");
        return ctx[match] || "undefined";
      };
      return url.replace(/(:\w+)/g, replacer);
    };

    NavigationUrlsService.prototype.resolve = function(name, ctx) {
      var url;
      url = this.urls[name];
      if (!url) {
        return "";
      }
      if (ctx) {
        return this.formatUrl(url, ctx);
      }
      return url;
    };

    return NavigationUrlsService;

  })(taiga.Service);

  module.service("$tgNavUrls", NavigationUrlsService);

  NavigationUrlsDirective = function($navurls, $auth, $q, $location) {
    var bindOnceP, link, parseNav;
    bindOnceP = function($scope, attr) {
      var defered;
      defered = $q.defer();
      bindOnce($scope, attr, function(v) {
        return defered.resolve(v);
      });
      return defered.promise;
    };
    parseNav = function(data, $scope) {
      var index, name, obj, params, promises, ref, result, values;
      ref = _.map(data.split(":"), trim), name = ref[0], params = ref[1];
      if (params) {
        result = params.split(/(\w+)=/);
        result = _.filter(result, function(str) {
          return str.length;
        });
        result = _.map(result, function(str) {
          return trim(str.replace(/,$/g, ''));
        });
        params = [];
        index = 0;
        while (index < result.length) {
          obj = {};
          obj[result[index]] = result[index + 1];
          params.push(obj);
          index = index + 2;
        }
      } else {
        params = [];
      }
      values = _.map(params, function(param) {
        return _.values(param)[0];
      });
      promises = _.map(values, function(x) {
        return bindOnceP($scope, x);
      });
      return $q.all(promises).then(function() {
        var i, key, len, options, param, value;
        options = {};
        for (i = 0, len = params.length; i < len; i++) {
          param = params[i];
          key = Object.keys(param)[0];
          value = param[key];
          options[key] = $scope.$eval(value);
        }
        return [name, options];
      });
    };
    link = function($scope, $el, $attrs) {
      if ($el.is("a")) {
        $el.attr("href", "#");
      }
      $el.on("mouseenter", function(event) {
        var target;
        target = $(event.currentTarget);
        if (!target.data("fullUrl")) {
          return parseNav($attrs.tgNav, $scope).then(function(result) {
            var fullUrl, getURLParams, getURLParamsStr, name, options, url, user;
            name = result[0], options = result[1];
            user = $auth.getUser();
            if (user) {
              options.user = user.username;
            }
            url = $navurls.resolve(name);
            fullUrl = $navurls.formatUrl(url, options);
            if ($attrs.tgNavGetParams) {
              getURLParams = JSON.parse($attrs.tgNavGetParams);
              getURLParamsStr = $.param(getURLParams);
              fullUrl = fullUrl + "?" + getURLParamsStr;
            }
            target.data("fullUrl", fullUrl);
            if (target.is("a")) {
              target.attr("href", fullUrl);
            }
            return $el.on("click", function(event) {
              if (event.metaKey || event.ctrlKey) {
                return;
              }
              event.preventDefault();
              target = $(event.currentTarget);
              if (target.hasClass('noclick')) {
                return;
              }
              fullUrl = target.data("fullUrl");
              switch (event.which) {
                case 1:
                  $location.url(fullUrl);
                  return $scope.$apply();
                case 2:
                  return window.open(fullUrl);
              }
            });
          });
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgNav", ["$tgNavUrls", "$tgAuth", "$q", "$tgLocation", NavigationUrlsDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/base/repository.coffee
 */

(function() {
  var RepositoryService, module, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  RepositoryService = (function(superClass) {
    extend(RepositoryService, superClass);

    RepositoryService.$inject = ["$q", "$tgModel", "$tgStorage", "$tgHttp", "$tgUrls"];

    function RepositoryService(q, model1, storage, http, urls) {
      this.q = q;
      this.model = model1;
      this.storage = storage;
      this.http = http;
      this.urls = urls;
      RepositoryService.__super__.constructor.call(this);
    }

    RepositoryService.prototype.resolveUrlForModel = function(model) {
      var idAttrName;
      idAttrName = model.getIdAttrName();
      return (this.urls.resolve(model.getName())) + "/" + model[idAttrName];
    };

    RepositoryService.prototype.resolveUrlForAttributeModel = function(model) {
      return this.urls.resolve(model.getName(), model.parent);
    };

    RepositoryService.prototype.create = function(name, data, dataTypes, extraParams) {
      var defered, promise, url;
      if (dataTypes == null) {
        dataTypes = {};
      }
      if (extraParams == null) {
        extraParams = {};
      }
      defered = this.q.defer();
      url = this.urls.resolve(name);
      promise = this.http.post(url, JSON.stringify(data));
      promise.success((function(_this) {
        return function(_data, _status) {
          return defered.resolve(_this.model.make_model(name, _data, null, dataTypes));
        };
      })(this));
      promise.error((function(_this) {
        return function(data, status) {
          return defered.reject(data);
        };
      })(this));
      return defered.promise;
    };

    RepositoryService.prototype.remove = function(model, params) {
      var defered, promise, url;
      if (params == null) {
        params = {};
      }
      defered = this.q.defer();
      url = this.resolveUrlForModel(model);
      promise = this.http["delete"](url, {}, params);
      promise.success(function(data, status) {
        return defered.resolve(model);
      });
      promise.error(function(data, status) {
        return defered.reject(model);
      });
      return defered.promise;
    };

    RepositoryService.prototype.saveAll = function(models, patch) {
      var promises;
      if (patch == null) {
        patch = true;
      }
      promises = _.map(models, (function(_this) {
        return function(x) {
          return _this.save(x, true);
        };
      })(this));
      return this.q.all(promises);
    };

    RepositoryService.prototype.save = function(model, patch) {
      var data, defered, promise, url;
      if (patch == null) {
        patch = true;
      }
      defered = this.q.defer();
      if (!model.isModified() && patch) {
        defered.resolve(model);
        return defered.promise;
      }
      url = this.resolveUrlForModel(model);
      data = JSON.stringify(model.getAttrs(patch));
      if (patch) {
        promise = this.http.patch(url, data);
      } else {
        promise = this.http.put(url, data);
      }
      promise.success((function(_this) {
        return function(data, status) {
          model._isModified = false;
          model._attrs = _.extend(model.getAttrs(), data);
          model._modifiedAttrs = {};
          model.applyCasts();
          return defered.resolve(model);
        };
      })(this));
      promise.error(function(data, status) {
        return defered.reject(data);
      });
      return defered.promise;
    };

    RepositoryService.prototype.saveAttribute = function(model, attribute, patch) {
      var data, defered, promise, url;
      if (patch == null) {
        patch = true;
      }
      defered = this.q.defer();
      if (!model.isModified() && patch) {
        defered.resolve(model);
        return defered.promise;
      }
      url = this.resolveUrlForAttributeModel(model);
      data = {};
      data[attribute] = model.getAttrs();
      if (patch) {
        promise = this.http.patch(url, data);
      } else {
        promise = this.http.put(url, data);
      }
      promise.success((function(_this) {
        return function(data, status) {
          model._isModified = false;
          model._attrs = _.extend(model.getAttrs(), data);
          model._modifiedAttrs = {};
          model.applyCasts();
          return defered.resolve(model);
        };
      })(this));
      promise.error(function(data, status) {
        return defered.reject(data);
      });
      return defered.promise;
    };

    RepositoryService.prototype.refresh = function(model) {
      var defered, promise, url;
      defered = this.q.defer();
      url = this.resolveUrlForModel(model);
      promise = this.http.get(url);
      promise.success(function(data, status) {
        model._modifiedAttrs = {};
        model._attrs = data;
        model._isModified = false;
        model.applyCasts();
        return defered.resolve(model);
      });
      promise.error(function(data, status) {
        return defered.reject(data);
      });
      return defered.promise;
    };

    RepositoryService.prototype.queryMany = function(name, params, options) {
      var httpOptions, url;
      if (options == null) {
        options = {};
      }
      url = this.urls.resolve(name);
      httpOptions = {
        headers: {}
      };
      if (!options.enablePagination) {
        httpOptions.headers["x-disable-pagination"] = "1";
      }
      return this.http.get(url, params, httpOptions).then((function(_this) {
        return function(data) {
          return _.map(data.data, function(x) {
            return _this.model.make_model(name, x);
          });
        };
      })(this));
    };

    RepositoryService.prototype.queryOneAttribute = function(name, id, attribute, params, options) {
      var httpOptions, url;
      if (options == null) {
        options = {};
      }
      url = this.urls.resolve(name, id);
      httpOptions = {
        headers: {}
      };
      if (!options.enablePagination) {
        httpOptions.headers["x-disable-pagination"] = "1";
      }
      return this.http.get(url, params, httpOptions).then((function(_this) {
        return function(data) {
          var model;
          model = _this.model.make_model(name, data.data[attribute]);
          model.parent = id;
          return model;
        };
      })(this));
    };

    RepositoryService.prototype.queryOne = function(name, id, params, options) {
      var httpOptions, url;
      if (options == null) {
        options = {};
      }
      url = this.urls.resolve(name);
      if (id) {
        url = url + "/" + id;
      }
      httpOptions = {
        headers: {}
      };
      if (!options.enablePagination) {
        httpOptions.headers["x-disable-pagination"] = "1";
      }
      return this.http.get(url, params, httpOptions).then((function(_this) {
        return function(data) {
          return _this.model.make_model(name, data.data);
        };
      })(this));
    };

    RepositoryService.prototype.queryOneRaw = function(name, id, params, options) {
      var httpOptions, url;
      if (options == null) {
        options = {};
      }
      url = this.urls.resolve(name);
      if (id) {
        url = url + "/" + id;
      }
      httpOptions = _.merge({
        headers: {}
      }, options);
      if (!options.enablePagination) {
        httpOptions.headers["x-disable-pagination"] = "1";
      }
      return this.http.get(url, params, httpOptions).then((function(_this) {
        return function(data) {
          return data.data;
        };
      })(this));
    };

    RepositoryService.prototype.queryPaginated = function(name, params, options) {
      var httpOptions, url;
      if (options == null) {
        options = {};
      }
      url = this.urls.resolve(name);
      httpOptions = _.merge({
        headers: {}
      }, options);
      return this.http.get(url, params, httpOptions).then((function(_this) {
        return function(data) {
          var headers, result;
          headers = data.headers();
          result = {};
          result.models = _.map(data.data, function(x) {
            return _this.model.make_model(name, x);
          });
          result.count = parseInt(headers["x-pagination-count"], 10);
          result.current = parseInt(headers["x-pagination-current"] || 1, 10);
          result.paginatedBy = parseInt(headers["x-paginated-by"], 10);
          return result;
        };
      })(this));
    };

    RepositoryService.prototype.queryOnePaginatedRaw = function(name, id, params, options) {
      var httpOptions, url;
      if (options == null) {
        options = {};
      }
      url = this.urls.resolve(name);
      if (id) {
        url = url + "/" + id;
      }
      httpOptions = _.merge({
        headers: {}
      }, options);
      return this.http.get(url, params, httpOptions).then((function(_this) {
        return function(data) {
          var headers, result;
          headers = data.headers();
          result = {};
          result.data = data.data;
          result.count = parseInt(headers["x-pagination-count"], 10);
          result.current = parseInt(headers["x-pagination-current"] || 1, 10);
          result.paginatedBy = parseInt(headers["x-paginated-by"], 10);
          return result;
        };
      })(this));
    };

    RepositoryService.prototype.resolve = function(options) {
      var cache, params;
      params = {};
      if (options.pslug != null) {
        params.project = options.pslug;
      }
      if (options.usref != null) {
        params.us = options.usref;
      }
      if (options.taskref != null) {
        params.task = options.taskref;
      }
      if (options.issueref != null) {
        params.issue = options.issueref;
      }
      if (options.sslug != null) {
        params.milestone = options.sslug;
      }
      if (options.wikipage != null) {
        params.wikipage = options.wikipage;
      }
      cache = !(options.wikipage || options.sslug);
      return this.queryOneRaw("resolver", null, params, {
        cache: cache
      });
    };

    return RepositoryService;

  })(taiga.Service);

  module = angular.module("taigaBase");

  module.service("$tgRepo", RepositoryService);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/base/storage.coffee
 */

(function() {
  var StorageService, module, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  StorageService = (function(superClass) {
    extend(StorageService, superClass);

    StorageService.$inject = ["$rootScope"];

    function StorageService($rootScope) {
      StorageService.__super__.constructor.call(this);
    }

    StorageService.prototype.get = function(key, _default) {
      var serializedValue;
      serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return _default || null;
      }
      return JSON.parse(serializedValue);
    };

    StorageService.prototype.set = function(key, val) {
      if (_.isObject(key)) {
        return _.each(key, (function(_this) {
          return function(val, key) {
            return _this.set(key, val);
          };
        })(this));
      } else {
        return localStorage.setItem(key, JSON.stringify(val));
      }
    };

    StorageService.prototype.contains = function(key) {
      var value;
      value = this.get(key);
      return value !== null;
    };

    StorageService.prototype.remove = function(key) {
      return localStorage.removeItem(key);
    };

    StorageService.prototype.clear = function() {
      return localStorage.clear();
    };

    return StorageService;

  })(taiga.Service);

  module = angular.module("taigaBase");

  module.service("$tgStorage", StorageService);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/base/http.coffee
 */

(function() {
  var UrlsService, format, module, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  format = function(fmt, obj) {
    obj = _.clone(obj);
    return fmt.replace(/%s/g, function(match) {
      return String(obj.shift());
    });
  };

  taiga = this.taiga;

  UrlsService = (function(superClass) {
    extend(UrlsService, superClass);

    UrlsService.$inject = ["$tgConfig"];

    function UrlsService(config) {
      this.config = config;
      this.urls = {};
      this.mainUrl = this.config.get("api");
    }

    UrlsService.prototype.update = function(urls) {
      return this.urls = _.merge(this.urls, urls);
    };

    UrlsService.prototype.resolve = function() {
      var args, name, url;
      args = _.toArray(arguments);
      if (args.length === 0) {
        throw Error("wrong arguments to setUrls");
      }
      name = args.slice(0, 1)[0];
      url = format(this.urls[name], args.slice(1));
      return format("%s/%s", [_.str.rtrim(this.mainUrl, "/"), _.str.ltrim(url, "/")]);
    };

    UrlsService.prototype.resolveAbsolute = function() {
      var url;
      url = this.resolve.apply(this, arguments);
      if (/^https?:\/\//i.test(url)) {
        return url;
      }
      if (/^\//.test(url)) {
        return window.location.protocol + "//" + window.location.host + url;
      }
      return window.location.protocol + "//" + window.location.host + "/" + url;
    };

    return UrlsService;

  })(taiga.Service);

  module = angular.module("taigaBase");

  module.service('$tgUrls', UrlsService);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/attachments.coffee
 */

(function() {
  var module, resourceProvider, sizeFormat, taiga;

  taiga = this.taiga;

  sizeFormat = this.taiga.sizeFormat;

  resourceProvider = function($rootScope, $config, $urls, $model, $repo, $auth, $q) {
    var service;
    service = {};
    service.list = function(urlName, objectId, projectId) {
      var params;
      params = {
        object_id: objectId,
        project: projectId
      };
      return $repo.queryMany(urlName, params);
    };
    service.create = function(urlName, projectId, objectId, file) {
      var data, defered, maxFileSize, response, uploadComplete, uploadFailed, uploadProgress, xhr;
      defered = $q.defer();
      if (file === void 0) {
        defered.reject(null);
        return defered.promise;
      }
      maxFileSize = $config.get("maxUploadFileSize", null);
      if (maxFileSize && file.size > maxFileSize) {
        response = {
          status: 413,
          data: {
            _error_message: "'" + file.name + "' (" + (sizeFormat(file.size)) + ") is too heavy for our oompa loompas, try it with a smaller than (" + (sizeFormat(maxFileSize)) + ")"
          }
        };
        defered.reject(response);
        return defered.promise;
      }
      uploadProgress = (function(_this) {
        return function(evt) {
          return $rootScope.$apply(function() {
            file.status = "in-progress";
            file.size = sizeFormat(evt.total);
            file.progressMessage = "upload " + (sizeFormat(evt.loaded)) + " of " + (sizeFormat(evt.total));
            return file.progressPercent = (Math.round((evt.loaded / evt.total) * 100)) + "%";
          });
        };
      })(this);
      uploadComplete = (function(_this) {
        return function(evt) {
          return $rootScope.$apply(function() {
            var data, model, ref, status;
            file.status = "done";
            status = evt.target.status;
            try {
              data = JSON.parse(evt.target.responseText);
            } catch (_error) {
              data = {};
            }
            if (status >= 200 && status < 400) {
              model = $model.make_model(urlName, data);
              return defered.resolve(model);
            } else {
              response = {
                status: status,
                data: {
                  _error_message: (ref = data['attached_file']) != null ? ref[0] : void 0
                }
              };
              return defered.reject(response);
            }
          });
        };
      })(this);
      uploadFailed = (function(_this) {
        return function(evt) {
          return $rootScope.$apply(function() {
            file.status = "error";
            return defered.reject("fail");
          });
        };
      })(this);
      data = new FormData();
      data.append("project", projectId);
      data.append("object_id", objectId);
      data.append("attached_file", file);
      xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", uploadProgress, false);
      xhr.addEventListener("load", uploadComplete, false);
      xhr.addEventListener("error", uploadFailed, false);
      xhr.open("POST", $urls.resolve(urlName));
      xhr.setRequestHeader("Authorization", "Bearer " + ($auth.getToken()));
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(data);
      return defered.promise;
    };
    return function(instance) {
      return instance.attachments = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgAttachmentsResourcesProvider", ["$rootScope", "$tgConfig", "$tgUrls", "$tgModel", "$tgRepo", "$tgAuth", "$q", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/custom-field-values.coffee
 */

(function() {
  var module, resourceProvider, taiga;

  taiga = this.taiga;

  resourceProvider = function($repo) {
    var _get, service;
    _get = function(objectId, resource) {
      return $repo.queryOne(resource, objectId);
    };
    service = {
      userstory: {
        get: function(objectId) {
          return _get(objectId, "custom-attributes-values/userstory");
        }
      },
      task: {
        get: function(objectId) {
          return _get(objectId, "custom-attributes-values/task");
        }
      },
      issue: {
        get: function(objectId) {
          return _get(objectId, "custom-attributes-values/issue");
        }
      }
    };
    return function(instance) {
      return instance.customAttributesValues = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgCustomAttributesValuesResourcesProvider", ["$tgRepo", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/projects.coffee
 */

(function() {
  var module, resourceProvider, sizeFormat, taiga;

  taiga = this.taiga;

  sizeFormat = this.taiga.sizeFormat;

  resourceProvider = function($repo) {
    var _list, service;
    _list = function(projectId, resource) {
      return $repo.queryMany(resource, {
        project: projectId
      });
    };
    service = {
      userstory: {
        list: function(projectId) {
          return _list(projectId, "custom-attributes/userstory");
        }
      },
      task: {
        list: function(projectId) {
          return _list(projectId, "custom-attributes/task");
        }
      },
      issue: {
        list: function(projectId) {
          return _list(projectId, "custom-attributes/issue");
        }
      }
    };
    return function(instance) {
      return instance.customAttributes = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgCustomAttributesResourcesProvider", ["$tgRepo", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/history.coffee
 */

(function() {
  var module, resourceProvider, taiga;

  taiga = this.taiga;

  resourceProvider = function($repo, $http, $urls) {
    var service;
    service = {};
    service.get = function(type, objectId) {
      return $repo.queryOneRaw("history/" + type, objectId);
    };
    service.deleteComment = function(type, objectId, activityId) {
      var params, url;
      url = $urls.resolve("history/" + type);
      url = url + "/" + objectId + "/delete_comment";
      params = {
        id: activityId
      };
      return $http.post(url, null, params).then((function(_this) {
        return function(data) {
          return data.data;
        };
      })(this));
    };
    service.undeleteComment = function(type, objectId, activityId) {
      var params, url;
      url = $urls.resolve("history/" + type);
      url = url + "/" + objectId + "/undelete_comment";
      params = {
        id: activityId
      };
      return $http.post(url, null, params).then((function(_this) {
        return function(data) {
          return data.data;
        };
      })(this));
    };
    return function(instance) {
      return instance.history = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgHistoryResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/projects.coffee
 */

(function() {
  var module, resourceProvider, taiga;

  taiga = this.taiga;

  resourceProvider = function($repo) {
    var service;
    service = {};
    service.get = function(token) {
      return $repo.queryOne("invitations", token);
    };
    return function(instance) {
      return instance.invitations = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgInvitationsResourcesProvider", ["$tgRepo", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/issues.coffee
 */

(function() {
  var generateHash, module, resourceProvider, taiga;

  taiga = this.taiga;

  generateHash = taiga.generateHash;

  resourceProvider = function($repo, $http, $urls, $storage, $q) {
    var filtersHashSuffix, hashSuffix, myFiltersHashSuffix, service;
    service = {};
    hashSuffix = "issues-queryparams";
    filtersHashSuffix = "issues-filters";
    myFiltersHashSuffix = "issues-my-filters";
    service.get = function(projectId, issueId) {
      var params;
      params = service.getQueryParams(projectId);
      params.project = projectId;
      return $repo.queryOne("issues", issueId, params);
    };
    service.getByRef = function(projectId, ref) {
      var params;
      params = service.getQueryParams(projectId);
      params.project = projectId;
      params.ref = ref;
      return $repo.queryOne("issues", "by_ref", params);
    };
    service.listInAllProjects = function(filters) {
      return $repo.queryMany("issues", filters);
    };
    service.list = function(projectId, filters, options) {
      var params;
      params = {
        project: projectId
      };
      params = _.extend({}, params, filters || {});
      service.storeQueryParams(projectId, params);
      return $repo.queryPaginated("issues", params, options);
    };
    service.bulkCreate = function(projectId, data) {
      var params, url;
      url = $urls.resolve("bulk-create-issues");
      params = {
        project_id: projectId,
        bulk_issues: data
      };
      return $http.post(url, params);
    };
    service.stats = function(projectId) {
      return $repo.queryOneRaw("projects", projectId + "/issues_stats");
    };
    service.filtersData = function(projectId) {
      return $repo.queryOneRaw("projects", projectId + "/issue_filters_data");
    };
    service.listValues = function(projectId, type) {
      var params;
      params = {
        "project": projectId
      };
      service.storeQueryParams(projectId, params);
      return $repo.queryMany(type, params);
    };
    service.storeQueryParams = function(projectId, params) {
      var hash, ns;
      ns = projectId + ":" + hashSuffix;
      hash = generateHash([projectId, ns]);
      return $storage.set(hash, params);
    };
    service.getQueryParams = function(projectId) {
      var hash, ns;
      ns = projectId + ":" + hashSuffix;
      hash = generateHash([projectId, ns]);
      return $storage.get(hash) || {};
    };
    service.storeFilters = function(projectSlug, params) {
      var hash, ns;
      ns = projectSlug + ":" + filtersHashSuffix;
      hash = generateHash([projectSlug, ns]);
      return $storage.set(hash, params);
    };
    service.getFilters = function(projectSlug) {
      var hash, ns;
      ns = projectSlug + ":" + filtersHashSuffix;
      hash = generateHash([projectSlug, ns]);
      return $storage.get(hash) || {};
    };
    service.storeMyFilters = function(projectId, myFilters) {
      var deferred, hash, ns, promise, url;
      deferred = $q.defer();
      url = $urls.resolve("user-storage");
      ns = projectId + ":" + myFiltersHashSuffix;
      hash = generateHash([projectId, ns]);
      if (_.isEmpty(myFilters)) {
        promise = $http["delete"](url + "/" + hash, {
          key: hash,
          value: myFilters
        });
        promise.then(function() {
          return deferred.resolve();
        });
        promise.then(null, function() {
          return deferred.reject();
        });
      } else {
        promise = $http.put(url + "/" + hash, {
          key: hash,
          value: myFilters
        });
        promise.then(function(data) {
          return deferred.resolve();
        });
        promise.then(null, function(data) {
          var innerPromise;
          innerPromise = $http.post("" + url, {
            key: hash,
            value: myFilters
          });
          innerPromise.then(function() {
            return deferred.resolve();
          });
          return innerPromise.then(null, function() {
            return deferred.reject();
          });
        });
      }
      return deferred.promise;
    };
    service.getMyFilters = function(projectId) {
      var deferred, hash, ns, promise, url;
      deferred = $q.defer();
      url = $urls.resolve("user-storage");
      ns = projectId + ":" + myFiltersHashSuffix;
      hash = generateHash([projectId, ns]);
      promise = $http.get(url + "/" + hash);
      promise.then(function(data) {
        return deferred.resolve(data.data.value);
      });
      promise.then(null, function(data) {
        return deferred.resolve({});
      });
      return deferred.promise;
    };
    return function(instance) {
      return instance.issues = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgIssuesResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", "$tgStorage", "$q", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/kanban.coffee
 */

(function() {
  var generateHash, module, resourceProvider, taiga;

  taiga = this.taiga;

  generateHash = taiga.generateHash;

  resourceProvider = function($storage) {
    var hashSuffixStatusColumnModes, hashSuffixStatusViewModes, service;
    service = {};
    hashSuffixStatusViewModes = "kanban-statusviewmodels";
    hashSuffixStatusColumnModes = "kanban-statuscolumnmodels";
    service.storeStatusViewModes = function(projectId, params) {
      var hash, ns;
      ns = projectId + ":" + hashSuffixStatusViewModes;
      hash = generateHash([projectId, ns]);
      return $storage.set(hash, params);
    };
    service.getStatusViewModes = function(projectId) {
      var hash, ns;
      ns = projectId + ":" + hashSuffixStatusViewModes;
      hash = generateHash([projectId, ns]);
      return $storage.get(hash) || {};
    };
    service.storeStatusColumnModes = function(projectId, params) {
      var hash, ns;
      ns = projectId + ":" + hashSuffixStatusColumnModes;
      hash = generateHash([projectId, ns]);
      return $storage.set(hash, params);
    };
    service.getStatusColumnModes = function(projectId) {
      var hash, ns;
      ns = projectId + ":" + hashSuffixStatusColumnModes;
      hash = generateHash([projectId, ns]);
      return $storage.get(hash) || {};
    };
    return function(instance) {
      return instance.kanban = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgKanbanResourcesProvider", ["$tgStorage", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2015 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2015 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2015 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/locales.coffee
 */

(function() {
  var module, resourceProvider, sizeFormat, taiga;

  taiga = this.taiga;

  sizeFormat = this.taiga.sizeFormat;

  resourceProvider = function($repo) {
    var service;
    service = {
      list: function() {
        return $repo.queryMany("locales");
      }
    };
    return function(instance) {
      return instance.locales = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgLocalesResourcesProvider", ["$tgRepo", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/mdrender.coffee
 */

(function() {
  var module, resourceProvider, taiga;

  taiga = this.taiga;

  resourceProvider = function($repo, $urls, $http) {
    var service;
    service = {};
    service.render = function(projectId, content) {
      var params, url;
      if ((content == null) || content === "") {
        content = ' ';
      }
      params = {
        project_id: projectId,
        content: content
      };
      url = $urls.resolve("wiki");
      return $http.post(url + "/render", params).then((function(_this) {
        return function(data) {
          return data.data;
        };
      })(this));
    };
    return function(instance) {
      return instance.mdrender = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgMdRenderResourcesProvider", ["$tgRepo", "$tgUrls", "$tgHttp", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/memberships.coffee
 */

(function() {
  var module, resourceProvider, taiga;

  taiga = this.taiga;

  resourceProvider = function($repo, $http, $urls) {
    var service;
    service = {};
    service.get = function(id) {
      return $repo.queryOne("memberships", id);
    };
    service.list = function(projectId, filters, enablePagination) {
      var options, params;
      if (enablePagination == null) {
        enablePagination = true;
      }
      params = {
        project: projectId
      };
      params = _.extend({}, params, filters || {});
      if (enablePagination) {
        return $repo.queryPaginated("memberships", params);
      }
      return $repo.queryMany("memberships", params, options = {
        enablePagination: enablePagination
      });
    };
    service.listByUser = function(userId, filters) {
      var params;
      params = {
        user: userId
      };
      params = _.extend({}, params, filters || {});
      return $repo.queryPaginated("memberships", params);
    };
    service.resendInvitation = function(id) {
      var url;
      url = $urls.resolve("memberships");
      return $http.post(url + "/" + id + "/resend_invitation", {});
    };
    service.bulkCreateMemberships = function(projectId, data, invitation_extra_text) {
      var params, url;
      url = $urls.resolve("bulk-create-memberships");
      params = {
        project_id: projectId,
        bulk_memberships: data,
        invitation_extra_text: invitation_extra_text
      };
      return $http.post(url, params);
    };
    return function(instance) {
      return instance.memberships = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgMembershipsResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", resourceProvider]);

}).call(this);

(function() {
  var module, resourceProvider;

  resourceProvider = function($repo) {
    var service;
    service = {};
    service.list = function(projectId, module) {
      return $repo.queryOneAttribute("project-modules", projectId, module);
    };
    return function(instance) {
      return instance.modules = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgModulesResourcesProvider", ["$tgRepo", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/memberships.coffee
 */

(function() {
  var module, resourceProvider, taiga;

  taiga = this.taiga;

  resourceProvider = function($repo, $http, $urls) {
    var service;
    service = {};
    service.get = function(id) {
      return $repo.queryOne("notify-policies", id);
    };
    service.list = function(filters) {
      var params;
      params = _.extend({}, params, filters || {});
      return $repo.queryMany("notify-policies", params);
    };
    return function(instance) {
      return instance.notifyPolicies = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgNotifyPoliciesResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/projects.coffee
 */

(function() {
  var module, resourceProvider, sizeFormat, taiga;

  taiga = this.taiga;

  sizeFormat = this.taiga.sizeFormat;

  resourceProvider = function($config, $repo, $http, $urls, $auth, $q, $translate) {
    var service;
    service = {};
    service.get = function(projectId) {
      return $repo.queryOne("projects", projectId);
    };
    service.getBySlug = function(projectSlug) {
      return $repo.queryOne("projects", "by_slug?slug=" + projectSlug);
    };
    service.list = function() {
      return $repo.queryMany("projects");
    };
    service.listByMember = function(memberId) {
      var params;
      params = {
        "member": memberId,
        "order_by": "memberships__user_order"
      };
      return $repo.queryMany("projects", params);
    };
    service.templates = function() {
      return $repo.queryMany("project-templates");
    };
    service.usersList = function(projectId) {
      var params;
      params = {
        "project": projectId
      };
      return $repo.queryMany("users", params);
    };
    service.rolesList = function(projectId) {
      var params;
      params = {
        "project": projectId
      };
      return $repo.queryMany("roles", params);
    };
    service.stats = function(projectId) {
      return $repo.queryOneRaw("projects", projectId + "/stats");
    };
    service.bulkUpdateOrder = function(bulkData) {
      var url;
      url = $urls.resolve("bulk-update-projects-order");
      return $http.post(url, bulkData);
    };
    service.regenerate_userstories_csv_uuid = function(projectId) {
      var url;
      url = ($urls.resolve("projects")) + "/" + projectId + "/regenerate_userstories_csv_uuid";
      return $http.post(url);
    };
    service.regenerate_issues_csv_uuid = function(projectId) {
      var url;
      url = ($urls.resolve("projects")) + "/" + projectId + "/regenerate_issues_csv_uuid";
      return $http.post(url);
    };
    service.regenerate_tasks_csv_uuid = function(projectId) {
      var url;
      url = ($urls.resolve("projects")) + "/" + projectId + "/regenerate_tasks_csv_uuid";
      return $http.post(url);
    };
    service.leave = function(projectId) {
      var url;
      url = ($urls.resolve("projects")) + "/" + projectId + "/leave";
      return $http.post(url);
    };
    service.memberStats = function(projectId) {
      return $repo.queryOneRaw("projects", projectId + "/member_stats");
    };
    service.tagsColors = function(projectId) {
      return $repo.queryOne("projects", projectId + "/tags_colors");
    };
    service["export"] = function(projectId) {
      var url;
      url = ($urls.resolve("exporter")) + "/" + projectId;
      return $http.get(url);
    };
    service["import"] = function(file, statusUpdater) {
      var complete, data, defered, errorMsg, failed, maxFileSize, response, uploadComplete, uploadFailed, uploadProgress, xhr;
      defered = $q.defer();
      maxFileSize = $config.get("maxUploadFileSize", null);
      if (maxFileSize && file.size > maxFileSize) {
        errorMsg = $translate.instant("PROJECT.IMPORT.ERROR_MAX_SIZE_EXCEEDED", {
          fileName: file.name,
          fileSize: sizeFormat(file.size),
          maxFileSize: sizeFormat(maxFileSize)
        });
        response = {
          status: 413,
          data: {
            _error_message: errorMsg
          }
        };
        defered.reject(response);
        return defered.promise;
      }
      uploadProgress = (function(_this) {
        return function(evt) {
          var message, percent;
          percent = Math.round((evt.loaded / evt.total) * 100);
          message = $translate.instant("PROJECT.IMPORT.UPLOAD_IN_PROGRESS_MESSAGE", {
            uploadedSize: sizeFormat(evt.loaded),
            totalSize: sizeFormat(evt.total)
          });
          return statusUpdater("in-progress", null, message, percent);
        };
      })(this);
      uploadComplete = (function(_this) {
        return function(evt) {
          return statusUpdater("done", $translate.instant("PROJECT.IMPORT.TITLE"), $translate.instant("PROJECT.IMPORT.DESCRIPTION"));
        };
      })(this);
      uploadFailed = (function(_this) {
        return function(evt) {
          return statusUpdater("error");
        };
      })(this);
      complete = (function(_this) {
        return function(evt) {
          var ref;
          response = {};
          try {
            response.data = JSON.parse(evt.target.responseText);
          } catch (_error) {
            response.data = {};
          }
          response.status = evt.target.status;
          if ((ref = response.status) === 201 || ref === 202) {
            defered.resolve(response);
          }
          return defered.reject(response);
        };
      })(this);
      failed = (function(_this) {
        return function(evt) {
          return defered.reject("fail");
        };
      })(this);
      data = new FormData();
      data.append('dump', file);
      xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", uploadProgress, false);
      xhr.upload.addEventListener("load", uploadComplete, false);
      xhr.upload.addEventListener("error", uploadFailed, false);
      xhr.upload.addEventListener("abort", uploadFailed, false);
      xhr.addEventListener("load", complete, false);
      xhr.addEventListener("error", failed, false);
      xhr.open("POST", $urls.resolve("importer"));
      xhr.setRequestHeader("Authorization", "Bearer " + ($auth.getToken()));
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(data);
      return defered.promise;
    };
    return function(instance) {
      return instance.projects = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgProjectsResourcesProvider", ["$tgConfig", "$tgRepo", "$tgHttp", "$tgUrls", "$tgAuth", "$q", "$translate", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/memberships.coffee
 */

(function() {
  var module, resourceProvider, taiga;

  taiga = this.taiga;

  resourceProvider = function($repo, $http, $urls) {
    var service;
    service = {};
    service.get = function(id) {
      return $repo.queryOne("roles", id);
    };
    service.list = function(projectId) {
      return $repo.queryMany("roles", {
        project: projectId
      });
    };
    return function(instance) {
      return instance.roles = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgRolesResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/search.coffee
 */

(function() {
  var module, resourceProvider, taiga;

  taiga = this.taiga;

  resourceProvider = function($repo, $urls, $http) {
    var service;
    service = {};
    service["do"] = function(projectId, term) {
      var params, url;
      url = $urls.resolve("search");
      params = {
        project: projectId,
        text: term,
        get_all: false
      };
      return $http.get(url, params).then(function(data) {
        return data.data;
      });
    };
    return function(instance) {
      return instance.search = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgSearchResourcesProvider", ["$tgRepo", "$tgUrls", "$tgHttp", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/sprints.coffee
 */

(function() {
  var generateHash, module, resourceProvider, taiga;

  taiga = this.taiga;

  generateHash = taiga.generateHash;

  resourceProvider = function($repo, $model, $storage) {
    var service;
    service = {};
    service.get = function(projectId, sprintId) {
      return $repo.queryOne("milestones", sprintId).then(function(sprint) {
        var uses;
        uses = sprint.user_stories;
        uses = _.map(uses, function(u) {
          return $model.make_model("userstories", u);
        });
        sprint._attrs.user_stories = uses;
        return sprint;
      });
    };
    service.stats = function(projectId, sprintId) {
      return $repo.queryOneRaw("milestones", sprintId + "/stats");
    };
    service.list = function(projectId, filters) {
      var params;
      params = {
        "project": projectId
      };
      params = _.extend({}, params, filters || {});
      return $repo.queryMany("milestones", params).then((function(_this) {
        return function(milestones) {
          var i, len, m, uses;
          for (i = 0, len = milestones.length; i < len; i++) {
            m = milestones[i];
            uses = m.user_stories;
            uses = _.map(uses, function(u) {
              return $model.make_model("userstories", u);
            });
            m._attrs.user_stories = uses;
          }
          return milestones;
        };
      })(this));
    };
    return function(instance) {
      return instance.sprints = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgSprintsResourcesProvider", ["$tgRepo", "$tgModel", "$tgStorage", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/tasks.coffee
 */

(function() {
  var generateHash, module, resourceProvider, taiga;

  taiga = this.taiga;

  generateHash = taiga.generateHash;

  resourceProvider = function($repo, $http, $urls, $storage) {
    var hashSuffix, hashSuffixStatusColumnModes, hashSuffixUsRowModes, service;
    service = {};
    hashSuffix = "tasks-queryparams";
    hashSuffixStatusColumnModes = "tasks-statuscolumnmodels";
    hashSuffixUsRowModes = "tasks-usrowmodels";
    service.get = function(projectId, taskId) {
      var params;
      params = service.getQueryParams(projectId);
      params.project = projectId;
      return $repo.queryOne("tasks", taskId, params);
    };
    service.getByRef = function(projectId, ref) {
      var params;
      params = service.getQueryParams(projectId);
      params.project = projectId;
      params.ref = ref;
      return $repo.queryOne("tasks", "by_ref", params);
    };
    service.listInAllProjects = function(filters) {
      return $repo.queryMany("tasks", filters);
    };
    service.list = function(projectId, sprintId, userStoryId) {
      var params;
      if (sprintId == null) {
        sprintId = null;
      }
      if (userStoryId == null) {
        userStoryId = null;
      }
      params = {
        project: projectId
      };
      if (sprintId) {
        params.milestone = sprintId;
      }
      if (userStoryId) {
        params.user_story = userStoryId;
      }
      service.storeQueryParams(projectId, params);
      return $repo.queryMany("tasks", params);
    };
    service.bulkCreate = function(projectId, sprintId, usId, data) {
      var params, url;
      url = $urls.resolve("bulk-create-tasks");
      params = {
        project_id: projectId,
        sprint_id: sprintId,
        us_id: usId,
        bulk_tasks: data
      };
      return $http.post(url, params).then(function(result) {
        return result.data;
      });
    };
    service.bulkUpdateTaskTaskboardOrder = function(projectId, data) {
      var params, url;
      url = $urls.resolve("bulk-update-task-taskboard-order");
      params = {
        project_id: projectId,
        bulk_tasks: data
      };
      return $http.post(url, params);
    };
    service.listValues = function(projectId, type) {
      var params;
      params = {
        "project": projectId
      };
      return $repo.queryMany(type, params);
    };
    service.storeQueryParams = function(projectId, params) {
      var hash, ns;
      ns = projectId + ":" + hashSuffix;
      hash = generateHash([projectId, ns]);
      return $storage.set(hash, params);
    };
    service.getQueryParams = function(projectId) {
      var hash, ns;
      ns = projectId + ":" + hashSuffix;
      hash = generateHash([projectId, ns]);
      return $storage.get(hash) || {};
    };
    service.storeStatusColumnModes = function(projectId, params) {
      var hash, ns;
      ns = projectId + ":" + hashSuffixStatusColumnModes;
      hash = generateHash([projectId, ns]);
      return $storage.set(hash, params);
    };
    service.getStatusColumnModes = function(projectId) {
      var hash, ns;
      ns = projectId + ":" + hashSuffixStatusColumnModes;
      hash = generateHash([projectId, ns]);
      return $storage.get(hash) || {};
    };
    service.storeUsRowModes = function(projectId, sprintId, params) {
      var hash, ns;
      ns = projectId + ":" + hashSuffixUsRowModes;
      hash = generateHash([projectId, sprintId, ns]);
      return $storage.set(hash, params);
    };
    service.getUsRowModes = function(projectId, sprintId) {
      var hash, ns;
      ns = projectId + ":" + hashSuffixUsRowModes;
      hash = generateHash([projectId, sprintId, ns]);
      return $storage.get(hash) || {};
    };
    return function(instance) {
      return instance.tasks = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgTasksResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", "$tgStorage", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/memberships.coffee
 */

(function() {
  var module, resourceProvider, sizeFormat, taiga;

  taiga = this.taiga;

  sizeFormat = this.taiga.sizeFormat;

  resourceProvider = function($config, $repo, $http, $urls, $q) {
    var service;
    service = {};
    service.changeAvatar = function(file) {
      var data, defered, maxFileSize, options, response, url;
      maxFileSize = $config.get("maxUploadFileSize", null);
      if (maxFileSize && file.size > maxFileSize) {
        response = {
          status: 413,
          data: {
            _error_message: "'" + file.name + "' (" + (sizeFormat(file.size)) + ") is too heavy for our oompa loompas, try it with a smaller than (" + (sizeFormat(maxFileSize)) + ")"
          }
        };
        defered = $q.defer();
        defered.reject(response);
        return defered.promise;
      }
      data = new FormData();
      data.append('avatar', file);
      options = {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': void 0
        }
      };
      url = ($urls.resolve("users")) + "/change_avatar";
      return $http.post(url, data, {}, options);
    };
    service.removeAvatar = function() {
      var url;
      url = ($urls.resolve("users")) + "/remove_avatar";
      return $http.post(url);
    };
    service.changePassword = function(currentPassword, newPassword) {
      var data, url;
      url = ($urls.resolve("users")) + "/change_password";
      data = {
        current_password: currentPassword,
        password: newPassword
      };
      return $http.post(url, data);
    };
    return function(instance) {
      return instance.userSettings = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgUserSettingsResourcesProvider", ["$tgConfig", "$tgRepo", "$tgHttp", "$tgUrls", "$q", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/user.coffee
 */

(function() {
  var module, resourceProvider, sizeFormat, taiga;

  taiga = this.taiga;

  sizeFormat = this.taiga.sizeFormat;

  resourceProvider = function($http, $urls) {
    var service;
    service = {};
    service.contacts = function(userId, options) {
      var httpOptions, url;
      if (options == null) {
        options = {};
      }
      url = $urls.resolve("contacts", userId);
      httpOptions = {
        headers: {}
      };
      if (!options.enablePagination) {
        httpOptions.headers["x-disable-pagination"] = "1";
      }
      return $http.get(url, {}, httpOptions).then(function(result) {
        return result.data;
      });
    };
    return function(instance) {
      return instance.users = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgUsersResourcesProvider", ["$tgHttp", "$tgUrls", "$q", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/userstories.coffee
 */

(function() {
  var generateHash, module, resourceProvider, taiga;

  taiga = this.taiga;

  generateHash = taiga.generateHash;

  resourceProvider = function($repo, $http, $urls, $storage) {
    var hashSuffix, service;
    service = {};
    hashSuffix = "userstories-queryparams";
    service.get = function(projectId, usId) {
      var params;
      params = service.getQueryParams(projectId);
      params.project = projectId;
      return $repo.queryOne("userstories", usId, params);
    };
    service.getByRef = function(projectId, ref) {
      var params;
      params = service.getQueryParams(projectId);
      params.project = projectId;
      params.ref = ref;
      return $repo.queryOne("userstories", "by_ref", params);
    };
    service.listInAllProjects = function(filters) {
      return $repo.queryMany("userstories", filters);
    };
    service.listUnassigned = function(projectId, filters) {
      var params;
      params = {
        "project": projectId,
        "milestone": "null"
      };
      params = _.extend({}, params, filters || {});
      service.storeQueryParams(projectId, params);
      return $repo.queryMany("userstories", params);
    };
    service.listAll = function(projectId, filters) {
      var params;
      params = {
        "project": projectId
      };
      params = _.extend({}, params, filters || {});
      service.storeQueryParams(projectId, params);
      return $repo.queryMany("userstories", params);
    };
    service.bulkCreate = function(projectId, status, bulk) {
      var data, url;
      data = {
        project_id: projectId,
        status_id: status,
        bulk_stories: bulk
      };
      url = $urls.resolve("bulk-create-us");
      return $http.post(url, data);
    };
    service.bulkUpdateBacklogOrder = function(projectId, data) {
      var params, url;
      url = $urls.resolve("bulk-update-us-backlog-order");
      params = {
        project_id: projectId,
        bulk_stories: data
      };
      return $http.post(url, params);
    };
    service.bulkUpdateSprintOrder = function(projectId, data) {
      var params, url;
      url = $urls.resolve("bulk-update-us-sprint-order");
      params = {
        project_id: projectId,
        bulk_stories: data
      };
      return $http.post(url, params);
    };
    service.bulkUpdateKanbanOrder = function(projectId, data) {
      var params, url;
      url = $urls.resolve("bulk-update-us-kanban-order");
      params = {
        project_id: projectId,
        bulk_stories: data
      };
      return $http.post(url, params);
    };
    service.listValues = function(projectId, type) {
      var params;
      params = {
        "project": projectId
      };
      service.storeQueryParams(projectId, params);
      return $repo.queryMany(type, params);
    };
    service.storeQueryParams = function(projectId, params) {
      var hash, ns;
      ns = projectId + ":" + hashSuffix;
      hash = generateHash([projectId, ns]);
      return $storage.set(hash, params);
    };
    service.getQueryParams = function(projectId) {
      var hash, ns;
      ns = projectId + ":" + hashSuffix;
      hash = generateHash([projectId, ns]);
      return $storage.get(hash) || {};
    };
    service.storeShowTags = function(projectId, showTags) {
      var hash;
      hash = generateHash([projectId, 'showTags']);
      return $storage.set(hash, showTags);
    };
    service.getShowTags = function(projectId) {
      var hash;
      hash = generateHash([projectId, 'showTags']);
      return $storage.get(hash) || null;
    };
    return function(instance) {
      return instance.userstories = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgUserstoriesResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", "$tgStorage", resourceProvider]);

}).call(this);

(function() {
  var module, resourceProvider;

  resourceProvider = function($repo, $urls, $http) {
    var service;
    service = {};
    service.list = function(webhookId) {
      var params;
      params = {
        webhook: webhookId
      };
      return $repo.queryMany("webhooklogs", params);
    };
    service.resend = function(webhooklogId) {
      var url;
      url = $urls.resolve("webhooklogs-resend", webhooklogId);
      return $http.post(url);
    };
    return function(instance) {
      return instance.webhooklogs = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgWebhookLogsResourcesProvider", ["$tgRepo", "$tgUrls", "$tgHttp", resourceProvider]);

}).call(this);

(function() {
  var module, resourceProvider;

  resourceProvider = function($repo, $urls, $http) {
    var service;
    service = {};
    service.list = function(projectId) {
      var params;
      params = {
        project: projectId
      };
      return $repo.queryMany("webhooks", params);
    };
    service.test = function(webhookId) {
      var url;
      url = $urls.resolve("webhooks-test", webhookId);
      return $http.post(url);
    };
    return function(instance) {
      return instance.webhooks = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgWebhooksResourcesProvider", ["$tgRepo", "$tgUrls", "$tgHttp", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/resources/wikis.coffee
 */

(function() {
  var module, resourceProvider, taiga;

  taiga = this.taiga;

  resourceProvider = function($repo, $http, $urls) {
    var service;
    service = {};
    service.get = function(wikiId) {
      return $repo.queryOne("wiki", wikiId);
    };
    service.getBySlug = function(projectId, slug) {
      return $repo.queryOne("wiki", "by_slug?project=" + projectId + "&slug=" + slug);
    };
    service.listLinks = function(projectId) {
      return $repo.queryMany("wiki-links", {
        project: projectId
      });
    };
    return function(instance) {
      return instance.wiki = service;
    };
  };

  module = angular.module("taigaResources");

  module.factory("$tgWikiResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", resourceProvider]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/user-settings/main.coffee
 */

(function() {
  var UserChangePasswordController, UserChangePasswordDirective, debounce, mixOf, module, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  debounce = this.taiga.debounce;

  module = angular.module("taigaUserSettings");

  UserChangePasswordController = (function(superClass) {
    extend(UserChangePasswordController, superClass);

    UserChangePasswordController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgConfirm", "$tgResources", "$routeParams", "$q", "$tgLocation", "$tgNavUrls", "$tgAuth", "$translate"];

    function UserChangePasswordController(scope, rootscope, repo, confirm, rs, params, q, location, navUrls, auth, translate) {
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs;
      this.params = params;
      this.q = q;
      this.location = location;
      this.navUrls = navUrls;
      this.auth = auth;
      this.translate = translate;
      this.scope.sectionName = this.translate.instant("CHANGE_PASSWORD.SECTION_NAME");
      this.scope.user = this.auth.getUser();
    }

    return UserChangePasswordController;

  })(mixOf(taiga.Controller, taiga.PageMixin));

  module.controller("UserChangePasswordController", UserChangePasswordController);

  UserChangePasswordDirective = function($rs, $confirm, $loading, $translate) {
    var link;
    link = function($scope, $el, $attrs, ctrl) {
      var submit, submitButton;
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var promise;
          event.preventDefault();
          if ($scope.newPassword1 !== $scope.newPassword2) {
            $confirm.notify('error', $translate.instant("CHANGE_PASSWORD.ERROR_PASSWORD_MATCH"));
            return;
          }
          $loading.start(submitButton);
          promise = $rs.userSettings.changePassword($scope.currentPassword, $scope.newPassword1);
          promise.then(function() {
            $loading.finish(submitButton);
            return $confirm.notify('success');
          });
          return promise.then(null, function(response) {
            $loading.finish(submitButton);
            return $confirm.notify('error', response.data._error_message);
          });
        };
      })(this));
      submitButton = $el.find(".submit-button");
      $el.on("submit", "form", submit);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgUserChangePassword", ["$tgResources", "$tgConfirm", "$tgLoading", UserChangePasswordDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/issues/lightboxes.coffee
 */

(function() {
  var DeleteUserDirective, bindOnce, debounce, module, taiga;

  taiga = this.taiga;

  bindOnce = this.taiga.bindOnce;

  debounce = this.taiga.debounce;

  module = angular.module("taigaUserSettings");

  DeleteUserDirective = function($repo, $rootscope, $auth, $location, $navUrls, lightboxService) {
    var link;
    link = function($scope, $el, $attrs) {
      var submit;
      $scope.$on("deletelightbox:new", function(ctx, user) {
        return lightboxService.open($el);
      });
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      submit = function() {
        var promise;
        promise = $repo.remove($scope.user);
        promise.then(function(data) {
          lightboxService.close($el);
          $auth.logout();
          return $location.path($navUrls.resolve("login"));
        });
        return promise.then(null, function() {
          return console.log("FAIL");
        });
      };
      $el.on("click", ".button-red", function(event) {
        event.preventDefault();
        return lightboxService.close($el);
      });
      return $el.on("click", ".button-green", debounce(2000, function(event) {
        event.preventDefault();
        return submit();
      }));
    };
    return {
      link: link,
      templateUrl: "user/lightbox/lightbox-delete-account.html"
    };
  };

  module.directive("tgLbDeleteUser", ["$tgRepo", "$rootScope", "$tgAuth", "$tgLocation", "$tgNavUrls", "lightboxService", DeleteUserDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/user-settings/main.coffee
 */

(function() {
  var TaigaAvatarModelDirective, UserAvatarDirective, UserProfileDirective, UserSettingsController, debounce, mixOf, module, sizeFormat, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  sizeFormat = this.taiga.sizeFormat;

  module = angular.module("taigaUserSettings");

  debounce = this.taiga.debounce;

  UserSettingsController = (function(superClass) {
    extend(UserSettingsController, superClass);

    UserSettingsController.$inject = ["$scope", "$rootScope", "$tgConfig", "$tgRepo", "$tgConfirm", "$tgResources", "$routeParams", "$q", "$tgLocation", "$tgNavUrls", "$tgAuth", "$translate"];

    function UserSettingsController(scope, rootscope, config, repo, confirm, rs, params, q, location, navUrls, auth, translate) {
      var maxFileSize, promise, text;
      this.scope = scope;
      this.rootscope = rootscope;
      this.config = config;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs;
      this.params = params;
      this.q = q;
      this.location = location;
      this.navUrls = navUrls;
      this.auth = auth;
      this.translate = translate;
      this.scope.sectionName = "USER_SETTINGS.MENU.SECTION_TITLE";
      this.scope.project = {};
      this.scope.user = this.auth.getUser();
      if (!this.scope.user) {
        this.location.path(this.navUrls.resolve("permission-denied"));
        this.location.replace();
      }
      this.scope.lang = this.getLan();
      this.scope.theme = this.getTheme();
      maxFileSize = this.config.get("maxUploadFileSize", null);
      if (maxFileSize) {
        text = this.translate.instant("USER_SETTINGS.AVATAR_MAX_SIZE", {
          "maxFileSize": sizeFormat(maxFileSize)
        });
        this.scope.maxFileSizeMsg = text;
      }
      promise = this.loadInitialData();
      promise.then(null, this.onInitialDataError.bind(this));
    }

    UserSettingsController.prototype.loadInitialData = function() {
      this.scope.availableThemes = this.config.get("themes", []);
      return this.rs.locales.list().then((function(_this) {
        return function(locales) {
          _this.scope.locales = locales;
          return locales;
        };
      })(this));
    };

    UserSettingsController.prototype.openDeleteLightbox = function() {
      return this.rootscope.$broadcast("deletelightbox:new", this.scope.user);
    };

    UserSettingsController.prototype.getLan = function() {
      return this.scope.user.lang || this.translate.preferredLanguage();
    };

    UserSettingsController.prototype.getTheme = function() {
      return this.scope.user.theme || this.config.get("defaultTheme") || "taiga";
    };

    return UserSettingsController;

  })(mixOf(taiga.Controller, taiga.PageMixin));

  module.controller("UserSettingsController", UserSettingsController);

  UserProfileDirective = function($confirm, $auth, $repo, $translate) {
    var link;
    link = function($scope, $el, $attrs) {
      var submit;
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var changeEmail, form, onError, onSuccess;
          event.preventDefault();
          form = $el.find("form").checksley();
          if (!form.validate()) {
            return;
          }
          changeEmail = $scope.user.isAttributeModified("email");
          $scope.user.lang = $scope.lang;
          $scope.user.theme = $scope.theme;
          onSuccess = function(data) {
            var text;
            $auth.setUser(data);
            if (changeEmail) {
              text = $translate.instant("USER_PROFILE.CHANGE_EMAIL_SUCCESS");
              return $confirm.success(text);
            } else {
              return $confirm.notify('success');
            }
          };
          onError = function(data) {
            form.setErrors(data);
            return $confirm.notify('error', data._error_message);
          };
          return $repo.save($scope.user).then(onSuccess, onError);
        };
      })(this));
      $el.on("submit", "form", submit);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgUserProfile", ["$tgConfirm", "$tgAuth", "$tgRepo", "$translate", UserProfileDirective]);

  UserAvatarDirective = function($auth, $model, $rs, $confirm) {
    var link;
    link = function($scope, $el, $attrs) {
      var onError, onSuccess, showSizeInfo;
      showSizeInfo = function() {
        return $el.find(".size-info").removeClass("hidden");
      };
      onSuccess = function(response) {
        var user;
        user = $model.make_model("users", response.data);
        $auth.setUser(user);
        $scope.user = user;
        $el.find('.overlay').addClass('hidden');
        return $confirm.notify('success');
      };
      onError = function(response) {
        if (response.status === 413) {
          showSizeInfo();
        }
        $el.find('.overlay').addClass('hidden');
        return $confirm.notify('error', response.data._error_message);
      };
      $el.on("click", ".js-change-avatar", function() {
        return $el.find("#avatar-field").click();
      });
      $el.on("change", "#avatar-field", function(event) {
        if ($scope.avatarAttachment) {
          $el.find('.overlay').removeClass('hidden');
          return $rs.userSettings.changeAvatar($scope.avatarAttachment).then(onSuccess, onError);
        }
      });
      $el.on("click", "a.use-gravatar", function(event) {
        $el.find('.overlay').removeClass('hidden');
        return $rs.userSettings.removeAvatar().then(onSuccess, onError);
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgUserAvatar", ["$tgAuth", "$tgModel", "$tgResources", "$tgConfirm", UserAvatarDirective]);

  TaigaAvatarModelDirective = function($parse) {
    var link;
    link = function($scope, $el, $attrs) {
      var model, modelSetter;
      model = $parse($attrs.tgAvatarModel);
      modelSetter = model.assign;
      return $el.bind('change', function() {
        return $scope.$apply(function() {
          return modelSetter($scope, $el[0].files[0]);
        });
      });
    };
    return {
      link: link
    };
  };

  module.directive('tgAvatarModel', ['$parse', TaigaAvatarModelDirective]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/user-settings/nav.coffee
 */

(function() {
  var UserSettingsNavigationDirective, module;

  UserSettingsNavigationDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      var section;
      section = $attrs.tgUserSettingsNavigation;
      $el.find(".active").removeClass("active");
      $el.find("#usersettingsmenu-" + section + " a").addClass("active");
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module = angular.module("taigaUserSettings");

  module.directive("tgUserSettingsNavigation", UserSettingsNavigationDirective);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/user-settings/notifications.coffee
 */

(function() {
  var UserNotificationsController, UserNotificationsDirective, UserNotificationsListDirective, bindOnce, mixOf, module, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  bindOnce = this.taiga.bindOnce;

  module = angular.module("taigaUserSettings");

  UserNotificationsController = (function(superClass) {
    extend(UserNotificationsController, superClass);

    UserNotificationsController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgConfirm", "$tgResources", "$routeParams", "$q", "$tgLocation", "$tgNavUrls", "$tgAuth"];

    function UserNotificationsController(scope, rootscope, repo, confirm, rs, params, q, location, navUrls, auth) {
      var promise;
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs;
      this.params = params;
      this.q = q;
      this.location = location;
      this.navUrls = navUrls;
      this.auth = auth;
      this.scope.sectionName = "USER_SETTINGS.NOTIFICATIONS.SECTION_NAME";
      this.scope.user = this.auth.getUser();
      promise = this.loadInitialData();
      promise.then(null, this.onInitialDataError.bind(this));
    }

    UserNotificationsController.prototype.loadInitialData = function() {
      return this.rs.notifyPolicies.list().then((function(_this) {
        return function(notifyPolicies) {
          _this.scope.notifyPolicies = notifyPolicies;
          return notifyPolicies;
        };
      })(this));
    };

    return UserNotificationsController;

  })(mixOf(taiga.Controller, taiga.PageMixin));

  module.controller("UserNotificationsController", UserNotificationsController);

  UserNotificationsDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgUserNotifications", UserNotificationsDirective);

  UserNotificationsListDirective = function($repo, $confirm, $compile) {
    var link, template;
    template = _.template("<% _.each(notifyPolicies, function (notifyPolicy, index) { %>\n<div class=\"policy-table-row\" data-index=\"<%- index %>\">\n  <div class=\"policy-table-project\"><span><%- notifyPolicy.project_name %></span></div>\n  <div class=\"policy-table-all\">\n    <fieldset>\n      <input type=\"radio\"\n             name=\"policy-<%- notifyPolicy.id %>\" id=\"policy-all-<%- notifyPolicy.id %>\"\n             value=\"2\" <% if (notifyPolicy.notify_level == 2) { %>checked=\"checked\"<% } %>/>\n      <label for=\"policy-all-<%- notifyPolicy.id %>\"\n             translate=\"USER_SETTINGS.NOTIFICATIONS.OPTION_ALL\"></label>\n    </fieldset>\n  </div>\n  <div class=\"policy-table-involved\">\n    <fieldset>\n      <input type=\"radio\"\n             name=\"policy-<%- notifyPolicy.id %>\" id=\"policy-involved-<%- notifyPolicy.id %>\"\n             value=\"1\" <% if (notifyPolicy.notify_level == 1) { %>checked=\"checked\"<% } %> />\n      <label for=\"policy-involved-<%- notifyPolicy.id %>\"\n             translate=\"USER_SETTINGS.NOTIFICATIONS.OPTION_INVOLVED\"></label>\n    </fieldset>\n  </div>\n  <div class=\"policy-table-none\">\n    <fieldset>\n      <input type=\"radio\"\n             name=\"policy-<%- notifyPolicy.id %>\" id=\"policy-none-<%- notifyPolicy.id %>\"\n             value=\"3\" <% if (notifyPolicy.notify_level == 3) { %>checked=\"checked\"<% } %> />\n      <label for=\"policy-none-<%- notifyPolicy.id %>\"\n             translate=\"USER_SETTINGS.NOTIFICATIONS.OPTION_NONE\"></label>\n    </fieldset>\n  </div>\n</div>\n<% }) %>");
    link = function($scope, $el, $attrs) {
      var render;
      render = function() {
        var ctx, html;
        $el.off();
        ctx = {
          notifyPolicies: $scope.notifyPolicies
        };
        html = template(ctx);
        $el.html($compile(html)($scope));
        return $el.on("change", "input[type=radio]", function(event) {
          var onError, onSuccess, policy, policyIndex, prev_level, target;
          target = angular.element(event.currentTarget);
          policyIndex = target.parents(".policy-table-row").data('index');
          policy = $scope.notifyPolicies[policyIndex];
          prev_level = policy.notify_level;
          policy.notify_level = parseInt(target.val(), 10);
          onSuccess = function() {
            return $confirm.notify("success");
          };
          onError = function() {
            $confirm.notify("error");
            return target.parents(".policy-table-row").find("input[value=" + prev_level + "]").prop("checked", true);
          };
          return $repo.save(policy).then(onSuccess, onError);
        });
      };
      $scope.$on("$destroy", function() {
        return $el.off();
      });
      return bindOnce($scope, $attrs.ngModel, render);
    };
    return {
      link: link
    };
  };

  module.directive("tgUserNotificationsList", ["$tgRepo", "$tgConfirm", "$compile", UserNotificationsListDirective]);

}).call(this);


/*
 * Copyright (C) 2015 Taiga Agile LLC
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: components.module.coffee
 */

(function() {
  angular.module("taigaComponents", []);

}).call(this);

(function() {
  var module;

  module = angular.module("taigaHome", []);

}).call(this);

(function() {
  angular.module("taigaNavigationBar", []);

}).call(this);

(function() {
  var module;

  module = angular.module("taigaProfile", []);

}).call(this);

(function() {
  angular.module("taigaProjects", []);

}).call(this);

(function() {
  angular.module("taigaResources2", []);

}).call(this);

(function() {
  angular.module("taigaUserTimeline", []);

}).call(this);

(function() {
  var ProjectMenuController;

  ProjectMenuController = (function() {
    ProjectMenuController.$inject = ["tgProjectService", "tgLightboxFactory"];

    function ProjectMenuController(projectService, lightboxFactory) {
      this.projectService = projectService;
      this.lightboxFactory = lightboxFactory;
      this.project = null;
      this.menu = Immutable.Map();
    }

    ProjectMenuController.prototype.show = function() {
      this.project = this.projectService.project;
      this.active = this._getActiveSection();
      this._setVideoConference();
      return this._setMenuPermissions();
    };

    ProjectMenuController.prototype.hide = function() {
      this.project = null;
      return this.menu = {};
    };

    ProjectMenuController.prototype.search = function() {
      return this.lightboxFactory.create("tg-search-box", {
        "class": "lightbox lightbox-search"
      });
    };

    ProjectMenuController.prototype._setVideoConference = function() {
      var videoconferenceUrl;
      videoconferenceUrl = this._videoConferenceUrl();
      if (videoconferenceUrl) {
        return this.project = this.project.set("videoconferenceUrl", videoconferenceUrl);
      }
    };

    ProjectMenuController.prototype._setMenuPermissions = function() {
      this.menu = Immutable.Map({
        backlog: false,
        kanban: false,
        issues: false,
        wiki: false
      });
      if (this.project.get("is_backlog_activated") && this.project.get("my_permissions").indexOf("view_us") !== -1) {
        this.menu = this.menu.set("backlog", true);
      }
      if (this.project.get("is_kanban_activated") && this.project.get("my_permissions").indexOf("view_us") !== -1) {
        this.menu = this.menu.set("kanban", true);
      }
      if (this.project.get("is_issues_activated") && this.project.get("my_permissions").indexOf("view_issues") !== -1) {
        this.menu = this.menu.set("issues", true);
      }
      if (this.project.get("is_wiki_activated") && this.project.get("my_permissions").indexOf("view_wiki_pages") !== -1) {
        return this.menu = this.menu.set("wiki", true);
      }
    };

    ProjectMenuController.prototype._getActiveSection = function() {
      var indexBacklog, indexKanban, oldSectionName, sectionName, sectionsBreadcrumb;
      sectionName = this.projectService.section;
      sectionsBreadcrumb = this.projectService.sectionsBreadcrumb;
      indexBacklog = sectionsBreadcrumb.lastIndexOf("backlog");
      indexKanban = sectionsBreadcrumb.lastIndexOf("kanban");
      if (indexBacklog !== -1 || indexKanban !== -1) {
        if (indexKanban === -1 || indexBacklog < indexKanban) {
          oldSectionName = "backlog";
        } else {
          oldSectionName = "kanban";
        }
      }
      if (sectionName === "backlog-kanban") {
        if (oldSectionName === "backlog" || oldSectionName === "kanban") {
          sectionName = oldSectionName;
        } else if (this.project.get("is_backlog_activated") && !this.project.get("is_kanban_activated")) {
          sectionName = "backlog";
        } else if (!this.project.get("is_backlog_activated") && this.project.get("is_kanban_activated")) {
          sectionName = "kanban";
        }
      }
      return sectionName;
    };

    ProjectMenuController.prototype._videoConferenceUrl = function() {
      var baseUrl, url;
      if (this.project.get("videoconferences") === "appear-in") {
        baseUrl = "https://appear.in/";
      } else if (this.project.get("videoconferences") === "talky") {
        baseUrl = "https://talky.io/";
      } else if (this.project.get("videoconferences") === "jitsi") {
        baseUrl = "https://meet.jit.si/";
        url = this.project.get("slug") + "-" + taiga.slugify(this.project.get("videoconferences_extra_data"));
        url = url.replace(/-/g, "");
        return baseUrl + url;
      } else if (this.project.get("videoconferences") === "custom") {
        return this.project.get("videoconferences_extra_data");
      } else {
        return "";
      }
      if (this.project.get("videoconferences_extra_data")) {
        url = this.project.get("slug") + "-" + this.project.get("videoconferences_extra_data");
      } else {
        url = this.project.get("slug");
      }
      return baseUrl + url;
    };

    return ProjectMenuController;

  })();

  angular.module("taigaComponents").controller("ProjectMenu", ProjectMenuController);

}).call(this);

(function() {
  var ProjectMenuDirective, taiga;

  taiga = this.taiga;

  ProjectMenuDirective = function(projectService, lightboxFactory) {
    var link;
    link = function(scope, el, attrs, ctrl) {
      var projectChange;
      projectChange = function() {
        if (projectService.project) {
          return ctrl.show();
        } else {
          return ctrl.hide();
        }
      };
      return scope.$watch((function() {
        return projectService.project;
      }), projectChange);
    };
    return {
      scope: {},
      controller: "ProjectMenu",
      controllerAs: "vm",
      templateUrl: "components/project-menu/project-menu.html",
      link: link
    };
  };

  ProjectMenuDirective.$inject = ["tgProjectService", "tgLightboxFactory"];

  angular.module("taigaComponents").directive("tgProjectMenu", ProjectMenuDirective);

}).call(this);

(function() {
  var FeedbackService,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  FeedbackService = (function(superClass) {
    extend(FeedbackService, superClass);

    FeedbackService.$inject = ["tgLightboxFactory"];

    function FeedbackService(lightboxFactory) {
      this.lightboxFactory = lightboxFactory;
    }

    FeedbackService.prototype.sendFeedback = function() {
      return this.lightboxFactory.create("tg-lb-feedback", {
        "class": "lightbox lightbox-feedback lightbox-generic-form"
      });
    };

    return FeedbackService;

  })(taiga.Service);

  angular.module("taigaFeedback").service("tgFeedbackService", FeedbackService);

}).call(this);

(function() {
  var DutyDirective;

  DutyDirective = function(navurls, $translate) {
    var link;
    link = function(scope, el, attrs, ctrl) {
      scope.vm = {};
      scope.vm.duty = scope.duty;
      return scope.vm.getDutyType = function() {
        if (scope.vm.duty) {
          if (scope.vm.duty.get('_name') === "userstories") {
            return $translate.instant("COMMON.USER_STORY");
          }
          if (scope.vm.duty.get('_name') === "tasks") {
            return $translate.instant("COMMON.TASK");
          }
          if (scope.vm.duty.get('_name') === "issues") {
            return $translate.instant("COMMON.ISSUE");
          }
        }
      };
    };
    return {
      templateUrl: "home/duties/duty.html",
      scope: {
        "duty": "=tgDuty"
      },
      link: link
    };
  };

  DutyDirective.$inject = ["$tgNavUrls", "$translate"];

  angular.module("taigaHome").directive("tgDuty", DutyDirective);

}).call(this);

(function() {
  var HomeService, groupBy,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  groupBy = this.taiga.groupBy;

  HomeService = (function(superClass) {
    extend(HomeService, superClass);

    HomeService.$inject = ["$tgNavUrls", "tgResources", "tgProjectsService"];

    function HomeService(navurls, rs, projectsService) {
      this.navurls = navurls;
      this.rs = rs;
      this.projectsService = projectsService;
    }

    HomeService.prototype._attachProjectInfoToWorkInProgress = function(workInProgress, projectsById) {
      var _attachProjectInfoToDuty, _duties, assignedTo, watching;
      _attachProjectInfoToDuty = (function(_this) {
        return function(duty, objType) {
          var ctx, project, url;
          project = projectsById.get(String(duty.get('project')));
          ctx = {
            project: project.get('slug'),
            ref: duty.get('ref')
          };
          url = _this.navurls.resolve("project-" + objType + "-detail", ctx);
          duty = duty.set('url', url);
          duty = duty.set('projectName', project.get('name'));
          duty = duty.set("_name", objType);
          return duty;
        };
      })(this);
      assignedTo = workInProgress.get("assignedTo");
      if (assignedTo.get("userStories")) {
        _duties = assignedTo.get("userStories").map(function(duty) {
          return _attachProjectInfoToDuty(duty, "userstories");
        });
        assignedTo = assignedTo.set("userStories", _duties);
      }
      if (assignedTo.get("tasks")) {
        _duties = assignedTo.get("tasks").map(function(duty) {
          return _attachProjectInfoToDuty(duty, "tasks");
        });
        assignedTo = assignedTo.set("tasks", _duties);
      }
      if (assignedTo.get("issues")) {
        _duties = assignedTo.get("issues").map(function(duty) {
          return _attachProjectInfoToDuty(duty, "issues");
        });
        assignedTo = assignedTo.set("issues", _duties);
      }
      watching = workInProgress.get("watching");
      if (watching.get("userStories")) {
        _duties = watching.get("userStories").map(function(duty) {
          return _attachProjectInfoToDuty(duty, "userstories");
        });
        watching = watching.set("userStories", _duties);
      }
      if (watching.get("tasks")) {
        _duties = watching.get("tasks").map(function(duty) {
          return _attachProjectInfoToDuty(duty, "tasks");
        });
        watching = watching.set("tasks", _duties);
      }
      if (watching.get("issues")) {
        _duties = watching.get("issues").map(function(duty) {
          return _attachProjectInfoToDuty(duty, "issues");
        });
        watching = watching.set("issues", _duties);
      }
      workInProgress = workInProgress.set("assignedTo", assignedTo);
      return workInProgress = workInProgress.set("watching", watching);
    };

    HomeService.prototype.getWorkInProgress = function(userId) {
      var assignedIssuesPromise, assignedTasksPromise, assignedTo, assignedUserStoriesPromise, params, params_us, projectsById, projectsPromise, watching, watchingIssuesPromise, watchingTasksPromise, watchingUserStoriesPromise, workInProgress;
      projectsById = Immutable.Map();
      projectsPromise = this.projectsService.getProjectsByUserId(userId).then(function(projects) {
        return projectsById = Immutable.fromJS(groupBy(projects.toJS(), function(p) {
          return p.id;
        }));
      });
      assignedTo = Immutable.Map();
      params = {
        status__is_closed: false,
        assigned_to: userId
      };
      params_us = {
        is_closed: false,
        assigned_to: userId
      };
      assignedUserStoriesPromise = this.rs.userstories.listInAllProjects(params_us).then(function(userstories) {
        return assignedTo = assignedTo.set("userStories", userstories);
      });
      assignedTasksPromise = this.rs.tasks.listInAllProjects(params).then(function(tasks) {
        return assignedTo = assignedTo.set("tasks", tasks);
      });
      assignedIssuesPromise = this.rs.issues.listInAllProjects(params).then(function(issues) {
        return assignedTo = assignedTo.set("issues", issues);
      });
      params = {
        status__is_closed: false,
        watchers: userId
      };
      params_us = {
        is_closed: false,
        watchers: userId
      };
      watching = Immutable.Map();
      watchingUserStoriesPromise = this.rs.userstories.listInAllProjects(params_us).then(function(userstories) {
        return watching = watching.set("userStories", userstories);
      });
      watchingTasksPromise = this.rs.tasks.listInAllProjects(params).then(function(tasks) {
        return watching = watching.set("tasks", tasks);
      });
      watchingIssuesPromise = this.rs.issues.listInAllProjects(params).then(function(issues) {
        return watching = watching.set("issues", issues);
      });
      workInProgress = Immutable.Map();
      return Promise.all([projectsPromise, assignedUserStoriesPromise, assignedTasksPromise, assignedIssuesPromise, watchingUserStoriesPromise, watchingTasksPromise, watchingIssuesPromise]).then((function(_this) {
        return function() {
          workInProgress = workInProgress.set("assignedTo", assignedTo);
          workInProgress = workInProgress.set("watching", watching);
          workInProgress = _this._attachProjectInfoToWorkInProgress(workInProgress, projectsById);
          return workInProgress;
        };
      })(this));
    };

    return HomeService;

  })(taiga.Service);

  angular.module("taigaHome").service("tgHomeService", HomeService);

}).call(this);

(function() {
  var HomeProjectListDirective;

  HomeProjectListDirective = function(currentUserService, projectsService) {
    var directive, link;
    link = function(scope, el, attrs, ctrl) {
      scope.vm = {};
      taiga.defineImmutableProperty(scope.vm, "projects", function() {
        return currentUserService.projects.get("recents");
      });
      return scope.vm.newProject = function() {
        return projectsService.newProject();
      };
    };
    directive = {
      templateUrl: "home/projects/home-project-list.html",
      scope: {},
      link: link
    };
    return directive;
  };

  HomeProjectListDirective.$inject = ["tgCurrentUserService", "tgProjectsService"];

  angular.module("taigaHome").directive("tgHomeProjectList", HomeProjectListDirective);

}).call(this);

(function() {
  var WorkingOnController;

  WorkingOnController = (function() {
    WorkingOnController.$inject = ["tgHomeService"];

    function WorkingOnController(homeService) {
      this.homeService = homeService;
      this.assignedTo = Immutable.Map();
      this.watching = Immutable.Map();
    }

    WorkingOnController.prototype._setAssignedTo = function(workInProgress) {
      var issues, tasks, userStories;
      userStories = workInProgress.get("assignedTo").get("userStories");
      tasks = workInProgress.get("assignedTo").get("tasks");
      issues = workInProgress.get("assignedTo").get("issues");
      this.assignedTo = userStories.concat(tasks).concat(issues);
      if (this.assignedTo.size > 0) {
        return this.assignedTo = this.assignedTo.sortBy(function(elem) {
          return elem.get("modified_date");
        }).reverse();
      }
    };

    WorkingOnController.prototype._setWatching = function(workInProgress) {
      var issues, tasks, userStories;
      userStories = workInProgress.get("watching").get("userStories");
      tasks = workInProgress.get("watching").get("tasks");
      issues = workInProgress.get("watching").get("issues");
      this.watching = userStories.concat(tasks).concat(issues);
      if (this.watching.size > 0) {
        return this.watching = this.watching.sortBy(function(elem) {
          return elem.get("modified_date");
        }).reverse();
      }
    };

    WorkingOnController.prototype.getWorkInProgress = function(userId) {
      return this.homeService.getWorkInProgress(userId).then((function(_this) {
        return function(workInProgress) {
          _this._setAssignedTo(workInProgress);
          return _this._setWatching(workInProgress);
        };
      })(this));
    };

    return WorkingOnController;

  })();

  angular.module("taigaHome").controller("WorkingOn", WorkingOnController);

}).call(this);

(function() {
  var WorkingOnDirective;

  WorkingOnDirective = function(homeService, currentUserService) {
    var link;
    link = function(scope, el, attrs, ctrl) {
      var userId;
      userId = currentUserService.getUser().get("id");
      return ctrl.getWorkInProgress(userId);
    };
    return {
      controller: "WorkingOn",
      controllerAs: "vm",
      templateUrl: "home/working-on/working-on.html",
      scope: {},
      link: link
    };
  };

  WorkingOnDirective.$inject = ["tgHomeService", "tgCurrentUserService"];

  angular.module("taigaHome").directive("tgWorkingOn", WorkingOnDirective);

}).call(this);

(function() {
  var DropdownProjectListDirective;

  DropdownProjectListDirective = function(currentUserService, projectsService) {
    var directive, link;
    link = function(scope, el, attrs, ctrl) {
      scope.vm = {};
      taiga.defineImmutableProperty(scope.vm, "projects", function() {
        return currentUserService.projects.get("recents");
      });
      return scope.vm.newProject = function() {
        return projectsService.newProject();
      };
    };
    directive = {
      templateUrl: "navigation-bar/dropdown-project-list/dropdown-project-list.html",
      scope: {},
      link: link
    };
    return directive;
  };

  DropdownProjectListDirective.$inject = ["tgCurrentUserService", "tgProjectsService"];

  angular.module("taigaNavigationBar").directive("tgDropdownProjectList", DropdownProjectListDirective);

}).call(this);

(function() {
  var DropdownUserDirective;

  DropdownUserDirective = function(authService, configService, locationService, navUrlsService, feedbackService) {
    var directive, link;
    link = function(scope, el, attrs, ctrl) {
      scope.vm = {};
      scope.vm.isFeedbackEnabled = configService.get("feedbackEnabled");
      taiga.defineImmutableProperty(scope.vm, "user", function() {
        return authService.userData;
      });
      scope.vm.logout = function() {
        authService.logout();
        return locationService.path(navUrlsService.resolve("login"));
      };
      return scope.vm.sendFeedback = function() {
        return feedbackService.sendFeedback();
      };
    };
    directive = {
      templateUrl: "navigation-bar/dropdown-user/dropdown-user.html",
      scope: {},
      link: link
    };
    return directive;
  };

  DropdownUserDirective.$inject = ["$tgAuth", "$tgConfig", "$tgLocation", "$tgNavUrls", "tgFeedbackService"];

  angular.module("taigaNavigationBar").directive("tgDropdownUser", DropdownUserDirective);

}).call(this);

(function() {
  var NavigationBarDirective;

  NavigationBarDirective = function(currentUserService, $location) {
    var directive, link;
    link = function(scope, el, attrs, ctrl) {
      scope.vm = {};
      scope.$on("$routeChangeSuccess", function() {
        if ($location.path() === "/") {
          return scope.vm.active = true;
        } else {
          return scope.vm.active = false;
        }
      });
      taiga.defineImmutableProperty(scope.vm, "projects", function() {
        return currentUserService.projects.get("recents");
      });
      return taiga.defineImmutableProperty(scope.vm, "isAuthenticated", function() {
        return currentUserService.isAuthenticated();
      });
    };
    directive = {
      templateUrl: "navigation-bar/navigation-bar.html",
      scope: {},
      link: link
    };
    return directive;
  };

  NavigationBarDirective.$inject = ["tgCurrentUserService", "$location"];

  angular.module("taigaNavigationBar").directive("tgNavigationBar", NavigationBarDirective);

}).call(this);

(function() {
  var ProfileBarController;

  ProfileBarController = (function() {
    ProfileBarController.$inject = ["tgUserService"];

    function ProfileBarController(userService) {
      this.userService = userService;
      this.loadStats();
    }

    ProfileBarController.prototype.loadStats = function() {
      return this.userService.getStats(this.user.get("id")).then((function(_this) {
        return function(stats) {
          return _this.stats = stats;
        };
      })(this));
    };

    return ProfileBarController;

  })();

  angular.module("taigaProfile").controller("ProfileBar", ProfileBarController);

}).call(this);

(function() {
  var ProfileBarDirective;

  ProfileBarDirective = function() {
    return {
      templateUrl: "profile/profile-bar/profile-bar.html",
      controller: "ProfileBar",
      controllerAs: "vm",
      scope: {
        user: "=user",
        isCurrentUser: "=iscurrentuser"
      },
      bindToController: true
    };
  };

  angular.module("taigaProfile").directive("tgProfileBar", ProfileBarDirective);

}).call(this);

(function() {
  var ProfileContactsController;

  ProfileContactsController = (function() {
    ProfileContactsController.$inject = ["tgUserService", "tgCurrentUserService"];

    function ProfileContactsController(userService, currentUserService) {
      this.userService = userService;
      this.currentUserService = currentUserService;
      this.currentUser = this.currentUserService.getUser();
      this.isCurrentUser = false;
      if (this.currentUser && this.currentUser.get("id") === this.user.get("id")) {
        this.isCurrentUser = true;
      }
    }

    ProfileContactsController.prototype.loadContacts = function() {
      return this.userService.getContacts(this.user.get("id")).then((function(_this) {
        return function(contacts) {
          return _this.contacts = contacts;
        };
      })(this));
    };

    return ProfileContactsController;

  })();

  angular.module("taigaProfile").controller("ProfileContacts", ProfileContactsController);

}).call(this);

(function() {
  var ProfileContactsDirective;

  ProfileContactsDirective = function() {
    var link;
    link = function(scope, elm, attrs, ctrl) {
      return ctrl.loadContacts();
    };
    return {
      templateUrl: "profile/profile-contacts/profile-contacts.html",
      scope: {
        user: "="
      },
      controllerAs: "vm",
      controller: "ProfileContacts",
      link: link,
      bindToController: true
    };
  };

  angular.module("taigaProfile").directive("tgProfileContacts", ProfileContactsDirective);

}).call(this);

(function() {
  var ProfileHints;

  ProfileHints = (function() {
    ProfileHints.prototype.HINTS = [
      {
        url: "https://taiga.io/support/import-export-projects/"
      }, {
        url: "https://taiga.io/support/custom-fields/"
      }, {}, {}
    ];

    function ProfileHints(translate) {
      var hintKey;
      this.translate = translate;
      hintKey = Math.floor(Math.random() * this.HINTS.length) + 1;
      this.hint = this.HINTS[hintKey - 1];
      this.hint.linkText = this.hint.linkText || 'HINTS.LINK';
      this.hint.title = this.translate.instant("HINTS.HINT" + hintKey + "_TITLE");
      this.hint.text = this.translate.instant("HINTS.HINT" + hintKey + "_TEXT");
    }

    return ProfileHints;

  })();

  ProfileHints.$inject = ["$translate"];

  angular.module("taigaProfile").controller("ProfileHints", ProfileHints);

}).call(this);

(function() {
  var ProfileHints;

  ProfileHints = function($translate) {
    return {
      scope: {},
      controller: "ProfileHints",
      controllerAs: "vm",
      templateUrl: "profile/profile-hints/profile-hints.html"
    };
  };

  ProfileHints.$inject = ["$translate"];

  angular.module("taigaProfile").directive("tgProfileHints", ProfileHints);

}).call(this);

(function() {
  var ProfileProjectsController;

  ProfileProjectsController = (function() {
    ProfileProjectsController.$inject = ["tgProjectsService", "tgUserService"];

    function ProfileProjectsController(projectsService, userService) {
      this.projectsService = projectsService;
      this.userService = userService;
    }

    ProfileProjectsController.prototype.loadProjects = function() {
      return this.projectsService.getProjectsByUserId(this.user.get("id")).then((function(_this) {
        return function(projects) {
          return _this.userService.attachUserContactsToProjects(_this.user.get("id"), projects);
        };
      })(this)).then((function(_this) {
        return function(projects) {
          return _this.projects = projects;
        };
      })(this));
    };

    return ProfileProjectsController;

  })();

  angular.module("taigaProfile").controller("ProfileProjects", ProfileProjectsController);

}).call(this);

(function() {
  var ProfileProjectsDirective;

  ProfileProjectsDirective = function() {
    var link;
    link = function(scope, elm, attr, ctrl) {
      return ctrl.loadProjects();
    };
    return {
      templateUrl: "profile/profile-projects/profile-projects.html",
      scope: {
        user: "="
      },
      link: link,
      bindToController: true,
      controllerAs: "vm",
      controller: "ProfileProjects"
    };
  };

  angular.module("taigaProfile").directive("tgProfileProjects", ProfileProjectsDirective);

}).call(this);

(function() {
  var ProfileTabDirective;

  ProfileTabDirective = function() {
    var link;
    link = function(scope, element, attrs, ctrl, transclude) {
      scope.tab = {};
      attrs.$observe("tabTitle", function(title) {
        return scope.tab.title = title;
      });
      scope.tab.name = attrs.tgProfileTab;
      scope.tab.icon = attrs.tabIcon;
      scope.tab.active = !!attrs.tabActive;
      if (scope.$eval(attrs.tabDisabled) !== true) {
        return ctrl.addTab(scope.tab);
      }
    };
    return {
      templateUrl: "profile/profile-tab/profile-tab.html",
      scope: {},
      require: "^tgProfileTabs",
      link: link,
      transclude: true
    };
  };

  angular.module("taigaProfile").directive("tgProfileTab", ProfileTabDirective);

}).call(this);

(function() {
  var ProfileTabsController;

  ProfileTabsController = (function() {
    function ProfileTabsController() {
      this.tabs = [];
    }

    ProfileTabsController.prototype.addTab = function(tab) {
      return this.tabs.push(tab);
    };

    ProfileTabsController.prototype.toggleTab = function(tab) {
      _.map(this.tabs, function(tab) {
        return tab.active = false;
      });
      return tab.active = true;
    };

    return ProfileTabsController;

  })();

  angular.module("taigaProfile").controller("ProfileTabs", ProfileTabsController);

}).call(this);

(function() {
  var ProfileTabsDirective;

  ProfileTabsDirective = function() {
    return {
      scope: {},
      controller: "ProfileTabs",
      controllerAs: "vm",
      templateUrl: "profile/profile-tabs/profile-tabs.html",
      transclude: true
    };
  };

  angular.module("taigaProfile").directive("tgProfileTabs", ProfileTabsDirective);

}).call(this);

(function() {
  var ProfileController;

  ProfileController = (function() {
    ProfileController.$inject = ["tgAppMetaService", "tgCurrentUserService", "$routeParams", "tgUserService", "tgXhrErrorService", "$translate"];

    function ProfileController(appMetaService, currentUserService, routeParams, userService, xhrError, translate) {
      this.appMetaService = appMetaService;
      this.currentUserService = currentUserService;
      this.routeParams = routeParams;
      this.userService = userService;
      this.xhrError = xhrError;
      this.translate = translate;
      this.isCurrentUser = false;
      if (this.routeParams.slug) {
        this.userService.getUserByUserName(this.routeParams.slug).then((function(_this) {
          return function(user) {
            if (!user.get('is_active')) {
              return _this.xhrError.notFound();
            } else {
              _this.user = user;
              _this.isCurrentUser = false;
              _this._setMeta(_this.user);
              return user;
            }
          };
        })(this))["catch"]((function(_this) {
          return function(xhr) {
            return _this.xhrError.response(xhr);
          };
        })(this));
      } else {
        this.user = this.currentUserService.getUser();
        this.isCurrentUser = true;
        this._setMeta(this.user);
      }
    }

    ProfileController.prototype._setMeta = function(user) {
      var ctx, description, title;
      ctx = {
        userFullName: user.get("full_name_display"),
        userUsername: user.get("username")
      };
      title = this.translate.instant("USER.PROFILE.PAGE_TITLE", ctx);
      description = user.get("bio");
      return this.appMetaService.setAll(title, description);
    };

    return ProfileController;

  })();

  angular.module("taigaProfile").controller("Profile", ProfileController);

}).call(this);

(function() {
  var SortProjectsDirective;

  SortProjectsDirective = function(currentUserService) {
    var directive, link;
    link = function(scope, el, attrs, ctrl) {
      var itemEl;
      itemEl = null;
      el.sortable({
        dropOnEmpty: true,
        revert: 200,
        axis: "y",
        opacity: .95,
        placeholder: 'placeholder',
        cancel: '.project-name'
      });
      return el.on("sortstop", function(event, ui) {
        var i, index, len, project, sortData, sorted_project_ids, value;
        itemEl = ui.item;
        project = itemEl.scope().project;
        index = itemEl.index();
        sorted_project_ids = _.map(scope.projects.toJS(), function(p) {
          return p.id;
        });
        sorted_project_ids = _.without(sorted_project_ids, project.get("id"));
        sorted_project_ids.splice(index, 0, project.get('id'));
        sortData = [];
        for (index = i = 0, len = sorted_project_ids.length; i < len; index = ++i) {
          value = sorted_project_ids[index];
          sortData.push({
            "project_id": value,
            "order": index
          });
        }
        return currentUserService.bulkUpdateProjectsOrder(sortData);
      });
    };
    directive = {
      scope: {
        projects: "=tgSortProjects"
      },
      link: link
    };
    return directive;
  };

  angular.module("taigaProjects").directive("tgSortProjects", ["tgCurrentUserService", SortProjectsDirective]);

}).call(this);

(function() {
  var ProjectsListingController;

  ProjectsListingController = (function() {
    ProjectsListingController.$inject = ["tgCurrentUserService", "tgProjectsService"];

    function ProjectsListingController(currentUserService, projectsService) {
      this.currentUserService = currentUserService;
      this.projectsService = projectsService;
      taiga.defineImmutableProperty(this, "projects", (function(_this) {
        return function() {
          return _this.currentUserService.projects.get("all");
        };
      })(this));
    }

    ProjectsListingController.prototype.newProject = function() {
      return this.projectsService.newProject();
    };

    return ProjectsListingController;

  })();

  angular.module("taigaProjects").controller("ProjectsListing", ProjectsListingController);

}).call(this);

(function() {
  var ProjectController;

  ProjectController = (function() {
    ProjectController.$inject = ["tgProjectsService", "$routeParams", "tgAppMetaService", "$tgAuth", "tgXhrErrorService", "$translate"];

    function ProjectController(projectsService, routeParams, appMetaService, auth, xhrError, translate) {
      var projectSlug;
      this.projectsService = projectsService;
      this.routeParams = routeParams;
      this.appMetaService = appMetaService;
      this.auth = auth;
      this.xhrError = xhrError;
      this.translate = translate;
      projectSlug = this.routeParams.pslug;
      this.user = this.auth.userData;
      this.projectsService.getProjectBySlug(projectSlug).then((function(_this) {
        return function(project) {
          _this.project = project;
          return _this._setMeta(_this.project);
        };
      })(this))["catch"]((function(_this) {
        return function(xhr) {
          return _this.xhrError.response(xhr);
        };
      })(this));
    }

    ProjectController.prototype._setMeta = function(project) {
      var ctx, description, title;
      ctx = {
        projectName: project.get("name")
      };
      title = this.translate.instant("PROJECT.PAGE_TITLE", ctx);
      description = project.get("description");
      return this.appMetaService.setAll(title, description);
    };

    return ProjectController;

  })();

  angular.module("taigaProjects").controller("Project", ProjectController);

}).call(this);

(function() {
  var ProjectsService, groupBy, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  groupBy = this.taiga.groupBy;

  ProjectsService = (function(superClass) {
    extend(ProjectsService, superClass);

    ProjectsService.$inject = ["tgResources", "$projectUrl", "tgLightboxFactory"];

    function ProjectsService(rs, projectUrl, lightboxFactory) {
      this.rs = rs;
      this.projectUrl = projectUrl;
      this.lightboxFactory = lightboxFactory;
    }

    ProjectsService.prototype.getProjectBySlug = function(projectSlug) {
      return this.rs.projects.getProjectBySlug(projectSlug).then((function(_this) {
        return function(project) {
          return _this._decorate(project);
        };
      })(this));
    };

    ProjectsService.prototype.getProjectStats = function(projectId) {
      return this.rs.projects.getProjectStats(projectId);
    };

    ProjectsService.prototype.getProjectsByUserId = function(userId, paginate) {
      return this.rs.projects.getProjectsByUserId(userId, paginate).then((function(_this) {
        return function(projects) {
          return projects.map(_this._decorate.bind(_this));
        };
      })(this));
    };

    ProjectsService.prototype._decorate = function(project) {
      var colorized_tags, tags, url;
      url = this.projectUrl.get(project.toJS());
      project = project.set("url", url);
      colorized_tags = [];
      if (project.get("tags")) {
        tags = project.get("tags").sort();
        colorized_tags = tags.map(function(tag) {
          var color;
          color = project.get("tags_colors").get(tag);
          return Immutable.fromJS({
            name: tag,
            color: color
          });
        });
        project = project.set("colorized_tags", colorized_tags);
      }
      return project;
    };

    ProjectsService.prototype.newProject = function() {
      return this.lightboxFactory.create("tg-lb-create-project", {
        "class": "wizard-create-project"
      });
    };

    ProjectsService.prototype.bulkUpdateProjectsOrder = function(sortData) {
      return this.rs.projects.bulkUpdateOrder(sortData);
    };

    return ProjectsService;

  })(taiga.Service);

  angular.module("taigaProjects").service("tgProjectsService", ProjectsService);

}).call(this);

(function() {
  var Resource, module;

  Resource = function(urlsService, http) {
    var service;
    service = {};
    service.listInAllProjects = function(params) {
      var httpOptions, url;
      url = urlsService.resolve("issues");
      httpOptions = {
        headers: {
          "x-disable-pagination": "1"
        }
      };
      return http.get(url, params, httpOptions).then(function(result) {
        return Immutable.fromJS(result.data);
      });
    };
    return function() {
      return {
        "issues": service
      };
    };
  };

  Resource.$inject = ["$tgUrls", "$tgHttp"];

  module = angular.module("taigaResources2");

  module.factory("tgIssuesResource", Resource);

}).call(this);

(function() {
  var Resource, module, pagination;

  pagination = function() {};

  Resource = function(urlsService, http, paginateResponseService) {
    var service;
    service = {};
    service.getProjectBySlug = function(projectSlug) {
      var url;
      url = urlsService.resolve("projects");
      url = url + "/by_slug?slug=" + projectSlug;
      return http.get(url).then(function(result) {
        return Immutable.fromJS(result.data);
      });
    };
    service.getProjectsByUserId = function(userId, paginate) {
      var httpOptions, params, url;
      if (paginate == null) {
        paginate = false;
      }
      url = urlsService.resolve("projects");
      httpOptions = {};
      if (!paginate) {
        httpOptions.headers = {
          "x-disable-pagination": "1"
        };
      }
      params = {
        "member": userId,
        "order_by": "memberships__user_order"
      };
      return http.get(url, params, httpOptions).then(function(result) {
        return Immutable.fromJS(result.data);
      });
    };
    service.getProjectStats = function(projectId) {
      var url;
      url = urlsService.resolve("projects");
      url = url + "/" + projectId;
      return http.get(url).then(function(result) {
        return Immutable.fromJS(result.data);
      });
    };
    service.bulkUpdateOrder = function(bulkData) {
      var url;
      url = urlsService.resolve("bulk-update-projects-order");
      return http.post(url, bulkData);
    };
    service.getTimeline = function(projectId, page) {
      var params, url;
      params = {
        page: page
      };
      url = urlsService.resolve("timeline-project");
      url = url + "/" + projectId;
      return http.get(url, params).then(function(result) {
        result = Immutable.fromJS(result);
        return paginateResponseService(result);
      });
    };
    return function() {
      return {
        "projects": service
      };
    };
  };

  Resource.$inject = ["$tgUrls", "$tgHttp", "tgPaginateResponseService"];

  module = angular.module("taigaResources2");

  module.factory("tgProjectsResources", Resource);

}).call(this);

(function() {
  var Resources, services;

  services = ["tgProjectsResources", "tgUsersResources", "tgUserstoriesResource", "tgTasksResource", "tgIssuesResource"];

  Resources = function($injector) {
    var i, j, len, len1, ref, service, serviceFn, serviceName, serviceProperty;
    for (i = 0, len = services.length; i < len; i++) {
      serviceName = services[i];
      serviceFn = $injector.get(serviceName);
      service = $injector.invoke(serviceFn);
      ref = Object.keys(service);
      for (j = 0, len1 = ref.length; j < len1; j++) {
        serviceProperty = ref[j];
        if (this[serviceProperty]) {
          console.warm("repeated resource " + serviceProperty);
        }
        this[serviceProperty] = service[serviceProperty];
      }
    }
    return this;
  };

  Resources.$inject = ["$injector"];

  angular.module("taigaResources2").service("tgResources", Resources);

}).call(this);

(function() {
  var Resource, module;

  Resource = function(urlsService, http) {
    var service;
    service = {};
    service.listInAllProjects = function(params) {
      var httpOptions, url;
      url = urlsService.resolve("tasks");
      httpOptions = {
        headers: {
          "x-disable-pagination": "1"
        }
      };
      return http.get(url, params, httpOptions).then(function(result) {
        return Immutable.fromJS(result.data);
      });
    };
    return function() {
      return {
        "tasks": service
      };
    };
  };

  Resource.$inject = ["$tgUrls", "$tgHttp"];

  module = angular.module("taigaResources2");

  module.factory("tgTasksResource", Resource);

}).call(this);

(function() {
  var Resource, module;

  Resource = function(urlsService, http, paginateResponseService) {
    var service;
    service = {};
    service.getUserByUsername = function(username) {
      var httpOptions, params, url;
      url = urlsService.resolve("by_username");
      httpOptions = {
        headers: {
          "x-disable-pagination": "1"
        }
      };
      params = {
        username: username
      };
      return http.get(url, params, httpOptions).then(function(result) {
        return Immutable.fromJS(result.data);
      });
    };
    service.getStats = function(userId) {
      var httpOptions, url;
      url = urlsService.resolve("stats", userId);
      httpOptions = {
        headers: {
          "x-disable-pagination": "1"
        }
      };
      return http.get(url, {}, httpOptions).then(function(result) {
        return Immutable.fromJS(result.data);
      });
    };
    service.getContacts = function(userId) {
      var httpOptions, url;
      url = urlsService.resolve("contacts", userId);
      httpOptions = {
        headers: {
          "x-disable-pagination": "1"
        }
      };
      return http.get(url, {}, httpOptions).then(function(result) {
        return Immutable.fromJS(result.data);
      });
    };
    service.getProfileTimeline = function(userId, page) {
      var params, url;
      params = {
        page: page
      };
      url = urlsService.resolve("timeline-profile");
      url = url + "/" + userId;
      return http.get(url, params).then(function(result) {
        result = Immutable.fromJS(result);
        return paginateResponseService(result);
      });
    };
    service.getUserTimeline = function(userId, page) {
      var params, url;
      params = {
        page: page
      };
      url = urlsService.resolve("timeline-user");
      url = url + "/" + userId;
      return http.get(url, params).then(function(result) {
        result = Immutable.fromJS(result);
        return paginateResponseService(result);
      });
    };
    return function() {
      return {
        "users": service
      };
    };
  };

  Resource.$inject = ["$tgUrls", "$tgHttp", "tgPaginateResponseService"];

  module = angular.module("taigaResources2");

  module.factory("tgUsersResources", Resource);

}).call(this);

(function() {
  var Resource, module;

  Resource = function(urlsService, http) {
    var service;
    service = {};
    service.listInAllProjects = function(params) {
      var httpOptions, url;
      url = urlsService.resolve("userstories");
      httpOptions = {
        headers: {
          "x-disable-pagination": "1"
        }
      };
      return http.get(url, params, httpOptions).then(function(result) {
        return Immutable.fromJS(result.data);
      });
    };
    return function() {
      return {
        "userstories": service
      };
    };
  };

  Resource.$inject = ["$tgUrls", "$tgHttp"];

  module = angular.module("taigaResources2");

  module.factory("tgUserstoriesResource", Resource);

}).call(this);

(function() {
  var AppMetaService, taiga, truncate,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  truncate = taiga.truncate;

  AppMetaService = (function(superClass) {
    extend(AppMetaService, superClass);

    function AppMetaService() {
      return AppMetaService.__super__.constructor.apply(this, arguments);
    }

    return AppMetaService;

  })(taiga.Service = function() {
    return {
      _set: function(key, value) {
        var meta;
        if (!key) {
          return;
        }
        if (key === "title") {
          meta = $("title");
          if (meta.length === 0) {
            meta = $("<title></title>");
            $("head").append(meta);
          }
          return meta.text(value || "");
        } else if (key.indexOf("og:") === 0) {
          meta = $("meta[property='" + key + "']");
          if (meta.length === 0) {
            meta = $("<meta property='" + key + "'/>");
            $("head").append(meta);
          }
          return meta.attr("content", value || "");
        } else {
          meta = $("meta[name='" + key + "']");
          if (meta.length === 0) {
            meta = $("<meta name='" + key + "'/>");
            $("head").append(meta);
          }
          return meta.attr("content", value || "");
        }
      },
      setTitle: function(title) {
        return this._set('title', title);
      },
      setDescription: function(description) {
        return this._set("description", truncate(description, 250));
      },
      setTwitterMetas: function(title, description) {
        this._set("twitter:card", "summary");
        this._set("twitter:site", "@taigaio");
        this._set("twitter:title", title);
        this._set("twitter:description", truncate(description, 300));
        return this._set("twitter:image", window.location.origin + "/images/logo-color.png");
      },
      setOpenGraphMetas: function(title, description) {
        this._set("og:type", "object");
        this._set("og:site_name", "Taiga - Love your projects");
        this._set("og:title", title);
        this._set("og:description", truncate(description, 300));
        this._set("og:image", window.location.origin + "/images/logo-color.png");
        return this._set("og:url", window.location.href);
      },
      setAll: function(title, description) {
        this.setTitle(title);
        this.setDescription(description);
        this.setTwitterMetas(title, description);
        return this.setOpenGraphMetas(title, description);
      }
    };
  });

  angular.module("taigaCommon").service("tgAppMetaService", AppMetaService);

}).call(this);

(function() {
  var CurrentUserService, groupBy, taiga;

  taiga = this.taiga;

  groupBy = this.taiga.groupBy;

  CurrentUserService = (function() {
    CurrentUserService.$inject = ["tgProjectsService", "$tgStorage"];

    function CurrentUserService(projectsService, storageService) {
      this.projectsService = projectsService;
      this.storageService = storageService;
      this._user = null;
      this._projects = Immutable.Map();
      this._projectsById = Immutable.Map();
      taiga.defineImmutableProperty(this, "projects", (function(_this) {
        return function() {
          return _this._projects;
        };
      })(this));
      taiga.defineImmutableProperty(this, "projectsById", (function(_this) {
        return function() {
          return _this._projectsById;
        };
      })(this));
    }

    CurrentUserService.prototype.isAuthenticated = function() {
      if (this.getUser() !== null) {
        return true;
      }
      return false;
    };

    CurrentUserService.prototype.getUser = function() {
      var userData;
      if (!this._user) {
        userData = this.storageService.get("userInfo");
        if (userData) {
          userData = Immutable.fromJS(userData);
          this.setUser(userData);
        }
      }
      return this._user;
    };

    CurrentUserService.prototype.removeUser = function() {
      this._user = null;
      this._projects = Immutable.Map();
      return this._projectsById = Immutable.Map();
    };

    CurrentUserService.prototype.setUser = function(user) {
      this._user = user;
      return this._loadUserInfo();
    };

    CurrentUserService.prototype.bulkUpdateProjectsOrder = function(sortData) {
      return this.projectsService.bulkUpdateProjectsOrder(sortData).then((function(_this) {
        return function() {
          return _this.loadProjects();
        };
      })(this));
    };

    CurrentUserService.prototype.loadProjects = function() {
      return this.projectsService.getProjectsByUserId(this._user.get("id")).then((function(_this) {
        return function(projects) {
          _this._projects = _this._projects.set("all", projects);
          _this._projects = _this._projects.set("recents", projects.slice(0, 10));
          _this._projectsById = Immutable.fromJS(groupBy(projects.toJS(), function(p) {
            return p.id;
          }));
          return _this.projects;
        };
      })(this));
    };

    CurrentUserService.prototype._loadUserInfo = function() {
      return this.loadProjects();
    };

    return CurrentUserService;

  })();

  angular.module("taigaCommon").service("tgCurrentUserService", CurrentUserService);

}).call(this);

(function() {
  var LightboxFactory;

  LightboxFactory = (function() {
    LightboxFactory.$inject = ["$rootScope", "$compile"];

    function LightboxFactory(rootScope, compile) {
      this.rootScope = rootScope;
      this.compile = compile;
    }

    LightboxFactory.prototype.create = function(name, attrs) {
      var elm, html, scope;
      scope = this.rootScope.$new();
      elm = $("<div>").attr(name, true).attr("tg-bind-scope", true);
      if (attrs) {
        elm.attr(attrs);
      }
      elm.addClass("remove-on-close");
      html = this.compile(elm)(scope);
      $(document.body).append(html);
    };

    return LightboxFactory;

  })();

  angular.module("taigaCommon").service("tgLightboxFactory", LightboxFactory);

}).call(this);

(function() {
  var PaginateResponse;

  PaginateResponse = function() {
    return function(result) {
      var paginateResponse;
      paginateResponse = Immutable.Map({
        "data": result.get("data"),
        "next": !!result.get("headers")("x-pagination-next"),
        "prev": !!result.get("headers")("x-pagination-prev"),
        "current": result.get("headers")("x-pagination-current"),
        "count": result.get("headers")("x-pagination-count")
      });
      return paginateResponse;
    };
  };

  angular.module("taigaCommon").factory("tgPaginateResponseService", PaginateResponse);

}).call(this);

(function() {
  var ProjectService, taiga;

  taiga = this.taiga;

  ProjectService = (function() {
    ProjectService.$inject = ["tgProjectsService"];

    function ProjectService(projectsService) {
      this.projectsService = projectsService;
      this._project = null;
      this._section = null;
      this._sectionsBreadcrumb = Immutable.List();
      taiga.defineImmutableProperty(this, "project", (function(_this) {
        return function() {
          return _this._project;
        };
      })(this));
      taiga.defineImmutableProperty(this, "section", (function(_this) {
        return function() {
          return _this._section;
        };
      })(this));
      taiga.defineImmutableProperty(this, "sectionsBreadcrumb", (function(_this) {
        return function() {
          return _this._sectionsBreadcrumb;
        };
      })(this));
    }

    ProjectService.prototype.setSection = function(section) {
      this._section = section;
      if (section) {
        return this._sectionsBreadcrumb = this._sectionsBreadcrumb.push(this._section);
      } else {
        return this._sectionsBreadcrumb = Immutable.List();
      }
    };

    ProjectService.prototype.setProject = function(pslug) {
      if (this._pslug !== pslug) {
        this._pslug = pslug;
        return this.fetchProject();
      }
    };

    ProjectService.prototype.cleanProject = function() {
      this._pslug = null;
      this._project = null;
      this._section = null;
      return this._sectionsBreadcrumb = Immutable.List();
    };

    ProjectService.prototype.fetchProject = function() {
      return this.projectsService.getProjectBySlug(this._pslug).then((function(_this) {
        return function(project) {
          return _this._project = project;
        };
      })(this));
    };

    return ProjectService;

  })();

  angular.module("taigaCommon").service("tgProjectService", ProjectService);

}).call(this);

(function() {
  var ScopeEvent;

  ScopeEvent = (function() {
    function ScopeEvent() {}

    ScopeEvent.prototype.scopes = {};

    ScopeEvent.prototype._searchDuplicatedScopes = function(id) {
      return _.find(Object.keys(this.scopes), (function(_this) {
        return function(key) {
          return _this.scopes[key].$id === id;
        };
      })(this));
    };

    ScopeEvent.prototype._create = function(name, scope) {
      var duplicatedScopeName;
      duplicatedScopeName = this._searchDuplicatedScopes(scope.$id);
      if (duplicatedScopeName) {
        throw new Error("scopeEvent: this scope is already register with the name \"" + duplicatedScopeName + "\"");
      }
      if (this.scopes[name]) {
        throw new Error("scopeEvent: \"" + name + "\" already in use");
      } else {
        scope._tgEmitter = new EventEmitter2();
        scope.$on("$destroy", (function(_this) {
          return function() {
            scope._tgEmitter.removeAllListeners();
            return delete _this.scopes[name];
          };
        })(this));
        return this.scopes[name] = scope;
      }
    };

    ScopeEvent.prototype.emitter = function(name, scope) {
      if (scope) {
        scope = this._create(name, scope);
      } else if (this.scopes[name]) {
        scope = this.scopes[name];
      } else {
        throw new Error("scopeEvent: \"" + name + "\" scope doesn't exist'");
      }
      return scope._tgEmitter;
    };

    return ScopeEvent;

  })();

  angular.module("taigaCommon").service("tgScopeEvent", ScopeEvent);

}).call(this);

(function() {
  var ThemeService, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  ThemeService = (function(superClass) {
    extend(ThemeService, superClass);

    function ThemeService() {
      return ThemeService.__super__.constructor.apply(this, arguments);
    }

    return ThemeService;

  })(taiga.Service = function() {
    return {
      use: function(themeName) {
        var stylesheetEl;
        stylesheetEl = $("link[rel='stylesheet']");
        if (stylesheetEl.length === 0) {
          stylesheetEl = $("<link rel='stylesheet' href='' type='text/css'>");
          $("head").append(stylesheetEl);
        }
        return stylesheetEl.attr("href", "/styles/theme-" + themeName + ".css");
      }
    };
  });

  angular.module("taigaCommon").service("tgThemeService", ThemeService);

}).call(this);

(function() {
  var UserService, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  UserService = (function(superClass) {
    extend(UserService, superClass);

    UserService.$inject = ["tgResources"];

    function UserService(rs) {
      this.rs = rs;
    }

    UserService.prototype.getUserByUserName = function(username) {
      return this.rs.users.getUserByUsername(username);
    };

    UserService.prototype.getContacts = function(userId) {
      return this.rs.users.getContacts(userId);
    };

    UserService.prototype.getStats = function(userId) {
      return this.rs.users.getStats(userId);
    };

    UserService.prototype.attachUserContactsToProjects = function(userId, projects) {
      return this.getContacts(userId).then(function(contacts) {
        projects = projects.map(function(project) {
          var contactsFiltered;
          contactsFiltered = contacts.filter(function(contact) {
            var contactId;
            contactId = contact.get("id");
            return project.get('members').indexOf(contactId) !== -1;
          });
          project = project.set("contacts", contactsFiltered);
          return project;
        });
        return projects;
      });
    };

    return UserService;

  })(taiga.Service);

  angular.module("taigaCommon").service("tgUserService", UserService);

}).call(this);

(function() {
  var xhrError,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  xhrError = (function(superClass) {
    extend(xhrError, superClass);

    xhrError.$inject = ["$q", "$location", "$tgNavUrls"];

    function xhrError(q, location, navUrls) {
      this.q = q;
      this.location = location;
      this.navUrls = navUrls;
    }

    xhrError.prototype.notFound = function() {
      this.location.path(this.navUrls.resolve("not-found"));
      return this.location.replace();
    };

    xhrError.prototype.permissionDenied = function() {
      this.location.path(this.navUrls.resolve("permission-denied"));
      return this.location.replace();
    };

    xhrError.prototype.response = function(xhr) {
      if (xhr) {
        if (xhr.status === 404) {
          this.notFound();
        } else if (xhr.status === 403) {
          this.permissionDenied();
        }
      }
      return this.q.reject(xhr);
    };

    return xhrError;

  })(taiga.Service);

  angular.module("taigaCommon").service("tgXhrErrorService", xhrError);

}).call(this);

(function() {
  var UserTimelineAttachmentDirective;

  UserTimelineAttachmentDirective = function(template, $compile) {
    var isImage, link, validFileExtensions;
    validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
    isImage = function(url) {
      url = url.toLowerCase();
      return _.some(validFileExtensions, function(extension) {
        return url.indexOf(extension, url - extension.length) !== -1;
      });
    };
    link = function(scope, el) {
      var is_image, templateHtml;
      is_image = isImage(scope.attachment.get('url'));
      if (is_image) {
        templateHtml = template.get("user-timeline/user-timeline-attachment/user-timeline-attachment-image.html");
      } else {
        templateHtml = template.get("user-timeline/user-timeline-attachment/user-timeline-attachment.html");
      }
      el.html(templateHtml);
      $compile(el.contents())(scope);
      return el.find("img").error(function() {
        return this.remove();
      });
    };
    return {
      link: link,
      scope: {
        attachment: "=tgUserTimelineAttachment"
      }
    };
  };

  UserTimelineAttachmentDirective.$inject = ["$tgTemplate", "$compile"];

  angular.module("taigaUserTimeline").directive("tgUserTimelineAttachment", UserTimelineAttachmentDirective);

}).call(this);

(function() {
  var UserTimelineItemTitle, unslugify;

  unslugify = this.taiga.unslugify;

  UserTimelineItemTitle = (function() {
    UserTimelineItemTitle.$inject = ["$translate"];

    UserTimelineItemTitle.prototype._fieldTranslationKey = {
      'status': 'COMMON.FIELDS.STATUS',
      'subject': 'COMMON.FIELDS.SUBJECT',
      'description_diff': 'COMMON.FIELDS.DESCRIPTION',
      'points': 'COMMON.FIELDS.POINTS',
      'assigned_to': 'COMMON.FIELDS.ASSIGNED_TO',
      'severity': 'ISSUES.FIELDS.SEVERITY',
      'priority': 'ISSUES.FIELDS.PRIORITY',
      'type': 'ISSUES.FIELDS.TYPE',
      'is_iocaine': 'TASK.FIELDS.IS_IOCAINE',
      'is_blocked': 'COMMON.FIELDS.IS_BLOCKED'
    };

    UserTimelineItemTitle.prototype._params = {
      username: function(timeline, event) {
        var title_attr, url, user;
        user = timeline.getIn(['data', 'user']);
        if (user.get('is_profile_visible')) {
          title_attr = this.translate.instant('COMMON.SEE_USER_PROFILE', {
            username: user.get('username')
          });
          url = "user-profile:username=vm.timeline.getIn(['data', 'user', 'username'])";
          return this._getLink(url, user.get('name'), title_attr);
        } else {
          return this._getUsernameSpan(user.get('name'));
        }
      },
      field_name: function(timeline, event) {
        var field_name;
        field_name = timeline.getIn(['data', 'value_diff', 'key']);
        return this.translate.instant(this._fieldTranslationKey[field_name]);
      },
      project_name: function(timeline, event) {
        var url;
        url = "project:project=vm.timeline.getIn(['data', 'project', 'slug'])";
        return this._getLink(url, timeline.getIn(["data", "project", "name"]));
      },
      new_value: function(timeline, event) {
        var value;
        if (_.isArray(timeline.getIn(["data", "value_diff", "value"]).toJS())) {
          value = timeline.getIn(["data", "value_diff", "value"]).get(1);
          if (value === null && timeline.getIn(["data", "value_diff", "key"]) === 'assigned_to') {
            value = this.translate.instant('ACTIVITY.VALUES.UNASSIGNED');
          }
          return value;
        } else {
          return timeline.getIn(["data", "value_diff", "value"]).first().get(1);
        }
      },
      sprint_name: function(timeline, event) {
        var url;
        url = "project-taskboard:project=vm.timeline.getIn(['data', 'project', 'slug']),sprint=vm.timeline.getIn(['data', 'milestone', 'slug'])";
        return this._getLink(url, timeline.getIn(['data', 'milestone', 'name']));
      },
      us_name: function(timeline, event) {
        var event_us, obj, text, url;
        obj = this._getTimelineObj(timeline, event).get('userstory');
        event_us = {
          obj: 'parent_userstory'
        };
        url = this._getDetailObjUrl(event_us);
        text = '#' + obj.get('ref') + ' ' + obj.get('subject');
        return this._getLink(url, text);
      },
      obj_name: function(timeline, event) {
        var obj, text, url;
        obj = this._getTimelineObj(timeline, event);
        url = this._getDetailObjUrl(event);
        if (event.obj === 'wikipage') {
          text = unslugify(obj.get('slug'));
        } else if (event.obj === 'milestone') {
          text = obj.get('name');
        } else {
          text = '#' + obj.get('ref') + ' ' + obj.get('subject');
        }
        return this._getLink(url, text);
      },
      role_name: function(timeline, event) {
        return timeline.getIn(['data', 'value_diff', 'value']).keySeq().first();
      }
    };

    function UserTimelineItemTitle(translate) {
      this.translate = translate;
    }

    UserTimelineItemTitle.prototype._translateTitleParams = function(param, timeline, event) {
      return this._params[param].call(this, timeline, event);
    };

    UserTimelineItemTitle.prototype._getTimelineObj = function(timeline, event) {
      return timeline.getIn(['data', event.obj]);
    };

    UserTimelineItemTitle.prototype._getDetailObjUrl = function(event) {
      var url;
      url = {
        "issue": ["project-issues-detail", ":project=vm.timeline.getIn(['data', 'project', 'slug']),ref=vm.timeline.getIn(['obj', 'ref'])"],
        "wikipage": ["project-wiki-page", ":project=vm.timeline.getIn(['data', 'project', 'slug']),slug=vm.timeline.getIn(['obj', 'ref'])"],
        "task": ["project-tasks-detail", ":project=vm.timeline.getIn(['data', 'project', 'slug']),ref=vm.timeline.getIn(['obj', 'ref'])"],
        "userstory": ["project-userstories-detail", ":project=vm.timeline.getIn(['data', 'project', 'slug']),ref=vm.timeline.getIn(['obj', 'ref'])"],
        "parent_userstory": ["project-userstories-detail", ":project=vm.timeline.getIn(['data', 'project', 'slug']),ref=vm.timeline.getIn(['obj', 'userstory', 'ref'])"],
        "milestone": ["project-taskboard", ":project=vm.timeline.getIn(['data', 'project', 'slug']),ref=vm.timeline.getIn(['obj', 'ref'])"]
      };
      return url[event.obj][0] + url[event.obj][1];
    };

    UserTimelineItemTitle.prototype._getLink = function(url, text, title) {
      title = title || text;
      return $('<a>').attr('tg-nav', url).text(text).attr('title', title).prop('outerHTML');
    };

    UserTimelineItemTitle.prototype._getUsernameSpan = function(text) {
      var title;
      title = title || text;
      return $('<span>').addClass('username').text(text).prop('outerHTML');
    };

    UserTimelineItemTitle.prototype._getParams = function(timeline, event, timeline_type) {
      var params;
      params = {};
      timeline_type.translate_params.forEach((function(_this) {
        return function(param) {
          return params[param] = _this._translateTitleParams(param, timeline, event);
        };
      })(this));
      return params;
    };

    UserTimelineItemTitle.prototype.getTitle = function(timeline, event, type) {
      return this.translate.instant(type.key, this._getParams(timeline, event, type));
    };

    return UserTimelineItemTitle;

  })();

  angular.module("taigaUserTimeline").service("tgUserTimelineItemTitle", UserTimelineItemTitle);

}).call(this);

(function() {
  var UserTimelineType, timelineType;

  timelineType = function(timeline, event) {
    var types;
    types = [
      {
        check: function(timeline, event) {
          return event.obj === 'membership';
        },
        key: 'TIMELINE.NEW_MEMBER',
        translate_params: ['project_name'],
        member: function(timeline) {
          return Immutable.Map({
            user: timeline.getIn(['data', 'user']),
            role: timeline.getIn(['data', 'role'])
          });
        }
      }, {
        check: function(timeline, event) {
          return event.obj === 'project' && event.type === 'create';
        },
        key: 'TIMELINE.NEW_PROJECT',
        translate_params: ['username', 'project_name'],
        description: function(timeline) {
          return timeline.getIn(['data', 'project', 'description']);
        }
      }, {
        check: function(timeline, event) {
          return event.type === 'change' && timeline.hasIn(['data', 'value_diff']) && timeline.getIn(['data', 'value_diff', 'key']) === 'attachments';
        },
        key: 'TIMELINE.UPLOAD_ATTACHMENT',
        translate_params: ['username', 'obj_name']
      }, {
        check: function(timeline, event) {
          return event.obj === 'userstory' && event.type === 'create';
        },
        key: 'TIMELINE.US_CREATED',
        translate_params: ['username', 'project_name', 'obj_name']
      }, {
        check: function(timeline, event) {
          return event.obj === 'issue' && event.type === 'create';
        },
        key: 'TIMELINE.ISSUE_CREATED',
        translate_params: ['username', 'project_name', 'obj_name']
      }, {
        check: function(timeline, event) {
          return event.obj === 'wikipage' && event.type === 'create';
        },
        key: 'TIMELINE.WIKI_CREATED',
        translate_params: ['username', 'project_name', 'obj_name']
      }, {
        check: function(timeline, event) {
          return event.obj === 'task' && event.type === 'create' && !timeline.getIn(['data', 'task', 'userstory']);
        },
        key: 'TIMELINE.TASK_CREATED',
        translate_params: ['username', 'project_name', 'obj_name']
      }, {
        check: function(timeline, event) {
          return event.obj === 'task' && event.type === 'create' && timeline.getIn(['data', 'task', 'userstory']);
        },
        key: 'TIMELINE.TASK_CREATED_WITH_US',
        translate_params: ['username', 'project_name', 'obj_name', 'us_name']
      }, {
        check: function(timeline, event) {
          return event.obj === 'milestone' && event.type === 'create';
        },
        key: 'TIMELINE.MILESTONE_CREATED',
        translate_params: ['username', 'project_name', 'obj_name']
      }, {
        check: function(timeline, event) {
          return timeline.getIn(['data', 'comment']) && event.obj === 'userstory';
        },
        key: 'TIMELINE.NEW_COMMENT_US',
        translate_params: ['username', 'obj_name'],
        description: function(timeline) {
          return $(timeline.getIn(['data', 'comment_html'])).text();
        }
      }, {
        check: function(timeline, event) {
          return timeline.getIn(['data', 'comment']) && event.obj === 'issue';
        },
        key: 'TIMELINE.NEW_COMMENT_ISSUE',
        translate_params: ['username', 'obj_name'],
        description: function(timeline) {
          return $(timeline.getIn(['data', 'comment_html'])).text();
        }
      }, {
        check: function(timeline, event) {
          return timeline.getIn(['data', 'comment']) && event.obj === 'task';
        },
        key: 'TIMELINE.NEW_COMMENT_TASK',
        translate_params: ['username', 'obj_name'],
        description: function(timeline) {
          return $(timeline.getIn(['data', 'comment_html'])).text();
        }
      }, {
        check: function(timeline, event) {
          if (timeline.hasIn(['data', 'value_diff']) && timeline.getIn(['data', 'value_diff', 'key']) === 'milestone' && event.type === 'change') {
            return timeline.getIn(['data', 'value_diff', 'value']).get(0) === null;
          }
          return false;
        },
        key: 'TIMELINE.US_ADDED_MILESTONE',
        translate_params: ['username', 'obj_name', 'sprint_name']
      }, {
        check: function(timeline, event) {
          if (timeline.hasIn(['data', 'value_diff']) && timeline.getIn(['data', 'value_diff', 'key']) === 'milestone' && event.type === 'change') {
            return timeline.getIn(['data', 'value_diff', 'value']).get(1) === null;
          }
          return false;
        },
        key: 'TIMELINE.US_REMOVED_FROM_MILESTONE',
        translate_params: ['username', 'obj_name']
      }, {
        check: function(timeline, event) {
          if (timeline.hasIn(['data', 'value_diff']) && timeline.getIn(['data', 'value_diff', 'key']) === 'blocked' && event.type === 'change') {
            return timeline.getIn(['data', 'value_diff', 'value', 'is_blocked']).get(1) === true;
          }
          return false;
        },
        key: 'TIMELINE.BLOCKED',
        translate_params: ['username', 'obj_name'],
        description: function(timeline) {
          if (timeline.hasIn(['data', 'value_diff', 'value', 'blocked_note_html'])) {
            return $(timeline.getIn(['data', 'value_diff', 'value', 'blocked_note_html']).get(1)).text();
          } else {
            return false;
          }
        }
      }, {
        check: function(timeline, event) {
          if (timeline.hasIn(['data', 'value_diff']) && timeline.getIn(['data', 'value_diff', 'key']) === 'blocked' && event.type === 'change') {
            return timeline.getIn(['data', 'value_diff', 'value', 'is_blocked']).get(1) === false;
          }
          return false;
        },
        key: 'TIMELINE.UNBLOCKED',
        translate_params: ['username', 'obj_name']
      }, {
        check: function(timeline, event) {
          return event.obj === 'milestone' && event.type === 'change';
        },
        key: 'TIMELINE.MILESTONE_UPDATED',
        translate_params: ['username', 'obj_name']
      }, {
        check: function(timeline, event) {
          return event.obj === 'wikipage' && event.type === 'change';
        },
        key: 'TIMELINE.WIKI_UPDATED',
        translate_params: ['username', 'obj_name']
      }, {
        check: function(timeline, event) {
          return event.obj === 'userstory' && event.type === 'change' && timeline.hasIn(['data', 'value_diff']) && timeline.getIn(['data', 'value_diff', 'key']) === 'points';
        },
        key: 'TIMELINE.US_UPDATED_POINTS',
        translate_params: ['username', 'field_name', 'obj_name', 'new_value', 'role_name']
      }, {
        check: function(timeline, event) {
          return event.obj === 'userstory' && event.type === 'change' && timeline.hasIn(['data', 'value_diff']) && timeline.getIn(['data', 'value_diff', 'key']) === 'description_diff';
        },
        key: 'TIMELINE.US_UPDATED',
        translate_params: ['username', 'field_name', 'obj_name']
      }, {
        check: function(timeline, event) {
          return event.obj === 'userstory' && event.type === 'change';
        },
        key: 'TIMELINE.US_UPDATED_WITH_NEW_VALUE',
        translate_params: ['username', 'field_name', 'obj_name', 'new_value']
      }, {
        check: function(timeline, event) {
          return event.obj === 'issue' && event.type === 'change' && timeline.hasIn(['data', 'value_diff']) && timeline.getIn(['data', 'value_diff', 'key']) === 'description_diff';
        },
        key: 'TIMELINE.ISSUE_UPDATED',
        translate_params: ['username', 'field_name', 'obj_name']
      }, {
        check: function(timeline, event) {
          return event.obj === 'issue' && event.type === 'change';
        },
        key: 'TIMELINE.ISSUE_UPDATED_WITH_NEW_VALUE',
        translate_params: ['username', 'field_name', 'obj_name', 'new_value']
      }, {
        check: function(timeline, event) {
          return event.obj === 'task' && event.type === 'change' && !timeline.getIn('data', 'task', 'userstory') && timeline.hasIn(['data', 'value_diff']) && timeline.getIn(['data', 'value_diff', 'key']) === 'description_diff';
        },
        key: 'TIMELINE.TASK_UPDATED',
        translate_params: ['username', 'field_name', 'obj_name']
      }, {
        check: function(timeline, event) {
          return event.obj === 'task' && event.type === 'change' && timeline.getIn('data', 'task', 'userstory') && timeline.hasIn(['data', 'value_diff']) && timeline.getIn(['data', 'value_diff', 'key']) === 'description_diff';
        },
        key: 'TIMELINE.TASK_UPDATED_WITH_US',
        translate_params: ['username', 'field_name', 'obj_name', 'us_name']
      }, {
        check: function(timeline, event) {
          return event.obj === 'task' && event.type === 'change' && !timeline.getIn(['data', 'task', 'userstory']);
        },
        key: 'TIMELINE.TASK_UPDATED_WITH_NEW_VALUE',
        translate_params: ['username', 'field_name', 'obj_name', 'new_value']
      }, {
        check: function(timeline, event) {
          return event.obj === 'task' && event.type === 'change' && timeline.getIn(['data', 'task', 'userstory']);
        },
        key: 'TIMELINE.TASK_UPDATED_WITH_US_NEW_VALUE',
        translate_params: ['username', 'field_name', 'obj_name', 'us_name', 'new_value']
      }, {
        check: function(timeline, event) {
          return event.obj === 'user' && event.type === 'create';
        },
        key: 'TIMELINE.NEW_USER',
        translate_params: ['username']
      }
    ];
    return _.find(types, function(obj) {
      return obj.check(timeline, event);
    });
  };

  UserTimelineType = (function() {
    function UserTimelineType() {}

    UserTimelineType.prototype.getType = function(timeline, event) {
      return timelineType(timeline, event);
    };

    return UserTimelineType;

  })();

  angular.module("taigaUserTimeline").service("tgUserTimelineItemType", UserTimelineType);

}).call(this);

(function() {
  var UserTimelineItemController;

  UserTimelineItemController = (function() {
    UserTimelineItemController.$inject = ["tgUserTimelineItemType", "tgUserTimelineItemTitle"];

    function UserTimelineItemController(userTimelineItemType, userTimelineItemTitle) {
      var event, title, type;
      this.userTimelineItemType = userTimelineItemType;
      this.userTimelineItemTitle = userTimelineItemTitle;
      event = this.parseEventType(this.timeline.get('event_type'));
      type = this.userTimelineItemType.getType(this.timeline, event);
      title = this.userTimelineItemTitle.getTitle(this.timeline, event, type);
      this.timeline = this.timeline.set('title_html', title);
      this.timeline = this.timeline.set('obj', this.getObject(this.timeline, event));
      if (type.description) {
        this.timeline = this.timeline.set('description', type.description(this.timeline));
      }
      if (type.member) {
        this.timeline = this.timeline.set('member', type.member(this.timeline));
      }
      if (this.timeline.hasIn(['data', 'value_diff', 'attachments', 'new'])) {
        this.timeline = this.timeline.set('attachments', this.timeline.getIn(['data', 'value_diff', 'attachments', 'new']));
      }
    }

    UserTimelineItemController.prototype.getObject = function(timeline, event) {
      if (timeline.get('data').get(event.obj)) {
        return timeline.get('data').get(event.obj);
      }
    };

    UserTimelineItemController.prototype.parseEventType = function(event_type) {
      event_type = event_type.split(".");
      return {
        section: event_type[0],
        obj: event_type[1],
        type: event_type[2]
      };
    };

    return UserTimelineItemController;

  })();

  angular.module("taigaUserTimeline").controller("UserTimelineItem", UserTimelineItemController);

}).call(this);

(function() {
  var UserTimelineItemDirective;

  UserTimelineItemDirective = function() {
    return {
      controllerAs: "vm",
      controller: "UserTimelineItem",
      bindToController: true,
      templateUrl: "user-timeline/user-timeline-item/user-timeline-item.html",
      scope: {
        timeline: "=tgUserTimelineItem"
      }
    };
  };

  angular.module("taigaUserTimeline").directive("tgUserTimelineItem", UserTimelineItemDirective);

}).call(this);

(function() {
  var UserTimelinePaginationSequence;

  UserTimelinePaginationSequence = function() {
    var obj;
    obj = {};
    obj.generate = function(config) {
      var getContent, items, next, page;
      page = 1;
      items = Immutable.List();
      config.minItems = config.minItems || 20;
      next = function() {
        items = Immutable.List();
        return getContent();
      };
      getContent = function() {
        return config.fetch(page).then(function(response) {
          var data;
          page++;
          data = response.get("data");
          if (config.filter) {
            data = config.filter(response.get("data"));
          }
          items = items.concat(data);
          if (items.size < config.minItems && response.get("next")) {
            return getContent();
          }
          return Immutable.Map({
            items: items,
            next: response.get("next")
          });
        });
      };
      return {
        next: function() {
          return next();
        }
      };
    };
    return obj;
  };

  angular.module("taigaUserTimeline").factory("tgUserTimelinePaginationSequenceService", UserTimelinePaginationSequence);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: modules/profile/profile-timeline/profile-timeline.controller.coffee
 */

(function() {
  var UserTimelineController, mixOf, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  UserTimelineController = (function(superClass) {
    extend(UserTimelineController, superClass);

    UserTimelineController.$inject = ["tgUserTimelineService"];

    function UserTimelineController(userTimelineService) {
      this.userTimelineService = userTimelineService;
      this.timelineList = Immutable.List();
      this.scrollDisabled = false;
      this.timeline = null;
      if (this.projectId) {
        this.timeline = this.userTimelineService.getProjectTimeline(this.projectId);
      } else if (this.currentUser) {
        this.timeline = this.userTimelineService.getProfileTimeline(this.user.get("id"));
      } else {
        this.timeline = this.userTimelineService.getUserTimeline(this.user.get("id"));
      }
    }

    UserTimelineController.prototype.loadTimeline = function() {
      this.scrollDisabled = true;
      return this.timeline.next().then((function(_this) {
        return function(response) {
          _this.timelineList = _this.timelineList.concat(response.get("items"));
          if (response.get("next")) {
            _this.scrollDisabled = false;
          }
          return _this.timelineList;
        };
      })(this));
    };

    return UserTimelineController;

  })(mixOf(taiga.Controller, taiga.PageMixin, taiga.FiltersMixin));

  angular.module("taigaUserTimeline").controller("UserTimeline", UserTimelineController);

}).call(this);

(function() {
  var UserTimelineDirective;

  UserTimelineDirective = function() {
    return {
      templateUrl: "user-timeline/user-timeline/user-timeline.html",
      controller: "UserTimeline",
      controllerAs: "vm",
      scope: {
        projectId: "=projectid",
        user: "=",
        currentUser: "="
      },
      bindToController: true
    };
  };

  angular.module("taigaProfile").directive("tgUserTimeline", UserTimelineDirective);

}).call(this);

(function() {
  var UserTimelineService, taiga,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  taiga = this.taiga;

  UserTimelineService = (function(superClass) {
    extend(UserTimelineService, superClass);

    UserTimelineService.$inject = ["tgResources", "tgUserTimelinePaginationSequenceService"];

    function UserTimelineService(rs, userTimelinePaginationSequenceService) {
      this.rs = rs;
      this.userTimelinePaginationSequenceService = userTimelinePaginationSequenceService;
    }

    UserTimelineService.prototype._valid_fields = ['status', 'subject', 'description_diff', 'assigned_to', 'points', 'severity', 'priority', 'type', 'attachments', 'milestone', 'is_iocaine', 'content_diff', 'name', 'estimated_finish', 'estimated_start', 'blocked'];

    UserTimelineService.prototype._invalid = [
      {
        check: function(timeline) {
          var fieldKey, value_diff;
          value_diff = timeline.get("data").get("value_diff");
          if (value_diff) {
            fieldKey = value_diff.get('key');
            if (this._valid_fields.indexOf(fieldKey) === -1) {
              return true;
            } else if (fieldKey === 'attachments' && value_diff.get('value').get('new').size === 0) {
              return true;
            }
          }
          return false;
        }
      }, {
        check: function(timeline) {
          var event;
          event = timeline.get('event_type').split(".");
          return event[2] === 'delete';
        }
      }, {
        check: function(timeline) {
          var event;
          event = timeline.get('event_type').split(".");
          return event[1] === 'project' && event[2] === 'change';
        }
      }, {
        check: function(timeline) {
          return !!timeline.get("data").get("comment_deleted");
        }
      }, {
        check: function(timeline) {
          var event, value_diff;
          event = timeline.get('event_type').split(".");
          value_diff = timeline.get("data").get("value_diff");
          if (value_diff && event[1] === "task" && event[2] === "change" && value_diff.get("key") === "milestone") {
            return timeline.get("data").get("value_diff").get("value");
          }
          return false;
        }
      }
    ];

    UserTimelineService.prototype._isInValidTimeline = function(timeline) {
      return _.some(this._invalid, (function(_this) {
        return function(invalid) {
          return invalid.check.call(_this, timeline);
        };
      })(this));
    };

    UserTimelineService.prototype._splitChanges = function(response) {
      var newdata;
      newdata = Immutable.List();
      response.get('data').forEach(function(item) {
        var data, newItem, values_diff;
        data = item.get('data');
        values_diff = data.get('values_diff');
        if (values_diff && values_diff.count()) {
          if (values_diff.has('is_blocked')) {
            values_diff = Immutable.Map({
              'blocked': values_diff
            });
          }
          return values_diff.forEach(function(value, key) {
            var newItem, obj;
            obj = Immutable.Map({
              key: key,
              value: value
            });
            newItem = item.setIn(['data', 'value_diff'], obj);
            newItem = newItem.deleteIn(['data', 'values_diff']);
            return newdata = newdata.push(newItem);
          });
        } else {
          newItem = item.deleteIn(['data', 'values_diff']);
          return newdata = newdata.push(newItem);
        }
      });
      return response.set('data', newdata);
    };

    UserTimelineService.prototype.getProfileTimeline = function(userId) {
      var config;
      config = {};
      config.fetch = (function(_this) {
        return function(page) {
          return _this.rs.users.getProfileTimeline(userId, page).then(function(response) {
            return _this._splitChanges(response);
          });
        };
      })(this);
      config.filter = (function(_this) {
        return function(items) {
          return items.filterNot(function(item) {
            return _this._isInValidTimeline(item);
          });
        };
      })(this);
      return this.userTimelinePaginationSequenceService.generate(config);
    };

    UserTimelineService.prototype.getUserTimeline = function(userId) {
      var config;
      config = {};
      config.fetch = (function(_this) {
        return function(page) {
          return _this.rs.users.getUserTimeline(userId, page).then(function(response) {
            return _this._splitChanges(response);
          });
        };
      })(this);
      config.filter = (function(_this) {
        return function(items) {
          return items.filterNot(function(item) {
            return _this._isInValidTimeline(item);
          });
        };
      })(this);
      return this.userTimelinePaginationSequenceService.generate(config);
    };

    UserTimelineService.prototype.getProjectTimeline = function(projectId) {
      var config;
      config = {};
      config.fetch = (function(_this) {
        return function(page) {
          return _this.rs.projects.getTimeline(projectId, page).then(function(response) {
            return _this._splitChanges(response);
          });
        };
      })(this);
      config.filter = (function(_this) {
        return function(items) {
          return items.filterNot(function(item) {
            return _this._isInValidTimeline(item);
          });
        };
      })(this);
      return this.userTimelinePaginationSequenceService.generate(config);
    };

    return UserTimelineService;

  })(taiga.Service);

  angular.module("taigaUserTimeline").service("tgUserTimelineService", UserTimelineService);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: pluggins/main.coffee
 */

(function() {
  var module;

  module = angular.module("taigaPlugins", ["ngRoute"]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: plugins/humanshtml/humanshtml.coffee
 */

(function() {
  var configure, module, taiga;

  taiga = this.taiga;

  module = angular.module("taigaPlugins");

  configure = function($routeProvider) {
    return $routeProvider.when("/humans.html", {
      "templateUrl": "/plugins/humanshtml/templates/humans.html"
    });
  };

  module.config(["$routeProvider", configure]);

}).call(this);


/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
#
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
#
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
#
 * File: plugins/terms/terms.coffee
 */

(function() {
  var TermsNoticeDirective, module, taiga, template;

  taiga = this.taiga;

  module = angular.module("taigaPlugins");

  template = _.template("<p class=\"register-text\">\n    <span>By clicking \"Sign up\", you agree to our <br /></span>\n    <a href=\"<%= termsUrl %>\" title=\"See terms of service\" target=\"_blank\"> terms of service</a>\n    <span> and</span>\n    <a href=\"<%= privacyUrl %>\" title=\"See privacy policy\" target=\"_blank\"> privacy policy.</a>\n</p>");

  TermsNoticeDirective = function($config) {
    var privacyPolicyUrl, templateFn, termsOfServiceUrl;
    privacyPolicyUrl = $config.get("privacyPolicyUrl");
    termsOfServiceUrl = $config.get("termsOfServiceUrl");
    templateFn = function() {
      var ctx;
      if (!(privacyPolicyUrl && termsOfServiceUrl)) {
        return "";
      }
      ctx = {
        termsUrl: termsOfServiceUrl,
        privacyUrl: privacyPolicyUrl
      };
      return template(ctx);
    };
    return {
      scope: {},
      restrict: "AE",
      template: templateFn
    };
  };

  module.directive("tgTermsNotice", ["$tgConfig", TermsNoticeDirective]);

}).call(this);

(function() {
  var messages;

  messages = {
    defaultMessage: "تنسيق الحقل غير صحيح",
    type: {
      email: "اكتب البريد الإلكتروني بالطريقة المطلوبة",
      url: "اكتب الرابط بالطريقة المطلوبة",
      urlstrict: "اكتب الرابط بالطريقة المطلوبة",
      number: "اكتب أرقام ففط (عدد صحيح)",
      digits: "اكتب أرقاما فقط",
      dateIso: "اكتب التاريخ بهذه الصيغة (YYYY-MM-DD).",
      alphanum: "اكتب حروف وأرقام فقط",
      phone: "اكتب رقم هاتف بالطريقة المطلوبة"
    },
    notnull: "هذا الحقل مطلوب",
    notblank: "هذا الحقل مطلوب",
    required: "هذا الحقل مطلوب",
    regexp: "تنسيق الحقل غير صحيح",
    min: "الرقم يجب أن يكون أكبر من أو يساوي : %s.",
    max: "الرقم يجب أن يكون أصغر من أو يساوي : %s.",
    range: "الرقم يجب أن يكون بين %s و %s.",
    minlength: "الحقل قصير. يجب أن يحتوي على %s حرف/أحرف أو أكثر",
    maxlength: "الحقل طويل. يجب أن يحتوي على %s حرف/أحرف أو أقل",
    rangelength: "طول الحقل غير مقبول. يجب أن يكون بين %s و %s حرف/أحرف",
    mincheck: "يجب أن تختار %s (اختيار) على الأقل",
    maxcheck: "يجب أن تختار %s (اختبار) أو أقل",
    rangecheck: "يجب أن تختار بين %s و %s (اختبار).",
    equalto: "يجب أن يتساوى الحقلان",
    minwords: "يجب أن يحتوي الحقل على %s كلمة/كلمات على الأقل",
    maxwords: "يجب أن يحتوي الحقل على %s كلمة/كلمات كحد أعلى",
    rangewords: "عدد الكلمات المسوح بها مابين %s و %s كلمة/كلمات.",
    greaterthan: "يجب أن تكون القيمة أكبر من %s.",
    lessthan: "يجب أن تكون القيمة أقل من %s.",
    beforedate: "التاريخ يجب أن يكون قبل  %s.",
    afterdate: "التاريخ يجب أن يكون بعد  %s.",
    americandate: "اكتب التاريخ بالطريقة المطلوبة (MM/DD/YYYY)."
  };

}).call(this);

(function() {
  var messages;

  messages = {
    defaultMessage: "Aquest valor sembla ser invàlid.",
    type: {
      email: "Aquest valor ha de ser una adreça de correu electrònic vàlida.",
      url: "Aquest valor ha de ser una URL vàlida.",
      urlstrict: "Aquest valor ha de ser una URL vàlida.",
      number: "Aquest valor ha de ser un nombre vàlid.",
      digits: "Aquest valor ha només pot contenir dígits.",
      dateIso: "Aquest valor ha de ser una data vàlida (YYYY-MM-DD).",
      alphanum: "Aquest valor ha de ser alfanumèric."
    },
    notnull: "Aquest valor no pot ser nul.",
    notblank: "Aquest valor no pot ser buit.",
    required: "Aquest valor és requerit.",
    regexp: "Aquest valor és incorrecte.",
    min: "Aquest valor no pot ser menor que %s.",
    max: "Aquest valor no pot ser major que %s.",
    range: "Aquest valor ha d'estar entre %s i %s.",
    minlength: "Aquest valor és massa curt. La longitud mínima és de %s caràcters.",
    maxlength: "Aquest valor és massa llarg. La longitud màxima és de %s caràcters.",
    rangelength: "La longitud d'aquest valor ha de ser d'entre %s i %s caràcters.",
    equalto: "Aquest valor ha de ser idèntic.",
    mincheck: "Has de marcar un mínim de %s opcions.",
    maxcheck: "Has de marcar un màxim de %s opcions.",
    rangecheck: "Has de marcar entre %s i %s opcions.",
    minwords: "Aquest valor ha de tenir %s paraules com a mínim.",
    maxwords: "Aquest valor no pot superar les %s paraules.",
    rangewords: "Aquest valor ha de tenir entre %s i %s paraules.",
    greaterthan: "Aquest valor no pot ser major que %s.",
    lessthan: "Aquest valor no pot ser menor que %s."
  };

  this.checksley.updateMessages("ca", messages);

}).call(this);

(function() {
  var messages;

  messages = {
    defaultMessage: "Tato položka je neplatná.",
    type: {
      email: "Tato položka musí být e-mailová adresa.",
      url: "Tato položka musí být url adresa.",
      urlstrict: "Tato položka musí být url adresa.",
      number: "Tato položka musí být platné číslo.",
      digits: "Tato položka musí být číslice.",
      dateIso: "Tato položka musí být datum ve formátu YYYY-MM-DD.",
      alphanum: "Tato položka musí být alfanumerická."
    },
    notnull: "Tato položka nesmí být null.",
    notblank: "Tato položka nesmí být prázdná.",
    required: "Tato položka je povinná.",
    regexp: "Tato položka je neplatná.",
    min: "Tato položka musí být větší než %s.",
    max: "Tato položka musí byt menší než %s.",
    range: "Tato položka musí být v rozmezí %s a %s.",
    minlength: "Tato položka je příliš krátká. Musí mít %s nebo více znaků.",
    maxlength: "Tato položka je příliš dlouhá. Musí mít %s nebo méně znaků.",
    rangelength: "Tato položka je mimo rozsah. Musí být rozmezí %s a %s znaků.",
    equalto: "Tato položka by měla být stejná.",
    minwords: "Tato položka musí obsahovat alespoň %s slov.",
    maxwords: "Tato položka nesmí přesánout %s slov.",
    rangewords: "Tato položka musí obsahovat %s až %s slov.",
    greaterthan: "Tato položka musí být větší než %s.",
    lessthan: "Tato položka musí být menší než %s."
  };

  this.checksley.updateMessages("cs", messages);

}).call(this);

(function() {
  var messages;

  messages = {
    defaultMessage: "Die Eingabe scheint nicht korrekt zu sein.",
    type: {
      email: "Die Eingabe muss eine gültige E-Mail-Adresse sein.",
      url: "Die Eingabe muss eine gültige URL sein.",
      urlstrict: "Die Eingabe muss eine gültige URL sein.",
      number: "Die Eingabe muss eine Zahl sein.",
      digits: "Die Eingabe darf nur Ziffern enthalten.",
      dateIso: "Die Eingabe muss ein gültiges Datum im Format YYYY-MM-DD sein.",
      alphanum: "Die Eingabe muss alphanumerisch sein.",
      phone: "Die Eingabe muss eine gültige Telefonnummer sein."
    },
    notnull: "Die Eingabe darf nicht leer sein.",
    notblank: "Die Eingabe darf nicht leer sein.",
    required: "Dies ist ein Pflichtfeld.",
    regexp: "Die Eingabe scheint ungültig zu sein.",
    min: "Die Eingabe muss größer oder gleich %s sein.",
    max: "Die Eingabe muss kleiner oder gleich %s sein.",
    range: "Die Eingabe muss zwischen %s und %s liegen.",
    minlength: "Die Eingabe ist zu kurz. Es müssen mindestens %s Zeichen eingegeben werden.",
    maxlength: "Die Eingabe ist zu lang. Es dürfen höchstens %s Zeichen eingegeben werden.",
    rangelength: "Die Länge der Eingabe ist ungültig. Es müssen zwischen %s und %s Zeichen eingegeben werden.",
    equalto: "Dieses Feld muss dem anderen entsprechen.",
    minwords: "Die Eingabe muss mindestens %s Wörter enthalten.",
    maxwords: "Die Eingabe darf höchstens %s Wörter enthalten.",
    rangewords: "Die Eingabe muss zwischen %s und %s Wörter enthalten.",
    greaterthan: "Die Eingabe muss größer als %s sein.",
    lessthan: "Die Eingabe muss kleiner als %s sein."
  };

  this.checksley.updateMessages("de", messages);

}).call(this);

(function() {
  var messages;

  messages = {
    defaultMessage: "Este valor parece ser inválido.",
    type: {
      email: "Este valor debe ser un correo válido.",
      url: "Este valor debe ser una URL válida.",
      urlstrict: "Este valor debe ser una URL válida.",
      number: "Este valor debe ser un número válido.",
      digits: "Este valor debe ser un dígito válido.",
      dateIso: "Este valor debe ser una fecha válida (YYYY-MM-DD).",
      alphanum: "Este valor debe ser alfanumérico."
    },
    notnull: "Este valor no debe ser nulo.",
    notblank: "Este valor no debe estar en blanco.",
    required: "Este valor es requerido.",
    regexp: "Este valor es incorrecto.",
    min: "Este valor no debe ser menor que %s.",
    max: "Este valor no debe ser mayor que %s.",
    range: "Este valor debe estar entre %s y %s.",
    minlength: "Este valor es muy corto. La longitud mínima es de %s caracteres.",
    maxlength: "Este valor es muy largo. La longitud máxima es de %s caracteres.",
    rangelength: "La longitud de este valor debe estar entre %s y %s caracteres.",
    equalto: "Este valor debe ser idéntico.",
    minwords: "Este valor debe tener al menos %s palabras.",
    maxwords: "Este valor no debe exceder las %s palabras.",
    rangewords: "Este valor debe tener entre %s y %s palabras.",
    greaterthan: "Este valor no debe ser mayor que %s.",
    lessthan: "Este valor no debe ser menor que %s."
  };

  this.checksley.updateMessages("es", messages);

}).call(this);

(function() {
  var messages;

  messages = {
    defaultMessage: "Cette valeur semble non valide.",
    type: {
      email: "Cette valeur n'est pas une adresse email valide.",
      url: "Cette valeur n'est pas une URL valide.",
      urlstrict: "Cette valeur n'est pas une URL valide.",
      number: "Cette valeur doit être un nombre.",
      digits: "Cette valeur doit être numérique.",
      dateIso: "Cette valeur n'est pas une date valide (YYYY-MM-DD).",
      alphanum: "Cette valeur doit être alphanumérique."
    },
    notnull: "Cette valeur ne peut pas être nulle.",
    notblank: "Cette valeur ne peut pas être vide.",
    required: "Ce champ est requis.",
    regexp: "Cette valeur semble non valide.",
    min: "Cette valeur ne doit pas être inféreure à %s.",
    max: "Cette valeur ne doit pas excéder %s.",
    range: "Cette valeur doit être comprise entre %s et %s.",
    minlength: "Cette chaîne est trop courte. Elle doit avoir au minimum %s caractères.",
    maxlength: "Cette chaîne est trop longue. Elle doit avoir au maximum %s caractères.",
    rangelength: "Cette valeur doit contenir entre %s et %s caractères.",
    equalto: "Cette valeur devrait être identique.",
    mincheck: "Vous devez sélectionner au moins %s choix.",
    maxcheck: "Vous devez sélectionner %s choix maximum.",
    rangecheck: "Vous devez sélectionner entre %s et %s choix.",
    minwords: "Cette valeur doit contenir plus de %s mots.",
    maxwords: "Cette valeur ne peut pas dépasser %s mots.",
    rangewords: "Cette valeur doit comprendre %s à %s mots.",
    greaterthan: "Cette valeur doit être plus grande que %s.",
    lessthan: "Cette valeur doit être plus petite que %s."
  };

  this.checksley.updateMessages("fr", messages);

}).call(this);

(function() {
  var messages;

  messages = {
    defaultMessage: "Questo valore sembra essere non valido.",
    type: {
      email: "Questo valore deve essere un indirizzo email valido.",
      url: "Questo valore deve essere un URL valido.",
      urlstrict: "Questo valore deve essere un URL valido.",
      number: "Questo valore deve essere un numero valido.",
      digits: "Questo valore deve essere di tipo numerico.",
      dateIso: "Questo valore deve essere una data valida (YYYY-MM-DD).",
      alphanum: "Questo valore deve essere di tipo alfanumerico."
    },
    notnull: "Questo valore non deve essere nullo.",
    notblank: "Questo valore non deve essere vuoto.",
    required: "Questo valore è richiesto.",
    regexp: "Questo valore non è corretto.",
    min: "Questo valore deve essere maggiore di %s.",
    max: "Questo valore deve essere minore di %s.",
    range: "Questo valore deve essere compreso tra %s e %s.",
    minlength: "Questo valore è troppo corto. La lunghezza minima è di %s caratteri.",
    maxlength: "Questo valore è troppo lungo. La lunghezza massima è di %s caratteri.",
    rangelength: "La lunghezza di questo valore deve essere compresa fra %s e %s caratteri.",
    equalto: "Questo valore deve essere identico.",
    minwords: "Questo valore deve contenere almeno %s parole.",
    maxwords: "Questo valore non deve superare le %s parole.",
    rangewords: "Questo valore deve contenere tra %s e %s parole.",
    greaterthan: "Questo valore deve essere maggiore di %s.",
    lessthan: "Questo valore deve essere minore di %s.",
    beforedate: "Questa data deve essere anteriore al %s.",
    afterdate: "Questa data deve essere posteriore al %s.",
    luhn: "Questo valore deve superare il test di Luhn."
  };

  this.checksley.updateMessages("it", messages);

}).call(this);

(function() {
  var messages;

  messages = {
    defaultMessage: "Deze waarde lijkt onjuist.",
    type: {
      email: "Dit lijkt geen geldig e-mail adres te zijn.",
      url: "Dit lijkt geen geldige URL te zijn.",
      urlstrict: "Dit is geen geldige URL.",
      number: "Deze waarde moet een nummer zijn.",
      digits: "Deze waarde moet numeriek zijn.",
      dateIso: "Deze waarde moet een datum in het volgende formaat zijn: (YYYY-MM-DD).",
      alphanum: "Deze waarde moet alfanumeriek zijn.",
      phone: "Deze waarde moet een geldig telefoonnummer zijn."
    },
    notnull: "Deze waarde mag niet leeg zijn.",
    notblank: "Deze waarde mag niet leeg zijn.",
    required: "Dit veld is verplicht",
    regexp: "Deze waarde lijkt onjuist te zijn.",
    min: "Deze waarde mag niet lager zijn dan %s.",
    max: "Deze waarde mag niet groter zijn dan %s.",
    range: "Deze waarde moet tussen %s en %s liggen.",
    minlength: "Deze tekst is te kort. Deze moet uit minimaal %s karakters bestaan.",
    maxlength: "Deze waarde is te lang. Deze mag maximaal %s karakters lang zijn.",
    mincheck: "Je moet minstens %s opties selecteren.",
    maxcheck: "Je moet %s of minder opties selecteren.",
    rangecheck: "Je moet tussen de %s en %s opties selecteren.",
    rangelength: "Deze waarde moet tussen %s en %s karakters lang zijn.",
    equalto: "Deze waardes moeten identiek zijn.",
    minwords: "Deze waarde moet minstens %s woorden bevatten.",
    maxwords: "Deze waarde mag maximaal %s woorden bevatten.",
    rangewords: "Deze waarde moet tussen de %s en %s woorden bevatten.",
    greaterthan: "Deze waarde moet groter dan %s zijn.",
    lessthan: "Deze waarde moet kleiner dan %s zijn.",
    beforedate: "Deze datum moet voor %s liggne.",
    afterdate: "Deze datum moet na %s liggen.",
    americandate: "Dit moet een geldige datum zijn (MM/DD/YYYY)."
  };

  this.checksley.updateMessages("nl", messages);

}).call(this);

(function() {
  var messages;

  messages = {
    defaultMessage: "Поле заполнено некорректно.",
    type: {
      email: "Поле должно быть адресом электронной почты.",
      url: "Поле должно быть ссылкой на сайт.",
      urlstrict: "Поле должно быть ссылкой на сайт.",
      number: "Поле должно быть числом.",
      digits: "Поле должно содержать только цифры.",
      dateIso: "Поле должно быть датой в формате (ГГГГ-ММ-ДД).",
      alphanum: "Поле должно содержать только цифры и буквы",
      phone: "Поле должно содержать корректный номер телефона"
    },
    notnull: "Поле должно быть не нулевым.",
    notblank: "Поле не должно быть пустым.",
    required: "Поле обязательно для заполнения.",
    regexp: "Поле заполнено некорректно.",
    min: "Значение поля должно быть больше %s.",
    max: "Значение поля должно быть меньше %s.",
    range: "Значение поля должно быть между %s и %s.",
    minlength: "В поле должно быть минимум %s символов(а).",
    maxlength: "В поле должно быть не больше %s символов(а).",
    rangelength: "В поле должно быть от %s до %s символов(а).",
    mincheck: "Необходимо выбрать не менее %s пунктов(а).",
    maxcheck: "Необходимо выбрать не более %s пунктов(а).",
    rangecheck: "Необходимо выбрать от %s до %s пунктов.",
    equalto: "Значения полей должны быть одинаковыми.",
    minwords: "В поле должно быть не менее %s слов.",
    maxwords: "В поле должно быть не более %s слов.",
    rangewords: "Количество слов в поле должно быть в диапазоне от %s до %s.",
    greaterthan: "Значение в поле должно быть более %s.",
    lessthan: "Значение в поле должно быть менее %s.",
    beforedate: "Дата должна быть до %s.",
    afterdate: "Дата должна быть после %s.",
    americandate: "В поле должна быть корректная дата в формате MM/DD/YYYY."
  };

  this.checksley.updateMessages("ru", messages);

}).call(this);

(function() {
  var messages;

  messages = {
    defaultMessage: "不正确的值",
    type: {
      email: "字段值应该是一个正确的电子邮件地址",
      url: "字段值应该是一个正确的URL地址",
      urlstrict: "字段值应该是一个正确的URL地址",
      number: "字段值应该是一个合法的数字",
      digits: "字段值应该是一个单独的数字",
      dateIso: "字段值应该是一个正确的日期描述(YYYY-MM-DD).",
      alphanum: "字段值应该是只包含字母和数字"
    },
    notnull: "字段值不可为null",
    notblank: "字段值不可为空",
    required: "字段值是必填的",
    regexp: "字段值不合法",
    min: "字段值应该大于 %s",
    max: "字段值应该小于 %s.",
    range: "字段值应该大于 %s 并小于 %s.",
    minlength: "字段值太短了，长度应该大于等于 %s 个字符",
    maxlength: "字段值太长了，长度应该小于等于 %s 个字符",
    rangelength: "字段值长度错了，长度应该在 %s 和 %s 个字符之间",
    mincheck: "你至少要选择 %s 个选项",
    maxcheck: "你最多只能选择 %s 个选项",
    rangecheck: "你只能选择 %s 到 %s 个选项",
    equalto: "字段值应该和给定的值一样",
    minwords: "字段值应该至少有 %s 个词",
    maxwords: "字段值最多只能有 %s 个词",
    rangewords: "字段值应该有 %s 到 %s 个词",
    greaterthan: "字段值应该大于 %s",
    lessthan: "字段值应该小于 %s",
    beforedate: "字段值所表示的日期应该早于 %s.",
    afterdate: "字段值所表示的日期应该晚于 %s."
  };

  this.checksley.updateMessages("zh-cn", messages);

}).call(this);

//# sourceMappingURL=maps/app.js.map