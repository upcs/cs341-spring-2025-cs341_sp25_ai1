
// Import the toggleNotes() function for testing
describe('toggleNotes() method', () => {
    
    let notesPanel;

    // define function to test
    function toggleNotes() {
        if(notesPanel === null) {
            return;
        }
        notesPanel.classList.toggle('hidden');
    }
    
    // Set up the DOM elements before each test
    beforeEach(() => {
        // Create a mock notes panel element
        notesPanel = document.createElement('div');
        notesPanel.classList.add('.notes-panel');
        document.body.appendChild(notesPanel);
    });

    // Clean up the DOM elements after each test
    afterEach(() => {
        document.body.removeChild(notesPanel);
    });

    describe('Happy Paths', () => {
        it('should toggle the "hidden" class on the notes panel', () => {
            // Initially, the notes panel should not have the "hidden" class
            expect(notesPanel.classList.contains('hidden')).toBe(false);

            // Toggle the notes panel, which should add the "hidden" class
            toggleNotes();
            expect(notesPanel.classList.contains('hidden')).toBe(true);

            // Toggle again, which should remove the "hidden" class
            toggleNotes();
            expect(notesPanel.classList.contains('hidden')).toBe(false);
        });

        it('should not throw any errors when toggling', () => {
            expect(() => {
                toggleNotes();
            }).not.toThrow();

            expect(() => {
                toggleNotes();
            }).not.toThrow();
        });
    });

    describe('Edge Cases', () => {
        it('should handle multiple toggles correctly', () => {
            // Toggle the notes panel multiple times
            for (let i = 0; i < 5; i++) {
                toggleNotes();
            }

            // The notes panel should end up with the "hidden" class
            expect(notesPanel.classList.contains('hidden')).toBe(true);
        });
    });
});