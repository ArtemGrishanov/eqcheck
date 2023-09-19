import { useState } from 'react';
import "./App.css";
import { Input } from "./Input";
import { eqCheck, eqSuggestion } from './EqCheck';
import { getColor } from './Characteristics';
import { OPEN_AI_KEY_BODY } from './Config';

function App() {

    const [evaluation, setEvaluation] = useState([])
    const [suggestion, setSuggestion] = useState('')
    const [inProgress, setInProgress] = useState(false)
    const [key, setKey] = useState('sk-'+OPEN_AI_KEY_BODY);

    const onSend = async (value) => {
        setInProgress(true)
        const respEq = await eqCheck(value, key)
        if (respEq) {
            setEvaluation(respEq
                .sort((a, b) => b.value - a.value)
                .map(r => {
                return {
                    ...r,
                    backgroundColor: getColor(r.key, r.value)
                }
            }))
            const respSuggestion = await eqSuggestion(value, key)
            setSuggestion(respSuggestion)
        }
        setInProgress(false)
    }

    const onInputChanged = () => {
        setEvaluation()
        setSuggestion('')
    }

    return (
        <div className="App">
            <div>
                <h2>EQ Check</h2>
                <span>This app extracts text characteristics using ChatGPR LLM. </span><br/>
                <span>Inspired by <a href="https://www.caura.co/eq-check/" target="_blank" rel="noopener noreferrer">Caura</a> project</span><br/>
                <span>It prints text characteristics after analysis with weight in range 1-10</span>
            </div>
            <div>
                <p>OpenAI API Key: <input value={key} onInput={e => setKey(e.target.value)}/></p>
            </div>
            <div>
                <p>Enter the text to be evaluated</p>
            </div>
            <div>
                <Input onSend={onSend} onInputChanged={onInputChanged} disabled={inProgress}></Input>
            </div>
            <div className='evaluation_panel'>
                <p>Text evaluation results</p>
                <div>
                    {(!evaluation || evaluation.length === 0) && <span className='help'>Hint: click "Evaluate" button to get results</span>}
                    {evaluation && evaluation.map(ev => <span
                        key={ev.key}
                        style={(ev.backgroundColor)? {backgroundColor: ev.backgroundColor}: {}}
                        className='character'>
                            {`${ev.key} (${ev.value})`}
                        </span>
                    )}
                </div>
                <p>Suggested version of the input text</p>
                <div>
                    {!suggestion && <span className='help'>no suggestion</span>}
                    <i>{suggestion}</i>
                </div>
            </div>
        </div>
    )
}

export default App
