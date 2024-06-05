document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const keywordInput = document.getElementById('search-input').value;
    const categorySelect = document.getElementById('category-select').value;
    const countrySelect = document.getElementById('country-select').value;
    const url = `https://gnews.io/api/v4/search?q=${keywordInput}&category=${categorySelect}&country=${countrySelect}&token=da46ddc15f48c0cc3ef722d5531ec960`;
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
                // Main news article (goes into main-headline)
                const mainArticle = data.articles[0];
                const mainNews = createNewsElement(mainArticle, 'main-news');
                newsContainer.appendChild(mainNews);

                // Other news articles
                for (let i = 1; i < data.articles.length; i++) {
                    const article = data.articles[i];
                    const sectionName = getSectionName(i);
                    const newsElement = createNewsElement(article, sectionName);
                    newsContainer.appendChild(newsElement);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            loadingMessage.textContent = 'An error occurred while fetching the news.';
        });
});

// Helper function to create a news element
function createNewsElement(article, className) {
    const newsElement = document.createElement('div');
    newsElement.className = className;
    newsElement.innerHTML = `
        <h2>${article.title}</h2>
        <img src="${article.image}" alt="${article.title}">
        <p>${article.description}</p>
        <a href="${article.url}" target="_blank" class="btn btn-primary">Read more</a>
        <p class="text-right">Courtesy: ${article.source.name}</p>
    `;
    return newsElement;
}

// Helper function to determine section name based on index
function getSectionName(index) {
    const sections = ['small-news', 'categorized-news', 'live-updates', 'bottom-categories'];
    const sectionIndex = Math.floor((index - 1) / 5); // Distribute every 5 articles
    return sections[sectionIndex];
}
