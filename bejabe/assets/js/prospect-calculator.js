import ApexCharts from 'https://cdn.jsdelivr.net/npm/apexcharts/dist/apexcharts.esm.js';

// Test sederhana untuk verifikasi import
console.log('ApexCharts version:', ApexCharts.version);
console.log('ApexCharts loaded successfully:', typeof ApexCharts === 'function');

// Test membuat grafik sederhana
const testChart = () => {
    const testContainer = document.createElement('div');
    testContainer.id = 'test-chart';
    document.body.appendChild(testContainer);

    const options = {
        series: [{
            name: 'Test',
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
        }],
        chart: {
            type: 'line',
            height: 200
        },
        xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        }
    };

    const chart = new ApexCharts(testContainer, options);
    chart.render();
    
    return chart;
};

// Jalankan test saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    testChart();
    new ProspectCalculator('prospect-calc');
});

class ProspectCalculator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentStep = 1;
        this.totalSteps = 3;
        this.data = {};
        
        if (!this.container) {
            console.error(`Container dengan ID ${containerId} tidak ditemukan`);
            return;
        }

        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.createStyles();
        this.createForm();
        this.addEventListeners();
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .prospect-calc {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                font-family: Arial, sans-serif;
            }
            .step {
                display: none;
                padding: 20px;
                background: #f9f9f9;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            .step.active {
                display: block;
            }
            .form-group {
                margin-bottom: 15px;
            }
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            .form-group input {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            .navigation {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }
            .btn {
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            }
            .btn-primary {
                background: #007bff;
                color: white;
            }
            .btn-secondary {
                background: #6c757d;
                color: white;
            }
            .progress-bar {
                height: 5px;
                background: #ddd;
                margin-bottom: 20px;
                border-radius: 5px;
            }
            .progress {
                height: 100%;
                background: #007bff;
                border-radius: 5px;
                transition: width 0.3s ease;
            }
            .chart-container {
                margin-top: 20px;
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
        `;
        document.head.appendChild(style);
    }

    createForm() {
        // Progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const progress = document.createElement('div');
        progress.className = 'progress';
        progress.style.width = `${(this.currentStep / this.totalSteps) * 100}%`;
        progressBar.appendChild(progress);
        this.container.appendChild(progressBar);

        // Steps
        const steps = [
            this.createStep1(),
            this.createStep2(),
            this.createStep3()
        ];

        steps.forEach((step, index) => {
            step.className = `step ${index === 0 ? 'active' : ''}`;
            this.container.appendChild(step);
        });

        // Navigation buttons
        const navigation = document.createElement('div');
        navigation.className = 'navigation';
        navigation.innerHTML = `
            <button class="btn btn-secondary" id="prevBtn" style="display: none;">Sebelumnya</button>
            <button class="btn btn-primary" id="nextBtn">Selanjutnya</button>
        `;
        this.container.appendChild(navigation);
    }

    createStep1() {
        const step = document.createElement('div');
        step.innerHTML = `
            <h2>Step 1: Informasi Dasar</h2>
            <div class="form-group">
                <label for="name">Nama Lengkap</label>
                <input type="text" id="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" required>
            </div>
            <div class="form-group">
                <label for="phone">Nomor Telepon</label>
                <input type="tel" id="phone" required>
            </div>
        `;
        return step;
    }

    createStep2() {
        const step = document.createElement('div');
        step.innerHTML = `
            <h2>Step 2: Informasi Keuangan</h2>
            <div class="form-group">
                <label for="income">Pendapatan Bulanan (Rp)</label>
                <input type="number" id="income" required>
            </div>
            <div class="form-group">
                <label for="expenses">Pengeluaran Bulanan (Rp)</label>
                <input type="number" id="expenses" required>
            </div>
        `;
        return step;
    }

    createStep3() {
        const step = document.createElement('div');
        step.innerHTML = `
            <h2>Step 3: Ringkasan</h2>
            <div id="summary"></div>
            <div id="chart" class="chart-container"></div>
        `;
        return step;
    }

    addEventListeners() {
        const prevBtn = this.container.querySelector('#prevBtn');
        const nextBtn = this.container.querySelector('#nextBtn');

        prevBtn.addEventListener('click', () => this.prevStep());
        nextBtn.addEventListener('click', () => this.nextStep());
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateSteps();
        }
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            if (this.validateStep()) {
                this.saveStepData();
                this.currentStep++;
                this.updateSteps();
            }
        } else {
            this.calculate();
        }
    }

    validateStep() {
        const currentStep = this.container.querySelector('.step.active');
        const inputs = currentStep.querySelectorAll('input[required]');
        
        for (const input of inputs) {
            if (!input.value) {
                alert('Mohon lengkapi semua field yang diperlukan');
                return false;
            }
        }
        return true;
    }

    saveStepData() {
        const currentStep = this.container.querySelector('.step.active');
        const inputs = currentStep.querySelectorAll('input');
        
        inputs.forEach(input => {
            this.data[input.id] = input.value;
        });
    }

    updateSteps() {
        const steps = this.container.querySelectorAll('.step');
        const progress = this.container.querySelector('.progress');
        const prevBtn = this.container.querySelector('#prevBtn');
        const nextBtn = this.container.querySelector('#nextBtn');

        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });

        progress.style.width = `${(this.currentStep / this.totalSteps) * 100}%`;
        prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        nextBtn.textContent = this.currentStep === this.totalSteps ? 'Hitung' : 'Selanjutnya';

        if (this.currentStep === this.totalSteps) {
            this.updateSummary();
            this.createChart();
        }
    }

    updateSummary() {
        const summary = this.container.querySelector('#summary');
        const savings = this.data.income - this.data.expenses;
        
        summary.innerHTML = `
            <div class="form-group">
                <h3>Ringkasan Informasi</h3>
                <p><strong>Nama:</strong> ${this.data.name}</p>
                <p><strong>Email:</strong> ${this.data.email}</p>
                <p><strong>Telepon:</strong> ${this.data.phone}</p>
                <p><strong>Pendapatan Bulanan:</strong> Rp ${this.formatNumber(this.data.income)}</p>
                <p><strong>Pengeluaran Bulanan:</strong> Rp ${this.formatNumber(this.data.expenses)}</p>
                <p><strong>Tabungan Bulanan:</strong> Rp ${this.formatNumber(savings)}</p>
            </div>
        `;
    }

    createChart() {
        const chartContainer = document.getElementById('chart');
        
        const options = {
            series: [
                {
                    name: 'Based upon Gasoline',
                    data: [
                        [1, 109500], [2, 114975], [3, 120724], [4, 126760], [5, 133098], 
                        [6, 139753], [7, 146740], [8, 154077], [9, 161781], [10, 169870]
                    ]
                },
                {
                    name: 'Y-Green Gasoline',
                    data: [
                        [1, 70504], [2, 73979], [3, 77728], [4, 81764], [5, 86102],
                        [6, 100757], [7, 146740], [8, 154077], [9, 161781], [10, 169870]
                    ]
                },
                {
                    name: 'Based upon Electricity',
                    data: [
                        [1, 59130], [2, 62087], [3, 65191], [4, 68450], [5, 71873],
                        [6, 75467], [7, 79240], [8, 83202], [9, 87362], [10, 91730]
                    ]
                },
                {
                    name: 'Y-Green Electricity',
                    data: [
                        [1, 20396], [2, 23090], [3, 26194], [4, 29454], [5, 32876],
                        [6, 36470], [7, 79240], [8, 83202], [9, 87362], [10, 91730]
                    ]
                }
            ],
            chart: {
                type: 'line',
                height: 400,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
            },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            markers: {
                size: 4
            },
            xaxis: {
                type: 'numeric',
                title: {
                    text: 'Tahun'
                },
                labels: {
                    formatter: function(val) {
                        return 'Tahun ' + val;
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Nilai'
                },
                labels: {
                    formatter: function(val) {
                        return new Intl.NumberFormat('id-ID').format(val);
                    }
                }
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return new Intl.NumberFormat('id-ID').format(val);
                    }
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'center'
            },
            colors: ['#FF4560', '#00E396', '#008FFB', '#FEB019'],
            title: {
                text: 'Perbandingan Data',
                align: 'center',
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold'
                }
            }
        };

        const chart = new ApexCharts(chartContainer, options);
        chart.render();
    }

    calculate() {
        const savings = this.data.income - this.data.expenses;
        alert(`Perhitungan selesai!\nTabungan bulanan Anda: Rp ${this.formatNumber(savings)}`);
    }

    formatNumber(num) {
        return new Intl.NumberFormat('id-ID').format(num);
    }
} 