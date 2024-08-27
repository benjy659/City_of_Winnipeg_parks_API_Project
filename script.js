
function displayResults(data) {
    let resultsContainer = document.getElementById('results');
    // Clear previous results
    resultsContainer.innerHTML = '';

    if (data.length > 0) {
        let h2 = document.createElement('h2');
        h2.textContent = `Found ${data.length} results.`;
        resultsContainer.appendChild(h2);
        let message = document.createElement('p');
        message.textContent = 'This search shows the Park name, Location, park category, District and Neighbourhood.';
        resultsContainer.appendChild(message);

        // Create table
        let table = document.createElement('table');
        // Create table header
        let thead = document.createElement('thead');
        let headerRow = document.createElement('tr');
        ['Park Name', 'location', 'Park Category', 'District', 'Neighbourhood'].forEach(text => {
            let header = document.createElement('th');
            header.textContent = text;
            headerRow.appendChild(header);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        // Create table body
        let tbody = document.createElement('tbody');

        data.forEach(item => {
            let row = document.createElement('tr');
            ['park_name', 'location_description', 'park_category', 'district', 'neighbourhood'].forEach(key => {
                let cell = document.createElement('td');
                cell.textContent = item[key]; 
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        resultsContainer.appendChild(table);
    } else {
        let result = document.createElement('h2');
        result.textContent = 'No results found.';
        resultsContainer.appendChild(result);
    }
}

function load() {   
    form = document.getElementById('search-form')
    form.addEventListener('submit',submitsearch);

};

function submitsearch(event) {
    event.preventDefault();
    let name = document.getElementById('search-input-name').value;
    let neighborhood = document.getElementById('search-input-neighbourhood').value;
    let category = document.getElementById('search-input-category').value;


     // Check if at least one field is filled in
     if (!name && !neighborhood && !category) {
        alert('Please enter at least one search criteria.');
        return;
    }

    // Build query
    let baseQuery = `SELECT * WHERE `;
    let conditions = [];
    if (name) conditions.push(`park_name LIKE '${name}%'`);
    if (neighborhood) conditions.push(`neighbourhood LIKE '${neighborhood}%'`);
    if (category) conditions.push(`park_category LIKE '%${category}%'`);

     // Additional condition
     conditions.push(`district IS NOT NULL`);
     conditions.push(`location_description IS NOT NULL`);

    // Combine conditions
    let finalQuery = baseQuery + conditions.join(' AND ');

    let apiUrl = `https://data.winnipeg.ca/resource/tx3d-pfxq.json?$query=${encodeURIComponent(finalQuery)}`;

    // Fetch data
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        // Display results
        .then(data => displayResults(data))
        .catch(error => {
            console.log('There was a problem with the fetch operation: ' + error.message);
        });
}

// Load the script after the DOM has loaded
document.addEventListener("DOMContentLoaded", load);