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
	depicted_url = new Array();
	final_document="";

	for(i=0; i<ip_count;i++){
		depicted_url.push(base_url+processing_ips[i])
	}
													
	preparsed_html = new Array(); //웹페이지 크롤링 결과 저장
	
	CountryAndCity = new Array();
	
	for(ipc=0;ipc<ip_count-1;ipc++){
		
		//document.querySelector("#initialize_flag").innerHTML = "fetch Count : "+ i+"/"+ip_count
		await fetch(depicted_url[ipc],{credentials:"include"}).then(function(response){
			console.log(ipc)
																
																
		if(response.ok){
			
			
				final_document+="IP: "+processing_ips[ipc]+"\n"	   
				response.text().then(function(string_){
			
				tempDoc = document.implementation.createHTMLDocument('temp')
				tempDoc.body.innerHTML=string_;
				// ip는 querySelectorAll(`body > div.container-fluid > div > div.host > div > div:nth-child(1) > div.page-header > h2`)[0].innerText.split('\n')[0]
				// 2열의 내용 b.querySelectorAll(`body > div.container-fluid > div > div.host > div > div:nth-child(1) > table > tbody > tr:nth-child(${i}) > th`)[0].innerText
				//preparsed_html.push(tempDoc);
				//body > div.container-fluid > div > div.host > div > div:nth-child(1) > div:nth-child(5) > table > tbody > tr:nth-child(1) > th
				for(j=1;j<8;j++){ 
					try{
						CountryOrCityOrUpdated=tempDoc.querySelector(`body > div.container-fluid > div > div.host > div > div:nth-child(1) > table > tbody > tr:nth-child(${j}) > td`).innerText
						if(CountryOrCityOrUpdated =="City"){
							final_document += "[City]: "+tempDoc.querySelector(`body > div.container-fluid > div > div.host > div > div:nth-child(1) > table > tbody > tr:nth-child(${j}) > th`).innerText+", "
						}
						else if(CountryOrCityOrUpdated =="Country"){
							final_document += "[Country]: "+tempDoc.querySelector(`body > div.container-fluid > div > div.host > div > div:nth-child(1) > table > tbody > tr:nth-child(${j}) > th`).innerText+"\n"
						}
						else if(CountryOrCityOrUpdated =="Last Update"){
							final_document += "[Last Update]: "+tempDoc.querySelector(`body > div.container-fluid > div > div.host > div > div:nth-child(1) > table > tbody > tr:nth-child(${j}) > th`).innerText+"\n"
						}

					}
					catch(e){
						j=8
					}
					
				}
				final_document+="[취약점 리스트]"+"\n"
				flag_count = 0;
				for(j=1;j<1000;j++){ 
					try{
						final_document+=tempDoc.querySelector(`body > div.container-fluid > div > div.host > div > div:nth-child(1) > div:nth-child(5) > table > tbody > tr:nth-child(${j}) > th`).innerText+"\n"
						flag_count = j;
					}
					catch(e){
						final_document+="취약점 갯수: "+flag_count+"개"+"\n\n\n"
						j=1000;						
					}
				}
			}
			
			)
		}
		else{
			//preparsed_html.push(-1);
		final_document+="IP: "+processing_ips[ipc]+" [질의 오류]\n"	   
		}
		
		document.querySelector("#jb").value =100*(ipc+1)/(ip_count-1);	
		})

													
		
	}
			document.querySelector("#jb").value =100;
		
		
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
