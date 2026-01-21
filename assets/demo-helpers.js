window.baseUrl = "https://api.examplary.ai";

// Create some vars we can use
window.userId = "";
window.embedUrl = "";
window.examId = "";

// Make sure the API key is stored in localStorage so you only have to enter it once.
const apiKeyInput = document.querySelector("#api-key-input");
apiKeyInput.value = localStorage.getItem("examplaryApiKey") || "";
window.apiKey = apiKeyInput.value;
apiKeyInput.addEventListener("change", (el) => {
  const apiKey = el.target.value;
  localStorage.setItem("examplaryApiKey", apiKey);
  window.apiKey = apiKey;
});

// Function to log messages to the developer console panel.
const consoleOutput = document.querySelector("#console-output");
window.logToConsole = function (message) {
  consoleOutput.textContent += `\n${message}`;
  consoleOutput.parentNode.scrollTop = consoleOutput.scrollHeight;
};

// Hook into the global fetch function to log API requests and responses.
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  logToConsole(`\n\n→ ${init.method || "GET"} ${input.replace(baseUrl, "")}`);
  if (init && init.body) {
    logToConsole(JSON.stringify(JSON.parse(init.body), null, 2));
  }

  const response = await originalFetch(input, init);

  const statusIcon = response.ok ? "✓" : "✗";
  logToConsole(`\n← ${statusIcon} Response: ${response.status}`);
  const clonedResponse = response.clone();
  const responseBody = await clonedResponse.json();
  logToConsole(JSON.stringify(responseBody, null, 2));

  return response;
};
