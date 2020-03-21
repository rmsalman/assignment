<?php 
	$experience = (isset($_GET['experience']) ? '&experience='.urldecode($_GET['experience']) : '');
	$position_keyword = (isset($_GET['position_keyword']) ? '&position_keyword='.urldecode($_GET['position_keyword']) : '&position_keyword=manager');
	$page = (isset($_GET['page']) ? urldecode($_GET['page']) : '1');
	
	$curlHandle = curl_init("https://api.bayt.com/api/cvs-search/?token=oL9Ou7vIsqUFexquVUcpP2PZOg5SEPIJ&company_token=lklJjMj6Ta2wCfk5dSXJ6cF8E2m9kWZ&company_id=1435096&page=".$page.$position_keyword.$experience);
	
	curl_setopt($curlHandle, CURLOPT_RETURNTRANSFER, 1);

	echo curl_exec($curlHandle);

    curl_close($curlHandle); 
?>