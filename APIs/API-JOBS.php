<?php 
	$curlHandle = curl_init("https://api.bayt.com/api/cvs-search/?token=oL9Ou7vIsqUFexquVUcpP2PZOg5SEPIJ&company_token=lklJjMj6Ta2wCfk5dSXJ6cF8E2m9kWZ&company_id=1435096&position_keyword=manager&page=1");

	curl_setopt($curlHandle, CURLOPT_RETURNTRANSFER, 1);

	echo curl_exec($curlHandle);

    curl_close($curlHandle); 
?>