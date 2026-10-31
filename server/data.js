/**
 * MediQueue In-Memory Seed Data & Store
 * High quality healthcare data for Delhi / Metro Hospital Hub
 */

export const initialDoctors = [
  {
    id: 'doc-1',
    name: 'Dr. Rajesh Sharma',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    specialization: 'Cardiology',
    qualifications: 'MBBS, MD, DM (Cardiology) - AIIMS New Delhi',
    experience: 18,
    hospital: 'Apex Metro Heart & Multi-Speciality Hospital',
    room: 'Room 302, OPD Wing A',
    fee: 800,
    rating: 4.9,
    ratingBreakdown: {
      communication: 4.9,
      waitingManagement: 4.8,
      overall: 4.9
    },
    totalReviews: 142,
    avgDuration: 8, // minutes
    currentToken: 18,
    isPaused: false,
    pauseReason: '',
    queue: [
      { token: 18, patientName: 'Amit Verma', status: 'IN_ROOM', time: '10:30 AM', priority: 'NORMAL' },
      { token: 19, patientName: 'Sunita Devi', status: 'WAITING', time: '10:45 AM', priority: 'NORMAL' },
      { token: 20, patientName: 'Mohd. Zeeshan', status: 'WAITING', time: '10:55 AM', priority: 'NORMAL' },
      { token: 21, patientName: 'Geeta Kumari', status: 'WAITING', time: '11:05 AM', priority: 'NORMAL' },
      { token: 22, patientName: 'Harish Chandra', status: 'WAITING', time: '11:15 AM', priority: 'NORMAL' },
      { token: 23, patientName: 'Deepak Joshi', status: 'WAITING', time: '11:25 AM', priority: 'NORMAL' },
      { token: 24, patientName: 'Meenakshi Iyer', status: 'WAITING', time: '11:35 AM', priority: 'NORMAL' },
      { token: 25, patientName: 'Rahul Sharma (You)', status: 'WAITING', time: '11:45 AM', priority: 'NORMAL', isCurrentDemoUser: true },
      { token: 26, patientName: 'Arjun Das', status: 'WAITING', time: '11:55 AM', priority: 'NORMAL' },
      { token: 27, patientName: 'Pooja Agarwal', status: 'WAITING', time: '12:05 PM', priority: 'NORMAL' }
    ]
  },
  {
    id: 'doc-2',
    name: 'Dr. Ananya Sen',
    photo: 'https://images.unsplash.com/photo-1594824813576-9c4c13db4391?w=400&auto=format&fit=crop&q=80',
    specialization: 'Pediatrics & Neonatology',
    qualifications: 'MBBS, DCH, DNB (Pediatrics)',
    experience: 12,
    hospital: 'Apex Metro Heart & Multi-Speciality Hospital',
    room: 'Room 105, Child Care Block',
    fee: 650,
    rating: 4.8,
    ratingBreakdown: {
      communication: 4.9,
      waitingManagement: 4.7,
      overall: 4.8
    },
    totalReviews: 98,
    avgDuration: 10,
    currentToken: 12,
    isPaused: false,
    pauseReason: '',
    queue: [
      { token: 12, patientName: 'Baby Aarav', status: 'IN_ROOM', time: '10:40 AM', priority: 'NORMAL' },
      { token: 13, patientName: 'Kiara Sen', status: 'WAITING', time: '10:50 AM', priority: 'NORMAL' },
      { token: 14, patientName: 'Vihaan Roy', status: 'WAITING', time: '11:00 AM', priority: 'NORMAL' },
      { token: 15, patientName: 'Anaya Gupta', status: 'WAITING', time: '11:10 AM', priority: 'NORMAL' }
    ]
  },
  {
    id: 'doc-3',
    name: 'Dr. Vikram Patel',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
    specialization: 'Orthopedics & Joint Replacement',
    qualifications: 'MBBS, MS (Ortho), Fellowship Joint Recon (UK)',
    experience: 16,
    hospital: 'Apex Metro Heart & Multi-Speciality Hospital',
    room: 'Room 214, Ortho & Trauma OPD',
    fee: 900,
    rating: 4.7,
    ratingBreakdown: {
      communication: 4.7,
      waitingManagement: 4.6,
      overall: 4.7
    },
    totalReviews: 115,
    avgDuration: 9,
    currentToken: 15,
    isPaused: false,
    pauseReason: '',
    queue: [
      { token: 15, patientName: 'Ramesh Kulkarni', status: 'IN_ROOM', time: '10:45 AM', priority: 'NORMAL' },
      { token: 16, patientName: 'Balwant Singh', status: 'WAITING', time: '10:55 AM', priority: 'NORMAL' },
      { token: 17, patientName: 'Chitra Subramanian', status: 'WAITING', time: '11:05 AM', priority: 'NORMAL' }
    ]
  },
  {
    id: 'doc-4',
    name: 'Dr. Priya Nair',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    specialization: 'Neurology & Stroke Care',
    qualifications: 'MBBS, MD (Medicine), DM (Neurology)',
    experience: 14,
    hospital: 'Apex Metro Heart & Multi-Speciality Hospital',
    room: 'Room 408, Neuro Sciences Center',
    fee: 1000,
    rating: 4.9,
    ratingBreakdown: {
      communication: 5.0,
      waitingManagement: 4.8,
      overall: 4.9
    },
    totalReviews: 86,
    avgDuration: 12,
    currentToken: 8,
    isPaused: false,
    pauseReason: '',
    queue: [
      { token: 8, patientName: 'Kishore Trivedi', status: 'IN_ROOM', time: '10:30 AM', priority: 'NORMAL' },
      { token: 9, patientName: 'Meera Rajput', status: 'WAITING', time: '10:45 AM', priority: 'NORMAL' }
    ]
  }
];

export const initialAccommodations = [
  {
    id: 'acc-1',
    name: 'Shanti Sewa Dharamshala',
    type: 'Dharamshala',
    pricePerDay: 250,
    distanceKm: 0.25,
    distanceDisplay: '250 meters (3 min walk)',
    availableRooms: 12,
    capacityPerRoom: '2-4 persons',
    timings: '24 Hours Check-in / Check-out',
    facilities: ['Purified RO Water', 'Attached Clean Bathrooms', 'Elevator', 'Security 24x7', 'Power Backup'],
    contact: '+91 98112 34501',
    address: 'Plot 14, Opp Metro Gate 2, Apex Hospital Lane',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop&q=80',
    verified: true,
    rating: 4.5,
    mapCoords: { lat: 28.5355, lng: 77.2410 }
  },
  {
    id: 'acc-2',
    name: 'Apex Hospital Attendant Waiting Lodge',
    type: 'Hospital Accommodation',
    pricePerDay: 150,
    distanceKm: 0.05,
    distanceDisplay: '50 meters (Inside Hospital Campus, Wing C)',
    availableRooms: 24,
    capacityPerRoom: '1-2 persons (Cubicle / Dorm beds)',
    timings: 'Open 24/7 for verified patient attendants',
    facilities: ['Direct hospital corridor access', 'Locker storage', 'Hot water', 'Charge points', 'Doctor call bell'],
    contact: '+91 11 4567 8900 (Ext. 204)',
    address: 'Ground Floor, Attendant Care Complex, Apex Hospital',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500&auto=format&fit=crop&q=80',
    verified: true,
    rating: 4.7,
    mapCoords: { lat: 28.5360, lng: 77.2415 }
  },
  {
    id: 'acc-3',
    name: 'Metro Care Budget Guest House',
    type: 'Guest House',
    pricePerDay: 750,
    distanceKm: 0.45,
    distanceDisplay: '450 meters (5 min walk)',
    availableRooms: 8,
    capacityPerRoom: '2-3 persons',
    timings: '11:00 AM Check-in / 10:00 AM Check-out',
    facilities: ['Air Conditioning', 'Free High-Speed Wi-Fi', 'Attached Western Washroom', 'Room Service', 'Lift'],
    contact: '+91 98710 88219',
    address: 'B-42, Vikas Marg Extension, Near Apex Metro Exit',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&auto=format&fit=crop&q=80',
    verified: true,
    rating: 4.3,
    mapCoords: { lat: 28.5375, lng: 77.2430 }
  },
  {
    id: 'acc-4',
    name: 'Sai Krupa Rest Lodge & Family Rooms',
    type: 'Budget Lodge',
    pricePerDay: 450,
    distanceKm: 0.7,
    distanceDisplay: '700 meters (8 min walk)',
    availableRooms: 6,
    capacityPerRoom: '3-5 persons (Family Room)',
    timings: 'Flexible 24h token check-in',
    facilities: ['Drinking Water', 'Hot Geyser', 'Quiet Environment', 'Parking for Auto/Cab'],
    contact: '+91 98109 44321',
    address: 'Shop 8-A, Old Post Office Road, Sector 3',
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?w=500&auto=format&fit=crop&q=80',
    verified: true,
    rating: 4.1,
    mapCoords: { lat: 28.5385, lng: 77.2450 }
  }
];

export const initialFoodPlaces = [
  {
    id: 'food-1',
    name: 'Apex Sanjeevani Hospital Canteen',
    type: 'Hospital Canteen',
    diet: 'Pure Vegetarian (Hygienic & Healthy)',
    approxMealPrice: 60,
    distanceDisplay: 'Inside Campus (Basement Wing B)',
    distanceKm: 0.05,
    hours: 'Open 24 Hours',
    phone: '+91 11 4567 8990',
    address: 'Basement, OPD Block, Apex Hospital',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80',
    deliveryAvailable: true,
    specialties: ['Special Light Diet Khichdi', 'Dal Roti Thali (₹60)', 'Fresh Fruit Juices', 'Herbal Tea / Milk'],
    rating: 4.6
  },
  {
    id: 'food-2',
    name: 'Shree Krishna Bhojnalaya & Tiffin',
    type: 'Budget Restaurant & Tiffin',
    diet: 'Pure Veg & Jain Options',
    approxMealPrice: 80,
    distanceDisplay: '200 meters from OPD Gate',
    distanceKm: 0.2,
    hours: '6:30 AM – 11:30 PM',
    phone: '+91 98114 99012',
    address: 'Main Market, Shop 12, Opposite Gate 1',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80',
    deliveryAvailable: true,
    specialties: ['Unlimited Ghar Jaisi Thali (₹80)', 'Poori Sabzi Breakfast', 'Attendant Packed Tiffins'],
    rating: 4.8
  },
  {
    id: 'food-3',
    name: 'Annapurna Daily Tiffin Express',
    type: 'Tiffin & Meal Delivery',
    diet: 'Veg / Non-Veg Separate Kitchen',
    approxMealPrice: 90,
    distanceDisplay: 'Delivers to Hospital Gate in 15 mins',
    distanceKm: 0.6,
    hours: '8:00 AM – 10:30 PM',
    phone: '+91 98223 77109',
    address: 'Near Old Bus Stand, Ring Road',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    deliveryAvailable: true,
    specialties: ['Patient Companion 3-Meal Box', 'Fresh Salad Bowls', 'Warm Dal Tadka with 4 Chapatis'],
    rating: 4.5
  },
  {
    id: 'food-4',
    name: '24/7 Chai, Snacks & Cafe Corner',
    type: 'Cafeteria & Snacks',
    diet: 'Beverages, Sandwiches & Snacks',
    approxMealPrice: 40,
    distanceDisplay: '100 meters (Near Emergency Wing)',
    distanceKm: 0.1,
    hours: 'Open 24 Hours',
    phone: '+91 98991 22340',
    address: 'Corner Stall 4, Hospital Peripheral Road',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80',
    deliveryAvailable: false,
    specialties: ['Hot Ginger / Masala Chai (₹15)', 'Poha / Upma (₹40)', 'Biscuits & Boiled Water'],
    rating: 4.4
  }
];

export const initialAmbulances = [
  {
    id: 'amb-1',
    category: 'Basic Ambulance (BLS)',
    description: 'Equipped with oxygen cylinder, stretcher, first-aid kit, and emergency paramedic.',
    plateNumber: 'DL 01 EM 4022',
    driver: 'Rameshwar Yadav',
    phone: '+91 98111 10801',
    etaMinutes: 6,
    baseFare: 800,
    status: 'AVAILABLE',
    equipment: ['Oxygen Supply', 'Foldable Stretcher', 'Basic First Aid Kit', 'Sphygmomanometer']
  },
  {
    id: 'amb-2',
    category: 'Advanced Life Support (ALS)',
    description: 'Advanced ICU cardiac monitor, ventilator, defibrillator, trained emergency nurse.',
    plateNumber: 'DL 01 EM 8899',
    driver: 'Surendra Pal',
    phone: '+91 98111 10802',
    etaMinutes: 9,
    baseFare: 2200,
    status: 'AVAILABLE',
    equipment: ['Portable Transport Ventilator', 'ECG Monitor & Defibrillator', 'Suction Machine', 'Emergency Meds Box']
  },
  {
    id: 'amb-3',
    category: 'ICU on Wheels (Critical Care)',
    description: 'Full mobile critical care unit with specialized doctor, multi-para monitor, and infusion pumps.',
    plateNumber: 'DL 01 EM 9901',
    driver: 'Kuldeep Singh',
    phone: '+91 98111 10803',
    etaMinutes: 12,
    baseFare: 3500,
    status: 'AVAILABLE',
    equipment: ['ICU Ventilator', 'Arterial Blood Gas Kit', 'Cardiac Pacing Unit', 'Full Resuscitation Suite']
  },
  {
    id: 'amb-4',
    category: 'Patient Transfer Ambulance',
    description: 'Comfortable non-emergency transfer for discharge, dialysis patients, or inter-city travel.',
    plateNumber: 'DL 01 TR 2244',
    driver: 'Mohan Lal',
    phone: '+91 98111 10804',
    etaMinutes: 15,
    baseFare: 600,
    status: 'AVAILABLE',
    equipment: ['Comfort Reclining Bed', 'Wheelchair Ramp', 'Air Conditioned Cabin', 'Luggage Compartment']
  }
];

export const initialReviews = [
  {
    id: 'rev-1',
    doctorId: 'doc-1',
    patientName: 'Sunita Mehra',
    date: 'Yesterday',
    rating: 5,
    communicationRating: 5,
    waitingRating: 5,
    verifiedAppointmentToken: '#14',
    comment: 'The live token tracking was a lifesaver! I left home when it reached 3 patients remaining and entered Dr. Sharma’s cabin with zero wait time. Exemplary diagnosis and bedside manner.'
  },
  {
    id: 'rev-2',
    doctorId: 'doc-1',
    patientName: 'Gaurav Aggarwal',
    date: '3 days ago',
    rating: 5,
    communicationRating: 5,
    waitingRating: 4,
    verifiedAppointmentToken: '#22',
    comment: 'Very patient listener. Explained the ECG and echocardiogram in simple language. Smart arrival time suggested 11:15 AM departure and was accurate to within 4 minutes.'
  },
  {
    id: 'rev-3',
    doctorId: 'doc-2',
    patientName: 'Kavita Bhatt',
    date: '5 days ago',
    rating: 5,
    communicationRating: 5,
    waitingRating: 5,
    verifiedAppointmentToken: '#09',
    comment: 'Dr. Ananya Sen handled my 3-year-old child with so much love and patience. Highly recommend!'
  }
];

export const initialChecklist = {
  documents: [
    { id: 'doc-item-1', title: 'Previous Medical Reports & Prescriptions', category: 'Medical History', packed: true, required: true },
    { id: 'doc-item-2', title: 'Blood Test / CBC / Lipid Profile (Recent)', category: 'Lab Reports', packed: true, required: true },
    { id: 'doc-item-3', title: 'X-Ray / MRI / CT Scan Films & CDs', category: 'Radiology', packed: false, required: false },
    { id: 'doc-item-4', title: 'MediQueue Appointment Token Slip / QR (#25)', category: 'Appointment Confirmation', packed: true, required: true },
    { id: 'doc-item-5', title: 'Government Photo ID (Aadhaar / Voter / Passport)', category: 'Identification', packed: true, required: true }
  ],
  medicines: [
    { id: 'med-item-1', name: 'Amlodipine 5mg', dosage: '1 tablet once daily morning', category: 'Blood Pressure', packed: true, note: 'Prescribed by cardiologist' },
    { id: 'med-item-2', name: 'Atorvastatin 10mg', dosage: '1 tablet bedtime', category: 'Cholesterol', packed: true, note: 'Take after dinner' },
    { id: 'med-item-3', name: 'Sorbitrate 5mg (Emergency Pocket Carry)', dosage: 'Sublingual if chest tightness occurs', category: 'Emergency SOS', packed: false, note: 'Keep in easily accessible coat pocket' }
  ],
  allergies: 'Penicillin allergy noted in 2021 (Skin hives). Paracetamol tolerated well.'
};
