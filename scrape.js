const request = require('request');
const cheerio = require('cheerio');

var get_config = function(site_url){
	var config = {
		url : ((site_url)),
		proxy : 'http://172.30.0.14:3128'
	};

	return config;
};

var visited_links = []

var is_visited = function(site_url){
	if (visited_links.indexOf(site_url) == -1)
		return false;
	return true;
}


var check_validity = function(site_url,base_url){
	if (is_visited(site_url)){
		//console.log("visited",site_url);
		return false;
	}
	//console.log(site_url , base_url);
	if(site_url.indexOf(base_url) > -1){//console.log("sublink");
		return true;
	}
	else 
		return false;
}

var process_link = function(site_url,base_url){

	if(site_url.lastIndexOf("/") == site_url.length-1)
		site_url = site_url.substring(0,site_url.length-1);
	if(site_url.indexOf("/") == 0  )
		site_url =  base_url+site_url;
	if (site_url.indexOf("#") == site_url.length-1)
		site_url = site_url.substring(0,site_url.length-1)
	
	
	return site_url;
}
var max_depth = 2;

var count = 0;
var base_url = 'http://yourstory.com';

var link_getter=function(site_url,c){



	request(
	//get_config('http://www.google.com')
	get_config(site_url)
	, (function (error, response, body) {
		//console.log(response.statusCode);
		//console.error(error);
        //return console.log(body.substr(0, 128) + '...');
        if(error)
        {
        	//console.log(site_url);
        	console.log(error);
        	return ;
        }
        $ = cheerio.load(body);
        

        $('p').each(function(){
        	console.log($(this).html());
        })

        $('a').each(function(){
        	



        	var link = $(this).attr('href');
        	//console.log(link);
        	if(link === undefined)
        		return;
        	var next_link = process_link(link,base_url);
        	
        	
        	if(check_validity(next_link,base_url) && c<=1){
        		count++;
        		visited_links.push(next_link);
        		//console.log(next_link);
        		//console.log(count);
        		


        		link_getter(next_link,c+1);



        	}
        })
    })
	);
}


//console.log(check_validity("https://www.linkedin.com/company/yourstory-com","http://www.yourstory.com"));

//console.log(process_link("http://www.yourstory.com/","fdf"))


var base_url = 'http://bbc.com';
link_getter(base_url,0);
