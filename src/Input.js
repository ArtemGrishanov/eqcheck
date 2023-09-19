import React, { useEffect, useState } from 'react';
import { MAX_INPUT_CHAR_COUNT } from './Config';
import { getDefaultPhrase, getRandomPhrase } from './Phrases'

export function Input({ onSend, onInputChanged, disabled }) {

    const [lastPhrase, setLastPhrase] = useState('');
    const [input, setInput] = useState('');

    useEffect(() => {
        const ph = getDefaultPhrase()
        setInput(ph)
        setLastPhrase(ph)
    }, [])

    const onChange = (event) => {
        if (!disabled) {
            setInput(event.target.value)
            onInputChanged()
        }
    }

    const onSendClick = () => {
        if (!disabled) {
            onSend(input)
        }
    }

    const onRandomClick = () => {
        if (!disabled) {
            let ph = getRandomPhrase()
            while (ph === lastPhrase) {
                ph = getRandomPhrase()
            }
            setInput(ph)
            setLastPhrase(ph)
            onInputChanged()
        }
    }

    return (
        <div className={''}>
            <div className='input_cols'>
                <div className='actions_wr'>
                    <div className='text_input'>
                        <textarea maxLength={MAX_INPUT_CHAR_COUNT} className={`send_input`} onChange={onChange} value={input}/>
                    </div>
                    {disabled &&
                        <button className='disabled'>Loading...</button>
                    }
                    {!disabled &&
                        <button onClick={onSendClick}>Evaluate</button>
                    }
                    <button className={disabled ? 'disabled': ''} onClick={onRandomClick}>Random phrase</button>
                </div>
                <p className='chars_counter'>
                    {input.length}/{MAX_INPUT_CHAR_COUNT}
                </p>
            </div>
        </div>
    );
}
