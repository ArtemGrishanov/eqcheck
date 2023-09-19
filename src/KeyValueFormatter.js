
/**
 * Returns array from the text like:
 *  `KeyA: valueA
 *   KeyB: valueB
 *   ...`
 *
 * @param {string} text
 * @return {array} [{key: 'KeyA', value: 'ValueA'}]
 */
export const parseKeyValueText = (text) => {
    const lines = text.split('\n').filter(l => !!l)
    const result = lines.map(l => {
        const match = new RegExp(/^([A-z\s-_]+):[\s+]?([0-9]+)$/, 'ig').exec(l)
        if (match[1] && match[2]) {
            return {key: match[1], value: match[2]}
        }
        throw new Error(`Cannot parse line ${l}`)
    })
    return result;
}

/**
 * Describes how output must be presented to be parsed
 * @returns {string}
 */
export const getKeyValueLLMinstructions = (keyAlias = 'key', valueAlias = 'value') =>
`Output: put each ${keyAlias} and ${valueAlias} on a new line. Do not add explanation or other text.
Output example:
KeyA: 5
KeyB: True
KeyC: ValueC`