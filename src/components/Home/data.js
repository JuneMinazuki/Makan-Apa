export const LocationType = Object.freeze({
  Kopitiam: "Kopitiam",
  Cafe: "Cafe",
  Restaurant: "Restaurant",
  FastFood: "Fast Food"
});

export const mapLocations = [
  {
    id: 1,
    name: "古早味 The Unique Taste",
    type: LocationType.Kopitiam,
    lat: 3.0160,
    lng: 101.6168,
    schedule: {
      1: { open:  630, close: 1600 },
      2: { open:  630, close: 1600 },
      3: { open:  630, close: 1600 },
      4: { open:  630, close: 1600 },
      5: { open:  630, close: 1600 },
      6: { open:  630, close: 1600 },
      0: { open:  630, close: 1600 }
    }
  },
  {
    id: 2,
    name: "南泉 Nam Chuan",
    type: LocationType.Kopitiam,
    lat: 3.0162,
    lng: 101.6153,
    schedule: {
      1: { open:  800, close: 1600 },
      2: { open:  800, close: 1600 },
      3: { open:  800, close: 1600 },
      4: { open:  800, close: 1600 },
      5: { open:  800, close: 1600 },
      6: { open:  800, close: 1600 },
      0: { open:  800, close: 1600 }
    }
  },
  {
    id: 3,
    name: "大家 Restoran Big Family",
    type: LocationType.Kopitiam,
    lat: 3.0145,
    lng: 101.6141,
    schedule: {
      1: { open:  700, close: 2200 },
      2: { open:  700, close: 2200 },
      3: { open:  700, close: 2200 },
      4: { open:  700, close: 2200 },
      5: { open:  700, close: 2200 },
      6: { open:  700, close: 2200 },
      0: { open:  700, close: 2200 }
    }
  },
]