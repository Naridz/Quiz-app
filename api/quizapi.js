const URL = "https://webapi.icydune-a1052ab7.southeastasia.azurecontainerapps.io"

export async function createSession() {
    const res = await fetch(`${URL}/api/v1/Quiz/Session`,{
        method: 'POST'
    })
     if (!res.ok) {
    throw new Error(`Failed to create session: ${res.status}`);
  }
    const json = await res.json();
    console.log("createSession response:", json);
    return json.data;
}

export async function questions(sessionId) {
    const res = await fetch(`${URL}/api/v1/Quiz/Questions/${sessionId}`);
    return res.json()
}

export async function submitAnswer({sessionId, questionId, choiceId, timeSpent}) {
    const res = await fetch(`${URL}/api/v1/Quiz/Answer`, {
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({sessionId, questionId, choiceId, timeSpent}),
    })
    return res.json()
}

export async function summaryScore(sessionId) {
    const res = await fetch(`${URL}/api/v1/Quiz/Summary/${sessionId}`);
    return res.json()
}