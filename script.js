// Konfigurasi Audio
const audioLagu = new Audio('natal_lofi.mp3');
audioLagu.loop = true;
let musicStarted = false;

// Fungsi untuk memutar musik pada interaksi pertama
function playMusicOnce() {
    if (!musicStarted) {
        audioLagu.play().then(() => {
            musicStarted = true;
        }).catch(err => {
            console.log("Menunggu interaksi pengguna untuk memutar audio.");
        });
    }
}

function bukaInputKode() {
    playMusicOnce();
    document.getElementById('modalKode').style.display = 'flex';
    document.getElementById('inputKode').focus();
}

function tutupModal() {
    document.getElementById('modalKode').style.display = 'none';
}

function tutupKejutan() {
    document.getElementById('surprise-area').style.display = 'none';
    document.getElementById('mainUI').style.opacity = '1';
}

function cekKode() {
    const kode = document.getElementById('inputKode').value.toLowerCase();
    const surpriseText = "ini hadiah dari akuu, hope u like it (effort bikinnya hehe) ^^";

    playMusicOnce();

    if (kode === "gtg25") {
        tampilkanArt("UNTUK GTG!", surpriseText, "placeholder_gtg.png");
    } 
    else if (kode === "mtg25") {
        tampilkanArt("SEMANGAT MTG!", surpriseText, "placeholder_mtg.png");
    }
    else if (kode === "seli25") {
        tampilkanArt("SPECIAL FOR SELI", surpriseText, "lina_ser.mp4", true);
    }
    else {
        alert("Kodenya salah!");
    }
}

function tampilkanArt(t, txt, fileUrl, isVideo = false) {
    document.getElementById('surprise-title').innerText = t;
    document.getElementById('surprise-text').innerText = txt;
    
    const artContainer = document.getElementById('surprise-gif');
    if (isVideo) {
        artContainer.innerHTML = `<video src="${fileUrl}" autoplay loop muted playsinline></video>`;
    } else {
        artContainer.innerHTML = `<img src="${fileUrl}" crossorigin="anonymous">`;
    }
    
    tutupModal();
    document.getElementById('mainUI').style.opacity = '0.1';
    document.getElementById('surprise-area').style.display = 'block';
    
    // Trigger kembang api
    for(let i=0; i<8; i++) setTimeout(createFirework, i * 250);
}

// Fitur Screenshot
async function takeScreenshot() {
    const btns = document.querySelector('.action-buttons');
    const close = document.querySelector('#surprise-area .close-btn');
    
    btns.style.display = 'none';
    close.style.display = 'none';

    try {
        const canvasSS = await html2canvas(document.body, { 
            useCORS: true,
            backgroundColor: null 
        });
        
        const link = document.createElement('a');
        link.download = 'hadiah-natal-sera.png';
        link.href = canvasSS.toDataURL();
        link.click();
    } catch (e) {
        console.error("Gagal mengambil screenshot", e);
    } finally {
        btns.style.display = 'flex';
        close.style.display = 'block';
    }
}

// Fitur Share
function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: 'Hadiah Natal dari Sera',
            text: 'Lihat hadiah natal pixel art keren ini!',
            url: window.location.href
        });
    } else {
        alert("Fitur share tidak didukung di browser ini.");
    }
}

// Logika Canvas (Salju & Kembang Api)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let snowflakes = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initSnow();
}
window.addEventListener('resize', resize);

function initSnow() {
    snowflakes = [];
    for (let i = 0; i < 120; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 3 + 1,
            speed: Math.random() * 0.7 + 0.3
        });
    }
}

class PixelFirework {
    constructor(x, y, color) {
        this.x = x; this.y = y; this.color = color;
        this.velocity = { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 };
        this.life = 100;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 4, 4);
    }
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += 0.15;
        this.life -= 2;
    }
}

function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height * 0.5);
    const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    for (let i = 0; i < 20; i++) particles.push(new PixelFirework(x, y, color));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render Salju
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    snowflakes.forEach(s => {
        ctx.fillRect(s.x, s.y, s.r, s.r);
        s.y += s.speed;
        if (s.y > canvas.height) s.y = -10;
    });

    // Render Kembang Api
    particles.forEach((p, i) => {
        if (p.life > 0) { p.update(); p.draw(); }
        else particles.splice(i, 1);
    });

    if (Math.random() < 0.015) createFirework();
    requestAnimationFrame(animate);
}

// Inisialisasi
resize();
animate();
