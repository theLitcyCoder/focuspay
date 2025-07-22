'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useRequireRole } from '@/hooks/useProtectedRoute';
import { TrashIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

export default function AdvertiserDashboard() {
  const router = useRouter();
  const { authorized, checking } = useRequireRole('advertiser');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const user = session.user;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, email, role')
        .eq('id', user.id)
        .single();

      if (!error) setProfile(profile);

      const { data: campaigns, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id);

      if (!campaignError) setCampaigns(campaigns);
    };

    if (authorized && !checking) {
      fetchData();
    }
  }, [authorized, checking]);

  const deleteCampaign = async (id: string) => {
    setDeleting(id);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return;

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('campaign_id', id)
      .eq('user_id', session.user.id);

    if (error) {
      toast.error(`Failed to delete campaign: ${error.message}`);
    } else {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast.success('Campaign deleted.');
    }

    setDeleting(null);
  };

  const handleDelete = (id: string) => {
    toast((t) => (
      <div className="text-white">
        <p>Are you sure you want to delete this campaign?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 px-4 py-1 rounded text-black"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteCampaign(id);
            }}
            className="bg-red-600 px-4 py-1 rounded text-white"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      style: {
        background: '#3a61d5',
        color: '#fff',
      },
    });
  };

  if (checking || !authorized) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white">
        <p className="text-xl">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <header className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Advertiser Dashboard 🎯</h1>
          <button
            onClick={() => router.push('/advertiser/create')}
            className="mb-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
          >
            + Create Campaign
          </button>
        </div>
        {profile && (
          <div className="text-right">
            <p className="text-lg font-medium">{profile.full_name}</p>
            <p className="text-sm">{profile.email}</p>
            <p className="text-sm text-gray-400">{profile.role}</p>
          </div>
        )}
      </header>

      <main className="dark:bg-gray-950 p-6 rounded">
        {campaigns.length === 0 ? (
          <p>No campaigns yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <div key={campaign.campaign_id} className="p-4 border rounded bg-white dark:bg-gray-800">
                <h2 className="text-lg font-semibold">{campaign.title}</h2>
                <p>Type: {campaign.type} | Status: {campaign.status}</p>
                <p>Clicks: {campaign.clicks ?? 0} | Budget: ${campaign.budget}</p>
                <p>Reward: ${campaign.reward}</p>
                <div className="mt-2">
                  <a
                    href={campaign.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-700 dark:text-sky-300 underline text-sm"
                  >
                    Visit URL
                  </a>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleDelete(campaign.campaign_id)}
                    disabled={deleting === campaign.campaign_id}
                    className="flex items-center gap-2 px-3 py-1 cursor-pointer text-red-600 border border-red-600 dark:border-red-400 rounded hover:bg-red-600/20 disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                    {deleting === campaign.campaign_id? 'Deleting...' : 'Delete'}
                  </button>
                  <button 
                    onClick={() => router.push(`/advertiser/edit-campaign/${campaign.campaign_id}`)}
                    className="flex items-center gap-2 px-3 py-1 cursor-pointer border text-white border-gray-700 dark:border-white rounded hover:bg-gray-500/20"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
