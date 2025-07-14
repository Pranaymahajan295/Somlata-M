// Gallery Interactive Script for Somlata Makeover
document.addEventListener('DOMContentLoaded', function() {
    
    // Gallery functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const body = document.body;
    
    // Create lightbox modal
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="" alt="">
            <div class="lightbox-caption"></div>
            <div class="lightbox-navigation">
                <button class="nav-btn prev-btn">&#8249;</button>
                <button class="nav-btn next-btn">&#8250;</button>
            </div>
            <div class="lightbox-counter">
                <span class="current-image">1</span> / <span class="total-images">6</span>
            </div>
        </div>
    `;
    body.appendChild(lightbox);
    
    // Lightbox styles
    const lightboxStyles = `
        <style>
            .lightbox-modal {
                display: none;
                position: fixed;
                z-index: 10000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(5px);
            }
            
            .lightbox-content {
                position: relative;
                margin: auto;
                padding: 20px;
                width: 90%;
                max-width: 800px;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            
            .lightbox-content img {
                max-width: 100%;
                max-height: 80vh;
                object-fit: contain;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                transition: transform 0.3s ease;
            }
            
            .lightbox-close {
                position: absolute;
                top: 20px;
                right: 30px;
                color: #ffffff;
                font-size: 40px;
                font-weight: bold;
                cursor: pointer;
                z-index: 10001;
                transition: color 0.3s ease;
            }
            
            .lightbox-close:hover {
                color: #ff8c42;
            }
            
            .lightbox-caption {
                color: #ffffff;
                font-size: 1.2rem;
                text-align: center;
                margin-top: 20px;
                font-weight: 500;
            }
            
            .lightbox-navigation {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding: 0 20px;
            }
            
            .nav-btn {
                background: rgba(255, 140, 66, 0.8);
                color: #ffffff;
                border: none;
                font-size: 30px;
                padding: 15px 20px;
                cursor: pointer;
                border-radius: 50%;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            .nav-btn:hover {
                background: rgba(255, 140, 66, 1);
                transform: scale(1.1);
            }
            
            .lightbox-counter {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                color: #ffffff;
                font-size: 1rem;
                background: rgba(0, 0, 0, 0.5);
                padding: 10px 20px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
            }
            
            .gallery-item {
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            
            .gallery-item::after {
                content: '🔍';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 2rem;
                color: #ffffff;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                z-index: 10;
            }
            
            .gallery-item:hover::after {
                opacity: 1;
            }
            
            .loading-spinner {
                display: none;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #ff8c42;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            
            .gallery-item.loading::after {
                display: none;
            }
            
            .gallery-item.loading .loading-spinner {
                display: block;
            }
            
            @media (max-width: 768px) {
                .lightbox-content {
                    padding: 10px;
                }
                
                .lightbox-close {
                    font-size: 30px;
                    top: 10px;
                    right: 20px;
                }
                
                .nav-btn {
                    font-size: 25px;
                    padding: 10px 15px;
                }
                
                .lightbox-navigation {
                    padding: 0 10px;
                }
            }
        </style>
    `;
    
    // Add styles to head
    document.head.insertAdjacentHTML('beforeend', lightboxStyles);
    
    // Gallery variables
    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay span');
        return {
            src: img.src,
            alt: img.alt,
            caption: caption ? caption.textContent : ''
        };
    });
    
    // Lightbox elements
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.prev-btn');
    const nextBtn = lightbox.querySelector('.next-btn');
    const currentImageSpan = lightbox.querySelector('.current-image');
    const totalImagesSpan = lightbox.querySelector('.total-images');
    
    // Set total images count
    totalImagesSpan.textContent = images.length;
    
    // Open lightbox function
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxContent();
        lightbox.style.display = 'block';
        body.style.overflow = 'hidden';
        
        // Add fade in animation
        lightbox.style.opacity = '0';
        requestAnimationFrame(() => {
            lightbox.style.transition = 'opacity 0.3s ease';
            lightbox.style.opacity = '1';
        });
    }
    
    // Close lightbox function
    function closeLightbox() {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
            body.style.overflow = 'auto';
        }, 300);
    }
    
    // Update lightbox content
    function updateLightboxContent() {
        const currentImage = images[currentImageIndex];
        lightboxImg.src = currentImage.src;
        lightboxImg.alt = currentImage.alt;
        lightboxCaption.textContent = currentImage.caption;
        currentImageSpan.textContent = currentImageIndex + 1;
        
        // Add loading effect
        lightboxImg.style.opacity = '0';
        lightboxImg.onload = () => {
            lightboxImg.style.transition = 'opacity 0.3s ease';
            lightboxImg.style.opacity = '1';
        };
    }
    
    // Navigate to previous image
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxContent();
    }
    
    // Navigate to next image
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxContent();
    }
    
    // Add click events to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Add loading effect
            item.classList.add('loading');
            
            // Create loading spinner
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            item.appendChild(spinner);
            
            // Simulate loading time
            setTimeout(() => {
                item.classList.remove('loading');
                item.removeChild(spinner);
                openLightbox(index);
            }, 500);
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', () => {
            const img = item.querySelector('img');
            img.style.transform = 'scale(1.05)';
        });
        
        item.addEventListener('mouseleave', () => {
            const img = item.querySelector('img');
            img.style.transform = 'scale(1)';
        });
    });
    
    // Lightbox event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    
    // Close lightbox when clicking outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        }
    });
    
    // Lazy loading for gallery images
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transform = 'translateY(20px)';
                img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    img.style.opacity = '1';
                    img.style.transform = 'translateY(0)';
                }, 100);
                
                imageObserver.unobserve(img);
            }
        });
    }, observerOptions);
    
    // Observe gallery images
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        imageObserver.observe(img);
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage(); // Swipe left - next image
            } else {
                prevImage(); // Swipe right - previous image
            }
        }
    }
    
    // Auto-play functionality (optional)
    let autoplayInterval;
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            nextImage();
        }, 3000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
   
    // Add zoom functionality to lightbox images
    let isZoomed = false;
    
    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isZoomed) {
            lightboxImg.style.transform = 'scale(1.5)';
            lightboxImg.style.cursor = 'zoom-out';
            isZoomed = true;
        } else {
            lightboxImg.style.transform = 'scale(1)';
            lightboxImg.style.cursor = 'zoom-in';
            isZoomed = false;
        }
    });
    
    // Reset zoom when changing images
    function resetZoom() {
        lightboxImg.style.transform = 'scale(1)';
        lightboxImg.style.cursor = 'zoom-in';
        isZoomed = false;
    }
    
    // Call resetZoom when navigating
    prevBtn.addEventListener('click', resetZoom);
    nextBtn.addEventListener('click', resetZoom);
    
    // Add smooth scrolling to gallery section
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        const observerGallery = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    galleryItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(30px)';
                            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, 100);
                        }, index * 100);
                    });
                }
            });
        }, { threshold: 0.2 });
        
        observerGallery.observe(gallerySection);
    }
    
    console.log('Gallery script loaded successfully!');
});