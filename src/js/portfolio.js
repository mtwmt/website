(function ($) {
  const $win = $(window);
  const $body = $('html,body');
  const $main = $('main');
  const windowHeight = $win.height();
  const headerHeight = $('header').outerHeight(true);
  const $navigation = $('.navigation');
  $gotop;
  let $timelineItem;
  let $nav;

  $main.css({ paddingTop: headerHeight });

  const fetchData = () => {
    $.ajax({
      url: 'data.json',
      method: 'get',
      dataType: 'json',
      data: {},
      success: function (data) {
        data = data || {};

        const $timeline = $('.timeline').append($(createTimeline(data)));
        $nav = $('.navigation').append(createTimelineYearNav(data));
        $timelineItem = $timeline.find('.timeline__item');

        winScorll();
        onYear();
      },
    });
  };

  const winScorll = () => {
    $win
      .on('scroll', function () {
        const $this = $(this);
        const scrollTop = $this.scrollTop();
        const totalHeight = $('main').offset().top + $('main').outerHeight(true) - windowHeight;
        let idx = 0;

        $timelineItem.map((i, e) => {
          if (scrollTop > $(e).offset().top - 200) {
            idx = i;
          } else if (
            scrollTop >
            $(document).height() - $win.height() - $timelineItem.eq($timelineItem.length - 1).outerHeight(true) / 2
          ) {
            idx = $timelineItem.length - 1;
          }
        });

        $nav.find('li').eq(idx).addClass('navigation__item--active').siblings().removeClass('navigation__item--active');
        $('.loadbar').css({ width: (scrollTop / totalHeight) * 100 + '%' });

        if(scrollTop >= headerHeight ){
          $gotop.css({ opacity: 1 });
        } else {
          $gotop.css({ opacity: 0 });
        }
      })
      .scroll();
  };

  const onYear = () => {
    $nav.on('click', 'li', function () {
      const $this = $(this);
      const idx = $(this).index();

      $body.stop().animate({
        scrollTop: idx === 0 ? 0 : $timelineItem.eq(idx).offset().top - (60 + headerHeight),
      });
    });
  };

  const createTimelineYearNav = (list) => {
    return (
      `<ul>` +
      list
        .map((e) => {
          return `<li class="navigation__item">${e.year}</li>`;
        })
        .join('') +
      `</ul>`
    );
  };

  const createTimeline = (list) => {
    return list
      .map((e) => {
        return `
        <div class="timeline__item">
          <p class="timeline__item-year">${e.year}</p>
          ${createTimelineItem(e.portfolio)}
        </div>
      `;
      })
      .join('');
  };

  const createTimelineItem = (item) => {
    return item
      .map((e) => {
        return `
        <div class="timeline__item-content">
          <div class="card">
            <figure>
            <img src="${e.images}" alt="${e.title}">
            </figure>
            <div class="card-summary">
              <div class="card-category">${e.device}</div>
              <h2>${e.title}</h2>
              <div class="card-description">${e.description}</div>
            </div>
            <a href="${e.link}" target="_blank"></a>
          </div>
        </div>
        `;
      })
      .join('');
  };

  const flicker = {
    unicode: '!"#$%\'()*+,-./0123456789:;?@`aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ{[|}]~^_',
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    randomCharacter: function () {
      return this.unicode[Math.floor(Math.random() * this.unicode.length)];
    },
    replaceAt: function (text, character, index) {
      return text.substr(0, index) + character + text.substr(index + character.length);
    },
    init: function (el, min, max, delay) {
      var str = $(el).text().trim(),
        bank = [],
        done = 1,
        newStr = $(el).text().trim();

      for (var i = 0; i < str.length; i++) {
        bank[i] = this.getRandomInt(min, max);
      }
      flicker.mix(el, str, newStr, done, bank, delay);
    },
    mix: function (el, str, newStr, done, bank, delay) {
      for (var i = 0; i < str.length; i++) {
        if (bank[i] != 0) {
          done = 0;
          if (str[i] != ' ') {
            newStr = this.replaceAt(newStr, this.randomCharacter(), i);
          } else {
            newStr = this.replaceAt(newStr, ' ', i);
          }
          bank[i]--;
        } else {
          newStr = this.replaceAt(newStr, str[i], i);
        }
      }

      $(el).text(newStr).fadeIn(1000);
      if (done == 0) {
        setTimeout(function () {
          flicker.mix(el, str, newStr, done, bank, delay);
        }, delay);
      }
    },
  };

  $gotop.on('click', function() {
    $body.stop().animate({
      scrollTop: 0,
    },500, 'swing' );
  })
  
  

  fetchData();
  flicker.init('h1 span', 1, 15, 50);
})(jQuery);
