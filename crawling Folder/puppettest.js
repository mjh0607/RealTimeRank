const mysql = require('mysql');
const puppeteer = require('puppeteer');

var youtubeUrl = "https://www.youtube.com/results?search_query=";
var search_title_naver = new Array; //DB에서 naver 랭킹 리스트 json으로 저장
var search_title_google = new Array;  //DB에서 google 랭킹 리스트 json으로 저장

//setInterval(function(){ //자동실행함수
  const connection = mysql.createConnection({
    host : '101.101.218.40',
    port: 3306,
    user:'root',
    password:'R5b4-FGGJ5e',
    database:'rtr',
    charset : 'utf8mb4'
  });
  // DB 이름 : rtr
  // Table 이름 : rank
  // Table 필드 : title, ranking (둘 다 varchar(45))
  // youtube => videotitle, url, thumbnails

  //connection.connect();
  connection.query('DELETE FROM naveryoutube;');
  connection.query('DELETE FROM googleyoutube;');
  
  connection.query('SELECT * from naverRank order by ranking asc', function(err, rows, fields) {  
    if (err) {
      console.log('naverRank select error'); 
    } else {
      for (var i in rows){
        search_title_naver[i] = {title: rows[i].title,ranking: rows[i].ranking};
      }
    }
  });

  connection.query('SELECT * from googleRank order by ranking asc', function(err, rows, fields) {  
    if (err) {
      console.log('googleRank select error'); 
    } else {
      for (var i in rows){
        search_title_google[i] = {title: rows[i].title,ranking: rows[i].ranking};
      }
    }
  });

  (async () => {
    try {
      const browser = await puppeteer.launch({
          headless: false,
          devtools: true,
      });

      for (var k=0; k<search_title_naver.length; k++) {
        const n_search = search_title_naver[k].title
        const naver_search = youtubeUrl + encodeURI(n_search);
        const page = await browser.newPage();
        await page.goto(naver_search);
        await page.waitForSelector('ytd-thumbnail.ytd-video-renderer'); //검색해서 홈페이지 로딩 시간 동안 잠깐 기다리도록 하는 코드

        const n_videoList = await page.evaluate(() => { //return 받을 수 있게하는 함수
          const n_list = document.querySelectorAll('#contents ytd-video-renderer, #contents ytd-grid-video-renderer');
          const naver_arr = new Array;
          for (let i = 0; i < 3; i++) {   // i 값 영상가져오는 개수
            const n_title = n_list[i].querySelector('#video-title yt-formatted-string').textContent;
            const n_link = n_list[i].querySelector('#video-title').getAttribute('href');
            //const snippet = list[i].querySelector('#description-text').textContent;
            const n_channel = n_list[i].querySelector('#text').textContent;
            //const channelLink = list[i].querySelector('#text a').getAttribute('href');
            //const views = list[i].querySelector('#metadata-line span:nth-child(1)').textContent;
            //const date = list[i].querySelector('#metadata-line span:nth-child(2)').textContent;
            const n_url = "https://www.youtube.com" + n_link;
            const n_thumbnails ="http://i.ytimg.com/vi/" + n_link.replace("/watch?v=","") + "/mqdefault.jpg";
            const n_video = { n_title, n_url, n_thumbnails, n_channel };
            naver_arr.push(n_video);
          }
          return naver_arr;
        });

        console.log(n_videoList);
        for(var j=0; j<n_videoList.length; j++) {
          connection.query('INSERT INTO naveryoutube(ranking, title, videotitle, url, thumbnails, channel) VALUES(?,?,?,?,?,?)',[k+1,n_search,n_videoList[j]['n_title'],n_videoList[j]['n_url'],n_videoList[j]['n_thumbnails'],n_videoList[j]['n_channel']], function(err){
            if (err) { throw err; }
          });
        }
      }
      console.log("-----------------------------------");
      for (var m=0; m<search_title_google.length; m++) {
        const g_search = search_title_google[m].title
        const google_search = youtubeUrl + encodeURI(g_search);
        const page = await browser.newPage();
        await page.goto(google_search);
        await page.waitForSelector('ytd-thumbnail.ytd-video-renderer'); //검색해서 홈페이지 로딩 시간 동안 잠깐 기다리도록 하는 코드

        const g_videoList = await page.evaluate(() => { //return 받을 수 있게하는 함수
          const g_list = document.querySelectorAll('#contents ytd-video-renderer, #contents ytd-grid-video-renderer');
          const google_arr = new Array;
          for (let n = 0; n < 3; n++) {  // i 값 영상가져오는 개수
            const g_title = g_list[n].querySelector('#video-title yt-formatted-string').textContent;
            const g_link = g_list[n].querySelector('#video-title').getAttribute('href');
            //const snippet = list[i].querySelector('#description-text').textContent;
            const g_channel = g_list[n].querySelector('#text').textContent;
            //const channelLink = list[i].querySelector('#text a').getAttribute('href');
            //const views = list[i].querySelector('#metadata-line span:nth-child(1)').textContent;
            //const date = list[i].querySelector('#metadata-line span:nth-child(2)').textContent;
            const g_url = "https://www.youtube.com" + g_link;
            const g_thumbnails ="http://i.ytimg.com/vi/" + g_link.replace("/watch?v=","") + "/mqdefault.jpg";
            const g_video = { g_title, g_url, g_thumbnails, g_channel };
            google_arr.push(g_video);
          }
          return google_arr;
        });

        console.log(g_videoList);
        for(var v=0; v<g_videoList.length; v++) {
          connection.query('INSERT INTO googleyoutube(ranking, title, videotitle, url, thumbnails, channel) VALUES(?,?,?,?,?,?)',[m+1,g_search,g_videoList[v]['g_title'],g_videoList[v]['g_url'],g_videoList[v]['g_thumbnails'],g_videoList[v]['g_channel']], function(err){
            if (err) { throw err; }
          });
        }
      }
      await browser.close();
    } catch (error) {
      console.log(error);
    }
  })();
  //connection.end();
//},3000);  //3초 마다 자동실행