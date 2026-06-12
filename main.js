document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. Efecto Navbar al hacer scroll
    // ==========================================
    const navbar = document.getElementById("navbar");
    if(navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    // ==========================================
    // 2. Animación Reveal (Aparición de elementos)
    // ==========================================
    const reveals = document.querySelectorAll(".reveal");
    if(reveals.length > 0) {
        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };
        const revealOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        reveals.forEach(reveal => revealOnScroll.observe(reveal));
    }

    // 3. Lógica de los Acordeones (Desplegables) de la Carta

document.querySelectorAll('.accordion-header').forEach(button => {

    button.addEventListener('click', () => {

        const accordionContent = button.nextElementSibling;

       

        // Alternamos la clase activa en el botón

        button.classList.toggle('active');

       

        // Expande o contrae basándose en la altura real (scrollHeight)

        if (button.classList.contains('active')) {

            accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";

           

            // Cerrar las otras categorías si están abiertas

            document.querySelectorAll('.accordion-header').forEach(otherBtn => {

                if(otherBtn !== button) {

                    otherBtn.classList.remove('active');

                    otherBtn.nextElementSibling.style.maxHeight = 0;

                }

            });

        } else {

            accordionContent.style.maxHeight = 0;

        }

    });

});

    

    // ==========================================
    // 4. Carrusel de Sugerencias
    // ==========================================
    const track = document.getElementById('carouselTrack');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    
    if (track && btnPrev && btnNext) {
        let currentIndex = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        btnNext.addEventListener('click', () => {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; 
            }
            updateCarousel();
        });

        btnPrev.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalSlides - 1; 
            }
            updateCarousel();
        });

        // Autoplay del carrusel (cada 5 segundos)
        setInterval(() => {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
        }, 5000); 

        // --- NUEVO CÓDIGO PARA DESLIZAR (SWIPE) EN MÓVILES ---
        let touchStartX = 0;
        let touchEndX = 0;

        // Detectar dónde pone el dedo el usuario
        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        // Detectar dónde levanta el dedo
        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            checkDirection();
        }, { passive: true });

        // Comprobar la dirección del deslizamiento
        function checkDirection() {
            const umbral = 50; // Píxeles mínimos que hay que arrastrar para cambiar de foto
            if (touchStartX - touchEndX > umbral) {
                // Deslizó hacia la izquierda -> Siguiente foto
                btnNext.click(); 
            } else if (touchEndX - touchStartX > umbral) {
                // Deslizó hacia la derecha -> Foto anterior
                btnPrev.click();
            }
        }
        // --- FIN DEL NUEVO CÓDIGO ---
    }

    // ==========================================
    // 5. Envío del Formulario de Reserva (Solo WhatsApp)
    // ==========================================
    const formReserva = document.getElementById('form-reserva');
    const mensajeDiv = document.getElementById('mensaje-reserva');
    const inputFecha = document.getElementById('fecha');

    if (inputFecha) {
        const hoy = new Date().toISOString().split('T')[0];
        inputFecha.setAttribute('min', hoy);
    }

    if(formReserva) {
        formReserva.onsubmit = function(e) {
            e.preventDefault(); // Evitamos que la página se recargue al enviar
            
            // 1. Mostramos un mensaje de éxito en la web
            mensajeDiv.innerHTML = '<div class="alert alert-success">¡Redirigiendo a WhatsApp para solicitar tu reserva!</div>';
            
            // 2. Recogemos los valores que el cliente acaba de escribir
            const nom = document.getElementById('nombre').value;
            const fec = document.getElementById('fecha').value;
            const hor = document.getElementById('hora').value;
            const per = document.getElementById('personas').value;
            const com = document.getElementById('comentario').value;

            // 3. Montamos el mensaje con formato (los asteriscos hacen negrita en WhatsApp)[cite: 3]
            let mensajeWA = `¡Hola! Me gustaría solicitar una reserva. Aquí están mis datos:\n\n`;
            mensajeWA += `· *Nombre:* ${nom}\n`;
            mensajeWA += `· *Fecha:* ${fec}\n`;
            mensajeWA += `· *Hora:* ${hor}\n`;
            mensajeWA += `· *Personas:* ${per}\n`;
            
            if (com.trim() !== "") {
                mensajeWA += `· *Comentario:* ${com}\n`;
            }
            
            mensajeWA += `\n¿Me confirmáis disponibilidad? ¡Gracias!`;

            // 4. El número de teléfono del local[cite: 3]
            const telefonoDueño = "34615186382";

            // 5. Codificamos el texto para que las URLs lo entiendan[cite: 3]
            const textoCodificado = encodeURIComponent(mensajeWA);

            // 6. Creamos el enlace oficial de WhatsApp y lo abrimos en una nueva pestaña[cite: 3]
            const urlWhatsApp = `https://wa.me/${telefonoDueño}?text=${textoCodificado}`;
            window.open(urlWhatsApp, '_blank');

            // 7. Limpiamos el formulario para que quede en blanco[cite: 3]
            formReserva.reset(); 
            
            // Opcional: Quitar el mensaje de la web pasados unos segundos
            setTimeout(() => {
                mensajeDiv.innerHTML = '';
            }, 5000);
        };
    }
    // ==========================================
    // 6. Generador de horas (Comida: 12-16h | Cena: 19-00h)
    // ==========================================
    const selectHora = document.getElementById('hora');
    
    if (selectHora) {
        // IMPORTANTE: Limpiamos el selector para evitar que salgan "dos días" o horas duplicadas
        selectHora.innerHTML = '<option value="" disabled selected>Selecciona una hora...</option>';
        
        // Definimos los turnos: Comida (12 a 15:45) y Cena (19 a 23:45)
        const turnos = [
            { inicio: 12, fin: 15 }, // Turno de comida
            { inicio: 19, fin: 23 }  // Turno de cena
        ];

        turnos.forEach(turno => {
            for (let h = turno.inicio; h <= turno.fin; h++) {
                for (let m = 0; m < 60; m += 15) {
                    let horaStr = h.toString().padStart(2, '0');
                    let minStr = m.toString().padStart(2, '0');
                    let timeValue = `${horaStr}:${minStr}`;
                    
                    let option = document.createElement('option');
                    option.value = timeValue;
                    option.textContent = timeValue;
                    selectHora.appendChild(option);
                }
            }
        });
    }

    // ==========================================
    // 7. Bloquear letras en el campo de teléfono
    // ==========================================
    const inputTelefono = document.getElementById('telefono');
    
    if (inputTelefono) {
        inputTelefono.addEventListener('input', function(e) {
            // La expresión regular /\D/g busca todo lo que NO sea un número.
            // Si encuentra una letra o símbolo, lo reemplaza por "nada" (lo borra).
            this.value = this.value.replace(/\D/g, '');
        });
    }

    // ==========================================
    // 8. Menú Hamburguesa para Móviles
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        // Al hacer clic en las 3 rayitas, abrimos/cerramos el menú
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Si el usuario hace clic en un enlace (ej: "Carta"), cerramos el menú automáticamente
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

});