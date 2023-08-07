document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".shorten-section");
  form.addEventListener("submit", handleSubmit);

  // Event listener for the copy button click
  document.addEventListener('click', function (event) {
    const target = event.target;
    if (target && target.classList.contains('btn-copy')) {
      copyToClipboard(target);
    }
  });

  // Load saved links when the page loads
  loadSavedLinks();
});

// Function to fetch data from the shortcode API
async function shortenUrl(url) {
  const apiUrl = `https://api.shrtco.de/v2/shorten?url=${url}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();
  const inputElement = document.querySelector('.shorten-input');
  const originalUrl = inputElement.value.trim();

  // Check if the input is empty
  if (!originalUrl) {
    alert('Please enter a valid URL.');
    return;
  }

  // Call the shortenUrl function to fetch data from the API
  shortenUrl(originalUrl)
    .then(data => {
      if (data && data.ok) {
        // Add the shortened link to the list and save it in local storage
        const shortenedLink = data.result.full_short_link;
        addShortenedLink(originalUrl, shortenedLink);
      } else {
        alert('Unable to shorten URL. Please try again later.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    });
}

// Function to add the shortened link to the list and save it in local storage
function addShortenedLink(originalUrl, shortenedLink) {
  // Create the list item
  const listItem = document.createElement('li');
  listItem.innerHTML = `
    <span class="original-url">${originalUrl}</span>
    <span class="shortened-url">${shortenedLink}</span>
    <button class="btn-copy" onclick="copyToClipboard(this)">Copy</button>
  `;

  // Add the list item to the list
  const list = document.querySelector('.shortened-links ul');
  list.appendChild(listItem);

  // Save the shortened link in local storage
  saveToLocalStorage(originalUrl, shortenedLink);
}

// Function to save the shortened link in local storage
function saveToLocalStorage(originalUrl, shortenedLink) {
  const savedLinks = JSON.parse(localStorage.getItem('shortenedLinks')) || [];
  savedLinks.push({ originalUrl, shortenedLink });
  localStorage.setItem('shortenedLinks', JSON.stringify(savedLinks));
}

// Function to copy the shortened link to clipboard
function copyToClipboard(button) {
  const shortenedLink = button.previousElementSibling.textContent;
  const tempInput = document.createElement('input');
  tempInput.value = shortenedLink;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);

  // Change the button text to "Copied!" after copying to clipboard
  button.textContent = 'Copied!';
  button.classList.add('copied');
}

// Function to load saved shortened links from local storage
function loadSavedLinks() {
  const savedLinks = JSON.parse(localStorage.getItem('shortenedLinks')) || [];
  savedLinks.forEach(link => {
    addShortenedLink(link.originalUrl, link.shortenedLink);
  });
}
