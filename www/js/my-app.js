// Initialize your app
//var myApp = new Framework7();
var myApp = new Framework7({
    //init: false // prevent app from automatic initialization 
    router:true,
});

var company = "Europa Network";
var customBg = "http://www.europa-network.com/wp-content/themes/europa/inc/images/bkg-abstract-purple.jpg";
var logo = "";
var imgUrl = "http://stalker.europa-network.com/portal/misc/logos/120/";
var apiKey = "UnlOMQfQN0/bn88Uw/eNB3GeiXXRzIWffRcKPyPqghaxd0kXGyWziu8MBX1epQ4Qf/tcpvkGaVlS6/AlkYAT4g==";
var apiUrl = "http://tvapi.europa-network.com/";
var highlightBg = "#E0DEDE";
var live = true;
var version = 1;
var login = 'bye';
var apiCrmUrl ='https://test.europa-network.com/Customerapp/';
var apiCrmkey = 'Rqt8BxhuuDqQ4Kulo8WU';

var data, channels, search, serial, searchResult;

// Export selectors engine
var $$ = Dom7;

/*
$$('.form-registration').on('click', function(){
    console.log('on registration!!!!!!!!!!!!');
  var formData = myApp.formToJSON('#form-registration');
  alert(JSON.stringify(formData));
  // mainView.router.reloadPage('home.html');
});
*/






// Add views
//var view = myApp.addView('#view-1');
setParams(false);
var mainView = myApp.addView('.view-main');
checkSerial();




//We can also add callback for all pages:
myApp.onPageBeforeInit('*', function (page) {
         
    setFormRegistration();
    setFormCode();
   
    
    setParams(page);
    if(login=="hola")
    if(page.name == "tv")
    {
        myApp.showIndicator();
        $$.ajax({
            type : 'GET',//
            url : apiUrl + "?controller=users&action=login&serial="+getSerial()+"&pass=" + apiKey + "&gzip=false&json=true&version="+version,
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data: "{}",
            success : function(response)
                    {
                        if(response.success)
                        {
                            channels = response.data.channels;
                            data = response.data.channels;
                            
                            if(channels)
                            {
                                var str,epg;

                                var keys = Object.keys(channels);

                                for (var i = 0, len = keys.length; i < len; i++) 
                                {
                                    if(i==0)
                                    {
                                        str = '<div class="list-block"><ul id="channel-list">';
                                        epg = makeAccordion(channels[keys[i]].shows,channels[keys[i]].url);
                                        
                                    }

                                    str += '<li id="channel-'+i+'" onclick="changeChannel(this)" style="'+(i == 0 ? "background:" + highlightBg + ";" : "")+'"><div class="item-content"><div class="item-media"><img src="' + imgUrl + channels[keys[i]].logo + '" /></div> <div class="item-inner">' + channels[keys[i]].name + '</div></div></li>';
                                
                                    if(i == (keys.length - 1))
                                    {
                                        str += '</ul></div>';
                                    }
                                }
                                
                                var nBar = document.getElementsByClassName("navbar")[0];
                                var fBar = document.getElementsByClassName("tabbar")[0];
                                distX = fBar.offsetLeft - nBar.offsetLeft;
                                distY = fBar.offsetTop - nBar.offsetTop;
                                distance = Math.sqrt(distX*distX + distY*distY);
                                //divHeight = ((Math.floor(distance) - nBar.style.height)-fbar.style.height);
                                divHeight = Math.floor(distance) - (fBar.clientHeight+10);
                                
                                document.getElementById('channels').style.height = divHeight + "px";
                                if(str)
                                {
                                    document.getElementById('channels').innerHTML = str;
                                }
                                
                                if(epg)
                                {
                                    document.getElementById('epg').innerHTML = epg;
                                }
                            }
                        }
                        
                        myApp.hideIndicator();

                    },
            error : function(xhr, ajaxOptions, thrownError)
            {
                myApp.hideIndicator();
            }
        });   
    }
    else if(page.name == "home"){}
    else if(page.name == "catchup")
    {
        document.getElementById('catchup-search-form').addEventListener("submit", catchupSearch);
        document.getElementById('catchup-search').addEventListener("focus", focusSearch);
    }

});
 
function makeAccordion(epg,url)
{
    if(epg)
    {
        if(url)
        {
            var str = '<div class="list-block accordion-list"><ul>';
            
            for (i = 0; i < epg.length; i++)
            { 
                str += '<li class="accordion-item"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title">'+epg[i].name+'</div></div></a><div class="accordion-item-content"><div class="content-block">'+epg[i].description.substring(0,70)+'</div></div></li>';
            }
            
            str += '</ul></div>';
            return str + '<a href="#" class="button active button-big" id="play-button" onclick="playStream(\'' + url + '\')">Play</a>';    
        }
        else
        {
            var str = '<div class="list-block accordion-list catchup-accordion"><ul>';
            
            for (i = 0; i < epg.length; i++)
            { 
                str += '<li class="accordion-item"><a href="#" class="item-link item-content"><div class="item-media"><img src="'+imgUrl+epg[i].logo+'" /></div><div class="item-inner"><div class="item-title">' + epg[i].title + ' : <div class="pull-right"><strong>' + epg[i].date  + '</strong></div></div></div></a><div class="accordion-item-content"><div class="content-block">'+epg[i].description.substring(0,70 )+'<a hre="#" class="button active" onclick="playStream(\''+epg[i].url+'\')">Watch</a></div></div></li>';
            }
        
            str += '</ul></div>';
            return str;
        }
    }
    else
    {
        return false;
    }
}

function setParams(page)
{
    if(customBg)
    {
        if(page)
        {
            document.getElementById(page.name + "-page").style.background = 'url(' + customBg + ')';    
        }
        else
        {
            homeBg = document.getElementById("home-page");
            if (typeof(homeBg) != 'undefined' && homeBg != null)
            {
                homeBg.style.background = 'url(' + customBg + ')';    
            }
        }
        
    }
    
    var homeBar =  document.getElementById('home-nav');
    if (typeof(homeBar) != 'undefined' && homeBar != null)
    {
        homeBar.innerHTML = company;
    }

    
}

function changeChannel(div)
{
    var id = div.id.replace(/channel-/i, '');
    var keys = Object.keys(channels);
    if(channels[keys[id]])
    {
        var acc = makeAccordion(channels[keys[id]].shows,channels[keys[id]].url);
        document.getElementById('epg').innerHTML = acc;
        
    }
    
    var channelUl = document.getElementById("channel-list");
    var listItems = channelUl.getElementsByTagName("li");
    
    if (typeof(listItems) != 'undefined' && listItems != null)
    {
        for (i = 0; i < listItems.length; i++)
        { 
            if(listItems[i].id == "channel-"+id)
            {
                document.getElementById(listItems[i].id).style.background = "#cccccc";           
            }
            else
            {
                document.getElementById(listItems[i].id).style.background = "white";       
            }
        }
    }
    else
    {
        console.log("CHELEMENTSD ARE REEMPTY");
    }
    
}

function playStream(url)
{
    if(url)
    {
        if(live)
        {
            window.plugins.vitamio.playVideo(url);       
        }
        else
        {
            alert(url);
        }
    }
    else
    {
        myApp.alert("An Unknown Error Occurred");
    }
}

function catchupSearch(e)
{  
    e.preventDefault();
    document.activeElement.blur();
   
    search = document.getElementById('catchup-search').value;
    
    if(search && search.length >= 3)
    {
        
        myApp.showIndicator();
        $$.ajax({
            type : 'GET',//
            url : apiUrl + "?controller=catchup&action=search&serial="+getSerial()+"&pass=" + apiKey + "&gzip=false&json=true&search=" + encodeURIComponent(search) + "&version="+version,
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data: "{}",
            success : function(response)
                    {
                        if(response.success)
                        {
                            search = response.data;
                            
                            if(search)
                            {

                                for (var i = 0, len = search.length; i < len; i++) 
                                {
                                    searchResult = makeAccordion(search,false);
                                    
                                }
                                
                                if(searchResult)
                                {
                                    
                                    var nBar = document.getElementById("catchup-search-form");
                                    var fBar = document.getElementsByClassName("tabbar")[0];
                                    distX = fBar.offsetLeft - nBar.offsetLeft;
                                    distY = fBar.offsetTop - nBar.offsetTop;
                                    distance = Math.sqrt(distX*distX + distY*distY);
                                    //alert(Math.floor(distance));
                                    divHeight = (Math.floor(distance) - (fBar.clientHeight)-10);
                                    document.getElementById('catchup-content').style.height = divHeight + "px";
                                
                                    document.getElementById('catchup-content').innerHTML = searchResult;
                                }
                            }
                        }
                        else
                        {
                            document.getElementById('catchup-content').innerHTML = response.errormsg;
                        }
                        
                        myApp.hideIndicator();

                    },
            error : function(xhr, ajaxOptions, thrownError)
            {
                myApp.hideIndicator();
            }
        });
    }
    else
    {
        myApp.alert("Search must be at least three characters");
    }    
}


function focusSearch()
{
    /*
    alert("SEARCH FOUSED");
    /*
    document.getElementById('catchup-search').style.position = "absolute";
    document.getElementById('catchup-search').style.top = "0";
    document.getElementById('catchup-search').style.height = "500px";
    document.getElementById('catchup-search').style.background = "red";
    document.getElementById('overlay-box').style.zIndex  = "99999";
    */
    /*
    document.getElementById('overlay-box').appendChild(
    document.getElementById('catchup-search')
  );
  */
}

function getSerial()
{
    if(live)
    {
        return "520068c24b9fb000";
        //return "80cc674e"; 
        //return device.serial;
    }
    else
    {
        return "520068c24b9fb000";    
    }
}



function checkSerial(){
    
    $$.ajax({
            type : 'GET',//
            //url : apiCrmUrl + "key" + apiCrmkey + "serial" + serial + "&gzip=false&json=true",
            url: "https://test.europa-network.com/Customerapp/checkserial/key/Rqt8BxhuuDqQ4Kulo8WU/serial/"+ getSerial(),
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data: "{}",
            success : function(response)
                    {
                        console.log("SUCCES AJACX");
                        console.log(response.checkSerial);
                        if(response.checkSerial)
                        {
                            login = 'hola',
                            mainView.router.reloadPage('home.html');    
                        }
                        else
                        {
                            mainView.router.reloadPage('form-registration.html');
                        }
                    },
            error : function(xhr, ajaxOptions, thrownError)
            {
                console.log("error AJACX");
                var login = 'bye';
                mainView.router.reloadPage('index.html');
            }
        });
   
}

function setFormRegistration()
{
    $$('.form-registration').on('click', function() {
    console.log('on registration!!!!!!!!!!!!');
      var storedData = myApp.formToJSON('#form-registration');
      if(storedData) 
      {
         console.log(storedData.username);
         console.log(storedData.email);
         
         var username = $$('username').val();
         var email = $$('#email').val()
         if (!username || !email)
         {
            myApp.alert('field is empty!! ');
         }
         else
         {
              $$.ajax({
                type : 'GET',
                url: "https://test.europa-network.com/Customerapp/RegisterUser/key/Rqt8BxhuuDqQ4Kulo8WU/serial/"+ getSerial() + "/name/" + storedData.name + "/email/" +storedData.email ,
                dataType : "json",
                contentType: "application/json; charset=utf-8",
                data: "{}",
                success : function(response)
                        {
                            console.log("SUCCES AJACX");
                            console.log(response.createCode);
                            if(response.createCode)
                            {
                                mainView.router.reloadPage('form-code.html');
                            }
                            else
                            {
                                mainView.router.reloadPage('form-registration.html');
                            }
                        },
                error : function(xhr, ajaxOptions, thrownError)
                {
                    console.log("error AJACX on registration");
                    var login = 'bye';
                    mainView.router.reloadPage('index.html');
                }
            });   
         }
      }
      else 
      {
        myApp.alert('There is no stored data for this form yet. Try to change any field')
      }
    });
     
     $$('.form-from-json').on('click', function(){
                          var formData = {
                            'username': 'Angel',
                            'email': 'scottopinder88@gmail.com'
                          }
                          myApp.formFromJSON('#form-registration', formData);
                        });
      
}

function setFormCode()
{    
    $$('.form-code').on('click', function() {
    console.log('on registration!!!!!!!!!!!!');
      var storedData = myApp.formToJSON('#form-code');
      if(storedData) {
        alert(JSON.stringify(storedData));
        mainView.router.reloadPage('home.html');
      }
      else {
        alert('There is no stored data for this form yet. Try to change any field')
      }
    });
     
     $$('.form-from-code-json').on('click', function(){
                          var formData = {
                            'code': '1x1x1x'
                          }
                          myApp.formFromJSON('#form-code', formData);
                        });
      
}
