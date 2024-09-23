function flashMessage() {
    document.addEventListener('DOMContentLoaded', function () {
        var flashMessage = document.getElementById('flash-message');
        if (flashMessage) {
            setTimeout(function () {
                flashMessage.classList.add('fade-out');
                // Optional: Remove the message after fade-out
                setTimeout(function () {
                    flashMessage.style.display = 'none';
                }, 500); // Matches the duration of the fade-out transition
            }, 3000); // Time in milliseconds before message starts fading out
        }
    });
}
flashMessage();


function cartPageQuantitySelector() {

    document.querySelectorAll('.quantity-increase').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');
            const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
            let quantity = parseInt(input.value);
            quantity += 1;
            input.value = quantity;

            updatePrice(productId, quantity);
        });
    });

    document.querySelectorAll('.quantity-decrease').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');
            const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
            let quantity = parseInt(input.value);
            if (quantity > 1) {
                quantity -= 1;
                input.value = quantity;

                updatePrice(productId, quantity);
            }
        });
    });

    function updatePrice(productId, quantity) {
        const priceMrp = parseFloat(document.querySelector(`.price-mrp[data-id="${productId}"]`).innerText);
        const discount = parseFloat(document.querySelector(`.discount-value[data-id="${productId}"]`).innerText);

        // Update the quantity display
        document.querySelector(`.quantity-display[data-id="${productId}"]`).innerText = quantity;

        const currentShippingDiv = document.querySelector(`.shipping-charge[data-id="${productId}"]`)

        // Fetch the new shipping charge
        let CalculateShipping = () => {
            if (parseInt(currentShippingDiv.innerText)) {
                return parseInt(currentShippingDiv.innerText);
            }
            return 0
        }
        let shippingCharge = CalculateShipping();
        // Calculate the new total amount
        ;
        console.log(priceMrp, discount, quantity, shippingCharge);

        const newTotal = ((priceMrp - discount) * quantity) + shippingCharge;

        // Update the shipping amount in the DOM
        if (newTotal > 500) {
            currentShippingDiv.style.color = '#22C55E';
            currentShippingDiv.style.fontWeight = '700';
            currentShippingDiv.innerText = 'free';
        } else {
            shippingCharge = 20
            currentShippingDiv.style.color = 'black';
            currentShippingDiv.style.fontWeight = 'normal';
            currentShippingDiv.innerText = shippingCharge;
        }

        // Update the total amount in the DOM
        document.querySelector(`.total-amount[data-id="${productId}"]`).innerText = `₹ ${newTotal}`;
    }
}

cartPageQuantitySelector();
