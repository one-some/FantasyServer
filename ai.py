import requests

KAI_ENDPOINT = "http://localhost:5000/api/v1/generate"

def get_ai_response(path: str) -> str:
    # instruction = "Return the contents of the file."
    instruction = "Output."
    # if "." in path:

    payload = {
        "prompt": f"### Instruction: {instruction}\n" \
        f"### Input: {path}\n" \
        "### Response: "
    }

    print(payload["prompt"])

    r = requests.post(KAI_ENDPOINT, json=payload)
    j = r.json()
    try:
        out = j["results"][0]["text"]
        print(out)
        return out
    except:
        print(j)
        raise

