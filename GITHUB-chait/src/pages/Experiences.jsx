import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExperienceForm from '../components/experiences/ExperienceForm';
import TacticalMap from '../components/experiences/TacticalMap';
import ExperienceFeed from '../components/experiences/ExperienceFeed';

const Experiences = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userId: 'user1',
      userName: 'Aaryan Sharma',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aaryan',
      trekName: 'Harishchandragad Trek',
      location: 'Ahmednagar, Maharashtra',
      region: 'Sahyadri',
      coords: [19.2319, 73.7744],
      rating: 5,
      date: '2026-03-15',
      story: 'The Konkan Kada was breathtaking. We stayed in the caves overnight and the sunrise was magical.',
      photos: [
        'https://images.unsplash.com/photo-1626014303757-646c00fcc716?w=800&q=80',
        'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&q=80'
      ]
    },
    {
      id: 2,
      userId: 'user2',
      userName: 'Priya Patel',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      trekName: 'Rajmachi Fort',
      location: 'Lonavala, Maharashtra',
      region: 'Sahyadri',
      coords: [18.8252, 73.3961],
      rating: 4,
      date: '2026-02-10',
      story: 'Cloud cover everywhere during monsoon. The fireflies at night were the highlight.',
      photos: [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
        'https://images.unsplash.com/photo-1578351502476-068b5779c46d?w=800&q=80'
      ]
    },
    {
      id: 3,
      userId: 'user3',
      userName: 'Rohan Gupta',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
      trekName: 'Kalsubai Peak',
      location: 'Igatpuri, Maharashtra',
      region: 'Sahyadri',
      coords: [19.6011, 73.7094],
      rating: 5,
      date: '2026-01-20',
      story: 'The highest peak in Maharashtra. Exhausting but the view from the top is worth every drop of sweat.',
      photos: [
        'https://images.unsplash.com/photo-1605140882162-d2905123545c?w=800&q=80'
      ]
    },
    {
      id: 4,
      userId: 'user4',
      userName: 'Sneha Rao',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
      trekName: 'Visapur Fort',
      location: 'Pune, Maharashtra',
      region: 'Sahyadri',
      coords: [18.7214, 73.4795],
      rating: 4,
      date: '2025-12-05',
      story: 'Walking up the stone stairs through the waterfall was an incredible experience.',
      photos: [
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80'
      ]
    },
    {
      id: 5,
      userId: 'user5',
      userName: 'Vikram Singh',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
      trekName: 'Hampta Pass',
      location: 'Manali, Himachal Pradesh',
      region: 'North India',
      coords: [32.2289, 77.3653],
      rating: 5,
      date: '2026-06-12',
      story: 'The transition from the lush green Kullu valley to the barren Spiti landscape is just mind-blowing.',
      photos: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'
      ]
    },
    {
      id: 6,
      userId: 'user6',
      userName: 'Ananya Das',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
      trekName: 'Roopkund Lake',
      location: 'Chamoli, Uttarakhand',
      region: 'North India',
      coords: [30.2633, 79.7314],
      rating: 5,
      date: '2025-09-18',
      story: 'Skeleton lake lived up to the mystery. The alpine meadows (Ali Bugyal) were perfectly serene.',
      photos: [
        'https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=800&q=80',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'
      ]
    },
    {
      id: 7,
      userId: 'user7',
      userName: 'Kabir Malik',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir',
      trekName: 'Valley of Flowers',
      location: 'Joshimath, Uttarakhand',
      region: 'North India',
      coords: [30.7280, 79.6053],
      rating: 4,
      date: '2025-08-10',
      story: 'A botanical paradise. Every corner had a different species of flower blooming.',
      photos: [
        'https://images.unsplash.com/photo-1472396961695-1ad223952d67?w=800&q=80'
      ]
    },
    {
      id: 8,
      userId: 'user8',
      userName: 'Meera Nair',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera',
      trekName: 'Beas Kund',
      location: 'Manali, Himachal Pradesh',
      region: 'North India',
      coords: [32.3683, 77.1000],
      rating: 4,
      date: '2025-07-05',
      story: 'Short but rewarding trek. The source of the Beas river is a beautiful glacial lake.',
      photos: [
        'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80'
      ]
    },
    {
      id: 9,
      userId: 'user9',
      userName: 'Tsering Lampa',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tsering',
      trekName: 'Goechala Trek',
      location: 'West Sikkim',
      region: 'North East',
      coords: [27.6000, 88.1833],
      rating: 5,
      date: '2026-04-05',
      story: 'Waking up to the view of Kanchenjunga from Viewpoint 1 was a divine experience.',
      photos: [
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80'
      ]
    },
    {
      id: 10,
      userId: 'user10',
      userName: 'Amit Debbarma',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
      trekName: 'Dzukou Valley',
      location: 'Kohima, Nagaland',
      region: 'North East',
      coords: [25.5900, 94.0600],
      rating: 5,
      date: '2026-06-20',
      story: 'The lilies were in full bloom. The rolling green hills look like they belong in a fairytale.',
      photos: [
        'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800&q=80'
      ]
    },
    {
      id: 11,
      userId: 'user11',
      userName: 'Sariqa Sangma',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sariqa',
      trekName: 'Double Decker Living Root Bridge',
      location: 'Cherrapunji, Meghalaya',
      region: 'North East',
      coords: [25.2505, 91.6661],
      rating: 5,
      date: '2025-11-15',
      story: '3500 steps down and back up. Hard on the knees but witnessing bio-engineering at its best.',
      photos: [
        'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80'
      ]
    },
    {
      id: 12,
      userId: 'user12',
      userName: 'Joshua Khonglam',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joshua',
      trekName: 'David Scott Trail',
      location: 'Mawphlang, Meghalaya',
      region: 'North East',
      coords: [25.4526, 91.7588],
      rating: 4,
      date: '2025-10-30',
      story: 'A walk through history. The Mawphlang sacred grove at the start set a mysterious tone.',
      photos: [
        'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80'
      ]
    }
  ]);

  const handleAddReview = (newReview) => {
    setReviews([
      {
        ...newReview,
        id: Date.now(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newReview.userName}`,
      },
      ...reviews
    ]);
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 md:px-8 space-y-12 max-w-7xl mx-auto">
      <header className="space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-headline italic text-primary text-glow"
        >
          TREK NEXUS
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/60 max-w-2xl font-body"
        >
          A tactical portal for trekkers to share field reconnaissance, route experiences, and visual data from the world's most challenging terrains.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Map and Form */}
        <div className="xl:col-span-4 space-y-8">
          <ExperienceForm onSubmit={handleAddReview} />
          <TacticalMap reviews={reviews} />
        </div>

        {/* Right Side: Feed */}
        <div className="xl:col-span-8">
          <ExperienceFeed reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default Experiences;
