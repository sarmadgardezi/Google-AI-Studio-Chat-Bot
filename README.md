# Gemini Chat - A Feature-Rich AI Chat Interface

![Gemini Chat Screenshot](/screenshot.png) <!-- Replace with an actual screenshot URL -->

This is a responsive and feature-rich chat application built with Next.js (App Router), Tailwind CSS, and powered by Google's Gemini AI models via API. It provides a clean, Google-inspired UI for interacting with AI, including features like chat history, model selection, daily usage limits, and Markdown rendering for AI responses.

## ✨ Features

*   **Responsive Design:** Adapts to various screen sizes.
*   **Google-Inspired UI:** Clean, modern, and intuitive interface.
*   **Chat History:** View previous messages in a scrollable chat window.
*   **AI Model Selection:** Choose between available Gemini models (e.g., Gemini 1.5 Flash, Gemini 1.5 Pro).
*   **Daily Usage Limit:**
    *   Limits users to 10 free AI responses per day.
    *   Tracks usage using `localStorage`, resetting daily.
    *   Visual progress bar shows current usage.
    *   Disables input when the limit is reached for the day.
*   **Markdown Rendering for AI Responses:**
    *   Beautifully formats AI responses containing Markdown.
    *   Supports headings, lists, blockquotes, inline code, and links.
    *   **Syntax Highlighting for Code Blocks:** Uses `react-syntax-highlighter` for clear code presentation.
    *   **Copy Code Button:** Easily copy code snippets from AI responses.
*   **Real-time Input & Sending:**
    *   Textarea for input with "Enter to send" (Shift+Enter for newline).
    *   Clear input button.
    *   Loading indicators during AI response generation.
*   **Clear Chat:** Option to clear the current chat conversation from the display.
*   **Error Handling:** Displays informative error messages from the API or network issues.
*   **Built with Modern Tech:**
    *   Next.js 13+ (App Router)
    *   React
    *   Tailwind CSS
    *   `react-markdown` for Markdown rendering
    *   `react-syntax-highlighter` for code highlighting

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm or yarn
*   A Google Cloud Project with the Vertex AI API enabled.
*   An API key or service account credentials configured to access the Gemini models. (This project assumes your backend API at `/api/chat` handles authentication).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gemini-chat.git
    cd gemini-chat
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up your API Endpoint:**
    This frontend expects a backend API endpoint at `/api/chat`. You'll need to create this endpoint in your Next.js project (e.g., `app/api/chat/route.ts` or `pages/api/chat.js` if using Pages Router for the API part).
    This backend should:
    *   Accept a `POST` request with a JSON body like: `{ "prompt": "Your question", "model": "gemini-1.5-flash-latest" }`.
    *   Securely call the Google Gemini API with the provided prompt and model.
    *   Return a JSON response like: `{ "text": "AI's response" }` or `{ "error": "Error message" }`.

    *Example structure for `app/api/chat/route.ts` (you'll need to implement the actual Google AI API call):*
    ```typescript
    // app/api/chat/route.ts
    import { NextRequest, NextResponse } from 'next/server';
    // Import necessary Google AI SDK clients

    export async function POST(req: NextRequest) {
      try {
        const body = await req.json();
        const { prompt, model } = body;

        if (!prompt || !model) {
          return NextResponse.json({ error: 'Prompt and model are required' }, { status: 400 });
        }

        // --- START: Implement your Google AI API call here ---
        // Example:
        // const aiResponse = await callYourGoogleAIFunction(prompt, model);
        // const text = aiResponse.candidates[0].content.parts[0].text;
        //
        // For this example, we'll simulate a response:
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
        const text = `This is a simulated response for your prompt: "${prompt}" using model "${model}".
It can even include **Markdown**!

\`\`\`javascript
console.log("Hello from Gemini!");
\`\`\`
        `;
        // --- END: Implement your Google AI API call here ---


        return NextResponse.json({ text });
      } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to get response from AI' }, { status: 500 });
      }
    }
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Project Structure

*   `app/page.tsx`: The main React component for the chat interface.
*   `app/api/chat/route.ts` (or similar): Your backend API route to interact with the Google Gemini API. (You need to create and implement this).
*   `tailwind.config.js`: Tailwind CSS configuration.
*   `public/`: Static assets.

## 🔧 Customization

*   **Models:** Update the `AVAILABLE_MODELS` array in `app/page.tsx` if you have access to different Gemini models.
*   **Styling:** Modify Tailwind CSS classes directly in `app/page.tsx` or update `tailwind.config.js` and global CSS files.
*   **API Endpoint:** If your backend API is at a different URL, update the `fetch` call in `handleSubmit` in `app/page.tsx`.
*   **Usage Limit:** Adjust `MAX_FREE_RESPONSES` in `app/page.tsx`.
*   **Markdown Components:** Customize the rendering of Markdown elements by modifying the `markdownComponents` object in `app/page.tsx`.
*   **Syntax Highlighting Theme:** Change the `okaidia` theme in the `code` renderer within `markdownComponents` to any other theme supported by `react-syntax-highlighter`.

## 🖼️ Screenshots

*(Consider adding 1-2 screenshots of your application here)*

*   Chat Interface: `/screenshot.png`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details (if you have one).

---

Built by **Sarmad Gardezi** with **Google AI Studio API's**.