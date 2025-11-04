async function fetchData() {
    const res = await fetch('/api/data')
    return res.json()
}

async function renderChart() {
    const data = await fetchData()

    const options = {
        chart: { type: 'line', height: 350},
        series: [
            { name: "Entradas", data:data.joins },
            { name: "Saidas", data:data.leaves }
        ],
        xaxis: { categories: data.labels }
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
}
renderChart();