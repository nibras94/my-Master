const schematics = {
    iphone12: {
        title: "مخطط آيفون 12",
        description: "مخطط تفصيلي لهاتف آيفون 12 يوضح المكونات الداخلية الرئيسية",
        image: "schematics/iphone12.jpg"
    },
    iphone13: {
        title: "مخطط آيفون 13",
        description: "مخطط تفصيلي لهاتف آيفون 13 يوضح المكونات الداخلية الرئيسية",
        image: "schematics/iphone13.jpg"
    },
    iphone14: {
        title: "مخطط آيفون 14",
        description: "مخطط تفصيلي لهاتف آيفون 14 يوضح المكونات الداخلية الرئيسية",
        image: "schematics/iphone14.jpg"
    },
    iphone15: {
        title: "مخطط آيفون 15",
        description: "مخطط تفصيلي لهاتف آيفون 15 يوضح المكونات الداخلية الرئيسية",
        image: "schematics/iphone15.jpg"
    }
};

const modelSelector = document.getElementById('modelSelector');
const schematicDisplay = document.getElementById('schematicDisplay');
const modelTitle = document.getElementById('modelTitle');
const modelDescription = document.getElementById('modelDescription');

modelSelector.addEventListener('change', (e) => {
    const selectedModel = e.target.value;
    
    if (selectedModel) {
        const schematic = schematics[selectedModel];
        
        // Update the display
        schematicDisplay.innerHTML = `
            <img src="${schematic.image}" alt="${schematic.title}" 
                 onerror="this.onerror=null; this.src='placeholder.jpg'; this.alt='المخطط غير متوفر حالياً'">
        `;
        
        modelTitle.textContent = schematic.title;
        modelDescription.textContent = schematic.description;
    } else {
        // Reset to initial state
        schematicDisplay.innerHTML = '<p class="initial-text">الرجاء اختيار موديل الآيفون لعرض المخطط</p>';
        modelTitle.textContent = '';
        modelDescription.textContent = '';
    }
});

class SpeedTest {
    constructor() {
        this.currentSpeed = document.getElementById('current-speed');
        this.downloadSpeed = document.getElementById('download-speed');
        this.uploadSpeed = document.getElementById('upload-speed');
        this.pingElement = document.getElementById('ping');
        this.startButton = document.getElementById('start-test');
        this.testStatus = document.getElementById('test-status');
        this.progressBar = document.getElementById('progress-bar');
        this.progressFill = document.querySelector('.progress-fill');
        this.speedCircle = document.querySelector('.speed-circle');
        
        this.isRunning = false;
        this.downloadSize = 5242880; // 5MB in bytes
        this.imageAddr = "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg";
        
        this.startButton.addEventListener('click', () => this.startTest());
    }

    async startTest() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startButton.disabled = true;
        this.progressBar.style.display = 'block';
        this.resetUI();
        
        try {
            // Test ping
            this.updateStatus('قياس زمن الاستجابة...');
            this.updateProgress(10);
            await this.measurePing();

            // Test download
            this.updateStatus('قياس سرعة التحميل...');
            this.updateProgress(30);
            await this.measureDownload();

            // Test upload
            this.updateStatus('قياس سرعة الرفع...');
            this.updateProgress(70);
            await this.measureUpload();

            this.updateStatus('اكتمل الاختبار');
            this.updateProgress(100);
        } catch (error) {
            this.updateStatus('حدث خطأ في الاختبار');
            console.error('Speed test error:', error);
        }

        setTimeout(() => {
            this.progressBar.style.display = 'none';
            this.isRunning = false;
            this.startButton.disabled = false;
        }, 1000);
    }

    resetUI() {
        this.currentSpeed.textContent = '0';
        this.downloadSpeed.textContent = '-- Mbps';
        this.uploadSpeed.textContent = '-- Mbps';
        this.pingElement.textContent = '-- ms';
        this.progressFill.style.width = '0%';
        this.updateSpeedGauge(0);
    }

    updateStatus(status) {
        this.testStatus.textContent = status;
    }

    updateProgress(percent) {
        this.progressFill.style.width = `${percent}%`;
    }

    updateSpeedGauge(speed) {
        const maxSpeed = 100; // Maximum speed for gauge visualization
        const percentage = Math.min((speed / maxSpeed) * 100, 100);
        this.speedCircle.style.background = `conic-gradient(#2196F3 ${percentage}%, #e0e0e0 0%)`;
    }

    async measurePing() {
        const startTime = performance.now();
        try {
            await fetch('https://www.google.com/favicon.ico', { 
                mode: 'no-cors',
                cache: 'no-cache'
            });
            const endTime = performance.now();
            const ping = Math.round(endTime - startTime);
            this.pingElement.textContent = `${ping} ms`;
        } catch (error) {
            this.pingElement.textContent = 'خطأ';
            throw error;
        }
    }

    async measureDownload() {
        return new Promise((resolve, reject) => {
            const download = new Image();
            const startTime = performance.now();

            download.onload = () => {
                const endTime = performance.now();
                const duration = (endTime - startTime) / 1000;
                const bitsLoaded = this.downloadSize * 8;
                const speedBps = (bitsLoaded / duration).toFixed(2);
                const speedMbps = (speedBps / 1024 / 1024).toFixed(2);

                this.currentSpeed.textContent = speedMbps;
                this.downloadSpeed.textContent = `${speedMbps} Mbps`;
                this.updateSpeedGauge(speedMbps);
                resolve(speedMbps);
            };

            download.onerror = () => {
                this.downloadSpeed.textContent = 'خطأ';
                reject(new Error('Download test failed'));
            };

            const cacheBuster = `?nnn=${new Date().getTime()}`;
            download.src = this.imageAddr + cacheBuster;
        });
    }

    async measureUpload() {
        const data = new Blob([new ArrayBuffer(this.downloadSize)]);
        const startTime = performance.now();

        try {
            const stream = data.stream();
            const reader = stream.getReader();
            
            while (true) {
                const {done} = await reader.read();
                if (done) break;
            }

            const endTime = performance.now();
            const duration = (endTime - startTime) / 1000;
            const bitsLoaded = data.size * 8;
            const speedBps = (bitsLoaded / duration).toFixed(2);
            const speedMbps = (speedBps / 1024 / 1024).toFixed(2);

            this.currentSpeed.textContent = speedMbps;
            this.uploadSpeed.textContent = `${speedMbps} Mbps`;
            this.updateSpeedGauge(speedMbps);
            return speedMbps;
        } catch (error) {
            this.uploadSpeed.textContent = 'خطأ';
            throw error;
        }
    }
}

// Initialize speed test when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpeedTest();
});
