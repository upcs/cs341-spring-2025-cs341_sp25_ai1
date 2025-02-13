


const { generateResponse } = require("./script");

//fetch API
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ response: "Test response" }),
    })
    );

    describe("Sick test", () => {
        const testCases = [
            {msg : "how are you feeling today?", expected: ["fever", "chills", "cough", "aches", "fatigue"]},
            
        ];

        testCases.forEach(({ msg, expected }) => {
            test('Test ${i + 1}: "${msg}"', async () => {
                global.userMessage = msg;
                const chatItem = document.createElement("li");
                await generateResponse(chatItem);
                expected(expected.some(word =>chatItem.innerHTML.includes(word))).toBe(true);
            });
        });
    });
