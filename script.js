document.addEventListener('DOMContentLoaded', function () {
    const loader = document.createElement('div');
    loader.classList.add('loader');
    document.body.appendChild(loader);

    const productContainer = document.querySelector('.product-container');
    const buttons = document.querySelectorAll('.button');
    let currentCategory = 'men';

    function showLoader() {
        loader.style.display = 'block';
    }

    function hideLoader() {
        loader.style.display = 'none';
    }

    function fetchAndRenderProducts() {
        showLoader();
        fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
            .then(response => response.json())
            .then(data => {
                const categories = data.categories;
                categories.forEach(category => renderCategory(category));
                showCategoryData(currentCategory);
                hideLoader();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                hideLoader();
            });
    }

    function renderCategory(category) {
        const categoryName = category.category_name;
        const categoryProducts = category.category_products;

        const productCardContainer = document.createElement('div');
        productCardContainer.classList.add('product-card-container');
        productCardContainer.dataset.category = categoryName.toLowerCase();

        categoryProducts.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('product-image-container');
            const image = document.createElement('img');
            image.src = product.image;
            image.classList.add('product-image');
            imageContainer.appendChild(image);

            if (product.badge_text) {
                const badge = document.createElement('div');
                badge.classList.add('product-badge');
                badge.textContent = product.badge_text;
                imageContainer.appendChild(badge);
            }

            const details = document.createElement('div');
            details.classList.add('product-details');
            const title = document.createElement('h4');
            title.classList.add('product-title');
            const trimmedTitle = product.title.length > 10 ? product.title.substring(0, 10) + '...' : product.title;
            title.innerHTML = `${trimmedTitle} <br><span class="product-vendor">Vendor: ${product.vendor}</span>`;
            details.appendChild(title);

            title.addEventListener('click', function () {
                const currentTitle = this.innerHTML;
                const fullTitle = product.title + ` <span class="product-vendor">Vendor: ${product.vendor}</span>`;
                this.innerHTML = currentTitle === fullTitle ? trimmedTitle : fullTitle;
            });

            const price = document.createElement('p');
            price.classList.add('product-price');
            const discountPercent = Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);
            price.innerHTML = `Rs ${product.price} <del class="old-price">${product.compare_at_price}</del><span class="discount">${discountPercent}% off</span>`;
            details.appendChild(price);

            const addToCartButton = document.createElement('button');
            addToCartButton.classList.add('add-to-cart-button');
            addToCartButton.textContent = 'Add to Cart';
            details.appendChild(addToCartButton);

            card.appendChild(imageContainer);
            card.appendChild(details);
            productCardContainer.appendChild(card);
        });

        productContainer.appendChild(productCardContainer);
    }

    function showCategoryData(category) {
        showLoader();
        const productCardContainers = document.querySelectorAll('.product-card-container');

        productCardContainers.forEach(container => {
            container.style.display = !category || container.dataset.category === category ? 'block' : 'none';
        });

        hideLoader();
    }

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            showLoader();
            currentCategory = this.dataset.category.toLowerCase();
            buttons.forEach(btn => btn.classList.toggle('selected', currentCategory === btn.dataset.category.toLowerCase()));
            showCategoryData(currentCategory);
        });
    });

    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            document.querySelectorAll('.product-card-container').forEach(container => container.remove());
            fetchAndRenderProducts();
        }, 200);
    });

    fetchAndRenderProducts();
});
