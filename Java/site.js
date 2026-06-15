document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.dataset.tab;
            tabButtons.forEach(btn => btn.classList.toggle('active', btn === this));
            tabPanels.forEach(panel => panel.classList.toggle('active', panel.id === target));
        });
    });

    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const openButtons = document.querySelectorAll('.open-modal');
    const closeButtons = document.querySelectorAll('.modal-close');

    function toggleModal(show) {
        if (!modal) return;
        modal.classList.toggle('hidden', !show);
        modal.setAttribute('aria-hidden', String(!show));
    }

    openButtons.forEach(button => {
        button.addEventListener('click', function() {
            modalTitle.textContent = this.dataset.title || 'Product Quick View';
            modalDescription.textContent = this.dataset.description || '';
            toggleModal(true);
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleModal(false);
        });
    });

    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                toggleModal(false);
            }
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (modal && !modal.classList.contains('hidden')) {
                toggleModal(false);
            }
            const lightbox = document.getElementById('lightbox');
            if (lightbox && !lightbox.classList.contains('hidden')) {
                closeLightbox();
            }
        }
    });

    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const panel = this.nextElementSibling;
            const expanded = this.classList.toggle('active');
            if (panel) {
                panel.style.maxHeight = expanded ? panel.scrollHeight + 'px' : '0';
            }
        });
    });

    const galleryImages = document.querySelectorAll('#gallery .gallery-card img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.add('hidden');
        lightbox.setAttribute('aria-hidden', 'true');
    }

    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            if (!lightbox || !lightboxImage || !lightboxCaption) return;
            lightboxImage.src = this.src;
            lightboxImage.alt = this.alt;
            lightboxCaption.textContent = this.dataset.caption || this.alt;
            lightbox.classList.remove('hidden');
            lightbox.setAttribute('aria-hidden', 'false');
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', function(event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }

    const mapContainer = document.getElementById('map');
    if (mapContainer && typeof L !== 'undefined') {
        const map = L.map('map').setView([-26.1927, 28.0339], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        L.marker([-26.1927, 28.0339]).addTo(map).bindPopup('23 Jorissen Street, Braamfontein, Johannesburg').openPopup();
    }

    // ===== Dynamic product data, rendering, and search/sort =====
    const products = [
        {
            id: 1,
            name: 'Brand A - ModernNova',
            description: 'An ultraportable laptop with long battery life, fast connectivity, and smooth multitasking. Ideal for students and business users.',
            img: 'IMAGES/Screenshot 2026-05-29 130254.png',
            price: 12390.99,
            category: 'portable'
        },
        {
            id: 2,
            name: 'Brand B - ModernGamer',
            description: 'A gaming-ready laptop with dedicated graphics, fast refresh rate, and immersive audio. Great for gamers and content creators.',
            img: 'IMAGES/Screenshot 2026-04-16 151204.png',
            price: 21499.00,
            category: 'gaming'
        },
        {
            id: 3,
            name: 'Brand C - ModernPro',
            description: 'A balanced professional laptop with reliable performance, crisp display, and lightweight portability for everyday productivity.',
            img: 'IMAGES/Screenshot 2026-04-16 151223.png',
            price: 14854.5,
            category: 'professional'
        }
    ];

    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('product-search');
    const sortSelect = document.getElementById('product-sort');
    const productHeading = document.querySelector('#products h2');

    function formatCurrency(n) {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'ZAR' }).format(n);
    }

    function renderProducts(items) {
        if (!productList) return;
        productList.innerHTML = items.map(p => `
            <div class="product-item">
                <img src="${p.img}" alt="${p.name}" width="300">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <p class="price">${formatCurrency(p.price)}</p>
                <button class="button open-modal" data-title="${p.name}" data-description="${p.description}">Quick View</button>
            </div>
        `).join('');

        // update heading count
        if (productHeading) {
            productHeading.textContent = `Our Products (${items.length} models available)`;
        }

        // Attach modal handlers for the newly rendered buttons
        const dynamicOpenButtons = productList.querySelectorAll('.open-modal');
        dynamicOpenButtons.forEach(button => {
            button.addEventListener('click', function() {
                modalTitle.textContent = this.dataset.title || 'Product Quick View';
                modalDescription.textContent = this.dataset.description || '';
                toggleModal(true);
            });
        });
    }

    function getFilteredSortedProducts() {
        const q = (searchInput && searchInput.value || '').trim().toLowerCase();
        const sort = sortSelect ? sortSelect.value : 'default';

        let results = products.filter(p => {
            if (!q) return true;
            return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q));
        });

        if (sort === 'name-asc') {
            results.sort((a,b) => a.name.localeCompare(b.name));
        } else if (sort === 'name-desc') {
            results.sort((a,b) => b.name.localeCompare(a.name));
        } else if (sort === 'price-asc') {
            results.sort((a,b) => a.price - b.price);
        } else if (sort === 'price-desc') {
            results.sort((a,b) => b.price - a.price);
        }

        return results;
    }

    // initial render
    renderProducts(products);

    // wire up search and sort
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            renderProducts(getFilteredSortedProducts());
        });
    }
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            renderProducts(getFilteredSortedProducts());
        });
    }
    // ===== Form helpers, validation and AJAX handling =====

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        if (!phone) return true; // optional
        return /^\+?\d{7,15}$/.test(phone.replace(/\s+/g, ''));
    }

    function showFormErrors(container, errors) {
        if (!container) return;
        container.innerHTML = '';
        if (!errors || errors.length === 0) return;
        const ul = document.createElement('ul');
        errors.forEach(msg => {
            const li = document.createElement('li');
            li.textContent = msg;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }

    function ajaxPost(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(r => r.json()).catch(() => ({ ok: false }));
    }

    /* Enquiry form handling */
    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        const eType = document.getElementById('e-type');
        const productFields = document.getElementById('product-fields');
        const eDate = document.getElementById('e-date');
        const eErrors = document.getElementById('enquiry-errors');
        const eResponse = document.getElementById('enquiry-response');

        // set min date to today
        if (eDate) {
            const today = new Date().toISOString().split('T')[0];
            eDate.setAttribute('min', today);
        }

        function updateProductFields() {
            if (!eType || !productFields) return;
            productFields.style.display = eType.value === 'product' ? 'block' : 'none';
        }

        updateProductFields();
        if (eType) eType.addEventListener('change', updateProductFields);

        enquiryForm.addEventListener('submit', function(ev) {
            ev.preventDefault();
            eResponse.textContent = '';
            const errors = [];
            const name = (document.getElementById('e-name')||{}).value || '';
            const email = (document.getElementById('e-email')||{}).value || '';
            const phone = (document.getElementById('e-phone')||{}).value || '';
            const type = (document.getElementById('e-type')||{}).value || '';
            const productId = (document.getElementById('e-product')||{}).value || '';
            const quantity = parseInt((document.getElementById('e-quantity')||{value:1}).value, 10) || 1;
            const message = (document.getElementById('e-message')||{}).value || '';

            if (name.trim().length < 2) errors.push('Please enter your name (2+ characters).');
            if (!validateEmail(email)) errors.push('Please provide a valid email address.');
            if (!validatePhone(phone)) errors.push('Please provide a valid phone number.');

            if (errors.length) { showFormErrors(eErrors, errors); return; }

            // Simulate processing for product enquiries
            if (type === 'product') {
                const prod = products.find(p => String(p.id) === String(productId));
                if (prod) {
                    const total = prod.price * quantity;
                    eResponse.innerHTML = `<strong>Estimated total:</strong> ${formatCurrency(total)}<br><strong>Availability:</strong> In stock (simulated). We will confirm within 24 hours.`;
                } else {
                    eResponse.textContent = 'Product not recognised. We will contact you to confirm availability.';
                }
            } else if (type === 'volunteer') {
                eResponse.textContent = 'Thank you for your interest in volunteering — our coordinator will contact you about next steps.';
            } else if (type === 'sponsor') {
                eResponse.textContent = 'Thank you for considering sponsorship. We will follow up with sponsorship packages.';
            } else {
                eResponse.textContent = 'Thank you for your enquiry. We will respond shortly.';
            }

            // Simulate async submission to server endpoint
            const payload = { name, email, phone, type, productId, quantity, message };
            setTimeout(() => {
                // optimistic UI already shown; in a real app we would check server response
                enquiryForm.reset();
                updateProductFields();
            }, 800);
            // fire-and-forget real request (if endpoint exists)
            ajaxPost(enquiryForm.action, payload).then(() => {});
        });
    }

    /* Contact form handling */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const cErrors = document.getElementById('contact-errors');
        const cResponse = document.getElementById('contact-response');
        const sendEmailBtn = document.getElementById('c-send-email');

        function compileMailto(data) {
            const to = 'peacechogo14@gmail.com';
            const subject = encodeURIComponent(`[${data.messageType}] Contact from ${data.name}`);
            const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\nMessage:\n${data.message}`);
            return `mailto:${to}?subject=${subject}&body=${body}`;
        }

        if (sendEmailBtn) {
            sendEmailBtn.addEventListener('click', function() {
                const data = {
                    name: (document.getElementById('c-name')||{}).value || '',
                    email: (document.getElementById('c-email')||{}).value || '',
                    phone: (document.getElementById('c-phone')||{}).value || '',
                    messageType: (document.getElementById('c-type')||{}).value || 'message',
                    message: (document.getElementById('c-message')||{}).value || ''
                };
                // basic validation before opening mail client
                const errors = [];
                if (data.name.trim().length < 2) errors.push('Please enter your name.');
                if (!validateEmail(data.email)) errors.push('Please enter a valid email.');
                if (!validatePhone(data.phone)) errors.push('Please enter a valid phone number.');
                if (!data.message.trim()) errors.push('Please enter a message.');
                if (errors.length) { showFormErrors(cErrors, errors); return; }

                window.location.href = compileMailto(data);
            });
        }

        contactForm.addEventListener('submit', function(ev) {
            ev.preventDefault();
            cResponse.textContent = '';
            const errors = [];
            const name = (document.getElementById('c-name')||{}).value || '';
            const email = (document.getElementById('c-email')||{}).value || '';
            const phone = (document.getElementById('c-phone')||{}).value || '';
            const messageType = (document.getElementById('c-type')||{}).value || '';
            const message = (document.getElementById('c-message')||{}).value || '';
            const consent = !!(document.getElementById('c-consent')||{}).checked;

            if (name.trim().length < 2) errors.push('Please enter your name.');
            if (!validateEmail(email)) errors.push('Please enter a valid email.');
            if (!validatePhone(phone)) errors.push('Please enter a valid phone number.');
            if (!message.trim()) errors.push('Please enter a message.');
            if (!consent) errors.push('Please confirm you agree to be contacted.');

            if (errors.length) { showFormErrors(cErrors, errors); return; }

            const payload = { name, email, phone, messageType, message };
            cResponse.textContent = 'Sending message...';
            ajaxPost(contactForm.action, payload).then(resp => {
                cResponse.textContent = 'Message submitted (simulated). We will contact you shortly.';
                contactForm.reset();
            }).catch(() => {
                cResponse.textContent = 'There was a problem sending your message (simulated). Please try again.';
            });
        });
    }

    // Also support keyboard-based activation for modal-close already present
});
