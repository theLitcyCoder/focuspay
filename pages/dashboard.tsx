'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold"><a href="/">FocusPay</a></h1>
        <nav className="space-x-6 flex items-center">
          <a href="/auth/signin" className="hover:underline">Login</a>
          <a href="/auth/signup" className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-200">Get Started</a>
          <DarkModeToggle />
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center py-24 px-6">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">Boost Your Online Presence Effortlessly</h2>
        <p className="text-lg md:text-2xl mb-10 max-w-2xl">
          Earn rewards for viewing links. Drive traffic and get real user engagement with FocusPay.
        </p>
        <div className="space-x-4">
          <a
          href="/auth/signup?role=Advertiser"
          className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-200"
        >
          Start Advertising
        </a>
          <a href="/auth/signup?role=Tasker" className="border bg-white text-purple-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-200">
             Start Earning
          </a>
        </div>
      </main>

      {/* How It Works */}
      <section className="px-6 py-20 text-center bg-white/10 backdrop-blur-sm">
        <h3 className="text-3xl font-bold mb-6">How FocusPay Works</h3>
        <p className="max-w-2xl mx-auto text-lg mb-10">
          Advertisers create campaigns with links. Taskers view those links for a set time and get paid per click. Real users. Real engagement. Simple.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <div className="bg-white/10 p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h4 className="text-xl font-semibold mb-2">Create Campaigns</h4>
            <p>Create link campaigns in seconds and get real traffic.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h4 className="text-xl font-semibold mb-2">Earn Per Click</h4>
            <p>Taskers are rewarded for each valid interaction on advertiser links.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h4 className="text-xl font-semibold mb-2">Track Results</h4>
            <p>Advertisers get insights, clicks, and campaign performance in real-time.</p>
          </div>
        </div>
      </section>

      {/* For Advertisers */}
      <section className="px-6 py-20 text-left md:text-center bg-purple-800/20">
        <h3 className="text-3xl font-bold mb-6">Advertisers: Get Real Engagement</h3>
        <p className="max-w-3xl mx-auto text-lg mb-10">
          FocusPay helps you drive real traffic from real people. Improve your search rankings, product visibility, or content engagement.
        </p>
        <a
          href="/auth/signup?role=Advertiser"
          className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-200"
        >
          Start Advertising
        </a>
      </section>

      {/* For Taskers */}
      <section className="px-6 py-20 text-left md:text-center bg-blue-800/20">
        <h3 className="text-3xl font-bold mb-6">Taskers: Earn Money Online</h3>
        <p className="max-w-3xl mx-auto text-lg mb-10">
          View links, stay focused, and earn rewards. With flexible hours and fast payouts, FocusPay is the easiest way to monetize your time online.
        </p>
        <a
          href="/auth/signup?role=Tasker"
          className="inline-block bg-white text-purple-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-200"
        >
          Start Earning
        </a>
      </section>

      {/* Why FocusPay */}
      <section className="px-6 py-20 text-center bg-white/10 backdrop-blur-sm">
        <h3 className="text-3xl font-bold mb-6">Why Choose FocusPay?</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-white/10 rounded-xl shadow-lg">
            <h4 className="text-xl font-semibold mb-2">Real-Time Stats</h4>
            <p>Both advertisers and taskers can track performance and earnings live.</p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl shadow-lg">
            <h4 className="text-xl font-semibold mb-2">Secure & Fair</h4>
            <p>Every click is verified. Fair payouts. No bots. No fraud.</p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl shadow-lg">
            <h4 className="text-xl font-semibold mb-2">Global Community</h4>
            <p>Join a fast-growing community of earners and advertisers worldwide.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-white/20">
        <p className="text-sm">&copy; 2025 FocusPay. All rights reserved.</p>
      </footer>
    </div>
  );
}
