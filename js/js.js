// edit by Mandy@2015
// mail:mtwmt@hotmail.com
// 201609 更新 資料改用josn讀取

$(window).load(function(){
    getPage();
    
});

var pageAct = function(){

     if( $('.sidebar').length > 0 ){
        var drift = $('.sidebar').offset().top;
    }

    var $sidebar = $('.sidebar'),
        $cont = $('.timeline').find('.md_graphic'),
        $md_item = $(".md_item") || {},
        $win = $(window),
        len = $cont.length;

    $sidebar.before('<div class="fixedAdd"></div>');
    var $fixedAdd = $('.fixedAdd');
    $fixedAdd.height($sidebar.height()+20).css({"display":"none"});

    $sidebar.find('li').css({'cursor':'pointer'}).on('click',function(){
        var $this = $(this),
            idx = $this.index();
        $('html,body').stop().animate({           
            scrollTop : idx > 0 ? $cont.eq(idx).offset().top - 50 : 0
        });
    });

    $win.on('scroll',function(){
        var $this = $(this),
            st = $win.scrollTop(),
            ww = $win.width(),
            wh = $win.height(),
            total_h = $('#main').offset().top + $('#main').height() - wh;
            idx = 0;

        $cont.each(function(index, el) {
            if(st > $cont.eq(index).offset().top + $cont.eq(index).outerHeight(true) / 2 - wh ){
                idx = index;
            }
        });

        if( $this.scrollTop()> drift){
            $sidebar.addClass('fixed');
            $fixedAdd.css({"display":"block"});

        }else{
            $sidebar.removeClass('fixed');
            $fixedAdd.css({"display":"none"});
        }

        $sidebar.find('li').eq(idx).addClass('active').siblings().removeClass('active');

        $md_item.not(".on").each(function(){
            if( $win.height() + $win.scrollTop() > $(this).offset().top ){
                $(this).addClass('on');
            }
        });

        // 讀取條
        $('.loadbar').css({ width: st / total_h*100 + '%' });

    }).scroll();



};



var getPage = function(){
    $.ajax({
        url:'json/data.json',
        method: 'get',
        dataType: 'json',
        data: {},
        success: function(data){
           // data = data || {};
           $view = $( tmp_timeline(data) );
           $year = $( tmp_year(data) );

           $('.timeline').append($view);
           $('.sidebar').append($year);

            pageAct();
        }
    });    
};


var tmp_year = function(datalist){
    var i = 0,
        templateArr = [];

    for( i; i< datalist.length; i++ ){
        templateArr.push(
            '<li>', datalist[i].year ,' 年</li>'
        );
    };
    return templateArr.join('');
};

var tmp_timeline = function(datalist){
    var i = 0,
        templateArr = [];
    for( i; i< datalist.length; i++ ){
        templateArr.push(
            '<div class="md_graphic">',
                '<div class="md_header">', datalist[i].year ,'年</div>',
                '<div class="md_content">',
                    tmp_md( datalist[i].into, datalist[i].year),

                '</div>',
            '</div>'
        );
    }
    return templateArr.join('');
};

var tmp_md = function(mdlen, year ){
    var i = 0,
        templateArr = [];

    for( i; i< mdlen.length; i++ ){
        templateArr.push(
            '<div class="md_item">',
                '<figure>',
                    '<img src="', mdlen[i].img ,'" />',
                    '<figcaption>',
                        '<p>', mdlen[i].title ,'(', year ,')</p>',
                        '<a href="', mdlen[i].link ,'" target="_blank"></a>',
                    '</figcaption>',
                    mdlen[i].description,
                '</figure>',
            '</div>'
        );   
    }
    return templateArr.join('');
};



var flicker = {
  /*unicode : "!\"#$%'()*+,-./0123456789:;?@`aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ{[|\}]~^_",*/
  unicode : "!$0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ",
  getRandomInt : function(min, max) {
    // console.log(min+" "+max);
    // console.log('weee');
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  randomCharacter : function(){
    return this.unicode[Math.floor(Math.random()*this.unicode.length)];
  },
  replaceAt : function(text, character, index){
  return text.substr(0, index) + character + text.substr(index+character.length);
  },
  init : function(el,min,max, delay){
    
    var str = $(el).text().trim(),
        bank = [],
        done = 1,
        newStr = $(el).text().trim();
   
   
    for (var i = 0; i<str.length; i++){
         bank[i] = this.getRandomInt(min, max);
    }
       flicker.mix(el, str, newStr, done,bank, delay);
 
  },
  mix : function(el, str, newStr, done, bank, delay){
     for (var i = 0; i<str.length; i++){

          if (bank[i]!=0){
            done = 0;
            if (str[i]!=" "){
              newStr = this.replaceAt(newStr,  this.randomCharacter(), i);
            }else{
              newStr = this.replaceAt(newStr,  " ", i);
            }
            bank[i]--;
          }else{
            newStr = this.replaceAt(newStr, str[i], i);
          }
      }

      $(el).text(newStr).fadeIn(1000);
      //console.log(bank);
      if (done==0){
        setTimeout(function(){
          flicker.mix(el, str, newStr, done,bank, delay);
        }, delay);
      }
  }
};

$(function(){
    flicker.init("h1",1,15, 50);
});