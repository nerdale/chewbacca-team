(function () {
  function init() {
    var router = new Router([
      new Route('index', '../index.html'),
      new Route('profile', 'profile.html')
    ]);
  }
  init();
}());