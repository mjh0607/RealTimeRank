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
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/main.css">
	<link rel="shortcut icon" type="image/x-icon" href="${pageContext.request.contextPath}/css/img/favicon.png">
	<title>naver realtime ranking</title>
</head>
<body>
<% 
    Connection conn=null;
    Statement stmt=null;
	Statement stmt2=null;
    ResultSet rs=null;
	ResultSet rs2=null;

	int j=1;

    try{
     Class.forName("org.mariadb.jdbc.Driver");
    	String jdbcDriver ="jdbc:mariadb://101.101.218.40:3306/rtr";
    	String dbUser="root";
    	String dbPass="R5b4-FGGJ5e";
    	String query="select * from naverRank";
		String query2="select * from naveryoutube";
     //2.데이터 베이스 커넥션 생성
    	conn=DriverManager.getConnection(jdbcDriver,dbUser,dbPass);
     //3.Statement 생성
    	stmt=conn.createStatement();
		stmt2=conn.createStatement();
     //4. 쿼리실행
    	rs=stmt.executeQuery(query);
		rs2=stmt2.executeQuery(query2);		
%>
<div class="firstclass">
	<header>
		<table class="sectiontable">
			<tr class="sectionlogo">
				<td colspan="2"><div class="logo"><a href="${pageContext.request.contextPath}/index.jsp"><img src="${pageContext.request.contextPath}/css/img/sub_main.png" alt="rtr로고"></a></div></td>
			</tr>
			<tr class= "section">
				<td>
					<div class="lists">
						<div class="rankingmain">
							<img src="${pageContext.request.contextPath}/css/img/sub_naver.png">
							<div class= "rankingcontent">
								<%
								if (!(rs.next())) {
								%>
								<div><span>검색결과 종료</span></div>
								<%
								} else {
									do {
								%>
								<div class="content">
									<div class="ranking"><%=rs.getString("ranking")%></div>
										<p>&nbsp &nbsp &nbsp</p>
									<div class="title"><%=rs.getString("title")%></div>
								</div>
								<% 
									} while(rs.next());
								}
								%>
							</div>
						</div>
					</div>
				</td>
				<td>
					<div class="video">
						<table class="youtubetable">
							<%
							if (!(rs2.next())) {
							%>
							<div><span>검색결과 종료</span></div>
							<%
							} else {
								do{
							%>
							<tr>
								<% 
									for(int i=0; i<3; i++){
								%>
								<td>
									<div class="cell" id="cell<%=j++%>">
										<div class="thumbimg">
											<a href="<%=rs2.getString("url")%>" target="_blank">
												<img src="<%=rs2.getString("thumbnails")%>">
											</a>
										</div>
										<div class="youtitle">
											<p><%=rs2.getString("videotitle")%></p>
										</div>
										<div class="channelname">
											<p><%=rs2.getString("channel")%></p>
										</div>
									</div>
								</td>
								<%
										rs2.next();
									}
								%>
							</tr>
							<% 
								}while(rs2.next());
							}
							%>
						</table>
					</div>
				</td>
			</tr>
		</table>
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
<%
	} catch(SQLException ex) {
%>
		에러발생:<%= ex.getMessage() %>
<%
	}finally {
	    if(rs!=null) try{rs.close(); }catch(SQLException ex) {}
		if(rs2!=null) try{rs2.close(); }catch(SQLException ex) {}
	    if(stmt!=null) try{stmt.close();} catch(SQLException ex) {}
		if(stmt2!=null) try{stmt2.close();} catch(SQLException ex) {}
	    if(conn!=null) try{conn.close(); }catch(SQLException ex) {}
	}
%>
</body>
</html>