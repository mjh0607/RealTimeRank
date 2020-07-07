<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<%@ page import="java.sql.DriverManager" %>

<%@ page import="java.sql.Connection" %>

<%@ page import="java.sql.Statement" %>

<%@ page import="java.sql.ResultSet" %>

<%@ page import="java.sql.SQLException" %>


<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/styles.css">
<link rel="shortcut icon" type="image/x-icon" href="${pageContext.request.contextPath}/css/img/favicon.png">

<title>realtime ranking</title>

</head>
<body>
<div class="firstclass">
	<header>
		<div class="logo">
			<img src="css/img/main_logo.png" alt="rtr로고">
		</div>
		<div class="secondclass">
			<div class="portalimagecontainer">
				<a href="jsp/naver.jsp"><img class="portalimage" src="css/img/naver.png" alt="네이버 로고"></a><br>
				<span class="more">자세히보려면 클릭하세요</span>
			</div>
			<div class ="portalimagecontainer">
				<a href="jsp/google.jsp"><img class="portalimage" src="css/img/google_logo.png" alt="구글로고"></a><br>
				<span class="more">자세히보려면 클릭하세요</span>
			</div>
		</div>
	</header>
</div>
	<footer>
		<div class="footeritem">
		<p>홈파인 |인천광역시 미추홀구 석정로 229,808호<br>
		대표 : 박준선 | 사업자등록번호 : 222-15-62819 | FAX : 032-725-3203<br>
		전화번호 : 032-721-5455 | 이메일 : homefine@naver.com | 계좌 : 110-516-225920(신한) / 박준선(홈파인)<br>
		© 2018 HOMEFINE. All rights reserved</p>
		</div>
	</footer>

</body>
</html>