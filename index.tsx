/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';

// --- CONFIGURATION --- //
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error('API_KEY is not set in environment variables.');
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- MAP CONSTANTS --- //
// Approximate bounding box for Bengaluru map visualization
const MAP_BOUNDS = {
    latMin: 12.82,
    latMax: 13.15,
    lngMin: 77.45,
    lngMax: 77.78,
};

// --- TYPE DEFINITIONS --- //
type GeoLocation = {
  lat: number;
  lng: number;
};

type EventCategory =
  | 'Traffic'
  | 'Civic Issue'
  | 'Community Event'
  | 'Safety Hazard'
  | 'Other';

type EventReport = {
  id: string;
  userDescription: string;
  userImage?: {
    base64: string;
    mimeType: string;
  };
  location: GeoLocation;
  timestamp: string;
  ai: {
    title: string;
    summary: string;
    category: EventCategory;
  };
};

// --- SAMPLE DATA --- //
const sampleEvents: EventReport[] = [
    {
        id: 'sample-1',
        userDescription: 'Huge traffic jam near Silk Board junction due to a broken down bus.',
        location: { lat: 12.917, lng: 77.624 },
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        ai: {
            title: 'Heavy Traffic at Silk Board',
            summary: 'A broken-down bus is causing a major traffic jam near the Silk Board junction.',
            category: 'Traffic',
        },
    },
    {
        id: 'sample-2',
        userDescription: 'Waterlogging in 5th block Koramangala after the heavy rain.',
        location: { lat: 12.935, lng: 77.624 },
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        ai: {
            title: 'Waterlogging in Koramangala',
            summary: 'Heavy rainfall has led to significant waterlogging in Koramangala 5th Block.',
            category: 'Civic Issue',
        },
    },
    {
        id: 'sample-3',
        userDescription: 'A free concert is happening at Cubbon Park near the central library.',
        location: { lat: 12.975, lng: 77.592 },
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        ai: {
            title: 'Concert in Cubbon Park',
            summary: 'A live music event is currently underway in Cubbon Park for the public.',
            category: 'Community Event',
        },
    },
     {
        id: 'sample-4',
        userDescription: 'A large, dangerous pothole has formed on MG Road near the metro station.',
        location: { lat: 12.9759, lng: 77.6068 },
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        ai: {
            title: 'Large Pothole on MG Road',
            summary: 'A hazardous pothole requires immediate attention on MG Road, posing a risk to vehicles.',
            category: 'Safety Hazard',
        },
    }
];


// --- APPLICATION STATE --- //
const appState = {
  events: [...sampleEvents] as EventReport[],
  isModalOpen: false,
  isSubmitting: false,
  error: null as string | null,
  form: {
    description: '',
    image: null as { base64: string; mimeType: string } | null,
    location: null as GeoLocation | null,
  },
};

// --- ICONS --- //
const ICONS: Record<EventCategory, string> = {
  Traffic: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M20 22a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M15 4h5l-2 4h-3V4Z"/><path d="M5 4h5v4H5Z"/><path d="m15 12-3.5 4-3.5-4"/><path d="M5 12h14"/></svg>`,
  'Civic Issue': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M13 2v7h7"/><path d="M16 13h-4"/><path d="M16 17h-4"/><path d="m10 13-1 1 1 1"/></svg>`,
  'Community Event': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.3-.8.8l1.8 8.4 13-5.2Z"/><path d="M5 12.5 13 18l6-6-8-2-4 2Z"/><path d="M11 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1Z"/></svg>`,
  'Safety Hazard': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  Other: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z"/><path d="M8.5 10.5h7"/><path d="M8.5 14.5h4"/></svg>`,
};

// --- DOM ELEMENTS --- //
const appRoot = document.getElementById('app')!;

// --- RENDER FUNCTIONS --- //
function render() {
  const { events } = appState;
  appRoot.innerHTML = `
    <div class="main-container">
      <aside class="feed-panel">
        <header class="feed-header">
          <h1>City Pulse</h1>
          <p>Live Synthesized Events from Bengaluru</p>
        </header>
        <div class="event-feed" id="event-feed">
          ${
            events.length === 0
              ? '<p style="text-align: center; margin-top: 2rem; opacity: 0.7;">No events reported yet. Be the first!</p>'
              : events.map(renderEventCard).join('')
          }
        </div>
      </aside>
      <main class="map-panel" id="map-panel">
        ${events.map(renderMapMarker).join('')}
      </main>
    </div>
    <button class="report-fab" id="report-fab" aria-label="Report new event">+</button>
    ${renderModal()}
    <div id="toast" class="toast"></div>
  `;
  attachEventListeners();
}

function renderEventCard(event: EventReport): string {
  const { id, ai, timestamp } = event;
  const icon = ICONS[ai.category] || ICONS.Other;
  return `
    <div class="event-card" id="event-${id}">
      <div class="event-card-header">
        <span class="event-icon">${icon}</span>
        <h3 class="event-title">${ai.title}</h3>
      </div>
      <p class="event-summary">${ai.summary}</p>
      <div class="event-footer">
        <span>${ai.category} &bull; ${new Date(timestamp).toLocaleString()}</span>
      </div>
    </div>
  `;
}

function renderMapMarker(event: EventReport): string {
    const { id, location, ai } = event;
    const { latMin, latMax, lngMin, lngMax } = MAP_BOUNDS;
    
    // Check if the location is within the defined map bounds
    if (location.lat < latMin || location.lat > latMax || location.lng < lngMin || location.lng > lngMax) {
      return ''; // Don't render marker if it's outside the map area
    }

    const latRange = latMax - latMin;
    const lngRange = lngMax - lngMin;

    // Y position (latitude). Higher lat should be higher on map (smaller top %).
    const top = (1 - (location.lat - latMin) / latRange) * 100;
    // X position (longitude).
    const left = ((location.lng - lngMin) / lngRange) * 100;

    const icon = ICONS[ai.category] || ICONS.Other;

    return `
      <div class="map-marker" id="marker-${id}" style="top: ${top}%; left: ${left}%;" title="${ai.title}">
        <span class="event-icon">${icon}</span>
      </div>
    `;
}

function renderModal(): string {
  const { isModalOpen, isSubmitting } = appState;
  const submitDisabled = isSubmitting ? 'disabled' : '';
  return `
    <div class="modal-overlay ${isModalOpen ? 'visible' : ''}" id="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Report an Event</h2>
          <button class="close-button" id="close-modal-btn" aria-label="Close modal">&times;</button>
        </div>
        <form id="report-form">
          <div class="form-group">
            <label for="description">What's happening?</label>
            <textarea id="description" name="description" required rows="4"></textarea>
          </div>
          <div class="form-group">
            <label>Add a photo (optional)</label>
            <input type="file" id="image-upload" accept="image/*" style="display: none;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('image-upload').click()">Upload Image</button>
            <img id="image-preview" class="image-preview" style="display: none;" alt="Image preview">
          </div>
           <div class="form-group">
            <label>Location</label>
            <p id="location-status">Click the button to get your location.</p>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" id="get-location-btn">Get My Location</button>
            <button type="submit" class="btn btn-primary" id="submit-btn" ${submitDisabled}>
              ${isSubmitting ? '<span class="loader"></span> Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function updateFeed(event: EventReport) {
    const feed = document.getElementById('event-feed')!;
    const map = document.getElementById('map-panel')!;
    const placeholder = feed.querySelector('p');
    if (placeholder && appState.events.length === 1) { // Check if it's the first real event after samples
        placeholder.remove();
    }
    feed.insertAdjacentHTML('afterbegin', renderEventCard(event));
    map.insertAdjacentHTML('beforeend', renderMapMarker(event));
}

// --- EVENT HANDLERS & LOGIC --- //
function attachEventListeners() {
  document.getElementById('report-fab')?.addEventListener('click', openModal);
  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('report-form')?.addEventListener('submit', handleFormSubmit);
  document.getElementById('image-upload')?.addEventListener('change', handleImageChange);
  document.getElementById('get-location-btn')?.addEventListener('click', handleGetLocation);
}

function openModal() {
  appState.isModalOpen = true;
  document.getElementById('modal-overlay')?.classList.add('visible');
  render(); // Re-render to show modal correctly
}

function closeModal() {
  appState.isModalOpen = false;
  appState.form = { description: '', image: null, location: null }; // Reset form
  document.getElementById('modal-overlay')?.classList.remove('visible');
  render();
}

async function handleFormSubmit(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;

  if (!description || !appState.form.location) {
    showToast('Please provide a description and location.', 'error');
    return;
  }
  
  appState.isSubmitting = true;
  render(); // Re-render to show loading state

  try {
    const aiResponse = await callGeminiAPI(description, appState.form.image);
    
    let parsedResponse;
    try {
        let jsonStr = aiResponse.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        parsedResponse = JSON.parse(jsonStr);
    } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        throw new Error("AI returned an invalid format.");
    }

    const newEvent: EventReport = {
        id: new Date().getTime().toString(),
        userDescription: description,
        userImage: appState.form.image || undefined,
        location: appState.form.location,
        timestamp: new Date().toISOString(),
        ai: {
            title: parsedResponse.title || 'Untitled Event',
            summary: parsedResponse.summary || 'No summary available.',
            category: parsedResponse.category || 'Other',
        },
    };

    appState.events.unshift(newEvent);
    appState.isSubmitting = false;
    updateFeed(newEvent); // Efficiently add new event without full re-render
    closeModal();
  } catch (error) {
    console.error('Error submitting report:', error);
    showToast(error instanceof Error ? error.message : 'An unknown error occurred.', 'error');
    appState.isSubmitting = false;
    render(); // Re-render to reset button
  }
}

function handleImageChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const base64 = (reader.result as string).split(',')[1];
    appState.form.image = { base64, mimeType: file.type };
    const preview = document.getElementById('image-preview') as HTMLImageElement;
    preview.src = `data:${file.type};base64,${base64}`;
    preview.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function handleGetLocation() {
    if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser.', 'error');
        return;
    }
    const locationStatus = document.getElementById('location-status')!;
    locationStatus.textContent = 'Getting location...';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            appState.form.location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            locationStatus.textContent = `Location captured: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
            locationStatus.style.color = 'var(--secondary)';
        },
        () => {
            showToast('Unable to retrieve your location. Please enable location services.', 'error');
            locationStatus.textContent = 'Could not get location.';
            locationStatus.style.color = 'var(--error)';
        }
    );
}

async function callGeminiAPI(description: string, image: { base64: string; mimeType: string } | null) {
  const prompt = `
    You are an intelligent city monitoring agent for Bengaluru. Your task is to analyze a user's report (text and possibly an image) and provide a concise, structured summary.
    
    Analyze the following report. Based on the text and image (if provided), provide the following in a single, raw JSON object format, without any markdown fences like \`\`\`json:
    1. A short, descriptive title for the event (e.g., "Tree Blocking Road on 12th Main").
    2. A one-sentence summary of the situation.
    3. A category for the event from this exact list: 'Traffic', 'Civic Issue', 'Community Event', 'Safety Hazard', 'Other'.

    User description: "${description}"

    Your response MUST be only the JSON object.
  `;
  
  const parts: ({ text: string; } | { inlineData: { data: string; mimeType: string; }; })[] = [
      { text: prompt }
  ];

  if (image) {
      parts.push({
          inlineData: {
              data: image.base64,
              mimeType: image.mimeType,
          },
      });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-04-17',
    contents: { parts },
    config: {
        responseMimeType: "application/json"
    }
  });

  return response;
}

function showToast(message: string, type: 'success' | 'error' = 'error') {
    const toast = document.getElementById('toast')!;
    toast.textContent = message;
    toast.style.backgroundColor = type === 'error' ? 'var(--error)' : 'var(--secondary)';
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- INITIALIZE APP --- //
document.addEventListener('DOMContentLoaded', render);
