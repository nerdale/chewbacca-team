(function () {
  function init() {
    var router = new Router([
      new Route('index', '../index.html'),
      new Route('profile', '../static/views/profile.html')
    ]);
  }
  init();
}());