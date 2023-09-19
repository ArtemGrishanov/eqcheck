import "./App.css";
import { Input } from "./Input";
import { useState } from 'react';
import { eqCheck, eqSuggestion } from './EqCheck';
import { getColor } from './Characteristics';

function App() {

    const [evaluation, setEvaluation] = useState([])
    const [suggestion, setSuggestion] = useState('')
    const [inProgress, setInProgress] = useState(false)

    const onSend = async (value) => {
        setInProgress(true)
        const respEq = await eqCheck(value)
        setEvaluation(respEq
            .sort((a, b) => b.value - a.value)
            .map(r => {
            return {
                ...r,
                backgroundColor: getColor(r.key, r.value)
            }
        }))
        const respSuggestion = await eqSuggestion(value)
        setSuggestion(respSuggestion)
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
                <span>This app extracts text characteristics using ChatGPR LLM. </span>
                <span>Inspired by <a href="https://www.caura.co/eq-check/" target="_blank" rel="noopener noreferrer">Caura</a> project</span>
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
