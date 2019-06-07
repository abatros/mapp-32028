import './scooru-banner.html'

const TP = Template.scooru_banner;

TP.events({
  'click .js-sidemenu': ()=>{
    console.log('click');
    document.getElementById("mySidenav").style.width = "360px";
    return false;
  },
  'click .js-chanSelect': ()=>{
    console.log('click');
    document.getElementById("myChanSelector").style.width = "360px";
    return false;
  },

  'click .js-open-search-panel': ()=>{
    console.log('click search-panel');
    document.getElementById("search-panel").style.width = "360px";
    return false;
  },
  'click .js-close-search-panel':()=>{
    document.getElementById("search-panel").style.width = "0";
  },


  'click .js-open-notifications': ()=>{
    console.log('click');
    document.getElementById("myNotifications").style.width = "360px";
    return false;
  },
  'click .js-close-myNotifications':()=>{
    document.getElementById("myNotifications").style.width = "0";
  },
})
