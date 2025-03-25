import requests

OLLAMA_API_URL = "http://localhost:11434/api/generate"

def test_symptoms():
    prompt = "Hello! can you tell my what is wrong?"
    response = requests.post(OLLAMA_API_URL, json={
        "model": "patient",
        "prompt": prompt,
        "stream": False
    })
    data = response.json()  
    output = data['response'].lower()

    print("MODEL RESPONSE:", output)  #Add this for debugging

    # Check if the output contains the expected symptoms
    assert "I don't know" in output or "I am not sure" in output or "patient should not know diagnosis" in output
    assert any(symptom in output for symptom in ["high fever", "chills", "persistent cough", "body aches", "extreme fatigue"]), "Must mention at least one of the symptoms"
    assert "I think" not in output, "Should not make a diagnosis"
    assert "doctor" not in output, "Should not mention a doctor"