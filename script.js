const audioLagu = new Audio('natal_lofi.mp3');
audioLagu.loop = true;
let musicStarted = false;
let currentGroup = "";

// Database karakter berdasarkan kode
const characterData = {
    "gtg25": ["Sam", "Amy", "Sera"],
    "mtg25": ["Grace", "Sera", "Tia", "Gita", "Chendy", "Cella"],
    "besdo25": ["Sera", "Kania", "Marsha"],
    "lise25": ["Sera", "Lina"]
};

function playMusicOnce() {
    if (!musicStarted) {
        audioLagu.play().then(() => {
            musicStarted = true;
        }).catch(() => {});
    }
}

function bukaInputKode() {
    playMusicOnce();
    document.getElementById('modalKode').style.display = 'flex';
    document.getElementById('inputNama').focus();
}

function tutupModal() {
    document.getElementById('modalKode').style.display = 'none';
}

function tutupKejutan() {
    document.getElementById('surprise-area').style.display = 'none';
    document.getElementById('mainUI').style.opacity = '1';
    document.getElementById('download-list').style.display = 'none';
}

function cekKode() {
    const nama = document.getElementById('inputNama').value.trim();
    const kode = document.getElementById('inputKode').value.toLowerCase();
    const surpriseText = "ini hadiah dari akuu, hope u like it (effort bikinnya hehe) ^^";
    
    playMusicOnce();

    if (!nama) {
        alert("Silakan isi nama kamu terlebih dahulu!");
        return;
    }

    if (characterData[kode]) {
        currentGroup = kode;
        let title = "UNTUK " + nama.toUpperCase();
        
        // Logika file video otomatis berdasarkan nama kode
        // Contoh: jika kode 'gtg25', maka file 'gtg25.mp4'
        let fileVideo = kode + ".mp4"; 

        tampilkanArt(title, surpriseText, fileVideo, true);
        setupDownloadList(kode);
    } else {
        alert("Kode salah! Coba cek petunjuknya lagi ya.");
    }
}

function setupDownloadList(kode) {
    const container = document.getElementById('list-items');
    container.innerHTML = "";
    const names = characterData[kode];
    
    names.forEach(name => {
        const link = document.createElement('a');
        link.className = "dl-item";
        link.innerText = "Download " + name;
        link.href = name + "_art.png"; 
        link.download = name + "_pixel_art.png";
        container.appendChild(link);
    });
}

function toggleDownloadList() {
    const list = document.getElementById('download-list');
    list.style.display = (list.style.display === 'block') ? 'none' : 'block';
}

function tampilkanArt(t, txt, fileUrl, isVideo = false) {
    document.getElementById('surprise-title').innerText = t;
    document.getElementById('surprise-text').innerText = txt;
    
    const artContainer = document.getElementById('surprise-gif');
    artContainer.innerHTML = isVideo ? 
        `<video src="${fileUrl}" autoplay loop muted playsinline></video>` : 
        `<img src="${fileUrl}" crossorigin="anonymous">`;
    
    tutupModal();
    document.getElementById('mainUI').style.opacity = '0.1';
    document.getElementById('surprise-area').style.display = 'block';
    
    for(let i=0; i<8; i++) setTimeout(createFirework, i * 250);
}

// Fitur Screenshot
async function takeScreenshot(isForSharing = false) {
    const btns = document.querySelector('.action-buttons');
    const close = document.querySelector('#surprise-area .close-btn');
    const dlList = document.getElementById('download-list');
    
    btns.style.display = 'none';
    close.style.display = 'none';
    dlList.style.display = 'none';

    const canvasSS = await html2canvas(document.body, { 
        useCORS: true, 
        backgroundColor: null 
    });
    
    btns.style.display = 'grid';
    close.style.display = 'block';

    if (isForSharing) return canvasSS.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.download = 'hadiah-natal-sera.png';
    link.href = canvasSS.toDataURL();
    link.click();
}

// Fitur Share
async function shareApp() {
    try {
        const imageDataUrl = await takeScreenshot(true);
        const blob = await (await fetch(imageDataUrl)).blob();
        const file = new File([blob], 'hadiah-natal-sera.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Hadiah Natal dari Sera',
                text: 'Lihat hadiah natal pixel art keren ini!'
            });
        } else if (navigator.share) {
            await navigator.share({
                title: 'Hadiah Natal dari Sera',
                text: 'Lihat hadiah natal pixel art keren ini!',
                url: window.location.href
            });
        } else {
            const dummy = document.createElement('input');
            document.body.appendChild(dummy);
            dummy.value = window.location.href;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            alert("Link disalin ke clipboard!");
        }
    } catch (err) {
        console.log("Sharing failed", err);
    }
}

// Background Animation (Snow & Fireworks)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [], snowflakes = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initSnow();
}
window.addEventListener('resize', resize);

function initSnow() {
    snowflakes = [];
    for (let i = 0; i < 100; i++) {
        snowflakes.push({ 
            x: Math.random() * canvas.width, 
            y: Math.random() * canvas.height, 
            r: Math.random() * 2 + 1, 
            speed: Math.random() * 0.5 + 0.2 
        });
    }
}

class PixelFirework {
    constructor(x, y, color) { 
        this.x = x; this.y = y; this.color = color; 
        this.velocity = { x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 6 }; 
        this.life = 100; 
    }
    draw() { 
        ctx.fillStyle = this.color; 
        ctx.fillRect(this.x, this.y, 3, 3); 
    }
    update() { 
        this.x += this.velocity.x; 
        this.y += this.velocity.y; 
        this.velocity.y += 0.1; 
        this.life -= 2; 
    }
}

function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height * 0.4);
    const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    for (let i = 0; i < 15; i++) particles.push(new PixelFirework(x, y, color));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    snowflakes.forEach(s => { 
        ctx.fillRect(s.x, s.y, s.r, s.r); 
        s.y += s.speed; 
        if (s.y > canvas.height) s.y = -5; 
    });
    
    particles.forEach((p, i) => { 
        if (p.life > 0) { p.update(); p.draw(); } 
        else particles.splice(i, 1); 
    });

    if (Math.random() < 0.01) createFirework();
    requestAnimationFrame(animate);
}

resize(); 
animate();
