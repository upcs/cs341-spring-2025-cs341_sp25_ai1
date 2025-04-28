# SETAi: A Nursing ChatBot Tool

## Project Description
SETAi is a ChatBot tool designed to simulate patient interactions based on various medical case PDFs. The goal is to provide nursing students at the University of Portland a systematic way to practice patient interactions with diverse medical conditions. The tool uses a specialized Language Learning Model (LLM) to simulate patient symptoms, aiding in better diagnosis and communication skills for nursing students.

## Installation Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/SETAi.git
   cd SETAi
   ```

2. **Install necessary packages:**
   ```bash
   npm install
   ```

  Dependencies:

    @huggingface/transformers: "^3.4.1"

    @langchain/community: "^0.3.37"

    @langchain/core: "^0.3.43"

    @langchain/ollama: "^0.2.0"

    @langchain/openai: "^0.5.0"

    chromadb: "^2.1.0"

    cookie-parser: "~1.4.4"

    cors: "^2.8.5"

    debug: "~2.6.9"

    express: "^4.21.2"

    http-errors: "~1.6.3"

    jade: "~1.11.0"

    jquery: "^3.7.1"

    morgan: "~1.9.1"

    node-fetch: "^3.3.2"

## Running the Application
**Create the specialized LLM using Ollama**

Note that naming the model "patient-sim" is necessary.

```bash
ollama create patient-sim -f modelfile
```
**Using the ChromaDB CLI tool:**

Create a python virtual environment with the chromadb library installed using pip or another package manager.

```bash
python -m venv /path/to/new/virtual/environment
source ./bin/activate
pip install chromadb
```

While in your virtual environment run:

```bash
chroma run --path ./chroma/vectorstore &
```

**Start the server:**
```bash
npm start &
```

**Run the patient-sim model:**
```bash
ollama run patient-sim
```

**Access the web app:**

  Ensure you are connected to the University of Portland wifi network.

  Visit: http://cs341ai.campus.up.edu:3000/

## Usage Instructions

Launch the app and begin a new conversation with the ChatBot by selecting the "New Chat" option.

Ask questions regarding the patient's health or conditions.

The system will simulate a patient interaction, and nursing students can practice diagnosing and handling the case.

## Testing

To run tests for the project, execute the following commands:
```bash
npm run test
npm run test:unit
npm run test-llm
```
**Code Coverage**

[![codecov](https://codecov.io/gh/upcs/setai/branch/main/graph/badge.svg)](https://codecov.io/gh/upcs/setai/tree/codecov)

## Contributing

For contributions or further development, please contact Dr. Martin Cenek at the University of Portland.

## License

This project is licensed under the MIT License.

## Authors

    Reiss Oliveros - oliveros27@up.edu

    James Nguyen - nguyin25@up.edu

    Anthony Albelo - albelo27@up.edu

    Daniel Le - leda27@up.edu

    Chris Vo - voc27@up.edu

## Project Structure
- **public/**: Contains the front-end files (HTML, CSS, JS) responsible for webpage layout and functionality.
- **routes/**: Contains router files for handling back-end logic such as medical case instantiation and vector store querying.
- **tests/**: Contains unit tests for verifying functionality.
- **modelfile/**: Contains the model for creating the Ollama model used in the project.
- **bin/**: Contains executable files for running and managing the application.
- **chroma/**: Contains the Chroma database files and configuration used for vector storage.
- **node_modules/**: Contains all the installed node modules required for the application.
- **.github/**: Contains GitHub-related configuration and workflows for CI/CD.
- **.gitignore**: Specifies files and directories that should be ignored by Git.
- **chroma.log**: Log file for Chroma-related operations.
- **package-lock.json**: Lock file for npm dependencies.
- **package.json**: The npm configuration file with all the necessary dependencies and scripts.
- **app.js**: The main server file that initializes and runs the application.

## Future Work Plans

    Implement functionality to save chats and automatically submit them once the correct diagnosis is made.

    Allow professors to create class codes for preset sicknesses in the LLM.

    Enable the LLM to display images of symptoms (e.g., rashes, hives).

    Implement functionality for saving user notes into a database.

    Add user login, password authentication, and subscription models for premium LLM access.

    Implement persistent chat history.

## Screenshots
<img width="466" alt="SETAi_Code_Coverage" src="https://github.com/user-attachments/assets/6bd1a8da-171c-4cf7-a379-108bc37e123a" />
<img width="555" alt="SETAi_Demo_1" src="https://github.com/user-attachments/assets/a92deafc-27e8-4223-a75e-58e67568103b" />
<img width="554" alt="SETAi_Demo_2" src="https://github.com/user-attachments/assets/dc95c14b-21ee-431f-8174-e88bef4bd960" />

## Demo
https://github.com/user-attachments/assets/8a5035d5-9b2e-42de-ba72-036be2fac482

## Questions
For any questions, feel free to reach out to the authors or Dr. Martin Cenek for more details.
