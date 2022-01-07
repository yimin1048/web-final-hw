window.onload = function(){
    let table = document.getElementById('table');
    let setDate = document.getElementById('setDate');
    let setType = document.getElementById('setType');
    let insert = document.getElementById('insert');
    let amount = document.getElementById('amount');
    let remove = document.getElementById('remove');

    insert.addEventListener('click', insertData);
    remove.addEventListener('click', removeData)
    makeTable();
}

function insertData(){
    var date = setDate.value.split('-');
    if(localStorage.getItem(date[0]+date[1]) != null && amount.value != '' && parseInt(amount.value) >= 0){
        const arrDay = JSON.parse(localStorage.getItem(date[0]+date[1]));
        if(setType.value == "in"){
            arrDay.day[parseInt(date[2],10)-1].income = amount.value;
            if(arrDay.day[parseInt(date[2],10)-1].expend == ''){
                arrDay.day[parseInt(date[2],10)-1].expend = '0';
            }
        }else{
            arrDay.day[parseInt(date[2],10)-1].expend = amount.value;
            if(arrDay.day[parseInt(date[2],10)-1].income == ''){
                arrDay.day[parseInt(date[2],10)-1].income = '0'
            }
        }
        localStorage.setItem(date[0]+date[1],JSON.stringify(arrDay));
    }else if(amount.value != '' && parseInt(amount.value) >= 0){
        var arrJson = '{"day":[';
        var maxDay = 0;
        var m = parseInt(date[1],10);
        var d = parseInt(date[2],10);
        if(m == 2){
            maxDay = 28;
        }else if(m == 8){
            maxDay = 31;
        }else{    
            if(m < 8){
                if(m%2 == 0){
                    maxDay = 30;
                }else{
                    maxDay = 31;
                }
            }else{
                if(m%2 == 0){
                    maxDay = 31;
                }else{
                    maxDay = 30;
                }
            }
        }
        for(var i=0;i<maxDay;i++){
            arrJson += '{';
            if(i+1 == d){
                if(setType.value == "in"){
                    arrJson += '"income":"' + amount.value + '",';
                    arrJson += '"expend":"0"}';
                }else{
                    arrJson += '"income":"0",';
                    arrJson += '"expend":"' + amount.value + '"}';
                }
            }else{
                arrJson += '"income":"",';
                arrJson += '"expend":""}';
            }
            if(i != maxDay-1){
                arrJson += ',';
            }
        }
        arrJson +=']}';
        localStorage.setItem(date[0]+date[1],arrJson);
    }else{
        alert("金額輸入錯誤");
    }
    makeTable();
}

function makeTable(){
    var tableObj = '';
    var c = 1;
    for(var i=1;i<13;i++){
        var m = '',s = 'btn-primary';
        if(i<10){
            m = '20220'+i.toString();
        }else{
            m = '2022'+i.toString();
        }      
        if(localStorage.getItem(m) != null){
            if(c%2 == 0){
                s = 'btn-success';
            }
            c++;
            tableObj += '<button type="button" class="btn '+ s +'" data-toggle="collapse" data-target="#t'+ m +'">2022年'+ i.toString() +'月</button>';
            tableObj += '<div id="t'+ m +'" class="collapse"><table class="table"><thead><tr><th>日期</th><th>收入</th><th>支出</th></tr></thead><tbody>';
            const arrDay = JSON.parse(localStorage.getItem(m));
            for(var j=0;j<arrDay.day.length;j++){
                if(arrDay.day[j].income != ''){
                    tableObj += '<tr><td>'+ (j+1).toString() +'日</td><td>'+ arrDay.day[j].income +'元</td><td>'+ arrDay.day[j].expend +'元</td></tr>';
                }
            }
            var sum = amountSum(arrDay);
            tableObj += '<tr><th></th><th>總收入: '+ sum[0].toString() +'元</th><th>總支出: '+ sum[1].toString() +'元</th></tr>';
            tableObj += '</tbody></table></div>'
        }
    }
    table.innerHTML = tableObj;
}

function amountSum(arr){
    var sum = new Array(2);
    sum[0] = 0; sum[1] = 0;
    for(var i=0;i<arr.day.length;i++){
        if(arr.day[i].income != ''){
            sum[0] += parseInt(arr.day[i].income,10);
            sum[1] += parseInt(arr.day[i].expend,10);
        }      
    }
    return sum;
}

function removeData(){
    var date = setDate.value.split('-');
    var d = parseInt(date[2]) - 1;
    if(localStorage.getItem(date[0]+date[1]) != null){
        const arrDay = JSON.parse(localStorage.getItem(date[0]+date[1]));
        console.log(arrDay.day[d]);
        if(setType.value == 'in'){
            if(arrDay.day[d].expend == '0'){
                arrDay.day[d].income = '';
                arrDay.day[d].expend = '';
            }else{
                arrDay.day[d].income = '0';
            }
        }else{
            if(arrDay.day[d].income == '0'){
                arrDay.day[d].expend = '';
                arrDay.day[d].income = '';
            }else{
                arrDay.day[d].expend = '0';
            }
        }
        localStorage.setItem(date[0]+date[1],JSON.stringify(arrDay));
        checkData(date[0]+date[1]);
    }
    makeTable();
}

function checkData(name){
    var c = 1;
    const arr = JSON.parse(localStorage.getItem(name));
    console.log(arr);
    for(var i=0;i<arr.day.length;i++){
        if(arr.day[i].income != ''){
            c = 0;
            break;
        }
    }
    if(c){
        console.log(c);
        localStorage.removeItem(name);
    }
}