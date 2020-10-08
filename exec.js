//정보보호 19-4기 박재용
//scorpion@dgu.ac.kr

document.querySelector("#send_inputs").addEventListener("click",start_search);


function send(){ //ip목록받아와서 어레이로 리턴해준다.
	var ih_ips = document.querySelector("#inputs").value+"\n0.0.0.0\n"; //받아온 입력값들.
	//console.log(document.querySelector("#inputs").innerHTML)
	console.log(ih_ips)
	preprocessed_ips = new Array();
	preprocessed_ips= ih_ips.split('\n')
	
	return preprocessed_ips;// 배열로 아이피 정리해서 반환해줌. 이건 추후에 결과를 도출할때와, 주소를 만들때 두가지의 쓰임새가 존재함. 
}
async function process(){
	processing_ips = send(); //IP리스트
	ip_count = processing_ips.length;
	base_url = `https://www.shodan.io/search?query=` //근간 URL
	regExp_4=/\<td\>Country\<\/td\>\n<th>([A-Za-z ]{0,})\<\/th\>/;//국가랑씨티
	regExp_2=/\<td\>City\<\/td\>\n<th>([A-Za-z]{0,})\<\/th\>\n\<\/tr\>\n\<tr\>\n\<td\>Country\<\/td\>\n<th>([A-Za-z]{0,})\<\/th\>/;//국가랑씨티
	regExp_3=/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9:]{8})/;//라스트업데이트
	regExp_1=/CVE-([0-9]{4})-([0-9])+</g;
	final_document=new String();
	parsed_time= new  Array();
	parsed_html = new Array();//문자열로 CVE리스트 순서대로 담아두기
	parsed_length = new Array();//몇개의 취약점이있는지 출력하기.
	parsed_Country_City = new Array();
	depicted_url = new Array(); //완성된 URL 
	err_index = new Array();
	for(i=0; i<ip_count;i++){
		depicted_url.push(base_url+processing_ips[i])
	}
	
	preparsed_html = new Array(); //웹페이지 크롤링 결과 저장
	
	
	
	for(i=0;i<ip_count-1;i++){
		
		//document.querySelector("#initialize_flag").innerHTML = "fetch Count : "+ i+"/"+ip_count
		await fetch(depicted_url[i],{credentials:"include"}).then(function(response){
		if(response.ok){
			
			err_index.push(0);
					   
			response.text().then(function(string_){preparsed_html.push(string_);

					
					prepar_3 = string_.match(regExp_3);	////라스트업데이트 [0] 	

					if(prepar_3!=null){
						parsed_time.push(prepar_3[0]);
						try{
							prepar_2 = string_.match(regExp_2); ///국가시티 [1][2]
							parsed_Country_City.push(prepar_2[1]+","+prepar_2[2]);}
						catch(e){
							prepar_2 = string_.match(regExp_4);
							parsed_Country_City.push("도시 정보 없음, "+prepar_2[1])
						}
						
						prepar_1 = string_.match(regExp_1);	
						if(prepar_1!=null){
							prepar1ength=prepar_1.length;
							parsed_length.push(prepar1ength);
							prepar_1 = prepar_1.join("").replace(/</g,"\n")
							parsed_html.push(prepar_1);
						}
						else{prepar_1=""
							 prepar1ength=0;
							parsed_html.push(prepar_1);
							parsed_length.push(0);
							}
						final_document = final_document + processing_ips[i-1]+"\n"+"취약점 개수 : "+prepar1ength +"\n"+"국가(도시) : "+prepar_2[1]+","+prepar_2[2]+"\n"+"최근 수정일자 : "+prepar_3[0] +"\n"  +prepar_1 +"\n\n"
					}
					else{
						parsed_Country_City.push("No information");
						parsed_time.push("No information");
						parsed_length.push(0);
						parsed_html.push("")	
						final_document = final_document + processing_ips[i-1]+"\n"+"취약점 개수 : "+"-" +"\n"+"국가(도시) : "+"No information" +"\n"+"최근 수정일자 : "+"No information" +"\n"  +"-" +"\n\n"
					}
				}
			)
		}
		else{
			err_index.push(1);
			parsed_length.push(-1);
			parsed_html.push("Status Not OK");
			preparsed_html.push("ERROR!")
			parsed_time.push("Status Not OK");
		
			final_document = final_document + processing_ips[i-1]+"\n"+"취약점 개수 : "+"ERR" +"\n"+"국가(도시) : "+"Status Not OK" +"\n"+"최근 수정일자 : "+"Status Not OK" +"\n"  +"Error" +"\n\n"
	
		}
			
		})

		
		document.querySelector("#jb").value =100*(i+1)/(ip_count);
	}
			
		
		
	return final_document;
		
	
}
async function start_search(){
	final_document = await process();	
	await saveToFile_Chrome("result.csv",final_document);
	document.querySelector("#jb").value =0;

}
		//preparsed_html.push(await fetch(depicted_url[i],{credentials:"include"}).then(r=>r.text()).then(setTimeout(function(){},1000)));err_index.push(0);
		
	
		
		
	//console.log(preparsed_html[i]); //text로 응답 받아왔음.
	
	
	/*for(i=0;i<ip_count;i++){
	if(err_index[i]!=1){
		try{prepar_1 = preparsed_html[i].match(regExp_1);}	
		catch(e){console.log(e)}
		if(prepar_1 !=null){parsed_length.push(prepar_1.length);
		prepar_1 = prepar_1.join("").replace(/</g,"\n")
		parsed_html.push(prepar_1);
		}
		else {parsed_length.push(0);parsed_html.push("")}
	}else{
		parsed_length.push(-1);parsed_html.push(preparsed_html[i]);
	}
	}	*/
		
		
		//cve와 태그들이 포함된 문자열로 가공됨. 이거 정규식 다시쓰는것부터 내일 야간에 시작하자.
	


function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}


function saveToFile_Chrome(fileName, content) {
    var blob = new Blob([content], { type: 'text/plain' });
    objURL = window.URL.createObjectURL(blob);
            
    // 이전에 생성된 메모리 해제
    if (window.__Xr_objURL_forCreatingFile__) {
        window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
    }
    window.__Xr_objURL_forCreatingFile__ = objURL;
    var a = document.createElement('a');
    a.download = fileName;
    a.href = objURL;
    a.click();
}
