let buttonFullScreen = document.querySelector('.maximize');
let buttonClose = document.querySelector('.close');

buttonFullScreen.addEventListener('click', function () {
  let body = document.querySelector('body');
  if (!document.mozFullScreen && !document.webkitFullScreen) {
    if(body.requestFullScreen) {
      body.requestFullScreen();
    } else if(body.mozRequestFullScreen) {
      body.mozRequestFullScreen();
    } else if(body.webkitRequestFullScreen) {
      body.webkitRequestFullScreen();
    }
  }
}, false);

buttonClose.addEventListener('click', function() {
  location.reload();
}, false);

function nl2br(str) {
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
}


$(function() { // = $(document).ready(function(){})
  let userInstruction; // variable temporaire

  $(document).ready(function(){
    $('.answer').first().hide();
    $('.instruction').last().hide();
    $('.answer').first().delay(1000).fadeIn();
    $('.instruction').last().delay(1050).fadeIn(100);
    $('.user-input').attr('contentEditable',true);
    $('.terminal-symbol').on('click',function(){
      $('.user-input').focus();
    });
  });

  $(document).on('keydown',function(e){ // we detect keyboard entry

    $('.user-input').focus();

    if (e.key == 'Enter' && userInstruction != '') {

      userInstruction = $('.user-input').text(); // we save the current value
      console.log(userInstruction);

      $.ajax({
        url: './srv/ajax.php',
        type: 'POST',
        data: 'instruction=' + userInstruction,
        dataType : 'html',
        success: function(answer, status) { // answer include the answer return by the script
          $('.terminal-control').remove();
          $('<span class="request">' + userInstruction + '</span>').appendTo( $('.user-request').last() );
          $('<div class="answer">' + answer + '</span>').appendTo( $('.user-request').last() );
          $('<div class="instruction"></div>').appendTo( $('.terminal-content') );
          $('<div class="user-request"></div>').appendTo( $('.instruction').last() );
          $('<span class="user">dorothAI@becode</span><span class="symbol">:~$</span>').appendTo( $('.instruction .user-request').last() );
          $('<span class="terminal-control"><div class="user-input"></div><span class="terminal-symbol">_</span></span>').appendTo( $('.instruction .user-request').last() );
        },
        error: function(result, status, error) {
          $('.terminal-control').remove();
          $('<span class="request">' + userInstruction + '</span>').appendTo( $('.user-request').last() );
          $('<div class="answer">Sorry. There is a bug during the connection with me. Please try again!</span>').appendTo( $('.user-request').last() );
          $('<div class="instruction"></div>').appendTo( $('.terminal-content') );
          $('<div class="user-request"></div>').appendTo( $('.instruction').last() );
          $('<span class="user">dorothAI@becode</span><span class="symbol">:~$</span>').appendTo( $('.instruction .user-request').last() );
          $('<span class="terminal-control"><div class="user-input"></div><span class="terminal-symbol">_</span></span>').appendTo( $('.instruction .user-request').last() );
        },
        complete : function(result, status){
          console.log('Request complete ['+ status +']');
          window.scrollTo(0,document.body.scrollHeight);
          $('.user-input').attr('contentEditable',true);
          $('.terminal-symbol').on('click',function(){
            $('.user-input').focus();
          });
        },
      });

    }
  })

});

particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 120,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 1,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 1,
        "opacity_min": 0,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 4,
        "size_min": 0.3,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 1,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 600
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": false,
        "mode": "bubble"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 250,
        "size": 0,
        "duration": 2,
        "opacity": 0,
        "speed": 3
      },
      "repulse": {
        "distance": 400,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});
