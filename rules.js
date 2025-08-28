
function validateData(data) {
    const rowErrors = {};
    const corrected = [];
    const summaryCounts = {};

    const reasonNotTagged = ["Not accessible", "Not safe to access", "In use", "Other"];
    const assetStatusVals = ["In-Service","Out-Of-Service","Stand-By","Emergency Use Only","Abandoned In Place","Seasonally In-Service","Back-Up","Removed from Facility","Critical Spare","Surplus"];
    const assetRecordStatusVals = ["Active","In-Active"];
    const caAgeVals = ["New less than 5 years old","Refurbished within 5 years","Refurbished or installed between 5 and 10 years ago","Refurbished or installed more than 10 years ago"];
    const assetConditionVals = ["5 – Excellent","4 – Good","3 – Average","2 – Poor","1 – Crisis"];
    const caEnvVals = ["Clean, temperate, dry","Wide variation in temp/humidity/dust","Extremes of temperature","Liable to extreme dust or flooding"];
    const caCapacityUnitVals = ["AMP","BTU","CFM","GAL","GPM","HP","kVA","KW","Ln.Ft.","MBH","MW","N/A","Other (List in Comments)","PSI","SCFM","Sq.Ft.","TON","V"];

    function addRowError(rowNum, msg, field){
        if(!rowErrors[rowNum]) rowErrors[rowNum] = [];
        rowErrors[rowNum].push(msg);
        const key = field+"-Error";
        summaryCounts[key] = (summaryCounts[key]||0)+1;
    }

    data.forEach((row, idx) => {
        let correctedRow = {...row};
        const rowNum = idx+2;

        if(!row["Site Name"]) { addRowError(rowNum,"Site Name blank","Site Name"); }

        if(row["Status"]) {
            const val = row["Status"].trim().toLowerCase();
            if(val === "online" || val === "offline") {
                correctedRow["Status"] = val.charAt(0).toUpperCase()+val.slice(1);
            } else { addRowError(rowNum,`Invalid Status ${row["Status"]}`,"Status"); }
        } else { addRowError(rowNum,"Status blank","Status"); }

        if(!row["TagID"] && !row["Reason Not Tagged"]) {
            addRowError(rowNum,"TagID and Reason Not Tagged both blank","Reason Not Tagged");
        }
        if(row["Reason Not Tagged"]) {
            if(!reasonNotTagged.map(v=>v.toLowerCase()).includes(row["Reason Not Tagged"].toLowerCase())) {
                addRowError(rowNum,`Invalid Reason Not Tagged ${row["Reason Not Tagged"]}`,"Reason Not Tagged");
            }
        }

        if(row["att_Asset Status"]) {
            if(!assetStatusVals.map(v=>v.toLowerCase()).includes(row["att_Asset Status"].toLowerCase())) {
                addRowError(rowNum,`Invalid Asset Status ${row["att_Asset Status"]}`,"Asset Status");
            }
        } else { addRowError(rowNum,"Asset Status blank","Asset Status"); }

        if(row["att_Asset Record Status"]) {
            if(!assetRecordStatusVals.map(v=>v.toLowerCase()).includes(row["att_Asset Record Status"].toLowerCase())) {
                addRowError(rowNum,`Invalid Asset Record Status ${row["att_Asset Record Status"]}`,"Asset Record Status");
            }
        } else { addRowError(rowNum,"Asset Record Status blank","Asset Record Status"); }

        if(row["att_In-Service Date"]) {
            const d = row["att_In-Service Date"];
            if(!/^\d{2}\/\d{2}\/\d{4}$/.test(d)) { addRowError(rowNum,`Invalid In-Service Date ${d}`,"In-Service Date"); }
        }

        if(row["att_In-Service Date"] && !row["att_CA-Age"]) {
            addRowError(rowNum,"CA-Age blank but In-Service Date present","CA-Age");
        }
        if(row["att_CA-Age"]) {
            if(!caAgeVals.map(v=>v.toLowerCase()).includes(row["att_CA-Age"].toLowerCase())) {
                addRowError(rowNum,`Invalid CA-Age ${row["att_CA-Age"]}`,"CA-Age");
            }
        }

        if(!row["att_CA-Condition"]) { addRowError(rowNum,"CA-Condition blank","CA-Condition"); }

        if(row["att_CA-Condition"] && !row["att_Asset Condition"]) {
            addRowError(rowNum,"Asset Condition blank with CA-Condition present","Asset Condition");
        }
        if(row["att_Asset Condition"]) {
            if(!assetConditionVals.map(v=>v.toLowerCase()).includes(row["att_Asset Condition"].toLowerCase())) {
                addRowError(rowNum,`Invalid Asset Condition ${row["att_Asset Condition"]}`,"Asset Condition");
            }
        }

        if(row["att_CA-Environment"]) {
            if(!caEnvVals.map(v=>v.toLowerCase()).includes(row["att_CA-Environment"].toLowerCase())) {
                addRowError(rowNum,`Invalid CA-Environment ${row["att_CA-Environment"]}`,"CA-Environment");
            }
        } else { addRowError(rowNum,"CA-Environment blank","CA-Environment"); }

        if(row["att_Capacity Qty"] && !row["att_Capacity Unit"]) {
            addRowError(rowNum,"Capacity Qty present but Unit blank","CA-Capacity Unit");
        }
        if(row["att_Capacity Unit"]) {
            if(!caCapacityUnitVals.map(v=>v.toLowerCase()).includes(row["att_Capacity Unit"].toLowerCase())) {
                addRowError(rowNum,`Invalid Capacity Unit ${row["att_Capacity Unit"]}`,"CA-Capacity Unit");
            }
        }

        const imgCount = ["Image","Image 2","Image 3","Image 4","Image 5"].filter(c=>row[c]).length;
        if(imgCount < 3) { addRowError(rowNum,`Only ${imgCount} images provided; minimum 3 required`,"Images"); }
        if(row["Asset Description"] && /(panelboard|switchgear|switchboard)/i.test(row["Asset Description"])) {
            if(imgCount < 5) { addRowError(rowNum,`Only ${imgCount} images for Panelboard; 5 required`,"Images"); }
        }

        corrected.push(correctedRow);
    });

    return {rowErrors,corrected,summaryCounts};
}

function renderSummary(summaryCounts){
    const ctx = document.getElementById('summaryChart').getContext('2d');
    const labels = Object.keys(summaryCounts);
    const data = Object.values(summaryCounts);
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Validation Issues',
                data: data,
                backgroundColor: 'rgba(255,99,132,0.6)'
            }]
        },
        options: { responsive:true, scales:{y:{beginAtZero:true}} }
    });
}

document.getElementById('validateBtn').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
        alert('Please upload a CSV or XLSX file first.');
        return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const sheetName = workbook.SheetNames[0];
        const ws = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(ws,{defval:""});
        const result = validateData(jsonData);
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = "<h3>Validation Results (Grouped by Row)</h3>";
        for(const rowNum in result.rowErrors){
            resultsDiv.innerHTML += `<p><b>Row ${rowNum}</b></p><ul>`+
                result.rowErrors[rowNum].map(e=>"<li>"+e+"</li>").join("")+
                "</ul>";
        }
        renderSummary(result.summaryCounts);
        const newSheet = XLSX.utils.json_to_sheet(result.corrected);
        const newWB = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWB, newSheet, "Corrected");
        const wbout = XLSX.write(newWB,{bookType:'xlsx',type:'array'});
        const blob = new Blob([wbout], {type:"application/octet-stream"});
        const url = URL.createObjectURL(blob);
        const dl = document.getElementById('downloadLink');
        dl.href = url;
        dl.download = "corrected.xlsx";
        dl.style.display="block";
        dl.textContent="Download Corrected File";
    };
    reader.readAsArrayBuffer(file);
});
