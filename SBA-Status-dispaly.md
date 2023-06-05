
```html
<!DOCTYPE html>
<html>
<head>
  <title>Spring Boot Admin Applications</title>
  <style>
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
  </style>
</head>
<body>
  <h1>Spring Boot Admin Applications</h1>

  <label for="environment-select">Select Environment:</label>
  <select id="environment-select">
    <option value="it">IT</option>
    <option value="uat">UAT</option>
    <option value="prod">Prod</option>
  </select>

  <table id="data-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Version</th>
        <th>Health URL</th>
        <th>Health Status</th>
        <th>Number of Instances</th>
        <th>Management URL</th>
        <th>Service URL</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>

  <script>
    // Function to fetch data based on selected environment
    function fetchData(environment) {
      // Clear previous table data
      const tableBody = document.querySelector('#data-table tbody');
      tableBody.innerHTML = '';

      // Fetch data from the Spring Boot Admin /applications endpoint based on environment
      fetch(`http://${environment}:8093/applications`)
        .then(response => response.json())
        .then(data => {
          // Get the table body element
          const tableBody = document.querySelector('#data-table tbody');

          // Loop through the data and generate table rows
          data.forEach(application => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const versionCell = document.createElement('td');
            const healthUrlCell = document.createElement('td');
            const healthStatusCell = document.createElement('td');
            const instancesCell = document.createElement('td');
            const managementUrlCell = document.createElement('td');
            const serviceUrlCell = document.createElement('td');

            // Set the cell values
            nameCell.textContent = application.name;
            versionCell.textContent = application.version;
            healthUrlCell.textContent = application.healthUrl;
            managementUrlCell.textContent = application.managementUrl;
            serviceUrlCell.textContent = application.serviceUrl;

            // Append cells to the row
            row.appendChild(nameCell);
            row.appendChild(versionCell);
            row.appendChild(healthUrlCell);
            row.appendChild(healthStatusCell);
            row.appendChild(instancesCell);
            row.appendChild(managementUrlCell);
            row.appendChild(serviceUrlCell);

            // Append row to the table body
            tableBody.appendChild(row);

            // Fetch health status and number of instances asynchronously for each application
            fetch(application.healthUrl)
              .then(response => response.json())
              .then(healthData => {
                // Display health status and number of instances
                healthStatusCell.textContent = healthData.status;
                instancesCell.textContent = application.instances;
              })
              .catch(error => {
                // Handle error when fetching health status
                console.error(`Error fetching health status for ${application.name}: ${error}`);
                healthStatusCell.textContent = 'Error';
                instancesCell.textContent = 'N/A';
              });
          });
        })
        .catch(error => console.error(error));
    }

    // Get the environment select element


    const environmentSelect = document.querySelector('#environment-select');

    // Add event listener for environment change
    environmentSelect.addEventListener('change', () => {
      const selectedEnvironment = environmentSelect.value;
      fetchData(selectedEnvironment);
    });

    // Fetch data for the default environment on page load
    const defaultEnvironment = environmentSelect.value;
    fetchData(defaultEnvironment);
  </script>
</body>
</html>
```

