<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>أسعار العملات العالمية</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f4f4f4;
        }
        h1 {
            color: #333;
        }
        table {
            width: 50%;
            margin: 20px auto;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
        }
        th {
            background-color: #007BFF;
            color: white;
        }
        #countdown {
            font-size: 18px;
            margin-top: 10px;
        }
        select, input, button {
            margin: 10px;
            padding: 8px;
            font-size: 16px;
        }
        .flag {
            width: 20px;
            height: 15px;
            margin-right: 5px;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <h1>أسعار العملات العالمية (تحديث تلقائي)</h1>
    <div id="countdown">التحديث التالي خلال: <span id="timer">60</span> ثانية</div>
    
    <label for="amount">المبلغ:</label>
    <input type="number" id="amount" value="1">
    
    <label for="fromCurrency">من:</label>
    <select id="fromCurrency"></select>
    
    <label for="toCurrency">إلى:</label>
    <select id="toCurrency"></select>
    
    <button onclick="convertCurrency()">تحويل</button>
    <p id="conversionResult"></p>
    
    <table>
        <thead>
            <tr>
                <th>العملة</th>
                <th>السعر مقابل الدولار</th>
            </tr>
        </thead>
        <tbody id="currencyTable"></tbody>
    </table>
    
    <canvas id="currencyChart" width="400" height="200"></canvas>
    
    <script>
        const apiKey = "cur_live_JEAFpYNOXOvBF5fOoDe0Q5AJK3hxgcWCHAFUrb2w";
        const apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}`;
        let chart;
        let rates = {};

        async function fetchCurrencyRates() {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                rates = data.data;
                const majorCurrencies = Object.keys(rates);
                
                let tableContent = "";
                let labels = [];
                let values = [];
                
                majorCurrencies.forEach(currency => {
                    const flagUrl = `https://flagsapi.com/${currency.slice(0,2).toUpperCase()}/flat/32.png`;
                    tableContent += `<tr><td><img src='${flagUrl}' class='flag'>${currency}</td><td>${rates[currency].value.toFixed(4)}</td></tr>`;
                    labels.push(currency);
                    values.push(rates[currency].value);
                });
                
                document.getElementById("currencyTable").innerHTML = tableContent;
                updateChart(labels, values);
                populateCurrencyDropdowns(majorCurrencies);
            } catch (error) {
                console.error("خطأ في جلب البيانات:", error);
            }
        }
        
        function updateChart(labels, values) {
            const ctx = document.getElementById("currencyChart").getContext("2d");
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "السعر مقابل الدولار",
                        data: values,
                        backgroundColor: "rgba(0, 123, 255, 0.5)",
                        borderColor: "rgba(0, 123, 255, 1)",
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        function populateCurrencyDropdowns(currencies) {
            const fromDropdown = document.getElementById("fromCurrency");
            const toDropdown = document.getElementById("toCurrency");
            fromDropdown.innerHTML = "";
            toDropdown.innerHTML = "";
            currencies.forEach(currency => {
                const flagUrl = `https://flagsapi.com/${currency.slice(0,2).toUpperCase()}/flat/32.png`;
                fromDropdown.innerHTML += `<option value="${currency}"><img src='${flagUrl}' class='flag'>${currency}</option>`;
                toDropdown.innerHTML += `<option value="${currency}"><img src='${flagUrl}' class='flag'>${currency}</option>`;
            });
        }
        
        function convertCurrency() {
            const amount = document.getElementById("amount").value;
            const fromCurrency = document.getElementById("fromCurrency").value;
            const toCurrency = document.getElementById("toCurrency").value;
            
            if (rates[fromCurrency] && rates[toCurrency]) {
                const convertedAmount = (amount / rates[fromCurrency].value) * rates[toCurrency].value;
                document.getElementById("conversionResult").textContent = 
                    `${amount} ${fromCurrency} = ${convertedAmount.toFixed(4)} ${toCurrency}`;
            } else {
                document.getElementById("conversionResult").textContent = "خطأ في التحويل، تأكد من تحديث البيانات.";
            }
        }
        
        function startCountdown() {
            let counter = 60;
            const timerElement = document.getElementById("timer");
            setInterval(() => {
                counter--;
                if (counter <= 0) {
                    counter = 60;
                    fetchCurrencyRates();
                }
                timerElement.textContent = counter;
            }, 1000);
        }
        
        fetchCurrencyRates();
        startCountdown();
    </script>
</body>
</html>
