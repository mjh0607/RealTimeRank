const mysql = require('mysql');
const cheerio = require('cheerio');
const request = require('request');

var googleUrl = 'https://trends.google.co.kr/trends/trendingsearches/daily/rss?geo=KR';

var naverUrl = {
  url: 'https://datalab.naver.com/keyword/realtimeList.naver?',
  headers: {
    'User-Agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36 RuxitSynthetic/1.0 v5301609296 t38550'
  }
};

function convertWeekDaysByKorean(weekday) {
    if (weekday.length < 1) {
      return "";
    }

    weekday = weekday.substring(0, weekday.length-1);
    switch (weekday) {
      case "Mon" :
        return "월요일";
      case "Tue" :
        return "화요일";
      case "Wed" :
        return "수요일";
      case "Thu" :
        return "목요일";
      case "Fri" :
        return "금요일";
      case "Sat" :
        return "토요일";
      case "Sun" :
        return "일요일";
    }
    return "";
}

function getDataFormat(date) {
  let MONTHS = {Jan : "1", Feb : "2", Mar : "3", Apr : "4", May : "5", Jun : "6", Jul : "7", Aug : "8", Sep : "9", Oct : "10", Nov : "11", Dec : "12"}
  let arr = date.split(' ');

  if (arr.length >= 4) {
    return (arr[3] + " " + MONTHS[arr[2]] + " " + arr[1] + " " + convertWeekDaysByKorean(arr[0]));
  }
  else {
    return "";
  }
}

setInterval(function(){
  const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'rtr'
  });
  // DB 이름 : rtr
  // Table 이름 : rank
  // Table 필드 : title, ranking (둘 다 varchar(45))

  connection.connect();
  
  var hours = new Date();

  request(naverUrl, function(err,res,body){
    var naverTitle = new Array();

    if(!err) {
      var $ = cheerio.load(body);
    };

    $("ul.ranking_list").children("li.ranking_item").each(function(){
      naverTitle.push($(this).find("span.item_title").text());
    });

    connection.query('DELETE FROM naverRank;');

    var rank = 1;
    for (var i=0; i<naverTitle.length; i++) {
      connection.query('INSERT INTO naverRank(title, ranking) VALUES(?,?)',[naverTitle[i],rank], function(err){
        if (err) {
          throw err;
        }
      });
      rank++;
    }
  });

  request(googleUrl, function(err,res,html){
    var googleTitle = new Array(), Rdate = new Array();

    if(!err) {
      var $ = cheerio.load(html, {xmlMode : true});
    };

    $('item').each(function(){
      googleTitle.push($(this).children('title').text());
    });

    $('item').each(function(){
      let pubDate = $(this).children('pubDate').text();
      Rdate.push(getDataFormat(pubDate));
    });

    connection.query('DELETE FROM googleRank;');

    var rank2 = 1;
    var tempDate = 1;
    for (var i=0; i<googleTitle.length; i++) {
      var todayDate = Rdate[0];
      tempDate = Rdate[i];
      if (tempDate == todayDate) {
        connection.query('INSERT INTO googleRank(title, ranking) VALUES(?,?)',[googleTitle[i],rank2], function(err) {
          if (err) {
            throw err;
          }
        });
      }
      rank2++;
    }
  });
  console.log("갱신 날짜 : ", hours);
  //connection.end();
},3000);