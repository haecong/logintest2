
var x = '37.5578711';
var y = '126.8025052';
function openMap(roadSn, type, key, xp, yp, zm){
	if(xp == null || xp == ''){
		if(type == 1){
			xp = '37.570595';
			yp = '126.699981';
		}else if(type == 2){
			xp = '37.8576633';	
			yp = '128.8528662';
		}else{
			xp = '37.701242';
			yp = '126.383600';
		}
	}
	var _height = 700;
	var _width = 1200;
	_height = screen.height - 200;
	_width = screen.width - 100;
	var _left = (screen.width - _width) / 2;
	var _top = (screen.height - _height) / 2 - 50;
	var _attr = "left="+_left+",top="+_top+",width="+_width+",height="+_height+",menubar=no,status=no,toolbar=no,resizable=no,channelmode=no";
	var url = "/map/roadMap.do?roadSn=" + roadSn + "&roadType=" + type + "&xp=" + xp + "&yp=" + yp + "&key="+key+"&zm="+zm;
	//location.href = url;
	//alert(url);
	var popWin = window.open(url, "", _attr);
	popWin.focus();
}

function goRoad(roadSn, roadType, xp, yp){
	//location.href = "/map/roadMap.do?roadSn="+roadSn+"&roadType="+roadType+"&xp="+xp+"&yp="+yp+"&key=${ param.key }";
}
function goInfoWin(seq){
	var marker = markers[seq],
	infoWindow = infoWindows[seq];

	if (infoWindow.getMap()) {
		infoWindow.close();
	} else {
		infoWindow.open(map, marker);
	}
}

//아래부터 지도 관련
//인증센터 관련 배열 선언
var markers = new Array(), infoWindows = new Array(), mapDataArr = new Array();
var polyline = ['lineOne', 'lineTwo', 'lineThree', 'lineFour', 'lineFive', 'lineSix', 'lineSeven', 'lineEigth', 'lineNine', 'lineTen', 'lineEleven', 'lineTwelve'];
var water = new Array(), toilet = new Array(), air = new Array();
var toiletWindow = new Array(), waterWindow = new Array(), airWindow = new Array();
(function($){

//메뉴 목록 정보
$.getRoadList = function(roadSn, roadType, xp, yp, key, zm) {
	if(zm == null || zm == ''){
		zm = 12;
	}
	var zz = new Number(zm) + 0; //0 안더하면 오류남....
	$('input[name=roadSn]').val(roadSn);
	map = new naver.maps.Map('map', {
		center: new naver.maps.LatLng(xp, yp),
		zoom: zz,
		useStyleMap: true,
		scaleControl: true,
		logoControl: false,
		mapDataControl: true,
		zoomControl: true,
		minZoom: 6,
		mapTypeControl: false,
		/*mapTypeControlOptions: {
			style: naver.maps.MapTypeControlStyle.DROPDOWN
		},*/
		mapTypes: new naver.maps.MapTypeRegistry({
			'normal': naver.maps.NaverStyleMapTypeOption.getVectorMap(),//naver.maps.NaverStyleMapTypeOption.getNormalMap();
			'hybrid': naver.maps.NaverStyleMapTypeOption.getHybridMap(),
			'satellite': naver.maps.NaverStyleMapTypeOption.getSatelliteMap()
		}),
		zoomControlOptions: {
			position: naver.maps.Position.TOP_RIGHT
		}
	});
	
	$.getLineList(key, roadSn);
	if(roadType == 1){
		$.getStampList(key, roadSn);
	}

};

$.getStampList = function(key, roadSn) {
	$.ajax({
		url	 : "/map/getStampList.do?key="+key,
		type	: "POST",
		data	: { "roadSn" : roadSn},
		dataType: "json",
		error   : function(request, status, error) {
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
			//lodingOff(document.body);
		},
		success:function(result) {
			if(result != null && result.length > 0) {
				mapDataArr = new Array(), markers = new Array, infoWindows = new Array; //마커 초기화
				for(var i=0; i<result.length; i++) {
					var item = result[i];
					
					var auth = "", sell = "";
					if(item.authCenter == 'Y'){
						auth = '<div class="op1">종주인증센터</div>';
					}
					if(item.noteSell == 'Y'){
						sell = '<div class="op2">수첩판매</div>';
					}
					var mapData = {
						"lat"  : item.stampXp,
						"lng"  : item.stampYp,
						"nm"   : item.stampNm,
						"tel"  : item.stampTel,
						"addr" : item.stampAddr,
						"type" : item.stampType,
						"simg" : item.stampImg,
						"auth" : auth,
						"sell" : sell
					};
					
					mapDataArr.push(mapData);
				}
				authCenter();
			} else {
				alert("지도정보 조회중 오류가 발생하였습니다.Stamp");
			}
		}
	});
};

$.getLineList = function(key, roadSn) {
	$.ajax({
		url	 : "/map/getLineList.do?key="+key,
		type	: "POST",
		data	: { "roadSn" : roadSn },
		dataType: "json",
		error   : function(request, status, error) {
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		},
		success:function(result) {
			result = result[0];
			var lineList = new Array();
			if(result != null && result.roadHeadList.length > 0) {
				for(var i=0; i<result.roadHeadList.length; i++) {
					var head = result.roadHeadList[i];
					lineList = new Array();
					for(var a=0; a<result.roadList.length; a++){	
						var item = result.roadList[a];
						if(head == item.lineOrdr){
							lineList.push(new naver.maps.LatLng(item.lineXp, item.lineYp));
						}
					}
					polyline[i] = new naver.maps.Polyline({
						map: map,
						path: lineList,
						strokeColor: '#FF0000', //선 색 빨강 #빨강,초록,파랑
						strokeOpacity: 0.8, //선 투명도 0 ~ 1
						strokeWeight: 2
					});
					
				}
				
			} else {
				alert("지도정보 조회중 오류가 발생하였습니다.L");
			}
		}
	});

};

})(jQuery); 

function authCenter(){
	var options = "'_blank','width=600,height=450,toolbars=no,scrollbars=no'";
	//최초 데이터 for 문돌면서 리스트 생성
	//인증지점 찍기
	for(var i=0;i<mapDataArr.length;i++){
		var marker = new naver.maps.Marker({
			position: new naver.maps.LatLng(mapDataArr[i].lat, mapDataArr[i].lng),
			map: map,
			icon: {
				url: '/resource/bike/img/content/sub07/star_'+mapDataArr[i].type+'.gif',
				size: new naver.maps.Size(50, 52),
				origin: new naver.maps.Point(0, 0),
				anchor: new naver.maps.Point(25, 26)
			},
			zIndex: 100
		});
		
		var contentString = [
			'<div class="iw_inner">',
			'   <h3>' + mapDataArr[i].nm + '</h3>',
//			'	<div class="op_box">' + mapDataArr[i].auth + mapDataArr[i].sell +'',
//			'	</div>',
			'   <a href="/resource/bike/img/content/sub07/auth_center/'+ mapDataArr[i].simg +'.jpg" onclick="window.open(this.href, ' + options + '); return false;">',
			'   <img src="/resource/bike/img/content/sub07/auth_center/'+ mapDataArr[i].simg +'.jpg" width="100px" height="100px" alt="인증이미지 임시" class="thumb" /></a>',
			'   <ul>', 
			'		<li><em>주소</em> : ' + mapDataArr[i].addr + '</li>',
			'		<li><em>문의</em> : ' + mapDataArr[i].tel + '</li>',
			'   </ul>',
			//'	<a href="javascript:void(0)" id="btn_popup_close"><span>팝업 닫기</span></a>',
			'</div>'
		].join('');
		
		var infoWindow = new naver.maps.InfoWindow({
			content: contentString
		});
		
		markers.push(marker);
		infoWindows.push(infoWindow);
	}
	
	naver.maps.Event.addListener(map, 'idle', function() {
		updateMarkers(map, markers);
	});
	
	for (var i=0; i<markers.length; i++) {
		naver.maps.Event.addListener(markers[i], 'click', getClickHandler(i));
	}
}

function updateMarkers(map, markers) {

	var mapBounds = map.getBounds();
	var marker, position;
	
	for (var i = 0; i < markers.length; i++) {
		
		marker = markers[i]
		position = marker.getPosition();
		
		if (mapBounds.hasLatLng(position)) {
			if (marker.setMap()) return;
			marker.setMap(map);
		} else {
			if (!marker.setMap()) return;
			marker.setMap(null);
		}
	}
}

//해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
function getClickHandler(seq) {
	return function(e) {
		var marker = markers[seq],
			infoWindow = infoWindows[seq];

		if (infoWindow.getMap()) {
			infoWindow.close();
		} else {
			infoWindow.open(map, marker);
		}
	}
}

//화장실 placeType = 2
$(function(){
	$("#bumrye01").click(function(){
		var chk = $(this).is(":checked");
		var placeType = '2';
		var roadSn = $('input[name=roadSn]').val();
		var key = $('input[name=key]').val();
		if(chk){
			$.ajax({
				url	 : "/map/getPlaceList.do?key="+key,
				type	: "POST",
				data	: { "roadSn" : roadSn , "placeType" : placeType},
				dataType: "json",
				error   : function(request, status, error) {
					alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
				},
				success:function(result) {
					if(result != null && result.length > 0) {
						
						for(var i=0; i<result.length; i++) {
							var item = result[i];
							//alert(item.placeSn);
							var toiletM = new naver.maps.Marker({
								position: new naver.maps.LatLng(item.placeXp, item.placeYp),
								map: map,
								icon: {
									//url: '/resource/bike/img/content/sub07/toliet.gif',
									size: new naver.maps.Size(50, 52),
									origin: new naver.maps.Point(0, 0),
									anchor: new naver.maps.Point(25, 26),
									content : '<img src="/resource/bike/img/content/sub07/toliet.gif" alt="화장실">'
								},
								zIndex: 100
							});
							
							toiletM.setMap(map);
							toilet.push(toiletM);
							
							var contentString = [
								'<div>화장실<br/>',
								'관리ID (화'+ item.placeCode +')',
								'</div>'
							].join('');
							
							var infoWindow = new naver.maps.InfoWindow({
								content: contentString
							});
							toiletWindow.push(infoWindow);
						}
						
						naver.maps.Event.addListener(map, 'idle', function() {
							updateMarkers(map, toilet);
						});
						
						for (var i=0; i<toilet.length; i++) {
							naver.maps.Event.addListener(toilet[i], 'click', getClickHandlerToilet(i));
						}
					} else {
						//alert("지도정보 조회중 오류가 발생하였습니다.");
					}
				}
			});
		}else{
			for(var i=0;i<toilet.length;i++){
				var marker = toilet[i];
				marker.setMap(null);
			}
			for(var i=0;i<toiletWindow.length;i++){
				var infowindow = toiletWindow[i];
				infowindow.setMap(null);
			}
		}
	});
});


//음수대 placeType = 4
$(function(){
	$("#bumrye02").click(function(){
		var chk = $(this).is(":checked");
		var placeType = '4';
		var roadSn = $('input[name=roadSn]').val();
		var key = $('input[name=key]').val();
		if(chk){
			$.ajax({
				url	 : "/map/getPlaceList.do?key="+key,
				type	: "POST",
				data	: { "roadSn" : roadSn , "placeType" : placeType},
				dataType: "json",
				error   : function(request, status, error) {
					alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
				},
				success:function(result) {
					if(result != null && result.length > 0) {
						
						for(var i=0; i<result.length; i++) {
							var item = result[i];
							
							var waterM = new naver.maps.Marker({
								position: new naver.maps.LatLng(item.placeXp, item.placeYp),
								map: map,
								icon: {
									//url: '/resource/bike/img/content/sub07/water.gif',
									size: new naver.maps.Size(50, 52),
									origin: new naver.maps.Point(0, 0),
									anchor: new naver.maps.Point(25, 26),
									content : '<img src="/resource/bike/img/content/sub07/water.gif" alt="음수대">'
								},
								zIndex: 100
							});
							
							waterM.setMap(map);
							water.push(waterM);
							
							var contentString = [
								'<div>급수대<br/>',
								'관리ID (수'+ item.placeCode +')',
								'</div>'
							].join('');
							
							var infoWindow = new naver.maps.InfoWindow({
								content: contentString
							});
							waterWindow.push(infoWindow);
						}
						
						naver.maps.Event.addListener(map, 'idle', function() {
							updateMarkers(map, water);
						});

						for (var i=0; i<water.length; i++) {
							naver.maps.Event.addListener(water[i], 'click', getClickHandlerWater(i));
						}
						
					} else {
						//alert("지도정보 조회중 오류가 발생하였습니다.");
					}
				}
			});
		}else{
			for(var i=0;i<water.length;i++){
				var marker = water[i];
				marker.setMap(null);
			}
			for(var i=0;i<waterWindow.length;i++){
				var infowindow = waterWindow[i];
				infowindow.setMap(null);
			}
		}
	});
});

//공기주입기 placeType = 1
$(function(){
	$("#bumrye03").click(function(){
		var chk = $(this).is(":checked");
		var placeType = '1';
		var roadSn = $('input[name=roadSn]').val();
		var key = $('input[name=key]').val();
		if(chk){
			$.ajax({
				url	 : "/map/getPlaceList.do?key="+key,
				type	: "POST",
				data	: { "roadSn" : roadSn , "placeType" : placeType},
				dataType: "json",
				error   : function(request, status, error) {
					alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
				},
				success:function(result) {
					if(result != null && result.length > 0) {
						
						for(var i=0; i<result.length; i++) {
							var item = result[i];
							
							var airM = new naver.maps.Marker({
								position: new naver.maps.LatLng(item.placeXp, item.placeYp),
								map: map,
								icon: {
									//url: '/resource/bike/img/content/sub07/air.gif',
									size: new naver.maps.Size(50, 52),
									origin: new naver.maps.Point(0, 0),
									anchor: new naver.maps.Point(25, 26),
									content : '<img src="/resource/bike/img/content/sub07/air.gif" alt="공기주입기">'
								},
								zIndex: 100
							});
							
							airM.setMap(map);
							air.push(airM);
							
							var contentString = [
								'<div>공기주입기<br/>',
								'관리ID (공'+ item.placeCode +')',
								'</div>'
							].join('');
							
							var infoWindow = new naver.maps.InfoWindow({
								content: contentString
							});
							airWindow.push(infoWindow);
						}
						
						naver.maps.Event.addListener(map, 'idle', function() {
							airMarkers(map, toilet);
						});

						for (var i=0; i<air.length; i++) {
							naver.maps.Event.addListener(air[i], 'click', getClickHandlerAir(i));
						}
						
					} else {
						//alert("지도정보 조회중 오류가 발생하였습니다.");
					}
				}
			});
		}else{
			for(var i=0;i<air.length;i++){
				var marker = air[i];
				marker.setMap(null);
			}
			for(var i=0;i<airWindow.length;i++){
				var infowindow = airWindow[i];
				infowindow.setMap(null);
			}
		}
	});
});

//해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
function getClickHandlerToilet(seq) {
	return function(e) {
		var marker = toilet[seq],
			infoWindow = toiletWindow[seq];

		if (infoWindow.getMap()) {
			infoWindow.close();
		} else {
			infoWindow.open(map, marker);
		}
	}
}

//해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
function getClickHandlerWater(seq) {
	return function(e) {
		var marker = water[seq],
			infoWindow = waterWindow[seq];

		if (infoWindow.getMap()) {
			infoWindow.close();
		} else {
			infoWindow.open(map, marker);
		}
	}
}

//해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
function getClickHandlerAir(seq) {
	return function(e) {
		var marker = air[seq],
			infoWindow = airWindow[seq];

		if (infoWindow.getMap()) {
			infoWindow.close();
		} else {
			infoWindow.open(map, marker);
		}
	}
}

//자전거길 
var bicycleLayer = new naver.maps.BicycleLayer();
$(function(){
	$("#bumrye04").click(function(){
		var chk = $(this).is(":checked");
		if(chk){
			bicycleLayer.setMap(map);
		}else{
			bicycleLayer.setMap(null);
		}
	});
});

//주변정보?
var labelMapType = new naver.maps.NaverStyleMapTypeOption.getNormalMap();
var labelMapTypeRegistry = new naver.maps.MapTypeRegistry({
	'label': labelMapType
});
var labelLayer = new naver.maps.Layer('label', labelMapTypeRegistry);
$(function(){
	$("#bumrye05").click(function(){
		var chk = $(this).is(":checked");
		if(chk){
			labelLayer.setMap(map);
		}else{
			labelLayer.setMap(null);
		}
	});
});