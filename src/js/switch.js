(function ($) {
  const $body = $('html,body');
  const setTheme = (themeName) => {
    localStorage.setItem('theme', themeName);
    $body.removeAttr('class').addClass(themeName);
  }

  $('#switch').on('change', () => {
    if (localStorage.getItem('theme') === 'is-dark') {
      setTheme('');
    } else {
      setTheme('is-dark');
    }
  })

  if (localStorage.getItem('theme') === 'is-dark') {
    $('#switch-slider').prop('checked', true);
    setTheme('is-dark');
  } else {
    $('#switch-slider').prop('checked', false);
    setTheme('');
  }

})(jQuery);