// ==========================================
// CUSTOM AUDIO GENERATOR - FALLBACK
// For when CDN audio doesn't load
// Created by: ToingDc
// ==========================================

class FireworkSoundGenerator {
    constructor() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            console.log('🔊 Audio Generator initialized');
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.initialized = false;
        }
    }

    playLaunchSound() {
        if (!this.initialized) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Whoosh sound
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1000, this.audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        } catch (e) {
            console.warn('Error playing launch sound:', e);
        }
    }

    playExplodeSound() {
        if (!this.initialized) return;

        try {
            // Create white noise for explosion
            const bufferSize = this.audioContext.sampleRate * 0.8;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            // Generate noise
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = this.audioContext.createBufferSource();
            noise.buffer = buffer;
            
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Boom effect
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(3000, this.audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.8);
            filter.Q.value = 1;
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
            
            noise.start(this.audioContext.currentTime);
            noise.stop(this.audioContext.currentTime + 0.8);
        } catch (e) {
            console.warn('Error playing explode sound:', e);
        }
    }

    // Bonus: Jingle bells sound
    playJingleSound() {
        if (!this.initialized) return;

        try {
            const notes = [659, 659, 659, 659, 659, 659, 659, 784, 523, 587, 659]; // E E E E E E E G C D E
            const duration = 0.15;
            
            notes.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.value = freq;
                
                const startTime = this.audioContext.currentTime + (index * duration);
                
                gainNode.gain.setValueAtTime(0.2, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            });
        } catch (e) {
            console.warn('Error playing jingle sound:', e);
        }
    }
}

// Make it globally available
window.FireworkSoundGenerator = FireworkSoundGenerator;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🎵 Audio module loaded');
    });
} else {
    console.log('🎵 Audio module loaded');
}
