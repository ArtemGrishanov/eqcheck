import { COMPLETION_API, OPEN_AI_KEY_BODY, OPEN_AI_MODEL_DEF_MODEL } from './Config';

/**
 * Stream mode controller to avoid two parallel requests
 */
let controller

/**
 * Basic method to communicate with openai
 */
export async function fetchOpenAIResponse(callback, messages, options = {stream: true, model: OPEN_AI_MODEL_DEF_MODEL, temperature: 1, key: OPEN_AI_KEY_BODY}) {
    try {
        if (controller && controller.signal.aborted !== true) {
            // avoid two parallel openai requests
            controller.abort();
        }
        controller = new AbortController();

        const headers = {
            "Content-Type": "application/json",
            "Accept": "text/event-stream"
        }

        if (options.key && COMPLETION_API.indexOf('api.openai.com') >= 0) {
            // for direct openai calls only
            headers['Authorization'] = `Bearer ${!options.key.startsWith('sk-') ? `sk-${options.key}`: options.key}`
        }

        const response = await fetch(COMPLETION_API, {
            signal: controller.signal,
            method: "POST",
            cache: "no-cache",
            keepalive: true,
            headers: headers,
            body: JSON.stringify({
                'model': options.model,
                'messages': messages.map((msg) => { return {role: msg.role, content: msg.content} }),
                'stream': options.stream,
                'temperature': options.temperature
            })
        });

        if (options.stream) {
            const reader = response.body.getReader();
            let result = {fullString: '', role: ''}

            while (true) {
                const {value, done} = await reader.read();
                if (done) {
                    callback({content: result.fullString, role: result.role, abortController: controller, done: true})
                    break;
                }

                const s = new TextDecoder().decode(value)
                if (s.indexOf('data:') === 0) {
                    // Direct request to open ai
                    const lines = s.split('\n')
                    // there are maybe few lines in one server event
                    result = lines.reduce(parseLine, result)
                }
                else {
                    result = {
                        fullString: result.fullString + s,
                        role: 'assistant'
                    }
                }
                callback({content: result.fullString, role: result.role, abortController: controller})
            }
        }
        else {
            const data = await response.json();
            return data.choices[0].message.content;
        }
    }
    catch (err) {
        if (err.name === 'AbortError') {
            console.warn('Open ai request aborted')
        }
    }
}

const parseLine = ({fullString, role}, line) => {
    const tLine = line.replace('data:', '').trim()
    if (tLine.length) {
        let o = {}

        try {
            o = JSON.parse(tLine)
        }
        catch(err) {}

        if (o.choices && o.choices.length > 0 && o.choices[0].delta) {
            const delta = o.choices[0].delta
            if (delta.content) {
                const chunk = delta.content
                fullString += chunk
            }

            if (delta.role) {
                role = delta.role
            }
        }
    }

    return {
        fullString: fullString,
        role: role
    }
}