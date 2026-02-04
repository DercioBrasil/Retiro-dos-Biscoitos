// Configurações de preços
// De 01/01 a 30/04: 90€ por noite para 1-2 pessoas, +15€ por pessoa adicional
// De 01/05 a 30/09: 120€ por noite para 1-2 pessoas, +15€ por pessoa adicional
const PRICE_BASE_LOW_SEASON = 90; // Preço base baixa temporada (01/01 a 30/04)
const PRICE_BASE_HIGH_SEASON = 120; // Preço base alta temporada (01/05 a 30/09)
const PRICE_PER_EXTRA_PERSON = 15; // Preço adicional por pessoa extra

// Estado da aplicação
let reservations = [];
let selectedDates = {
    checkin: null,
    checkout: null
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadReservations();
    initializeNavigation();
    initializeCalendar();
    initializeForm();
    initializeDateInputs();
});

// Navegação Mobile
function initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Calendário
function initializeCalendar() {
    const calendar = document.getElementById('calendar');
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    renderCalendar(currentMonth, currentYear);
}

function renderCalendar(month, year) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Cabeçalhos dos dias
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day header';
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });
    
    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // Último dia do mês
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    // Criar dias do calendário
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = currentDate.getDate();
        
        const dateStr = formatDate(currentDate);
        const dateObj = new Date(currentDate);
        dateObj.setHours(0, 0, 0, 0);
        
        // Verificar se é data passada
        if (dateObj < today) {
            dayElement.classList.add('past');
        }
        // Verificar se está reservado
        else if (isDateReserved(dateStr)) {
            dayElement.classList.add('reserved');
        }
        // Verificar se está selecionado
        else if (isDateSelected(dateStr)) {
            dayElement.classList.add('selected');
            dayElement.addEventListener('click', () => deselectDate(dateStr));
        }
        // Disponível
        else {
            dayElement.classList.add('available');
            dayElement.addEventListener('click', () => selectDate(dateStr));
        }
        
        calendar.appendChild(dayElement);
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

function isDateReserved(dateStr) {
    return reservations.some(res => {
        const checkin = new Date(res.checkin);
        const checkout = new Date(res.checkout);
        const date = new Date(dateStr);
        return date >= checkin && date < checkout;
    });
}

function isDateSelected(dateStr) {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    return dateStr === checkinInput.value || dateStr === checkoutInput.value;
}

function selectDate(dateStr) {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (!checkinInput.value || (checkoutInput.value && dateStr < checkinInput.value)) {
        checkinInput.value = dateStr;
        selectedDates.checkin = dateStr;
        checkoutInput.value = '';
        selectedDates.checkout = null;
    } else if (!checkoutInput.value || dateStr > checkinInput.value) {
        checkoutInput.value = dateStr;
        selectedDates.checkout = dateStr;
    }
    
    updatePrice();
    renderCalendar(new Date().getMonth(), new Date().getFullYear());
}

function deselectDate(dateStr) {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput.value === dateStr) {
        checkinInput.value = '';
        selectedDates.checkin = null;
    }
    if (checkoutInput.value === dateStr) {
        checkoutInput.value = '';
        selectedDates.checkout = null;
    }
    
    updatePrice();
    renderCalendar(new Date().getMonth(), new Date().getFullYear());
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Formulário
function initializeForm() {
    const form = document.getElementById('reservationForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleReservation();
    });
}

function initializeDateInputs() {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const today = formatDate(new Date());
    
    // Definir data mínima como hoje
    checkinInput.min = today;
    checkoutInput.min = today;
    
    checkinInput.addEventListener('change', function() {
        selectedDates.checkin = this.value;
        if (this.value) {
            checkoutInput.min = this.value;
            if (checkoutInput.value && checkoutInput.value <= this.value) {
                checkoutInput.value = '';
                selectedDates.checkout = null;
            }
        }
        updatePrice();
        renderCalendar(new Date().getMonth(), new Date().getFullYear());
    });
    
    checkoutInput.addEventListener('change', function() {
        selectedDates.checkout = this.value;
        updatePrice();
        renderCalendar(new Date().getMonth(), new Date().getFullYear());
    });
    
    // Atualizar preço quando número de hóspedes mudar
    document.getElementById('hospedes').addEventListener('change', updatePrice);
}

// Função para calcular o preço por noite baseado na data e número de pessoas
function getPricePerNight(date, numGuests) {
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1; // getMonth() retorna 0-11, então adicionamos 1
    const day = dateObj.getDate();
    
    let basePrice;
    
    // Verificar se está na baixa temporada (01/01 a 30/04)
    if ((month === 1) || (month === 2) || (month === 3) || (month === 4 && day <= 30)) {
        basePrice = PRICE_BASE_LOW_SEASON;
    }
    // Verificar se está na alta temporada (01/05 a 30/09)
    else if ((month === 5) || (month === 6) || (month === 7) || (month === 8) || (month === 9 && day <= 30)) {
        basePrice = PRICE_BASE_HIGH_SEASON;
    }
    // Para outros meses (outubro, novembro, dezembro), usar preço da baixa temporada
    else {
        basePrice = PRICE_BASE_LOW_SEASON;
    }
    
    // Calcular preço adicional para pessoas extras (mais de 2 pessoas)
    const extraPeople = Math.max(0, numGuests - 2);
    const extraPrice = extraPeople * PRICE_PER_EXTRA_PERSON;
    
    return basePrice + extraPrice;
}

function updatePrice() {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const hospedesInput = document.getElementById('hospedes');
    const nightsCountEl = document.getElementById('nightsCount');
    const pricePerNightEl = document.getElementById('pricePerNight');
    const totalPriceEl = document.getElementById('totalPrice');
    
    if (checkinInput.value && checkoutInput.value && hospedesInput.value) {
        const checkin = new Date(checkinInput.value);
        const checkout = new Date(checkoutInput.value);
        const numGuests = parseInt(hospedesInput.value);
        
        const diffTime = Math.abs(checkout - checkin);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
            nightsCountEl.textContent = diffDays;
            
            // Calcular preço total somando cada noite individualmente
            // (caso a estadia atravesse períodos diferentes)
            let total = 0;
            const currentDate = new Date(checkin);
            
            for (let i = 0; i < diffDays; i++) {
                const nightDate = new Date(currentDate);
                nightDate.setDate(currentDate.getDate() + i);
                total += getPricePerNight(nightDate, numGuests);
            }
            
            // Calcular preço médio por noite para exibição
            const avgPricePerNight = total / diffDays;
            pricePerNightEl.textContent = `€${avgPricePerNight.toFixed(2)}`;
            totalPriceEl.textContent = `€${total.toFixed(2)}`;
        } else {
            nightsCountEl.textContent = '0';
            pricePerNightEl.textContent = '€0';
            totalPriceEl.textContent = '€0';
        }
    } else {
        nightsCountEl.textContent = '0';
        pricePerNightEl.textContent = '€0';
        totalPriceEl.textContent = '€0';
    }
}

function handleReservation() {
    const form = document.getElementById('reservationForm');
    const formData = new FormData(form);
    
    const reservation = {
        id: Date.now(),
        nome: formData.get('nome'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        checkin: formData.get('checkin'),
        checkout: formData.get('checkout'),
        hospedes: formData.get('hospedes'),
        mensagem: formData.get('mensagem'),
        timestamp: new Date().toISOString()
    };
    
    // Validações
    if (!validateReservation(reservation)) {
        return;
    }
    
    // Adicionar reserva
    reservations.push(reservation);
    saveReservations();
    
    // Atualizar calendário imediatamente para bloquear as datas
    renderCalendar(new Date().getMonth(), new Date().getFullYear());
    
    // Mostrar confirmação
    showConfirmation(reservation);
    
    // Limpar formulário
    form.reset();
    selectedDates = { checkin: null, checkout: null };
    updatePrice();
    
    // Atualizar calendário novamente após limpar formulário
    setTimeout(() => {
        renderCalendar(new Date().getMonth(), new Date().getFullYear());
    }, 100);
}

function validateReservation(reservation) {
    const checkin = new Date(reservation.checkin);
    const checkout = new Date(reservation.checkout);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Validar datas
    if (checkin < today) {
        alert('A data de check-in não pode ser no passado.');
        return false;
    }
    
    if (checkout <= checkin) {
        alert('A data de check-out deve ser posterior à data de check-in.');
        return false;
    }
    
    // Verificar conflitos
    const hasConflict = reservations.some(res => {
        const resCheckin = new Date(res.checkin);
        const resCheckout = new Date(res.checkout);
        
        return (checkin >= resCheckin && checkin < resCheckout) ||
               (checkout > resCheckin && checkout <= resCheckout) ||
               (checkin <= resCheckin && checkout >= resCheckout);
    });
    
    if (hasConflict) {
        alert('Desculpe, essas datas já estão reservadas. Por favor, escolha outras datas.');
        return false;
    }
    
    return true;
}

function showConfirmation(reservation) {
    const modal = document.getElementById('confirmationModal');
    const details = document.getElementById('reservationDetails');
    
    const checkin = new Date(reservation.checkin);
    const checkout = new Date(reservation.checkout);
    const diffTime = Math.abs(checkout - checkin);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const numGuests = parseInt(reservation.hospedes);
    
    // Calcular preço total usando a mesma lógica da função updatePrice
    let total = 0;
    for (let i = 0; i < nights; i++) {
        const nightDate = new Date(checkin);
        nightDate.setDate(checkin.getDate() + i);
        total += getPricePerNight(nightDate, numGuests);
    }
    
    details.innerHTML = `
        <div style="text-align: left; margin: 1.5rem 0;">
            <p><strong>Nome:</strong> ${reservation.nome}</p>
            <p><strong>Email:</strong> ${reservation.email}</p>
            <p><strong>Telefone:</strong> ${reservation.telefone}</p>
            <p><strong>Check-in:</strong> ${formatDateDisplay(checkin)}</p>
            <p><strong>Check-out:</strong> ${formatDateDisplay(checkout)}</p>
            <p><strong>Hóspedes:</strong> ${reservation.hospedes}</p>
            <p><strong>Noites:</strong> ${nights}</p>
            <p><strong>Total:</strong> €${total.toFixed(2)}</p>
            ${reservation.mensagem ? `<p><strong>Mensagem:</strong> ${reservation.mensagem}</p>` : ''}
        </div>
        <p style="margin-top: 1rem; color: var(--text-light);">
            Receberá um email de confirmação em breve.
        </p>
    `;
    
    modal.style.display = 'block';
}

function formatDateDisplay(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('pt-PT', options);
}

function closeModal() {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'none';
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('confirmationModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Fechar modal com botão X
document.querySelector('.close-modal').addEventListener('click', closeModal);

// Armazenamento Local
function saveReservations() {
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

function loadReservations() {
    const saved = localStorage.getItem('reservations');
    if (saved) {
        reservations = JSON.parse(saved);
        // Garantir que as reservas carregadas bloqueiam as datas no calendário
        setTimeout(() => {
            renderCalendar(new Date().getMonth(), new Date().getFullYear());
        }, 100);
    }
}
