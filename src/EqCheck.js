import { parseKeyValueText, getKeyValueLLMinstructions } from './KeyValueFormatter';
import { buildEvaluationPrompt } from './Characteristics';
import { MAX_WORDS, OPEN_AI_MODEL_DEF_MODEL } from './Config';
import { fetchOpenAIResponse } from './Openai';

/**
 * Runs EQ check, building evaluation prompt.
 * Use "cold" temperature for evaluation tasks to get more stable results each time
 * @param {string} text
 * @returns Array
 */
export async function eqCheck(text) {
    const prompt = buildEvaluationPrompt(text, {outputFormat: getKeyValueLLMinstructions('characteristic name')})
    const words = prompt.split(' ').filter(t => !!t).length
    if (words > MAX_WORDS[OPEN_AI_MODEL_DEF_MODEL]) {
        alert(`Prompt max size exception: ${words} words found. Allowed: ${MAX_WORDS[OPEN_AI_MODEL_DEF_MODEL]} words. Please, split your requests.`)
        return
    }
    const evalResp = await fetchOpenAIResponse(null, [{content: prompt, role: 'user'}], {
        stream: false,
        model: OPEN_AI_MODEL_DEF_MODEL,
        temperature: 0
    })

    // Format the output
    // Note: many formatting libraries already are being developed (they are also unstable often), but keep code simple for 1st version
    try {
        const arr = parseKeyValueText(evalResp)
        if (Array.isArray(arr)) {
            return arr;
        }
    }
    catch(err) {
        alert(`Bad format. Please repeat request. Details: ${err.message}`)
    }

    //TODO Unformatted request. We can repeat request, or use more linient formatting rules
    return undefined
}

/**
 * Returns suggested text version fixing all 'errors'. Add temperature variability
 *
 * @param {string} text
 * @returns {string}
 */
export async function eqSuggestion(text) {
    const prompt = `Rewrite the following text concisely, correctly, respectfully, thoughtfully: "${text}"`;
    return await fetchOpenAIResponse(null, [{content: prompt, role: 'user'}], {
        stream: false,
        model: OPEN_AI_MODEL_DEF_MODEL,
        temperature: 1
    })
}