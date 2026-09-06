function getLocation(data = {}) {
  const latitude = Number(
    data.latitude ?? 0
  );

  const longitude = Number(
    data.longitude ?? 0
  );

  return {
    latitude,
    longitude,
    valid:
      latitude !== 0 &&
      longitude !== 0
  };
}

function getGoogleMapsLink(data = {}) {
  const location = getLocation(data);

  if (!location.valid) {
    return null;
  }

  return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
}

function formatLocation(data = {}) {
  const location = getLocation(data);

  if (!location.valid) {
    return "GPS location unavailable";
  }

  return (
    `${location.latitude}, ${location.longitude}`
  );
}

module.exports = {
  getLocation,
  getGoogleMapsLink,
  formatLocation
};