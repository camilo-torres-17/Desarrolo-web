document.addEventListener('DOMContentLoaded', () => {
    const footerSection = document.querySelector('footer section');
    if (!footerSection) return;

    const subscribeDiv = document.createElement('div');
    subscribeDiv.className = 'subscribe-column';
    subscribeDiv.innerHTML = `
        <h2>Suscríbete</h2>
        <p style="font-size: 14px; margin: 0 0 12px; color: #333;">¡Unete a nuestra comunidad!</p>
        <form id="subscribe-form">
            <input id="subscribe-email" type="email" placeholder="Tu correo electrónico" required />
            <button type="submit">Suscribirme</button>
        </form>
        <p id="subscribe-message" class="subscribe-message"></p>
    `;

    footerSection.appendChild(subscribeDiv);

    const form = document.getElementById('subscribe-form');
    const message = document.getElementById('subscribe-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        message.textContent = '';

        const email = document.getElementById('subscribe-email').value.trim();
        if (!email) {
            message.textContent = 'Ingresa un correo válido.';
            return;
        }

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
                credentials: 'include'
            });
            const result = await response.json();

            if (response.ok && result.success) {
                message.textContent = result.message || 'Suscripción realizada.';
                message.style.color = '#2e7d32';
                form.reset();
            } else {
                message.textContent = result.error || 'No fue posible suscribirte.';
                message.style.color = '#b71c1c';
            }
        } catch (error) {
            message.textContent = 'Error de conexión. Intenta de nuevo.';
            message.style.color = '#b71c1c';
        }
    });
});
