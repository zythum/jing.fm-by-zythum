(function() {
  window.App = window.angular.module('App', []);

  require('./sev_gui');

  require('./sev_log');

  require('./sev_events');

  require('./sev_jing');

  require('./sev_audio');

  require('./sev_queue');

  require('./sev_pldHelper');

  require('./sev_store');

  require('./ctrl_app');

  require('./ctrl_login');

  require('./ctrl_player');

  require('./ctrl_search');

  require('./ctrl_star');

  require('./ctrl_top');

  require('./ctrl_setting');

}).call(this);
