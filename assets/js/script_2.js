document.getElementById('search-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const keyword = document.getElementById('search-input').value;
            const category = document.getElementById('category-select').value;
            const country = document.getElementById('country-select').value;
            const url = `https://gnews.io/api/v4/search?q=${keyword}&category=${category}&country=${country}&token=da46ddc15f48c0cc3ef722d5531ec960`;
            const loadingMessage = document.getElementById('loading-message');
            loadingMessage.textContent = 'Loading news...';
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    loadingMessage.textContent = '';
                    const newsContainer = document.getElementById('news');
                    newsContainer.innerHTML = ''; // Clear the previous news.
                    if (data.articles.length === 0) {
                        loadingMessage.textContent = 'No news found.';
                    } else {
                        // Main news article
                        const mainArticle = data.articles[0];
                        const mainNews = document.createElement('div');
                        mainNews.className = 'main-news';
                        mainNews.innerHTML = `
                            <h2>${mainArticle.title}</h2>
                            <img src="${mainArticle.image}" alt="${mainArticle.title}">
                            <p>${mainArticle.description}</p>
                            <a href="${mainArticle.url}" target="_blank" class="btn btn-primary">Read more</a>
                            <p class="text-right">Courtesy: ${mainArticle.source.name}</p>
                        `;
                        newsContainer.appendChild(mainNews);

                        // Other news articles
                        data.articles.slice(1).forEach((article, index) => {
                            const newsCard = document.createElement('div');
                            newsCard.className = 'news-card col-md-4';
                            newsCard.innerHTML = `
                                <h2>${article.title}</h2>
                                ${index < 2 ? `<img src="${article.image}" alt="${article.title}">` : ''}
                                <p>${article.description}</p>
                                <a href="${article.url}" target="_blank" class="btn btn-primary">Read more</a>
                                <p class="text-right">Courtesy: ${article.source.name}</p>
                            `;
                            newsContainer.appendChild(newsCard);
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    loadingMessage.textContent = 'An error occurred while fetching the news.';
                });
        });
