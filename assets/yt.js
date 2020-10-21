var YT_IFRAME_API = 'https://www.youtube.com/player_api';

var player;
function onYouTubePlayerAPIReady() {
  console.log('origin:', location.origin);
  player = new YT.Player('ytplayer', {        
    width: 400,
    height: 340,
    events: {
      onReady: playerReady,
      onStateChange: playerStateChange
    },
    playerVars: {
      enablejsapi: 1,
      origin: window.location.origin
    },
    videoId: 'M7lc1UVf-VE',
    host: 'https://www.youtube.com'
  });
};

var PLAYER_STATE = {};
// var readyFlag = false;
function playerReady(event) {
  
//   setTimeout(() => event.target.playVideo(), 1000);
  console.assert(player === event.target, 'not the same');

  PLAYER_STATE = Object.keys(YT.PlayerState)
    .reduce((carrier, key) => {
      let value = YT.PlayerState[key];
      carrier[value] = { state: key, value };
      return carrier;
    }, PLAYER_STATE);

  // readyFlag = true;
}

var eventsCounter = {};
function playerStateChange(event) {
  // console.log(PLAYER_STATE[event.data]);
  let state = PLAYER_STATE[event.data];
  console.log(state);
  if(typeof eventsCounter[event.data] === 'undefined') {
    eventsCounter[event.data] = { counter: 0, state, set: false }
  }
  eventsCounter[event.data].counter++;
  if(eventsCounter[YT.PlayerState.UNSTARTED] && !eventsCounter[YT.PlayerState.UNSTARTED].set && eventsCounter[YT.PlayerState.UNSTARTED].counter === 2) {
    console.log('playing...');    
    eventsCounter[YT.PlayerState.UNSTARTED].set = true;
    player.playVideo();
  }
}

$(function() {  
  let nourl = $('#no-url');
  let yt = $('#yt');
  $('#play').click(function(){
    console.log('playing...');
    player.playVideo();
  });
  let { search } = window.location;
  if(search.length === 0) {
    nourl.show();
    yt.hide();
  }
  else {
    nourl.hide();
    yt.show();
    $.getScript(YT_IFRAME_API, function(err){
      //signal success or failure here
      console.log('YT iframe api download:', err? err: 'success');
    });
  }
  // var handle = setInterval(() => {
  //   if(readyFlag && eventsCounter[YT.PlayerState.UNSTARTED] && eventsCounter[YT.PlayerState.UNSTARTED].set) {      
  //     player.playVideo();
  //     clearInterval(handle);
  //     console.log('Actually playing...');
  //     return;
  //   }
  //   console.log('tick');
  // }, 100);
});