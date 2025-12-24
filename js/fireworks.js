// ==========================================
// FIREWORKS ENGINE - Christmas 2025
// Created by: ToingDc
// ==========================================

class FireworksEngine {
    constructor() {
        this.canvas = document.getElementById('fireworks-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.rockets = [];
        this.isActive = false;
        this.animationId = null;
        
        // Sound effects
        this.launchSound = document.getElementById('firework-launch');
        this.explodeSound = document.getElementById('firework-explode');
        
        // Sound generator fallback
        this.soundGenerator = window.FireworkSoundGenerator ? new window.FireworkSoundGenerator() : null;
        
        // Set volume
        if (this.launchSound) this.launchSound.volume = 0.3;
        if (this.explodeSound) this.explodeSound.volume = 0.4;
        
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.isActive = true;
        this.canvas.classList.add('active');
        this.animate();
        
        // Launch multiple rockets
        this.launchMultipleRockets();
        
        // Auto stop after 30 seconds
        setTimeout(() => {
            if (this.isActive) {
                this.stop();
            }
        }, 30000);
    }

    stop() {
        this.isActive = false;
        this.canvas.classList.remove('active');
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Fade out existing particles
        setTimeout(() => {
            this.particles = [];
            this.rockets = [];
        }, 1000);
    }

    launchMultipleRockets() {
        if (!this.isActive) return;

        const launchCount = Math.floor(Math.random() * 3) + 2; // 2-4 rockets
        
        for (let i = 0; i < launchCount; i++) {
            setTimeout(() => {
                if (this.isActive) {
                    this.launchRocket();
                }
            }, i * 300);
        }

        // Continue launching while active
        if (this.isActive) {
            const nextDelay = Math.random() * 1000 + 1500; // 1.5-2.5 seconds
            setTimeout(() => this.launchMultipleRockets(), nextDelay);
        }
    }

    launchRocket() {
        const x = Math.random() * this.canvas.width;
        const y = this.canvas.height;
        const targetY = Math.random() * (this.canvas.height * 0.4) + 50;
        const hue = Math.random() * 360;

        const rocket = {
            x: x,
            y: y,
            targetY: targetY,
            hue: hue,
            velocity: Math.random() * 3 + 6,
            alpha: 1,
            trail: []
        };

        this.rockets.push(rocket);
        this.playSound('launch');
    }

    createExplosion(x, y, hue) {
        const particleCount = Math.floor(Math.random() * 50) + 80; // 80-130 particles
        const explosionType = Math.random();
        
        for (let i = 0; i < particleCount; i++) {
            let angle, velocity;
            
            if (explosionType > 0.7) {
                // Ring explosion
                angle = (Math.PI * 2 * i) / particleCount;
                velocity = Math.random() * 2 + 4;
            } else if (explosionType > 0.4) {
                // Random burst
                angle = Math.random() * Math.PI * 2;
                velocity = Math.random() * 6 + 2;
            } else {
                // Willow effect
                angle = (Math.PI * 2 * i) / particleCount;
                velocity = Math.random() * 3 + 3;
            }
            
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                alpha: 1,
                hue: hue + Math.random() * 40 - 20,
                size: Math.random() * 4 + 1,
                gravity: Math.random() * 0.05 + 0.02,
                friction: Math.random() * 0.02 + 0.96,
                brightness: Math.random() * 30 + 50
            };
            this.particles.push(particle);
        }

        // Play explosion sound
        this.playSound('explode');

        // Secondary explosions for bigger effect
        if (Math.random() > 0.6) {
            setTimeout(() => {
                this.createSecondaryExplosion(x, y, hue);
            }, 200);
        }
    }

    createSecondaryExplosion(x, y, hue) {
        const particleCount = 40;
        const secondaryHue = (hue + 180) % 360;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = Math.random() * 2 + 2;
            
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                alpha: 1,
                hue: secondaryHue + Math.random() * 30 - 15,
                size: Math.random() * 3 + 1,
                gravity: 0.03,
                friction: 0.97,
                brightness: Math.random() * 20 + 60
            };
            this.particles.push(particle);
        }
    }

    playSound(type) {
        try {
            if (type === 'launch') {
                if (this.launchSound && this.launchSound.readyState >= 2) {
                    const audio = this.launchSound.cloneNode();
                    audio.volume = 0.3;
                    audio.play().catch(() => {
                        if (this.soundGenerator) {
                            this.soundGenerator.playLaunchSound();
                        }
                    });
                } else if (this.soundGenerator) {
                    this.soundGenerator.playLaunchSound();
                }
            } else if (type === 'explode') {
                if (this.explodeSound && this.explodeSound.readyState >= 2) {
                    const audio = this.explodeSound.cloneNode();
                    audio.volume = 0.4;
                    audio.play().catch(() => {
                        if (this.soundGenerator) {
                            this.soundGenerator.playExplodeSound();
                        }
                    });
                } else if (this.soundGenerator) {
                    this.soundGenerator.playExplodeSound();
                }
            }
        } catch (e) {
            console.log('Sound error:', e);
        }
    }

    updateRockets() {
        for (let i = this.rockets.length - 1; i >= 0; i--) {
            const rocket = this.rockets[i];
            
            // Update position
            rocket.y -= rocket.velocity;
            rocket.velocity *= 0.98; // Slight deceleration
            
            // Add trail
            rocket.trail.push({ x: rocket.x, y: rocket.y, alpha: 1 });
            if (rocket.trail.length > 15) {
                rocket.trail.shift();
            }
            
            // Update trail alpha
            rocket.trail.forEach((point, index) => {
                point.alpha = index / rocket.trail.length;
            });
            
            // Check if reached target or velocity too low
            if (rocket.y <= rocket.targetY || rocket.velocity < 0.5) {
                this.createExplosion(rocket.x, rocket.y, rocket.hue);
                this.rockets.splice(i, 1);
            }
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update velocity
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity;
            
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Update alpha
            p.alpha -= 0.008;
            
            // Remove dead particles
            if (p.alpha <= 0 || p.y > this.canvas.height) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        // Fade effect for trail
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw rockets
        this.rockets.forEach(rocket => {
            // Draw trail
            rocket.trail.forEach((point, index) => {
                const alpha = (index / rocket.trail.length) * rocket.alpha;
                const size = (index / rocket.trail.length) * 3 + 1;
                
                this.ctx.fillStyle = `hsla(${rocket.hue}, 100%, 60%, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                this.ctx.fill();
            });

            // Draw rocket head
            this.ctx.fillStyle = `hsla(${rocket.hue}, 100%, 80%, ${rocket.alpha})`;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = `hsla(${rocket.hue}, 100%, 60%, 1)`;
            this.ctx.beginPath();
            this.ctx.arc(rocket.x, rocket.y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.shadowBlur = 0;

        // Draw particles
        this.particles.forEach(p => {
            this.ctx.fillStyle = `hsla(${p.hue}, 100%, ${p.brightness}%, ${p.alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Add glow effect
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = `hsla(${p.hue}, 100%, ${p.brightness}%, ${p.alpha * 0.5})`;
        });

        this.ctx.shadowBlur = 0;
    }

    animate() {
        if (!this.isActive && this.particles.length === 0 && this.rockets.length === 0) {
            return;
        }

        this.updateRockets();
        this.updateParticles();
        this.draw();

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// INITIALIZE FIREWORKS
// ==========================================
let fireworksEngine;

document.addEventListener('DOMContentLoaded', () => {
    fireworksEngine = new FireworksEngine();
    window.fireworksEngine = fireworksEngine; // Make it globally accessible
    
    const fireworksBtn = document.getElementById('fireworks-btn');
    
    if (fireworksBtn) {
        fireworksBtn.addEventListener('click', () => {
            fireworksBtn.classList.add('launching');
            
            if (fireworksEngine.isActive) {
                fireworksEngine.stop();
                fireworksBtn.innerHTML = '<span class="btn-icon">🎆</span><span class="btn-text">Pesta Kembang Api!</span>';
            } else {
                fireworksEngine.start();
                fireworksBtn.innerHTML = '<span class="btn-icon">⏸️</span><span class="btn-text">Stop Kembang Api</span>';
            }
            
            setTimeout(() => {
                fireworksBtn.classList.remove('launching');
            }, 500);
        });
    }
});

// ==========================================
// AUTO-LAUNCH FIREWORKS ON PAGE LOAD
// ==========================================
window.addEventListener('load', () => {
    // Auto launch on page load after 2 seconds
    setTimeout(() => {
        if (fireworksEngine && !fireworksEngine.isActive) {
            console.log('🎆 Welcome fireworks launching...');
            fireworksEngine.start();
            
            const btn = document.getElementById('fireworks-btn');
            if (btn) {
                btn.innerHTML = '<span class="btn-icon">⏸️</span><span class="btn-text">Stop Kembang Api</span>';
            }
            
            // Auto stop after 10 seconds
            setTimeout(() => {
                if (fireworksEngine.isActive) {
                    fireworksEngine.stop();
                    if (btn) {
                        btn.innerHTML = '<span class="btn-icon">🎆</span><span class="btn-text">Pesta Kembang Api!</span>';
                    }
                }
            }, 10000);
        }
    }, 2000);
});

// ==========================================
// CHECK FOR CHRISTMAS DAY
// ==========================================
function checkChristmasArrival() {
    const now = new Date();
    const christmas = new Date(now.getFullYear(), 11, 25);
    
    // Check if it's Christmas Day
    if (now.getMonth() === 11 && now.getDate() === 25) {
        // Check if we haven't celebrated yet today
        const celebratedToday = localStorage.getItem('christmas_celebrated_2025');
        const today = now.toDateString();
        
        if (celebratedToday !== today && now.getHours() === 0 && now.getMinutes() === 0) {
            localStorage.setItem('christmas_celebrated_2025', today);
            
            // It's Christmas! Launch mega fireworks
            if (fireworksEngine && !fireworksEngine.isActive) {
                fireworksEngine.start();
                
                setTimeout(() => {
                    alert('🎄 MERRY CHRISTMAS 2025! 🎄\n\nSelamat Natal! Semoga kebahagiaan selalu menyertai Anda! 🎆✨');
                }, 1000);
            }
        }
    }
}

// Check every minute
setInterval(checkChristmasArrival, 60000);
checkChristmasArrival(); // Initial check

console.log('🎆 Fireworks Engine loaded successfully!');
