import React from 'react';
import './Journey.css';

/**
 * Transform Nok Air API data into a flattened array of flight rows.
 * Each row includes departure/arrival times, duration, flight info, fare info, and journey key.
 */
export function flattenFlights(apiData) {
  const rows = [];
  // Support both possible key names for journeys (e.g., "Journeys" or "journeys")
  const journeys = apiData?.Journeys || apiData?.journeys || apiData;
  if (!journeys || !Array.isArray(journeys)) {
    return rows;
  }

  // Helper to format time strings to 4-digit format (HHMM)
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    // Look for an HH:MM pattern in the string
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      // Pad hour with 0 if needed and concatenate with minutes (e.g., "8:35" -> "0835")
      const hour = match[1].padStart(2, '0');
      const minute = match[2];
      return hour + minute;
    }
    return timeStr;
  };

  journeys.forEach((journey) => {
    const journeyKey = journey.journeyKey || journey.JourneyKey;
    const flightSegments = journey.flights || journey.Flights || [];
    const fareOptions = journey.fares || journey.Fares || [];

    // If no fares array but fare fields exist on journey (single fare scenario), create a single-entry array
    if (fareOptions.length === 0 && journey.fareKey) {
      fareOptions.push({
        fareAmountIncludingTax: journey.fareAmountIncludingTax,
        fareBasisCode: journey.fareBasisCode,
        fareKey: journey.fareKey
      });
    }

    flightSegments.forEach((flight) => {
      // Extract and format departure and arrival times
      const departureTime = formatTime(flight.departureTime || flight.departureDateTime);
      const arrivalTime = formatTime(flight.arrivalTime || flight.arrivalDateTime);

      // Determine duration and format it if it's numeric (minutes) or a time string
      let duration = flight.duration || journey.duration;
      if (typeof duration === 'number') {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        duration = `${hours}h${minutes.toString().padStart(2, '0')}m`;
      } else if (typeof duration === 'string') {
        if (/^\d+$/.test(duration)) {
          // If duration is a numeric string (minutes), convert to "XhYYm"
          const totalMin = parseInt(duration, 10);
          const hours = Math.floor(totalMin / 60);
          const minutes = totalMin % 60;
          duration = `${hours}h${minutes.toString().padStart(2, '0')}m`;
        } else if (duration.includes(':') && !duration.includes('h')) {
          // If duration is in "H:MM" format, convert to "HhMMm"
          const [h, m] = duration.split(':');
          if (!isNaN(h) && !isNaN(m)) {
            duration = `${parseInt(h, 10)}h${m.padStart(2, '0')}m`;
          }
        }
      }

      // Clean up aircraft description by removing any parenthesized model numbers
      let aircraftDescription = flight.aircraftDescription || flight.aircraftType || flight.equipmentDescription;
      if (aircraftDescription) {
        aircraftDescription = aircraftDescription.replace(/\([^)]*\)/g, '').trim();
      }

      // If there are no fare options (should not happen in normal API data), push at least flight info
      if (fareOptions.length === 0) {
        rows.push({
          departureTime,
          arrivalTime,
          duration,
          flightNumber: flight.flightNumber || flight.flightNum,
          aircraftDescription,
          fareAmountIncludingTax: '',
          fareBasisCode: '',
          fareKey: '',
          journeyKey
        });
      } else {
        // Create a row for each fare option available for this flight segment
        fareOptions.forEach((fare) => {
          rows.push({
            departureTime,
            arrivalTime,
            duration,
            flightNumber: flight.flightNumber || flight.flightNum,
            aircraftDescription,
            fareAmountIncludingTax: fare.fareAmountIncludingTax,
            fareBasisCode: fare.fareBasisCode,
            fareKey: fare.fareKey,
            journeyKey
          });
        });
      }
    });
  });

  return rows;
}

/**
 * JourneyTable component – displays a table of flight information.
 * Accepts `rows` (array of flattened flight data objects) as a prop.
 */
export function JourneyTable({ rows = [] }) {
  // If no data, render nothing
  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <table className="journey-table">
      <thead>
        <tr>
          <th>Departure Time</th>
          <th>Arrival Time</th>
          <th>Duration</th>
          <th>Flight Number</th>
          <th>Aircraft Description</th>
          <th>Fare Amount (Incl. Tax)</th>
          <th>Fare Basis Code</th>
          <th>Fare Key</th>
          <th>Journey Key</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr 
            key={`${row.journeyKey}-${row.fareKey}-${row.flightNumber}`}
          >
            <td>{row.departureTime}</td>
            <td>{row.arrivalTime}</td>
            <td>{row.duration}</td>
            <td>{row.flightNumber}</td>
            <td>{row.aircraftDescription}</td>
            <td>{row.fareAmountIncludingTax}</td>
            <td>{row.fareBasisCode}</td>
            <td>{row.fareKey}</td>
            <td>{row.journeyKey}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
