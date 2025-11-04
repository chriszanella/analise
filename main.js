class DashboardChart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.chart = null;
        this.chartId = this.getAttribute('chart-id');
        this.chartTitle = this.getAttribute('chart-title');
    }

    connectedCallback() {
        this.render();
        this.loadChartData('monthly'); // Initial data load
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .chart-title {
                    font-size: 1.2rem;
                    font-weight: 500;
                    margin-bottom: 15px;
                }
            </style>
            <div class="chart-wrapper">
                <h3 class="chart-title">${this.chartTitle}</h3>
                <div id="${this.chartId}"></div>
            </div>
        `;
    }

    // NOTE: This function now uses hardcoded sample data.
    // It no longer fetches from a server.
    async loadChartData(period) {
        // Sample data mimicking the structure from a real backend
        const sampleData = {
            "dailyEntries": {
                "2024-01-15": 5, "2024-01-22": 8, "2024-02-05": 12, "2024-02-10": 7,
                "2024-03-03": 15, "2024-03-12": 9, "2024-04-18": 20,
            },
            "dailyExits": {
                "2024-01-18": 2, "2024-02-09": 4, "2024-02-15": 3,
                "2024-03-10": 6, "2024-03-20": 5,
            }
        };

        let sourceData;
        if (this.chartId === 'chart-new-members') {
            sourceData = sampleData.dailyEntries;
        } else if (this.chartId === 'chart-members-left') {
            sourceData = sampleData.dailyExits;
        }

        const processedData = this.processDataForPeriod(sourceData, period);

        const options = {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: { show: false },
                animations: { enabled: true }
            },
            series: [{
                name: this.chartTitle,
                data: processedData.series
            }],
            xaxis: {
                categories: processedData.categories
            },
            colors: [this.chartId === 'chart-new-members' ? '#2ecc71' : '#e74c3c'],
            dataLabels: { enabled: false }
        };

        if (this.chart) {
            this.chart.updateOptions(options);
        } else {
            this.chart = new ApexCharts(this.shadowRoot.querySelector(`#${this.chartId}`), options);
            this.chart.render();
        }
    }

    processDataForPeriod(dailyData, period) {
        const currentYear = new Date().getFullYear();

        if (period === 'daily') {
            const sortedDates = Object.keys(dailyData).sort();
            const categories = sortedDates.map(date => new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            const series = sortedDates.map(date => dailyData[date]);
            return { categories, series };
        }

        if (period === 'monthly') {
             const monthly = {
                'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0, 
                'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
            };
            for (const date in dailyData) {
                const recordDate = new Date(date + 'T00:00:00');
                if (recordDate.getFullYear() === currentYear) {
                    const month = recordDate.toLocaleString('en-US', { month: 'short' });
                    if (monthly.hasOwnProperty(month)) {
                        monthly[month] += dailyData[date];
                    }
                }
            }
            return {
                categories: Object.keys(monthly),
                series: Object.values(monthly)
            };
        }

        if (period === 'yearly') {
            const yearly = {};
            for (const date in dailyData) {
                const year = new Date(date + 'T00:00:00').getFullYear();
                if (!yearly[year]) {
                    yearly[year] = 0;
                }
                yearly[year] += dailyData[date];
            }
            return {
                categories: Object.keys(yearly).sort(),
                series: Object.keys(yearly).sort().map(year => yearly[year])
            };
        }

        return { categories: [], series: [] };
    }
}

customElements.define('dashboard-chart', DashboardChart);

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const charts = document.querySelectorAll('dashboard-chart');

    filterButtons.forEach(button => {
        if(button.dataset.period === 'monthly') {
            button.classList.add('active');
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const period = button.dataset.period;
            charts.forEach(chart => {
                chart.loadChartData(period);
            });
        });
    });
});
