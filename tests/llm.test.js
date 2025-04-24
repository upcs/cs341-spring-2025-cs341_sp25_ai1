const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const assert = require("assert");


const API_URL = "http://localhost:11434/api/generate"; // Update this if needed

const tests = [
  {
    prompt: "Hi there.",
    expect: "any" // Just expect a response
  },
  {
    prompt: "Can you describe how you're feeling?",
    expectIncludes: ["hurt", "not good", "bad", "pain", "tired"] 
  },
  {
    prompt: "Do you need help?",
    expect: "any"
  },
  {
    prompt: "When did you start feeling this way?",
    expectIncludes: ["yesterday", "last night", "this morning", "a few hours"]
  },
  {
    prompt: "Can you stand up okay?",
    expectIncludes: ["hard", "dizzy", "not sure", "weak", "tried"]
  }
];

async function runLLMTest(prompt) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "patient-sim",
      prompt: prompt,
      stream: false
    })
  });

  const data = await res.json();
  return data.response || data.output || "";
}

(async () => {
  for (const test of tests) {
    console.log(`\n Prompt: "${test.prompt}"`);
    try {
      const response = await runLLMTest(test.prompt);
      console.log(` Response: "${response}"`);

      // Basic response test
      assert(response && typeof response === "string" && response.length > 0, "Response was empty or invalid");

      // If we expect it to include specific phrases
      if (test.expectIncludes) {
        const match = test.expectIncludes.some(word => response.toLowerCase().includes(word));
        assert(match, `Expected response to include one of: ${test.expectIncludes.join(", ")}`);
      }

      console.log(" Test passed!");
    } catch (err) {
      console.error(` Test failed: ${err.message}`);
    }
  }
})();
