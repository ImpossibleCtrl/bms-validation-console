
function validateData(data) {
    const errors = [];
    const warnings = [];
    const corrected = [];
    const summaryCounts = {};

    const reasonNotTagged = ["Not accessible", "Not safe to access", "In use", "Other"];
    const assetStatusVals = ["In-Service","Out-Of-Service","Stand-By","Emergency Use Only","Abandoned In Place","Seasonally In-Service","Back-Up","Removed from Facility","Critical Spare","Surplus"];
    const assetRecordStatusVals = ["Active","In-Active"];
    const caAgeVals = ["New less than 5 years old","Refurbished within 5 years","Refurbished or installed between 5 and 10 years ago","Refurbished or installed more than 10 years ago"];
    const assetConditionVals = ["5 – Excellent","4 – Good","3 – Average","2 – Poor","1 – Crisis"];
    const caEnvVals = ["Clean, temperate, dry","Wide variation in temp/humidity/dust","Extremes of temperature","Liable to extreme dust or flooding"];
    const caCapacityUnitVals = ["AMP","BTU","CFM","GAL","GPM","HP","kVA","KW","Ln.Ft.","MBH","MW","N/A","Other (List in Comments)","PSI","SCFM","Sq.Ft.","TON","V"];

    function addSummary(field, type){
        const key = field+"-"+type;
        summaryCounts[key] = (summaryCounts[key]||0)+1;
    }

    data.forEach((row, idx) => {
        let correctedRow = {...row};
        const rowNum = idx+2;

        if(!row["Site Name"]) { errors.push(`Row ${rowNum}: Site Name blank`); addSummary("Site Name","Error"); }

        if(row["Status"]) {
            const val = row["Status"].trim().toLowerCase();
            if(val === "online" || val === "offline") {
                correctedRow["Status"] = val.charAt(0).toUpperCase()+val.slice(1);
            } else { errors.push(`Row ${rowNum}: Invalid Status ${row["Status"]}`); addSummary("Status","Error"); }
        } else { errors.push(`Row ${rowNum}: Status blank`); addSummary("Status","Error"); }

        if(!row["TagID"] && !row["Reason Not Tagged"]) {
            errors.push(`Row ${rowNum}: TagID and Reason Not Tagged both blank`); addSummary("Reason Not Tagged","Error");
        }
        if(row["Reason Not Tagged"]) {
            if(!reasonNotTagged.map(v=>v.toLowerCase()).includes(row["Reason Not Tagged"].toLowerCase())) {
                errors.push(`Row ${rowNum}: Invalid Reason Not Tagged ${row["Reason Not Tagged"]}`); addSummary("Reason Not Tagged","Error");
            }
        }

        if(row["att_Asset Status"]) {
            if(!assetStatusVals.map(v=>v.toLowerCase()).includes(row["att_Asset Status"].toLowerCase())) {
                errors.push(`Row ${rowNum}: Invalid Asset Status ${row["att_Asset Status"]}`); addSummary("Asset Status","Error");
            }
        } else { errors.push(`Row ${rowNum}: Asset Status blank`); addSummary("Asset Status","Error"); }

        if(row["att_Asset Record Status"]) {
            if(!assetRecordStatusVals.map(v=>v.toLowerCase()).includes(row["att_Asset Record Status"].toLowerCase())) {
                errors.push(`Row ${rowNum}: Invalid Asset Record Status ${row["att_Asset Record Status"]}`); addSummary("Asset Record Status","Error");
            }
        } else { errors.push(`Row ${rowNum}: Asset Record Status blank`); addSummary("Asset Record Status","Error"); }

        if(row["att_In-Service Date"]) {
            const d = row["att_In-Service Date"];
            if(!/^\d{2}\/\d{2}\/\d{4}$/.test(d)) { errors.push(`Row ${rowNum}: Invalid In-Service Date ${d}`); addSummary("In-Service Date","Error"); }
        }

        if(row["att_In-Service Date"] && !row["att_CA-Age"]) {
            errors.push(`Row ${rowNum}: CA-Age blank but In-Service Date present`); addSummary("CA-Age","Error");
        }
        if(row["att_CA-Age"]) {
            if(!caAgeVals.map(v=>v.toLowerCase()).includes(row["att_CA-Age"].toLowerCase())) {
                errors.push(`Row ${rowNum}: Invalid CA-Age ${row["att_CA-Age"]}`); addSummary("CA-Age","Error");
            }
        }

        if(!row["att_CA-Condition"]) { errors.push(`Row ${rowNum}: CA-Condition blank`); addSummary("CA-Condition","Error"); }

        if(row["att_CA-Condition"] && !row["att_Asset Condition"]) {
            errors.push(`Row ${rowNum}: Asset Condition blank with CA-Condition present`); addSummary("Asset Condition","Error");
        }
        if(row["att_Asset Condition"]) {
            if(!assetConditionVals.map(v=>v.toLowerCase()).includes(row["att_Asset Condition"].toLowerCase())) {
                errors.push(`Row ${rowNum}: Invalid Asset Condition ${row["att_Asset Condition"]}`); addSummary("Asset Condition","Error");
            }
        }

        if(row["att_CA-Environment"]) {
            if(!caEnvVals.map(v=>v.toLowerCase()).includes(row["att_CA-Environment"].toLowerCase())) {
                errors.push(`Row ${rowNum}: Invalid CA-Environment ${row["att_CA-Environment"]}`); addSummary("CA-Environment","Error");
            }
        } else { errors.push(`Row ${rowNum}: CA-Environment blank`); addSummary("CA-Environment","Error"); }

        if(row["att_Capacity Qty"] && !row["att_Capacity Unit"]) {
            errors.push(`Row ${rowNum}: Capacity Qty present but Unit blank`); addSummary("CA-Capacity Unit","Error");
        }
        if(row["att_Capacity Unit"]) {
            if(!caCapacityUnitVals.map(v=>v.toLowerCase()).includes(row["att_Capacity Unit"].toLowerCase())) {
                errors.push(`Row ${rowNum}: Invalid Capacity Unit ${row["att_Capacity Unit"]}`); addSummary("CA-Capacity Unit","Error");
            }
        }

        const imgCount = ["Image","Image 2","Image 3","Image 4","Image 5"].filter(c=>row[c]).length;
        if(imgCount < 3) { errors.push(`Row ${rowNum}: Only ${imgCount} images provided; minimum 3 required`); addSummary("Images","Error"); }
        if(row["Asset Description"] && /(panelboard|switchgear|switchboard)/i.test(row["Asset Description"])) {
            if(imgCount < 5) { errors.push(`Row ${rowNum}: Only ${imgCount} images for Panelboard; 5 required`); addSummary("Images","Error"); }
        }

        corrected.push(correctedRow);
    });

    return {errors,warnings,corrected,summaryCounts};
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
        resultsDiv.innerHTML = "<h3>Validation Results</h3>"+
            "<p>Errors: "+result.errors.length+"</p>"+
            "<ul>"+result.errors.map(e=>"<li>"+e+"</li>").join("")+"</ul>";
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
