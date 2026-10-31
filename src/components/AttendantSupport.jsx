import React, { useState } from 'react';
import {
  Bed, Utensils, HeartHandshake, MapPin, Phone,
  Clock, CheckCircle, Filter, Sparkles, Navigation,
  ExternalLink, Coffee, ShieldCheck, Users
} from 'lucide-react';

export default function AttendantSupport({
  accommodations = [],
  foodPlaces = [],
  currentDoctor,
  myToken = 25
}) {
  const [subTab, setSubTab] = useState('convenience'); // 'convenience', 'stay', 'food'

  // Stay filters
  const [maxStayPrice, setMaxStayPrice] = useState(1000);
  const [stayType, setStayType] = useState('All');

  // Food filters
  const [dietFilter, setDietFilter] = useState('All');
  const [maxFoodPrice, setMaxFoodPrice] = useState(150);

  // Inquiry modal
  const [inquiryItem, setInquiryItem] = useState(null);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Calculate live attendant insight
  const runningToken = currentDoctor ? currentDoctor.currentToken : 18;
  const patientsAhead = Math.max(0, myToken - runningToken);
  const waitMinutes = patientsAhead * (currentDoctor?.avgDuration || 8);

  const filteredAccommodations = accommodations.filter(acc => {
    const matchesPrice = acc.pricePerDay <= maxStayPrice;
    const matchesType = stayType === 'All' || acc.type.toLowerCase().includes(stayType.toLowerCase());
    return matchesPrice && matchesType;
  });

  const filteredFoodPlaces = foodPlaces.filter(f => {
    const matchesDiet = dietFilter === 'All' || f.diet.toLowerCase().includes(dietFilter.toLowerCase());
    const matchesPrice = f.approxMealPrice <= maxFoodPrice;
    return matchesDiet && matchesPrice;
  });

  const handleInquiry = (e) => {
    e.preventDefault();
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setInquiryItem(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-md bg-white/20">
              <HeartHandshake className="w-4 h-4 text-emerald-300" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-200">
              Family & Attendant Support System
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Comfortable Stay & Affordable Food Near Hospital
          </h2>
          <p className="text-sm text-emerald-100/90 mt-1">
            We care for patients and the companions supporting them. Access verified dharamshalas, budget lodges, 24/7 canteens, and tiffin services.
          </p>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
          {[
            { id: 'convenience', label: 'Attendant Dashboard & AI Tips', icon: Sparkles },
            { id: 'stay', label: 'Stay Near Hospital', icon: Bed },
            { id: 'food', label: 'Food & Canteens', icon: Utensils },
          ].map(tab => {
            const Icon = tab.icon;
            const active = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-white text-emerald-950 shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. ATTENDANT CONVENIENCE DASHBOARD */}
      {subTab === 'convenience' && (
        <div className="space-y-6">
          {/* Linked Patient Appointment Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                  Linked Patient Profile
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Rahul Sharma (Token #{myToken})</h3>
                <p className="text-xs text-slate-500">
                  Consulting: <strong>{currentDoctor?.name}</strong> • {currentDoctor?.hospital} ({currentDoctor?.room})
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-center px-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Running Token</span>
                  <span className="text-2xl font-black text-slate-900">#{runningToken}</span>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="text-center px-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Patients Ahead</span>
                  <span className="text-2xl font-black text-brand-600">{patientsAhead}</span>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="text-center px-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Est. Wait</span>
                  <span className="text-2xl font-black text-emerald-600 font-mono">{waitMinutes}m</span>
                </div>
              </div>
            </div>

            {/* Smart Recommendations */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-sm">Smart Recommendations for Attendants</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-800 uppercase block">Waiting Recommendation</span>
                  <p className="text-xs text-emerald-900 font-medium mt-1 leading-relaxed">
                    Estimated waiting time is <strong>{waitMinutes} minutes</strong>. You have time to sit comfortably at <strong>Shanti Sewa Dharamshala</strong> (250m) or take tea/refreshments at the hospital canteen.
                  </p>
                  <button
                    onClick={() => setSubTab('stay')}
                    className="mt-3 text-xs font-bold text-emerald-800 underline hover:text-emerald-950 inline-flex items-center gap-1"
                  >
                    View Nearby Dharamshalas <Navigation className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                  <span className="text-xs font-bold text-blue-800 uppercase block">Affordable Meals & Tiffin</span>
                  <p className="text-xs text-blue-900 font-medium mt-1 leading-relaxed">
                    Apex Sanjeevani Canteen serves fresh hygienic Dal-Roti Thali for <strong>₹60</strong>. Tiffin express also delivers straight to OPD waiting Gate 2.
                  </p>
                  <button
                    onClick={() => setSubTab('food')}
                    className="mt-3 text-xs font-bold text-blue-800 underline hover:text-blue-950 inline-flex items-center gap-1"
                  >
                    Browse Food & Canteen Menu <Navigation className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. STAY NEAR HOSPITAL */}
      {subTab === 'stay' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Filter Stay:</span>
              <div className="flex gap-1.5 overflow-x-auto">
                {['All', 'Dharamshala', 'Hospital Accommodation', 'Guest House', 'Budget Lodge'].map(type => (
                  <button
                    key={type}
                    onClick={() => setStayType(type)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                      stayType === type ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 font-medium">Max Budget:</span>
              <span className="font-bold text-slate-900">₹{maxStayPrice} / day</span>
              <input
                type="range"
                min="150"
                max="2000"
                step="50"
                value={maxStayPrice}
                onChange={(e) => setMaxStayPrice(parseInt(e.target.value, 10))}
                className="w-28 accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAccommodations.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative rounded-2xl overflow-hidden h-44 mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900">
                      {item.type}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md">
                      ₹{item.pricePerDay} <span className="font-normal text-[10px]">/ day</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <MapPin className="w-3.5 h-3.5" /> {item.distanceDisplay}
                    </span>
                    <span className="text-amber-600 font-bold">★ {item.rating}</span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{item.address}</p>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-slate-50 p-2.5 rounded-xl text-slate-600">
                    <div>Capacity: <strong>{item.capacityPerRoom}</strong></div>
                    <div>Rooms: <strong>{item.availableRooms} Available</strong></div>
                    <div className="col-span-2">Timings: <strong>{item.timings}</strong></div>
                  </div>

                  {/* Facilities tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.facilities.map((fac, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        ✓ {fac}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href={`tel:${item.contact}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                  >
                    <Phone className="w-3.5 h-3.5" /> {item.contact}
                  </a>

                  <button
                    onClick={() => setInquiryItem(item)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition"
                  >
                    Book / Reserve Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FOOD NEAR HOSPITAL */}
      {subTab === 'food' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Food Preference:</span>
              <div className="flex gap-1.5">
                {['All', 'Vegetarian', 'Jain', 'Non-Veg'].map(diet => (
                  <button
                    key={diet}
                    onClick={() => setDietFilter(diet)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                      dietFilter === diet ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 font-medium">Max Meal Price:</span>
              <span className="font-bold text-slate-900">₹{maxFoodPrice}</span>
              <input
                type="range"
                min="40"
                max="300"
                step="10"
                value={maxFoodPrice}
                onChange={(e) => setMaxFoodPrice(parseInt(e.target.value, 10))}
                className="w-28 accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Food Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFoodPlaces.map(food => (
              <div
                key={food.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative rounded-2xl overflow-hidden h-40 mb-3">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900">
                      {food.type}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md">
                      ~₹{food.approxMealPrice} <span className="font-normal text-[10px]">/ meal</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {food.distanceDisplay}
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      {food.hours}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mt-1">{food.name}</h3>
                  <p className="text-xs text-emerald-800 font-semibold">{food.diet}</p>

                  {/* Specialties */}
                  <div className="mt-3 bg-slate-50 p-3 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Recommended for Attendants:</span>
                    <div className="space-y-0.5">
                      {food.specialties?.map((spec, i) => (
                        <span key={i} className="text-xs text-slate-700 block">• {spec}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <a
                    href={`tel:${food.phone}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Canteen
                  </a>

                  {food.deliveryAvailable ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      ✓ Gate Delivery Available
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">Dine-in / Takeaway</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {inquiryItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            {!inquirySuccess ? (
              <form onSubmit={handleInquiry} className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase text-emerald-700">Room Reservation Request</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{inquiryItem.name}</h3>
                  <p className="text-xs text-slate-500">Rate: ₹{inquiryItem.pricePerDay}/day • Distance: {inquiryItem.distanceDisplay}</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Attendant Name:</label>
                  <input
                    type="text"
                    required
                    defaultValue="Rahul Sharma (Attendant)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone:</label>
                  <input
                    type="tel"
                    required
                    defaultValue="9876543210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setInquiryItem(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm"
                  >
                    Confirm Booking Request
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-lg text-slate-900">Reservation Request Dispatched!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  The facility manager at {inquiryItem.name} will call you shortly on 9876543210 to hold your room.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
