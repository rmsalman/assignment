<?php 
	$url = "https://api.bayt.com/api/view-cv/?token=oL9Ou7vIsqUFexquVUcpP2PZOg5SEPIJ&company_token=lklJjMj6Ta2wCfk5dSXJ6cF8E2m9kWZ&company_id=1435096&cv_id=".$_GET['cv_id']."&icode=".urldecode($_GET['icode']);
	$curlHandle = curl_init($url);
	curl_setopt($curlHandle, CURLOPT_RETURNTRANSFER, 1);

	$res = curl_exec($curlHandle);

	if($res == '{"status":"invalid_cv_icode"}') {
		// fake cv was created because API was not working correctly
		$myfile = fopen("fakecv.txt", "r") or die("Unable to open file!");
		echo fread($myfile,filesize("fakecv.txt"));
		fclose($myfile);
	}else {
		echo $res;
	}
	curl_close($curlHandle); 
?>