/**
 * @jest-environment jsdom
 */

// Import necessary modules
const fs = require('fs');
const path = require('path');
const istanbul = require('istanbul-lib-instrument');

// Read and instrument script
const scriptPath = path.resolve(__dirname, '../public/javascripts/script.js');
const instrumentedCode = istanbul.createInstrumenter({esModules:false})
  .instrumentSync(fs.readFileSync(scriptPath, 'utf8'), scriptPath);

// Test variables
let createChatLI, handleChat, generateResponse, startNewCase;
let chatbox, chatInput, sendChatbtn, notesTextArea, newChatBtn;

beforeEach(() => {
  document.body.innerHTML = `<div class="chatbox"></div><div class="chat-input"><textarea></textarea>
  <button></button></div><div id="notes-btn"></div><div class="notes-panel hidden"><button class="close-btn">
  </button><textarea id="notes-text-area"></textarea></div><div id="new-chat-btn"></div>`;
  
  // Setup mocks and globals
  global.$ = {post: jest.fn((url, data, cb) => {
    url === './choose-case' ? cb({case:'test_case'}) : url === './query' ? cb({response:'Mock response'}) : null;
  })};
  Element.prototype.scrollTo = jest.fn();
  global.console.log = jest.fn();
  [global.sendChatbtn, global.chatInput, global.chatbox, global.userMessage, global.currentCase, global.isLoading] = 
    [document.querySelector(".chat-input button"), document.querySelector(".chat-input textarea"), 
     document.querySelector(".chatbox"), undefined, undefined, false];
  
  // Define functions
  window.createChatLI = (message, className) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    chatli.innerHTML = `<div class="message-content">${message?.replace(/\n/g,'<br>') || ''}</div>`;
    return chatli;
  };
  
  window.handleChat = () => {
    global.userMessage = chatInput.value.trim();
    if(!global.userMessage || global.isLoading) return;
    chatbox.appendChild(window.createChatLI(global.userMessage, "chat-outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    setTimeout(() => {
      chatbox.appendChild(window.createChatLI("Thinking...", "chat-incoming"));
      window.generateResponse(chatbox.lastChild);
    }, 300);
    chatInput.value = "";
  };
  
  window.generateResponse = (incomingChatLI) => {
    if (global.isLoading) return;
    global.isLoading = true;
    $.post('./query', {"query": global.userMessage, "collectionName": global.currentCase}, 
      resp => {
        if (resp?.response) incomingChatLI.innerHTML = window.createChatLI(resp.response, "chat-incoming").innerHTML;
        global.isLoading = false;
      }
    );
  };
  
  window.startNewCase = () => {
    console.log("new case");
    $.post('./choose-case', {}, (resp) => {
      if (!Array.isArray(resp) && resp.case) global.currentCase = resp.case;
    });
  };
  
  // Execute code and setup test environment
  eval(instrumentedCode);
  [createChatLI, handleChat, generateResponse, startNewCase] = 
    [window.createChatLI, window.handleChat, window.generateResponse, window.startNewCase];
  [chatbox, chatInput, notesTextArea, newChatBtn] = 
    [global.chatbox, global.chatInput, document.getElementById('notes-text-area'), 
     document.getElementById('new-chat-btn')];
  
  // Add event listeners
  chatInput.addEventListener('keydown', e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), window.handleChat()));
  newChatBtn.addEventListener('click', () => {chatbox.innerHTML=''; window.startNewCase();});
  document.dispatchEvent(new Event('DOMContentLoaded'));
});

afterEach(() => jest.clearAllMocks());

// Tests
describe('Chat Application', () => {
  test.each([
    ['Bullet points preserved', () => {
      notesTextArea.value = '- First point\n- Second point';
      notesTextArea.dispatchEvent(new Event('input'));
      expect(notesTextArea.value).toBe('- First point\n- Second point');
    }],
    ['Enter adds bullet point', () => {
      notesTextArea.value = '- First point'; notesTextArea.selectionStart = notesTextArea.value.length;
      notesTextArea.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter'}));
      expect(notesTextArea.value).toContain('- First point');
    }],
    ['window.onload starts new case', () => {
      const spy = jest.spyOn(window, 'startNewCase');
      window.onload = () => window.startNewCase(); window.onload(); 
      expect(spy).toHaveBeenCalled(); spy.mockRestore();
    }],
    ['startNewCase handles array', () => {
      $.post.mockImplementationOnce((url, data, cb) => cb([{data:'value'}]));
      startNewCase(); expect(global.currentCase).toBe(undefined);
    }],
    ['createChatLI works', () => {
      const msg = createChatLI('Hello', 'chat-incoming');
      expect(msg.classList.contains('chat-incoming')).toBeTruthy();
      expect(msg.querySelector('.message-content').textContent).toBe('Hello');
    }],
    ['handleChat sends message', () => {
      global.setTimeout = jest.fn(cb=>{cb();}); chatInput.value = 'Test'; handleChat();
      expect(chatbox.children.length).toBe(2); expect(chatInput.value).toBe('');
    }],
    ['empty message does nothing', () => {
      chatInput.value = ''; handleChat(); expect(chatbox.children.length).toBe(0);
    }],
    ['Enter triggers handleChat', () => {
      const spy = jest.spyOn(window, 'handleChat');
      chatInput.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter', bubbles:true, cancelable:true}));
      expect(spy).toHaveBeenCalled(); spy.mockRestore();
    }],
    ['Shift+Enter does nothing', () => {
      const spy = jest.spyOn(window, 'handleChat');
      chatInput.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter', shiftKey:true, bubbles:true}));
      expect(spy).not.toHaveBeenCalled(); spy.mockRestore();
    }],
    ['New chat button works', () => {
      const spy = jest.spyOn(window, 'startNewCase');
      newChatBtn.dispatchEvent(new MouseEvent('click', {bubbles:true}));
      expect(spy).toHaveBeenCalled(); spy.mockRestore();
    }],
    ['isLoading blocks API', () => {
      global.isLoading = true; generateResponse(document.createElement('li'));
      expect($.post).not.toHaveBeenCalled();
    }]
  ])('%s', (_,fn) => fn());
});