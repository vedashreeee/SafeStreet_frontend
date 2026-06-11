export const strings = {
  te: {
    appName: 'సేఫ్ స్ట్రీట్',
    appTagline: 'రోడ్డు ప్రమాదాన్ని నివేదించండి',
    stepLocation: 'స్థానం ఎంచుకోండి',
    stepHazard: 'ప్రమాద రకం',
    stepPhoto: 'ఫోటో జోడించండి',
    stepContact: 'మీ వివరాలు',
    locationPrompt: 'మీ స్థానాన్ని మ్యాప్‌లో టాప్ చేయండి లేదా GPS వాడండి',
    useGPS: 'GPS వాడండి',
    detectingGPS: 'మీ స్థానం కనుగొంటున్నాం...',
    gpsError: 'GPS పనిచేయలేదు. మ్యాప్‌లో టాప్ చేయండి.',
    locationSet: 'స్థానం నిర్ణయించబడింది',
    tapMap: 'మ్యాప్‌లో టాప్ చేయండి',
    noLocationYet: 'స్థానం ఇంకా ఎంచుకోలేదు',
  },
  en: {
    appName: 'SafeStreet',
    appTagline: 'Report a Road Hazard',
    stepLocation: 'Choose Location',
    stepHazard: 'Hazard Type',
    stepPhoto: 'Add Photo',
    stepContact: 'Your Details',
    locationPrompt: 'Tap your location on the map or use GPS',
    useGPS: 'Use GPS',
    detectingGPS: 'Detecting your location...',
    gpsError: 'GPS failed. Please tap on the map.',
    locationSet: 'Location set',
    tapMap: 'Tap on the map',
    noLocationYet: 'No location selected yet',
  }
}

export const t = (lang, key) => strings[lang]?.[key] ?? strings.en[key] ?? key