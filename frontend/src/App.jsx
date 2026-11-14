import { useEffect, useState } from 'react'
import './App.css'

const questions = [
  {
    name: 'jewelryType',
    label: "What type of jewelry is it?",
    options: ['Bracelet', 'Ring', 'Necklace', 'Earrings', 'Brooch', 'Other', 'Unknown'],
  },
  {
    name: 'magnet',
    label: 'Does a magnet attract the jewelry?',
    options: ['Strong attraction', 'No attraction', 'Not tested'],
  },
  {
    name: 'surface',
    label: 'What do you notice about the surface?',
    options: ['Tarnish or patina', 'Other discoloration', 'None', 'Unsure'],
  },
  {
    name: 'weight',
    label: 'How does it feel in your hand?',
    options: ['Average', 'Heavy', 'Light', 'Unsure'],
  },
  {
    name: 'temperature',
    label: 'How did it feel when you first touched it?',
    options: ['Cool', 'Room temperature', 'Unknown'],
  },
  {
    name: 'sound',
    label: 'What sound did you notice when gently tapped?',
    options: ['Ringing', 'Dull', 'Other', 'Not tested'],
  },
  {
    name: 'stones',
    label: 'Are stones present?',
    options: ['Yes', 'No', 'Unsure']
  },
  {
    name: 'condition',
    label: 'What is the condition?',
    options: ['Good', 'Damaged', 'Unsure'],
  },
]

function PhotoThumbnail({ photo }) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    const objectUrl = URL.createObjectURL(photo)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [photo])

  return url ? <img className="photo-thumbnail" src={url} alt={photo.name} /> : null
}

function App() {
  const [screen, setScreen] = useState(1)
  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [assessmentError, setAssessmentError] = useState('')
  const [photos, setPhotos] = useState([])
  const [askingPrice, setAskingPrice] = useState('')
  const [answers, setAnswers] = useState({
    jewelryType: 'Unknown',
    hallmark: '',
    brand: '',
    magnet: 'Not tested',
    surface: 'Unsure',
    weight: 'Unsure',
    temperature: 'Unknown',
    sound: 'Not tested',
    stones: 'Unsure',
    stoneDescription: '',
    stoneBack: 'Unsure',
    condition: 'Unsure',
  })

  function addPhotos(event) {
    const selected = Array.from(event.target.files)
    setPhotos((current) => [...current, ...selected])
    event.target.value  = ''
  }

  function removePhoto(index) {
    setPhotos((current) => current.filter((_, i) => i !== index))
  }

  function updateAnswer(name, value) {
    setAnswers((current) => ({ ...current, [name]: value }))
  }

  async function assessJewelry() {
    setLoading(true)
    setAssessmentError('')
    setAssessment(null)
  
    const formData = new FormData()
    photos.forEach((photo) => formData.append('photos', photo))
    formData.append('askingPrice', askingPrice)
    formData.append('answers', JSON.stringify(answers))
  
    try {
      const response = await fetch('/api/assess', {
        method: 'POST',
        body: formData,
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.error || 'Assessment failed. Please try again.')
      }
  
      setAssessment(data.assessment)
      setScreen(3)
    } catch (error) {
      setAssessmentError(
        error.message || 'Could not connect to the assessment server.',
      )
    } finally {
      setLoading(false)
    }
  }
  
  const priceIsValid = askingPrice.trim() !== '' && Number.isFinite(Number(askingPrice)) && Number(askingPrice) >= 0
  
  return (
    <main className="app">
      <header>
        <p className="eyebrow">JEWELRY THRIFTING</p>
        <h1>The Thrill of the Hunt</h1>
        <p>Discover the potential of your jewelry find.</p>
      </header>
    
    { screen === 1 && (
      <section className="card">
        <p className="step">STEP 1 OF 3</p>
        <h2>Photograph &amp; Asking Price</h2>
        <p>Photograph one item. Include close-ups of markings or stones.</p>

        <label className="upload">
          Add photos
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={addPhotos}
          />
        </label>

        {photos.length > 0 && (
          <ul className="photo-list">
            {photos.map((photo, index) => (
              <li key={`${photo.name}-${index}`}>
                <PhotoThumbnail photo={photo} />
                <span>{photo.name}</span>
                <button type="button" onClick={() => removePhoto(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <label className="price-label" htmlFor="price">
          Asking price ($)
        </label>
        <input
          id="price"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          placeholder="0.00"
          value={askingPrice}
          onChange={(event) => setAskingPrice(event.target.value)}
        />

        <button 
          className="next-button" 
          type="button" 
          disabled={photos.length === 0 || !priceIsValid}
          onClick={() => setScreen(2)}
        >
          Continue
        </button>
        <p className="note">Add at least one photo and an asking price.</p>
      </section>
    )}

    {screen === 2 && (
      <section className="card">
        <p className="step">STEP 2 OF 3</p>
        <h2>Guided Jewelry Questions</h2>
        <p>Choose what you observed. It's fine to leave an answer unsure.</p>

        {questions.map((question) => (
          <div className="question" key={question.name}>
            <label htmlFor={question.name}>{question.label}</label>
            <select
              id={question.name}
              value={answers[question.name]}
              onChange={(event) =>
                updateAnswer(question.name, event.target.value)
              }
            >
              {question.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            {question.name === 'jewelryType' && (
              <>
                <label className="extra-label" htmlFor="hallmark">
                  Hallmark or marking
                </label>
                <input
                  id="hallmark"
                  type="text"
                  placeholder="For example, 925 or 14K"
                  value={answers.hallmark}
                  onChange={(event) =>
                    updateAnswer('hallmark', event.target.value)
                  }
                />
                <small>Leave blank if unknown. A marking is a clue.</small>

                <label className="extra-label" htmlFor="brand">
                  Maker or brand (optional)
                </label>
                <input 
                  id="brand"
                    type="text"
                    placeholder="Enter a name, if known"
                    value={answers.brand}
                    onChange={(event) =>
                      updateAnswer('brand', event.target.value)
                    }
                  />
              </>
            )}

            {question.name === 'stones' && answers.stones === 'Yes' && (
              <>
                <label className="extra-label" htmlFor="stoneBack">
                  Can you see the back of the stone through the setting?
                </label>
                <select
                  id="stoneBack"
                  value={answers.stoneBack}
                  onChange={(event) =>
                    updateAnswer('stoneBack', event.target.value)
                  }
                >
                  <option value="Unsure">Unsure</option>
                  <option value="Yes, the back is visible">
                    Yes, the back is visible
                  </option>
                  <option value="No, the setting covers the back">
                    No, the setting covers the back
                  </option>
                </select>
                <label className="extra-label" htmlFor="stoneDescription">
                  Describe the stones (optional)
                </label>
                <input
                  id="stoneDescription"
                  type="text"
                  placeholder="For example, small blue stones"
                  value={answers.stoneDescription}
                  onChange={(event) =>
                      updateAnswer('stoneDescription', event.target.value)
                  }
                />
              </>
            )}
          </div>
        ))}

        <button
          className="back-button"
          type="button"
          onClick={() => setScreen(1)}
        >
          Back to photos
        </button>

        <button className="next-button" type="button" onClick={assessJewelry} disabled={loading}>
          {loading ? 'Assessing jewelry…' : 'Assess jewelry'}
        </button>
        
        {assessmentError && (
          <p role="alert">{assessmentError}</p>
    )}
      
    {screen === 3 && (
      <section className="card">
        <p className="step">STEP 3 OF 3</p>
        <h2>Jewelry Assessment Results</h2>
    
        <div className="resale-estimate">
          <h3>Estimated resale range</h3>
          <p>Unavailable until market evidence is researched.</p>
          <p>Asking price: ${Number(askingPrice).toFixed(2)}</p>
        </div>

        <h3>Possible identification</h3>
        <p>{assessment.possible_item_name}</p>
    
        <h3>Possible material</h3>
        <p>{assessment.possible_material}</p>
  
        <h3>Possible stones</h3>
        <p>{assessment.possible_stones}</p>
    
        <h3>Possible age or style</h3>
        <p>{assessment.age_or_style}</p>
    
        <h3>Brand resemblance</h3>
        <p>{assessment.brand_resemblance}</p>
    
        <h3>Supporting observations</h3>
        <ul>
          {assessment.supporting_observations.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
  
        <h3>Uncertainties</h3>
        <ul>
          {assessment.uncertainties.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
  
        <h3>Suggested next checks</h3>
        <ul>
          {assessment.next_checks.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        
        <p className="note">
          Similar-item prices do not guarantee your piece will sell for the
          same amount. Actual resale depends on supply and demand, condition,
          authenticity, fees, and timing.
        </p>
    
        <button
          className="back-button"
          type="button"
          onClick={() => setScreen(2)}
        >
          Edit answers
        </button>
      </section>
    )}
    </main>
  )
}

export default App
