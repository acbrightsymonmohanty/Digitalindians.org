/**
 * Gemini API Integration
 * This file handles communication with Google's Gemini API for AI responses
 */

// Store the API key securely - in production, this should be handled by environment variables
// and not exposed in client-side code
const GEMINI_API_KEY = "AIzaSyATf6-RvvATG9zWYBngspUgbSAXMeqqPtA";

// Gemini API endpoint - updated to use the correct version
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

/**
 * Send a query to the Gemini API and get a response
 * @param {string} query - The user's question
 * @returns {Promise<string>} - The AI response
 */
async function getGeminiResponse(query) {
    try {
        console.log("Sending request to Gemini API...");
        
        // Prepare the request body
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: query
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };
        
        console.log("Request body:", JSON.stringify(requestBody));
        console.log("API URL:", `${GEMINI_API_URL}?key=${GEMINI_API_KEY.substring(0, 5)}...`);
        
        // Make the API request
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log("API response status:", response.status);
        
        // Check if the request was successful
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API error:", errorData);
            throw new Error(`Gemini API error: ${errorData.error?.message || "Unknown error"}`);
        }
        
        // Parse the response
        const data = await response.json();
        console.log("API response data structure:", Object.keys(data));
        
        // Extract the text response
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!textResponse) {
            console.error("No text response found in API response:", data);
            throw new Error("No text response found in the API response");
        }
        
        console.log("Successfully received response from Gemini API");
        return textResponse;
    } catch (error) {
        console.error("Error getting Gemini response:", error);
        return "I'm sorry, I encountered an error while processing your request. Please try again later.";
    }
}

/**
 * Format the Gemini API response for display in the chat
 * @param {string} response - The raw response from the API
 * @returns {string} - Formatted HTML for display
 */
function formatGeminiResponse(response) {
    if (!response) return '<p>No response data available.</p>';
    
    // Process markdown-like elements
    let formattedText = response;
    
    // Step 1: Process code blocks with ```
    formattedText = formattedText.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Step 2: Process inline code with backticks
    formattedText = formattedText.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Step 3: Format headings (# Heading)
    formattedText = formattedText.replace(/^# (.*$)/gm, '<h1 class="response-title">$1</h1>');
    formattedText = formattedText.replace(/^## (.*$)/gm, '<h2 class="response-subtitle">$1</h2>');
    formattedText = formattedText.replace(/^### (.*$)/gm, '<h3 class="response-heading">$1</h3>');
    
    // Step 4: Format blockquotes
    formattedText = formattedText.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    // Step 5: Handle lists and paragraphs
    let lines = formattedText.split('\n');
    let inList = false;
    let listType = null;
    let formattedLines = [];
    
    for (let line of lines) {
        // Check for unordered list items (only at start of line)
        if (line.trim().match(/^[-•] /)) {
            if (!inList || listType !== 'ul') {
                if (inList) {
                    formattedLines.push(`</${listType}>`);
                }
                formattedLines.push('<ul>');
                inList = true;
                listType = 'ul';
            }
            line = line.replace(/^[-•] /, '');
            // Remove any remaining asterisks from the list item text
            line = line.replace(/\*\*/g, '').replace(/\*/g, '');
            formattedLines.push(`<li>${line}</li>`);
        }
        // Check for ordered list items
        else if (line.trim().match(/^\d+\. /)) {
            if (!inList || listType !== 'ol') {
                if (inList) {
                    formattedLines.push(`</${listType}>`);
                }
                formattedLines.push('<ol>');
                inList = true;
                listType = 'ol';
            }
            line = line.replace(/^\d+\. /, '');
            // Remove any remaining asterisks from the list item text
            line = line.replace(/\*\*/g, '').replace(/\*/g, '');
            formattedLines.push(`<li>${line}</li>`);
        }
        // Handle non-list lines
        else {
            if (inList) {
                formattedLines.push(`</${listType}>`);
                inList = false;
            }
            if (line.trim() === '') {
                formattedLines.push('<br>');
            } else {
                // Remove asterisks from regular text
                line = line.replace(/\*\*/g, '').replace(/\*/g, '');
                formattedLines.push(`<p>${line}</p>`);
            }
        }
    }
    
    // Close any open list
    if (inList) {
        formattedLines.push(`</${listType}>`);
    }
    
    return formattedLines.join('\n');
}

// Helper function to escape HTML special characters
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}