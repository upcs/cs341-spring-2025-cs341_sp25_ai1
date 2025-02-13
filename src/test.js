/**
 * @jest-environment jsdom
 */

// import toggleNotes from "./script";
const { toggleNotes } = require("./script");

function toggle_notes_test() {
       describe("Notes Toggle", () => {
              beforeEach(() => {
                     // set up the DOM element needed for the test
                     document.body.innerHTML = `<textarea id="notes-text-area" style="display: none;"></textarea>`;
              });

              // test cases
              test("should toggle notes visibility", () => {
                     const notes = document.getElementById("notes-text-area");

                     // notes textarea is initially hidden
                     expect(notes.style.display).toBe("none");

                     // first toggle (should become visible)
                     toggleNotes();
                     expect(notes.style.display).toBe("block");

                     // second toggle (should become hidden again)
                     toggleNotes();
                     expect(notes.style.display).toBe("none");
              });
       });
}

// run tests
toggle_notes_test();
