import { useState } from 'react'
import './App.css'

function App() {
  const [photos, setPhotos] = useState([])
  const [askingPrice, setAskingPrice] = useState('')

  function addPhotos(event) {
    const selected = Array.from(event.target.files)
    setPhotos((current) => [...current, ...selected])
    event.target.value  = ''
  }

  function removePhoto(index) {
    setPhotos((current) => current.filter((_, i) => i !== index))
  }

  return (
    <main className="app">
      <header>
        <p className="eyebrow">JEWELRY THRIFTING</p>
        <h1>The Thrill of the Hunt</h1>
        <p>Discover the potential of your jewelry find.</p>
      </header>

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

        <button className="next-button" type="button" disabled>
          Continue
        </button>
        <p className="note">The questions screen is coming next.</p>
      </section>
    </main>
  )
}

export default App
