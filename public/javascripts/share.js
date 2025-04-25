document.addEventListener('DOMContentLoaded', function() {
    const sharePdfBtn = document.getElementById('sharePdfBtn');
    const exportConfirm = document.getElementById('exportConfirm');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
    
    // Toggle export flap
    sharePdfBtn.addEventListener('click', toggleExportFlap);
    
    // Close export flap when clicking elsewhere
    document.addEventListener('click', handleOutsideClick);
    
    // Button handlers
    confirmYes.addEventListener('click', handleConfirmYes);
    confirmNo.addEventListener('click', handleConfirmNo);
    
    // Functions - exported at the bottom for testing
    function toggleExportFlap(e) {
        if (e) e.stopPropagation();
        exportConfirm.classList.toggle('show');
    }
    
    function handleOutsideClick(e) {
        if (!exportConfirm.contains(e.target) && e.target !== sharePdfBtn) {
            exportConfirm.classList.remove('show');
        }
    }
    
    function handleConfirmYes() {
        const defaultName = 'chat_conversation';
        const userFileName = prompt('Enter file name', defaultName);
        
        // proceed if user hit ok button
        if (userFileName !== null) {
            const fileName = userFileName.trim() ? userFileName.trim() + '.pdf' : defaultName + '.pdf';
            saveConversationAsPdf(fileName);
        }
        exportConfirm.classList.remove('show');
    }
    
    function handleConfirmNo() {
        exportConfirm.classList.remove('show');
    }
    
    // Save chat to PDF
    function saveConversationAsPdf(fileName) {
        // create container
        const exportContainer = document.createElement('div');
        exportContainer.style.cssText = 'display:flex; border:1px solid black;';
        
        // get elements
        const chatbox = document.querySelector('.chatbox');
        const notesArea = document.getElementById('notes-text-area');
        
        //add chat
        const chatClone = chatbox.cloneNode(true);
        chatClone.style.cssText = 'width:60%; border-right:1px solid black; padding-right:10px';
        
        // Set bot messages to white background and gray border
        chatClone.querySelectorAll('.chat-incoming .message-content').forEach(msg => {
            msg.style.backgroundColor = 'white';
            msg.style.color = 'black';
            msg.style.border = '1px solid gainsboro';
        });
        
        // user messages is purple and white text
        chatClone.querySelectorAll('.chat-outgoing .message-content').forEach(msg => {
            msg.style.backgroundColor = '#4835c4';
            msg.style.color = 'white';
        });
        
        exportContainer.appendChild(chatClone);
        
        // Add notes fi exist
        if (notesArea && notesArea.value){
            const notesDiv = document.createElement('div');
            notesDiv.style.cssText = 'width:35%; padding:10px; margin:0';
            
            const notesTitle = document.createElement('h3');
            notesTitle.textContent = 'Notes';
            
            const notesContent = document.createElement('div');
            notesContent.style.whiteSpace = 'pre-wrap';
            notesContent.textContent = notesArea.value;
            
            notesDiv.appendChild(notesTitle);
            notesDiv.appendChild(notesContent);
            exportContainer.appendChild(notesDiv);
        }
        
        // Make PDF
        html2pdf().from(exportContainer).set({
            margin: 5,
            filename: fileName,
            jsPDF: { orientation: 'landscape' }
        }).save();
    }
    
    // Export functions for testing
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            toggleExportFlap,
            handleOutsideClick,
            handleConfirmYes,
            handleConfirmNo,
            saveConversationAsPdf
        };
    }
}); 