// Initialize your app
var myApp = new Framework7();

var company = "Europa Network";
var customBg = "http://www.europa-network.com/wp-content/themes/europa/inc/images/bkg-abstract-purple.jpg";
var logo = "";
var imgUrl = "http://stalker.europa-network.com/portal/misc/logos/120/";
var apiKey = "UnlOMQfQN0/bn88Uw/eNB3GeiXXRzIWffRcKPyPqghaxd0kXGyWziu8MBX1epQ4Qf/tcpvkGaVlS6/AlkYAT4g==";
var apiUrl = "http://tvapi.europa-network.com/";

var data, channels, search, serial, searchResult;

// Export selectors engine
var $$ = Dom7;

// Add views
var view1 = myApp.addView('#view-1');


setParams(false);

//We can also add callback for all pages:
myApp.onPageBeforeInit('*', function (page) {
    
    setParams(page);
    
    if(page.name == "tv")
    {
        //var b = document.querySelectorAll('[data-page="tv"]');
        //console.log(JSON.stringify(JSON.toString(b)));
        //console.log(JSON.stringify(b));
        
        
        //b.style.background = 'url(http://www.europa-network.com/wp-content/themes/europa/inc/images/bkg-abstract-purple.jpg)';
        /*
        var a = document.getElementById('channels');
        a.style.background = 'url(http://www.europa-network.com/wp-content/themes/europa/inc/images/bkg-abstract-purple.jpg)';
        */
        myApp.showIndicator();
        $$.ajax({
            type : 'GET',//
            url : apiUrl + "?controller=users&action=login&serial=520068c24b9fb000&pass=" + apiKey + "&gzip=false&json=true",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data: "{}",
            success : function(response)
                    {
                        //console.log("SUCCES AJACX");
                        //console.log(response);
                        //console.log(response.data);
                        //console.log(response.success);
                        
                        if(response.success)
                        {
                            //console.log("WE HAVE SUCCES");
                            channels = response.data.channels;
                            data = response.data.channels;
                            
                            if(channels)
                            {
                                var str,epg;
                                //console.log("WE HAVE CHANNELS"); 
 
                                
                                var keys = Object.keys(channels);
                                
                                //console.log(keys.length);


                                for (var i = 0, len = keys.length; i < len; i++) 
                                {
                                    
                                   //console.log("Starting Channels Loop");
                                   
                                    
                                    //console.log("*******************");
                                    //console.log(channels[keys[i]].name);
                                    //console.log(channels[keys[i]].logo);
                                    //console.log(imgUrl);
                            
                                    
                                    if(i==0)
                                    {
                                        str = '<div class="list-block"><ul>';
                                        epg = makeAccordion(channels[keys[i]].shows,channels[keys[i]].url);
                                        
                                    }
                                    //console.log(str + "  -   " + i);
                                    
                                    //console.log("HA1");
                                    
                                    //str += '<li class="channel-button" id="channel-'+i+'><div class="item-content"><div class="item-media"><img src="' + imgUrl + channels[keys[i]].logo + '" /></div> <div class="item-inner">' + channels[keys[i]].name + '</div></div></li>';
                                    str += '<li id="channel-'+i+'" onclick="changeChannel(this)"><div class="item-content"><div class="item-media"><img src="' + imgUrl + channels[keys[i]].logo + '" /></div> <div class="item-inner">' + channels[keys[i]].name + '</div></div></li>';
                                    //console.log("HA2");
                                    
                                    if(i == (keys.length - 1))
                                    {
                                        str += '</ul></div>';
                                    }
                                    
                                    //console.log("CXXXXXXXXXX");
                                }
                                
                                if(str)
                                {
                                    document.getElementById('channels').innerHTML = str;
                                }
                                
                                if(epg)
                                {
                                    document.getElementById('epg').innerHTML = epg;
                                }
                                //console.log("==================================");
                                //console.log(str);

                            }
                        }
                        
                        myApp.hideIndicator();

                    },
            error : function(xhr, ajaxOptions, thrownError)
            {
                //console.log("SUCCES AJACX");
                //alert(xhr.status);
                //alert(thrownError);
            }
        });
        
        
  }
  else if(page.name == "home")
  {
        
  }
  else if(page.name == "catchup")
  { 
      /*
        var mySearchbar = myApp.searchbar('.searchbar', {
            customSearch: catchupSearch2(search),
            onSearch: catchupSearch(search)
        }); 
        */
        /*
        var mySearchbar = myApp.searchbar('.searchbar', { 
                                                            onSearch: function(s)
                                                            {
                                                                console.log('okokok');
                                                                var txt1 = s; 
                                                                myApp.alert(txt1);
                                                            },
                                                            searchList:'.list-block-search',
                                                            searchIn:'.item-title',
                                                            customSearch: true,
                                                            onClear: function(s)
                                                            {
                                                                myApp.alert('Clear!!!'); 
                                                            } 
                                                        }); 
        */                                                        
  }
   
   //myApp.hideIndicator();
});
 
function makeAccordion(epg,url)
{
    //console.log("AMEK AACCCORDION");
    if(epg)
    {
        
        
        if(url)
        {
            var str = '<div class="list-block accordion-list"><ul>';
        
            //console.log("EPG 1");
            //console.log(epg);
            //console.log(JSON.stringify(epg));
            
            for (i = 0; i < epg.length; i++)
            { 
                //console.log("==============");
                //console.log(JSON.stringify(epg[i]));
                str += '<li class="accordion-item"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title">'+epg[i].name+'</div></div></a><div class="accordion-item-content"><div class="content-block">'+epg[i].description.substring(0,70)+'</div></div></li>';
                //epg[i].descr.substring(0,30)
            }
            //console.log("EPG 2");
            
            str += '</ul></div>';
            return str + '<a href="#" class="button active button-big" onclick="playStream(\'' + url + '\')">Play</a>';    
        }
        else
        {
            var str = '<div class="list-block accordion-list catchup-accordion"><ul>';
        
            //console.log("EPG 1");
            //console.log(epg);
            //console.log(JSON.stringify(epg));
            
            for (i = 0; i < epg.length; i++)
            { 
                //console.log("==============");
                //console.log(JSON.stringify(epg[i]));
                str += '<li class="accordion-item"><a href="#" class="item-link item-content"><div class="item-media"><img src="'+imgUrl+epg[i].logo+'" /></div><div class="item-inner"><div class="item-title">' + epg[i].title + ' : <div class="pull-right"><strong>' + epg[i].date  + '</strong></div></div></div></a><div class="accordion-item-content"><div class="content-block">'+epg[i].description.substring(0,70 )+'<a hre="#" class="button active" onclick="playStream(\''+epg[i].url+'\')">Watch</a></div></div></li>';
                //epg[i].descr.substring(0,30)
            }
            //console.log("EPG 2");
            
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
                // exists. var div = document.getElementById('home-nav');
                homeBg.style.background = 'url(' + customBg + ')';    
            }
        }
        
    }
    
    var homeBar =  document.getElementById('home-nav');
    if (typeof(homeBar) != 'undefined' && homeBar != null)
    {
        // exists. var div = document.getElementById('home-nav');
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
}

function playStream(url)
{
    alert(url);
    if(url)
    {
        //window.plugin.VideoPlayer.play(url);    
    }
}


//$$("#catchup-search").on("submit", function(){alert("DJKLSDKLSJDJ");})

function catchupSearch(search,test,who)
{
    if(search && search.length >= 3)
    {
        myApp.showIndicator();
        $$.ajax({
            type : 'GET',//
            url : apiUrl + "?controller=catchup&action=search&serial=520068c24b9fb000&pass=" + apiKey + "&gzip=false&json=true&search=" + encodeURIComponent(search),
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
                                    document.getElementById('catchup-content').innerHTML = searchResult;
                                }
                                //console.log("==================================");
                                //console.log(str);

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
                //console.log("SUCCES AJACX");
                //alert(xhr.status);
                //alert(thrownError);
            }
        });
    }
    else
    {
        myApp.alert("Search must be at least three characters");
    }
    
}
