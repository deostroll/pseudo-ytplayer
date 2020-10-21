var YT_IFRAME_API = 'https://www.youtube.com/player_api';

var player;
function onYouTubePlayerAPIReady() {
  player = new YT.Player('ytplayer', {        
    width: 400,
    height: 340,
    events: {
      onReady: playerReady,
      onStateChange: playerStateChange
    },
    videoId: 'M7lc1UVf-VE',
    playerVars: {
      fs: 1,      
      controls: 1,
      origin: window.location.origin
    }
  });
};

var PLAYER_STATE = {};

function playerReady(event) {
  
  setTimeout(() => event.target.playVideo(), 1000);

  PLAYER_STATE = Object.keys(YT.PlayerState)
    .reduce((carrier, key) => {
      let value = YT.PlayerState[key];
      carrier[value] = { state: key, value };
      return carrier;
    }, PLAYER_STATE);
  
  var timeoutHandle = setInterval(() => {    
    let currentState = player.getPlayerState();
    if(currentState === YT.PlayerState.UNSTARTED) {
      console.log('stopping tick');
      clearInterval(timeoutHandle);
      // player.playVideo();  
      setTimeout(() => {
        console.log('replaying...');
        $('#play').click();
      }, 1000);
    }    
    console.log('interval tick');
  }, 1000);
  console.log('ready');
}

function playerStateChange(event) {
  console.log(PLAYER_STATE[event.data]);
}

$(function() {  
  let nourl = $('#no-url');
  let yt = $('#yt');
  $('#play').click(function(){
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
});