import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import './LocationMap.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const safestreetIcon = L.divIcon({
  className: '',
  html: `
    <div class="ss-marker">
      <div class="ss-marker-pin">
        <svg viewBox="0 0 24 32" fill="none" width="28" height="38">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 8.5 12 20 12 20s12-11.5 12-20C24 5.37 18.63 0 12 0z" fill="#C1440E"/>
          <circle cx="12" cy="12" r="5" fill="white"/>
          <circle cx="12" cy="12" r="2.5" fill="#C1440E"/>
        </svg>
      </div>
      <div class="ss-marker-pulse"></div>
    </div>`,
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  popupAnchor: [0, -38],
})

function MapClickHandler({ onLocationSet }) {
  useMapEvents({
    click(e) {
      onLocationSet({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

function FlyToPosition({ position }) {
  const map = useMap()
  const prevPos = useRef(null)

  useEffect(() => {
    if (!position) return

    const isSame =
      prevPos.current &&
      Math.abs(prevPos.current.lat - position.lat) < 0.00001 &&
      Math.abs(prevPos.current.lng - position.lng) < 0.00001

    if (!isSame) {
      map.flyTo(
        [position.lat, position.lng],
        19,
        {
          duration: 1.5
        }
      )

      map.once('moveend', () => {
        map.invalidateSize(true)
      })

      prevPos.current = position
    }
  }, [position, map])

  return null
}
function FixMapResize() {
  const map = useMap()

  useEffect(() => {
    const resize = () => {
      map.invalidateSize(true)
    }

    setTimeout(resize, 800)
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [map])

  return null
}
const LOCAL_LANDMARKS = [
  // === EDUCATIONAL INSTITUTIONS ===
  { name: 'VR Siddhartha Engineering College', lat: 16.4850, lng: 80.6910, area: 'Kanuru' },
  { name: 'Prasad V Potluri Siddhartha Institute of Technology', lat: 16.4861, lng: 80.6925, area: 'Kanuru' },
  { name: 'SRK Institute of Technology', lat: 16.4952, lng: 80.6890, area: 'Kanuru' },
  { name: 'Narayana e-Techno School, Poranki', lat: 16.4788, lng: 80.7092, area: 'Poranki' },
  { name: 'Sri Chaitanya Techno School, Poranki', lat: 16.4791, lng: 80.7065, area: 'Poranki' },
  { name: 'Sri Chaitanya Techno School, Penamaluru', lat: 16.4622, lng: 80.7161, area: 'Penamaluru' },
  { name: 'Kennedy High The Global School', lat: 16.4885, lng: 80.6882, area: 'Kanuru' },
  { name: 'Springboard International School', lat: 16.4731, lng: 80.6985, area: 'Tadigadapa' },
  { name: 'Krishnaveni Talent School', lat: 16.4842, lng: 80.6910, area: 'Kanuru' },
  { name: 'ZP High School, Penamaluru', lat: 16.4595, lng: 80.7182, area: 'Penamaluru' },

  // === HOSPITALS & HEALTHCARE ===
  { name: 'Time Hospital, Sanath Nagar', lat: 16.4878, lng: 80.6855, area: 'Kanuru' },
  { name: 'LV Prasad Eye Institute', lat: 16.4713, lng: 80.6970, area: 'Tadigadapa' },
  { name: 'Kamineni Hospitals, 100 Feet Road', lat: 16.4811, lng: 80.7024, area: 'Poranki' },
  { name: 'Nagarjuna Hospital, Kanuru Main Road', lat: 16.4865, lng: 80.6881, area: 'Kanuru' },
  { name: 'Capital Hospital, Poranki', lat: 16.4782, lng: 80.7089, area: 'Poranki' },
  { name: 'Penamaluru Primary Health Centre', lat: 16.4591, lng: 80.7198, area: 'Penamaluru' },
  { name: 'Boppana Medicare Pvt Ltd', lat: 16.4779, lng: 80.7051, area: 'Poranki' },
  { name: 'Jabilli Hospital', lat: 16.4791, lng: 80.7072, area: 'Poranki' },
  { name: 'Sravanthi Hospital', lat: 16.4881, lng: 80.6869, area: 'Kanuru' },
  { name: 'Nandini Hospital', lat: 16.4875, lng: 80.6871, area: 'Kanuru' },
  { name: 'Tatineni Dental Hospital', lat: 16.4788, lng: 80.7045, area: 'Poranki' },
  { name: 'Healthy Smiles Dental Clinic', lat: 16.4838, lng: 80.6894, area: 'Kanuru' },

  // === RESTAURANTS & CAFES ===
  { name: 'Sweet Magic, Poranki', lat: 16.4772, lng: 80.7078, area: 'Poranki' },
  { name: 'Seven Days Cafe, Kanuru', lat: 16.4861, lng: 80.6888, area: 'Kanuru' },
  { name: 'Barkaas Arabic Restaurant', lat: 16.4855, lng: 80.6892, area: 'Kanuru' },
  { name: 'Babai Hotel, Kanuru', lat: 16.4849, lng: 80.6901, area: 'Kanuru' },
  { name: 'Silver Spoon, Poranki', lat: 16.4785, lng: 80.7095, area: 'Poranki' },
  { name: 'Naidu Gari Kunda Biryani', lat: 16.4868, lng: 80.6871, area: 'Kanuru' },
  { name: 'Kumbhakarna Biryanis', lat: 16.4871, lng: 80.6868, area: 'Kanuru' },
  { name: 'Chillys Family Restaurant', lat: 16.4784, lng: 80.7039, area: 'Poranki' },
  { name: 'Podarillu Family Restaurant', lat: 16.4792, lng: 80.7112, area: 'Poranki' },
  { name: 'Seven Days, Tadigadapa', lat: 16.4728, lng: 80.6988, area: 'Tadigadapa' },
  { name: 'Abhiruchi Restaurant', lat: 16.4775, lng: 80.7021, area: 'Poranki' },
  { name: 'Swaad Restaurant', lat: 16.4832, lng: 80.6905, area: 'Kanuru' },

  // === SHOPPING & ENTERTAINMENT ===
  { name: 'D-Mart, Kanuru', lat: 16.4852, lng: 80.6895, area: 'Kanuru' },
  { name: 'Reliance Smart Point, Poranki', lat: 16.4775, lng: 80.7082, area: 'Poranki' },
  { name: 'V Square Mall, Kanuru', lat: 16.4858, lng: 80.6888, area: 'Kanuru' },
  { name: 'Spencers Daily, Tadigadapa', lat: 16.4725, lng: 80.6979, area: 'Tadigadapa' },
  { name: 'South India Shopping Mall, Poranki', lat: 16.4789, lng: 80.7031, area: 'Poranki' },
  { name: 'Vijayalakshmi Theatre', lat: 16.4869, lng: 80.6868, area: 'Kanuru' },
  { name: 'Balaji Cini Villa', lat: 16.4788, lng: 80.7104, area: 'Poranki' },

  // === TEMPLES & SPIRITUAL ===
  { name: 'Sri Shirdi Sai Baba Temple, Kanuru', lat: 16.4839, lng: 80.6908, area: 'Kanuru' },
  { name: 'Sivalayam, Tadigadapa', lat: 16.4718, lng: 80.6962, area: 'Tadigadapa' },
  { name: 'Ramalayam, Poranki', lat: 16.4778, lng: 80.7058, area: 'Poranki' },
  { name: 'Penamaluru Sivalayam', lat: 16.4599, lng: 80.7195, area: 'Penamaluru' },
  { name: 'Sri Anjaneya Swamy Temple, Poranki', lat: 16.4789, lng: 80.7088, area: 'Poranki' },
  { name: 'Vasantha Koteswara Swamy Temple', lat: 16.4715, lng: 80.6951, area: 'Tadigadapa' },
  { name: 'Kanaka Durga Temple, Kanuru', lat: 16.4845, lng: 80.6892, area: 'Kanuru' },
  { name: 'Sri Shirdi Sai Temple, Sitapuram Colony', lat: 16.4811, lng: 80.7145, area: 'Poranki' },

  // === APARTMENTS & RESIDENTIAL ===
  { name: 'Mithila Residency', lat: 16.4795, lng: 80.7119, area: 'Poranki' },
  { name: 'Vasishta Olympia', lat: 16.4802, lng: 80.7131, area: 'Poranki' },
  { name: 'Vasishta Vaishno Vihari', lat: 16.4789, lng: 80.7101, area: 'Poranki' },
  { name: 'Mahalakshmi Towers', lat: 16.4723, lng: 80.6981, area: 'Tadigadapa' },
  { name: 'Avaneendra KKR Residency', lat: 16.4735, lng: 80.7018, area: 'Tadigadapa' },
  { name: 'Badris Jishnu Nivas', lat: 16.4741, lng: 80.7029, area: 'Tadigadapa' },
  { name: 'Firmus Pradhama', lat: 16.4615, lng: 80.7175, area: 'Penamaluru' },
  { name: 'PVR Koteswara Classic', lat: 16.4784, lng: 80.7069, area: 'Poranki' },
  { name: 'Royal Ridge Apartments', lat: 16.4776, lng: 80.7049, area: 'Poranki' },
  { name: 'Sri Krishna Towers', lat: 16.4609, lng: 80.7188, area: 'Penamaluru' },

  // === MAIN STREETS & SECTOR ROADS ===
  { name: '100 Feet Road, Poranki', lat: 16.4820, lng: 80.7020, area: 'Poranki' },
  { name: '100 Feet Road, Kanuru', lat: 16.4880, lng: 80.6810, area: 'Kanuru' },
  { name: '100 Feet Road, Penamaluru', lat: 16.4630, lng: 80.7150, area: 'Penamaluru' },
  { name: 'Kamayyathopu Main Road', lat: 16.4866, lng: 80.6861, area: 'Kanuru' },
  { name: 'Time Hospital Road / Sanath Nagar Road', lat: 16.4879, lng: 80.6851, area: 'Kanuru' },
  { name: 'VR Siddhartha College Road', lat: 16.4851, lng: 80.6905, area: 'Kanuru' },
  { name: 'Tulasi Nagar Main Road', lat: 16.4848, lng: 80.6859, area: 'Kanuru' },
  { name: 'Ashok Nagar Main Road', lat: 16.4831, lng: 80.6885, area: 'Kanuru' },
  { name: 'Chalasani Nagar Main Road', lat: 16.4822, lng: 80.6901, area: 'Kanuru' },
  { name: 'Old Age Home Road', lat: 16.4818, lng: 80.6882, area: 'Kanuru' },
  { name: 'Endowments Colony Road No 1', lat: 16.4805, lng: 80.6899, area: 'Kanuru' },
  { name: 'Endowments Colony Road No 2', lat: 16.4799, lng: 80.6908, area: 'Kanuru' },
  { name: 'Tadigadapa Donka Road', lat: 16.4702, lng: 80.6952, area: 'Tadigadapa' },
  { name: 'LV Prasad Eye Institute Road', lat: 16.4719, lng: 80.6975, area: 'Tadigadapa' },
  { name: 'Yanamalakuduru Konda Road', lat: 16.4812, lng: 80.6931, area: 'Tadigadapa' },
  { name: 'Sivalayam Street, Tadigadapa', lat: 16.4714, lng: 80.6969, area: 'Tadigadapa' },
  { name: 'Kamineni Hospital Road', lat: 16.4815, lng: 80.7015, area: 'Poranki' },
  { name: 'Poranki Panchayat Office Road', lat: 16.4781, lng: 80.7099, area: 'Poranki' },
  { name: 'Pedapulipaka Approach Road', lat: 16.4765, lng: 80.7012, area: 'Poranki' },
  { name: 'Padmavathi Gardens Road', lat: 16.4798, lng: 80.7122, area: 'Poranki' },
  { name: 'Karanam Gari Thota Road', lat: 16.4761, lng: 80.7001, area: 'Poranki' },
  { name: 'Government Hospital Road', lat: 16.4595, lng: 80.7191, area: 'Penamaluru' },
  { name: 'Pedapulipaka Road, Penamaluru', lat: 16.4611, lng: 80.7155, area: 'Penamaluru' },

  // === PRIMARY TRANSIT & PICK-UP POINTS ===
  { name: 'Poranki Bus Stop', lat: 16.4775, lng: 80.7088, area: 'Poranki' },
  { name: 'Poranki Junction', lat: 16.4777, lng: 80.7076, area: 'Poranki' },
  { name: 'Kamayyathopu Center', lat: 16.4867, lng: 80.6865, area: 'Kanuru' },
  { name: 'Kanuru Center / Time Hospital Junction', lat: 16.4876, lng: 80.6858, area: 'Kanuru' },
  { name: 'VR Siddhartha College Bus Stop', lat: 16.4845, lng: 80.6912, area: 'Kanuru' },
  { name: 'Pappulamillu Center', lat: 16.4841, lng: 80.6895, area: 'Kanuru' },
  { name: 'Ashok Nagar Checkpost', lat: 16.4829, lng: 80.6888, area: 'Kanuru' },
  { name: 'Tadigadapa Center', lat: 16.4713, lng: 80.6970, area: 'Tadigadapa' },
  { name: 'Tadigadapa Donka Road Junction', lat: 16.4705, lng: 80.6959, area: 'Tadigadapa' },
  { name: 'Penamaluru Center', lat: 16.4597, lng: 80.7188, area: 'Penamaluru' },
  { name: 'Penamaluru Police Station Drop Point', lat: 16.4605, lng: 80.7195, area: 'Penamaluru' }, // <--- Added missing comma here
  
  // === LOCAL RESTAURANTS, MESSES & CAFES ===
  { name: 'Mana Gardens Restaurant & Bar', lat: 16.4835, lng: 80.6880, area: 'Kanuru (Ashok Nagar)' },
  { name: 'Bhavana Hotel Sri Sai Tea & Tiffin Centre', lat: 16.4862, lng: 80.6865, area: 'Kanuru (Kamayyathopu)' },
  { name: 'Sri Suguna Tiffin Center', lat: 16.4863, lng: 80.6866, area: 'Kanuru (Kamayyathopu)' },
  { name: 'Cherrys Cube Restaurant', lat: 16.4831, lng: 80.6881, area: 'Kanuru (Ashok Nagar)' },
  { name: 'Ruchirs Restaurant', lat: 16.4865, lng: 80.6860, area: 'Kanuru (Kamayyathopu)' },
  { name: 'Srikrishna Restaurant (100 Feet Road)', lat: 16.4881, lng: 80.6815, area: 'Kanuru' },
  { name: 'Surya Restaurant & Bar', lat: 16.4877, lng: 80.6853, area: 'Kanuru (Sanath Nagar)' },
  { name: 'Hare Ram Hare Krishna Mess', lat: 16.4878, lng: 80.6854, area: 'Kanuru (Sanath Nagar)' },
  { name: 'Sri Lalitha Fast Foods', lat: 16.4880, lng: 80.6851, area: 'Kanuru (Sanath Nagar)' },
  { name: 'Alfa Arabian Restaurant', lat: 16.4845, lng: 80.6895, area: 'Kanuru' },
  { name: 'Monks Kitchen', lat: 16.4851, lng: 80.6888, area: 'Kanuru' },
  { name: 'Besta Restaurant', lat: 16.4855, lng: 80.6875, area: 'Kanuru' },
  { name: 'Suneetha Tea & Fast Food Center', lat: 16.4910, lng: 80.6805, area: 'Kanuru Border (Auto Nagar)' },
  { name: 'Indra Mess', lat: 16.4912, lng: 80.6801, area: 'Kanuru Border (Auto Nagar)' },
  
  // === LOCAL TEMPLES & SHRINES ===
  { name: 'Sri Rama Temple', lat: 16.4882, lng: 80.6891, area: 'Kanuru (Navata Road)' },
  { name: 'Vijaya Kanaka Durga Temple', lat: 16.4875, lng: 80.6858, area: 'Kanuru (Sanath Nagar)' },
  { name: 'Ramalayam Main Road', lat: 16.4859, lng: 80.6885, area: 'Kanuru' },
  { name: 'Sivalayam (6th Road)', lat: 16.4881, lng: 80.6845, area: 'Kanuru (Sanath Nagar)' },
  { name: 'Hanuman Temple (Sanath Nagar)', lat: 16.4879, lng: 80.6849, area: 'Kanuru (Sanath Nagar)' },
  { name: 'Hanuman Temple (Tulasinagar)', lat: 16.4842, lng: 80.6851, area: 'Kanuru (Tulasi Nagar)' },
  { name: 'Sri Venkateswara Temple', lat: 16.4828, lng: 80.6875, area: 'Kanuru (Ashok Nagar)' },
  { name: 'Sri Lakshmi Tirupatamma Talli Devastanam', lat: 16.4839, lng: 80.6889, area: 'Kanuru' },

  // === APARTMENTS & RESIDENTIAL LAYOUTS ===
  { name: 'MB Prime Apartments', lat: 16.4825, lng: 80.6912, area: 'Kanuru' },
  { name: 'Sri Venkateswara Towers Block 2', lat: 16.4841, lng: 80.6905, area: 'Kanuru' },
  { name: 'Invicon Novah Apartments', lat: 16.4815, lng: 80.6889, area: 'Kanuru' },
  { name: 'Heritage Homes Ap', lat: 16.4855, lng: 80.6921, area: 'Kanuru' },
  { name: 'NTR Garden Flats', lat: 16.4765, lng: 80.7095, area: 'Poranki' },
  { name: 'Murali Nagar Residential Layout', lat: 16.4810, lng: 80.6875, area: 'Kanuru' },
  
  // === SCHOOLS & COMMERCIAL LANDMARKS ===
  { name: 'Shamrock International School', lat: 16.4805, lng: 80.6895, area: 'Kanuru' },
  { name: 'D-Address Mall', lat: 16.4861, lng: 80.6869, area: 'Kanuru' },
  { name: 'Old Check Post Center', lat: 16.4878, lng: 80.6850, area: 'Kanuru (Sanath Nagar)' },
  { name: 'Auto Nagar Bus Terminal (Kanuru Border)', lat: 16.4905, lng: 80.6808, area: 'Kanuru Border' },
  
  // === INTERNAL STREETS & DONKA ROADS ===
  { name: 'Navata Road', lat: 16.4885, lng: 80.6895, area: 'Kanuru' },
  { name: 'Sanath Nagar 6th Road', lat: 16.4882, lng: 80.6844, area: 'Kanuru (Sanath Nagar)' },
  { name: 'Tulasinagar Hanuman Street', lat: 16.4840, lng: 80.6850, area: 'Kanuru (Tulasi Nagar)' },
  { name: 'Murali Nagar Main Road', lat: 16.4810, lng: 80.6875, area: 'Kanuru' },
  { name: 'Chowdary Pet Road', lat: 16.4831, lng: 80.6882, area: 'Kanuru (Ashok Nagar)' }, // <--- Added missing comma here
  
  // === MORE APARTMENTS ===
  { name: 'PVR Elite', lat: 16.4860, lng: 80.6885, area: 'Kanuru' },
  { name: 'Urban Meadows', lat: 16.4815, lng: 80.6870, area: 'Kanuru' },
  { name: 'Sri Surya Teja Royal Green City', lat: 16.4830, lng: 80.6890, area: 'Kanuru' },
  { name: 'Duggirala Residency', lat: 16.4845, lng: 80.6895, area: 'Kanuru' },
  { name: 'Lakshmi Residency', lat: 16.4852, lng: 80.6902, area: 'Kanuru' },
  { name: 'Saradha Nilayam', lat: 16.4828, lng: 80.6872, area: 'Kanuru' },
  { name: 'Sri Sai Residency', lat: 16.4865, lng: 80.6865, area: 'Kanuru' },
  { name: 'Jhansirani Residency Srinivasam', lat: 16.4840, lng: 80.6880, area: 'Kanuru' },
  { name: 'Sree Enclave', lat: 16.4835, lng: 80.6892, area: 'Kanuru' },
  { name: 'Sri Trithvi Grand Vie', lat: 16.4870, lng: 80.6855, area: 'Kanuru (Kamayyathopu)' },
  { name: 'Sri Swarna Residency', lat: 16.4820, lng: 80.6860, area: 'Kanuru' },
  { name: 'Golden Towers', lat: 16.4818, lng: 80.6875, area: 'Kanuru' },
  { name: 'Sai Vivek Hights', lat: 16.4855, lng: 80.6880, area: 'Kanuru' },
  { name: 'Sri Sai Presanna', lat: 16.4862, lng: 80.6858, area: 'Kanuru' },
  { name: 'Harsha Residency', lat: 16.4848, lng: 80.6872, area: 'Kanuru' },
  { name: 'Sree Surya Starlight', lat: 16.4850, lng: 80.6898, area: 'Kanuru' },
  { name: 'Akhil Elevate', lat: 16.4812, lng: 80.6885, area: 'Kanuru' },
  { name: 'Srihitha KR Pride', lat: 16.4832, lng: 80.6865, area: 'Kanuru' },
  { name: 'Satya Residency', lat: 16.4875, lng: 80.6845, area: 'Kanuru' },
  { name: 'Aron Haven Wood', lat: 16.4825, lng: 80.6895, area: 'Kanuru' },
  { name: 'Lakshmi Balaji Enclave', lat: 16.4868, lng: 80.6850, area: 'Kanuru' },
  { name: 'Harihara Mytri Towers', lat: 16.4842, lng: 80.6860, area: 'Kanuru' },
  { name: 'ASL The Serenity', lat: 16.4858, lng: 80.6870, area: 'Kanuru' },
  { name: 'Sri Venkateswara Residency', lat: 16.4838, lng: 80.6888, area: 'Kanuru' },
  { name: 'Sri Bhuvaneswari Grand', lat: 16.4822, lng: 80.6878, area: 'Kanuru' },
  { name: 'JS Enclave', lat: 16.4872, lng: 80.6848, area: 'Kanuru' },

  // === LODGES & SERVICE APARTMENTS ===
  { name: 'Myhome Service Apartments', lat: 16.4910, lng: 80.6780, area: 'Kanuru Border (Bharathi Nagar)' },
  { name: 'Sree Sankari Service Apartments', lat: 16.4925, lng: 80.6755, area: 'Kanuru Border (Gurunanak Colony)' },
  { name: 'Royal Service Apartment Hotels', lat: 16.4885, lng: 80.6820, area: 'Kanuru' },
  { name: 'Hotel Sannidhi', lat: 16.4890, lng: 80.6815, area: 'Kanuru' },
  { name: 'Janasudha Lodge', lat: 16.4870, lng: 80.6840, area: 'Kanuru' },
  { name: 'Kumar Hotels', lat: 16.4855, lng: 80.6865, area: 'Kanuru' },
  { name: 'Bheemaas Inn', lat: 16.4882, lng: 80.6835, area: 'Kanuru' },

  // === LOCAL EATERIES, MESSES & FAST FOOD ===
  { name: 'Idly n Idly', lat: 16.4905, lng: 80.6790, area: 'Kanuru Border (Sri Ramachandra Nagar)' },
  { name: 'Mkar Tea Snacks Tiffins', lat: 16.4895, lng: 80.6800, area: 'Auto Nagar Border' },
  { name: 'Sri Vigneswara Mess', lat: 16.4892, lng: 80.6805, area: 'Auto Nagar Border' },
  { name: 'Swaty Hotel New Milap', lat: 16.4890, lng: 80.6810, area: 'Auto Nagar Border' },
  { name: 'Mughal Durbar Restaurant', lat: 16.4915, lng: 80.6765, area: 'Kanuru Border (JD Nagar)' },
  { name: 'Uc Tea Hotel', lat: 16.4888, lng: 80.6812, area: 'Auto Nagar Border' },
  { name: 'Sri Sai Durga Tea & Tiffin Center', lat: 16.4835, lng: 80.6875, area: 'Kanuru (Ashok Nagar)' },
  { name: 'Bismillah Curries Point', lat: 16.4898, lng: 80.6795, area: 'Auto Nagar Border' },
  { name: 'Hyderabad Dum Biryani', lat: 16.4875, lng: 80.6850, area: 'Kanuru (Sanath Nagar)' },
  { name: 'Hotel ANDHRA BHAVAN Restaurant', lat: 16.4895, lng: 80.6808, area: 'Auto Nagar Border' },
  { name: 'Sharmila Curries And Biryani Point', lat: 16.4880, lng: 80.6845, area: 'Kanuru (Sanath Nagar)' },
  { name: 'Soul Of South', lat: 16.4850, lng: 80.6890, area: 'Kanuru (Power One Mall)' },
  { name: 'Svs Teepi Kaaram', lat: 16.4890, lng: 80.6815, area: 'Auto Nagar Border' },
  { name: 'New Chand Hotel', lat: 16.4885, lng: 80.6825, area: 'Auto Nagar Border' },
  { name: 'Saleem Kalyani Point (Biryani)', lat: 16.4892, lng: 80.6800, area: 'Auto Nagar Border' },
  { name: 'Rotis', lat: 16.4865, lng: 80.6860, area: 'Kanuru (Endowments Colony)' },
  { name: 'Asian Food Bowl Restaurant', lat: 16.4910, lng: 80.6775, area: 'Kanuru Border' },
  { name: 'Lavish Take Away Zone', lat: 16.4888, lng: 80.6810, area: 'Auto Nagar Border' },
  { name: 'Rajabhoga Biryanis', lat: 16.4845, lng: 80.6895, area: 'Kanuru (Dolphin Estates)' },
  { name: 'Naidu Military Hotel', lat: 16.4855, lng: 80.6880, area: 'Kanuru' },
  { name: 'Anjaneya Family Restaurant', lat: 16.4895, lng: 80.6790, area: 'Auto Nagar Border' },
  { name: 'Navratri Meals By Lunchbox', lat: 16.4890, lng: 80.6805, area: 'Auto Nagar Border' },
  { name: 'Zaatar Arabian Mandi Restaurant', lat: 16.4860, lng: 80.6865, area: 'Kanuru (Endowments Colony)' },

  // === COLONY TEMPLES & ASHRAMS ===
  { name: 'Hanuman Temple 2', lat: 16.4878, lng: 80.6842, area: 'Kanuru (Sanath Nagar)' },
  { name: 'Sri Abhayanjaneya Swamy Vari Rajayoga Mandir Temple', lat: 16.4885, lng: 80.6820, area: 'Auto Nagar Border' },
  { name: 'Sri Subrahmanya Swamy Temple', lat: 16.4820, lng: 80.6815, area: 'Kanuru Border (Ayyappa Nagar)' },
  { name: 'Lord Siva Temple', lat: 16.4905, lng: 80.6770, area: 'Auto Nagar Gate' },
  { name: 'Saraswathi Temple', lat: 16.4906, lng: 80.6772, area: 'Auto Nagar Gate' },
  { name: 'Dattatreya Temple', lat: 16.4915, lng: 80.6760, area: 'Kanuru Border (JD Nagar)' },
  { name: 'Lord Vinayaka Temple', lat: 16.4904, lng: 80.6771, area: 'Auto Nagar Gate' },
  { name: 'Sri Ganapathi Sachitananda Swamy Asramam', lat: 16.4900, lng: 80.6780, area: 'Auto Nagar Gate' },
  { name: 'Vinayakuni Mandiram', lat: 16.4810, lng: 80.6830, area: 'Kanuru Border' },
  { name: 'Sri Vijaya Vinayaka Mandiram', lat: 16.4905, lng: 80.6795, area: 'Kanuru Border (Ramachandra Nagar)' },
  { name: 'Shri Rama Dhyana Mandhiram', lat: 16.4920, lng: 80.6785, area: 'Kanuru Border (Nagarjuna Nagar)' }, // <--- Added missing comma here
  
  // === MAJOR FRANCHISES & TRENDY DINING ===
  { name: 'ABR Cinemas', lat: 16.4801, lng: 80.7042, area: 'Poranki' },
  { name: 'Telugu House Family Restaurant', lat: 16.4853, lng: 80.6892, area: 'Kanuru' },
  { name: 'Nawabs Mandi & Biryani', lat: 16.4868, lng: 80.6855, area: 'Kanuru' },
  { name: 'Khaleel Bhai Dum Biryani', lat: 16.4825, lng: 80.6985, area: 'Poranki' },
  { name: 'Harleys Fine Baking', lat: 16.4880, lng: 80.6845, area: 'Kanuru' },
  { name: 'Alankar Sweets & Bakers', lat: 16.4795, lng: 80.7060, area: 'Poranki' },
  { name: 'Domino\'s Pizza', lat: 16.4872, lng: 80.6860, area: 'Kanuru' },
  { name: 'KFC', lat: 16.4865, lng: 80.6870, area: 'Kanuru' },
  { name: 'Platform 65 (Train Restaurant)', lat: 16.4848, lng: 80.6915, area: 'Kanuru' },
  { name: 'Kritunga Restaurant', lat: 16.4810, lng: 80.7020, area: 'Poranki' },
  { name: 'Sri Kanya Restaurant', lat: 16.4875, lng: 80.6852, area: 'Kanuru' },
  { name: 'Cream Stone Ice Cream', lat: 16.4859, lng: 80.6881, area: 'Kanuru' },
  { name: 'The ThickShake Factory', lat: 16.4861, lng: 80.6879, area: 'Kanuru' },
  { name: 'Ironhill Parlour (Border)', lat: 16.4885, lng: 80.6830, area: 'Kanuru Border' },
  { name: 'NIC Ice Creams', lat: 16.4850, lng: 80.6885, area: 'Kanuru' },
  
  // === ADDITIONAL PREMIUM CAFES & BAKERIES ===
  { name: 'Bakers Fun', lat: 16.4869, lng: 80.6862, area: 'Kanuru' },
  { name: 'KS Bakers', lat: 16.4788, lng: 80.7085, area: 'Poranki' },
  { name: 'Cafe Coffee Day (Inside Siddhartha Campus area)', lat: 16.4855, lng: 80.6920, area: 'Kanuru' },
  { name: 'Deli 99', lat: 16.4835, lng: 80.6905, area: 'Kanuru' },
  
  // === MORE LOCAL BIRYANI & MANDI HEAVYWEIGHTS ===
  { name: 'Barkaas Indo-Arabic Mandi', lat: 16.4858, lng: 80.6889, area: 'Kanuru' }, 
  { name: 'Pista House (Outlet)', lat: 16.4862, lng: 80.6875, area: 'Kanuru' },
  { name: 'Red Bucket Biryani', lat: 16.4791, lng: 80.7055, area: 'Poranki' }, // <--- Added missing comma here
  
  // === MAJOR GLOBAL FRANCHISES ===
  { name: 'McDonald\'s (Vasanth Nagar / KCP Colony)', lat: 16.4795, lng: 80.7048, area: 'Poranki / Tadigadapa Border' },
  { name: 'Domino\'s Pizza (Poranki Branch)', lat: 16.4782, lng: 80.7081, area: 'Poranki' },
  { name: 'KFC (Poranki)', lat: 16.4788, lng: 80.7065, area: 'Poranki' },

  // === RETAIL & SHOPPING CORRIDORS ===
  { name: 'Max Fashion', lat: 16.4791, lng: 80.7035, area: 'Poranki' },
  { name: 'Zudio', lat: 16.4785, lng: 80.7042, area: 'Poranki' },
  { name: 'Pantaloons', lat: 16.4802, lng: 80.7025, area: 'Poranki (Near ABR Cinemas)' },
  { name: 'Croma Electronics', lat: 16.4798, lng: 80.7030, area: 'Poranki' },
  { name: 'Patanjali Mega Store', lat: 16.4779, lng: 80.7058, area: 'Poranki' },

  // === LOCAL DINING & BAKERIES (PORANKI & VASANTH NAGAR) ===
  { name: 'Vijaya Durga Family Restaurant', lat: 16.4765, lng: 80.7095, area: 'Poranki' },
  { name: 'Makers of Milkshakes (MOM)', lat: 16.4789, lng: 80.7072, area: 'Poranki' },
  { name: 'Lassi Shop (Vasanth Nagar)', lat: 16.4745, lng: 80.6995, area: 'Tadigadapa (Vasanth Nagar)' },
  { name: 'Sri Vengamamba Grand', lat: 16.4772, lng: 80.7088, area: 'Poranki' },
  { name: 'Bakers Inn', lat: 16.4768, lng: 80.7105, area: 'Poranki' },

  // === RESIDENTIAL LAYOUTS & LOCAL STREETS ===
  { name: 'TCR Colony Main Road', lat: 16.4790, lng: 80.7050, area: 'Poranki' },
  { name: 'KCP Colony Internal Lanes', lat: 16.4805, lng: 80.7065, area: 'Poranki' },
  { name: 'Vasanth Nagar 1st Cross', lat: 16.4752, lng: 80.6985, area: 'Tadigadapa' },
  { name: 'Rasapudipalem Road', lat: 16.4810, lng: 80.7115, area: 'Poranki Rural Border' }, // <--- Added missing comma here
  
  // === AUTOMOTIVE & SHOWROOMS ===
  { name: 'NEXA Showroom', lat: 16.4795, lng: 80.7020, area: 'Poranki / Tadigadapa Border' },
  { name: 'Kia Motors Showroom', lat: 16.4870, lng: 80.6840, area: 'Kanuru' },
  { name: 'Royal Enfield Showroom', lat: 16.4865, lng: 80.6860, area: 'Kanuru' },
  { name: 'Tata Motors Cars Showroom', lat: 16.4785, lng: 80.7050, area: 'Poranki' },
  { name: 'Hyundai Showroom', lat: 16.4855, lng: 80.6885, area: 'Kanuru' },
  { name: 'Honda Two Wheeler Showroom', lat: 16.4780, lng: 80.7075, area: 'Poranki' },
  { name: 'TVS Showroom', lat: 16.4725, lng: 80.6975, area: 'Tadigadapa' },

  // === FUNCTION HALLS & CONVENTION CENTERS ===
  { name: 'SS Convention', lat: 16.4800, lng: 80.7075, area: 'Poranki' },
  { name: 'Sita Rama Kalyana Mandapam', lat: 16.4770, lng: 80.7065, area: 'Poranki' },
  { name: 'Kalyanotsava Vedika', lat: 16.4840, lng: 80.6870, area: 'Kanuru' },
  { name: 'Sri Vengamamba Function Hall', lat: 16.4765, lng: 80.7090, area: 'Poranki' },
  { name: 'Manasa Sarovara Convention', lat: 16.4798, lng: 80.7035, area: 'Poranki' },
  { name: 'Srinivasa Kalyana Mandapam', lat: 16.4610, lng: 80.7160, area: 'Penamaluru' },

  // === GYMS & FITNESS CENTERS ===
  { name: 'Fitness 9 Gym', lat: 16.4880, lng: 80.6855, area: 'Kanuru' },
  { name: 'Iron Core Gym', lat: 16.4782, lng: 80.7060, area: 'Poranki' },
  { name: 'Gold\'s Gym (Bandar Road Approach)', lat: 16.4890, lng: 80.6830, area: 'Kanuru Border' },
  { name: 'F45 Training', lat: 16.4860, lng: 80.6875, area: 'Kanuru' },
  { name: 'Shape Up Fitness', lat: 16.4735, lng: 80.6985, area: 'Tadigadapa' },

  // === SUPERMARKETS (ADDITIONAL GROCERY) ===
  { name: 'Ratnadeep Supermarket', lat: 16.4862, lng: 80.6885, area: 'Kanuru' },
  { name: 'More Supermarket', lat: 16.4775, lng: 80.7070, area: 'Poranki' },
  { name: 'Vijaya Dairy Parlour', lat: 16.4830, lng: 80.6890, area: 'Kanuru' },
  { name: 'Heritage Fresh', lat: 16.4792, lng: 80.7045, area: 'Poranki' },

  // === BANKS & CIVIC BUILDINGS ===
  { name: 'SBI Branch & ATM', lat: 16.4780, lng: 80.7085, area: 'Poranki' },
  { name: 'HDFC Bank', lat: 16.4865, lng: 80.6875, area: 'Kanuru' },
  { name: 'Union Bank of India', lat: 16.4715, lng: 80.6965, area: 'Tadigadapa' },
  { name: 'ICICI Bank', lat: 16.4850, lng: 80.6895, area: 'Kanuru' },
  { name: 'Axis Bank', lat: 16.4788, lng: 80.7060, area: 'Poranki' },
  
  // === PENAMALURU DEEP-DIVE ===
  { name: 'Penamaluru MRO / Tahsildar Office', lat: 16.4605, lng: 80.7180, area: 'Penamaluru' },
  { name: 'Penamaluru Police Station', lat: 16.4600, lng: 80.7190, area: 'Penamaluru' },
  { name: 'Penamaluru Gram Panchayat Office', lat: 16.4595, lng: 80.7185, area: 'Penamaluru' },
  { name: 'State Bank of India (Penamaluru Branch)', lat: 16.4615, lng: 80.7165, area: 'Penamaluru' },
  { name: 'Vuyyuru Road Junction', lat: 16.4585, lng: 80.7200, area: 'Penamaluru / Vuyyuru Border' },
  { name: 'Gudavalli Approach Road', lat: 16.4620, lng: 80.7150, area: 'Penamaluru Border' },
  { name: 'Sri Venkateswara Swamy Temple (Penamaluru Main)', lat: 16.4602, lng: 80.7192, area: 'Penamaluru' },
  { name: 'Kanuru Gram Panchayat Office', lat: 16.4862, lng: 80.6891, area: 'Kanuru' },
  { name: 'Kanuru Sub Post Office', lat: 16.4855, lng: 80.6872, area: 'Kanuru' },

  // === BANKING (NOT IN DB) ===
  { name: 'State Bank of India (SBI), Kanuru Branch', lat: 16.4849, lng: 80.6885, area: 'Kanuru' },
  { name: 'Indian Bank, Kanuru', lat: 16.4871, lng: 80.6864, area: 'Kanuru' },

  // === EDUCATION (NOT IN DB) ===
  { name: 'ZPHS (Zilla Parishad High School), Kanuru', lat: 16.4835, lng: 80.6901, area: 'Kanuru' },
  { name: 'Sri Chaitanya Junior College, Kanuru', lat: 16.4829, lng: 80.6881, area: 'Kanuru' },
  { name: 'Narayana Junior College, Kanuru', lat: 16.4815, lng: 80.6899, area: 'Kanuru' },

  // === DINING & NIGHTLIFE (NOT IN DB) ===
  { name: 'Rasoie Restaurant', lat: 16.4858, lng: 80.6889, area: 'Kanuru' },
  { name: 'The League Sports Bar', lat: 16.4865, lng: 80.6859, area: 'Kanuru' },
  { name: 'Southern Spice Multicuisine Restaurant', lat: 16.4842, lng: 80.6895, area: 'Kanuru' },
  // === MISSING MAJOR COLONIES & LAYOUTS ===
  { name: 'Lakshmipuram Colony Main Road', lat: 16.4815, lng: 80.7065, area: 'Poranki' },
  { name: 'Vishnupuram Colony', lat: 16.4832, lng: 80.7040, area: 'Poranki' },
  { name: 'RTC Colony', lat: 16.4805, lng: 80.7100, area: 'Poranki' },
  { name: 'Limra Colony', lat: 16.4765, lng: 80.7025, area: 'Poranki' },
  { name: 'Bhagyanagar Colony', lat: 16.4782, lng: 80.7005, area: 'Poranki / Tadigadapa' },
  { name: 'Padmavathi Nagar', lat: 16.4850, lng: 80.6845, area: 'Kanuru' },

  // === MISSING MAJOR SCHOOLS ===
  { name: 'Krishnaveni Talent School', lat: 16.4852, lng: 80.6895, area: 'Kanuru' },
  { name: 'NRI Indian Springs School', lat: 16.4788, lng: 80.7075, area: 'Poranki' },
  { name: 'Slate - The School', lat: 16.4802, lng: 80.7015, area: 'Poranki' },
  { name: 'Scotspine International School', lat: 16.4865, lng: 80.6830, area: 'Kanuru Border' },
  { name: 'Ravindra Bharathi School', lat: 16.4795, lng: 80.7050, area: 'Poranki' },
  { name: 'Nexgen International School', lat: 16.4725, lng: 80.6980, area: 'Tadigadapa' },
  { name: 'NSR School', lat: 16.4810, lng: 80.7085, area: 'Poranki' },

  // === MISSING HOSPITALS ===
  { name: 'Capital Hospitals', lat: 16.4808, lng: 80.7060, area: 'Poranki' },
  { name: 'Time Hospital', lat: 16.4875, lng: 80.6852, area: 'Kanuru' },
  { name: 'Sravanthi Hospital', lat: 16.4880, lng: 80.6865, area: 'Kanuru (Sanath Nagar)' },
  { name: 'Harsh Sai Hospital', lat: 16.4790, lng: 80.7055, area: 'Poranki' },

  // === MISSING SUPERMARKETS ===
  { name: 'Hariteja Supermarket', lat: 16.4820, lng: 80.7050, area: 'Poranki' },
  { name: 'Ushodaya Supermarket', lat: 16.4855, lng: 80.6875, area: 'Kanuru' },
  // === LOCAL STREETS, TURNINGS & DONKAS ===
  { name: 'Time Hospital Turning / Junction', lat: 16.4876, lng: 80.6858, area: 'Kanuru' },
  { name: 'Kamayyathopu Center Turning', lat: 16.4866, lng: 80.6861, area: 'Kanuru' },
  { name: 'Nidamanuru Donka Road', lat: 16.4890, lng: 80.6935, area: 'Kanuru Border' },
  { name: 'Gosala Road', lat: 16.4820, lng: 80.7090, area: 'Poranki' },
  { name: 'Chodavaram Road Turning', lat: 16.4760, lng: 80.7180, area: 'Penamaluru' },
  { name: 'KCP Colony Main Road', lat: 16.4800, lng: 80.7055, area: 'Poranki' },
  { name: 'Vasantha Nagar Main Road', lat: 16.4740, lng: 80.6990, area: 'Tadigadapa' },
  { name: 'Ayyappa Nagar Main Road', lat: 16.4825, lng: 80.6820, area: 'Kanuru Border' },
  { name: 'Muralinagar 1st Line', lat: 16.4815, lng: 80.6872, area: 'Kanuru' },
  { name: 'Tulasinagar 1st Cross', lat: 16.4855, lng: 80.6855, area: 'Kanuru' },
  { name: 'Sanath Nagar 2nd Road', lat: 16.4875, lng: 80.6845, area: 'Kanuru' },
  
  // === SCHOOL ZONES (SPECIFICALLY SHAMROCK & SURROUNDINGS) ===
  { name: 'Shamrock International School', lat: 16.4805, lng: 80.6895, area: 'Kanuru' },
  { name: 'Shamrock School Road / Turning', lat: 16.4810, lng: 80.6890, area: 'Kanuru' },
  { name: 'Kennedy School Turning (Bandar Road)', lat: 16.4890, lng: 80.6875, area: 'Kanuru' },
  // ==========================================
  // === PORANKI: STREETS, TURNINGS & COLONIES ===
  // ==========================================
  { name: 'Poranki Center / Main Junction', lat: 16.4777, lng: 80.7076, area: 'Poranki' },
  { name: 'NTR Statue Center', lat: 16.4780, lng: 80.7080, area: 'Poranki' },
  { name: 'Pedapulipaka Road Turning (Poranki Center)', lat: 16.4770, lng: 80.7075, area: 'Poranki' },
  { name: 'KCP Colony Turning (Bandar Road)', lat: 16.4800, lng: 80.7050, area: 'Poranki' },
  { name: 'KCP Colony Main Road', lat: 16.4805, lng: 80.7065, area: 'Poranki' },
  { name: 'Vishnupuram Colony Main Road', lat: 16.4832, lng: 80.7040, area: 'Poranki' },
  { name: 'Vishnupuram Colony 1st Line', lat: 16.4835, lng: 80.7035, area: 'Poranki' },
  { name: 'Lakshmipuram Colony Main Road', lat: 16.4815, lng: 80.7065, area: 'Poranki' },
  { name: 'Lakshmipuram Colony 1st Cross', lat: 16.4820, lng: 80.7070, area: 'Poranki' },
  { name: 'RTC Colony Main Road', lat: 16.4805, lng: 80.7100, area: 'Poranki' },
  { name: 'Limra Colony Main Road', lat: 16.4765, lng: 80.7025, area: 'Poranki' },
  { name: 'Bhagyanagar Colony Road', lat: 16.4782, lng: 80.7005, area: 'Poranki' },
  { name: 'TCR Colony Internal Roads', lat: 16.4790, lng: 80.7050, area: 'Poranki' },
  { name: 'Poranki Shivalayam Veedhi (Temple Street)', lat: 16.4785, lng: 80.7095, area: 'Poranki' },
  { name: 'Abhaya Anjaneya Swamy Temple Street', lat: 16.4790, lng: 80.7088, area: 'Poranki' },
  { name: 'Poranki Post Office Street', lat: 16.4782, lng: 80.7085, area: 'Poranki' },
  { name: 'Gosala Donka / Gosala Road Turning', lat: 16.4820, lng: 80.7090, area: 'Poranki' },
  { name: '100 Feet Road Junction (Poranki Side)', lat: 16.4815, lng: 80.7025, area: 'Poranki' },

  // ==============================================
  // === TADIGADAPA: STREETS, TURNINGS & COLONIES ===
  // ==============================================
  { name: 'Tadigadapa Center (Main Junction)', lat: 16.4713, lng: 80.6970, area: 'Tadigadapa' },
  { name: 'Tadigadapa Donka Road (Main)', lat: 16.4702, lng: 80.6952, area: 'Tadigadapa' },
  { name: 'Tadigadapa Donka Road Turning (Bandar Road)', lat: 16.4705, lng: 80.6959, area: 'Tadigadapa' },
  { name: 'Vasanth Nagar Main Road', lat: 16.4740, lng: 80.6990, area: 'Tadigadapa' },
  { name: 'Vasanth Nagar 1st Cross', lat: 16.4745, lng: 80.6985, area: 'Tadigadapa' },
  { name: 'Vasanth Nagar 2nd Cross', lat: 16.4750, lng: 80.6988, area: 'Tadigadapa' },
  { name: 'Vasanth Nagar 3rd Cross', lat: 16.4755, lng: 80.6992, area: 'Tadigadapa' },
  { name: 'Sitapuram Colony Main Road', lat: 16.4811, lng: 80.7145, area: 'Tadigadapa Border' },
  { name: 'LV Prasad Eye Institute Road / Hospital Turning', lat: 16.4719, lng: 80.6975, area: 'Tadigadapa' },
  { name: 'Yanamalakuduru Konda Road (Tadigadapa Side)', lat: 16.4812, lng: 80.6931, area: 'Tadigadapa' },
  { name: 'Tadigadapa Panchayat Office Road', lat: 16.4710, lng: 80.6965, area: 'Tadigadapa' },
  { name: 'Old Tadigadapa Village Road (Grama Veedhi)', lat: 16.4720, lng: 80.6955, area: 'Tadigadapa' },
  { name: 'Sivalayam Street / Temple Road', lat: 16.4714, lng: 80.6969, area: 'Tadigadapa' },
  // ==========================================
  // === KANURU DEEP-DIVE: COLONIES & LAYOUTS ===
  // ==========================================
  
  // -- Sanath Nagar Lines --
  { name: 'Sanath Nagar 1st Road', lat: 16.4870, lng: 80.6840, area: 'Kanuru' },
  { name: 'Sanath Nagar 3rd Road', lat: 16.4878, lng: 80.6848, area: 'Kanuru' },
  { name: 'Sanath Nagar 4th Road', lat: 16.4880, lng: 80.6850, area: 'Kanuru' },
  { name: 'Sanath Nagar 5th Road', lat: 16.4882, lng: 80.6852, area: 'Kanuru' },
  
  // -- Tulasi Nagar Lines --
  { name: 'Tulasi Nagar 2nd Cross', lat: 16.4850, lng: 80.6860, area: 'Kanuru (Tulasi Nagar)' },
  { name: 'Tulasi Nagar 3rd Cross', lat: 16.4845, lng: 80.6865, area: 'Kanuru (Tulasi Nagar)' },
  
  // -- Murali Nagar Lines --
  { name: 'Murali Nagar 2nd Line', lat: 16.4808, lng: 80.6875, area: 'Kanuru' },
  { name: 'Murali Nagar 3rd Line', lat: 16.4802, lng: 80.6878, area: 'Kanuru' },
  
  // -- Chalasani Nagar Lines --
  { name: 'Chalasani Nagar 1st Cross', lat: 16.4820, lng: 80.6905, area: 'Kanuru' },
  { name: 'Chalasani Nagar 2nd Cross', lat: 16.4815, lng: 80.6910, area: 'Kanuru' },
  
  // -- Other Major Colonies --
  { name: 'Bank Colony / SBI Colony', lat: 16.4835, lng: 80.6845, area: 'Kanuru' },
  { name: 'Postal Colony', lat: 16.4865, lng: 80.6825, area: 'Kanuru' },
  { name: 'Mahalaxmi Nagar', lat: 16.4825, lng: 80.6830, area: 'Kanuru' },
  { name: 'Srinivasa Nagar', lat: 16.4810, lng: 80.6840, area: 'Kanuru' },
  { name: 'Dolphin Estates Main Road', lat: 16.4845, lng: 80.6895, area: 'Kanuru' },
  { name: 'Padmavathi Nagar 1st Line', lat: 16.4850, lng: 80.6845, area: 'Kanuru' },
  
  // -- Historic & Main Connecting Roads --
  { name: 'Kanuru Agraharam (Old Village Road)', lat: 16.4860, lng: 80.6900, area: 'Kanuru' },
  { name: 'Kanuru Kotha Veedhi', lat: 16.4855, lng: 80.6915, area: 'Kanuru' },
  { name: 'Pappula Millu Center Turning', lat: 16.4841, lng: 80.6895, area: 'Kanuru' },
  { name: 'Power One Mall Road', lat: 16.4855, lng: 80.6890, area: 'Kanuru' },
  { name: 'Panta Kaluva Road (Kanuru Stretch)', lat: 16.4895, lng: 80.6880, area: 'Kanuru' },
  { name: 'Bandar Road (Kanuru Stretch)', lat: 16.4860, lng: 80.6870, area: 'Kanuru' },
  { name: 'Auto Nagar Gate (Kanuru Border)', lat: 16.4905, lng: 80.6775, area: 'Kanuru Border' },
  // =========================================================
  // === NEWLY ADDED: KANURU SURROUNDINGS & MISSING SPOTS ===
  // =========================================================

  // === HEALTHCARE & HOSPITALS ===
  { name: 'PR Hospital', lat: 16.4872, lng: 80.6865, area: 'Kanuru' },
  { name: 'American Oncology Institute', lat: 16.4860, lng: 80.6880, area: 'Kanuru' },
  { name: 'Rainbow Children\'s Hospital & BirthRight', lat: 16.4930, lng: 80.6730, area: 'Currency Nagar Border' },

  // === MAJOR COLONIES & NEIGHBORHOODS ===
  { name: 'Currency Nagar Main Road', lat: 16.4940, lng: 80.6720, area: 'Currency Nagar' },
  { name: 'APIIC Colony', lat: 16.4900, lng: 80.6750, area: 'Kanuru Border' },
  { name: 'Veterinary Colony', lat: 16.4920, lng: 80.6740, area: 'Kanuru Border' },
  { name: 'NTR Colony', lat: 16.4950, lng: 80.6710, area: 'Currency Nagar Border' },
  
  // === COMMERCIAL, PLAZAS & CENTERS ===
  { name: 'Bosu Bomma Center', lat: 16.4780, lng: 80.7090, area: 'Poranki' },
  { name: 'Simhadri Plaza', lat: 16.4855, lng: 80.6885, area: 'Kanuru' },
  { name: 'Venkatram Plaza', lat: 16.4860, lng: 80.6875, area: 'Kanuru' },
  
  // Note: These are slightly outside Kanuru (towards MG Road/Benz Circle) 
  // but heavily used by Kanuru residents for shopping/dining.
  { name: 'Quality Hotel DV Manor', lat: 16.5030, lng: 80.6450, area: 'MG Road' },
  { name: 'Paradise Biryani', lat: 16.5010, lng: 80.6460, area: 'Benz Circle' },
  { name: 'Swathi Shopping Mall', lat: 16.5050, lng: 80.6400, area: 'MG Road' },
  { name: 'Westside (Vajra Commercial Complex)', lat: 16.5005, lng: 80.6470, area: 'Benz Circle' },

  // === APARTMENTS & RESIDENTIAL PROJECTS ===
  { name: 'Damayanti Residency / Varahi Damayanti', lat: 16.4865, lng: 80.6820, area: 'Kanuru (100 Feet Road)' },
  { name: 'Aadya Capital Empire', lat: 16.4835, lng: 80.6895, area: 'Kanuru' },
  { name: 'Aadya Grande', lat: 16.4840, lng: 80.6885, area: 'Kanuru' },
  { name: 'Siva Sai Vamsis Vadlamudi', lat: 16.4820, lng: 80.6870, area: 'Kanuru' },
  { name: 'MVR Gayatri Residency', lat: 16.4815, lng: 80.6880, area: 'Kanuru' },
  { name: 'SR JR Nest', lat: 16.4855, lng: 80.6850, area: 'Kanuru' },
  { name: 'Balajee Ananda Pavan Heights', lat: 16.4860, lng: 80.6840, area: 'Kanuru' },
  { name: 'Avaneendra Tirumala Castle', lat: 16.4870, lng: 80.6835, area: 'Kanuru' },
  { name: 'TVK Srinidhi', lat: 16.4825, lng: 80.6900, area: 'Kanuru' },
  { name: 'Sarojini Heights', lat: 16.4810, lng: 80.6910, area: 'Kanuru' },
  { name: 'Venkateswara Heights', lat: 16.4845, lng: 80.6860, area: 'Kanuru' },
  { name: 'Vijayalakshmi Enclave', lat: 16.4830, lng: 80.6855, area: 'Kanuru' },
  { name: 'Sri Manidweepa Nilayam', lat: 16.4850, lng: 80.6830, area: 'Kanuru' },
  { name: 'Sree Sai Sadan', lat: 16.4865, lng: 80.6890, area: 'Kanuru' },
  { name: 'Sri Aishwarya Elite Vault', lat: 16.4875, lng: 80.6880, area: 'Kanuru' },
];

const MUNICIPALITY_BOUNDS = {
  south: 16.43,
  north: 16.54,
  west:  80.58,
  east:  80.74,
}

const DEFAULT_CENTER = [16.4850, 80.6480]
const DEFAULT_ZOOM   = 15  // Closer zoom for precise location
function findNearestLandmark(lat, lng) {
  let nearest = null
  let minDist = Infinity
  for (const l of LOCAL_LANDMARKS) {
    const dist = haversineMeters(lat, lng, l.lat, l.lng)
    if (dist < minDist) {
      minDist = dist
      nearest = { ...l, distanceM: Math.round(dist) }
    }
  }
  return nearest
}

function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}
export default function LocationMap({
  lang,
  value,
  onChange,
  compactSearchOnly = false,
  mapOnly = false
}) {
  const [gpsState,      setGpsState]      = useState('idle')
  const [gpsAccuracy,   setGpsAccuracy]   = useState(null)
  const [searchQuery,   setSearchQuery]   = useState('')
  const [searchState,   setSearchState]   = useState('idle')
  const [suggestions,   setSuggestions]   = useState([])
  const [flyTarget,     setFlyTarget]     = useState(null)
  const [addressLabel,  setAddressLabel]  = useState('')
  const searchRef   = useRef(null)
  const debounceRef = useRef(null)

  // ── Reverse geocode a GPS coordinate to readable address ──
 async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `/nominatim/reverse?lat=${lat}&lon=${lng}&format=jsonv2&zoom=19&addressdetails=1&namedetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
    const data = await res.json()
    const addr = data.address || {}
    const name = data.namedetails?.name || data.name || ''

    const parts = []
    const placeName =
      addr.amenity || addr.shop || addr.building ||
      addr.office  || addr.tourism || addr.leisure || name || null
    if (placeName) parts.push(placeName)

    if (addr.house_number && addr.road) {
      parts.push(`${addr.house_number}, ${addr.road}`)
    } else if (addr.road) {
      parts.push(addr.road)
    } else if (addr.pedestrian) {
      parts.push(addr.pedestrian)
    }

    if (addr.neighbourhood)   parts.push(addr.neighbourhood)
    else if (addr.suburb)     parts.push(addr.suburb)
    else if (addr.village)    parts.push(addr.village)

    if (addr.town || addr.city_district)
      parts.push(addr.town || addr.city_district)

    // ── If we got a road — return immediately ──
    if (addr.road || addr.pedestrian) {
      return parts.slice(0, 3).join(', ')
    }

    // ── No road found — try nearby search for road ──
    // Search in small offsets around the point to find nearest road
    const offsets = [
      [0.0002, 0],   // ~22m north
      [-0.0002, 0],  // ~22m south
      [0, 0.0002],   // ~20m east
      [0, -0.0002],  // ~20m west
      [0.0001, 0.0001],
      [-0.0001, 0.0001],
    ]

    for (const [dLat, dLng] of offsets) {
      try {
        const r2 = await fetch(
          `/nominatim/reverse?lat=${lat + dLat}&lon=${lng + dLng}&format=jsonv2&zoom=19&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const d2 = await r2.json()
        const a2 = d2.address || {}
        if (a2.road || a2.pedestrian) {
          const roadName = a2.road || a2.pedestrian
          const area     = a2.neighbourhood || a2.suburb || a2.village || ''
          const town     = a2.town || a2.city_district || ''
          return [roadName, area, town].filter(Boolean).slice(0, 3).join(', ')
        }
      } catch { continue }
    }

    // ── Still no road — use nearest LOCAL_LANDMARK ──
    const nearest = findNearestLandmark(lat, lng)
    if (nearest && nearest.distanceM <= 300) {
      return `Near ${nearest.name}, ${nearest.area}`
    }

    // ── Last resort — coordinates ──
    return parts.length > 0
      ? parts.slice(0, 3).join(', ')
      : `${lat.toFixed(6)}, ${lng.toFixed(6)}`

  } catch {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }
}

// Simple haversine distance
function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function getDirection(fromLat, fromLng, toLat, toLng) {
  const dLat = toLat - fromLat
  const dLng = toLng - fromLng
  if (Math.abs(dLat) > Math.abs(dLng)) {
    return dLat > 0 ? 'north of' : 'south of'
  }
  return dLng > 0 ? 'east of' : 'west of'
}

  // ── GPS with HIGH accuracy ──
  function handleUseGPS() {
    if (!navigator.geolocation) { setGpsState('error'); return }

    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'denied') { setGpsState('denied'); return }
        doGetPosition()
      }).catch(() => doGetPosition())
    } else {
      doGetPosition()
    }
  }

  function doGetPosition() {
  setGpsState('loading')
  setGpsAccuracy(null)

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const position = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      }

      const accuracy = Math.round(pos.coords.accuracy)
      setGpsAccuracy(accuracy)

      // Reverse geocode first
      const label = await reverseGeocode(
        position.lat,
        position.lng
      )

      setAddressLabel(label)
      setFlyTarget(position)

      onChange({
        ...position,
        address: label
      })

      setGpsState('idle')
    },

    (err) => {
      setGpsState(
        err.code === 1 ? 'denied' : 'error'
      )
    },

    {
      timeout: 15000,
      maximumAge: 0,
      enableHighAccuracy: true,
    }
  )
}

  // ── Search using Nominatim with strict municipality bounds ──
// ── Search using Nominatim first, fallback to strict local bounds ──
  // ── Search using Nominatim first, fallback to strict local bounds ──
  // ── Search using Nominatim first, fallback to strict local bounds ──
  // ── Search using Nominatim first, fallback to strict local bounds ──
  async function fetchSuggestions(query) {
    if (!query || query.trim().length < 3) { // Force minimum 3 letters
      setSuggestions([])
      return
    }
    setSearchState('loading')

    try {
      const q = query.toLowerCase().trim()
      const { south, north, west, east } = MUNICIPALITY_BOUNDS
      
      const appEmail = "&email=safe.street.app@gmail.com"
      const viewboxStr = `${west},${north},${east},${south}`

      // Fire ONLY ONE request. We append "Vijayawada" so Nominatim knows the city.
      const targetUrl = `/nominatim/search?q=${encodeURIComponent(query + ', Vijayawada')}&format=jsonv2&limit=8&addressdetails=1&viewbox=${viewboxStr}&countrycodes=in${appEmail}`

      let nominatimResults = []
      try {
        const res = await fetch(targetUrl)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) nominatimResults = data
        }
      } catch (err) {
        console.warn("Nominatim blocked request or network failed.")
      }

      // Filter by your Municipality Box
      nominatimResults = nominatimResults.filter(place => {
        if (!place || !place.lat || !place.lon) return false
        const lat = parseFloat(place.lat)
        const lng = parseFloat(place.lon)
        return (lat >= south && lat <= north && lng >= west && lng <= east)
      })

      // Check if Nominatim returned valid local results
      if (nominatimResults.length > 0) {
        setSuggestions(nominatimResults.slice(0, 6))
        setSearchState('idle')
        return // Exit immediately so local DB is not checked
      }

      // Fallback to Local Landmarks database
      const localMatches = LOCAL_LANDMARKS
        .filter(l => l.name.toLowerCase().includes(q) || l.area.toLowerCase().includes(q))
        .map(l => ({
          place_id: `local_${l.name.replace(/\s+/g, '_')}`,
          lat: l.lat,
          lon: l.lng,
          display_name: l.name,
          isLocal: true,
          address: {
            name: l.name,
            neighbourhood: l.area,
            town: 'Tadigadapa Municipality',
          }
        }))

      if (localMatches.length > 0) {
        setSuggestions(localMatches.slice(0, 6))
        setSearchState('idle')
      } else {
        setSuggestions([])
        setSearchState('notfound')
      }

    } catch (error) {
      console.error("Search Error:", error)
      setSearchState('error')
      setSuggestions([])
    }
  }
  function handleSearchInput(e) {
    const q = e.target.value
    setSearchQuery(q)
    setSuggestions([])
    setSearchState('idle')
    clearTimeout(debounceRef.current)
    // 1000ms ensures we strictly obey OpenStreetMap's 1-request-per-second rule
    debounceRef.current = setTimeout(() => fetchSuggestions(q), 1000)
  }

  async function handleSuggestionClick(item) {
    const position = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) }

    // Build clean label from address details
    const addr  = item.address || {}
    const parts = [
      addr.road || addr.pedestrian,
      addr.neighbourhood || addr.suburb,
      addr.town || addr.city_district || 'Vijayawada',
    ].filter(Boolean)
    const label = parts.join(', ') || item.display_name.split(',').slice(0, 2).join(', ')

    onChange({ ...position, address: label })
    setFlyTarget(position)
    setSearchQuery(label)
    setAddressLabel(label)
    setSuggestions([])
    setSearchState('idle')
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter' && suggestions.length > 0) handleSuggestionClick(suggestions[0])
    if (e.key === 'Escape') setSuggestions([])
  }

  // Handle map click — reverse geocode the tapped point
 async function handleMapClick(pos) {
  const label = await reverseGeocode(pos.lat, pos.lng)
  setAddressLabel(label)
  setFlyTarget(pos)
  onChange({ ...pos, address: label })  // ← include address in position
}

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSuggestions([])
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const te = lang === 'te'

 /* ── SEARCH ONLY ───────────────────── */
/* DEFAULT */
return (
    <div className="location-map-wrapper">

      {/* FULL SEARCH TOP */}
      <div className="location-search-top">
        <div className="search-wrap" ref={searchRef}>
          <div className="search-input-row">
            <div className="search-icon-wrap">
              {searchState === 'loading' ? (
                <span className="spinner" />
              ) : (
                <span className="search-symbol">⌕</span>
              )}
            </div>
            <input
              type="text"
              className="search-input"
              placeholder={
                te
                  ? 'వీధి పేరు లేదా ప్రదేశం వెతకండి...'
                  : 'Search street, area or landmark'
              }
              value={searchQuery}
              onChange={handleSearchInput}
              onKeyDown={handleSearchKeyDown}
              autoComplete="off"
            />
          </div>

          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((item, i) => (
                <li
                  key={item.place_id || i}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(item)}
                >
                  {item.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* DASHBOARD */}
      <div className="location-layout">

        {/* LEFT CARD */}
        <div className="location-left-panel">
          <div className="step-badge">
            STEP 1 OF 4
          </div>

          <h2 className="location-title">
            {te ? 'స్థానాన్ని గుర్తించండి' : 'Mark Your Location'}
          </h2>

          <p className="location-subtitle">
            {te
              ? 'మ్యాప్‌పై టాప్ చేయండి లేదా GPS వాడండి'
              : 'Tap the hazard location on the map or use GPS'}
          </p>

          <button
            type="button"
            className="gps-btn"
            onClick={handleUseGPS}
          >
            {te ? 'GPS వాడండి' : 'Use GPS'}
          </button>

          {/* --- GPS HELPER BOX --- */}
          {/* --- GPS HELPER BOX --- */}
          {/* --- NEW GPS HELPER BOX --- */}
        <div 
          className="gps-helper-card" 
          style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '10px', 
            textAlign: 'left' 
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" height="18" 
            viewBox="0 0 24 24" fill="none" 
            stroke="#32445D" strokeWidth="2.5" 
            strokeLinecap="round" strokeLinejoin="round" 
            style={{ flexShrink: 0, marginTop: '2px' }}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span style={{ lineHeight: '1.4' }}>
            {te 
              ? 'మీ ప్రస్తుత స్థానాన్ని ఆటోమేటిక్‌గా గుర్తించడానికి GPS ఆన్ చేయండి.' 
              : 'Enable GPS to automatically detect your current location.'}
          </span>
        </div>

          <div className="selected-location-card">
            <div className="selected-location-header" style={{ textAlign: 'center' }}>
              {te ? 'ఎంచుకున్న స్థానం' : 'SELECTED LOCATION'}
            </div>

            <div className="selected-location-body" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {value ? (
                <>
                  <div className="selected-place-name">
                    {addressLabel || 'Location selected'}
                  </div>

                  <div className="selected-location-coords">
                    {value.lat.toFixed(6)}, {' '} {value.lng.toFixed(6)}
                  </div>
                </>
              ) : (
                <div style={{ color: '#97A5BA' }}>
                  {te
                    ? 'స్థానం ఇంకా ఎంచుకోలేదు'
                    : 'No location selected'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT MAP */}
        <div className="location-map-panel">
          <div className="map-container-wrap">
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={DEFAULT_ZOOM}
              style={{ width: '100%', height: '100%', background: '#f8f9fa' }}
              zoomControl={true}
              attributionControl={false}
            >
              <FixMapResize />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
                crossOrigin="anonymous"
                keepBuffer={8}
                updateWhenIdle={false}
                tileSize={256}
                zoomOffset={0}
              />

              {/* 1. REMOVED <MapClickHandler /> so users cannot click the map to spoof a location */}

              {flyTarget && (
                <FlyToPosition position={flyTarget} />
              )}

             {value && (
              <Marker
                draggable={false} /* 2. CHANGED to false so the pin is locked in place */
                position={[value.lat, value.lng]}
                icon={safestreetIcon}
                /* 3. REMOVED the eventHandlers block entirely */
              />
            )}
            </MapContainer>
          </div>
        </div>

      </div>
    </div>
  );
}