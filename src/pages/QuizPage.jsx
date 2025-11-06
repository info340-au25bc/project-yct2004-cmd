import React, { useState } from 'react'

const sampleQuestion = {
  id: 1,
  text: 'Which of the following is the primary purpose of a firewall in network security?',
  options: [
    { id: 'a', text: 'To encrypt data transmission between networks' },
    { id: 'b', text: 'To monitor and control incoming and outgoing network traffic' },
    { id: 'c', text: 'To authenticate users before granting network access' },
    { id: 'd', text: 'To provide backup storage for network data' }
  ],
  correct: 'b'
}

export default function QuizPage(){
  const [selected, setSelected] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e){
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main>
      <section className="quiz-header">
        <h2>Sample Quiz</h2>
        <p>Try a sample question below — this demonstrates a working interactive feature.</p>
      </section>

      <section className="quiz-question">
        <form onSubmit={handleSubmit} className="quiz-form">
          <fieldset>
            <legend>{sampleQuestion.text}</legend>
            {sampleQuestion.options.map(opt => (
              <label key={opt.id} className="option-label">
                <input type="radio" name="answer" value={opt.id} checked={selected===opt.id} onChange={()=>setSelected(opt.id)} />
                <span>{opt.text}</span>
              </label>
            ))}
          </fieldset>

          <div className="question-actions">
            <button type="submit" className="btn btn-primary" disabled={!selected}>Submit Answer</button>
          </div>
        </form>

        {submitted && (
          <div className="result">
            {selected === sampleQuestion.correct ? (
              <p className="correct">Correct! Well done.</p>
            ) : (
              <p className="incorrect">Incorrect. The correct answer is option {sampleQuestion.correct}.</p>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
